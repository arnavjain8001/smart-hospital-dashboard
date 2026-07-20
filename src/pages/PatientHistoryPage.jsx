import React, { useState } from "react";
import { Search, Download, ChevronLeft, ChevronRight, Calendar, Filter } from "lucide-react";
import { mockHistory } from "../mockData";

export default function PatientHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter logs
  const filteredLogs = mockHistory.filter((log) => {
    const matchesSearch = log.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.vitalType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" ? true : log.status === statusFilter;
    const matchesDate = dateFilter === "" ? true : log.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Paginate logs
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

  const handleExport = (type) => {
    alert(`Generating export bundle... \nFormat: ${type.toUpperCase()}\nTelemetry logs retrieved: ${filteredLogs.length} rows.\n\nFile saved to: C:\\Downloads\\Hospital_Audit_Logs_${new Date().toISOString().slice(0,10)}.${type}`);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Critical": return "critical";
      case "Warning": return "warning";
      default: return "stable";
    }
  };

  return (
    <div className="page-container" style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Search and Filters row */}
      <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "800" }}>Telemetry Alarm Archives</h2>
          
          <div className="flex-gap">
            <button 
              className="pagination-btn" 
              onClick={() => handleExport("xlsx")} 
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem" }}
            >
              <Download size={14} />
              Export Excel
            </button>
            <button 
              className="pagination-btn" 
              onClick={() => handleExport("pdf")} 
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", background: "var(--color-primary)", color: "white", borderColor: "var(--color-primary)" }}
            >
              <Download size={14} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Input fields */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <Search 
              size={16} 
              style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} 
            />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by Patient ID, Name, Vital Violation..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ paddingLeft: "2.3rem" }}
            />
          </div>

          {/* Status filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Filter size={14} className="text-muted" />
            <select 
              className="form-select" 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="All">All Severity Levels</option>
              <option value="Stable">Stable (Resolved)</option>
              <option value="Warning">Warning (Observation)</option>
              <option value="Critical">Critical (Code Red)</option>
            </select>
          </div>

          {/* Date Picker */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Calendar size={14} className="text-muted" />
            <input 
              type="date" 
              className="form-input" 
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>
      </div>

      {/* History logs Table */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        {filteredLogs.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem" }}>
            No diagnostic violations logged under these filters.
          </div>
        ) : (
          <>
            <div className="clinical-table-wrapper">
              <table className="clinical-table">
                <thead>
                  <tr>
                    <th>Log Date</th>
                    <th>Time (GMT+5:30)</th>
                    <th>Patient ID</th>
                    <th>Patient Name</th>
                    <th>Metric Violated</th>
                    <th>Peak Value</th>
                    <th>Severity Status</th>
                    <th>Response Time</th>
                    <th>Resolved Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLogs.map((log, idx) => (
                    <tr key={idx}>
                      <td>{log.date}</td>
                      <td style={{ fontFamily: "monospace" }}>{log.time}</td>
                      <td style={{ fontFamily: "monospace" }}>{log.patientId}</td>
                      <td style={{ fontWeight: "700" }}>{log.patientName}</td>
                      <td>{log.vitalType}</td>
                      <td style={{ fontWeight: "700", fontFamily: "monospace" }} className={log.status === "Critical" ? "text-critical" : "text-warning"}>
                        {log.value}
                      </td>
                      <td>
                        <span className={`bed-dot-indicator ${getStatusClass(log.status)}`} style={{ padding: "2px 8px", fontSize: "0.72rem" }}>
                          {log.status === "Critical" ? "Code Red" : log.status === "Warning" ? "Observation" : "Stable"}
                        </span>
                      </td>
                      <td>{log.responseTime}</td>
                      <td className="text-success" style={{ fontWeight: "500" }}>{log.statusResolved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="pagination-row">
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLogs.length)} of {filteredLogs.length} audit logs
              </span>
              
              <div className="flex-gap">
                <button 
                  className="pagination-btn" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={14} style={{ verticalAlign: "middle" }} /> Previous
                </button>
                
                <span style={{ padding: "0.4rem 0.8rem", fontSize: "0.82rem" }}>
                  Page {currentPage} of {totalPages}
                </span>

                <button 
                  className="pagination-btn" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight size={14} style={{ verticalAlign: "middle" }} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
