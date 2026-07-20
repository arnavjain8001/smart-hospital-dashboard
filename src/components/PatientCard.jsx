import React from "react";
import { 
  Heart, 
  Percent, 
  Thermometer, 
  Radio, 
  Eye,
  UserCheck
} from "lucide-react";

export default function PatientCard({ patient, onClick }) {
  const getStatusClass = (status) => {
    switch (status) {
      case "Critical": return "critical";
      case "Warning": return "warning";
      default: return "stable";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Critical": return "CRITICAL LIMITS";
      case "Warning": return "OBSERVATION REQUIRED";
      default: return "STABLE CONDITION";
    }
  };

  return (
    <div 
      className={`glass-card patient-card ${patient.isLiveESP32 ? "live-esp32" : ""} ${getStatusClass(patient.status)}`}
      onClick={() => onClick(patient)}
    >
      <div className="card-top">
        <div className="patient-basic-info">
          {patient.isLiveESP32 ? (
            <div className="badge-live-iot mb-1">
              <Radio size={10} style={{ animation: "pulse 1.5s infinite" }} />
              <span>Live ESP32 Connected</span>
            </div>
          ) : (
            <div className="badge-demo mb-1">Demo Patient</div>
          )}
          <h3 className="patient-card-name">{patient.name}</h3>
          <span className="patient-card-id">{patient.id}</span>
        </div>
        <span className="room-bed-badge">
          {patient.room} | {patient.bed}
        </span>
      </div>

      <div className="patient-meta-row">
        <span>Age: {patient.age}</span>
        <span>•</span>
        <span>Gender: {patient.gender}</span>
      </div>

      <div className="patient-vitals-display">
        {/* Heart Rate */}
        <div className={`vital-reading ${getStatusClass(patient.status === "Critical" && patient.heartRate > 110 ? "Critical" : "Stable")}`}>
          <span className="vital-label">Heart Rate</span>
          <div className="vital-value-unit">
            <Heart size={12} className="text-critical" style={{ animation: patient.status === "Critical" ? "heartBeat 0.8s infinite" : "none" }} />
            <span className="vital-number">{patient.heartRate}</span>
            <span className="vital-unit">bpm</span>
          </div>
        </div>

        {/* SpO2 */}
        <div className={`vital-reading ${getStatusClass(patient.status === "Critical" && patient.spo2 < 92 ? "Critical" : patient.status === "Warning" && patient.spo2 <= 95 ? "Warning" : "Stable")}`}>
          <span className="vital-label">SpO₂ Level</span>
          <div className="vital-value-unit">
            <Percent size={11} className="text-info" />
            <span className="vital-number">{patient.spo2}</span>
            <span className="vital-unit">%</span>
          </div>
        </div>

        {/* Temp */}
        <div className={`vital-reading ${getStatusClass(patient.temperature > 101 ? "Critical" : patient.temperature > 99.5 ? "Warning" : "Stable")}`}>
          <span className="vital-label">Temperature</span>
          <div className="vital-value-unit">
            <Thermometer size={12} className="text-warning" />
            <span className="vital-number">{patient.temperature}</span>
            <span className="vital-unit">°F</span>
          </div>
        </div>
      </div>

      <div className="card-bottom-status">
        <div className="status-indicator">
          <span className={`status-dot ${getStatusClass(patient.status)}`} />
          <span className={patient.status === "Critical" ? "text-critical" : patient.status === "Warning" ? "text-warning" : "text-success"} style={{ fontWeight: "700", fontSize: "0.72rem" }}>
            {getStatusText(patient.status)}
          </span>
        </div>
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.2rem" }}>
          <Eye size={12} />
          View Profile
        </span>
      </div>
    </div>
  );
}
