import React, { useState } from "react";
import { Settings, Shield, Bell, Globe, Building, Volume2, Save } from "lucide-react";

export default function SettingsPage({ theme, toggleTheme }) {
  const [notifState, setNotifState] = useState({
    audioAlarm: true,
    pagerVibrate: true,
    emailLog: false,
    otaSync: true
  });
  
  const [savedMsg, setSavedMsg] = useState("");

  const handleToggle = (key) => {
    setNotifState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedMsg("Hospital configuration parameters updated.");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  return (
    <div className="page-container" style={{ animation: "fadeIn 0.3s ease", maxWidth: "800px" }}>
      <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Card 1: Console Theme preferences */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Building size={16} className="text-primary" />
            Hospital Console Theme
          </h3>
          
          <div className="flex-between">
            <div>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", display: "block" }}>Color Palette Mode</span>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                Switch between high-contrast dark clinical backing and daylight white modes.
              </p>
            </div>
            <button 
              type="button"
              className="pagination-btn"
              onClick={toggleTheme}
              style={{ background: "var(--color-primary)", color: "white", borderColor: "var(--color-primary)" }}
            >
              Toggle {theme === "dark" ? "Light Mode" : "Dark Mode"} (Current: {theme.toUpperCase()})
            </button>
          </div>
        </div>

        {/* Card 2: Clinical Alarm Limits */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Shield size={16} className="text-critical" />
            Critical Patient Threshold Rules
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", fontSize: "0.82rem" }}>
            <div>
              <label style={{ display: "block", color: "var(--text-muted)", marginBottom: "0.3rem" }}>ECG Heart Rate High Limit (bpm)</label>
              <input type="number" className="form-input" defaultValue="110" />
            </div>
            <div>
              <label style={{ display: "block", color: "var(--text-muted)", marginBottom: "0.3rem" }}>ECG Heart Rate Low Limit (bpm)</label>
              <input type="number" className="form-input" defaultValue="50" />
            </div>
            <div>
              <label style={{ display: "block", color: "var(--text-muted)", marginBottom: "0.3rem" }}>SpO₂ Hypoxia Trigger Level (%)</label>
              <input type="number" className="form-input" defaultValue="92" />
            </div>
            <div>
              <label style={{ display: "block", color: "var(--text-muted)", marginBottom: "0.3rem" }}>Fever Threshold (°F)</label>
              <input type="number" className="form-input" defaultValue="101.0" step="0.1" />
            </div>
          </div>
        </div>

        {/* Card 3: Alert Notification Channels */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Bell size={16} className="text-warning" />
            Central Pager & Audio Broadcast Channels
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem" }}>
            <div className="flex-between">
              <div>
                <span style={{ fontWeight: "600", display: "block" }}>Audible Code Red Alarm Sound</span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Sound high-frequency alarm tones on ward master station.</span>
              </div>
              <input type="checkbox" checked={notifState.audioAlarm} onChange={() => handleToggle("audioAlarm")} style={{ width: "16px", height: "16px" }} />
            </div>

            <div className="flex-between" style={{ borderTop: "1px solid var(--border-glass-light)", paddingTop: "0.75rem" }}>
              <div>
                <span style={{ fontWeight: "600", display: "block" }}>Nurse Wireless Pager Vibrations</span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Transmit urgent alerts immediately to assigned nurse pagers.</span>
              </div>
              <input type="checkbox" checked={notifState.pagerVibrate} onChange={() => handleToggle("pagerVibrate")} style={{ width: "16px", height: "16px" }} />
            </div>

            <div className="flex-between" style={{ borderTop: "1px solid var(--border-glass-light)", paddingTop: "0.75rem" }}>
              <div>
                <span style={{ fontWeight: "600", display: "block" }}>Email Auditing Reports</span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Email telemetry violation logs automatically every 24 hours.</span>
              </div>
              <input type="checkbox" checked={notifState.emailLog} onChange={() => handleToggle("emailLog")} style={{ width: "16px", height: "16px" }} />
            </div>
          </div>
        </div>

        {/* Card 4: Global console preferences */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Globe size={16} className="text-info" />
            Language & Region
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "0.3rem" }}>Language</label>
              <select className="form-select">
                <option>English (US Clinical Standard)</option>
                <option>Hindi (IN)</option>
                <option>Spanish (ES)</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "0.3rem" }}>Timezone Locale</label>
              <select className="form-select">
                <option>GMT+05:30 (India Standard Time)</option>
                <option>GMT-05:00 (Eastern Time)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save button footer */}
        <div className="flex-between">
          {savedMsg && <span className="text-success" style={{ fontSize: "0.82rem", fontWeight: "600" }}>{savedMsg}</span>}
          <button 
            type="submit" 
            className="btn-emergency resolve" 
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginLeft: "auto", padding: "0.6rem 1.5rem" }}
          >
            <Save size={16} />
            Commit Configuration
          </button>
        </div>

      </form>
    </div>
  );
}
