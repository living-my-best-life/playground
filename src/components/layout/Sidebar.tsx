import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Pill,
  TestTube,
  Heart,
  MessageSquare,
  FileText,
  Settings,
  ChevronRight,
  Inbox,
  AlertTriangle,
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'schedule', label: 'Schedule', icon: Calendar, badge: 12 },
  { id: 'inbox', label: 'Inbox', icon: Inbox, badge: 5 },
  { id: 'patients', label: 'Patient List', icon: Users },
];

const chartItems = [
  { id: 'chart', label: 'Chart Review', icon: FileText },
  { id: 'problems', label: 'Problem List', icon: ClipboardList },
  { id: 'medications', label: 'Medications', icon: Pill },
  { id: 'labs', label: 'Labs & Results', icon: TestTube },
  { id: 'preventive', label: 'Preventive Care', icon: Heart },
];

const workflowItems = [
  { id: 'outreach', label: 'Patient Outreach', icon: MessageSquare, badge: 8 },
  { id: 'alerts', label: 'Care Gaps', icon: AlertTriangle, badge: 3 },
];

export function Sidebar({ isOpen, activeView, onViewChange }: SidebarProps) {
  const NavItem = ({ item }: { item: typeof navItems[0] }) => (
    <button
      onClick={() => onViewChange(item.id)}
      className={clsx(
        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
        activeView === item.id
          ? 'bg-blue-50 text-ehr-primary font-medium'
          : 'text-ehr-text-secondary hover:bg-slate-100'
      )}
    >
      <item.icon className="w-5 h-5 shrink-0" />
      {isOpen && (
        <>
          <span className="flex-1 text-left">{item.label}</span>
          {'badge' in item && item.badge && (
            <span className="ehr-badge ehr-badge-info">{item.badge}</span>
          )}
        </>
      )}
    </button>
  );

  return (
    <aside
      className={clsx(
        'bg-white border-r border-ehr-border flex flex-col transition-all duration-300 shrink-0',
        isOpen ? 'w-56' : 'w-16'
      )}
    >
      {/* Current Patient Quick Info */}
      {isOpen && (
        <div className="p-3 border-b border-ehr-border">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                MT
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ehr-text-primary truncate">
                  Margaret Thompson
                </p>
                <p className="text-xs text-ehr-text-muted">66 yo F | MRN: 2024-001847</p>
              </div>
            </div>
            <button className="w-full mt-2 text-xs text-ehr-primary hover:underline flex items-center justify-center gap-1">
              Change Patient <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </div>

        {/* Chart Section */}
        {isOpen && (
          <div className="ehr-section-title mt-4 px-3">Chart</div>
        )}
        <div className="space-y-1">
          {chartItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </div>

        {/* Workflow Section */}
        {isOpen && (
          <div className="ehr-section-title mt-4 px-3">Workflow</div>
        )}
        <div className="space-y-1">
          {workflowItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </div>
      </nav>

      {/* Settings */}
      <div className="p-2 border-t border-ehr-border">
        <button
          onClick={() => onViewChange('settings')}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
            activeView === 'settings'
              ? 'bg-blue-50 text-ehr-primary font-medium'
              : 'text-ehr-text-secondary hover:bg-slate-100'
          )}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {isOpen && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}
