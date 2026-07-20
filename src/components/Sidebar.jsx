import React from "react";
import { 
  LayoutDashboard, 
  Activity, 
  UserSquare2, 
  BellRing, 
  History, 
  FileBarChart2, 
  Grid3x3, 
  Clock, 
  Cpu, 
  Users2, 
  Settings, 
  HelpCircle, 
  User, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Plus
} from "lucide-react";

export default function Sidebar({ currentTab, setCurrentTab, collapsed, setCollapsed }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "live-patients", label: "Live Patients", icon: Activity },
    { id: "patient-details", label: "Patient Details", icon: UserSquare2 },
    { id: "emergency-alerts", label: "Emergency Alerts", icon: BellRing, badge: true },
    { id: "patient-history", label: "Patient History", icon: History },
    { id: "reports", label: "Reports", icon: FileBarChart2 },
    { id: "ward-overview", label: "Ward Overview", icon: Grid3x3 },
    { id: "emergency-timeline", label: "Emergency Timeline", icon: Clock },
    { id: "device-health", label: "Device Health", icon: Cpu },
    { id: "staff-management", label: "Staff Management", icon: Users2 },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help & Support", icon: HelpCircle },
    { id: "profile", label: "Profile", icon: User }
  ];

  return (
    <aside className={`app-sidebar glass-panel ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-icon">
          <Plus size={20} className="text-white" strokeWidth={3} style={{ animation: "heartBeat 2s infinite" }} />
        </div>
        <span className="logo-text">MED MONITOR</span>
      </div>

      <nav style={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`menu-item ${isActive ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentTab(item.id);
                  }}
                >
                  <Icon size={20} />
                  <span className="menu-item-text">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <a 
          href="#logout" 
          className="menu-item" 
          onClick={(e) => {
            e.preventDefault();
            alert("Logging out from Smart Patient Central Console...");
          }}
          style={{ borderTop: "1px solid var(--border-glass-light)", paddingTop: "0.75rem", color: "var(--color-critical)" }}
        >
          <LogOut size={20} />
          <span className="menu-item-text">Logout</span>
        </a>
      </div>
    </aside>
  );
}
