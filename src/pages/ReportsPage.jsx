import React, { useState } from "react";
import { FileText, Download, BarChart2, Calendar, TrendingUp, ShieldAlert, Award, Clock } from "lucide-react";
import { mockAnalytics } from "../mockData";

export default function ReportsPage() {
  const [activeReportTab, setActiveReportTab] = useState("daily"); // daily, weekly, monthly

  const handleDownload = (format, reportType) => {
    alert(`Downloading operations archive...\nReport Type: ${reportType.toUpperCase()}\nFormat: ${format.toUpperCase()}\n\nDownloaded to: C:\\Downloads\\Clinical_Operations_${reportType}_Report.${format}`);
  };

  return (
    <div className="page-container" style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Tab bar header */}
      <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "800" }}>Operations Analytics Dossier</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Consolidated reports of emergency responses, bed turnarounds, and IoT sync logs.
          </p>
        </div>

        {/* Report Duration Select */}
        <div className="flex-gap" style={{ background: "rgba(255,255,255,0.03)", padding: "4px", borderRadius: "8px", border: "1px solid var(--border-glass-light)" }}>
          {["daily", "weekly", "monthly"].map((tab) => (
            <button
              key={tab}
              className="pagination-btn"
              onClick={() => setActiveReportTab(tab)}
              style={{
                padding: "6px 12px",
                fontSize: "0.78rem",
                border: "none",
                textTransform: "capitalize",
                background: activeReportTab === tab ? "var(--color-primary)" : "transparent",
                color: activeReportTab === tab ? "white" : "var(--text-muted)"
              }}
            >
              {tab} Overview
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
        {/* Card 1 */}
        <div className="glass-card" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "0.75rem", borderRadius: "10px", background: "rgba(34, 197, 94, 0.12)", color: "var(--color-success)" }}>
            <Clock size={20} />
          </div>
          <div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Avg Response Speed</span>
            <span style={{ fontSize: "1.3rem", fontWeight: "800" }}>42.5s</span>
            <span style={{ fontSize: "0.68rem", color: "var(--color-success)", display: "block" }}>-12.4s from last week</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-card" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "0.75rem", borderRadius: "10px", background: "rgba(239, 68, 68, 0.12)", color: "var(--color-critical)" }}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Total Incidents Logged</span>
            <span style={{ fontSize: "1.3rem", fontWeight: "800" }}>18 Cases</span>
            <span style={{ fontSize: "0.68rem", color: "var(--color-critical)", display: "block" }}>+2 spikes post-08:00</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-card" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "0.75rem", borderRadius: "10px", background: "rgba(37, 99, 235, 0.12)", color: "var(--color-primary)" }}>
            <Award size={20} />
          </div>
          <div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Resolution Index</span>
            <span style={{ fontSize: "1.3rem", fontWeight: "800" }}>99.2%</span>
            <span style={{ fontSize: "0.68rem", color: "var(--color-success)", display: "block" }}>17/18 resolved &lt; 2 mins</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="glass-card" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "0.75rem", borderRadius: "10px", background: "rgba(6, 182, 212, 0.12)", color: "var(--color-info)" }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>IoT Packet Delivery Rate</span>
            <span style={{ fontSize: "1.3rem", fontWeight: "800" }}>99.98%</span>
            <span style={{ fontSize: "0.68rem", color: "var(--color-success)", display: "block" }}>MQTT payload stability</span>
          </div>
        </div>
      </div>

      {/* Main reports body containing graphics */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "1.5rem" }}>
        {/* Left Column: Analytics Chart Card */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div className="flex-between mb-3">
            <span style={{ fontWeight: "700", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <BarChart2 size={18} className="text-primary" />
              {activeReportTab.toUpperCase()} TELEMETRY & ALARM DURATION PERFORMANCE
            </span>
            
            <div className="flex-gap">
              <button className="pagination-btn" style={{ fontSize: "0.75rem" }} onClick={() => handleDownload("xlsx", activeReportTab)}>
                Excel
              </button>
              <button className="pagination-btn" style={{ fontSize: "0.75rem", background: "var(--color-primary)", color: "white", borderColor: "var(--color-primary)" }} onClick={() => handleDownload("pdf", activeReportTab)}>
                PDF Report
              </button>
            </div>
          </div>

          {/* Render corresponding graphic based on tab */}
          {activeReportTab === "daily" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Daily Response Times Wave Graphic */}
              <div style={{ position: "relative", width: "100%", height: "260px" }}>
                <svg viewBox="0 0 500 200" width="100%" height="100%" style={{ overflow: "visible" }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(37,99,235,0.4)" />
                      <stop offset="100%" stopColor="rgba(37,99,235,0.0)" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.03)" />
                  <line x1="50" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.03)" />
                  <line x1="50" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.03)" />
                  <line x1="50" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.03)" />
                  
                  {/* Bottom line */}
                  <line x1="50" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                  
                  {/* Path */}
                  <path 
                    d="M 50,145 Q 120,130 190,150 T 330,110 T 410,130 T 480,110 L 480,170 L 50,170 Z" 
                    fill="url(#areaGrad)" 
                  />
                  <path 
                    d="M 50,145 Q 120,130 190,150 T 330,110 T 410,130 T 480,110" 
                    fill="none" 
                    stroke="var(--color-primary)" 
                    strokeWidth="3" 
                  />
                  
                  {/* Circles on peak points */}
                  <circle cx="190" cy="150" r="4" fill="var(--color-primary)" />
                  <circle cx="330" cy="110" r="4" fill="var(--color-primary)" />
                  
                  {/* Text labels */}
                  <text x="45" y="190" fill="var(--text-muted)" fontSize="9">00:00</text>
                  <text x="115" y="190" fill="var(--text-muted)" fontSize="9">04:00</text>
                  <text x="185" y="190" fill="var(--text-muted)" fontSize="9">08:00</text>
                  <text x="255" y="190" fill="var(--text-muted)" fontSize="9">12:00</text>
                  <text x="325" y="190" fill="var(--text-muted)" fontSize="9">16:00</text>
                  <text x="395" y="190" fill="var(--text-muted)" fontSize="9">20:00</text>
                  <text x="465" y="190" fill="var(--text-muted)" fontSize="9">24:00</text>
                  
                  <text x="10" y="25" fill="var(--text-muted)" fontSize="8">80s</text>
                  <text x="10" y="75" fill="var(--text-muted)" fontSize="8">60s</text>
                  <text x="10" y="125" fill="var(--text-muted)" fontSize="8">40s</text>
                  <text x="10" y="175" fill="var(--text-muted)" fontSize="8">20s</text>
                </svg>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--color-primary)" }} />
                  Clinical Response Time (sec)
                </span>
              </div>
            </div>
          )}

          {activeReportTab === "weekly" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Weekly bar chart */}
              <div style={{ position: "relative", width: "100%", height: "260px" }}>
                <svg viewBox="0 0 500 200" width="100%" height="100%" style={{ overflow: "visible" }}>
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.03)" />
                  <line x1="50" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.03)" />
                  <line x1="50" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.03)" />
                  <line x1="50" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.03)" />
                  
                  {/* Bottom axis line */}
                  <line x1="50" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                  
                  {/* Weekday bars (x positions: 75, 130, 185, 240, 295, 350, 405) */}
                  {/* Mon: 12 cases */}
                  <rect x="75" y="70" width="14" height="100" rx="3" fill="var(--color-primary)" />
                  {/* Tue: 8 cases */}
                  <rect x="135" y="100" width="14" height="70" rx="3" fill="var(--color-primary)" />
                  {/* Wed: 15 cases */}
                  <rect x="195" y="45" width="14" height="125" rx="3" fill="var(--color-critical)" />
                  {/* Thu: 6 cases */}
                  <rect x="255" y="120" width="14" height="50" rx="3" fill="var(--color-primary)" />
                  {/* Fri: 18 cases */}
                  <rect x="315" y="20" width="14" height="150" rx="3" fill="var(--color-critical)" />
                  {/* Sat: 10 cases */}
                  <rect x="375" y="90" width="14" height="80" rx="3" fill="var(--color-primary)" />
                  {/* Sun: 4 cases */}
                  <rect x="435" y="140" width="14" height="30" rx="3" fill="var(--color-primary)" />
                  
                  {/* Text labels */}
                  <text x="73" y="190" fill="var(--text-muted)" fontSize="9">Mon</text>
                  <text x="133" y="190" fill="var(--text-muted)" fontSize="9">Tue</text>
                  <text x="193" y="190" fill="var(--text-muted)" fontSize="9">Wed</text>
                  <text x="253" y="190" fill="var(--text-muted)" fontSize="9">Thu</text>
                  <text x="313" y="190" fill="var(--text-muted)" fontSize="9">Fri</text>
                  <text x="373" y="190" fill="var(--text-muted)" fontSize="9">Sat</text>
                  <text x="433" y="190" fill="var(--text-muted)" fontSize="9">Sun</text>
                  
                  <text x="15" y="25" fill="var(--text-muted)" fontSize="8">20 Alarms</text>
                  <text x="15" y="75" fill="var(--text-muted)" fontSize="8">15 Alarms</text>
                  <text x="15" y="125" fill="var(--text-muted)" fontSize="8">10 Alarms</text>
                  <text x="15" y="175" fill="var(--text-muted)" fontSize="8">5 Alarms</text>
                </svg>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "var(--color-primary)" }} />
                  Normal Incidents
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "var(--color-critical)" }} />
                  Peak Congestion Alert Spikes
                </span>
              </div>
            </div>
          )}

          {activeReportTab === "monthly" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Monthly Recovery rate distribution */}
              <div style={{ position: "relative", width: "100%", height: "260px" }}>
                <svg viewBox="0 0 500 200" width="100%" height="100%" style={{ overflow: "visible" }}>
                  {/* Outer circle of Donut Chart */}
                  <circle cx="250" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="20" />
                  
                  {/* Cyan arc: ICU Recoveries (68%) */}
                  <circle cx="250" cy="100" r="70" fill="none" stroke="var(--color-success)" strokeWidth="20" 
                          strokeDasharray="440" strokeDashoffset="140" strokeLinecap="round" transform="rotate(-90 250 100)" />
                  
                  {/* Blue arc: General Ward Transfers (22%) */}
                  <circle cx="250" cy="100" r="70" fill="none" stroke="var(--color-primary)" strokeWidth="20" 
                          strokeDasharray="440" strokeDashoffset="343" strokeLinecap="round" transform="rotate(155 250 100)" />

                  {/* Amber arc: Critical ICU Transfers (10%) */}
                  <circle cx="250" cy="100" r="70" fill="none" stroke="var(--color-warning)" strokeWidth="20" 
                          strokeDasharray="440" strokeDashoffset="396" strokeLinecap="round" transform="rotate(234 250 100)" />
                  
                  {/* Central Text */}
                  <text x="250" y="98" textAnchor="middle" fill="var(--text-main)" fontSize="18" fontWeight="800">92%</text>
                  <text x="250" y="112" textAnchor="middle" fill="var(--text-muted)" fontSize="8" fontWeight="600" letterSpacing="0.5">DISCHARGE INDEX</text>
                </svg>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-success)" }} />
                  Stable Discharges (68%)
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-primary)" }} />
                  General Care Transfers (22%)
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-warning)" }} />
                  ICU Escalations (10%)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Historical Reports Archive */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={16} className="text-primary" />
            Institutional Audited Summaries
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {[
              { title: "Weekly ICU Bed Turnaround Report", code: "REP-W-204", size: "2.4 MB", date: "July 12, 2026" },
              { title: "Monthly Emergency Code Red Auditing", code: "REP-M-112", size: "8.1 MB", date: "July 01, 2026" },
              { title: "Quarterly IoT Gateway RSSI Diagnostics", code: "REP-Q-059", size: "14.2 MB", date: "June 15, 2026" },
              { title: "Staff Response SLA Breaches Audit", code: "REP-A-904", size: "1.8 MB", date: "June 05, 2026" },
              { title: "Annual Safety Compliance Report", code: "REP-Y-002", size: "22.5 MB", date: "May 20, 2026" }
            ].map((report, idx) => (
              <div key={idx} className="glass-card" style={{ padding: "0.85rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontWeight: "700", fontSize: "0.82rem", display: "block" }}>{report.title}</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    Code: <strong style={{ color: "var(--text-main)", fontFamily: "monospace" }}>{report.code}</strong> • {report.date}
                  </span>
                </div>
                <div className="flex-gap">
                  <button 
                    onClick={() => alert(`Downloading Document: ${report.code}`)}
                    className="pagination-btn" 
                    style={{ padding: "4px 8px", fontSize: "0.72rem", background: "rgba(255,255,255,0.03)" }}
                  >
                    PDF ({report.size})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
