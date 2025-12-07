import { useState } from 'react';
import { Header, Sidebar, SplitView } from './components/layout';
import { PatientBanner } from './components/patient/PatientBanner';
import { ChartReviewPanel } from './components/patient/ChartReviewPanel';
import { ChronicDiseasePanel } from './components/chronic/ChronicDiseasePanel';
import { LabTrendChart } from './components/labs/LabTrendChart';
import { MedicationPanel } from './components/medications/MedicationPanel';
import { PreventiveHealthPanel } from './components/preventive/PreventiveHealthPanel';
import { AIScribePanel } from './components/ai/AIScribePanel';
import { OutreachWorkQueue } from './components/outreach/OutreachWorkQueue';
import { OrderSetsPanel } from './components/orders/OrderSetsPanel';
import {
  mockPatient,
  mockProblems,
  mockMedications,
  mockAllergies,
  mockLabPanels,
  mockLabTrends,
  mockPreventiveItems,
  mockSocialHistory,
  mockFamilyHistory,
  mockSurgicalHistory,
  mockVitalSigns,
  mockOrderSets,
  mockOutreachQueue,
} from './data/mockData';
import {
  FileText,
  Activity,
  Pill,
  TestTube,
  Heart,
  Sparkles,
  Users,
  Package,
} from 'lucide-react';
import clsx from 'clsx';

type LeftPanelView = 'chart' | 'chronic' | 'medications' | 'labs' | 'preventive' | 'orders';
type RightPanelView = 'scribe' | 'outreach';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('chart');
  const [leftPanelView, setLeftPanelView] = useState<LeftPanelView>('chronic');
  const [rightPanelView, setRightPanelView] = useState<RightPanelView>('scribe');

  const leftPanelOptions: { id: LeftPanelView; label: string; icon: any }[] = [
    { id: 'chart', label: 'Chart', icon: FileText },
    { id: 'chronic', label: 'Chronic', icon: Activity },
    { id: 'medications', label: 'Meds', icon: Pill },
    { id: 'labs', label: 'Labs', icon: TestTube },
    { id: 'preventive', label: 'Preventive', icon: Heart },
    { id: 'orders', label: 'Orders', icon: Package },
  ];

  const rightPanelOptions: { id: RightPanelView; label: string; icon: any }[] = [
    { id: 'scribe', label: 'AI Scribe', icon: Sparkles },
    { id: 'outreach', label: 'Outreach', icon: Users },
  ];

  const renderLeftPanel = () => {
    switch (leftPanelView) {
      case 'chart':
        return (
          <ChartReviewPanel
            problems={mockProblems}
            socialHistory={mockSocialHistory}
            familyHistory={mockFamilyHistory}
            surgicalHistory={mockSurgicalHistory}
            vitals={mockVitalSigns}
          />
        );
      case 'chronic':
        return <ChronicDiseasePanel problems={mockProblems} />;
      case 'medications':
        return <MedicationPanel medications={mockMedications} allergies={mockAllergies} />;
      case 'labs':
        return <LabTrendChart trends={mockLabTrends} recentPanels={mockLabPanels} />;
      case 'preventive':
        return (
          <PreventiveHealthPanel
            items={mockPreventiveItems}
            socialHistory={mockSocialHistory}
            familyHistory={mockFamilyHistory}
          />
        );
      case 'orders':
        return <OrderSetsPanel orderSets={mockOrderSets} />;
      default:
        return null;
    }
  };

  const renderRightPanel = () => {
    switch (rightPanelView) {
      case 'scribe':
        return <AIScribePanel />;
      case 'outreach':
        return <OutreachWorkQueue items={mockOutreachQueue} />;
      default:
        return null;
    }
  };

  // Main EHR view with patient chart
  const renderMainView = () => {
    if (activeView === 'outreach') {
      return (
        <div className="flex-1 overflow-hidden">
          <OutreachWorkQueue items={mockOutreachQueue} />
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Patient Banner */}
        <PatientBanner
          patient={mockPatient}
          allergies={mockAllergies}
          vitals={mockVitalSigns}
        />

        {/* Panel Navigation Tabs */}
        <div className="bg-white border-b border-ehr-border px-4 py-2 flex items-center justify-between">
          {/* Left Panel Tabs */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-ehr-text-muted mr-2">Chart View:</span>
            {leftPanelOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setLeftPanelView(opt.id)}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  leftPanelView === opt.id
                    ? 'bg-blue-100 text-ehr-primary'
                    : 'text-ehr-text-secondary hover:bg-slate-100'
                )}
              >
                <opt.icon className="w-4 h-4" />
                {opt.label}
              </button>
            ))}
          </div>

          {/* Right Panel Tabs */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-ehr-text-muted mr-2">Work Panel:</span>
            {rightPanelOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setRightPanelView(opt.id)}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  rightPanelView === opt.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-ehr-text-secondary hover:bg-slate-100'
                )}
              >
                <opt.icon className="w-4 h-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Split View Content */}
        <div className="flex-1 overflow-hidden bg-ehr-bg-secondary">
          <SplitView
            leftPanel={
              <div className="h-full overflow-auto bg-white">{renderLeftPanel()}</div>
            }
            rightPanel={
              <div className="h-full overflow-hidden bg-white">{renderRightPanel()}</div>
            }
            leftTitle={leftPanelOptions.find((o) => o.id === leftPanelView)?.label || 'Chart'}
            rightTitle={rightPanelOptions.find((o) => o.id === rightPanelView)?.label || 'Documentation'}
            defaultSplit={55}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-ehr-bg-primary">
      {/* Header */}
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} activeView={activeView} onViewChange={setActiveView} />

        {/* Main View */}
        {renderMainView()}
      </div>
    </div>
  );
}

export default App;
