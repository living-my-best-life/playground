import { useState } from 'react';
import {
  Package,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  Sparkles,
  Plus,
  Beaker,
  Stethoscope,
  Pill,
  Zap,
  Search,
  Clock,
} from 'lucide-react';
import clsx from 'clsx';
import type { OrderSet, OrderSetItem } from '../../types';

interface OrderSetsPanelProps {
  orderSets: OrderSet[];
  onPlaceOrders?: (orders: OrderSetItem[]) => void;
}

export function OrderSetsPanel({ orderSets, onPlaceOrders }: OrderSetsPanelProps) {
  const [expandedSets, setExpandedSets] = useState<Set<string>>(
    new Set(orderSets.filter((os) => os.isAIRecommended).map((os) => os.id))
  );
  const [selectedOrders, setSelectedOrders] = useState<Record<string, Set<number>>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedSets);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSets(newExpanded);
  };

  const toggleOrder = (setId: string, orderIndex: number) => {
    const current = selectedOrders[setId] || new Set();
    const newSet = new Set(current);
    if (newSet.has(orderIndex)) {
      newSet.delete(orderIndex);
    } else {
      newSet.add(orderIndex);
    }
    setSelectedOrders({ ...selectedOrders, [setId]: newSet });
  };

  const selectAll = (setId: string, orders: OrderSetItem[]) => {
    const allSelected = new Set(orders.map((_, i) => i));
    setSelectedOrders({ ...selectedOrders, [setId]: allSelected });
  };

  const deselectAll = (setId: string) => {
    setSelectedOrders({ ...selectedOrders, [setId]: new Set() });
  };

  const getOrderIcon = (type: string) => {
    switch (type) {
      case 'lab':
        return <Beaker className="w-4 h-4 text-blue-600" />;
      case 'imaging':
        return <Search className="w-4 h-4 text-purple-600" />;
      case 'referral':
        return <Stethoscope className="w-4 h-4 text-emerald-600" />;
      case 'medication':
        return <Pill className="w-4 h-4 text-amber-600" />;
      default:
        return <Package className="w-4 h-4 text-slate-600" />;
    }
  };

  const getSelectedCount = (setId: string) => {
    return selectedOrders[setId]?.size || 0;
  };

  const handlePlaceOrders = (setId: string, orders: OrderSetItem[]) => {
    const selected = selectedOrders[setId] || new Set();
    const ordersToPlace = orders.filter((_, i) => selected.has(i));
    onPlaceOrders?.(ordersToPlace);
  };

  // Filter and sort order sets
  const filteredSets = orderSets.filter(
    (os) =>
      searchQuery === '' ||
      os.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      os.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by AI recommended vs manual
  const aiRecommended = filteredSets.filter((os) => os.isAIRecommended);
  const manualSets = filteredSets.filter((os) => !os.isAIRecommended);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-ehr-text-primary">Order Sets</h2>
          <span className="ehr-badge ehr-badge-neutral">{orderSets.length}</span>
        </div>
        <button className="ehr-btn ehr-btn-secondary text-xs">
          <Plus className="w-4 h-4" />
          Create Custom
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ehr-text-muted" />
        <input
          type="text"
          placeholder="Search order sets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-ehr-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ehr-primary"
        />
      </div>

      {/* AI Recommended Sets */}
      {aiRecommended.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
              AI Recommended for This Patient
            </span>
          </div>

          <div className="space-y-2">
            {aiRecommended.map((os) => (
              <OrderSetCard
                key={os.id}
                orderSet={os}
                isExpanded={expandedSets.has(os.id)}
                selectedOrders={selectedOrders[os.id] || new Set()}
                onToggleExpand={() => toggleExpand(os.id)}
                onToggleOrder={(idx) => toggleOrder(os.id, idx)}
                onSelectAll={() => selectAll(os.id, os.orders)}
                onDeselectAll={() => deselectAll(os.id)}
                onPlaceOrders={() => handlePlaceOrders(os.id, os.orders)}
                getOrderIcon={getOrderIcon}
                getSelectedCount={() => getSelectedCount(os.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Order Sets */}
      {manualSets.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-ehr-text-muted" />
            <span className="text-xs font-semibold text-ehr-text-secondary uppercase tracking-wider">
              Available Order Sets
            </span>
          </div>

          <div className="space-y-2">
            {manualSets.map((os) => (
              <OrderSetCard
                key={os.id}
                orderSet={os}
                isExpanded={expandedSets.has(os.id)}
                selectedOrders={selectedOrders[os.id] || new Set()}
                onToggleExpand={() => toggleExpand(os.id)}
                onToggleOrder={(idx) => toggleOrder(os.id, idx)}
                onSelectAll={() => selectAll(os.id, os.orders)}
                onDeselectAll={() => deselectAll(os.id)}
                onPlaceOrders={() => handlePlaceOrders(os.id, os.orders)}
                getOrderIcon={getOrderIcon}
                getSelectedCount={() => getSelectedCount(os.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Order */}
      <div className="mt-4 pt-4 border-t border-ehr-border">
        <h3 className="text-xs font-semibold text-ehr-text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
          <Zap className="w-3 h-3" />
          Quick Orders
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="quick-action text-sm">
            <Beaker className="w-4 h-4 text-blue-600" />
            CBC
          </button>
          <button className="quick-action text-sm">
            <Beaker className="w-4 h-4 text-blue-600" />
            CMP
          </button>
          <button className="quick-action text-sm">
            <Beaker className="w-4 h-4 text-blue-600" />
            Lipid Panel
          </button>
          <button className="quick-action text-sm">
            <Beaker className="w-4 h-4 text-blue-600" />
            TSH
          </button>
          <button className="quick-action text-sm">
            <Beaker className="w-4 h-4 text-blue-600" />
            HbA1c
          </button>
          <button className="quick-action text-sm">
            <Beaker className="w-4 h-4 text-blue-600" />
            Urinalysis
          </button>
        </div>
      </div>
    </div>
  );
}

interface OrderSetCardProps {
  orderSet: OrderSet;
  isExpanded: boolean;
  selectedOrders: Set<number>;
  onToggleExpand: () => void;
  onToggleOrder: (idx: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onPlaceOrders: () => void;
  getOrderIcon: (type: string) => JSX.Element;
  getSelectedCount: () => number;
}

function OrderSetCard({
  orderSet: os,
  isExpanded,
  selectedOrders,
  onToggleExpand,
  onToggleOrder,
  onSelectAll,
  onDeselectAll,
  onPlaceOrders,
  getOrderIcon,
  getSelectedCount,
}: OrderSetCardProps) {
  const selectedCount = getSelectedCount();

  return (
    <div
      className={clsx(
        'ehr-card overflow-hidden transition-shadow',
        os.isAIRecommended && 'border-purple-200',
        isExpanded && 'shadow-ehr-md'
      )}
    >
      {/* Header */}
      <button
        onClick={onToggleExpand}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
      >
        <div
          className={clsx(
            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
            os.isAIRecommended ? 'bg-purple-100' : 'bg-slate-100'
          )}
        >
          {os.isAIRecommended ? (
            <Sparkles className="w-4 h-4 text-purple-600" />
          ) : (
            <Package className="w-4 h-4 text-slate-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ehr-text-primary">{os.name}</span>
            <span className="ehr-badge ehr-badge-neutral">{os.orders.length} orders</span>
            {selectedCount > 0 && (
              <span className="ehr-badge ehr-badge-success">{selectedCount} selected</span>
            )}
          </div>
          <p className="text-xs text-ehr-text-secondary mt-0.5">For: {os.condition}</p>
        </div>

        {os.lastUsed && (
          <div className="text-xs text-ehr-text-muted flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Used {os.lastUsed}
          </div>
        )}

        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-ehr-text-muted shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-ehr-text-muted shrink-0" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-ehr-border">
          {/* Select All / Deselect All */}
          <div className="px-4 py-2 bg-slate-50 flex items-center justify-between border-b border-ehr-border">
            <div className="flex items-center gap-2">
              <button
                onClick={onSelectAll}
                className="text-xs text-ehr-primary hover:underline"
              >
                Select All
              </button>
              <span className="text-ehr-text-muted">|</span>
              <button
                onClick={onDeselectAll}
                className="text-xs text-ehr-text-secondary hover:underline"
              >
                Deselect All
              </button>
            </div>
            {selectedCount > 0 && (
              <button
                onClick={onPlaceOrders}
                className="ehr-btn ehr-btn-primary text-xs"
              >
                Place {selectedCount} Order{selectedCount > 1 ? 's' : ''}
              </button>
            )}
          </div>

          {/* Orders List */}
          <div className="divide-y divide-ehr-border">
            {os.orders.map((order, idx) => {
              const isSelected = selectedOrders.has(idx);
              return (
                <button
                  key={idx}
                  onClick={() => onToggleOrder(idx)}
                  className={clsx(
                    'w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left',
                    isSelected && 'bg-blue-50'
                  )}
                >
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-ehr-primary shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-ehr-text-muted shrink-0" />
                  )}

                  {getOrderIcon(order.type)}

                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm">{order.name}</span>
                    <p className="text-xs text-ehr-text-secondary">{order.details}</p>
                    {order.frequency && (
                      <p className="text-xs text-ehr-text-muted">Frequency: {order.frequency}</p>
                    )}
                  </div>

                  <span className="ehr-badge ehr-badge-neutral capitalize text-xs">
                    {order.type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
