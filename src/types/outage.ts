export interface DatabaseRow {
  rowNumber: number;
  timestamp: string;
  concern: string;
  province: string;
  municipality: string;
  barangay: string;
  facility: string;
  napStatus: string;
  finding: string;
  rfo: string;
  ospTeam: string;
  etr: string;
  joNumber: string;
  dateEndorsed: string;
  dateRestored: string;
  sourceStatus: string;
  finalStatus: string;
  status: string;
  isRepaired?: boolean;
  repairNotes?: string[];
}

export interface NapDownRow {
  sourceRow: number;
  province: string;
  municipality: string;
  barangay: string;
  napCode: string;
  coordinates: string;
  dateEndorsed: string;
  dateEndorsedDisplay: string;
  duration: string;
  finding: string;
  sourceStatus: string;
}

export interface SnapshotDiagnostics {
  dbHeaderRow: number;
  napDownHeaderRow: number;
  databaseRows: number;
  napDownRows: number;
  formulaErrors: number;
  droppedRows: number;
}

export interface SnapshotResponse {
  ok: boolean;
  version?: string;
  sourceMode?: string;
  syncState?: string;
  rows: DatabaseRow[];
  napDownRows: NapDownRow[];
  statusCounts?: Record<string, number>;
  napStatusCounts?: Record<string, number>;
  pendingCount?: number;
  restoredCount?: number;
  napDownSheetCount?: number;
  options?: {
    province?: string[];
    status?: string[];
    finding?: string[];
    rfo?: string[];
    concern?: string[];
  };
  dates?: string[];
  diagnostics?: SnapshotDiagnostics;
  checkedAt?: string;
  source?: string;
  credential?: string;
}

export interface FilterState {
  month: string;
  date: string;
  province: string;
  status: string;
  finding: string;
  rfo: string;
  concern: string;
  search: string;
}

export interface NapFilterState {
  province: string;
  municipality: string;
  barangay: string;
  finding: string;
  search: string;
  sortBy: 'aging-desc' | 'aging-asc' | 'province' | 'napCode';
}

export interface FormulaErrorRecord {
  rowNumber: number;
  column: string;
  rawError: string;
  fieldValue: string;
  province: string;
  municipality: string;
  napStatus: string;
  repairApplied: string;
}

export interface AnomalyReport {
  formulaErrors: FormulaErrorRecord[];
  blankFinalStatusRowsCount: number;
  blankFinalStatusSampleRows: number[];
  napDownDiscrepancy: {
    sheetTotal: number;
    emptyArtifactRows: number;
    cleanSheetCount: number;
    pendingFinalStatusCount: number;
    isIdentical: boolean;
    explanation: string;
  };
  invertedDatesCount: number;
  unassignedTechnicianCount: number;
  cleanRowsCount: number;
  totalRowsScanned: number;
  healthScore: number;
}

export interface GeminiAgentAuditResult {
  summary: string;
  riskAssessment: string;
  topRootCauses: { cause: string; count: number; impact: string }[];
  fieldDispatchAdvice: string[];
  criticalAgedIncidents: { napCode: string; location: string; ageHours: number; priority: string }[];
  timestamp: string;
}
