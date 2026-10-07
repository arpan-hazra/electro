// src/components/ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle, RefreshCw, Cpu } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mb-6 text-cyan-400">
            <Cpu className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            QuartzLab 3D Experience
          </h1>
          <p className="text-slate-400 max-w-md mb-6 text-sm">
            A component encountered an issue during startup. Don't worry, your work and saved notes are safe.
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 max-w-lg w-full text-left font-mono text-xs text-rose-400 mb-6 overflow-auto max-h-32">
            {this.state.error?.toString()}
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Website
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
