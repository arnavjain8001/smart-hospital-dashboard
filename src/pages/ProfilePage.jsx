import React, { useState } from "react";
import { User, Shield, Key, Building, Check, Mail, Phone, Edit, Calendar } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Dr. Sarah Jenkins",
    role: "Chief Medical Officer",
    hospital: "Apollo Hospitals Multi-Specialty Wing",
    department: "Cardiovascular Surgery / Intensive Care Unit",
    id: "CMO-90823",
    email: "s.jenkins@apollohospitals.med",
    phone: "+91 98450 12345",
    joinedDate: "October 12, 2021"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile.name);
  const [editedPhone, setEditedPhone] = useState(profile.phone);
  const [passwordState, setPasswordState] = useState({ current: "", newPassword: "", confirm: "" });
  const [msg, setMsg] = useState("");

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setProfile(prev => ({ ...prev, name: editedName, phone: editedPhone }));
    setIsEditing(false);
    setMsg("Profile details updated.");
    setTimeout(() => setMsg(""), 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordState.newPassword !== passwordState.confirm) {
      alert("New password and confirmation fields do not match.");
      return;
    }
    setMsg("Security password changed successfully.");
    setPasswordState({ current: "", newPassword: "", confirm: "" });
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="page-container" style={{ animation: "fadeIn 0.3s ease", maxWidth: "800px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Profile Card */}
        <div className="glass-panel" style={{ padding: "2rem", display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <img 
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200" 
            alt="Doctor Avatar" 
            style={{ width: "90px", height: "90px", borderRadius: "12px", objectFit: "cover", border: "2px solid var(--color-primary)" }}
          />
          <div>
            <span className="badge-live-iot" style={{ fontSize: "0.62rem", marginBottom: "0.4rem" }}>
              Central Administrator
            </span>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800" }}>{profile.name}</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              {profile.role} • <strong style={{ color: "var(--color-primary)" }}>{profile.id}</strong>
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {profile.hospital}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          
          {/* Edit Profile Panel */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <User size={16} className="text-primary" />
              Administrative Credentials
            </h3>
            
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.82rem" }}>
                <div>
                  <label style={{ display: "block", color: "var(--text-muted)", marginBottom: "0.2rem" }}>Full Name</label>
                  <input type="text" className="form-input" value={editedName} onChange={(e) => setEditedName(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: "block", color: "var(--text-muted)", marginBottom: "0.2rem" }}>Contact Phone</label>
                  <input type="text" className="form-input" value={editedPhone} onChange={(e) => setEditedPhone(e.target.value)} required />
                </div>
                <div className="flex-gap" style={{ marginTop: "0.5rem" }}>
                  <button type="submit" className="btn-emergency resolve" style={{ padding: "4px 10px", fontSize: "0.75rem" }}>Save</button>
                  <button type="button" className="pagination-btn" style={{ padding: "4px 10px", fontSize: "0.75rem" }} onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.82rem" }}>
                <div className="flex-between">
                  <span className="text-muted">Attending Wing:</span>
                  <span style={{ fontWeight: "600" }}>{profile.department}</span>
                </div>
                <div className="flex-between" style={{ borderTop: "1px solid var(--border-glass-light)", paddingTop: "0.5rem" }}>
                  <span className="text-muted">Clinical Pager:</span>
                  <span style={{ fontWeight: "600" }}>{profile.phone}</span>
                </div>
                <div className="flex-between" style={{ borderTop: "1px solid var(--border-glass-light)", paddingTop: "0.5rem" }}>
                  <span className="text-muted">Security Email:</span>
                  <span style={{ fontWeight: "600" }}>{profile.email}</span>
                </div>
                <div className="flex-between" style={{ borderTop: "1px solid var(--border-glass-light)", paddingTop: "0.5rem" }}>
                  <span className="text-muted">Joined Date:</span>
                  <span>{profile.joinedDate}</span>
                </div>
                
                <button 
                  className="pagination-btn"
                  onClick={() => setIsEditing(true)}
                  style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", width: "100%", justifyContent: "center" }}
                >
                  <Edit size={12} />
                  Edit Contact Details
                </button>
              </div>
            )}
          </div>

          {/* Change Password Panel */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Key size={16} className="text-warning" />
              Security Password Check
            </h3>
            
            <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.82rem" }}>
              <div>
                <label style={{ display: "block", color: "var(--text-muted)", marginBottom: "0.2rem" }}>Current Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={passwordState.current} 
                  onChange={(e) => setPasswordState(prev => ({ ...prev, current: e.target.value }))}
                  required 
                />
              </div>
              <div>
                <label style={{ display: "block", color: "var(--text-muted)", marginBottom: "0.2rem" }}>New Console Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={passwordState.newPassword} 
                  onChange={(e) => setPasswordState(prev => ({ ...prev, newPassword: e.target.value }))}
                  required 
                />
              </div>
              <div>
                <label style={{ display: "block", color: "var(--text-muted)", marginBottom: "0.2rem" }}>Confirm Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={passwordState.confirm} 
                  onChange={(prev) => setPasswordState(prev => ({ ...prev, confirm: prev.target.value }))}
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                className="btn-emergency resolve" 
                style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", fontSize: "0.75rem", width: "100%" }}
              >
                Change Console Password
              </button>
            </form>
          </div>

        </div>

        {/* Status notification */}
        {msg && (
          <p style={{ color: "var(--color-success)", fontSize: "0.8rem", textAlign: "center", fontWeight: "600" }}>
            {msg}
          </p>
        )}

      </div>
    </div>
  );
}
