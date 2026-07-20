import React from "react";
import { HelpCircle, Terminal, Phone, BookOpen, Layers } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="page-container" style={{ animation: "fadeIn 0.3s ease", maxWidth: "800px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Support Help Banner */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <HelpCircle className="text-primary" />
            Clinical Central Console Support Desk
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
            For urgent troubleshooting, hardware gateway failures, or MQTT packet dropouts, please reach out to the hospital IT Support Center at ext 4402 immediately.
          </p>
        </div>

        {/* FAQs */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BookOpen size={16} className="text-info" />
            Central System FAQs
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.82rem" }}>
            <div>
              <strong style={{ display: "block" }}>1. How is the Live ESP32 Patient channel identified?</strong>
              <span style={{ color: "var(--text-muted)" }}>
                The Live patient is marked with a gradient "Live ESP32 Connected" badge. This bed receives fluctuating telemetry values from the simulated hardware loop.
              </span>
            </div>

            <div style={{ borderTop: "1px solid var(--border-glass-light)", paddingTop: "0.85rem" }}>
              <strong style={{ display: "block" }}>2. How do I acknowledge and clear emergency Code Red alarms?</strong>
              <span style={{ color: "var(--text-muted)" }}>
                When a vital breaches preset limits, a central fullscreen Code Red overlay triggers. Click the "Acknowledge" button to mute the audio bell, or click "Resolve" to clear the critical state. You can also simulate the physical ESP32 push-button press at the bottom of the popup.
              </span>
            </div>

            <div style={{ borderTop: "1px solid var(--border-glass-light)", paddingTop: "0.85rem" }}>
              <strong style={{ display: "block" }}>3. Why is ESP32-WARD4A-12 showing as offline?</strong>
              <span style={{ color: "var(--text-muted)" }}>
                Offline devices represent un-synced nodes in the ward. You can check battery, RSSI levels, and sync frequencies in the Device Health panel.
              </span>
            </div>
          </div>
        </div>

        {/* Emergency IT Hotline */}
        <div className="glass-card" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem", background: "rgba(37,99,235,0.05)", border: "1px solid rgba(37,99,235,0.15)" }}>
          <div style={{ padding: "0.6rem", borderRadius: "8px", background: "var(--color-primary)", color: "white" }}>
            <Phone size={18} />
          </div>
          <div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>EMERGENCY IT HOTLINE</span>
            <span style={{ fontSize: "1.05rem", fontWeight: "800" }}>+91 (080) 4567-4402</span>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", display: "block" }}>Available 24/7 for Medical Staff Assistance</span>
          </div>
        </div>

      </div>
    </div>
  );
}
