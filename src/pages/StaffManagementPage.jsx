import React, { useState } from "react";
import { Search, Phone, Mail, Stethoscope, UserRound, AlertTriangle, ShieldCheck, HeartPulse } from "lucide-react";
import { mockStaff } from "../mockData";

export default function StaffManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [availFilter, setAvailFilter] = useState("All");

  const filteredStaff = mockStaff.filter((person) => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          person.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Determine type (Doctor vs Nurse)
    const isDoctor = person.role.toLowerCase().includes("doc") || person.role.toLowerCase().includes("cardi") || person.role.toLowerCase().includes("special");
    const matchesRole = roleFilter === "All" ? true :
                        roleFilter === "Doctors" ? isDoctor : !isDoctor;
                        
    const matchesAvail = availFilter === "All" ? true : person.availability === availFilter;
    
    return matchesSearch && matchesRole && matchesAvail;
  });

  const handlePageStaff = (name, role) => {
    alert(`Central Paging System Broadcast!\nTarget: ${name} (${role})\nMessage: EMERGENCY CODE BLUE DISPATCHED\nCoordinates: Central ICU Station Wing-A\n\nPaging transmitter status: CONNECTED`);
  };

  const getAvailClass = (status) => {
    switch (status) {
      case "Available": return "stable";
      case "Busy": return "critical";
      default: return "warning";
    }
  };

  return (
    <div className="page-container" style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "800" }}>Clinical Staff Registry & Rosters</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Real-time shift schedules, clinical assignments, and wireless pager paging links.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.85rem", fontSize: "0.75rem" }}>
          <span className="bed-dot-indicator stable" style={{ padding: "4px 8px" }}>
            Attending Staff: {mockStaff.length}
          </span>
          <span className="bed-dot-indicator stable" style={{ padding: "4px 8px", background: "rgba(34,197,94,0.12)", color: "var(--color-success)" }}>
            Duty Available: {mockStaff.filter(s => s.availability === "Available").length}
          </span>
        </div>
      </div>

      {/* Filter panel */}
      <div className="glass-panel" style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search 
            size={16} 
            style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} 
          />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search staff by Name, ID, or Specialty..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "2.3rem" }}
          />
        </div>

        {/* Role Type Filter */}
        <select 
          className="form-select" 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Staff Roles</option>
          <option value="Doctors">Attending Physicians</option>
          <option value="Nurses">Nursing Team</option>
        </select>

        {/* Availability Filter */}
        <select 
          className="form-select" 
          value={availFilter} 
          onChange={(e) => setAvailFilter(e.target.value)}
        >
          <option value="All">All Availability States</option>
          <option value="Available">Available (On Duty)</option>
          <option value="On Call">On Call (Dispatched)</option>
          <option value="Busy">Busy (In Surgery/ICU)</option>
        </select>
      </div>

      {/* Staff Directory Cards Grid */}
      <div className="patient-grid">
        {filteredStaff.length === 0 ? (
          <div className="glass-card flex-center" style={{ gridColumn: "1 / -1", padding: "3rem", color: "var(--text-muted)", fontSize: "0.88rem" }}>
            No clinical staff registered matching these filters.
          </div>
        ) : (
          filteredStaff.map((person) => {
            const isDoc = person.role.toLowerCase().includes("doc") || person.role.toLowerCase().includes("cardi") || person.role.toLowerCase().includes("special");
            
            return (
              <div key={person.id} className="glass-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Profile header row */}
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <img 
                    src={person.avatar} 
                    alt={person.name} 
                    style={{ width: "50px", height: "50px", borderRadius: "10px", objectFit: "cover", border: "1px solid var(--border-glass)" }}
                  />
                  <div>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: "800" }}>{person.name}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {isDoc ? <Stethoscope size={11} className="text-primary" /> : <UserRound size={11} className="text-info" />}
                      <span>{person.role}</span>
                    </div>
                  </div>
                </div>

                {/* Logistics details */}
                <div style={{ fontSize: "0.76rem", display: "flex", flexDirection: "column", gap: "0.4rem", borderTop: "1px solid var(--border-glass-light)", borderBottom: "1px solid var(--border-glass-light)", padding: "0.6rem 0" }}>
                  <div className="flex-between">
                    <span className="text-muted">Staff ID:</span>
                    <span style={{ fontFamily: "monospace", fontWeight: "700" }}>{person.id}</span>
                  </div>
                  <div className="flex-between">
                    <span className="text-muted">Current Shift:</span>
                    <span>{person.shift}</span>
                  </div>
                  <div className="flex-between">
                    <span className="text-muted">Active Availability:</span>
                    <span className={`bed-dot-indicator ${getAvailClass(person.availability)}`} style={{ padding: "1px 6px", fontSize: "0.65rem" }}>
                      {person.availability}
                    </span>
                  </div>
                </div>

                {/* Direct Contact options */}
                <div style={{ fontSize: "0.75rem", display: "flex", flexDirection: "column", gap: "0.3rem", color: "var(--text-muted)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Phone size={11} />
                    <span>{person.phone}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Mail size={11} />
                    <span>{person.email}</span>
                  </div>
                </div>

                {/* Paging dispatch trigger */}
                <button 
                  className="btn-emergency resolve"
                  onClick={() => handlePageStaff(person.name, person.role)}
                  style={{
                    padding: "6px 12px",
                    fontSize: "0.75rem",
                    width: "100%",
                    background: person.availability === "Busy" ? "rgba(255,255,255,0.05)" : "var(--color-primary)",
                    color: person.availability === "Busy" ? "var(--text-muted)" : "white",
                    borderColor: person.availability === "Busy" ? "var(--border-glass)" : "var(--color-primary)"
                  }}
                  disabled={person.availability === "Busy"}
                >
                  <HeartPulse size={12} />
                  {person.availability === "Busy" ? "Occupied in ICU" : "Broadcast Pager Alert"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
