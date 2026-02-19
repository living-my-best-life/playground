import {
  Menu,
  Bell,
  Search,
  Settings,
  HelpCircle,
  LogOut,
  User,
  Mic,
  MicOff,
} from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-14 bg-white border-b border-ehr-border flex items-center px-4 gap-4 shrink-0">
      {/* Menu toggle */}
      <button
        onClick={onToggleSidebar}
        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5 text-ehr-text-secondary" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">EHR</span>
        </div>
        <span className="font-semibold text-ehr-text-primary hidden sm:block">
          Modern PCP
        </span>
      </div>

      {/* Search bar */}
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ehr-text-muted" />
          <input
            type="text"
            placeholder="Search patients, problems, medications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-ehr-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ehr-primary focus:bg-white transition-colors"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs text-ehr-text-muted bg-white border border-ehr-border rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Voice dictation toggle */}
      <button
        onClick={() => setIsVoiceActive(!isVoiceActive)}
        className={`p-2 rounded-lg transition-colors ${
          isVoiceActive
            ? 'bg-red-100 text-red-600 voice-active'
            : 'hover:bg-slate-100 text-ehr-text-secondary'
        }`}
        aria-label={isVoiceActive ? 'Stop voice dictation' : 'Start voice dictation'}
      >
        {isVoiceActive ? (
          <Mic className="w-5 h-5" />
        ) : (
          <MicOff className="w-5 h-5" />
        )}
      </button>

      {/* AI Status indicator */}
      <div className="ai-indicator">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
        <span>AI Ready</span>
      </div>

      {/* Notifications */}
      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
        <Bell className="w-5 h-5 text-ehr-text-secondary" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Help */}
      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
        <HelpCircle className="w-5 h-5 text-ehr-text-secondary" />
      </button>

      {/* Settings */}
      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
        <Settings className="w-5 h-5 text-ehr-text-secondary" />
      </button>

      {/* User menu */}
      <div className="flex items-center gap-2 pl-2 border-l border-ehr-border">
        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-ehr-text-secondary" />
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-medium text-ehr-text-primary">Dr. Sarah Chen</p>
          <p className="text-xs text-ehr-text-muted">Internal Medicine</p>
        </div>
        <button className="p-1 hover:bg-slate-100 rounded transition-colors">
          <LogOut className="w-4 h-4 text-ehr-text-secondary" />
        </button>
      </div>
    </header>
  );
}
