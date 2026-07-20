// Mock Data for the Smart Patient Live Monitoring & Emergency Alert System

export const mockPatients = [
  {
    id: "PAT-8402",
    name: "Alex Mercer",
    age: 48,
    gender: "Male",
    room: "ICU-101",
    bed: "Bed-A",
    heartRate: 78,
    spo2: 98,
    temperature: 98.6,
    status: "Stable", // Stable, Warning, Critical
    isLiveESP32: true, // Mark only this one as hardware connected!
    lastUpdated: "Just Now",
    medicalSummary: "Post-operative cardiovascular tracking. Coronary artery bypass graft (CABG) recovery. Monitoring for arrhythmias or sudden vital drops.",
    assignedDoctor: "Dr. Sarah Jenkins",
    assignedNurse: "Nurse David Miller",
    medicalNotes: "Maintain continuous cardiac monitoring. Administer Metoprolol 25mg at 20:00. Check arterial line dressing every shift. Report immediately if SpO2 drops below 92% or HR exceeds 110 bpm.",
    medications: [
      { name: "Metoprolol Succinate ER", dosage: "25 mg", schedule: "Once daily (Evening)", type: "Beta Blocker" },
      { name: "Aspirin", dosage: "81 mg", schedule: "Once daily (Morning)", type: "Antiplatelet" },
      { name: "Atorvastatin", dosage: "40 mg", schedule: "Once daily (Bedtime)", type: "Statin" }
    ],
    emergencyHistory: [
      { date: "2026-07-15", time: "14:22", type: "Arrhythmia Alert", duration: "2m 14s", outcome: "Resolved via Medication adjustment" }
    ],
    previousReports: [
      { id: "REP-902", title: "ECG Summary Report", date: "2026-07-16", doctor: "Dr. Sarah Jenkins" },
      { id: "REP-884", title: "Post-Op Cardiac Echo", date: "2026-07-14", doctor: "Dr. Robert Vance" }
    ]
  },
  {
    id: "PAT-3920",
    name: "Eleanor Vance",
    age: 72,
    gender: "Female",
    room: "ICU-102",
    bed: "Bed-B",
    heartRate: 94,
    spo2: 95,
    temperature: 100.2,
    status: "Warning",
    isLiveESP32: false,
    lastUpdated: "2 mins ago",
    medicalSummary: "Severe acute respiratory syndrome secondary to bacterial pneumonia. Put on high-flow nasal cannula therapy.",
    assignedDoctor: "Dr. Gregory House",
    assignedNurse: "Nurse Emily Rose",
    medicalNotes: "Keep oxygen flow at 15L/min. Sputum culture results pending. Monitor respiratory effort closely.",
    medications: [
      { name: "Ceftriaxone", dosage: "1 g", schedule: "IV every 12 hours", type: "Antibiotic" },
      { name: "Albuterol Nebulizer", dosage: "2.5 mg", schedule: "Every 4 hours PRN", type: "Bronchodilator" }
    ],
    emergencyHistory: [
      { date: "2026-07-16", time: "03:10", type: "Desaturation Alert (SpO2 88%)", duration: "4m 5s", outcome: "Oxygen flow adjusted, stabilized" }
    ],
    previousReports: [
      { id: "REP-793", title: "Chest X-Ray Digital View", date: "2026-07-16", doctor: "Dr. Emily Zhang" }
    ]
  },
  {
    id: "PAT-1104",
    name: "Marcus Aurelius",
    age: 61,
    gender: "Male",
    room: "ICU-105",
    bed: "Bed-A",
    heartRate: 118,
    spo2: 89,
    temperature: 102.4,
    status: "Critical",
    isLiveESP32: false,
    lastUpdated: "1 min ago",
    medicalSummary: "Septic shock secondary to complicated urinary tract infection. Hemodynamically unstable, currently on low-dose norepinephrine infusion.",
    assignedDoctor: "Dr. Sarah Jenkins",
    assignedNurse: "Nurse David Miller",
    medicalNotes: "Titrate norepinephrine to maintain MAP > 65 mmHg. Strict intake/output charting. Monitor arterial blood gas values every 6 hours.",
    medications: [
      { name: "Meropenem", dosage: "1 g", schedule: "IV every 8 hours", type: "Antibiotic" },
      { name: "Norepinephrine Infusion", dosage: "4 mcg/min", schedule: "Continuous infusion", type: "Vasopressor" }
    ],
    emergencyHistory: [
      { date: "2026-07-17", time: "08:15", type: "Hypotensive Episode (MAP 58)", duration: "6m 12s", outcome: "Norepinephrine drip increased" }
    ],
    previousReports: [
      { id: "REP-911", title: "Blood Culture Initial Panel", date: "2026-07-17", doctor: "Dr. Alan Grant" }
    ]
  },
  {
    id: "PAT-5829",
    name: "Clara Oswald",
    age: 29,
    gender: "Female",
    room: "Ward 4B",
    bed: "Bed-03",
    heartRate: 72,
    spo2: 99,
    temperature: 98.4,
    status: "Stable",
    isLiveESP32: false,
    lastUpdated: "5 mins ago",
    medicalSummary: "Under observation following minor orthopedic surgery. Unremarkable recovery profile, preparing for transfer to general care ward.",
    assignedDoctor: "Dr. Robert Vance",
    assignedNurse: "Nurse Jessica Alba",
    medicalNotes: "Physical therapy session scheduled at 14:00. Encourage mobilization as tolerated. Pain management PRN.",
    medications: [
      { name: "Acetaminophen", dosage: "1000 mg", schedule: "Every 6 hours PRN", type: "Analgesic" }
    ],
    emergencyHistory: [],
    previousReports: [
      { id: "REP-502", title: "Post-Op Joint Alignment X-Ray", date: "2026-07-16", doctor: "Dr. Robert Vance" }
    ]
  },
  {
    id: "PAT-2201",
    name: "Arthur Dent",
    age: 42,
    gender: "Male",
    room: "Ward 4A",
    bed: "Bed-12",
    heartRate: 64,
    spo2: 97,
    temperature: 97.9,
    status: "Stable",
    isLiveESP32: false,
    lastUpdated: "12 mins ago",
    medicalSummary: "Generalized anxiety and severe panic response symptoms mimicking acute myocardial infarction. Under brief observational triage.",
    assignedDoctor: "Dr. Gregory House",
    assignedNurse: "Nurse Jessica Alba",
    medicalNotes: "Reassurance therapy. Keep in a quiet environment. Serial troponin tests negative. Discharge expected by evening.",
    medications: [
      { name: "Lorazepam", dosage: "0.5 mg", schedule: "Sublingual PRN", type: "Anxiolytic" }
    ],
    emergencyHistory: [],
    previousReports: [
      { id: "REP-431", title: "Cardiac Enzymes Serology", date: "2026-07-17", doctor: "Dr. Sarah Jenkins" }
    ]
  },
  {
    id: "PAT-7709",
    name: "Sarah Connor",
    age: 55,
    gender: "Female",
    room: "ICU-108",
    bed: "Bed-A",
    heartRate: 104,
    spo2: 93,
    temperature: 101.5,
    status: "Warning",
    isLiveESP32: false,
    lastUpdated: "3 mins ago",
    medicalSummary: "Exacerbation of chronic obstructive pulmonary disease (COPD) with secondary respiratory acidosis. Non-invasive positive pressure ventilation (BiPAP).",
    assignedDoctor: "Dr. Gregory House",
    assignedNurse: "Nurse Emily Rose",
    medicalNotes: "Maintain BiPAP settings IPAP 12, EPAP 5. Assess skin integrity under mask every 2 hours. Monitor arterial carbon dioxide levels.",
    medications: [
      { name: "Prednisone", dosage: "40 mg", schedule: "Once daily (Morning)", type: "Corticosteroid" },
      { name: "Ipratropium Bromide HFA", dosage: "2 puffs", schedule: "Every 6 hours", type: "Anticholinergic" }
    ],
    emergencyHistory: [
      { date: "2026-07-16", time: "18:40", type: "Hypercapnic Alarm", duration: "3m 30s", outcome: "BiPAP pressure adjusted" }
    ],
    previousReports: [
      { id: "REP-612", title: "Pulmonary Function Diagnostics", date: "2026-07-15", doctor: "Dr. Emily Zhang" }
    ]
  }
];

export const mockStaff = [
  { id: "STF-101", name: "Dr. Sarah Jenkins", role: "Cardiologist", shift: "Day (08:00 - 16:00)", availability: "Available", email: "s.jenkins@hospital.med", phone: "+1 (555) 902-1234", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150" },
  { id: "STF-102", name: "Dr. Gregory House", role: "Diagnostic Specialist", shift: "Flexible", availability: "On Call", email: "g.house@hospital.med", phone: "+1 (555) 238-8900", avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150" },
  { id: "STF-103", name: "Dr. Robert Vance", role: "Orthopedic Surgeon", shift: "Day (08:00 - 16:00)", availability: "Busy", email: "r.vance@hospital.med", phone: "+1 (555) 345-6789", avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150" },
  { id: "STF-201", name: "Nurse David Miller", role: "ICU Lead Nurse", shift: "Night (20:00 - 08:00)", availability: "Available", email: "d.miller@hospital.med", phone: "+1 (555) 890-5432", avatar: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=150" },
  { id: "STF-202", name: "Nurse Emily Rose", role: "Respiratory Therapist Nurse", shift: "Day (08:00 - 16:00)", availability: "Available", email: "e.rose@hospital.med", phone: "+1 (555) 789-0123", avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=150" },
  { id: "STF-203", name: "Nurse Jessica Alba", role: "General Ward Nurse", shift: "Rotational", availability: "Busy", email: "j.alba@hospital.med", phone: "+1 (555) 456-7890", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" }
];

export const mockDevices = [
  { id: "ESP32-ICU-101", name: "ESP32 Patient Hub (Alex)", status: "Online", type: "Gateway Node", battery: 98, wifiSignal: -58, lastSync: "10s ago", firmware: "v2.1.4-build09" },
  { id: "ESP32-ICU-102", name: "ESP32 SpO2 Sensor (Eleanor)", status: "Online", type: "Wearable Node", battery: 72, wifiSignal: -64, lastSync: "12s ago", firmware: "v2.1.3" },
  { id: "ESP32-ICU-105", name: "ESP32 Multi-Vital (Marcus)", status: "Online", type: "Wall-mount Monitor", battery: 100, wifiSignal: -49, lastSync: "25s ago", firmware: "v2.1.4" },
  { id: "ESP32-WARD4B-03", name: "ESP32 Temp Sensor (Clara)", status: "Online", type: "Wearable Node", battery: 84, wifiSignal: -70, lastSync: "3m ago", firmware: "v2.0.9" },
  { id: "ESP32-WARD4A-12", name: "ESP32 Gateway (Arthur)", status: "Offline", type: "Gateway Node", battery: 0, wifiSignal: -99, lastSync: "2 hours ago", firmware: "v2.0.9" },
  { id: "ESP32-ICU-108", name: "ESP32 Respiratory Hub (Sarah)", status: "Online", type: "Wearable Node", battery: 45, wifiSignal: -68, lastSync: "45s ago", firmware: "v2.1.3" }
];

export const mockHistory = [
  { date: "2026-07-17", time: "09:42:15", patientId: "PAT-8402", patientName: "Alex Mercer", vitalType: "Heart Rate", value: "104 bpm", status: "Warning", responseTime: "N/A", statusResolved: "Self-resolved" },
  { date: "2026-07-17", time: "08:15:30", patientId: "PAT-1104", patientName: "Marcus Aurelius", vitalType: "SpO2 / Blood Pressure", value: "89% SpO2 / 85/50 mmHg", status: "Critical", responseTime: "45s", statusResolved: "Doctor Intervened" },
  { date: "2026-07-17", time: "07:30:10", patientId: "PAT-3920", patientName: "Eleanor Vance", vitalType: "Temperature", value: "100.2 °F", status: "Warning", responseTime: "2m 10s", statusResolved: "Cold Compress Administered" },
  { date: "2026-07-16", time: "22:18:40", patientId: "PAT-7709", patientName: "Sarah Connor", vitalType: "Respiratory Rate", value: "28 rpm", status: "Warning", responseTime: "1m 15s", statusResolved: "Inhaler administered" },
  { date: "2026-07-16", time: "18:40:12", patientId: "PAT-7709", patientName: "Sarah Connor", vitalType: "SpO2 Level", value: "87%", status: "Critical", responseTime: "1m 30s", statusResolved: "BiPAP pressure adjusted" },
  { date: "2026-07-16", time: "14:22:05", patientId: "PAT-8402", patientName: "Alex Mercer", vitalType: "Arrhythmia (PVCs)", value: "12 PVCs/min", status: "Warning", responseTime: "2m 14s", statusResolved: "Medication Titrated" },
  { date: "2026-07-15", time: "11:05:50", patientId: "PAT-3920", patientName: "Eleanor Vance", vitalType: "SpO2 Level", value: "88%", status: "Critical", responseTime: "1m 02s", statusResolved: "Nasal Cannula flow increased" },
  { date: "2026-07-15", time: "03:10:14", patientId: "PAT-1104", patientName: "Marcus Aurelius", vitalType: "Heart Rate", value: "135 bpm", status: "Critical", responseTime: "58s", statusResolved: "IV Amiodarone Bolus" }
];

export const mockAlertTimeline = [
  { id: 1, time: "10:07:30 AM", event: "Sensor Triggered", details: "ECG sensor reports Ventricular Tachycardia (165 bpm)", level: "critical" },
  { id: 2, time: "10:07:32 AM", event: "ESP32 Gateway Push", details: "Data pushed to hospital cloud local API gateway", level: "info" },
  { id: 3, time: "10:07:35 AM", event: "Emergency Alert Broadcasted", details: "Audible alarm triggered on Central Ward Station and nurse pagers", level: "critical" },
  { id: 4, time: "10:07:55 AM", event: "Nurse Acknowledged", details: "Nurse David Miller acknowledged alarm at Central Console", level: "warning" },
  { id: 5, time: "10:08:12 AM", event: "Doctor Assigned", details: "Dr. Sarah Jenkins paged to ICU Room 101 bedside", level: "warning" },
  { id: 6, time: "10:09:45 AM", event: "Resolved Time", details: "Bedside emergency push-button pressed. Heart Rate returned to normal sinus rhythm.", level: "stable" }
];

export const mockAnalytics = {
  dailyPerformance: [
    { label: "00:00", activeAlerts: 1, responseTimeSec: 45 },
    { label: "04:00", activeAlerts: 2, responseTimeSec: 58 },
    { label: "08:00", activeAlerts: 5, responseTimeSec: 35 },
    { label: "12:00", activeAlerts: 3, responseTimeSec: 50 },
    { label: "16:00", activeAlerts: 4, responseTimeSec: 42 },
    { label: "20:00", activeAlerts: 2, responseTimeSec: 62 }
  ],
  weeklyVolume: [
    { label: "Mon", emergencies: 12, resolved: 12 },
    { label: "Tue", emergencies: 8, resolved: 8 },
    { label: "Wed", emergencies: 15, resolved: 14 },
    { label: "Thu", emergencies: 6, resolved: 6 },
    { label: "Fri", emergencies: 18, resolved: 18 },
    { label: "Sat", emergencies: 10, resolved: 10 },
    { label: "Sun", emergencies: 4, resolved: 4 }
  ],
  monthlyRates: [
    { name: "Stable Recovery", value: 68 },
    { name: "Transferred Out", value: 22 },
    { name: "ICU Admissions", value: 10 }
  ]
};
