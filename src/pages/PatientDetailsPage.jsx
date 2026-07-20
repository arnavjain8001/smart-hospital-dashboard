import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, 
  Percent, 
  Thermometer, 
  User, 
  Stethoscope, 
  Activity, 
  FileText, 
  AlertTriangle, 
  Calendar, 
  ChevronLeft,
  Mail,
  Phone,
  PlusCircle,
  FileCheck
} from "lucide-react";

export default function PatientDetailsPage({ patients, activePatientId, onBack, onAddNotes }) {
  const patient = patients.find(p => p.id === activePatientId) || patients[0];
  const [medicalNotes, setMedicalNotes] = useState(patient ? patient.medicalNotes : "");
  const [savedStatus, setSavedStatus] = useState("");
  
  // Interactive Tooltip State
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, val: 0, label: "", unit: "", time: "" });

  // Refs for Canvases
  const ecgCanvasRef = useRef(null);
  const ppgCanvasRef = useRef(null);
  const tempCanvasRef = useRef(null);

  // Simulation parameters for continuous waves
  const ecgIndexRef = useRef(0);
  const ppgIndexRef = useRef(0);
  const tempIndexRef = useRef(0);
  const ecgPointsRef = useRef([]);
  const ppgPointsRef = useRef([]);
  const tempPointsRef = useRef([]);

  // Form note save handler
  const handleSaveNotes = (e) => {
    e.preventDefault();
    if (patient) {
      patient.medicalNotes = medicalNotes;
      onAddNotes && onAddNotes(patient.id, medicalNotes);
      setSavedStatus("Clinical notes updated successfully.");
      setTimeout(() => setSavedStatus(""), 3000);
    }
  };

  useEffect(() => {
    if (patient) {
      setMedicalNotes(patient.medicalNotes);
    }
  }, [activePatientId]);

  // Tooltip tracking mouse move handler
  const handleMouseMove = (e, canvasType) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    let val = 0;
    let label = "";
    let unit = "";
    
    if (canvasType === "ecg") {
      val = patient.heartRate;
      label = "Heart Rate";
      unit = "bpm";
    } else if (canvasType === "ppg") {
      val = patient.spo2;
      label = "Oxygen Saturation";
      unit = "%";
    } else if (canvasType === "temp") {
      val = patient.temperature;
      label = "Body Temp";
      unit = "°F";
    }
    
    // Add realistic relative vertical grid deviation to value
    const percentY = (rect.height - y) / rect.height;
    if (canvasType === "ecg") {
      val = Math.round(val + (percentY - 0.5) * 20);
    } else if (canvasType === "ppg") {
      val = Math.round(val + (percentY - 0.5) * 4);
      if (val > 100) val = 100;
    } else if (canvasType === "temp") {
      val = Number((val + (percentY - 0.5) * 1.2).toFixed(1));
    }

    setTooltip({
      show: true,
      x: x + 15,
      y: y - 45,
      val: val,
      label: label,
      unit: unit,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };

  // Real-time canvas drawing loops (Continuous scrolling right-to-left waves)
  useEffect(() => {
    let animationFrameId;
    
    // Canvas context handles
    const ecgCanvas = ecgCanvasRef.current;
    const ppgCanvas = ppgCanvasRef.current;
    const tempCanvas = tempCanvasRef.current;
    
    if (!ecgCanvas || !ppgCanvas || !tempCanvas) return;
    
    const ecgCtx = ecgCanvas.getContext("2d");
    const ppgCtx = ppgCanvas.getContext("2d");
    const tempCtx = tempCanvas.getContext("2d");

    // Configure high resolution
    const width = ecgCanvas.clientWidth;
    const height = ecgCanvas.clientHeight;
    ecgCanvas.width = width;
    ecgCanvas.height = height;
    ppgCanvas.width = width;
    ppgCanvas.height = height;
    tempCanvas.width = width;
    tempCanvas.height = height;

    // Fill initial point buffers if empty, or reset to standard width
    if (ecgPointsRef.current.length !== width) {
      ecgPointsRef.current = new Array(width).fill(height / 2);
      ppgPointsRef.current = new Array(width).fill(height / 2);
      tempPointsRef.current = new Array(width).fill(height / 2);
    }

    const drawGrid = (ctx, w, h) => {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      // Vertical grid lines
      for (let x = 0; x < w; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      // Horizontal grid lines
      for (let y = 0; y < h; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    };

    // ECG (Heart Rate) wave generator
    const getEcgSample = (phase) => {
      if (phase < 0.1) return 0;
      if (phase < 0.15) {
        const pPhase = (phase - 0.1) / 0.05;
        return Math.sin(pPhase * Math.PI) * 0.12;
      }
      if (phase < 0.18) return 0;
      if (phase < 0.21) {
        const qPhase = (phase - 0.18) / 0.03;
        return -qPhase * 0.15;
      }
      if (phase < 0.25) {
        const rPhase = (phase - 0.21) / 0.04;
        return -0.15 + rPhase * 1.35;
      }
      if (phase < 0.29) {
        const sPhase = (phase - 0.25) / 0.04;
        return 1.20 - sPhase * 1.6;
      }
      if (phase < 0.33) {
        const stPhase = (phase - 0.29) / 0.04;
        return -0.4 + stPhase * 0.4;
      }
      if (phase < 0.45) {
        const tPhase = (phase - 0.33) / 0.12;
        return Math.sin(tPhase * Math.PI) * 0.25;
      }
      return 0;
    };

    // SpO2 PPG waveform generator
    const getPpgSample = (phase) => {
      if (phase < 0.4) {
        const upPhase = phase / 0.4;
        return Math.sin(upPhase * Math.PI / 2) * 0.75;
      }
      if (phase < 0.55) {
        const dipPhase = (phase - 0.4) / 0.15;
        return 0.75 - Math.sin(dipPhase * Math.PI / 2) * 0.2;
      }
      if (phase < 0.7) {
        const notchPhase = (phase - 0.55) / 0.15;
        return 0.55 + Math.sin(notchPhase * Math.PI) * 0.08;
      }
      const downPhase = (phase - 0.7) / 0.3;
      return 0.55 - downPhase * 0.55;
    };

    const render = () => {
      if (!ecgCtx || !ppgCtx || !tempCtx) return;

      // Clean Canvas backings
      ecgCtx.fillStyle = "#020617";
      ecgCtx.fillRect(0, 0, width, height);
      drawGrid(ecgCtx, width, height);

      ppgCtx.fillStyle = "#020617";
      ppgCtx.fillRect(0, 0, width, height);
      drawGrid(ppgCtx, width, height);

      tempCtx.fillStyle = "#020617";
      tempCtx.fillRect(0, 0, width, height);
      drawGrid(tempCtx, width, height);

      // Calculations based on live patient vitals
      const hr = patient.heartRate || 75;
      const bpmFrac = 60 / hr; // Seconds per beat
      const totalFramesPerBeat = bpmFrac * 60; // 60fps refresh rate

      // 1. ECG Scrolling Wave
      ecgIndexRef.current = (ecgIndexRef.current + 2.0) % totalFramesPerBeat;
      const ecgCyclePhase = ecgIndexRef.current / totalFramesPerBeat;
      const ecgVal = getEcgSample(ecgCyclePhase);
      const ecgY = (height / 2) - (ecgVal * (height * 0.42));
      ecgPointsRef.current.push(ecgY);
      ecgPointsRef.current.shift();

      // Draw ECG axis ticks
      ecgCtx.fillStyle = "rgba(148, 163, 184, 0.4)";
      ecgCtx.font = "9px monospace";
      ecgCtx.fillText("1.5 mV", 8, 16);
      ecgCtx.fillText("0.0 mV", 8, height / 2 + 3);
      ecgCtx.fillText("-0.5 mV", 8, height - 8);

      // Draw ECG Line
      ecgCtx.strokeStyle = "#16A34A"; // Premium Success Green
      ecgCtx.lineWidth = 2.0;
      ecgCtx.shadowBlur = 4;
      ecgCtx.shadowColor = "#16A34A";
      ecgCtx.beginPath();
      ecgCtx.moveTo(0, ecgPointsRef.current[0]);
      for (let x = 1; x < width; x++) {
        ecgCtx.lineTo(x, ecgPointsRef.current[x]);
      }
      ecgCtx.stroke();
      ecgCtx.shadowBlur = 0; // reset shadow for other drawings

      // 2. PPG (SpO2) Scrolling Wave
      ppgIndexRef.current = (ppgIndexRef.current + 2.0) % totalFramesPerBeat;
      const ppgCyclePhase = ppgIndexRef.current / totalFramesPerBeat;
      const ppgVal = getPpgSample(ppgCyclePhase);
      const ppgY = (height / 2) - (ppgVal * (height * 0.3)) + 10;
      ppgPointsRef.current.push(ppgY);
      ppgPointsRef.current.shift();

      // Draw SpO2 axis ticks
      ppgCtx.fillStyle = "rgba(148, 163, 184, 0.4)";
      ppgCtx.font = "9px monospace";
      ppgCtx.fillText("100 %", 8, 16);
      ppgCtx.fillText("95 %", 8, height / 2 + 3);
      ppgCtx.fillText("90 %", 8, height - 8);

      // Draw PPG Line
      ppgCtx.strokeStyle = "#0284C7"; // Premium Info Cyan
      ppgCtx.lineWidth = 1.8;
      ppgCtx.shadowBlur = 4;
      ppgCtx.shadowColor = "#0284C7";
      ppgCtx.beginPath();
      ppgCtx.moveTo(0, ppgPointsRef.current[0]);
      for (let x = 1; x < width; x++) {
        ppgCtx.lineTo(x, ppgPointsRef.current[x]);
      }
      ppgCtx.stroke();
      ppgCtx.shadowBlur = 0;

      // 3. Temperature Scrolling Trend
      tempIndexRef.current = (tempIndexRef.current + 0.1) % width;
      const tempVal = Math.sin(tempIndexRef.current * 0.05) * 0.12 + ((patient.temperature - 98.6) * 0.3);
      const tempY = (height / 2) - (tempVal * (height * 0.3));
      tempPointsRef.current.push(tempY);
      tempPointsRef.current.shift();

      // Draw Temperature axis ticks
      tempCtx.fillStyle = "rgba(148, 163, 184, 0.4)";
      tempCtx.font = "9px monospace";
      tempCtx.fillText(`${(patient.temperature + 1.2).toFixed(1)} °F`, 8, 16);
      tempCtx.fillText(`${patient.temperature.toFixed(1)} °F`, 8, height / 2 + 3);
      tempCtx.fillText(`${(patient.temperature - 1.2).toFixed(1)} °F`, 8, height - 8);

      // Draw Temp Line
      tempCtx.strokeStyle = "#F59E0B"; // Premium Warning Amber
      tempCtx.lineWidth = 1.5;
      tempCtx.shadowBlur = 3;
      tempCtx.shadowColor = "#F59E0B";
      tempCtx.beginPath();
      tempCtx.moveTo(0, tempPointsRef.current[0]);
      for (let x = 1; x < width; x++) {
        tempCtx.lineTo(x, tempPointsRef.current[x]);
      }
      tempCtx.stroke();
      tempCtx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [patient]);

  if (!patient) return <div className="page-container flex-center">Loading patient data...</div>;

  return (
    <div className="page-container" style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Back to dashboard button row */}
      <div className="flex-between mb-1">
        <button 
          className="pagination-btn" 
          onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
        >
          <ChevronLeft size={16} />
          Back to Central Monitor
        </button>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <span className="room-bed-badge" style={{ padding: "4px 10px", fontSize: "0.85rem", background: "rgba(37,99,235,0.15)", borderColor: "var(--color-primary)" }}>
            BED DIRECTORY: {patient.room} - {patient.bed}
          </span>
        </div>
      </div>

      {/* Patient Header Section */}
      <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: "800", letterSpacing: "-0.5px" }}>{patient.name}</h2>
            {patient.isLiveESP32 ? (
              <span className="badge-live-iot">Live ESP32 Feed</span>
            ) : (
              <span className="badge-demo">Demo Vitals</span>
            )}
          </div>
          <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.4rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            <span>Patient ID: <strong style={{ color: "var(--text-main)", fontFamily: "monospace" }}>{patient.id}</strong></span>
            <span>Age: <strong style={{ color: "var(--text-main)" }}>{patient.age}</strong></span>
            <span>Gender: <strong style={{ color: "var(--text-main)" }}>{patient.gender}</strong></span>
          </div>
        </div>

        {/* Current status display */}
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {/* Quick Vital Indicators */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <div style={{ textAlign: "right", borderRight: "1px solid var(--border-glass)", paddingRight: "1.25rem" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>ECG (HR)</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.15rem", color: "var(--color-success)" }}>
                <span style={{ fontSize: "1.4rem", fontWeight: "800" }}>{patient.heartRate}</span>
                <span style={{ fontSize: "0.7rem" }}>bpm</span>
              </div>
            </div>

            <div style={{ textAlign: "right", borderRight: "1px solid var(--border-glass)", paddingRight: "1.25rem" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>SPO₂</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.15rem", color: "var(--color-info)" }}>
                <span style={{ fontSize: "1.4rem", fontWeight: "800" }}>{patient.spo2}</span>
                <span style={{ fontSize: "0.7rem" }}>%</span>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>TEMP</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.15rem", color: "var(--color-warning)" }}>
                <span style={{ fontSize: "1.4rem", fontWeight: "800" }}>{patient.temperature}</span>
                <span style={{ fontSize: "0.7rem" }}>°F</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details content */}
      <div className="details-grid">
        {/* Left Side: Real-time graphs and diagnostic logs */}
        <div className="medical-waveforms">
          {/* ECG Sweep card */}
          <div className="glass-panel waveform-card">
            <div className="waveform-header">
              <div className="waveform-title-row text-success">
                <Activity size={16} />
                <span>ELECTROCARDIOGRAM (ECG / II)</span>
              </div>
              <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--text-muted)" }}>
                SWEEP SPEED: 25 mm/s | HR: {patient.heartRate} bpm
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <canvas 
                ref={ecgCanvasRef} 
                className="waveform-canvas" 
                onMouseMove={(e) => handleMouseMove(e, "ecg")}
                onMouseLeave={handleMouseLeave}
              />
              {tooltip.show && tooltip.label === "Heart Rate" && (
                <div 
                  className="glass-panel" 
                  style={{
                    position: "absolute",
                    left: `${tooltip.x}px`,
                    top: `${tooltip.y}px`,
                    pointerEvents: "none",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    zIndex: 50,
                    background: "var(--bg-popup)",
                    border: "1px solid var(--border-glass)",
                    boxShadow: "var(--shadow-glass)",
                    color: "var(--text-main)"
                  }}
                >
                  <div style={{ fontWeight: "700", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <span className="status-dot stable" style={{ width: "6px", height: "6px" }} />
                    {tooltip.label}: {tooltip.val} {tooltip.unit}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "2px" }}>Time: {tooltip.time}</div>
                </div>
              )}
            </div>
          </div>

          {/* SpO2 PPG Sweep card */}
          <div className="glass-panel waveform-card">
            <div className="waveform-header">
              <div className="waveform-title-row text-info">
                <Heart size={16} />
                <span>PLETHYSMOGRAM (PPG / SpO₂)</span>
              </div>
              <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--text-muted)" }}>
                GAIN: AUTO | SpO₂: {patient.spo2}%
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <canvas 
                ref={ppgCanvasRef} 
                className="waveform-canvas" 
                onMouseMove={(e) => handleMouseMove(e, "ppg")}
                onMouseLeave={handleMouseLeave}
              />
              {tooltip.show && tooltip.label === "Oxygen Saturation" && (
                <div 
                  className="glass-panel" 
                  style={{
                    position: "absolute",
                    left: `${tooltip.x}px`,
                    top: `${tooltip.y}px`,
                    pointerEvents: "none",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    zIndex: 50,
                    background: "var(--bg-popup)",
                    border: "1px solid var(--border-glass)",
                    boxShadow: "var(--shadow-glass)",
                    color: "var(--text-main)"
                  }}
                >
                  <div style={{ fontWeight: "700", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <span className="status-dot stable" style={{ width: "6px", height: "6px", backgroundColor: "var(--color-info)" }} />
                    {tooltip.label}: {tooltip.val} {tooltip.unit}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "2px" }}>Time: {tooltip.time}</div>
                </div>
              )}
            </div>
          </div>

          {/* Temp trace card */}
          <div className="glass-panel waveform-card">
            <div className="waveform-header">
              <div className="waveform-title-row text-warning">
                <Thermometer size={16} />
                <span>TEMPERATURE TREND SYNC</span>
              </div>
              <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--text-muted)" }}>
                RESOLUTION: 0.1°F | CURRENT: {patient.temperature}°F
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <canvas 
                ref={tempCanvasRef} 
                className="waveform-canvas" 
                onMouseMove={(e) => handleMouseMove(e, "temp")}
                onMouseLeave={handleMouseLeave}
              />
              {tooltip.show && tooltip.label === "Body Temp" && (
                <div 
                  className="glass-panel" 
                  style={{
                    position: "absolute",
                    left: `${tooltip.x}px`,
                    top: `${tooltip.y}px`,
                    pointerEvents: "none",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    zIndex: 50,
                    background: "var(--bg-popup)",
                    border: "1px solid var(--border-glass)",
                    boxShadow: "var(--shadow-glass)",
                    color: "var(--text-main)"
                  }}
                >
                  <div style={{ fontWeight: "700", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <span className="status-dot stable" style={{ width: "6px", height: "6px", backgroundColor: "var(--color-warning)" }} />
                    {tooltip.label}: {tooltip.val} {tooltip.unit}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "2px" }}>Time: {tooltip.time}</div>
                </div>
              )}
            </div>
          </div>

          {/* Patient Emergency History & Clinical Log */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "1rem" }}>Emergency Incident Archives</h3>
            {patient.emergencyHistory.length === 0 ? (
              <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", textAlign: "center", padding: "1.5rem" }}>
                No clinical alarm breaches logged for this patient.
              </div>
            ) : (
              <div className="clinical-table-wrapper">
                <table className="clinical-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Timestamp</th>
                      <th>Severity</th>
                      <th>Incident Type</th>
                      <th>Duration</th>
                      <th>Outcome Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.emergencyHistory.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.date}</td>
                        <td>{item.time}</td>
                        <td>
                          <span className="bed-dot-indicator critical" style={{ fontSize: "0.68rem", padding: "2px 6px" }}>Code Red</span>
                        </td>
                        <td style={{ fontWeight: "600" }}>{item.type}</td>
                        <td style={{ fontFamily: "monospace" }}>{item.duration}</td>
                        <td className="text-success">{item.outcome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Medical metadata directories, doctor contacts, prescription notes */}
        <div className="details-right-sidebar">
          {/* Medical Summary Dossier */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.02rem", fontWeight: "700", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FileText size={16} className="text-primary" />
              Clinical Summary
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
              {patient.medicalSummary}
            </p>
          </div>

          {/* Active Medication Schedule */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.02rem", fontWeight: "700", marginBottom: "0.75rem" }}>Prescribed Pharmacotherapy</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {patient.medications.map((med, idx) => (
                <div key={idx} style={{ padding: "0.65rem 0.85rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-glass-light)", fontSize: "0.82rem" }}>
                  <div className="flex-between mb-1" style={{ fontWeight: "700" }}>
                    <span>{med.name}</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--color-primary)" }}>{med.dosage}</span>
                  </div>
                  <div className="flex-between text-muted" style={{ fontSize: "0.72rem" }}>
                    <span>{med.type}</span>
                    <span>{med.schedule}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Care Team & Doctor Card */}
          <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ fontSize: "1.02rem", fontWeight: "700" }}>Assigned Clinical Care Team</h3>
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem" }}>
              <div style={{ background: "rgba(37,99,235,0.1)", color: "var(--color-primary)", padding: "0.4rem", borderRadius: "6px" }}>
                <Stethoscope size={16} />
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", display: "block" }}>Attending Physician</span>
                <span style={{ fontWeight: "700" }}>{patient.assignedDoctor}</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem" }}>
              <div style={{ background: "rgba(6,182,212,0.1)", color: "var(--color-info)", padding: "0.4rem", borderRadius: "6px" }}>
                <User size={16} />
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", display: "block" }}>Primary Ward Nurse</span>
                <span style={{ fontWeight: "700" }}>{patient.assignedNurse}</span>
              </div>
            </div>

            {/* Doctor contact shortcut */}
            <div className="doctor-contact-card" style={{ marginTop: "0.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", width: "100%" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--color-primary)", textTransform: "uppercase" }}>Bedside Hotkey Directory</span>
                <span style={{ fontSize: "0.85rem", fontWeight: "700" }}>{patient.assignedDoctor}</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  <a href={`tel:+15559021234`} style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Phone size={11} />
                    +1 (555) 902-1234
                  </a>
                  <a href={`mailto:s.jenkins@hospital.med`} style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Mail size={11} />
                    s.jenkins@hospital.med
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Notes Input */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.02rem", fontWeight: "700", marginBottom: "0.75rem" }}>Clinical Diagnostics Notes</h3>
            <form onSubmit={handleSaveNotes}>
              <textarea 
                className="form-textarea" 
                rows="4" 
                placeholder="Enter nursing logs, medical changes, patient symptom records..." 
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                style={{ fontSize: "0.82rem", resize: "none" }}
              />
              <button 
                type="submit" 
                className="btn-emergency resolve"
                style={{ marginTop: "0.75rem", padding: "0.5rem 1rem", fontSize: "0.82rem", width: "100%" }}
              >
                Save Notes
              </button>
            </form>
            {savedStatus && (
              <p style={{ color: "var(--color-success)", fontSize: "0.75rem", marginTop: "0.5rem", textAlign: "center", fontWeight: "600" }}>
                {savedStatus}
              </p>
            )}
          </div>

          {/* Previous Reports Archive */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.02rem", fontWeight: "700", marginBottom: "0.75rem" }}>Historical Reports</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {patient.previousReports && patient.previousReports.map((report, idx) => (
                <div key={idx} className="flex-between" style={{ padding: "0.5rem", borderBottom: "1px solid var(--border-glass-light)", fontSize: "0.8rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FileCheck size={14} className="text-primary" />
                    <div>
                      <span style={{ fontWeight: "600", display: "block" }}>{report.title}</span>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{report.date} • {report.doctor}</span>
                    </div>
                  </div>
                  <span 
                    style={{ fontSize: "0.7rem", color: "var(--color-primary)", cursor: "pointer", fontWeight: "700" }}
                    onClick={() => alert(`Downloading Document: ${report.id}`)}
                  >
                    PDF
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
