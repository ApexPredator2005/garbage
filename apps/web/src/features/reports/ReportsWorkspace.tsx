import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  FileSpreadsheet,
  Download,
  Database,
  Filter,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  ShieldCheck,
  Eye,
  Sparkles,
  BookOpen,
  Table,
  Search,
  ChevronRight,
  X,
  Check,
  ArrowUpRight,
  PieChart,
  Activity,
} from 'lucide-react';

interface RegulatoryReport {
  id: string;
  code: string;
  name: string;
  agency: 'NAAC' | 'NBA' | 'NIRF' | 'AISHE';
  description: string;
  cycle: string;
  status: 'READY' | 'GENERATING';
  lastGenerated: string;
  recordCount: number;
}

interface CuratedEntity {
  id: string;
  name: string;
  baseTable: string;
  availableColumns: { key: string; label: string; type: 'string' | 'number' | 'date' }[];
}

const REGULATORY_REPORTS: RegulatoryReport[] = [
  {
    id: 'naac-01',
    code: 'NAAC-SSR-2026',
    name: 'NAAC Self Study Report (SSR Criteria 1 to 7)',
    agency: 'NAAC',
    description:
      'Aggregated institutional metrics covering Curricular Aspects, Teaching-Learning (1:14.2 ratio), Research Output, Infrastructure, and Student Progression.',
    cycle: 'Cycle 3 Re-Accreditation',
    status: 'READY',
    lastGenerated: '2026-10-24 18:20',
    recordCount: 420,
  },
  {
    id: 'nba-01',
    code: 'NBA-TIER1-SAR',
    name: 'NBA Tier-1 Self Assessment Return (OBE Matrix)',
    agency: 'NBA',
    description:
      'Direct and indirect Course Outcome (CO) and Program Outcome (PO) attainment vectors calculated across 24 autonomous engineering courses.',
    cycle: '2024-2027 Accreditation',
    status: 'READY',
    lastGenerated: '2026-10-22 14:10',
    recordCount: 88,
  },
  {
    id: 'nirf-01',
    code: 'NIRF-ENGG-2026',
    name: 'NIRF Engineering Data Return',
    agency: 'NIRF',
    description:
      'Teaching Learning & Resources (TLR), Graduation Outcomes (GO), Median Placement CTC (₹9.2 LPA), and Outreach & Inclusivity returns.',
    cycle: 'Rankings 2026',
    status: 'READY',
    lastGenerated: '2026-10-20 11:30',
    recordCount: 2480,
  },
  {
    id: 'aishe-01',
    code: 'AISHE-MOE-2026',
    name: 'AISHE Ministry of Education Annual Survey',
    agency: 'AISHE',
    description:
      'Statutory Higher Education Census tables: Program enrollment, caste categorization, faculty qualification profiles, and physical facilities.',
    cycle: 'Academic Year 2025-26',
    status: 'READY',
    lastGenerated: '2026-10-18 16:45',
    recordCount: 2654,
  },
];

const CURATED_ENTITIES: CuratedEntity[] = [
  {
    id: 'students',
    name: 'Students & Academic Performance',
    baseTable: 'mv_student_academic_summary',
    availableColumns: [
      { key: 'roll_no', label: 'Roll Number', type: 'string' },
      { key: 'full_name', label: 'Student Name', type: 'string' },
      { key: 'program', label: 'Academic Program', type: 'string' },
      { key: 'semester', label: 'Semester', type: 'string' },
      { key: 'cgpa', label: 'Current CGPA', type: 'number' },
      { key: 'attendance_pct', label: 'Attendance %', type: 'number' },
    ],
  },
  {
    id: 'fees',
    name: 'Fee Collections & Dues Reconciliation',
    baseTable: 'mv_fee_demand_collections',
    availableColumns: [
      { key: 'roll_no', label: 'Roll Number', type: 'string' },
      { key: 'student_name', label: 'Student Name', type: 'string' },
      { key: 'fee_category', label: 'Fee Category', type: 'string' },
      { key: 'assessed_amount', label: 'Assessed Amount', type: 'number' },
      { key: 'paid_amount', label: 'Paid Amount', type: 'number' },
      { key: 'balance_due', label: 'Balance Due', type: 'number' },
    ],
  },
  {
    id: 'faculty',
    name: 'Faculty Workload & Research Credentials',
    baseTable: 'mv_faculty_workload_metrics',
    availableColumns: [
      { key: 'emp_code', label: 'Employee Code', type: 'string' },
      { key: 'faculty_name', label: 'Faculty Name', type: 'string' },
      { key: 'department', label: 'Department', type: 'string' },
      { key: 'weekly_hours', label: 'Teaching Load (Hrs/Wk)', type: 'number' },
      { key: 'scopus_papers', label: 'Scopus Indexed Papers', type: 'number' },
    ],
  },
];

const SAMPLE_QUERY_RESULTS = [
  { roll_no: '2023CSE041', full_name: 'Rahul Sharma', program: 'B.Tech CSE', semester: 'Sem 6', cgpa: 8.92, attendance_pct: 86.6 },
  { roll_no: '2023CSE043', full_name: 'Vikramaditya Verma', program: 'B.Tech CSE', semester: 'Sem 6', cgpa: 9.45, attendance_pct: 93.3 },
  { roll_no: '2023CSE046', full_name: 'Pooja Deshmukh', program: 'B.Tech CSE', semester: 'Sem 6', cgpa: 9.18, attendance_pct: 96.6 },
  { roll_no: '2023CSE045', full_name: 'Karthik Menon', program: 'B.Tech CSE', semester: 'Sem 6', cgpa: 8.12, attendance_pct: 80.0 },
];

export const ReportsWorkspace: React.FC = () => {
  const [subTab, setSubTab] = useState<'kpi' | 'regulatory' | 'query_builder'>('kpi');
  const [generatingReportId, setGeneratingReportId] = useState<string | null>(null);
  const [downloadSuccessReport, setDownloadSuccessReport] = useState<string | null>(null);

  // Query Builder State
  const [selectedEntityId, setSelectedEntityId] = useState('students');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'roll_no',
    'full_name',
    'program',
    'cgpa',
    'attendance_pct',
  ]);
  const [minCgpa, setMinCgpa] = useState('8.0');
  const [filterDept, setFilterDept] = useState('CSE');
  const [hasRunQuery, setHasRunQuery] = useState(true);

  const selectedEntity = useMemo(
    () => CURATED_ENTITIES.find((e) => e.id === selectedEntityId) || CURATED_ENTITIES[0],
    [selectedEntityId]
  );

  // Generate safe parameterized SQL preview
  const generatedSql = useMemo(() => {
    const cols = selectedColumns.length > 0 ? selectedColumns.join(', ') : '*';
    return `SELECT ${cols}\nFROM ${selectedEntity.baseTable}\nWHERE department = $1 AND cgpa >= $2\nORDER BY cgpa DESC\nLIMIT 50;`;
  }, [selectedColumns, selectedEntity, filterDept, minCgpa]);

  // Toggle column selection
  const handleToggleColumn = (colKey: string) => {
    if (selectedColumns.includes(colKey)) {
      if (selectedColumns.length > 1) {
        setSelectedColumns(selectedColumns.filter((c) => c !== colKey));
      }
    } else {
      setSelectedColumns([...selectedColumns, colKey]);
    }
  };

  // Generate compliance package
  const handleGenerateReport = (report: RegulatoryReport) => {
    setGeneratingReportId(report.id);
    setTimeout(() => {
      setGeneratingReportId(null);
      setDownloadSuccessReport(report.name);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Workspace Header */}
      <div className="bg-white rounded-2xl border border-[#E5DFD7] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
              Accreditation Analytics & Curated SQL
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Materialized Views (PostgreSQL 16)
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#242424]">Reports, Regulatory Returns & SQL Builder</h1>
          <p className="text-xs text-[#6E6862]">
            One-click compliance return packages (NAAC, NBA, NIRF, AISHE) and anti-injection parameterized SQL query console.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-xl border border-[#E5DFD7]">
          <button
            onClick={() => setSubTab('kpi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'kpi'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Executive KPIs</span>
          </button>

          <button
            onClick={() => setSubTab('regulatory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'regulatory'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Regulatory Returns</span>
          </button>

          <button
            onClick={() => setSubTab('query_builder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'query_builder'
                ? 'bg-[#682038] text-white shadow-sm'
                : 'text-[#6E6862] hover:bg-[#F4ECE2]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Curated SQL Builder</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: EXECUTIVE KPI DASHBOARD (READ-MODELS) */}
      {subTab === 'kpi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-[#6E6862]">
                <span>Total Enrolled Students</span>
                <span className="font-mono text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">+4.2% YoY</span>
              </div>
              <div className="text-3xl font-bold font-mono text-[#242424]">2,480</div>
              <div className="text-xs text-[#8B5E3C]">Across 6 Academic Programs</div>
              <div className="text-[10px] text-[#6E6862] pt-2 border-t border-[#E5DFD7]">
                Cached view: <code>mv_enrollment_stats</code> (Refreshed 4m ago)
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-[#6E6862]">
                <span>Autonomous Pass Rate</span>
                <span className="font-mono text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">92.4%</span>
              </div>
              <div className="text-3xl font-bold font-mono text-emerald-700">92.4%</div>
              <div className="text-xs text-[#6E6862]">2,291 / 2,480 Cleared End-Sem</div>
              <div className="text-[10px] text-[#6E6862] pt-2 border-t border-[#E5DFD7]">
                Cached view: <code>mv_result_snapshots</code> (Refreshed 12m ago)
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-[#6E6862]">
                <span>Cumulative Fee Realization</span>
                <span className="font-mono text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">94.6%</span>
              </div>
              <div className="text-3xl font-bold font-mono text-[#242424]">₹18.42 Cr</div>
              <div className="text-xs text-[#6E6862]">Assessed Demand: ₹19.47 Cr</div>
              <div className="text-[10px] text-[#6E6862] pt-2 border-t border-[#E5DFD7]">
                Cached view: <code>mv_fee_demand_collections</code> (Refreshed 2m ago)
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-[#6E6862]">
                <span>Doctorate Faculty Ratio</span>
                <span className="font-mono text-[10px] text-[#682038] bg-[#682038]/10 px-1.5 py-0.5 rounded font-bold">64.2%</span>
              </div>
              <div className="text-3xl font-bold font-mono text-[#682038]">64.2%</div>
              <div className="text-xs text-[#6E6862]">112 PhDs among 174 Faculty</div>
              <div className="text-[10px] text-[#6E6862] pt-2 border-t border-[#E5DFD7]">
                Cached view: <code>mv_faculty_profiles</code> (Refreshed 1h ago)
              </div>
            </div>
          </div>

          {/* Institutional Compliance Health Matrix */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[#242424]">Institutional Compliance Metric Targets (NAAC / NBA Tier-1)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DFD7] space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Student-to-Faculty Ratio (SFR)</span>
                  <span className="font-mono font-bold text-emerald-700">1:14.2 (Benchmark: 1:15)</span>
                </div>
                <div className="w-full bg-[#E5DFD7] rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '95%' }} />
                </div>
                <span className="text-[10px] text-[#6E6862]">Complies with AICTE mandatory ratio standards.</span>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DFD7] space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Outcome Attainment (OBE Direct COs)</span>
                  <span className="font-mono font-bold text-emerald-700">81.4% Target Met</span>
                </div>
                <div className="w-full bg-[#E5DFD7] rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '81%' }} />
                </div>
                <span className="text-[10px] text-[#6E6862]">Exceeds NBA threshold of 70% threshold.</span>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DFD7] space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Median Placement Package (NIRF GO)</span>
                  <span className="font-mono font-bold text-[#682038]">₹9.2 LPA</span>
                </div>
                <div className="w-full bg-[#E5DFD7] rounded-full h-2">
                  <div className="bg-[#682038] h-2 rounded-full" style={{ width: '88%' }} />
                </div>
                <span className="text-[10px] text-[#6E6862]">88.2% of eligible graduating batch placed.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: REGULATORY RETURNS ONE-CLICK EXPORTERS */}
      {subTab === 'regulatory' && (
        <div className="space-y-6">
          {downloadSuccessReport && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Return package ready: <strong>{downloadSuccessReport}</strong> generated with digital compliance stamp <code>SHA256:88fa..31</code>.
                </span>
              </div>
              <button
                onClick={() => setDownloadSuccessReport(null)}
                className="text-emerald-900 font-bold hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REGULATORY_REPORTS.map((report) => {
              const isGenerating = generatingReportId === report.id;

              return (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl border border-[#E5DFD7] p-6 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#682038] bg-[#682038]/10 px-2.5 py-0.5 rounded">
                        {report.code}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
                        {report.agency} Statutory Return
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-[#242424]">{report.name}</h3>
                    <p className="text-xs text-[#6E6862] leading-relaxed">{report.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#E5DFD7]">
                    <div className="flex items-center justify-between text-xs text-[#6E6862]">
                      <span>Reporting Cycle: <strong>{report.cycle}</strong></span>
                      <span className="font-mono">Last Generated: {report.lastGenerated}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] text-[#6E6862]">
                        Contains <strong>{report.recordCount}</strong> verified institutional rows
                      </span>

                      <button
                        onClick={() => handleGenerateReport(report)}
                        disabled={isGenerating}
                        className="px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Compiling Data Return...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Export SSR Package</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CURATED SQL QUERY BUILDER (ANTI-INJECTION) */}
      {subTab === 'query_builder' && (
        <div className="space-y-6">
          {/* Security Banner */}
          <div className="bg-[#FAF7F2] border border-[#E5DFD7] rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs text-[#242424]">
              <span className="font-bold text-sm">Anti-Injection Parameterized Query Console:</span>
              <p className="text-[#6E6862]">
                Users cannot execute arbitrary raw SQL queries. Queries are strictly constructed via safe parameter bindings (<code>$1</code>, <code>$2</code>) against pre-indexed materialized view catalogs per System Architecture Section 4.3.
              </p>
            </div>
          </div>

          {/* Builder Controls */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-[#242424]">Interactive Report Specification</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Entity Picker */}
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-[#242424]">Select Entity Catalog View:</label>
                <select
                  value={selectedEntityId}
                  onChange={(e) => {
                    setSelectedEntityId(e.target.value);
                    const entity = CURATED_ENTITIES.find((en) => en.id === e.target.value);
                    if (entity) setSelectedColumns(entity.availableColumns.slice(0, 4).map((c) => c.key));
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] focus:outline-none"
                >
                  {CURATED_ENTITIES.map((en) => (
                    <option key={en.id} value={en.id}>
                      {en.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department Parameter Filter */}
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-[#242424]">Parameter $1 (Department):</label>
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] focus:outline-none"
                >
                  <option value="CSE">Computer Science & Engg (CSE)</option>
                  <option value="ECE">Electronics & Comm Engg (ECE)</option>
                  <option value="MECH">Mechanical Engg (MECH)</option>
                </select>
              </div>

              {/* CGPA Parameter Filter */}
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-[#242424]">Parameter $2 (Minimum CGPA Cutoff):</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#682038]"
                />
              </div>
            </div>

            {/* Column Checkboxes */}
            <div className="space-y-2 text-xs">
              <label className="font-semibold text-[#242424]">Select Projection Columns ({selectedColumns.length} selected):</label>
              <div className="flex flex-wrap gap-2">
                {selectedEntity.availableColumns.map((col) => {
                  const isChecked = selectedColumns.includes(col.key);
                  return (
                    <button
                      key={col.key}
                      onClick={() => handleToggleColumn(col.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-[#682038] text-white border-[#682038]'
                          : 'bg-[#FAF7F2] text-[#6E6862] border-[#E5DFD7] hover:bg-[#F4ECE2]'
                      }`}
                    >
                      {isChecked ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 border border-[#6E6862] rounded" />}
                      <span>{col.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Parameterized SQL Code Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#6E6862]">
                <span className="font-semibold text-[#242424]">Generated Parameterized SQL (Read-Only):</span>
                <span className="font-mono text-[10px]">Indexed Execution Plan</span>
              </div>
              <pre className="bg-[#1C1917] p-3.5 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto border border-[#292524] leading-relaxed">
                {generatedSql}
              </pre>
            </div>

            {/* Run Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#6E6862]">
                Target view: <code className="text-[#682038] font-bold">{selectedEntity.baseTable}</code>
              </span>
              <button
                onClick={() => setHasRunQuery(true)}
                className="px-5 py-2.5 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
              >
                <Activity className="w-4 h-4 text-amber-300" />
                <span>Execute Curated Query</span>
              </button>
            </div>
          </div>

          {/* Results Table */}
          {hasRunQuery && (
            <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden space-y-0">
              <div className="p-4 border-b border-[#E5DFD7] bg-[#FAF7F2]/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-[#8B5E3C]" />
                  <h4 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                    Query Output ({SAMPLE_QUERY_RESULTS.length} Matching Records)
                  </h4>
                </div>
                <button
                  onClick={() => alert('Simulating CSV download of query results')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-[#682038] bg-white border border-[#E5DFD7] hover:bg-[#FAF7F2]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-[#6E6862] border-b border-[#E5DFD7]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Roll Number</th>
                      <th className="py-3 px-4 font-semibold">Student Name</th>
                      <th className="py-3 px-4 font-semibold">Program</th>
                      <th className="py-3 px-4 font-semibold text-right">CGPA</th>
                      <th className="py-3 px-4 font-semibold text-right">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DFD7]">
                    {SAMPLE_QUERY_RESULTS.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF7F2]/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#682038]">{row.roll_no}</td>
                        <td className="py-3.5 px-4 font-semibold text-[#242424]">{row.full_name}</td>
                        <td className="py-3.5 px-4 text-[#6E6862]">{row.program} ({row.semester})</td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">{row.cgpa.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-right font-mono font-medium text-[#242424]">{row.attendance_pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
