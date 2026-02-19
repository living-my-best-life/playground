import { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  RefreshCw,
  ExternalLink,
  Clock,
  TrendingUp,
  Copy,
  Ban,
  Activity,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';
import { format, parseISO, differenceInDays } from 'date-fns';
import type { Medication, Allergy } from '../../types';

interface MedicationPanelProps {
  medications: Medication[];
  allergies: Allergy[];
  onRefill?: (medication: Medication) => void;
  onDiscontinue?: (medication: Medication) => void;
}

export function MedicationPanel({
  medications,
  allergies,
  onRefill,
  onDiscontinue,
}: MedicationPanelProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'alerts'>('all');
  const [expandedMeds, setExpandedMeds] = useState<Set<string>>(new Set());
  const [showAllergies, setShowAllergies] = useState(true);

  const toggleMed = (id: string) => {
    const newExpanded = new Set(expandedMeds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedMeds(newExpanded);
  };

  const getAdherenceIcon = (status: string) => {
    switch (status) {
      case 'taking':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'not-taking':
        return <Ban className="w-4 h-4 text-red-600" />;
      case 'taking-differently':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getAdherenceLabel = (status: string) => {
    switch (status) {
      case 'taking':
        return 'Taking as prescribed';
      case 'not-taking':
        return 'Not taking';
      case 'taking-differently':
        return 'Taking differently';
      default:
        return 'Unknown';
    }
  };

  const getPDCColor = (pdc: number) => {
    if (pdc >= 80) return 'text-emerald-600 bg-emerald-50';
    if (pdc >= 50) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const medsWithAlerts = medications.filter((m) => m.alerts.length > 0);
  const filteredMeds =
    filter === 'all'
      ? medications
      : filter === 'alerts'
      ? medsWithAlerts
      : medications.filter((m) => m.adherenceStatus.status === 'taking');

  // Group medications by associated problem
  const groupedMeds: Record<string, Medication[]> = {};
  const unassociatedMeds: Medication[] = [];

  filteredMeds.forEach((med) => {
    if (med.associatedProblem) {
      if (!groupedMeds[med.associatedProblem]) {
        groupedMeds[med.associatedProblem] = [];
      }
      groupedMeds[med.associatedProblem].push(med);
    } else {
      unassociatedMeds.push(med);
    }
  });

  const totalAlerts = medications.reduce((sum, m) => sum + m.alerts.length, 0);

  return (
    <div className="p-4 space-y-4">
      {/* Allergies Section */}
      <div className="ehr-card">
        <button
          onClick={() => setShowAllergies(!showAllergies)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-700">Allergies</span>
            <span className="ehr-badge ehr-badge-danger">{allergies.length}</span>
          </div>
          {showAllergies ? (
            <ChevronUp className="w-5 h-5 text-ehr-text-muted" />
          ) : (
            <ChevronDown className="w-5 h-5 text-ehr-text-muted" />
          )}
        </button>

        {showAllergies && (
          <div className="px-4 pb-3 border-t border-red-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
              {allergies.map((allergy) => (
                <div
                  key={allergy.id}
                  className={clsx(
                    'p-2 rounded-lg border',
                    allergy.severity === 'life-threatening'
                      ? 'bg-red-100 border-red-300'
                      : allergy.severity === 'severe'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-amber-50 border-amber-200'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{allergy.allergen}</span>
                    <span
                      className={clsx(
                        'text-xs px-1.5 py-0.5 rounded',
                        allergy.severity === 'life-threatening' && 'bg-red-600 text-white',
                        allergy.severity === 'severe' && 'bg-red-500 text-white',
                        allergy.severity === 'moderate' && 'bg-amber-500 text-white',
                        allergy.severity === 'mild' && 'bg-amber-400 text-white'
                      )}
                    >
                      {allergy.severity}
                    </span>
                  </div>
                  <p className="text-xs text-ehr-text-secondary mt-1">{allergy.reaction}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Medications Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-ehr-text-primary">Medications</h2>
          <span className="ehr-badge ehr-badge-neutral">{medications.length}</span>
          {totalAlerts > 0 && (
            <span className="ehr-badge ehr-badge-warning">
              <AlertCircle className="w-3 h-3 mr-1" />
              {totalAlerts} alerts
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Filter */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            {(['all', 'active', 'alerts'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  'px-2 py-1 text-xs font-medium rounded transition-colors capitalize',
                  filter === f
                    ? 'bg-white text-ehr-primary shadow-sm'
                    : 'text-ehr-text-secondary hover:text-ehr-text-primary'
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="ehr-btn ehr-btn-secondary text-xs">
            <RefreshCw className="w-4 h-4" />
            Query PDMP
          </button>
          <button className="ehr-btn ehr-btn-primary text-xs">
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* AI Adherence Summary */}
      <div className="ai-summary-box">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-purple-700 mb-1">AI Adherence Summary</p>
            <p className="text-sm text-purple-900">
              Patient is generally adherent to chronic medications. <strong>Glipizide</strong> shows
              60-day gaps between fills (PDC 67%) - recommend discussing adherence barriers.{' '}
              <strong>Omeprazole</strong> has not been filled in 8 months - verify if still needed.
            </p>
          </div>
        </div>
      </div>

      {/* Medications grouped by problem */}
      <div className="space-y-4">
        {Object.entries(groupedMeds).map(([problem, meds]) => (
          <div key={problem}>
            <h3 className="text-xs font-semibold text-ehr-text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
              <Activity className="w-3 h-3" />
              {problem}
            </h3>
            <div className="space-y-2">
              {meds.map((med) => (
                <MedicationCard
                  key={med.id}
                  medication={med}
                  isExpanded={expandedMeds.has(med.id)}
                  onToggle={() => toggleMed(med.id)}
                  onRefill={onRefill}
                  onDiscontinue={onDiscontinue}
                  getAdherenceIcon={getAdherenceIcon}
                  getAdherenceLabel={getAdherenceLabel}
                  getPDCColor={getPDCColor}
                />
              ))}
            </div>
          </div>
        ))}

        {unassociatedMeds.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              Unassociated Medications
            </h3>
            <div className="space-y-2">
              {unassociatedMeds.map((med) => (
                <MedicationCard
                  key={med.id}
                  medication={med}
                  isExpanded={expandedMeds.has(med.id)}
                  onToggle={() => toggleMed(med.id)}
                  onRefill={onRefill}
                  onDiscontinue={onDiscontinue}
                  getAdherenceIcon={getAdherenceIcon}
                  getAdherenceLabel={getAdherenceLabel}
                  getPDCColor={getPDCColor}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface MedicationCardProps {
  medication: Medication;
  isExpanded: boolean;
  onToggle: () => void;
  onRefill?: (medication: Medication) => void;
  onDiscontinue?: (medication: Medication) => void;
  getAdherenceIcon: (status: string) => JSX.Element;
  getAdherenceLabel: (status: string) => string;
  getPDCColor: (pdc: number) => string;
}

function MedicationCard({
  medication: med,
  isExpanded,
  onToggle,
  onRefill,
  onDiscontinue,
  getAdherenceIcon,
  getAdherenceLabel,
  getPDCColor,
}: MedicationCardProps) {
  const daysUntilRefill = med.nextRefillDue
    ? differenceInDays(parseISO(med.nextRefillDue), new Date())
    : null;

  return (
    <div
      className={clsx(
        'ehr-card overflow-hidden',
        med.alerts.length > 0 && 'border-amber-300'
      )}
    >
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
      >
        {/* Adherence indicator */}
        <div className="shrink-0">{getAdherenceIcon(med.adherenceStatus.status)}</div>

        {/* Med info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ehr-text-primary">{med.name}</span>
            <span className="text-sm text-ehr-text-secondary">
              {med.dose} {med.frequency}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-ehr-text-muted">
            <span>{med.route}</span>
            <span>|</span>
            <span>{med.pharmacy}</span>
          </div>
        </div>

        {/* Alerts */}
        {med.alerts.length > 0 && (
          <div className="flex items-center gap-1">
            {med.alerts.map((alert, idx) => (
              <span
                key={idx}
                className={clsx(
                  'ehr-badge',
                  alert.severity === 'critical'
                    ? 'ehr-badge-danger'
                    : alert.severity === 'warning'
                    ? 'ehr-badge-warning'
                    : 'ehr-badge-info'
                )}
              >
                {alert.type === 'duplicate' && <Copy className="w-3 h-3 mr-1" />}
                {alert.type === 'non-adherence' && <AlertCircle className="w-3 h-3 mr-1" />}
                {alert.type === 'no-diagnosis' && <HelpCircle className="w-3 h-3 mr-1" />}
                {alert.type}
              </span>
            ))}
          </div>
        )}

        {/* PDC */}
        {med.adherenceStatus.pdc > 0 && (
          <div className={clsx('px-2 py-1 rounded text-xs font-medium', getPDCColor(med.adherenceStatus.pdc))}>
            PDC: {med.adherenceStatus.pdc}%
          </div>
        )}

        {/* Refill indicator */}
        {daysUntilRefill !== null && daysUntilRefill <= 14 && (
          <div
            className={clsx(
              'ehr-badge',
              daysUntilRefill <= 0 ? 'ehr-badge-danger' : 'ehr-badge-warning'
            )}
          >
            <Clock className="w-3 h-3 mr-1" />
            {daysUntilRefill <= 0 ? 'Refill due' : `${daysUntilRefill}d to refill`}
          </div>
        )}

        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-ehr-text-muted shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-ehr-text-muted shrink-0" />
        )}
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 py-3 border-t border-ehr-border bg-slate-50 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-ehr-text-muted">Prescribed</p>
              <p className="font-medium">{format(parseISO(med.prescribedDate), 'MM/dd/yyyy')}</p>
            </div>
            <div>
              <p className="text-xs text-ehr-text-muted">Last Dispensed</p>
              <p className="font-medium">
                {med.lastDispensed ? format(parseISO(med.lastDispensed), 'MM/dd/yyyy') : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-ehr-text-muted">Refills Remaining</p>
              <p className="font-medium">{med.refillsRemaining}</p>
            </div>
            <div>
              <p className="text-xs text-ehr-text-muted">Days Supply</p>
              <p className="font-medium">{med.daysSupply}</p>
            </div>
          </div>

          {/* Adherence details */}
          <div className="flex items-center gap-4 p-2 bg-white rounded-lg border border-ehr-border">
            <div className="flex items-center gap-2">
              {getAdherenceIcon(med.adherenceStatus.status)}
              <span className="text-sm font-medium">
                {getAdherenceLabel(med.adherenceStatus.status)}
              </span>
            </div>
            {med.adherenceStatus.pdc > 0 && (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-ehr-text-muted" />
                <span className="text-sm">PDC: {med.adherenceStatus.pdc}%</span>
                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      'h-full rounded-full',
                      med.adherenceStatus.pdc >= 80
                        ? 'bg-emerald-500'
                        : med.adherenceStatus.pdc >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    )}
                    style={{ width: `${med.adherenceStatus.pdc}%` }}
                  />
                </div>
              </div>
            )}
            {med.adherenceStatus.notes && (
              <p className="text-xs text-ehr-text-secondary">{med.adherenceStatus.notes}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRefill?.(med)}
              className="ehr-btn ehr-btn-primary text-xs"
            >
              <RefreshCw className="w-4 h-4" />
              Refill
            </button>
            <button className="ehr-btn ehr-btn-secondary text-xs">
              <ExternalLink className="w-4 h-4" />
              View History
            </button>
            <button
              onClick={() => onDiscontinue?.(med)}
              className="ehr-btn ehr-btn-ghost text-xs text-red-600"
            >
              Discontinue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
