import { useState } from 'react';
import {
  Syringe,
  Search,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  Filter,
  Send,
  Sparkles,
  User,
} from 'lucide-react';
import clsx from 'clsx';
import { format, parseISO } from 'date-fns';
import type { PreventiveItem, SocialHistory, FamilyHistory } from '../../types';

interface PreventiveHealthPanelProps {
  items: PreventiveItem[];
  socialHistory: SocialHistory;
  familyHistory: FamilyHistory[];
  onSchedule?: (item: PreventiveItem) => void;
  onSendReminder?: (item: PreventiveItem) => void;
}

export function PreventiveHealthPanel({
  items,
  socialHistory: _socialHistory,
  familyHistory,
  onSchedule,
  onSendReminder,
}: PreventiveHealthPanelProps) {
  const [filter, setFilter] = useState<'all' | 'due' | 'overdue' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'screening' | 'immunization' | 'counseling'>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'due':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'not-applicable':
        return <XCircle className="w-5 h-5 text-slate-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'ehr-badge ehr-badge-success';
      case 'due':
        return 'ehr-badge ehr-badge-warning';
      case 'overdue':
        return 'ehr-badge ehr-badge-danger';
      case 'not-applicable':
        return 'ehr-badge ehr-badge-neutral';
      default:
        return 'ehr-badge ehr-badge-neutral';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'screening':
        return <Search className="w-4 h-4" />;
      case 'immunization':
        return <Syringe className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const filteredItems = items.filter((item) => {
    const statusMatch = filter === 'all' || item.status === filter;
    const categoryMatch = categoryFilter === 'all' || item.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const dueCounts = {
    due: items.filter((i) => i.status === 'due').length,
    overdue: items.filter((i) => i.status === 'overdue').length,
    completed: items.filter((i) => i.status === 'completed').length,
  };

  // AI recommendations based on history
  const aiRecommendations = [];

  // Check family history for early screening
  const breastCancerFamily = familyHistory.find(
    (fh) => fh.condition.toLowerCase().includes('breast cancer') && fh.ageOfOnset && fh.ageOfOnset < 50
  );
  if (breastCancerFamily) {
    aiRecommendations.push({
      type: 'screening',
      recommendation: `Consider earlier mammogram screening due to family history (${breastCancerFamily.relation} with breast cancer at age ${breastCancerFamily.ageOfOnset})`,
    });
  }

  const colonCancerFamily = familyHistory.find(
    (fh) => fh.condition.toLowerCase().includes('colon cancer')
  );
  if (colonCancerFamily) {
    aiRecommendations.push({
      type: 'screening',
      recommendation: `Family history of colon cancer (${colonCancerFamily.relation}) - ensure colonoscopy screening is current`,
    });
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-ehr-text-primary">Preventive Health</h2>
          {dueCounts.overdue > 0 && (
            <span className="ehr-badge ehr-badge-danger">
              {dueCounts.overdue} Overdue
            </span>
          )}
          {dueCounts.due > 0 && (
            <span className="ehr-badge ehr-badge-warning">
              {dueCounts.due} Due
            </span>
          )}
        </div>
      </div>

      {/* AI Recommendations */}
      {aiRecommendations.length > 0 && (
        <div className="ai-summary-box">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-purple-700 mb-1">
                AI Recommendations Based on History
              </p>
              <ul className="text-sm text-purple-900 space-y-1">
                {aiRecommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    {rec.recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-ehr-text-muted" />
          <span className="text-sm text-ehr-text-secondary">Status:</span>
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            {(['all', 'due', 'overdue', 'completed'] as const).map((f) => (
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
                {f === 'due' && dueCounts.due > 0 && ` (${dueCounts.due})`}
                {f === 'overdue' && dueCounts.overdue > 0 && ` (${dueCounts.overdue})`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-ehr-text-secondary">Category:</span>
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            {(['all', 'screening', 'immunization'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={clsx(
                  'px-2 py-1 text-xs font-medium rounded transition-colors capitalize',
                  categoryFilter === c
                    ? 'bg-white text-ehr-primary shadow-sm'
                    : 'text-ehr-text-secondary hover:text-ehr-text-primary'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preventive Items List */}
      <div className="space-y-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={clsx(
              'ehr-card p-4',
              item.status === 'overdue' && 'border-red-200 bg-red-50/50',
              item.status === 'due' && 'border-amber-200 bg-amber-50/50'
            )}
          >
            <div className="flex items-start gap-3">
              {/* Status Icon */}
              <div className="shrink-0 mt-0.5">{getStatusIcon(item.status)}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-ehr-text-primary">{item.name}</span>
                  <span className={getStatusBadge(item.status)}>{item.status}</span>
                  <span className="ehr-badge ehr-badge-neutral flex items-center gap-1">
                    {getCategoryIcon(item.category)}
                    {item.category}
                  </span>
                </div>

                <p className="text-sm text-ehr-text-secondary mt-1">{item.recommendation}</p>

                <div className="flex items-center gap-4 mt-2 text-xs text-ehr-text-muted">
                  {item.lastCompleted && (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Last: {format(parseISO(item.lastCompleted), 'MM/dd/yyyy')}
                    </span>
                  )}
                  {item.nextDue && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Due: {format(parseISO(item.nextDue), 'MM/dd/yyyy')}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.frequency}
                  </span>
                </div>

                <p className="text-xs text-ehr-text-muted mt-1">
                  <span className="font-medium">Eligibility:</span> {item.eligibilityCriteria}
                </p>
              </div>

              {/* Actions */}
              {item.status !== 'not-applicable' && item.status !== 'completed' && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSendReminder?.(item)}
                    className="ehr-btn ehr-btn-ghost text-xs"
                    title="Send patient reminder"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onSchedule?.(item)}
                    className="ehr-btn ehr-btn-primary text-xs"
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Immunization History Summary */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-ehr-text-secondary mb-2 flex items-center gap-2">
          <Syringe className="w-4 h-4" />
          Immunization Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items
            .filter((i) => i.category === 'immunization')
            .map((imm) => (
              <div
                key={imm.id}
                className={clsx(
                  'p-3 rounded-lg border',
                  imm.status === 'completed' && 'bg-emerald-50 border-emerald-200',
                  imm.status === 'due' && 'bg-amber-50 border-amber-200',
                  imm.status === 'overdue' && 'bg-red-50 border-red-200'
                )}
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(imm.status)}
                  <span className="text-sm font-medium truncate">{imm.name}</span>
                </div>
                {imm.lastCompleted && (
                  <p className="text-xs text-ehr-text-muted mt-1">
                    {format(parseISO(imm.lastCompleted), 'MM/dd/yyyy')}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-ehr-border">
        <button className="ehr-btn ehr-btn-secondary text-xs">
          <Search className="w-4 h-4" />
          Query Immunization Registry
        </button>
        <button className="ehr-btn ehr-btn-secondary text-xs">
          <Send className="w-4 h-4" />
          Send All Reminders
        </button>
      </div>
    </div>
  );
}
