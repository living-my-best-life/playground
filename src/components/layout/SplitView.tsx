import { useState, ReactNode } from 'react';
import {
  GripVertical,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelRightClose,
} from 'lucide-react';
import clsx from 'clsx';

interface SplitViewProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  leftTitle?: string;
  rightTitle?: string;
  defaultSplit?: number;
}

export function SplitView({
  leftPanel,
  rightPanel,
  leftTitle = 'Chart Review',
  rightTitle = 'Documentation',
  defaultSplit = 50,
}: SplitViewProps) {
  const [splitPosition, setSplitPosition] = useState(defaultSplit);
  const [isDragging, setIsDragging] = useState(false);
  const [maximizedPanel, setMaximizedPanel] = useState<'left' | 'right' | null>(null);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const newSplit = ((e.clientX - rect.left) / rect.width) * 100;
    setSplitPosition(Math.min(Math.max(newSplit, 20), 80));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  const toggleMaximize = (panel: 'left' | 'right') => {
    if (maximizedPanel === panel) {
      setMaximizedPanel(null);
    } else {
      setMaximizedPanel(panel);
    }
  };

  const getLeftWidth = () => {
    if (maximizedPanel === 'left') return '100%';
    if (maximizedPanel === 'right') return '0%';
    if (isLeftCollapsed) return '40px';
    if (isRightCollapsed) return 'calc(100% - 40px)';
    return `${splitPosition}%`;
  };

  const getRightWidth = () => {
    if (maximizedPanel === 'right') return '100%';
    if (maximizedPanel === 'left') return '0%';
    if (isRightCollapsed) return '40px';
    if (isLeftCollapsed) return 'calc(100% - 40px)';
    return `${100 - splitPosition}%`;
  };

  return (
    <div
      className="flex h-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Left Panel */}
      <div
        className={clsx(
          'flex flex-col transition-all duration-200',
          maximizedPanel === 'right' && 'hidden',
          isLeftCollapsed && 'overflow-hidden'
        )}
        style={{ width: getLeftWidth() }}
      >
        {/* Left Panel Header */}
        <div className="ehr-panel-header">
          {isLeftCollapsed ? (
            <button
              onClick={() => setIsLeftCollapsed(false)}
              className="p-1 hover:bg-slate-200 rounded"
              title="Expand panel"
            >
              <PanelLeftClose className="w-4 h-4 rotate-180" />
            </button>
          ) : (
            <>
              <span className="ehr-panel-title">{leftTitle}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsLeftCollapsed(true)}
                  className="p-1 hover:bg-slate-200 rounded"
                  title="Collapse panel"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleMaximize('left')}
                  className="p-1 hover:bg-slate-200 rounded"
                  title={maximizedPanel === 'left' ? 'Restore' : 'Maximize'}
                >
                  {maximizedPanel === 'left' ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Left Panel Content */}
        {!isLeftCollapsed && (
          <div className="flex-1 overflow-auto">
            {leftPanel}
          </div>
        )}
      </div>

      {/* Resizer */}
      {!maximizedPanel && !isLeftCollapsed && !isRightCollapsed && (
        <div
          className={clsx(
            'w-1 bg-ehr-border hover:bg-ehr-primary cursor-col-resize flex items-center justify-center group transition-colors shrink-0',
            isDragging && 'bg-ehr-primary'
          )}
          onMouseDown={handleMouseDown}
        >
          <div className="w-4 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-ehr-text-muted" />
          </div>
        </div>
      )}

      {/* Right Panel */}
      <div
        className={clsx(
          'flex flex-col transition-all duration-200',
          maximizedPanel === 'left' && 'hidden',
          isRightCollapsed && 'overflow-hidden'
        )}
        style={{ width: getRightWidth() }}
      >
        {/* Right Panel Header */}
        <div className="ehr-panel-header">
          {isRightCollapsed ? (
            <button
              onClick={() => setIsRightCollapsed(false)}
              className="p-1 hover:bg-slate-200 rounded"
              title="Expand panel"
            >
              <PanelRightClose className="w-4 h-4 rotate-180" />
            </button>
          ) : (
            <>
              <span className="ehr-panel-title">{rightTitle}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleMaximize('right')}
                  className="p-1 hover:bg-slate-200 rounded"
                  title={maximizedPanel === 'right' ? 'Restore' : 'Maximize'}
                >
                  {maximizedPanel === 'right' ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsRightCollapsed(true)}
                  className="p-1 hover:bg-slate-200 rounded"
                  title="Collapse panel"
                >
                  <PanelRightClose className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right Panel Content */}
        {!isRightCollapsed && (
          <div className="flex-1 overflow-auto">
            {rightPanel}
          </div>
        )}
      </div>
    </div>
  );
}
