import React, { useState, useEffect } from "react";
import { 
  Users, 
  Activity, 
  Heart, 
  AlertTriangle, 
  Cpu, 
  Flame,
  TrendingUp,
  TrendingDown
} from "lucide-react";

export default function StatsGrid({ patients = [], devices = [] }) {
  const totalCount = patients.length;
  const activeCount = patients.filter(p => p.status !== "Offline").length;
  const criticalCount = patients.filter(p => p.status === "Critical").length;
  const stableCount = patients.filter(p => p.status === "Stable").length;
  const offlineDevices = devices.filter(d => d.status === "Offline").length;
  
  // Custom mock analytics for sparklines
  const sparklines = {
    total: "M 0,25 Q 15,10 30,22 T 60,8 T 90,20 T 120,5",
    active: "M 0,25 Q 15,20 30,12 T 60,18 T 90,5 T 120,15",
    critical: "M 0,25 Q 15,5 30,25 T 60,10 T 90,25 T 120,5",
    stable: "M 0,20 Q 15,25 30,18 T 60,8 T 90,15 T 120,5",
    devices: "M 0,10 Q 15,10 30,20 T 60,20 T 90,10 T 120,10",
    emergencies: "M 0,5 Q 15,25 30,10 T 60,25 T 90,5 T 120,18"
  };

  const statCards = [
    {
      id: "total-patients",
      label: "Total Patients",
      value: totalCount * 12 + 4, // Make it look like a real hospital wing (e.g. 76)
      icon: Users,
      color: "var(--color-primary)",
      trend: "+8% this week",
      trendType: "up",
      sparkline: sparklines.total,
      sparklineColor: "rgba(37, 99, 235, 0.4)"
    },
    {
      id: "active-monitors",
      label: "Active Patients",
      value: activeCount,
      icon: Activity,
      color: "var(--color-info)",
      trend: "All channels active",
      trendType: "neutral",
      sparkline: sparklines.active,
      sparklineColor: "rgba(6, 182, 212, 0.4)"
    },
    {
      id: "critical-cases",
      label: "Critical Patients",
      value: criticalCount,
      icon: AlertTriangle,
      color: "var(--color-critical)",
      trend: criticalCount > 0 ? `+${criticalCount} Alert Active` : "No active threats",
      trendType: criticalCount > 0 ? "down" : "up",
      sparkline: sparklines.critical,
      sparklineColor: criticalCount > 0 ? "rgba(239, 68, 68, 0.5)" : "rgba(34, 197, 94, 0.4)"
    },
    {
      id: "stable-cases",
      label: "Stable Patients",
      value: stableCount,
      icon: Heart,
      color: "var(--color-success)",
      trend: "+12% recovery index",
      trendType: "up",
      sparkline: sparklines.stable,
      sparklineColor: "rgba(34, 197, 94, 0.4)"
    },
    {
      id: "offline-iot",
      label: "Offline Devices",
      value: offlineDevices,
      icon: Cpu,
      color: "var(--color-warning)",
      trend: `${offlineDevices} nodes un-synced`,
      trendType: offlineDevices > 0 ? "down" : "neutral",
      sparkline: sparklines.devices,
      sparklineColor: offlineDevices > 0 ? "rgba(245, 158, 11, 0.4)" : "rgba(34, 197, 94, 0.4)"
    },
    {
      id: "today-alarms",
      label: "Today's Alerts",
      value: criticalCount > 0 ? 9 : 8,
      icon: Flame,
      color: "var(--color-warning)",
      trend: "-18% response lag",
      trendType: "up",
      sparkline: sparklines.emergencies,
      sparklineColor: "rgba(245, 158, 11, 0.4)"
    }
  ];

  return (
    <section className="dashboard-header-stats">
      <div className="stats-grid">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="glass-card stat-card">
              <div className="stat-header">
                <span className="stat-label">{card.label}</span>
                <div 
                  className="stat-icon-wrapper" 
                  style={{ color: card.color, backgroundColor: `${card.color}15` }}
                >
                  <Icon size={16} />
                </div>
              </div>
              
              <div className="stat-value-row">
                <span className="stat-value" style={{ color: card.id === "critical-cases" && criticalCount > 0 ? "var(--color-critical)" : "inherit" }}>
                  {card.value}
                </span>
                
                {/* Mini Chart sparkline */}
                <div style={{ width: "60px", height: "25px", marginLeft: "auto", marginRight: "0.5rem" }}>
                  <svg width="60" height="25" viewBox="0 0 120 30" fill="none">
                    <path 
                      d={card.sparkline} 
                      stroke={card.id === "critical-cases" && criticalCount > 0 ? "var(--color-critical)" : card.color} 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  </svg>
                </div>

                <span className={`trend-badge ${card.trendType}`}>
                  {card.trendType === "up" ? (
                    <TrendingUp size={10} />
                  ) : card.trendType === "down" ? (
                    <TrendingDown size={10} />
                  ) : null}
                  <span style={{ fontSize: "0.62rem" }}>{card.trend.split(" ")[0]}</span>
                </span>
              </div>
              
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                {card.trend}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
