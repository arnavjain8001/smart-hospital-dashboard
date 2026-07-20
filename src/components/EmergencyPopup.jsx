import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  BellRing, 
  Heart, 
  Percent, 
  Thermometer, 
  ShieldAlert, 
  Check, 
  Radio,
  Volume2,
  VolumeX
} from "lucide-react";

export default function EmergencyPopup({ patient, onAcknowledge, onResolve }) {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [espButtonStatus, setEspButtonStatus] = useState("Waiting"); // Waiting, Pressed
  const [acknowledged, setAcknowledged] = useState(false);

  // Live Timer for emergency duration
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAcknowledge = () => {
    setAcknowledged(true);
    onAcknowledge && onAcknowledge();
  };

  const handleEspTriggerSimulate = () => {
    setEspButtonStatus("Pressed");
    // Auto resolve 1 second after physical button press simulation
    setTimeout(() => {
      onResolve && onResolve();
    }, 1000);
  };

  if (!patient) return null;

  return (
    <div className="emergency-overlay">
      <div className="emergency-glow-background" style={{ animationDuration: acknowledged ? "3s" : "1.2s" }} />
      
      <div className="glass-panel emergency-alert-modal">
        {/* Mute alarm button */}
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            background: "transparent",
            border: "1px solid var(--border-glass)",
            color: "var(--text-main)",
            padding: "0.5rem",
            borderRadius: "8px",
            cursor: "pointer"
          }}
          title={isMuted ? "Unmute Alarm Sound" : "Mute Alarm Sound"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-critical" style={{ animation: "heartBeat 1s infinite" }} />}
        </button>

        <div className="emergency-modal-header">
          <div className="alarm-icon-container" style={{ animationPlayState: acknowledged ? "paused" : "running" }}>
            <BellRing size={32} />
          </div>
          <div className="badge-live-iot" style={{ background: "var(--color-critical)", marginTop: "0.5rem" }}>
            <Radio size={12} style={{ animation: "pulse 1s infinite" }} />
            <span>CRITICAL CODE RED ALERT</span>
          </div>
          <h2 className="emergency-title" style={{ color: acknowledged ? "var(--color-warning)" : "var(--color-critical)" }}>
            {acknowledged ? "EMERGENCY ACKNOWLEDGED" : "PATIENT CRITICAL LIMIT EXCEEDED"}
          </h2>
          <div className="emergency-timer" style={{ 
            backgroundColor: acknowledged ? "rgba(245, 158, 11, 0.12)" : "rgba(239, 68, 68, 0.12)",
            color: acknowledged ? "var(--color-warning)" : "var(--color-critical)",
            borderColor: acknowledged ? "rgba(245, 158, 11, 0.2)" : "rgba(239, 68, 68, 0.2)"
          }}>
            ELAPSED TIME: {formatDuration(seconds)}
          </div>
        </div>

        {/* Patient Location and details */}
        <div className="emergency-patient-info">
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "800" }}>{patient.name}</h3>
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.2rem" }}>
              Patient ID: <span style={{ fontFamily: "monospace", color: "var(--text-main)" }}>{patient.id}</span>
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Age / Gender: <span style={{ color: "var(--text-main)" }}>{patient.age} / {patient.gender}</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="room-bed-badge" style={{ fontSize: "0.9rem", padding: "4px 8px" }}>
              {patient.room} | {patient.bed}
            </span>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
              Alert Triggered: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Real-time critical vitals */}
        <div className="emergency-vitals-grid">
          {/* Heart Rate */}
          <div className="vital-reading critical" style={{ padding: "1rem" }}>
            <span className="vital-label">Heart Rate</span>
            <div className="vital-value-unit">
              <Heart size={16} className="text-critical" />
              <span className="vital-number" style={{ fontSize: "2rem" }}>{patient.heartRate}</span>
              <span className="vital-unit">bpm</span>
            </div>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Limit &gt; 110 or &lt; 50
            </span>
          </div>

          {/* SpO2 */}
          <div className="vital-reading critical" style={{ padding: "1rem" }}>
            <span className="vital-label">SpO₂ Level</span>
            <div className="vital-value-unit">
              <Percent size={14} className="text-critical" />
              <span className="vital-number" style={{ fontSize: "2rem" }}>{patient.spo2}</span>
              <span className="vital-unit">%</span>
            </div>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Limit &lt; 92%
            </span>
          </div>

          {/* Temp */}
          <div className="vital-reading warning" style={{ padding: "1rem" }}>
            <span className="vital-label">Temperature</span>
            <div className="vital-value-unit">
              <Thermometer size={14} className="text-warning" />
              <span className="vital-number" style={{ fontSize: "2rem" }}>{patient.temperature}</span>
              <span className="vital-unit">°F</span>
            </div>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Limit &gt; 101°F
            </span>
          </div>
        </div>

        {/* ESP32 Physical Telemetry Sync */}
        <div className="esp-status-card">
          <div>
            <span style={{ fontSize: "0.85rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Radio size={14} className="text-success" />
              ESP32 Physical IoT Gateway Status
            </span>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
              Subscribed to MQTT Topic: <code style={{ color: "var(--color-info)" }}>tele/esp32_icu101/button</code>
            </p>
          </div>
          <div 
            className={`esp-telemetry-badge ${espButtonStatus === "Pressed" ? "active" : "idle"}`}
          >
            {espButtonStatus === "Pressed" ? (
              <>
                <Check size={12} />
                <span>ESP32 Physical Button Pressed</span>
              </>
            ) : (
              <>
                <span className="status-dot warning" style={{ width: "6px", height: "6px" }} />
                <span>Awaiting Hardware Button...</span>
              </>
            )}
          </div>
        </div>

        {/* Action button panel */}
        <div className="emergency-actions">
          <button 
            className="btn-emergency acknowledge" 
            onClick={handleAcknowledge}
            disabled={acknowledged}
            style={{ opacity: acknowledged ? 0.6 : 1 }}
          >
            <ShieldAlert size={16} />
            {acknowledged ? "Nurse Acknowledged" : "Acknowledge Alert (Mute)"}
          </button>
          
          <button 
            className="btn-emergency resolve" 
            onClick={onResolve}
          >
            <Check size={16} />
            Resolve Emergency (Central Console)
          </button>
        </div>

        {/* Hardware button simulation overlay */}
        <div style={{ display: "flex", justifyContent: "center", borderTop: "1px dashed var(--border-glass)", paddingTop: "1rem" }}>
          <button 
            onClick={handleEspTriggerSimulate}
            disabled={espButtonStatus === "Pressed"}
            style={{
              fontSize: "0.72rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border-glass-light)",
              padding: "0.4rem 0.85rem",
              borderRadius: "6px",
              color: "var(--text-muted)",
              cursor: "pointer"
            }}
          >
            Simulate Physical ESP32 Emergency Button Press
          </button>
        </div>
      </div>
    </div>
  );
}
