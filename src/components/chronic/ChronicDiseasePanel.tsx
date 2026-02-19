import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Plus,
  ExternalLink,
  Beaker,
  Pill,
  Calendar,
} from 'lucide-react';
import clsx from 'clsx';
import type { MedicalProblem, AIRecommendation } from '../../types';

interface ChronicDiseasePanelProps {
  problems: MedicalProblem[];
  onOrderLab?: (recommendation: AIRecommendation) => void;
  onAddToPlan?: (recommendation: AIRecommendation) => void;
}

export function ChronicDiseasePanel({ problems, onOrderLab, onAddToPlan }: ChronicDiseasePanelProps) {
  const [expandedProblems, setExpandedProblems] = useState<Set<string>>(
    new Set(problems.slice(0, 2).map(p => p.id))
  );

  const toggleProblem = (id: string) => {
    const newExpanded = new Set(expandedProblems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedProblems(newExpanded);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'worsening':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'at-goal':
        return 'text-emerald-600 bg-emerald-50';
      case 'near-goal':
        return 'text-amber-600 bg-amber-50';
      case 'not-at-goal':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'ehr-badge ehr-badge-danger';
      case 'soon':
        return 'ehr-badge ehr-badge-warning';
      default:
        return 'ehr-badge ehr-badge-neutral';
    }
  };

  const totalOverdueRecommendations = problems.reduce(
    (sum, p) => sum + p.recommendations.filter(r => r.isOverdue).length,
    0
  );

  return (
    <div className="p-4 space-y-4">
      {/* Header with summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-ehr-text-primary">Chronic Disease Management</h2>
          <span className="ehr-badge ehr-badge-neutral">{problems.length} Active</span>
          {totalOverdueRecommendations > 0 && (
            <span className="ehr-badge ehr-badge-danger">
              {totalOverdueRecommendations} Overdue
            </span>
          )}
        </div>
        <button className="ehr-btn ehr-btn-secondary text-xs">
          <Plus className="w-4 h-4" />
          Add Problem
        </button>
      </div>

      {/* Problem List */}
      <div className="space-y-3">
        {problems.map((problem) => {
          const isExpanded = expandedProblems.has(problem.id);
          const overdueCount = problem.recommendations.filter(r => r.isOverdue).length;

          return (
            <div
              key={problem.id}
              className={clsx(
                'ehr-card overflow-hidden transition-shadow',
                isExpanded && 'shadow-ehr-md'
              )}
            >
              {/* Problem Header */}
              <button
                onClick={() => toggleProblem(problem.id)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ehr-text-primary">
                      {problem.name}
                    </span>
                    <span className="text-xs text-ehr-text-muted font-mono">
                      {problem.icd10}
                    </span>
                    {overdueCount > 0 && (
                      <span className="ehr-badge ehr-badge-danger">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {overdueCount} overdue
                      </span>
                    )}
                  </div>

                  {/* Quick Status Row */}
                  {problem.targetValues && (
                    <div className="flex items-center gap-3 mt-1">
                      {Object.values(problem.targetValues).slice(0, 3).map((tv) => (
                        <div key={tv.name} className="flex items-center gap-1 text-xs">
                          <span className="text-ehr-text-muted">{tv.name}:</span>
                          <span className={clsx(
                            'font-medium',
                            tv.status === 'at-goal' && 'text-emerald-600',
                            tv.status === 'near-goal' && 'text-amber-600',
                            tv.status === 'not-at-goal' && 'text-red-600'
                          )}>
                            {tv.current}
                          </span>
                          {getTrendIcon(tv.trend)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-ehr-text-muted shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-ehr-text-muted shrink-0" />
                )}
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-ehr-border">
                  {/* AI Summary */}
                  {problem.aiSummary && (
                    <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-purple-700 mb-1">
                            AI Clinical Summary
                          </p>
                          <p className="text-sm text-purple-900 leading-relaxed">
                            {problem.aiSummary}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Target Values */}
                  {problem.targetValues && Object.keys(problem.targetValues).length > 0 && (
                    <div className="px-4 py-3 border-b border-ehr-border">
                      <h4 className="text-xs font-semibold text-ehr-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Treatment Targets
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.values(problem.targetValues).map((tv) => (
                          <div
                            key={tv.name}
                            className={clsx(
                              'rounded-lg p-2',
                              getStatusColor(tv.status)
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">{tv.name}</span>
                              {getTrendIcon(tv.trend)}
                            </div>
                            <div className="mt-1">
                              <span className="text-lg font-bold">{tv.current}</span>
                              <span className="text-xs ml-1 opacity-75">
                                (goal: {tv.target})
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Recommendations */}
                  {problem.recommendations.length > 0 && (
                    <div className="px-4 py-3">
                      <h4 className="text-xs font-semibold text-ehr-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        AI Recommendations
                      </h4>
                      <div className="space-y-2">
                        {problem.recommendations.map((rec) => (
                          <div
                            key={rec.id}
                            className={clsx(
                              'flex items-start gap-3 p-2 rounded-lg border',
                              rec.isOverdue
                                ? 'border-red-200 bg-red-50'
                                : 'border-ehr-border bg-slate-50'
                            )}
                          >
                            {/* Icon based on type */}
                            <div className={clsx(
                              'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                              rec.isOverdue ? 'bg-red-100' : 'bg-slate-200'
                            )}>
                              {rec.type === 'lab' && <Beaker className="w-4 h-4" />}
                              {rec.type === 'medication' && <Pill className="w-4 h-4" />}
                              {rec.type === 'referral' && <ExternalLink className="w-4 h-4" />}
                              {rec.type === 'follow-up' && <Calendar className="w-4 h-4" />}
                              {rec.type === 'screening' && <CheckCircle className="w-4 h-4" />}
                              {rec.type === 'imaging' && <Target className="w-4 h-4" />}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-ehr-text-primary">
                                  {rec.description}
                                </span>
                                <span className={getPriorityBadge(rec.priority)}>
                                  {rec.priority}
                                </span>
                                {rec.isOverdue && (
                                  <span className="ehr-badge ehr-badge-danger">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Overdue
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-ehr-text-secondary mt-0.5">
                                {rec.rationale}
                              </p>
                              {rec.dueDate && (
                                <p className="text-xs text-ehr-text-muted mt-0.5 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Due: {rec.dueDate}
                                </p>
                              )}
                            </div>

                            {/* Quick Actions */}
                            {rec.actionable && (
                              <div className="flex items-center gap-1 shrink-0">
                                {rec.type === 'lab' && (
                                  <button
                                    onClick={() => onOrderLab?.(rec)}
                                    className="ehr-btn ehr-btn-primary text-xs py-1"
                                  >
                                    Order
                                  </button>
                                )}
                                <button
                                  onClick={() => onAddToPlan?.(rec)}
                                  className="ehr-btn ehr-btn-secondary text-xs py-1"
                                >
                                  Add to Plan
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Links */}
                  <div className="px-4 py-2 bg-slate-50 border-t border-ehr-border flex items-center gap-2">
                    <span className="text-xs text-ehr-text-muted">Quick:</span>
                    <button className="text-xs text-ehr-primary hover:underline">
                      View Lab Trends
                    </button>
                    <span className="text-ehr-text-muted">|</span>
                    <button className="text-xs text-ehr-primary hover:underline">
                      Related Medications
                    </button>
                    <span className="text-ehr-text-muted">|</span>
                    <button className="text-xs text-ehr-primary hover:underline">
                      Prior Notes
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
