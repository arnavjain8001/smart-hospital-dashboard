import React, { useState } from "react";
import StatsGrid from "../components/StatsGrid";
import PatientCard from "../components/PatientCard";
import { Radio, AlertTriangle, ShieldCheck, UserCheck, Flame, Layers } from "lucide-react";
import { mockDevices } from "../mockData";

export default function Dashboard({ patients, onSelectPatient, recentHistory, activeCriticalPatient }) {
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredPatients = patients.filter(patient => {
    if (filterStatus === "All") return true;
    return patient.status === filterStatus;
  });

  // Separate Live ESP32 Patient from Demo Patients
  const livePatient = patients.find(p => p.isLiveESP32);
  const demoPatients = filteredPatients.filter(p => !p.isLiveESP32);

  return (
    <div className="page-container" style={{ animation: "fadeIn 0.4s ease" }}>
      {/* Top Center Stats Panel */}
      <StatsGrid patients={patients} devices={mockDevices} />

      {/* Main Grid: Left Monitoring channels, Right Active Alerts Feed */}
      <div className="details-grid">
        {/* Left Side: Live Patient Channels */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="flex-between">
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Layers size={18} className="text-primary" />
              <h2 className="section-title">Telemetry Channels</h2>
            </div>
            
            {/* Filter buttons */}
            <div className="flex-gap" style={{ background: "rgba(255,255,255,0.03)", padding: "4px", borderRadius: "8px", border: "1px solid var(--border-glass-light)" }}>
              {["All", "Stable", "Warning", "Critical"].map((status) => (
                <button
                  key={status}
                  className="pagination-btn"
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: "4px 10px",
                    fontSize: "0.75rem",
                    border: "none",
                    background: filterStatus === status ? "var(--color-primary)" : "transparent",
                    color: filterStatus === status ? "white" : "var(--text-muted)"
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Live Patient Card Section (Highlighted) */}
          {livePatient && (filterStatus === "All" || livePatient.status === filterStatus) && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>
                <span className="status-dot stable" style={{ width: "6px", height: "6px" }} />
                Hardware Gateway Feed
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
                <PatientCard patient={livePatient} onClick={onSelectPatient} />
              </div>
            </div>
          )}

          {/* Demo Patient Grid Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>
              Demographic Observational Beds
            </span>
            {demoPatients.length === 0 ? (
              <div className="glass-card flex-center" style={{ padding: "3rem", color: "var(--text-muted)", fontSize: "0.88rem" }}>
                No beds match this filter status.
              </div>
            ) : (
              <div className="patient-grid">
                {demoPatients.map((patient) => (
                  <PatientCard 
                    key={patient.id} 
                    patient={patient} 
                    onClick={onSelectPatient} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Central Alarms Feed & Staff Shift Summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Active alarms feed */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div className="flex-between mb-2">
              <span style={{ fontWeight: "700", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Flame size={16} className="text-critical" />
                Active Incident Alarm Log
              </span>
              <span className="badge-live-iot" style={{ background: "rgba(239, 68, 68, 0.15)", color: "var(--color-critical)", fontSize: "0.62rem" }}>
                Live Feeds
              </span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {activeCriticalPatient ? (
                <div 
                  className="glass-card" 
                  style={{ 
                    padding: "0.85rem 1rem", 
                    borderColor: "var(--color-critical)", 
                    background: "rgba(239, 68, 68, 0.05)",
                    cursor: "pointer"
                  }}
                  onClick={() => onSelectPatient(activeCriticalPatient)}
                >
                  <div className="flex-between mb-1" style={{ fontSize: "0.8rem", fontWeight: "700" }}>
                    <span className="text-critical" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <AlertTriangle size={12} className="text-critical" />
                      CRITICAL CODE RED
                    </span>
                    <span style={{ fontFamily: "monospace" }}>Just Now</span>
                  </div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "600" }}>
                    Patient: {activeCriticalPatient.name}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                    Vitals: HR {activeCriticalPatient.heartRate} bpm | SpO2 {activeCriticalPatient.spo2}%
                  </div>
                </div>
              ) : null}

              {recentHistory.slice(0, 4).map((log, index) => (
                <div key={index} className="glass-card" style={{ padding: "0.75rem 1rem", fontSize: "0.78rem" }}>
                  <div className="flex-between mb-1" style={{ fontWeight: "600" }}>
                    <span className={log.status === "Critical" ? "text-critical" : "text-warning"}>
                      {log.vitalType} Alert
                    </span>
                    <span className="text-muted">{log.time}</span>
                  </div>
                  <p style={{ color: "var(--text-main)", fontWeight: "500" }}>
                    Patient {log.patientName} ({log.value})
                  </p>
                  <div className="flex-between" style={{ marginTop: "0.4rem", borderTop: "1px solid var(--border-glass-light)", paddingTop: "0.4rem", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    <span>Resp: {log.responseTime === "N/A" ? "Auto" : log.responseTime}</span>
                    <span className="text-success" style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                      <ShieldCheck size={10} />
                      {log.statusResolved}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Ward Nurse Station Status */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <span style={{ fontWeight: "700", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem" }} className="mb-2">
              <UserCheck size={16} className="text-primary" />
              Nurse Station Triage Staff
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div className="flex-between" style={{ fontSize: "0.8rem", padding: "0.4rem 0", borderBottom: "1px solid var(--border-glass-light)" }}>
                <div>
                  <div style={{ fontWeight: "600" }}>Nurse David Miller</div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>ICU Lead</span>
                </div>
                <span className="bed-dot-indicator stable" style={{ fontSize: "0.68rem", padding: "2px 6px" }}>Available</span>
              </div>
              
              <div className="flex-between" style={{ fontSize: "0.8rem", padding: "0.4rem 0", borderBottom: "1px solid var(--border-glass-light)" }}>
                <div>
                  <div style={{ fontWeight: "600" }}>Nurse Emily Rose</div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Respiratory Specialist</span>
                </div>
                <span className="bed-dot-indicator stable" style={{ fontSize: "0.68rem", padding: "2px 6px" }}>Available</span>
              </div>

              <div className="flex-between" style={{ fontSize: "0.8rem", padding: "0.4rem 0" }}>
                <div>
                  <div style={{ fontWeight: "600" }}>Nurse Jessica Alba</div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Medication Duty</span>
                </div>
                <span className="bed-dot-indicator warning" style={{ fontSize: "0.68rem", padding: "2px 6px" }}>In ICU Ward</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
