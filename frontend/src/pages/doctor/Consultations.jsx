import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { FileText, RefreshCw, Calendar, Stethoscope, User } from 'lucide-react';

const DoctorConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/consultations/P1001').catch(() => ({ data: [] }));
      setConsultations(res.data || []);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clinical Consultations Archive</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log of prescriptions and clinical notes issued to rural patients
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
            <p className="text-sm font-semibold text-slate-700">No consultation records found</p>
            <p className="text-xs text-slate-400 mt-1">Review patient charts to submit new consultation summaries.</p>
          </div>
        ) : (
          consultations.map((c) => (
            <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-sky-50 text-sky-700 rounded-xl">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">{c.diagnosis}</h2>
                    <span className="text-[11px] text-slate-400">Patient ID: {c.patientId}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">{new Date(c.createdAt).toLocaleDateString()}</span>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                    {c.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {c.notes}
              </p>

              {c.prescription && (
                <p className="text-xs text-sky-800 bg-sky-50/50 p-3 rounded-xl border border-sky-100">
                  <strong>Prescription:</strong> {c.prescription}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorConsultations;
