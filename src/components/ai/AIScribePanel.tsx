import { useState } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle,
  XCircle,
  Edit3,
  Send,
  Plus,
  Pill,
  Beaker,
  Calendar,
  Stethoscope,
  FileText,
  RotateCcw,
  Volume2,
  Keyboard,
  Wand2,
  AlertCircle,
} from 'lucide-react';
import clsx from 'clsx';
import type { GeneratedOrder, ScribeNote } from '../../types';

interface AIScribePanelProps {
  onOrderGenerated?: (order: GeneratedOrder) => void;
  onNoteUpdated?: (note: ScribeNote) => void;
}

export function AIScribePanel(_props: AIScribePanelProps) {
  const [isListening, setIsListening] = useState(false);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock scribe notes - setNotes would be used for real transcription updates
  const [notes] = useState<ScribeNote[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'subjective',
      content: 'Patient presents for diabetes and hypertension follow-up. Reports improved energy levels since starting metformin. Denies polyuria, polydipsia. Blood pressure readings at home have been 135-145 systolic.',
      confidence: 0.94,
      source: 'voice',
      isEdited: false,
    },
    {
      id: '2',
      timestamp: new Date().toISOString(),
      type: 'objective',
      content: 'BP 142/88, HR 78, Weight 185 lbs (stable). A1c 7.4% (improved from 8.2%). Foot exam: intact sensation, no ulcers.',
      confidence: 0.98,
      source: 'voice',
      isEdited: false,
    },
  ]);

  // Mock generated orders
  const [generatedOrders, setGeneratedOrders] = useState<GeneratedOrder[]>([
    {
      id: '1',
      type: 'lab',
      description: 'Hemoglobin A1c',
      details: 'Fasting not required. Repeat in 3 months.',
      confidence: 0.92,
      isConfirmed: false,
      sourceText: 'check A1c again in 3 months',
    },
    {
      id: '2',
      type: 'lab',
      description: 'Comprehensive Metabolic Panel',
      details: 'Fasting preferred. Monitor renal function on ACE-I.',
      confidence: 0.88,
      isConfirmed: false,
      sourceText: 'check kidney function',
    },
    {
      id: '3',
      type: 'medication',
      description: 'Increase Amlodipine to 10mg daily',
      details: 'For better BP control. Current: 5mg daily.',
      confidence: 0.85,
      isConfirmed: false,
      sourceText: 'increase amlodipine for blood pressure',
    },
    {
      id: '4',
      type: 'follow-up',
      description: 'Follow-up in 3 months',
      details: 'Diabetes/HTN management',
      confidence: 0.95,
      isConfirmed: false,
      sourceText: 'see back in 3 months',
    },
  ]);

  const getOrderIcon = (type: string) => {
    switch (type) {
      case 'lab':
        return <Beaker className="w-4 h-4" />;
      case 'medication':
        return <Pill className="w-4 h-4" />;
      case 'follow-up':
        return <Calendar className="w-4 h-4" />;
      case 'referral':
        return <Stethoscope className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getNoteTypeLabel = (type: string) => {
    switch (type) {
      case 'subjective':
        return 'Subjective';
      case 'objective':
        return 'Objective';
      case 'assessment':
        return 'Assessment';
      case 'plan':
        return 'Plan';
      default:
        return type;
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'subjective':
        return 'bg-blue-100 text-blue-700';
      case 'objective':
        return 'bg-emerald-100 text-emerald-700';
      case 'assessment':
        return 'bg-purple-100 text-purple-700';
      case 'plan':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate AI processing after 3 seconds
      setTimeout(() => {
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
        }, 1500);
      }, 3000);
    }
  };

  const confirmOrder = (orderId: string) => {
    setGeneratedOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, isConfirmed: true } : o))
    );
  };

  const rejectOrder = (orderId: string) => {
    setGeneratedOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const confirmAllOrders = () => {
    setGeneratedOrders((prev) => prev.map((o) => ({ ...o, isConfirmed: true })));
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    // Would process text input here
    setTextInput('');
  };

  const unconfirmedCount = generatedOrders.filter((o) => !o.isConfirmed).length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-ehr-border bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold text-purple-900">AI Scribe</h2>
            {isListening && (
              <span className="ehr-badge bg-red-100 text-red-700 animate-pulse">
                <Mic className="w-3 h-3 mr-1" />
                Recording
              </span>
            )}
            {isProcessing && (
              <span className="ehr-badge bg-purple-100 text-purple-700 ai-processing">
                Processing...
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Input mode toggle */}
            <div className="flex items-center bg-white rounded-lg p-0.5 border border-purple-200">
              <button
                onClick={() => setInputMode('voice')}
                className={clsx(
                  'p-1.5 rounded transition-colors',
                  inputMode === 'voice'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-slate-500 hover:text-purple-600'
                )}
                title="Voice input"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setInputMode('text')}
                className={clsx(
                  'p-1.5 rounded transition-colors',
                  inputMode === 'text'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-slate-500 hover:text-purple-600'
                )}
                title="Text input"
              >
                <Keyboard className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-b border-ehr-border">
        {inputMode === 'voice' ? (
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={toggleListening}
              className={clsx(
                'w-16 h-16 rounded-full flex items-center justify-center transition-all',
                isListening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-200 scale-110'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              )}
            >
              {isListening ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
            <p className="text-sm text-ehr-text-secondary">
              {isListening ? 'Click to stop recording' : 'Click to start voice dictation'}
            </p>
            {isListening && (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-red-500 rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 20 + 10}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type or paste clinical notes here. AI will extract orders and structure your documentation..."
              className="flex-1 ehr-input min-h-[80px] resize-none"
            />
            <button
              onClick={handleTextSubmit}
              className="ehr-btn ehr-btn-primary self-end"
            >
              <Wand2 className="w-4 h-4" />
              Process
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {/* Scribe Notes */}
        <div className="p-4 border-b border-ehr-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-ehr-text-secondary">
              Transcribed Notes
            </h3>
            <button className="text-xs text-ehr-primary hover:underline flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="group relative">
                <div className="flex items-start gap-2">
                  <span
                    className={clsx(
                      'px-2 py-0.5 rounded text-xs font-medium shrink-0',
                      getNoteTypeColor(note.type)
                    )}
                  >
                    {getNoteTypeLabel(note.type)}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-ehr-text-primary leading-relaxed">
                      {note.content}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-ehr-text-muted">
                        Confidence: {Math.round(note.confidence * 100)}%
                      </span>
                      <span className="text-xs text-ehr-text-muted">|</span>
                      <span className="text-xs text-ehr-text-muted capitalize">
                        {note.source}
                      </span>
                      {note.isEdited && (
                        <>
                          <span className="text-xs text-ehr-text-muted">|</span>
                          <span className="text-xs text-amber-600">Edited</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded transition-opacity">
                    <Edit3 className="w-4 h-4 text-ehr-text-muted" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Note Button */}
          <button className="mt-3 w-full py-2 border-2 border-dashed border-ehr-border rounded-lg text-sm text-ehr-text-muted hover:border-ehr-primary hover:text-ehr-primary transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Add Assessment / Plan
          </button>
        </div>

        {/* Generated Orders */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-ehr-text-secondary">
                Generated Orders
              </h3>
              {unconfirmedCount > 0 && (
                <span className="ehr-badge ehr-badge-warning">
                  {unconfirmedCount} pending
                </span>
              )}
            </div>
            {unconfirmedCount > 0 && (
              <button
                onClick={confirmAllOrders}
                className="text-xs text-ehr-primary hover:underline flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                Confirm All
              </button>
            )}
          </div>

          <div className="space-y-2">
            {generatedOrders.map((order) => (
              <div
                key={order.id}
                className={clsx(
                  'p-3 rounded-lg border transition-colors',
                  order.isConfirmed
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-ehr-border hover:border-purple-200'
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={clsx(
                      'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                      order.isConfirmed ? 'bg-emerald-100' : 'bg-purple-100'
                    )}
                  >
                    {order.isConfirmed ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      getOrderIcon(order.type)
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{order.description}</span>
                      <span className="ehr-badge ehr-badge-neutral capitalize">
                        {order.type}
                      </span>
                      {!order.isConfirmed && (
                        <span className="text-xs text-purple-600">
                          {Math.round(order.confidence * 100)}% confident
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ehr-text-secondary mt-0.5">
                      {order.details}
                    </p>
                    {order.sourceText && !order.isConfirmed && (
                      <p className="text-xs text-ehr-text-muted mt-1 italic">
                        Source: "{order.sourceText}"
                      </p>
                    )}
                  </div>

                  {!order.isConfirmed && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => confirmOrder(order.id)}
                        className="p-1.5 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200 transition-colors"
                        title="Confirm order"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => rejectOrder(order.id)}
                        className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                        title="Reject order"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Order Button */}
          <button className="mt-3 w-full py-2 border-2 border-dashed border-ehr-border rounded-lg text-sm text-ehr-text-muted hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Add Manual Order
          </button>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-3 border-t border-ehr-border bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-ehr-text-muted">
          <AlertCircle className="w-4 h-4" />
          Review all AI-generated content before signing
        </div>
        <div className="flex items-center gap-2">
          <button className="ehr-btn ehr-btn-secondary">Save Draft</button>
          <button className="ehr-btn ehr-btn-primary">
            <Send className="w-4 h-4" />
            Sign & Submit Orders
          </button>
        </div>
      </div>
    </div>
  );
}
