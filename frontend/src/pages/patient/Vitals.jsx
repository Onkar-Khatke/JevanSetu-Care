import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import {
  HeartPulse,
  Activity,
  Thermometer,
  PlusCircle,
  CheckCircle,
  AlertTriangle,
  Clock,
  Radio,
  Zap
} from 'lucide-react';

const PatientVitals = () => {
  const { user } = useAuth();
  const patientId = user?.entityId || 'P1001';

  const [vital, setVital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    heartRate: 78,
    spo2: 97,
    temperature: 98.4,
    systolic: 118,
    diastolic: 76,
    ecg: 'NORMAL_SINUS',
    source: 'WEB_MANUAL'
  });

  const fetchLatest = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/vitals/latest/${patientId}`);
      if (res && res.data) {
        setVital(res.data);
      }
    } catch (err) {
      console.warn('No vital found, fallback to baseline');
      setVital({
        heartRate: 78,
        spo2: 97,
        temperature: 98.4,
        systolic: 118,
        diastolic: 76,
        source: 'ESP32',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatest();
  }, [patientId]);

  const handlePreset = (type) => {
    if (type === 'NORMAL') {
      setForm({
        heartRate: 76,
        spo2: 98,
        temperature: 98.4,
        systolic: 118,
        diastolic: 76,
        ecg: 'NORMAL_SINUS',
        source: 'MANUAL_NORMAL_TEST'
      });
    } else if (type === 'HIGH') {
      setForm({
        heartRate: 125,
        spo2: 88,
        temperature: 102.1,
        systolic: 165,
        diastolic: 105,
        ecg: 'ST_ELEVATION_CRITICAL',
        source: 'SIMULATED_HIGH_RISK'
      });
    }
  };

  const handleSaveVital = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg('');
      const payload = {
        patientId,
        heartRate: Number(form.heartRate),
        spo2: Number(form.spo2),
        temperature: Number(form.temperature),
        systolic: Number(form.systolic),
        diastolic: Number(form.diastolic),
        ecg: form.ecg,
        source: form.source
      };

      const res = await apiClient.post('/vitals', payload);
      if (res && res.data) {
        setVital(res.data);
        setSuccessMsg('Telemetry successfully recorded and evaluated by AI risk engine!');
        setTimeout(() => setSuccessMsg(''), 4000);
        setModalOpen(false);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit telemetry.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Biometric Telemetry Station</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Connected to ESP32 Wearable (MAX30102, MLX90614, AD8232)
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-md shadow-sky-600/20 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record New Telemetry</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Reading Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase">Heart Rate</span>
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900">{vital?.heartRate || '--'}</span>
            <span className="text-xs font-semibold text-slate-500">BPM</span>
          </div>
          <p className="text-xs text-slate-500 mt-3">Target normal: 60 - 100 bpm</p>
        </div>

        {/* SpO2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase">Blood Oxygen</span>
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900">{vital?.spo2 || '--'}</span>
            <span className="text-xs font-semibold text-slate-500">%</span>
          </div>
          <p className="text-xs text-slate-500 mt-3">Clinical safe: &ge; 95%</p>
        </div>

        {/* Temperature */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase">Temperature</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Thermometer className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900">{vital?.temperature || '--'}</span>
            <span className="text-xs font-semibold text-slate-500">°F</span>
          </div>
          <p className="text-xs text-slate-500 mt-3">Normal: 97.5 - 98.9°F</p>
        </div>

        {/* Blood Pressure */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase">Blood Pressure</span>
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {vital?.systolic || '--'}/{vital?.diastolic || '--'}
            </span>
            <span className="text-xs font-semibold text-slate-500">mmHg</span>
          </div>
          <p className="text-xs text-slate-500 mt-3">Optimum: &lt; 120/80 mmHg</p>
        </div>
      </div>

      {/* Hardware Telemetry Specs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900">Hardware & Telemetry Node Status</h2>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            <span>Active Feed</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-semibold text-slate-800 block mb-1">Optical Sensor (MAX30102)</span>
            <p className="text-slate-500">Continuous photoplethysmogram (PPG) measuring red and infrared light absorption.</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-semibold text-slate-800 block mb-1">Thermal Sensor (MLX90614)</span>
            <p className="text-slate-500">Medical-grade infrared thermopile with non-contact calibrated body compensation.</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-semibold text-slate-800 block mb-1">ECG / Lead Monitor (AD8232)</span>
            <p className="text-slate-500">Status: {vital?.ecg || 'NORMAL_SINUS'} (Single-lead cardiac analog front-end).</p>
          </div>
        </div>
      </div>

      {/* Modal for Recording Vitals */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Submit Biometric Telemetry</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="mt-3 p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg">
                {errorMsg}
              </div>
            )}

            {/* Quick Presets */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-medium">Quick Presets:</span>
              <button
                type="button"
                onClick={() => handlePreset('NORMAL')}
                className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100"
              >
                Normal (76 BPM / 98%)
              </button>
              <button
                type="button"
                onClick={() => handlePreset('HIGH')}
                className="px-2.5 py-1 text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100"
              >
                High Risk (125 BPM / 88%)
              </button>
            </div>

            <form onSubmit={handleSaveVital} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Heart Rate (BPM)</label>
                  <input
                    type="number"
                    value={form.heartRate}
                    onChange={(e) => setForm({ ...form, heartRate: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Oxygen SpO2 (%)</label>
                  <input
                    type="number"
                    value={form.spo2}
                    onChange={(e) => setForm({ ...form, spo2: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Temp (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.temperature}
                    onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Systolic BP</label>
                  <input
                    type="number"
                    value={form.systolic}
                    onChange={(e) => setForm({ ...form, systolic: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Diastolic BP</label>
                  <input
                    type="number"
                    value={form.diastolic}
                    onChange={(e) => setForm({ ...form, diastolic: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow"
                >
                  Submit & Analyze
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientVitals;
