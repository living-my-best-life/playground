import {
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Calendar,
  Shield,
  User,
  ChevronDown,
  ChevronUp,
  Edit2,
} from 'lucide-react';
import { useState } from 'react';
import type { Patient, Allergy, VitalSigns } from '../../types';
import { format, differenceInYears, parseISO } from 'date-fns';

interface PatientBannerProps {
  patient: Patient;
  allergies: Allergy[];
  vitals: VitalSigns;
}

export function PatientBanner({ patient, allergies, vitals }: PatientBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const age = differenceInYears(new Date(), parseISO(patient.dateOfBirth));
  const genderAbbrev = patient.gender === 'female' ? 'F' : patient.gender === 'male' ? 'M' : 'O';

  return (
    <div className="bg-white border-b border-ehr-border">
      {/* Main Banner Row */}
      <div className="px-4 py-3 flex items-center gap-4">
        {/* Patient Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0">
          {patient.firstName[0]}{patient.lastName[0]}
        </div>

        {/* Patient Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-bold text-ehr-text-primary">
              {patient.lastName}, {patient.firstName}
            </h1>
            <span className="text-sm text-ehr-text-secondary">
              {age} yo {genderAbbrev}
            </span>
            <span className="text-sm text-ehr-text-muted">|</span>
            <span className="text-sm text-ehr-text-secondary font-mono">
              MRN: {patient.mrn}
            </span>
            <span className="text-sm text-ehr-text-muted">|</span>
            <span className="text-sm text-ehr-text-secondary">
              DOB: {format(parseISO(patient.dateOfBirth), 'MM/dd/yyyy')}
            </span>
          </div>

          {/* Allergies Alert */}
          {allergies.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-600">Allergies:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {allergies.map((allergy, idx) => (
                  <span
                    key={allergy.id}
                    className={`text-sm ${
                      allergy.severity === 'life-threatening'
                        ? 'text-red-700 font-semibold'
                        : allergy.severity === 'severe'
                        ? 'text-red-600 font-medium'
                        : 'text-red-500'
                    }`}
                  >
                    {allergy.allergen}
                    {allergy.severity === 'life-threatening' && ' (ANAPHYLAXIS)'}
                    {idx < allergies.length - 1 && ','}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Vitals */}
        <div className="hidden lg:flex items-center gap-4 text-sm">
          <div className="text-center">
            <p className="text-ehr-text-muted text-xs">BP</p>
            <p className={`font-semibold ${vitals.bloodPressure.systolic >= 140 ? 'text-red-600' : 'text-ehr-text-primary'}`}>
              {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
            </p>
          </div>
          <div className="text-center">
            <p className="text-ehr-text-muted text-xs">HR</p>
            <p className="font-semibold text-ehr-text-primary">{vitals.heartRate}</p>
          </div>
          <div className="text-center">
            <p className="text-ehr-text-muted text-xs">BMI</p>
            <p className={`font-semibold ${vitals.bmi >= 30 ? 'text-amber-600' : 'text-ehr-text-primary'}`}>
              {vitals.bmi.toFixed(1)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-ehr-text-muted text-xs">SpO2</p>
            <p className="font-semibold text-ehr-text-primary">{vitals.oxygenSaturation}%</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button className="ehr-btn ehr-btn-secondary text-xs">
            <Phone className="w-4 h-4" />
            Call
          </button>
          <button className="ehr-btn ehr-btn-secondary text-xs">
            <Calendar className="w-4 h-4" />
            Schedule
          </button>
          <button className="ehr-btn ehr-btn-primary text-xs">
            <Edit2 className="w-4 h-4" />
            Start Visit
          </button>
        </div>

        {/* Expand/Collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-ehr-text-secondary" />
          ) : (
            <ChevronDown className="w-5 h-5 text-ehr-text-secondary" />
          )}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 py-3 bg-slate-50 border-t border-ehr-border grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Contact Info */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-ehr-text-secondary uppercase tracking-wider">
              Contact Information
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-ehr-text-muted" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-ehr-text-muted" />
                <span className="truncate">{patient.email}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-ehr-text-muted shrink-0 mt-0.5" />
                <span>
                  {patient.address.street}, {patient.address.city}, {patient.address.state} {patient.address.zip}
                </span>
              </div>
            </div>
          </div>

          {/* Insurance Info */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-ehr-text-secondary uppercase tracking-wider">
              Insurance
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-ehr-text-muted" />
                <span className="font-medium">{patient.insurance.provider}</span>
              </div>
              <p className="text-ehr-text-secondary pl-6">{patient.insurance.planName}</p>
              <p className="text-ehr-text-secondary pl-6">
                Member ID: {patient.insurance.memberId}
              </p>
            </div>
          </div>

          {/* Provider Info */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-ehr-text-secondary uppercase tracking-wider">
              Care Team
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-ehr-text-muted" />
                <span>
                  <span className="font-medium">PCP:</span> {patient.primaryProvider}
                </span>
              </div>
              {patient.lastVisit && (
                <p className="text-ehr-text-secondary pl-6">
                  Last Visit: {format(parseISO(patient.lastVisit), 'MM/dd/yyyy')}
                </p>
              )}
              {patient.nextAppointment && (
                <p className="text-ehr-primary pl-6">
                  Next Appt: {format(parseISO(patient.nextAppointment), 'MM/dd/yyyy')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
