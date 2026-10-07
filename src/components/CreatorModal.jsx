// src/components/CreatorModal.jsx
import React, { useState } from 'react';
import { X, Award, Cpu, Sparkles, Send, CheckCircle2, ShieldCheck, Heart, Wrench, Globe, Terminal, Code } from 'lucide-react';

export default function CreatorModal({ isOpen, onClose }) {
  const [msgSent, setMsgSent] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    setMsgSent(true);
    setTimeout(() => {
      setMsgSent(false);
      setName('');
      setMessage('');
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-cyan-500/15 flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-1 pr-1">
          {/* Main 2-Column Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Full Portrait Picture Inside Arpan Creator (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group w-full max-w-xs sm:max-w-sm">
                {/* Neon Cyan Ambient Glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-600 rounded-3xl blur-md opacity-80 group-hover:opacity-100 transition duration-500" />

                {/* Picture Container */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-400/90 bg-slate-950 shadow-2xl">
                  <img
                    src="/arpan.png"
                    alt="Mr. Arpan — Creator & Engineer"
                    className="w-full h-auto object-cover object-top block"
                  />

                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 px-2.5 py-1 rounded-full text-[11px] font-mono text-cyan-300 font-bold flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>Mr. Arpan</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-white font-bold block">Lead Architect</span>
                      <span className="text-[10px] text-cyan-400 font-mono">Quartz Arpan Studio</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                      CREATOR
                    </span>
                  </div>
                </div>
              </div>

              {/* Tagline under picture */}
              <div className="mt-4 text-center">
                <span className="text-xs font-mono text-cyan-400 font-semibold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 inline-block">
                  Code • Build • Improve • Better Than Yesterday
                </span>
              </div>
            </div>

            {/* Right Column: Narrative, Engineering Skills & Message Form (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Profile Title */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    Verified Creator
                  </span>
                  <span className="text-xs text-slate-400">Quartz Arpan Innovations</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Mr. Arpan
                </h3>
                <p className="text-xs text-cyan-400 font-mono mt-0.5">
                  Lead Electronics Engineer & 3D Interactive Web Developer
                </p>
              </div>

              {/* Bio Story */}
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                <p>
                  Welcome to my studio! I created <strong className="text-white">QuartzLab 3D</strong> to make electronic project design and robotics visualization tangible, interactive, and easy to learn.
                </p>
                <p className="text-slate-400 text-xs">
                  Every electronic item—from <span className="text-cyan-300 font-mono">16.000 MHz quartz crystal oscillators</span> to 4WD obstacle rovers and 4-axis bionic robotic arms—is built with realistic 3D geometries, tested schematics, and production-ready code.
                </p>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <Cpu className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-white block">Microcontrollers</span>
                  <span className="text-[10px] text-slate-400">Arduino / ESP32</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <Wrench className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-white block">Robotics CAD</span>
                  <span className="text-[10px] text-slate-400">Rovers & Arms</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <Sparkles className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-white block">3D WebGL</span>
                  <span className="text-[10px] text-slate-400">Three.js Engine</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-white block">Circuit Testing</span>
                  <span className="text-[10px] text-slate-400">Quartz Timing</span>
                </div>
              </div>

              {/* Interactive Message Form */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-3 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-cyan-400" />
                  Send a Direct Message to Arpan
                </h4>

                {msgSent ? (
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Message transmitted successfully! Arpan will receive it.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="space-y-2.5">
                    <input
                      type="text"
                      required
                      placeholder="Your Name / Email"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <textarea
                      required
                      rows={2}
                      placeholder="Message for Arpan (electronics project ideas, robotics collaboration...)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Transmit to Arpan
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
