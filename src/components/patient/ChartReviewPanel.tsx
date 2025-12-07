import { useState } from 'react';
import {
  FileText,
  Activity,
  Heart,
  Users,
  Scissors,
  Clock,
  ChevronDown,
  ChevronUp,
  Calendar,
  Stethoscope,
} from 'lucide-react';
import clsx from 'clsx';
import { format, parseISO } from 'date-fns';
import type {
  MedicalProblem,
  SocialHistory,
  FamilyHistory,
  SurgicalHistory,
  VitalSigns,
} from '../../types';

interface ChartReviewPanelProps {
  problems: MedicalProblem[];
  socialHistory: SocialHistory;
  familyHistory: FamilyHistory[];
  surgicalHistory: SurgicalHistory[];
  vitals: VitalSigns;
}

type Section = 'vitals' | 'problems' | 'social' | 'family' | 'surgical';

export function ChartReviewPanel({
  problems,
  socialHistory,
  familyHistory,
  surgicalHistory,
  vitals,
}: ChartReviewPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<Section>>(
    new Set(['vitals', 'problems'])
  );

  const toggleSection = (section: Section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const SectionHeader = ({
    section,
    icon: Icon,
    title,
    badge,
  }: {
    section: Section;
    icon: any;
    title: string;
    badge?: string | number;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors"
    >
      <Icon className="w-5 h-5 text-ehr-text-secondary shrink-0" />
      <span className="font-semibold text-ehr-text-primary flex-1 text-left">{title}</span>
      {badge !== undefined && <span className="ehr-badge ehr-badge-neutral">{badge}</span>}
      {expandedSections.has(section) ? (
        <ChevronUp className="w-5 h-5 text-ehr-text-muted" />
      ) : (
        <ChevronDown className="w-5 h-5 text-ehr-text-muted" />
      )}
    </button>
  );

  return (
    <div className="divide-y divide-ehr-border">
      {/* Vitals Section */}
      <div className="ehr-card m-4">
        <SectionHeader section="vitals" icon={Activity} title="Vitals" />
        {expandedSections.has('vitals') && (
          <div className="px-4 pb-4">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              <VitalCard
                label="Blood Pressure"
                value={`${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`}
                unit="mmHg"
                status={vitals.bloodPressure.systolic >= 140 ? 'high' : 'normal'}
              />
              <VitalCard label="Heart Rate" value={vitals.heartRate.toString()} unit="bpm" />
              <VitalCard label="Resp Rate" value={vitals.respiratoryRate.toString()} unit="/min" />
              <VitalCard label="Temp" value={vitals.temperature.toString()} unit="°F" />
              <VitalCard
                label="SpO2"
                value={vitals.oxygenSaturation.toString()}
                unit="%"
                status={vitals.oxygenSaturation < 95 ? 'low' : 'normal'}
              />
              <VitalCard label="Weight" value={vitals.weight.toString()} unit="lbs" />
              <VitalCard label="Height" value={`${Math.floor(vitals.height / 12)}'${vitals.height % 12}"`} />
              <VitalCard
                label="BMI"
                value={vitals.bmi.toFixed(1)}
                status={vitals.bmi >= 30 ? 'high' : vitals.bmi >= 25 ? 'elevated' : 'normal'}
              />
              <VitalCard
                label="Pain"
                value={vitals.painLevel.toString()}
                unit="/10"
                status={vitals.painLevel > 5 ? 'high' : 'normal'}
              />
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-ehr-text-muted">
              <Clock className="w-3 h-3" />
              <span>Recorded today at 9:45 AM</span>
            </div>
          </div>
        )}
      </div>

      {/* Problems Section */}
      <div className="ehr-card m-4">
        <SectionHeader section="problems" icon={FileText} title="Problem List" badge={problems.length} />
        {expandedSections.has('problems') && (
          <div className="px-4 pb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ehr-text-secondary uppercase">
                  <th className="pb-2">Problem</th>
                  <th className="pb-2">ICD-10</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Onset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ehr-border">
                {problems.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2 font-medium">{p.name}</td>
                    <td className="py-2 font-mono text-xs text-ehr-text-secondary">{p.icd10}</td>
                    <td className="py-2">
                      <span
                        className={clsx(
                          'ehr-badge',
                          p.status === 'active' && 'ehr-badge-warning',
                          p.status === 'chronic' && 'ehr-badge-info',
                          p.status === 'resolved' && 'ehr-badge-success'
                        )}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2 text-ehr-text-secondary">
                      {format(parseISO(p.onsetDate), 'MM/yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Social History Section */}
      <div className="ehr-card m-4">
        <SectionHeader section="social" icon={Users} title="Social History" />
        {expandedSections.has('social') && (
          <div className="px-4 pb-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-ehr-text-muted font-medium mb-1">Tobacco</p>
              <p>
                {socialHistory.smoking.status === 'never'
                  ? 'Never smoker'
                  : socialHistory.smoking.status === 'former'
                  ? `Former smoker (quit ${socialHistory.smoking.quitDate})`
                  : `Current smoker - ${socialHistory.smoking.cigarettesPerDay} cigs/day`}
              </p>
              {socialHistory.smoking.packYears && (
                <p className="text-xs text-ehr-text-secondary">
                  {socialHistory.smoking.packYears} pack-years
                </p>
              )}
            </div>
            <div>
              <p className="text-xs text-ehr-text-muted font-medium mb-1">Alcohol</p>
              <p className="capitalize">
                {socialHistory.alcohol.status}
                {socialHistory.alcohol.drinksPerWeek
                  ? ` (${socialHistory.alcohol.drinksPerWeek} drinks/week)`
                  : ''}
              </p>
            </div>
            <div>
              <p className="text-xs text-ehr-text-muted font-medium mb-1">Substances</p>
              <p>{socialHistory.substances}</p>
            </div>
            <div>
              <p className="text-xs text-ehr-text-muted font-medium mb-1">Exercise</p>
              <p>{socialHistory.exercise}</p>
            </div>
            <div>
              <p className="text-xs text-ehr-text-muted font-medium mb-1">Diet</p>
              <p>{socialHistory.diet}</p>
            </div>
            <div>
              <p className="text-xs text-ehr-text-muted font-medium mb-1">Occupation</p>
              <p>{socialHistory.occupation}</p>
            </div>
            <div>
              <p className="text-xs text-ehr-text-muted font-medium mb-1">Living Situation</p>
              <p>{socialHistory.housing}</p>
            </div>
            <div>
              <p className="text-xs text-ehr-text-muted font-medium mb-1">Sexual Activity</p>
              <p>
                {socialHistory.sexualActivity.active
                  ? `Active, ${socialHistory.sexualActivity.partners} partner(s)`
                  : 'Not sexually active'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Family History Section */}
      <div className="ehr-card m-4">
        <SectionHeader
          section="family"
          icon={Heart}
          title="Family History"
          badge={familyHistory.length}
        />
        {expandedSections.has('family') && (
          <div className="px-4 pb-4">
            <div className="space-y-2">
              {familyHistory.map((fh) => (
                <div
                  key={fh.id}
                  className="flex items-start gap-3 py-2 border-b border-ehr-border last:border-0"
                >
                  <span className="ehr-badge ehr-badge-neutral shrink-0">{fh.relation}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{fh.condition}</p>
                    {(fh.ageOfOnset || fh.notes) && (
                      <p className="text-xs text-ehr-text-secondary">
                        {fh.ageOfOnset && `Age ${fh.ageOfOnset}`}
                        {fh.ageOfOnset && fh.notes && ' - '}
                        {fh.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Surgical History Section */}
      <div className="ehr-card m-4">
        <SectionHeader
          section="surgical"
          icon={Scissors}
          title="Surgical History"
          badge={surgicalHistory.length}
        />
        {expandedSections.has('surgical') && (
          <div className="px-4 pb-4">
            <div className="space-y-2">
              {surgicalHistory.map((sh) => (
                <div
                  key={sh.id}
                  className="flex items-start gap-3 py-2 border-b border-ehr-border last:border-0"
                >
                  <Calendar className="w-4 h-4 text-ehr-text-muted shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{sh.procedure}</p>
                    <p className="text-xs text-ehr-text-secondary">
                      {format(parseISO(sh.date), 'MMMM yyyy')}
                      {sh.facility && ` at ${sh.facility}`}
                    </p>
                    {sh.surgeon && (
                      <p className="text-xs text-ehr-text-muted">Surgeon: {sh.surgeon}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Visits Preview */}
      <div className="ehr-card m-4">
        <div className="px-4 py-3 flex items-center gap-3">
          <Stethoscope className="w-5 h-5 text-ehr-text-secondary" />
          <span className="font-semibold text-ehr-text-primary flex-1">Recent Visits</span>
          <button className="text-xs text-ehr-primary hover:underline">View All</button>
        </div>
        <div className="px-4 pb-4">
          <div className="space-y-2">
            {[
              { date: '2024-11-15', type: 'Office Visit', reason: 'Diabetes/HTN Follow-up' },
              { date: '2024-08-10', type: 'Office Visit', reason: 'Annual Physical' },
              { date: '2024-05-20', type: 'Telehealth', reason: 'Medication Review' },
            ].map((visit, idx) => (
              <button
                key={idx}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-ehr-text-primary">
                    {format(parseISO(visit.date), 'MMM')}
                  </span>
                  <span className="text-sm font-bold text-ehr-primary">
                    {format(parseISO(visit.date), 'd')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{visit.reason}</p>
                  <p className="text-xs text-ehr-text-secondary">{visit.type}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VitalCard({
  label,
  value,
  unit,
  status = 'normal',
}: {
  label: string;
  value: string;
  unit?: string;
  status?: 'normal' | 'high' | 'low' | 'elevated';
}) {
  return (
    <div className="bg-slate-50 rounded-lg p-3 text-center">
      <p className="text-xs text-ehr-text-muted mb-1">{label}</p>
      <p
        className={clsx(
          'text-lg font-bold',
          status === 'normal' && 'text-ehr-text-primary',
          status === 'high' && 'text-red-600',
          status === 'low' && 'text-blue-600',
          status === 'elevated' && 'text-amber-600'
        )}
      >
        {value}
        {unit && <span className="text-xs font-normal text-ehr-text-muted ml-1">{unit}</span>}
      </p>
    </div>
  );
}
