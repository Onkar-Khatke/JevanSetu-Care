import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
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
import { FileText, RefreshCw, Activity, HeartPulse } from 'lucide-react';

const PatientHistory = () => {
  const { user } = useAuth();
  const patientId = user?.entityId || 'P1001';

  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/vitals/patient/${patientId}`);
      if (res && res.data) {
        setVitals(res.data);
      }
    } catch (err) {
      console.warn('Error fetching vitals history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [patientId]);

  // Format data for Recharts (reversed so chronological left-to-right)
  const chartData = [...vitals].reverse().map((v) => ({
    time: new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    heartRate: v.heartRate,
    spo2: v.spo2,
    systolic: v.systolic,
    diastolic: v.diastolic,
    temperature: v.temperature,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Biometric History & Telemetry Logs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous recording feed from ESP32 wearable sensor array
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Recharts Vital History Trends */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-600" />
          <span>Telemetry Trends (Heart Rate, SpO2 & Blood Pressure)</span>
        </h2>

        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-xs text-slate-400">
            No telemetry recorded yet.
          </div>
        ) : (
          <div className="h-72 w-full">
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
                  activeDot={{ r: 6 }}
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
                  name="Systolic BP (mmHg)"
                  stroke="#0d9488"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Historical Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Recorded Telemetry Logs</h2>
          <span className="text-xs text-slate-500">{vitals.length} total readings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Heart Rate</th>
                <th className="px-6 py-3">SpO2</th>
                <th className="px-6 py-3">Temperature</th>
                <th className="px-6 py-3">Blood Pressure</th>
                <th className="px-6 py-3">ECG / Lead</th>
                <th className="px-6 py-3">Telemetry Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {vitals.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                    No vitals logs available yet.
                  </td>
                </tr>
              ) : (
                vitals.map((v) => (
                  <tr key={v.id || v.timestamp} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-900">
                      {new Date(v.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`font-semibold ${v.heartRate > 100 || v.heartRate < 55 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {v.heartRate} BPM
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`font-semibold ${v.spo2 < 92 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {v.spo2}%
                      </span>
                    </td>
                    <td className="px-6 py-3.5">{v.temperature ? `${v.temperature}°F` : '--'}</td>
                    <td className="px-6 py-3.5">
                      <span className="font-semibold">{v.systolic}/{v.diastolic} mmHg</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                        {v.ecg || 'NORMAL_SINUS'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 font-mono text-[11px]">{v.source || 'ESP32'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;
