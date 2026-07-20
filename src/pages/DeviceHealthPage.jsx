import React, { useState } from "react";
import { Cpu, Wifi, Battery, RefreshCw, Radio, HardDrive, CheckCircle2, ShieldX, Activity } from "lucide-react";
import { mockDevices } from "../mockData";

export default function DeviceHealthPage() {
  const [devicesList, setDevicesList] = useState(mockDevices);
  const [syncingId, setSyncingId] = useState(null);

  const getSignalStrengthLabel = (rssi) => {
    if (rssi >= -60) return { label: "Excellent", color: "var(--color-success)" };
    if (rssi >= -75) return { label: "Good", color: "var(--color-info)" };
    if (rssi >= -85) return { label: "Fair", color: "var(--color-warning)" };
    return { label: "Critical Weakness", color: "var(--color-critical)" };
  };

  const getBatteryColor = (level) => {
    if (level > 70) return "var(--color-success)";
    if (level > 30) return "var(--color-warning)";
    return "var(--color-critical)";
  };

  const handlePingNode = (id) => {
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
      alert(`IoT Gateway Ping Success!\nNode ID: ${id}\nRTT latency: 12ms\nPacket delivery: 100%\nVoltage bias: stable.`);
    }, 1200);
  };

  const handleRebootSimulate = (name) => {
    const confirm = window.confirm(`Initiate OTA soft-reboot on gateway device: "${name}"?`);
    if (confirm) {
      alert(`Reboot command sent over MQTT topic: cmd/esp32/reboot\nDevice will take 15s to re-establish WiFi association.`);
    }
  };

  return (
    <div className="page-container" style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "800" }}>IoT Gateway Diagnostics Console</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Real-time diagnostics for hospital ward ESP32 microcontroller arrays, wearable bands, and vital relays.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.85rem", fontSize: "0.75rem" }}>
          <span className="bed-dot-indicator stable" style={{ padding: "4px 8px" }}>
            Total Nodes: {devicesList.length}
          </span>
          <span className="bed-dot-indicator stable" style={{ padding: "4px 8px", background: "rgba(34, 197, 94, 0.12)", color: "var(--color-success)" }}>
            Online: {devicesList.filter(d => d.status === "Online").length}
          </span>
          <span className="bed-dot-indicator critical" style={{ padding: "4px 8px" }}>
            Offline: {devicesList.filter(d => d.status === "Offline").length}
          </span>
        </div>
      </div>

      {/* Devices Diagnostics Grid */}
      <div className="device-grid">
        {devicesList.map((device) => {
          const wifiInfo = getSignalStrengthLabel(device.wifiSignal);
          const isOnline = device.status === "Online";
          
          return (
            <div 
              key={device.id} 
              className={`glass-panel device-card`}
              style={{
                border: isOnline ? "1px solid var(--border-glass-light)" : "1px solid rgba(239, 68, 68, 0.2)",
                opacity: isOnline ? 1 : 0.8
              }}
            >
              {/* Card top bar */}
              <div className="flex-between mb-2">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{
                    padding: "0.4rem",
                    borderRadius: "6px",
                    background: isOnline ? "rgba(37,99,235,0.08)" : "rgba(239,68,68,0.08)",
                    color: isOnline ? "var(--color-primary)" : "var(--color-critical)"
                  }}>
                    <Cpu size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.85rem", fontWeight: "700", display: "block" }}>{device.name}</span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{device.id}</span>
                  </div>
                </div>

                <span className={`bed-dot-indicator ${isOnline ? "stable" : "critical"}`} style={{ fontSize: "0.65rem", padding: "2px 6px" }}>
                  {device.status}
                </span>
              </div>

              {/* Specs parameters lists */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.78rem", borderTop: "1px solid var(--border-glass-light)", borderBottom: "1px solid var(--border-glass-light)", padding: "0.75rem 0", margin: "0.75rem 0" }}>
                {/* RSSI Signal */}
                <div className="flex-between">
                  <span className="text-muted" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Wifi size={12} /> Signal Quality
                  </span>
                  {isOnline ? (
                    <span style={{ fontWeight: "700", color: wifiInfo.color }}>
                      {device.wifiSignal} dBm ({wifiInfo.label})
                    </span>
                  ) : (
                    <span className="text-muted">Unreachable</span>
                  )}
                </div>

                {/* Battery charge */}
                <div className="flex-between">
                  <span className="text-muted" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Battery size={12} /> Node Battery
                  </span>
                  {isOnline ? (
                    <span style={{ fontWeight: "700", color: getBatteryColor(device.battery) }}>
                      {device.battery}%
                    </span>
                  ) : (
                    <span className="text-muted">Discharged</span>
                  )}
                </div>

                {/* Firmware Version */}
                <div className="flex-between">
                  <span className="text-muted" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <HardDrive size={12} /> Firmware Build
                  </span>
                  <span style={{ fontFamily: "monospace" }}>{device.firmware}</span>
                </div>

                {/* Last Sync clock */}
                <div className="flex-between">
                  <span className="text-muted" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <RefreshCw size={12} /> Sync Frequency
                  </span>
                  <span>{device.lastSync}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <button 
                  className="pagination-btn" 
                  onClick={() => handlePingNode(device.id)}
                  disabled={!isOnline || syncingId === device.id}
                  style={{ fontSize: "0.72rem", padding: "4px" }}
                >
                  {syncingId === device.id ? "Pinging..." : "Ping Node"}
                </button>
                <button 
                  className="pagination-btn" 
                  onClick={() => handleRebootSimulate(device.name)}
                  disabled={!isOnline}
                  style={{ fontSize: "0.72rem", padding: "4px", borderColor: "rgba(245, 158, 11, 0.3)", color: "var(--color-warning)" }}
                >
                  OTA Reboot
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
