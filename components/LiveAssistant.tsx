
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Mic, MicOff, Volume2, X, Sparkles, Loader2, Zap } from 'lucide-react';

// Implementation of required audio encoding/decoding utilities
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    setIsActive(false);
    setIsConnecting(false);
  };

  const startSession = async () => {
    setIsConnecting(true);
    try {
      // Fix: Always use direct process.env.API_KEY when initializing client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              // CRITICAL: initiate sendRealtimeInput after live.connect call resolves
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
            setIsConnecting(false);
            setIsActive(true);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              setTranscription(prev => prev + message.serverContent!.inputTranscription!.text);
            }
            if (message.serverContent?.outputTranscription) {
              setAiResponse(prev => prev + message.serverContent!.outputTranscription!.text);
            }
            if (message.serverContent?.turnComplete) {
              setTranscription('');
              setAiResponse('');
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
              const source = outputAudioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContextRef.current.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
          systemInstruction: 'You are Nexus Live, the high-fidelity voice agent for a sophisticated ERP system. You have deep knowledge of the system architecture, including its Prisma ORM backlink, PostgreSQL persistence, and JWT-secured routes. Help the operator monitor branch performance, audit the general ledger, and understand complex data relationships. Be articulate, efficient, and authoritative.',
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Live AI Error:", err);
      stopSession();
    }
  };

  return (
    <div className="fixed bottom-12 left-12 z-[60]">
      {isActive && (
        <div className="absolute bottom-28 left-0 w-[400px] bg-white rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(106,90,224,0.3)] animate-in slide-in-from-bottom-12 duration-500 border border-slate-100">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-brand rounded-full animate-ping"></div>
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.4em]">Aura Link Active</span>
            </div>
            <button onClick={stopSession} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-[1.2rem] transition-all">
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col items-center py-10 relative">
            <div className="w-40 h-40 rounded-[3rem] bg-brand/5 flex items-center justify-center relative group">
               <div className="absolute inset-0 bg-brand/10 rounded-[3rem] animate-ping [animation-duration:4s]"></div>
               <div className="absolute inset-8 bg-brand/20 rounded-[2.5rem] animate-pulse"></div>
               <Zap size={48} className="text-brand group-hover:scale-125 transition-transform duration-700 fill-brand" />
            </div>
            <div className="mt-12 text-center">
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] mb-2">Neural Interface</p>
              <p className="text-slate-900 font-extrabold text-2xl tracking-tight">System Ready</p>
            </div>
          </div>

          <div className="mt-12 space-y-8">
            {transcription && (
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
                <p className="text-[10px] text-brand font-black uppercase mb-3 tracking-[0.2em]">Live Transcript</p>
                <p className="text-base text-slate-700 leading-relaxed font-bold italic">"{transcription}"</p>
              </div>
            )}
            <div className="flex items-center gap-3 justify-center h-10">
              {[1, 2, 3, 4, 5, 6, 7].map(i => (
                <div key={i} className={`w-1.5 rounded-full bg-brand/30 animate-pulse [animation-delay:${i*0.15}s] ${i % 2 === 0 ? 'h-10' : 'h-6'}`}></div>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={isActive ? stopSession : startSession}
        disabled={isConnecting}
        className={`w-24 h-24 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(106,90,224,0.4)] flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 group ${
          isActive ? 'bg-rose-500 text-white rotate-90 shadow-rose-500/30' : 'bg-brand text-white'
        } ${isConnecting ? 'opacity-70 cursor-wait' : ''}`}
      >
        {isConnecting ? (
          <Loader2 size={36} className="animate-spin" />
        ) : isActive ? (
          <MicOff size={36} />
        ) : (
          <div className="relative">
            <Mic size={36} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-brand"></div>
          </div>
        )}
      </button>
    </div>
  );
};

export default LiveAssistant;
