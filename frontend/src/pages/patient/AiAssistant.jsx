import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import {
  MessageSquare,
  Send,
  AlertTriangle,
  Languages,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  Info
} from 'lucide-react';

const AiAssistant = () => {
  const { user } = useAuth();
  const patientId = user?.entityId || 'P1001';

  const [language, setLanguage] = useState('en'); // "en", "hi", "mr"
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! I am JeevanSetu AI Assistant. Please describe what symptoms or discomfort you or your family member are feeling.',
      lang: 'en'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const sampleSymptoms = {
    en: ['Chest discomfort and shortness of breath', 'High fever with body ache', 'Dizziness and mild headache'],
    hi: ['छाती में भारीपन और सांस लेने में कठिनाई', 'तेज बुखार और बदन दर्द', 'चक्कर आना और कमजोरी'],
    mr: ['छातीत कळ येणे आणि श्वास घेण्यास त्रास', 'खूप ताप आणि अंगदुखी', 'चक्कर येणे आणि अशक्तपणा'],
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    let greeting = 'Namaste! I am JeevanSetu AI Assistant. Please describe your symptoms.';
    if (newLang === 'hi') {
      greeting = 'नमस्ते! मैं जीवनसेतु एआई सहायक हूँ। कृपया बताएं कि आप क्या लक्षण या परेशानी महसूस कर रहे हैं?';
    } else if (newLang === 'mr') {
      greeting = 'नमस्कार! मी जीवनसेतू एआय सहाय्यक आहे. कृपया आपल्याला काय त्रास किंवा लक्षणे जाणवत आहेत ते सांगा.';
    }
    setMessages((prev) => [...prev, { sender: 'bot', text: greeting, lang: newLang }]);
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Call backend AI triage endpoint
      const res = await apiClient.post('/ai/chat', {
        patientId,
        message: text,
        language,
        consentGiven: true
      });

      const data = res.data;
      const isHigh = data.riskLevel === 'HIGH' || data.emergencyWarning;

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: data.response,
          indicators: data.warningIndicators,
          riskLevel: data.riskLevel,
          emergencyNeeded: isHigh,
          followUps: data.followUpQuestions,
          recommendations: data.recommendations,
          provider: data.provider,
          disclaimer: data.disclaimer,
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text:
            language === 'hi'
              ? 'एआई सेवा से जुड़ने में समस्या हुई। यदि आपातकाल है, तो तुरंत SOS बटन दबाएं।'
              : language === 'mr'
              ? 'एआय सेवेशी संपर्क करण्यात अडचण आली. तातडीची परिस्थिती असल्यास त्वरित Emergency SOS बटण दाबा.'
              : 'Unable to reach health assistant service. If this is an emergency, tap the Emergency SOS button immediately.',
          emergencyNeeded: true,
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      {/* Top Banner with Language Selector */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white shadow-md shadow-sky-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">JeevanSetu Multilingual AI Health Assistant</h1>
            <p className="text-[11px] text-slate-500">Preliminary triage guidance for rural community health</p>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <Languages className="w-4 h-4 text-slate-500 ml-1 mr-0.5" />
          {[
            { id: 'en', label: 'English' },
            { id: 'hi', label: 'हिंदी (Hindi)' },
            { id: 'mr', label: 'मराठी (Marathi)' },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => handleLanguageChange(l.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                language === l.id ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-3 bg-amber-50/80 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span className="leading-relaxed font-medium">
          "AI assistance is for preliminary guidance and does not replace professional medical advice."
        </span>
      </div>

      {/* Chat Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[480px]">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-md rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-xs'
                    : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {m.indicators && m.indicators.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200">
                    <span className="font-semibold text-[11px] block mb-1 text-slate-800">Observed Indicators:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
                      {m.indicators.map((ind, i) => (
                        <li key={i}>{ind}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {m.recommendations && m.recommendations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200">
                    <span className="font-semibold text-[11px] block mb-1 text-slate-800">Preliminary Guidance:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
                      {m.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {m.followUps && m.followUps.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200">
                    <span className="font-semibold text-[11px] block mb-1 text-slate-800">Helpful Follow-Up Inquiries:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
                      {m.followUps.map((fq, i) => (
                        <li key={i}>{fq}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {m.provider && (
                  <div className="mt-2 text-[10px] text-slate-400 italic">
                    Engine: {m.provider}
                  </div>
                )}

                {m.emergencyNeeded && (
                  <div className="mt-3 pt-2.5 border-t border-rose-200">
                    <p className="font-bold text-rose-600 text-[11px] mb-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Critical Symptoms Detected
                    </p>
                    <Link
                      to="/patient/emergency"
                      className="inline-block px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px] shadow-sm animate-pulse"
                    >
                      Trigger Emergency SOS Now
                    </Link>
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]" />
              <span>Analyzing symptoms and biometrics...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-1.5">
          <span className="text-[11px] text-slate-400 font-medium self-center mr-1">Examples:</span>
          {sampleSymptoms[language]?.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              className="px-2.5 py-1 text-[11px] bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-sky-50 hover:border-sky-300 transition-all truncate max-w-xs"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white rounded-b-2xl"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'अपने लक्षण यहाँ लिखें...'
                : language === 'mr'
                ? 'आपली लक्षणे येथे लिहा...'
                : 'Describe symptoms here (e.g. chest discomfort, high fever)...'
            }
            className="flex-1 px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiAssistant;
