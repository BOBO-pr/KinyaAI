import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Bot,
  User,
} from 'lucide-react';
import { chatAPI } from '../services/api';

export const VoicePage: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'rw' | 'en'>('rw');

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    initRecognition();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis?.cancel();
    };
  }, [language]);

  const initRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'rw' ? 'rw-RW' : 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setResponse('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAskAI = async () => {
    if (!transcript.trim() || loading) return;
    setLoading(true);

    try {
      const res = await chatAPI.sendMessage({
        message: transcript,
        language,
      });

      if (res.success) {
        setResponse(res.reply.content);
        speakResponse(res.reply.content);
      }
    } catch (err: any) {
      console.error(err);
      setResponse('Mumbabarire, habaye akabazo mu gutunganya ubutumwa.');
    } finally {
      setLoading(false);
    }
  };

  const speakResponse = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'rw' ? 'sw-TZ' : 'en-US';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-300">
          <Mic className="w-3.5 h-3.5" />
          <span>Ijwi & Voice Assistant Studio</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Ganira na KinyaAI Ukoresheje Ijwi
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Kanda kuri microphone, vuga ikibazo cyawe mu Kinyarwanda cyangwa Icyongereza, wumve igisubizo gisomwe mu majwi.
        </p>
      </div>

      {/* Main Interactive Mic Card */}
      <div className="rounded-3xl glass-panel p-8 sm:p-12 text-center space-y-8 flex flex-col items-center">
        {/* Language selector */}
        <div className="flex items-center space-x-2 bg-[#0c1610] p-1 rounded-xl border border-emerald-950">
          <button
            onClick={() => setLanguage('rw')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              language === 'rw'
                ? 'bg-emerald-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇷🇼 Ikinyarwanda
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              language === 'en'
                ? 'bg-emerald-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇬🇧 English
          </button>
        </div>

        {/* Big Animated Mic Pulse Button */}
        <div className="relative flex items-center justify-center my-4">
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />
          )}

          <button
            onClick={toggleRecording}
            className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all shadow-2xl ${
              isListening
                ? 'bg-rose-600 text-white shadow-rose-600/40 scale-105'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 hover:scale-105'
            }`}
          >
            {isListening ? (
              <MicOff className="w-12 h-12 animate-pulse" />
            ) : (
              <Mic className="w-12 h-12" />
            )}
          </button>
        </div>

        <div className="text-xs text-slate-400">
          {isListening
            ? '🎙️ KinyaAI irimo kukumva... vuga ikibazo cyawe!'
            : 'Kanda kuri microphone utangire kuvuga'}
        </div>

        {/* Real-time Waveform Bars simulation */}
        {isListening && (
          <div className="flex items-center justify-center space-x-1.5 h-10 py-2">
            {[40, 75, 100, 60, 90, 45, 80, 55, 95, 30].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-emerald-400 rounded-full animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDuration: `${0.4 + (i % 3) * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Live Transcript Box */}
        {transcript && (
          <div className="w-full max-w-xl p-4 rounded-2xl bg-[#0c1610] border border-emerald-900/60 text-left space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
                <User className="w-3.5 h-3.5" /> Icyo uvuze:
              </span>
              <button
                onClick={() => setTranscript('')}
                className="hover:text-rose-400 transition-colors"
              >
                Siba
              </button>
            </div>
            <div className="text-sm text-slate-100 font-medium">"{transcript}"</div>

            <button
              onClick={handleAskAI}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              <span>{loading ? 'KinyaAI irimo gusubiza...' : 'Baza KinyaAI Iki Kibazo'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* AI Voice Answer Box */}
        {response && (
          <div className="w-full max-w-xl p-5 rounded-2xl bg-[#0e1d13] border border-emerald-500/40 text-left space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-emerald-300">
                <Bot className="w-4 h-4" /> Igisubizo cya KinyaAI:
              </span>
              <button
                onClick={isSpeaking ? stopSpeaking : () => speakResponse(response)}
                className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Hagarika Ijwi</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Ongera Wumve</span>
                  </>
                )}
              </button>
            </div>
            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {response}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
