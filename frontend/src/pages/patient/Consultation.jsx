import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import { FileText, Stethoscope, Calendar, Clock, Pill, RefreshCw } from 'lucide-react';

const PatientConsultation = () => {
  const { user } = useAuth();
  const patientId = user?.entityId || 'P1001';

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/consultations/${patientId}`);
      if (res && res.data) {
        setConsultations(res.data);
      }
    } catch (err) {
      console.warn('Error fetching consultations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [patientId]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Doctor Prescriptions & Consultations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official medical records provided by rural health center physicians
          </p>
        </div>

        <button
          onClick={fetchConsultations}
          className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="space-y-4">
        {consultations.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No medical consultations recorded yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Once an on-duty medical officer reviews your vitals or completes an emergency review, the diagnosis and prescription will be published here.
            </p>
          </div>
        ) : (
          consultations.map((c) => (
            <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">{c.diagnosis || 'General Clinical Review'}</h2>
                    <span className="text-[11px] text-slate-400">
                      Consultation ID: <span className="font-mono">{c.id}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {c.status || 'COMPLETED'}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Clinical Notes */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Physician Clinical Notes:</span>
                <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                  {c.notes || 'Patient vitals examined. Continued tele-monitoring recommended.'}
                </p>
              </div>

              {/* Prescription */}
              {c.prescription && (
                <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-100 flex items-start gap-2.5">
                  <Pill className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-sky-900 block mb-0.5">Prescription & Medications:</span>
                    <p className="text-xs text-sky-800 leading-relaxed">{c.prescription}</p>
                  </div>
                </div>
              )}

              {/* Follow-up */}
              {c.followUpDate && (
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span>Next Recommended Follow-up: <strong>{c.followUpDate}</strong></span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientConsultation;
