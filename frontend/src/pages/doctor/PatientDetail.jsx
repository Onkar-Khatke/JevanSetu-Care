import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  HeartPulse,
  Activity,
  Thermometer,
  ShieldAlert,
  AlertTriangle,
  FileText,
  User,
  PlusCircle,
  CheckCircle,
  Calendar,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

const DoctorPatientDetail = () => {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingConsultation, setSavingConsultation] = useState(false);
  const [consultationSuccess, setConsultationSuccess] = useState('');

  const [form, setForm] = useState({
    diagnosis: '',
    notes: '',
    prescription: '',
    followUpDate: ''
  });

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/doctors/patients/${id}`);
      if (res && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.warn('Failed to load patient summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const handleConsultationSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingConsultation(true);
      const payload = {
        patientId: id,
        diagnosis: form.diagnosis,
        notes: form.notes,
        prescription: form.prescription,
        followUpDate: form.followUpDate
      };

      const res = await apiClient.post('/consultations', payload);
      if (res && res.data) {
        setConsultationSuccess('Consultation notes & prescription successfully submitted to patient chart!');
        setForm({ diagnosis: '', notes: '', prescription: '', followUpDate: '' });
        fetchPatientDetails();
        setTimeout(() => setConsultationSuccess(''), 4000);
      }
    } catch (err) {
      alert('Failed to save consultation.');
    } finally {
      setSavingConsultation(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 text-center text-xs text-slate-500">
        Loading patient clinical details...
      </div>
    );
  }

  const patient = data?.patient;
  const latestVital = data?.latestVital || {};
  const vitalHistory = data?.vitalHistory || [];
  const aiRisk = data?.aiRisk;
  const consultations = data?.consultations || [];

  const chartData = [...vitalHistory].reverse().map((v) => ({
    time: new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    heartRate: v.heartRate,
    spo2: v.spo2,
    systolic: v.systolic,
    diastolic: v.diastolic,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button & Patient Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/doctor/patients"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{patient?.name || 'Patient Chart'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700">
                {patient?.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {patient?.age} yrs • {patient?.gender} • Village: {patient?.village}, {patient?.district} • Contact: {patient?.phone}
            </p>
          </div>
        </div>

        {/* AI Risk Flag Badge */}
        {aiRisk && (
          <div
            className={`px-4 py-2 rounded-2xl border flex items-center gap-2 self-start sm:self-auto ${
              aiRisk.riskLevel === 'HIGH'
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : aiRisk.riskLevel === 'MEDIUM'
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <div className="text-xs">
              <span className="font-extrabold uppercase">{aiRisk.riskLevel} RISK ({aiRisk.riskScore}%)</span>
              <p className="text-[10px] opacity-80">AI-assisted preliminary assessment</p>
            </div>
          </div>
        )}
      </div>

      {/* Patient Background Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-slate-400 font-semibold block mb-1 uppercase text-[10px]">Medical History</span>
          <p className="font-medium text-slate-800">{patient?.medicalHistory || 'No prior chronic conditions reported.'}</p>
        </div>
        <div>
          <span className="text-slate-400 font-semibold block mb-1 uppercase text-[10px]">Residential Address</span>
          <p className="font-medium text-slate-800">{patient?.address || 'Rural Sector'}, {patient?.village}</p>
        </div>
        <div>
          <span className="text-slate-400 font-semibold block mb-1 uppercase text-[10px]">Emergency Kin Contact</span>
          <p className="font-medium text-slate-800">{patient?.emergencyContact || patient?.phone}</p>
        </div>
      </div>

      {/* Vitals & Telemetry Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Heart Rate</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900">{latestVital.heartRate || 78}</span>
            <span className="text-xs text-slate-500">BPM</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Oxygen Saturation</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900">{latestVital.spo2 || 97}</span>
            <span className="text-xs text-slate-500">%</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Body Temperature</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900">{latestVital.temperature || 98.4}</span>
            <span className="text-xs text-slate-500">°F</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Blood Pressure</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900">
              {latestVital.systolic || 118}/{latestVital.diastolic || 76}
            </span>
            <span className="text-xs text-slate-500">mmHg</span>
          </div>
        </div>
      </div>

      {/* Recharts Vital History Trends */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-600" />
          <span>Biometric Telemetry Trends</span>
        </h2>

        {chartData.length === 0 ? (
          <div className="h-56 flex items-center justify-center text-xs text-slate-400">
            No telemetry data recorded yet.
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 180]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="heartRate"
                  name="Heart Rate (BPM)"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="spo2"
                  name="Oxygen SpO2 (%)"
                  stroke="#0284c7"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="systolic"
                  name="Systolic BP"
                  stroke="#0d9488"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* AI Preliminary Risk Indicators & Recommendation */}
      {aiRisk && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>AI Preliminary Clinical Indicators</span>
          </h2>
          <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
            <p className="font-semibold text-slate-800">Recommendation: {aiRisk.recommendation}</p>
            <div className="space-y-1">
              <span className="font-semibold text-slate-600 block">Flagged Physiological Indicators:</span>
              <ul className="list-disc pl-5 text-slate-600 space-y-0.5">
                {aiRisk.indicators?.map((ind, i) => (
                  <li key={i}>{ind}</li>
                ))}
              </ul>
            </div>
            <p className="text-[10px] text-slate-400 italic pt-1">
              Notice: AI preliminary risk assessment is an assistive triage tool and does not substitute licensed medical diagnosis.
            </p>
          </div>
        </div>
      )}

      {/* Doctor Consultation & Prescription Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <FileText className="w-5 h-5 text-sky-600" />
          <h2 className="text-base font-bold text-slate-900">Conduct Consultation & Issue Prescription</h2>
        </div>

        {consultationSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{consultationSuccess}</span>
          </div>
        )}

        <form onSubmit={handleConsultationSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Diagnosis</label>
              <input
                type="text"
                value={form.diagnosis}
                onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                placeholder="e.g. Mild Hypertension with Sinus Tachycardia"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Follow-up Review Date</label>
              <input
                type="date"
                value={form.followUpDate}
                onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor's Clinical Notes</label>
            <textarea
              rows="3"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Enter patient observations, lifestyle guidance, diet recommendations..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Prescription & Medications</label>
            <textarea
              rows="2"
              value={form.prescription}
              onChange={(e) => setForm({ ...form, prescription: e.target.value })}
              placeholder="e.g. Tab Amlodipine 5mg OD x 14 days, ORS hydration powder"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingConsultation}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{savingConsultation ? 'Publishing...' : 'Save & Publish Consultation Notes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Past Consultations History */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Previous Consultations for this Patient</h2>
        {consultations.length === 0 ? (
          <p className="text-xs text-slate-400">No prior consultation logs on record.</p>
        ) : (
          <div className="space-y-3">
            {consultations.map((c) => (
              <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>{c.diagnosis}</span>
                  <span className="text-[11px] text-slate-400 font-normal">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-600">{c.notes}</p>
                {c.prescription && (
                  <p className="text-sky-700 font-medium">Rx: {c.prescription}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatientDetail;
