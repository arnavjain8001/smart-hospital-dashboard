import React from "react";
import { Bed, UserPlus, Grid3x3, Radio, ShieldAlert } from "lucide-react";

export default function WardOverviewPage({ patients, onSelectPatient }) {
  // Map out a standard ICU Ward block (Rooms 101 to 108)
  const roomTemplates = [
    { roomNo: "ICU-101", title: "Cardiac Intensive Care" },
    { roomNo: "ICU-102", title: "Respiratory Intensive Care" },
    { roomNo: "ICU-103", title: "General ICU Bed (A)" },
    { roomNo: "ICU-104", title: "General ICU Bed (B)" },
    { roomNo: "ICU-105", title: "Septic Trauma Isolation" },
    { roomNo: "ICU-106", title: "Neurological Monitoring Bed" },
    { roomNo: "ICU-107", title: "Surgical Recovery Unit" },
    { roomNo: "ICU-108", title: "Pulmonary High Dependency" }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "Critical": return "critical";
      case "Warning": return "warning";
      case "Stable": return "stable";
      default: return "empty";
    }
  };

  const handleRoomClick = (patient) => {
    if (patient) {
      onSelectPatient(patient);
    } else {
      alert("Room Status: VACANT\nThis bed is currently unoccupied.\n\nCentral intake queue has 4 triage patients awaiting assignment.");
    }
  };

  return (
    <div className="page-container" style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "800" }}>Central ICU Ward Visualizer</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Spatial mapping of beds inside Central ICU Wing A. Colors represent telemetry alarms severity.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.85rem", fontSize: "0.75rem" }}>
          <span className="bed-dot-indicator stable" style={{ padding: "4px 8px" }}>Green: Stable</span>
          <span className="bed-dot-indicator warning" style={{ padding: "4px 8px" }}>Yellow: Observation</span>
          <span className="bed-dot-indicator critical" style={{ padding: "4px 8px" }}>Red: Critical Code</span>
          <span className="bed-dot-indicator empty" style={{ padding: "4px 8px" }}>Gray: Vacant Bed</span>
        </div>
      </div>

      {/* Ward Grid Layout */}
      <div className="ward-layout">
        {roomTemplates.map((room) => {
          // Find if there is a patient in this room
          const patientInRoom = patients.find(p => p.room === room.roomNo);
          const roomStatus = patientInRoom ? patientInRoom.status : "Empty";
          
          return (
            <div 
              key={room.roomNo} 
              className={`glass-panel room-panel ${getStatusClass(roomStatus)}`}
              onClick={() => handleRoomClick(patientInRoom)}
              style={{
                position: "relative",
                borderLeft: `5px solid ${
                  roomStatus === "Critical" ? "var(--color-critical)" :
                  roomStatus === "Warning" ? "var(--color-warning)" :
                  roomStatus === "Stable" ? "var(--color-success)" :
                  "var(--border-glass)"
                }`,
                cursor: "pointer",
                padding: "1.25rem"
              }}
            >
              <div className="room-panel-header">
                <div>
                  <span style={{ fontSize: "1.1rem", fontWeight: "800", display: "block" }}>{room.roomNo}</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{room.title}</span>
                </div>
                
                {patientInRoom?.isLiveESP32 && (
                  <span className="badge-live-iot" style={{ fontSize: "0.58rem", padding: "2px 6px" }}>
                    <Radio size={8} style={{ animation: "pulse 1s infinite" }} />
                    IoT
                  </span>
                )}
              </div>

              {/* Room Occupancy content */}
              {patientInRoom ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
                  <div style={{ borderTop: "1px solid var(--border-glass-light)", paddingTop: "0.5rem" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>OCCUPIED BY</span>
                    <span style={{ fontWeight: "700", fontSize: "0.9rem" }}>{patientInRoom.name}</span>
                  </div>

                  {/* Bed vitals sneak peek */}
                  <div className="room-bed-grid">
                    <div className="bed-dot-indicator stable" style={{ fontSize: "0.68rem", padding: "3px 4px" }}>
                      HR: {patientInRoom.heartRate}
                    </div>
                    <div 
                      className={`bed-dot-indicator ${
                        patientInRoom.spo2 < 92 ? "critical" : 
                        patientInRoom.spo2 <= 95 ? "warning" : "stable"
                      }`}
                      style={{ fontSize: "0.68rem", padding: "3px 4px" }}
                    >
                      SpO₂: {patientInRoom.spo2}%
                    </div>
                  </div>
                  
                  <div className="flex-between" style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                    <span>Bed: {patientInRoom.bed}</span>
                    <span className={roomStatus === "Critical" ? "text-critical" : roomStatus === "Warning" ? "text-warning" : "text-success"} style={{ fontWeight: "700" }}>
                      {roomStatus === "Critical" ? "CRITICAL" : roomStatus === "Warning" ? "WARNING" : "STABLE"}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "110px", color: "var(--text-muted)", border: "1px dashed var(--border-glass-light)", borderRadius: "8px", marginTop: "1rem", gap: "0.4rem" }}>
                  <UserPlus size={20} className="text-muted" />
                  <span style={{ fontSize: "0.78rem", fontWeight: "600" }}>VACANT BED</span>
                  <span style={{ fontSize: "0.65rem" }}>Click to Assign</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
