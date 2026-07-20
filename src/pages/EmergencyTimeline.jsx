import React, { useState } from "react";
import { 
  Clock, 
  Activity, 
  Cpu, 
  BellRing, 
  UserCheck, 
  Stethoscope, 
  CheckCircle,
  FileSpreadsheet,
  AlertTriangle,
  Play
} from "lucide-react";
import { mockAlertTimeline } from "../mockData";

export default function EmergencyTimeline() {
  const [timelineEvents, setTimelineEvents] = useState(mockAlertTimeline);

  const getEventIcon = (event) => {
    switch (event) {
      case "Sensor Triggered": return { icon: Cpu, color: "var(--color-critical)", bg: "rgba(239, 68, 68, 0.1)" };
      case "ESP32 Gateway Push": return { icon: Activity, color: "var(--color-info)", bg: "rgba(6, 182, 212, 0.1)" };
      case "Emergency Alert Broadcasted": return { icon: BellRing, color: "var(--color-critical)", bg: "rgba(239, 68, 68, 0.1)" };
      case "Nurse Acknowledged": return { icon: UserCheck, color: "var(--color-warning)", bg: "rgba(245, 158, 11, 0.1)" };
      case "Doctor Assigned": return { icon: Stethoscope, color: "var(--color-primary)", bg: "rgba(37, 99, 235, 0.1)" };
      case "Resolved Time": return { icon: CheckCircle, color: "var(--color-success)", bg: "rgba(34, 197, 94, 0.1)" };
      default: return { icon: Clock, color: "var(--text-muted)", bg: "rgba(255, 255, 255, 0.05)" };
    }
  };

  const getLevelClass = (level) => {
    switch (level) {
      case "critical": return "critical";
      case "warning": return "warning";
      case "stable": return "stable";
      default: return "info";
    }
  };

  const handleSimulateNewAlert = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const newEvent = {
      id: timelineEvents.length + 1,
      time: timeStr,
      event: "Sensor Triggered",
      details: "ESP32 Patient Wearable reports temporary oxygen saturation drop (89% SpO2)",
      level: "warning"
    };

    setTimelineEvents([newEvent, ...timelineEvents]);
  };

  return (
    <div className="page-container" style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "800" }}>Emergency Action Timeline Logger</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Real-time audit trailing of medical alarm events, ESP32 packet arrivals, and doctor acknowledgments.
          </p>
        </div>
        <div className="flex-gap">
          <button 
            className="pagination-btn" 
            onClick={handleSimulateNewAlert}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", background: "var(--color-primary)", color: "white", borderColor: "var(--color-primary)" }}
          >
            <Play size={12} />
            Simulate Alarm Event
          </button>
          <button 
            className="pagination-btn" 
            onClick={() => alert("Timeline exported to CSV audit file.")}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem" }}
          >
            <FileSpreadsheet size={14} />
            Export Audit Trail
          </button>
        </div>
      </div>

      {/* Main UI layout */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        {/* Left Side: Timeline Feed */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "1.5rem" }}>Audit Log Feed (Newest First)</h3>
          
          <div className="timeline-list">
            {timelineEvents.map((item) => {
              const meta = getEventIcon(item.event);
              const EventIcon = meta.icon;
              return (
                <div key={item.id} className="timeline-item" style={{ marginBottom: "1rem" }}>
                  {/* Timeline Bullet Bullet with Icon */}
                  <div 
                    className="flex-center"
                    style={{
                      position: "absolute",
                      left: "-2.15rem",
                      top: "2px",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "#0b1220",
                      border: `2px solid ${meta.color}`,
                      color: meta.color,
                      zIndex: 2
                    }}
                  >
                    <EventIcon size={12} />
                  </div>
                  
                  {/* Event content box */}
                  <div className="glass-card" style={{ padding: "1rem 1.25rem", marginLeft: "0.5rem" }}>
                    <div className="flex-between mb-1">
                      <span style={{ fontWeight: "700", fontSize: "0.88rem", color: meta.color }}>
                        {item.event}
                      </span>
                      <span className="navbar-datetime" style={{ borderLeft: "none", paddingLeft: "0", fontSize: "0.72rem" }}>
                        <Clock size={11} style={{ marginRight: "0.2rem" }} />
                        {item.time}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
                      {item.details}
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                      <span className={`bed-dot-indicator ${getLevelClass(item.level)}`} style={{ fontSize: "0.62rem", padding: "1px 5px" }}>
                        Level: {item.level.toUpperCase()}
                      </span>
                      <span className="room-bed-badge" style={{ fontSize: "0.62rem", padding: "1px 5px" }}>
                        Node: ESP32-ICU-101
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: SLA Performance Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Central Response KPI Summary */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem" }}>Central SLA Compliance</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <div className="flex-between" style={{ fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                  <span>Gateway Delay (ESP32 to Local API)</span>
                  <strong className="text-success">0.14s (SLA Pass)</strong>
                </div>
                <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px" }}>
                  <div style={{ width: "95%", height: "100%", background: "var(--color-success)", borderRadius: "3px" }} />
                </div>
              </div>

              <div>
                <div className="flex-between" style={{ fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                  <span>Nurse Desk Acknowledge Speed</span>
                  <strong className="text-success">18.5s (SLA Pass)</strong>
                </div>
                <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px" }}>
                  <div style={{ width: "88%", height: "100%", background: "var(--color-success)", borderRadius: "3px" }} />
                </div>
              </div>

              <div>
                <div className="flex-between" style={{ fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                  <span>Doctor Assigned Bedside Arrival</span>
                  <strong className="text-warning">92.0s (Warning)</strong>
                </div>
                <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px" }}>
                  <div style={{ width: "65%", height: "100%", background: "var(--color-warning)", borderRadius: "3px" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Technical Info */}
          <div className="glass-panel" style={{ padding: "1.5rem", background: "rgba(37,99,235,0.05)" }}>
            <span style={{ fontSize: "0.88rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <AlertTriangle size={14} className="text-primary" />
              Timeline Audit Protocols
            </span>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem", lineHeight: "1.4" }}>
              Timeline event capture is hardware-triggered. Sensor threshold violations are registered instantaneously. System overrides are logged by nursing credentials automatically on push-button press.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
