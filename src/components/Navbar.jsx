import React, { useState, useEffect } from "react";
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Activity, 
  ShieldAlert, 
  Calendar,
  Clock,
  Menu,
  ChevronRight
} from "lucide-react";

export default function Navbar({ 
  currentTab, 
  collapsed, 
  setCollapsed, 
  theme, 
  toggleTheme, 
  searchQuery, 
  setSearchQuery,
  notifications = []
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: "long", year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const getPageTitle = (tab) => {
    const titles = {
      "dashboard": "Clinical Intelligence Dashboard",
      "live-patients": "Real-time Telemetry (ICU Ward)",
      "patient-details": "Patient Diagnostics Dossier",
      "emergency-alerts": "Critical Alarm Console",
      "patient-history": "Clinical Audit Trail",
      "reports": "Hospital Operations Analytics",
      "ward-overview": "Spatial Ward Visualization",
      "emergency-timeline": "Emergency Response Auditing",
      "device-health": "IoT Device Telemetry (ESP32 Gateways)",
      "staff-management": "Staff Scheduling & Rosters",
      "settings": "Central Console Preferences",
      "help": "Clinical Systems Support Desk",
      "profile": "Staff Access Profile"
    };
    return titles[tab] || "Central Monitoring Console";
  };

  return (
    <header className="app-navbar">
      <div className="nav-left">
        <button 
          className="sidebar-toggle-btn" 
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu size={18} />
        </button>
        
        <h1 className="section-title" style={{ fontSize: "1.15rem", fontWeight: "700" }}>
          {getPageTitle(currentTab)}
        </h1>
        
        <div className="navbar-datetime">
          <Calendar size={14} />
          <span>{formatDate(currentTime)}</span>
          <span style={{ margin: "0 0.25rem", color: "var(--border-glass)" }}>|</span>
          <Clock size={14} />
          <span style={{ fontFamily: "monospace", fontWeight: "700" }}>{formatTime(currentTime)}</span>
        </div>
      </div>

      <div className="nav-center-search">
        <Search className="search-icon" />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Global search patients, wards, rooms, staff..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="nav-right">
        {/* Theme Toggle Button */}
        <button 
          className="nav-icon-btn" 
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-primary" />}
        </button>

        {/* Notifications Bell Dropdown */}
        <div style={{ position: "relative" }}>
          <button 
            className="nav-icon-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            title="Active Notifications"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="btn-badge">{notifications.length}</span>
            )}
          </button>

          {showNotifications && (
            <div 
              className="glass-panel" 
              style={{
                position: "absolute",
                top: "50px",
                right: "0",
                width: "320px",
                maxHeight: "400px",
                overflowY: "auto",
                zIndex: 100,
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }}
            >
              <div className="flex-between" style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.5rem" }}>
                <span style={{ fontWeight: "700", fontSize: "0.85rem" }}>Recent Alerts</span>
                <span 
                  style={{ fontSize: "0.72rem", color: "var(--color-primary)", cursor: "pointer", fontWeight: "600" }}
                  onClick={() => setShowNotifications(false)}
                >
                  Close
                </span>
              </div>
              {notifications.length === 0 ? (
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", padding: "1rem 0" }}>
                  No active alarms
                </span>
              ) : (
                notifications.map((notif, index) => (
                  <div 
                    key={index}
                    style={{
                      padding: "0.6rem 0.8rem",
                      borderRadius: "8px",
                      background: notif.status === "critical" ? "rgba(239, 68, 68, 0.08)" : "rgba(245, 158, 11, 0.08)",
                      borderLeft: `3px solid ${notif.status === "critical" ? "var(--color-critical)" : "var(--color-warning)"}`,
                      fontSize: "0.8rem"
                    }}
                  >
                    <div className="flex-between mb-1" style={{ fontWeight: "700" }}>
                      <span className={notif.status === "critical" ? "text-critical" : "text-warning"}>
                        {notif.type}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{notif.time}</span>
                    </div>
                    <div style={{ color: "var(--text-main)", fontSize: "0.76rem" }}>
                      Patient: {notif.name} ({notif.room})
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderLeft: "1px solid var(--border-glass)", paddingLeft: "1rem" }}>
          <img 
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150" 
            alt="Profile Avatar"
            style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--border-glass)" }}
          />
        </div>
      </div>
    </header>
  );
}
