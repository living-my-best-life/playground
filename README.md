# Modern PCP EHR

A modern, AI-powered Electronic Health Record (EHR) system designed for Primary Care Physicians with a focus on workflow efficiency, minimal clicks, and multi-modal input support.

## Features

### Side-by-Side View
- Split-panel interface for simultaneous chart review and documentation
- Resizable panels with maximize/minimize options
- Quick panel switching without losing context

### Chronic Disease Management
- AI-generated clinical summaries for each medical problem
- Treatment target tracking with goal status indicators
- Trending visualization showing improvement/worsening
- Smart recommendations for overdue labs, referrals, and follow-ups
- One-click ordering from recommendations

### Lab Management
- Interactive trend charts with reference ranges
- Filterable time ranges (6 months, 1 year, 2 years, all)
- Abnormal value highlighting
- Quick lab ordering

### Medication Management with Adherence Tracking
- PDMP/pharmacy dispense database integration (mocked)
- PDC (Proportion of Days Covered) adherence scoring
- Visual adherence indicators: taking/not-taking/taking-differently
- Medication alerts: duplicates, no-diagnosis, non-adherence
- Medications grouped by associated medical problem
- AI-summarized adherence insights

### Preventive Health
- Status tracking: due, overdue, completed, not-applicable
- Immunization registry integration (mocked)
- AI recommendations based on social/family history
- Automated patient reminders

### AI Scribe
- Voice dictation support with real-time transcription
- Text input with AI processing
- Automatic order generation from documentation
- SOAP note structure (Subjective, Objective, Assessment, Plan)
- Confidence scoring on AI-generated content
- One-click order confirmation/rejection

### Smart Order Sets
- Condition-based order sets (Diabetes, Hypertension, etc.)
- AI-recommended order sets based on patient problems
- Quick orders for common labs
- Customizable order selection

### Patient Outreach Work Queue
- Priority-based task management
- Filter by status, priority, type
- Contact attempt tracking
- Multi-channel outreach (phone, email, SMS)

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **date-fns** - Date handling

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app runs on `http://localhost:3000` by default.

## Project Structure

```
src/
├── components/
│   ├── ai/              # AI Scribe components
│   ├── chronic/         # Chronic disease management
│   ├── labs/            # Lab trending and results
│   ├── layout/          # Header, Sidebar, SplitView
│   ├── medications/     # Medication management
│   ├── orders/          # Order sets
│   ├── outreach/        # Patient outreach queue
│   ├── patient/         # Patient banner, chart review
│   └── preventive/      # Preventive health
├── data/
│   └── mockData.ts      # Sample patient data
├── types/
│   └── index.ts         # TypeScript interfaces
├── App.tsx              # Main application
├── main.tsx             # Entry point
└── index.css            # Global styles + Tailwind
```

## Design Principles

1. **Minimal Clicks** - Actions are accessible within 1-2 clicks
2. **Side-by-Side** - Review and document simultaneously
3. **AI-First** - AI summaries, recommendations, and automation throughout
4. **Multi-Modal** - Support for voice, text, and click-based input
5. **Agent-Ready** - Structured for AI agent automation

## Future Enhancements

- [ ] Real-time voice transcription integration
- [ ] FHIR API integration for patient data
- [ ] Ambient listening for automatic documentation
- [ ] AI agent API for automated workflows
- [ ] Mobile-responsive design
- [ ] Dark mode support
- [ ] Offline capability

## License

MIT
