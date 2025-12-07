// Core Patient Types
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  mrn: string;
  phone: string;
  email: string;
  address: Address;
  insurance: Insurance;
  primaryProvider: string;
  photo?: string;
  lastVisit?: string;
  nextAppointment?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Insurance {
  provider: string;
  planName: string;
  memberId: string;
  groupNumber: string;
}

// Medical Problem / Chronic Disease Types
export interface MedicalProblem {
  id: string;
  name: string;
  icd10: string;
  onsetDate: string;
  status: 'active' | 'resolved' | 'chronic';
  severity: 'mild' | 'moderate' | 'severe';
  aiSummary?: string;
  associatedMedications: string[];
  associatedLabs: LabOrder[];
  lastReviewed?: string;
  recommendations: AIRecommendation[];
  targetValues?: Record<string, TargetValue>;
}

export interface TargetValue {
  name: string;
  target: string;
  current: string;
  status: 'at-goal' | 'near-goal' | 'not-at-goal';
  trend: 'improving' | 'stable' | 'worsening';
}

export interface AIRecommendation {
  id: string;
  type: 'lab' | 'imaging' | 'referral' | 'medication' | 'follow-up' | 'screening';
  priority: 'routine' | 'soon' | 'urgent';
  description: string;
  rationale: string;
  dueDate?: string;
  isOverdue: boolean;
  actionable: boolean;
}

// Medication Types
export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dose: string;
  frequency: string;
  route: string;
  prescribedDate: string;
  prescriber: string;
  pharmacy: string;
  refillsRemaining: number;
  daysSupply: number;
  associatedProblem?: string;
  adherenceStatus: AdherenceStatus;
  lastDispensed?: string;
  nextRefillDue?: string;
  alerts: MedicationAlert[];
}

export interface AdherenceStatus {
  status: 'taking' | 'not-taking' | 'taking-differently' | 'unknown';
  pdc: number; // Proportion of Days Covered
  lastFillGap?: number;
  notes?: string;
}

export interface MedicationAlert {
  type: 'duplicate' | 'no-diagnosis' | 'non-adherence' | 'interaction' | 'allergy';
  severity: 'info' | 'warning' | 'critical';
  message: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  type: 'medication' | 'food' | 'environmental';
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  onsetDate?: string;
  verified: boolean;
}

// Lab Types
export interface LabResult {
  id: string;
  testName: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'low' | 'high' | 'critical';
  collectedDate: string;
  resultDate: string;
  orderedBy: string;
  comments?: string;
}

export interface LabPanel {
  id: string;
  name: string;
  results: LabResult[];
  collectedDate: string;
}

export interface LabOrder {
  id: string;
  testName: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  orderedDate: string;
  scheduledDate?: string;
  priority: 'routine' | 'urgent' | 'stat';
  associatedDiagnosis?: string;
  instructions?: string;
}

export interface LabTrend {
  testName: string;
  unit: string;
  referenceRange: { low: number; high: number };
  dataPoints: { date: string; value: number }[];
}

// Preventive Health Types
export interface PreventiveItem {
  id: string;
  name: string;
  category: 'screening' | 'immunization' | 'counseling';
  status: 'due' | 'overdue' | 'completed' | 'not-applicable';
  lastCompleted?: string;
  nextDue?: string;
  frequency: string;
  eligibilityCriteria: string;
  recommendation: string;
}

export interface Immunization {
  id: string;
  name: string;
  dateGiven: string;
  lotNumber: string;
  site: string;
  administrator: string;
  nextDose?: string;
}

// Social/Family History Types
export interface SocialHistory {
  smoking: SmokingHistory;
  alcohol: AlcoholHistory;
  substances: string;
  exercise: string;
  diet: string;
  occupation: string;
  sexualActivity: SexualActivityHistory;
  housing: string;
  stressLevel: string;
}

export interface SmokingHistory {
  status: 'never' | 'former' | 'current';
  packYears?: number;
  quitDate?: string;
  cigarettesPerDay?: number;
  yearsSmoked?: number;
}

export interface AlcoholHistory {
  status: 'none' | 'social' | 'moderate' | 'heavy';
  drinksPerWeek?: number;
}

export interface SexualActivityHistory {
  active: boolean;
  partners: 'none' | 'single' | 'multiple';
  highRisk: boolean;
}

export interface FamilyHistory {
  id: string;
  relation: string;
  condition: string;
  ageOfOnset?: number;
  notes?: string;
}

// Surgical History Types
export interface SurgicalHistory {
  id: string;
  procedure: string;
  date: string;
  surgeon?: string;
  facility?: string;
  notes?: string;
}

// Appointment Types
export interface Appointment {
  id: string;
  date: string;
  time: string;
  type: 'office-visit' | 'telehealth' | 'procedure' | 'lab' | 'imaging';
  reason: string;
  provider: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  duration: number;
  notes?: string;
  reminders: ReminderStatus[];
}

export interface ReminderStatus {
  type: 'email' | 'sms' | 'phone';
  sentDate: string;
  status: 'sent' | 'delivered' | 'failed';
}

// Order Set Types
export interface OrderSet {
  id: string;
  name: string;
  condition: string;
  orders: OrderSetItem[];
  isAIRecommended: boolean;
  lastUsed?: string;
}

export interface OrderSetItem {
  type: 'lab' | 'imaging' | 'referral' | 'medication';
  name: string;
  details: string;
  frequency?: string;
  selected: boolean;
}

// Patient Outreach Types
export interface OutreachItem {
  id: string;
  patientId: string;
  patientName: string;
  type: 'follow-up' | 'lab-reminder' | 'preventive' | 'medication' | 'care-gap';
  priority: 'low' | 'medium' | 'high';
  reason: string;
  dueDate: string;
  status: 'pending' | 'attempted' | 'contacted' | 'scheduled' | 'completed';
  attempts: OutreachAttempt[];
  assignedTo?: string;
  lastUpdated: string;
}

export interface OutreachAttempt {
  date: string;
  method: 'phone' | 'email' | 'sms' | 'letter';
  outcome: 'no-answer' | 'left-message' | 'wrong-number' | 'spoke-to-patient' | 'scheduled';
  notes?: string;
}

// AI Scribe Types
export interface ScribeNote {
  id: string;
  timestamp: string;
  type: 'subjective' | 'objective' | 'assessment' | 'plan';
  content: string;
  confidence: number;
  source: 'voice' | 'typed' | 'imported';
  isEdited: boolean;
}

export interface GeneratedOrder {
  id: string;
  type: 'lab' | 'imaging' | 'referral' | 'medication' | 'follow-up';
  description: string;
  details: string;
  confidence: number;
  isConfirmed: boolean;
  sourceText?: string;
}

// Visit/Encounter Types
export interface Visit {
  id: string;
  date: string;
  type: string;
  chiefComplaint: string;
  subjective: string;
  objective: VitalSigns & { physicalExam: string };
  assessment: Assessment[];
  plan: PlanItem[];
  provider: string;
  status: 'in-progress' | 'completed' | 'signed';
}

export interface VitalSigns {
  bloodPressure: { systolic: number; diastolic: number };
  heartRate: number;
  respiratoryRate: number;
  temperature: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
  bmi: number;
  painLevel: number;
}

export interface Assessment {
  diagnosis: string;
  icd10: string;
  status: 'new' | 'existing' | 'resolved';
}

export interface PlanItem {
  type: 'medication' | 'lab' | 'imaging' | 'referral' | 'education' | 'follow-up';
  description: string;
  details: string;
  status: 'ordered' | 'pending' | 'deferred';
}

// UI State Types
export interface PanelConfig {
  id: string;
  title: string;
  isExpanded: boolean;
  isVisible: boolean;
  position: 'left' | 'right';
}

export interface ViewMode {
  mode: 'split' | 'chart' | 'documentation';
  leftPanel: string;
  rightPanel: string;
}
