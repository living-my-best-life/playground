import { useState } from 'react';
import {
  Phone,
  Mail,
  MessageSquare,
  FileText,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  MoreVertical,
  PhoneCall,
  PhoneMissed,
  PhoneOff,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';
import { format, parseISO, differenceInDays } from 'date-fns';
import type { OutreachItem } from '../../types';

interface OutreachWorkQueueProps {
  items: OutreachItem[];
  onContactPatient?: (item: OutreachItem) => void;
  onMarkComplete?: (item: OutreachItem) => void;
  onOpenChart?: (patientId: string) => void;
}

export function OutreachWorkQueue({
  items,
  onContactPatient,
  onMarkComplete,
  onOpenChart,
}: OutreachWorkQueueProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'attempted' | 'scheduled'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [typeFilter] = useState<'all' | 'follow-up' | 'lab-reminder' | 'preventive' | 'medication' | 'care-gap'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-slate-500" />;
      case 'attempted':
        return <PhoneMissed className="w-4 h-4 text-amber-500" />;
      case 'contacted':
        return <PhoneCall className="w-4 h-4 text-blue-500" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4 text-emerald-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'ehr-badge ehr-badge-neutral';
      case 'attempted':
        return 'ehr-badge ehr-badge-warning';
      case 'contacted':
        return 'ehr-badge ehr-badge-info';
      case 'scheduled':
        return 'ehr-badge ehr-badge-success';
      case 'completed':
        return 'ehr-badge ehr-badge-success';
      default:
        return 'ehr-badge ehr-badge-neutral';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-amber-500';
      case 'low':
        return 'border-l-slate-300';
      default:
        return 'border-l-slate-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'follow-up':
        return <Calendar className="w-4 h-4" />;
      case 'lab-reminder':
        return <FileText className="w-4 h-4" />;
      case 'preventive':
        return <AlertCircle className="w-4 h-4" />;
      case 'medication':
        return <AlertCircle className="w-4 h-4" />;
      case 'care-gap':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'no-answer':
        return <PhoneOff className="w-3 h-3 text-slate-500" />;
      case 'left-message':
        return <MessageSquare className="w-3 h-3 text-amber-500" />;
      case 'wrong-number':
        return <PhoneMissed className="w-3 h-3 text-red-500" />;
      case 'spoke-to-patient':
        return <PhoneCall className="w-3 h-3 text-emerald-500" />;
      case 'scheduled':
        return <Calendar className="w-3 h-3 text-emerald-500" />;
      default:
        return null;
    }
  };

  const filteredItems = items.filter((item) => {
    const statusMatch = filter === 'all' || item.status === filter;
    const priorityMatch = priorityFilter === 'all' || item.priority === priorityFilter;
    const typeMatch = typeFilter === 'all' || item.type === typeFilter;
    const searchMatch =
      searchQuery === '' ||
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && priorityMatch && typeMatch && searchMatch;
  });

  // Sort by priority and due date
  const sortedItems = [...filteredItems].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const counts = {
    pending: items.filter((i) => i.status === 'pending').length,
    attempted: items.filter((i) => i.status === 'attempted').length,
    high: items.filter((i) => i.priority === 'high').length,
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-ehr-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-ehr-text-primary">Patient Outreach Queue</h2>
            <span className="ehr-badge ehr-badge-neutral">{items.length} total</span>
            {counts.high > 0 && (
              <span className="ehr-badge ehr-badge-danger">{counts.high} high priority</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="ehr-btn ehr-btn-secondary text-xs">
              <Sparkles className="w-4 h-4" />
              Auto-Generate
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ehr-text-muted" />
          <input
            type="text"
            placeholder="Search patients or reasons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-ehr-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ehr-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-ehr-text-muted" />
            <span className="text-xs text-ehr-text-secondary">Status:</span>
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
              {(['all', 'pending', 'attempted', 'scheduled'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={clsx(
                    'px-2 py-1 text-xs font-medium rounded transition-colors capitalize',
                    filter === s
                      ? 'bg-white text-ehr-primary shadow-sm'
                      : 'text-ehr-text-secondary hover:text-ehr-text-primary'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-ehr-text-secondary">Priority:</span>
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
              {(['all', 'high', 'medium', 'low'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={clsx(
                    'px-2 py-1 text-xs font-medium rounded transition-colors capitalize',
                    priorityFilter === p
                      ? 'bg-white text-ehr-primary shadow-sm'
                      : 'text-ehr-text-secondary hover:text-ehr-text-primary'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-2">
          {sortedItems.map((item) => {
            const isExpanded = expandedItems.has(item.id);
            const daysSinceDue = differenceInDays(new Date(), parseISO(item.dueDate));
            const isOverdue = daysSinceDue > 0;

            return (
              <div
                key={item.id}
                className={clsx(
                  'ehr-card border-l-4 overflow-hidden',
                  getPriorityColor(item.priority)
                )}
              >
                {/* Main Row */}
                <div className="px-4 py-3 flex items-center gap-3">
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="p-1 hover:bg-slate-100 rounded"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-ehr-text-muted" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-ehr-text-muted" />
                    )}
                  </button>

                  {/* Status icon */}
                  {getStatusIcon(item.status)}

                  {/* Patient info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenChart?.(item.patientId)}
                        className="font-semibold text-ehr-primary hover:underline"
                      >
                        {item.patientName}
                      </button>
                      <span className={getStatusBadge(item.status)}>{item.status}</span>
                      <span className="ehr-badge ehr-badge-neutral flex items-center gap-1">
                        {getTypeIcon(item.type)}
                        {item.type}
                      </span>
                    </div>
                    <p className="text-sm text-ehr-text-secondary truncate mt-0.5">
                      {item.reason}
                    </p>
                  </div>

                  {/* Due date */}
                  <div className="text-right shrink-0">
                    <p
                      className={clsx(
                        'text-sm font-medium',
                        isOverdue ? 'text-red-600' : 'text-ehr-text-secondary'
                      )}
                    >
                      {isOverdue ? `${daysSinceDue}d overdue` : format(parseISO(item.dueDate), 'MM/dd')}
                    </p>
                    {item.assignedTo && (
                      <p className="text-xs text-ehr-text-muted flex items-center gap-1 justify-end">
                        <User className="w-3 h-3" />
                        {item.assignedTo}
                      </p>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onContactPatient?.(item)}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                      title="Call patient"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 hover:bg-slate-100 text-ehr-text-secondary rounded-lg transition-colors"
                      title="Send message"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 hover:bg-slate-100 text-ehr-text-secondary rounded-lg transition-colors"
                      title="More options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 py-3 border-t border-ehr-border bg-slate-50">
                    {/* Previous attempts */}
                    {item.attempts.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-ehr-text-secondary uppercase tracking-wider mb-2">
                          Previous Attempts ({item.attempts.length})
                        </h4>
                        <div className="space-y-1">
                          {item.attempts.map((attempt, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 text-sm py-1"
                            >
                              {getOutcomeIcon(attempt.outcome)}
                              <span className="text-ehr-text-muted">
                                {format(parseISO(attempt.date), 'MM/dd/yyyy')}
                              </span>
                              <span className="capitalize">{attempt.method}</span>
                              <span className="text-ehr-text-secondary">-</span>
                              <span className="capitalize text-ehr-text-secondary">
                                {attempt.outcome.replace('-', ' ')}
                              </span>
                              {attempt.notes && (
                                <span className="text-ehr-text-muted italic">
                                  "{attempt.notes}"
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button className="ehr-btn ehr-btn-primary text-xs">
                        <Phone className="w-4 h-4" />
                        Log Call
                      </button>
                      <button className="ehr-btn ehr-btn-secondary text-xs">
                        <Calendar className="w-4 h-4" />
                        Schedule
                      </button>
                      <button className="ehr-btn ehr-btn-secondary text-xs">
                        <Mail className="w-4 h-4" />
                        Send Reminder
                      </button>
                      <button
                        onClick={() => onMarkComplete?.(item)}
                        className="ehr-btn ehr-btn-ghost text-xs text-emerald-600"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Complete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {sortedItems.length === 0 && (
            <div className="text-center py-8 text-ehr-text-muted">
              No outreach items match the current filters
            </div>
          )}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="px-4 py-3 border-t border-ehr-border bg-slate-50 flex items-center justify-between text-xs text-ehr-text-secondary">
        <div>
          Showing {sortedItems.length} of {items.length} items
        </div>
        <div className="flex items-center gap-4">
          <span>{counts.pending} pending</span>
          <span>{counts.attempted} in progress</span>
        </div>
      </div>
    </div>
  );
}
