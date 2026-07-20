import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import EmergencyPopup from "./components/EmergencyPopup";

// Import Pages
import Dashboard from "./pages/Dashboard";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import PatientHistoryPage from "./pages/PatientHistoryPage";
import ReportsPage from "./pages/ReportsPage";
import WardOverviewPage from "./pages/WardOverviewPage";
import EmergencyTimeline from "./pages/EmergencyTimeline";
import DeviceHealthPage from "./pages/DeviceHealthPage";
import StaffManagementPage from "./pages/StaffManagementPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import HelpPage from "./pages/HelpPage";

// Import Mock Data
import { mockPatients, mockDevices, mockHistory } from "./mockData";
import { ShieldCheck, Flame, Radio } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [theme, setTheme] = useState("light");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Clinical States
  const [patients, setPatients] = useState(mockPatients);
  const [activePatientId, setActivePatientId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activeCriticalPatient, setActiveCriticalPatient] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Firestore Placeholder States
  const [firestoreEmergency, setFirestoreEmergency] = useState(false);
  const [firestoreBuzzerStatus, setFirestoreBuzzerStatus] = useState("OFF");
  const [firestorePatientStatus, setFirestorePatientStatus] = useState("Stable");

  // Theme Sync effect
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
    showToast("Theme changed successfully", "info");
  };

  // Toast notification helper
  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Compute if Emergency Alert should trigger
  const isEmergencyActive = 
    (firestoreEmergency === true || 
     firestoreBuzzerStatus === "ON" || 
     firestorePatientStatus === "Critical") && 
    firestoreBuzzerStatus !== "OFF";

  // Firestore alert synchronization
  useEffect(() => {
    if (isEmergencyActive) {
      const liveP = patients.find(p => p.isLiveESP32) || patients[0];
      const nextCritical = {
        ...liveP,
        status: "Critical",
        heartRate: 124,
        spo2: 88,
        temperature: 101.8
      };
      
      // Force patient data status update
      setPatients(prev => prev.map(p => {
        if (p.isLiveESP32) {
          return {
            ...p,
            status: "Critical",
            heartRate: 124,
            spo2: 88,
            temperature: 101.8,
            lastUpdated: "Just Now"
          };
        }
        return p;
      }));

      setActiveCriticalPatient(nextCritical);

      // Add code red alert notification
      const notifTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newNotif = {
        type: "Code Red: Firestore Critical Trigger",
        name: liveP.name,
        room: liveP.room,
        time: notifTime,
        status: "critical"
      };
      setNotifications(prev => {
        if (prev.some(n => n.type === newNotif.type)) return prev;
        return [newNotif, ...prev];
      });

      showToast(`CRITICAL BREACH: Room ${liveP.room} Bed A`, "warning");
    } else {
      setActiveCriticalPatient(null);
      // Revert Live Patient back to normal
      setPatients(prev => prev.map(p => {
        if (p.isLiveESP32 && p.status === "Critical") {
          return {
            ...p,
            status: "Stable",
            heartRate: 76,
            spo2: 98,
            temperature: 98.6,
            lastUpdated: "Just Now"
          };
        }
        return p;
      }));
      setNotifications([]);
    }
  }, [firestoreEmergency, firestoreBuzzerStatus, firestorePatientStatus]);

  // Live IoT Vital Simulation loop (fluctuates ALL patients)
  useEffect(() => {
    const interval = setInterval(() => {
      setPatients(prevPatients => {
        return prevPatients.map(patient => {
          // If this is the Live patient and Firestore triggered alert is active
          if (patient.isLiveESP32 && isEmergencyActive) {
            const nextHr = 120 + Math.floor(Math.random() * 8);
            const nextSpo2 = 86 + Math.floor(Math.random() * 4);
            const nextTemp = Number((101.4 + (Math.random() * 0.6)).toFixed(1));
            
            // Sync overlay details
            setActiveCriticalPatient(prev => prev ? { ...prev, heartRate: nextHr, spo2: nextSpo2, temperature: nextTemp } : null);
            
            return {
              ...patient,
              heartRate: nextHr,
              spo2: nextSpo2,
              temperature: nextTemp,
              status: "Critical",
              lastUpdated: "Just Now"
            };
          }

          // Otherwise standard slight fluctuation for all beds (Live and Mock)
          let nextHr = patient.heartRate;
          let nextSpo2 = patient.spo2;
          let nextTemp = patient.temperature;

          // Fluctuate Heart Rate (+/- 1 bpm) between 60 and 96
          nextHr = patient.heartRate + (Math.random() > 0.5 ? 1 : -1);
          if (nextHr < 60) nextHr = 62;
          if (nextHr > 96) nextHr = 94;

          // Fluctuate SpO2 (+/- 1) between 95 and 100
          nextSpo2 = patient.spo2 + (Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0);
          if (nextSpo2 < 95) nextSpo2 = 96;
          if (nextSpo2 > 100) nextSpo2 = 100;

          // Fluctuate Temperature slightly
          const baseTemp = patient.status === "Critical" ? 101.8 : (patient.status === "Warning" ? 100.2 : 98.4);
          const drift = Number(((Math.random() * 0.15) * (Math.random() > 0.5 ? 1 : -1)).toFixed(1));
          nextTemp = Number((baseTemp + drift).toFixed(1));

          return {
            ...patient,
            heartRate: nextHr,
            spo2: nextSpo2,
            temperature: nextTemp,
            lastUpdated: "Just Now"
          };
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isEmergencyActive]);

  // Acknowledge alarm
  const handleAcknowledgeAlert = () => {
    showToast("Audible Code Red alarms silenced. Dispatch logs updated.", "info");
  };

  // Resolve code red emergency
  const handleResolveAlert = () => {
    if (activeCriticalPatient) {
      const resolvedPatientId = activeCriticalPatient.id;
      
      setPatients(prev => prev.map(p => {
        if (p.id === resolvedPatientId) {
          return {
            ...p,
            status: "Stable",
            heartRate: 76,
            spo2: 98,
            temperature: 98.6
          };
        }
        return p;
      }));

      // Log to history audit trail
      const auditLog = {
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        patientId: activeCriticalPatient.id,
        patientName: activeCriticalPatient.name,
        vitalType: "Tachycardia / Hypoxia",
        value: `HR ${activeCriticalPatient.heartRate} / SpO2 ${activeCriticalPatient.spo2}%`,
        status: "Stable",
        responseTime: "32s",
        statusResolved: "Central Console Override"
      };
      
      mockHistory.unshift(auditLog);
      
      // Reset Firestore placeholder states which will trigger useEffect to clean up alert overlay
      setFirestoreEmergency(false);
      setFirestoreBuzzerStatus("OFF");
      setFirestorePatientStatus("Stable");
      
      showToast("Emergency resolved. Vital baselines restored.", "success");
    }
  };

  // Switch to details page helper
  const handleSelectPatient = (patient) => {
    setActivePatientId(patient.id);
    setCurrentTab("patient-details");
    showToast(`Accessing file: ${patient.name}`, "info");
  };

  // Simulate manual emergency trigger
  const handleManualTriggerEmergency = () => {
    if (activeCriticalPatient) {
      showToast("An alarm is already active.", "warning");
      return;
    }
    setSecondsSinceStart(20); // Forces immediate simulation trigger on next tick
    showToast("Injecting emergency vitals into ESP32 simulator...", "warning");
  };

  // Routing render switcher
  const renderTabContent = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <Dashboard 
            patients={patients} 
            onSelectPatient={handleSelectPatient}
            recentHistory={mockHistory}
            activeCriticalPatient={activeCriticalPatient}
          />
        );
      case "live-patients":
        return (
          <Dashboard 
            patients={patients} 
            onSelectPatient={handleSelectPatient}
            recentHistory={mockHistory}
            activeCriticalPatient={activeCriticalPatient}
          />
        );
      case "patient-details":
        return (
          <PatientDetailsPage 
            patients={patients} 
            activePatientId={activePatientId} 
            onBack={() => setCurrentTab("dashboard")}
            onAddNotes={(id, notes) => {
              showToast("Bedside nursing logs updated.", "success");
            }}
          />
        );
      case "patient-history":
        return <PatientHistoryPage />;
      case "reports":
        return <ReportsPage />;
      case "ward-overview":
        return (
          <WardOverviewPage 
            patients={patients} 
            onSelectPatient={handleSelectPatient} 
          />
        );
      case "emergency-timeline":
        return <EmergencyTimeline />;
      case "device-health":
        return <DeviceHealthPage />;
      case "staff-management":
        return <StaffManagementPage />;
      case "settings":
        return <SettingsPage theme={theme} toggleTheme={toggleTheme} />;
      case "profile":
        return <ProfilePage />;
      case "help":
        return <HelpPage />;
      case "emergency-alerts":
        return (
          <div className="page-container" style={{ animation: "fadeIn 0.3s ease", maxWidth: "800px" }}>
            <div className="glass-panel" style={{ padding: "2rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "0.5rem" }}>Mock Firestore & Live API Control Board</h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "1.5rem" }}>
                Simulate remote Firestore updates or serial buzzer states from connected hospital edge devices. Turn buzzer status to ON or Patient status to Critical to trigger alerts. Turn buzzer status to OFF to suppress everything.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                
                {/* State Toggles Card */}
                <div className="glass-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ fontWeight: "700", borderBottom: "1px solid var(--border-glass-light)", paddingBottom: "0.5rem" }}>Firestore Values</h4>
                  
                  {/* Emergency Toggle */}
                  <div className="flex-between">
                    <div>
                      <span style={{ fontWeight: "600", fontSize: "0.85rem" }}>Emergency Flag</span>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Firestore field: <code>Emergency</code></span>
                    </div>
                    <button
                      className="pagination-btn"
                      onClick={() => setFirestoreEmergency(!firestoreEmergency)}
                      style={{
                        background: firestoreEmergency ? "var(--color-critical)" : "transparent",
                        color: firestoreEmergency ? "white" : "var(--text-main)",
                        borderColor: firestoreEmergency ? "var(--color-critical)" : "var(--border-glass)",
                        padding: "4px 12px"
                      }}
                    >
                      {firestoreEmergency ? "TRUE" : "FALSE"}
                    </button>
                  </div>

                  {/* Buzzer Status Toggle */}
                  <div className="flex-between" style={{ borderTop: "1px solid var(--border-glass-light)", paddingTop: "0.75rem" }}>
                    <div>
                      <span style={{ fontWeight: "600", fontSize: "0.85rem" }}>Buzzer Status</span>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Firestore field: <code>Buzzer</code></span>
                    </div>
                    <div className="flex-gap">
                      {["ON", "OFF", "STANDBY"].map(status => (
                        <button
                          key={status}
                          className="pagination-btn"
                          onClick={() => setFirestoreBuzzerStatus(status)}
                          style={{
                            background: firestoreBuzzerStatus === status ? 
                              (status === "ON" ? "var(--color-critical)" : status === "OFF" ? "var(--color-success)" : "var(--color-warning)") 
                              : "transparent",
                            color: firestoreBuzzerStatus === status ? "white" : "var(--text-main)",
                            borderColor: firestoreBuzzerStatus === status ? "transparent" : "var(--border-glass)",
                            padding: "4px 8px",
                            fontSize: "0.75rem"
                          }}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Patient Status Toggle */}
                  <div className="flex-between" style={{ borderTop: "1px solid var(--border-glass-light)", paddingTop: "0.75rem" }}>
                    <div>
                      <span style={{ fontWeight: "600", fontSize: "0.85rem" }}>Live Patient Status</span>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Firestore field: <code>Status</code></span>
                    </div>
                    <div className="flex-gap">
                      {["Stable", "Warning", "Critical"].map(status => (
                        <button
                          key={status}
                          className="pagination-btn"
                          onClick={() => setFirestorePatientStatus(status)}
                          style={{
                            background: firestorePatientStatus === status ? 
                              (status === "Critical" ? "var(--color-critical)" : status === "Warning" ? "var(--color-warning)" : "var(--color-success)") 
                              : "transparent",
                            color: firestorePatientStatus === status ? "white" : "var(--text-main)",
                            borderColor: firestorePatientStatus === status ? "transparent" : "var(--border-glass)",
                            padding: "4px 8px",
                            fontSize: "0.75rem"
                          }}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Live Console Output Card */}
                <div 
                  className="glass-card" 
                  style={{ 
                    padding: "1.5rem", 
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "space-between",
                    border: `1.5px solid ${isEmergencyActive ? "var(--color-critical)" : "var(--border-glass)"}`,
                    boxShadow: isEmergencyActive ? "var(--shadow-glow-red)" : "none"
                  }}
                >
                  <div>
                    <h4 style={{ fontWeight: "700", borderBottom: "1px solid var(--border-glass-light)", paddingBottom: "0.5rem" }}>Trigger Logic Result</h4>
                    
                    <div style={{ marginTop: "1rem", fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <div>
                        <span style={{ color: "var(--text-muted)" }}>1. (Emergency == TRUE): </span>
                        <strong className={firestoreEmergency ? "text-critical" : "text-success"}>{firestoreEmergency ? "MATCH" : "NO"}</strong>
                      </div>
                      <div>
                        <span style={{ color: "var(--text-muted)" }}>2. (Buzzer == ON): </span>
                        <strong className={firestoreBuzzerStatus === "ON" ? "text-critical" : "text-success"}>{firestoreBuzzerStatus === "ON" ? "MATCH" : "NO"}</strong>
                      </div>
                      <div>
                        <span style={{ color: "var(--text-muted)" }}>3. (Patient == Critical): </span>
                        <strong className={firestorePatientStatus === "Critical" ? "text-critical" : "text-success"}>{firestorePatientStatus === "Critical" ? "MATCH" : "NO"}</strong>
                      </div>
                      <div style={{ borderTop: "1px dashed var(--border-glass)", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                        <span style={{ color: "var(--text-muted)" }}>Suppressor (Buzzer == OFF): </span>
                        <strong className={firestoreBuzzerStatus === "OFF" ? "text-success" : "text-muted"}>{firestoreBuzzerStatus === "OFF" ? "SUPPRESSED" : "INACTIVE"}</strong>
                      </div>
                    </div>
                  </div>

                  <div 
                    style={{ 
                      padding: "0.75rem", 
                      borderRadius: "8px", 
                      background: isEmergencyActive ? "rgba(220, 38, 38, 0.08)" : "rgba(22, 163, 74, 0.08)",
                      color: isEmergencyActive ? "var(--color-critical)" : "var(--color-success)",
                      textAlign: "center",
                      fontWeight: "800",
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      marginTop: "1rem"
                    }}
                  >
                    {isEmergencyActive ? (
                      <>
                        <Flame size={16} style={{ animation: "heartBeat 1s infinite" }} />
                        <span>CODE RED: ALARMS TRIGGERS ACTIVATED</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>NORMAL MONITORING STAGE ACTIVE</span>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard patients={patients} onSelectPatient={handleSelectPatient} recentHistory={mockHistory} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />

      {/* Main Panel Area */}
      <div className="main-wrapper">
        <Navbar 
          currentTab={currentTab} 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed} 
          theme={theme} 
          toggleTheme={toggleTheme} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
        />
        
        {/* Core Rendered Page */}
        {renderTabContent()}
      </div>

      {/* Fullscreen Code Red Alert Popup Overlay */}
      {activeCriticalPatient && (
        <EmergencyPopup 
          patient={activeCriticalPatient} 
          onAcknowledge={handleAcknowledgeAlert} 
          onResolve={handleResolveAlert} 
        />
      )}

      {/* Global Toast Alerts Stack */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === "success" ? <ShieldCheck size={16} /> : <Flame size={16} />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
