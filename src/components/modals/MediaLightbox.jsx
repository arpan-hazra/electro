// src/components/modals/MediaLightbox.jsx
import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, Download, ShieldAlert, Share2 } from 'lucide-react';
import ReportModal from './ReportModal';

export default function MediaLightbox({ isOpen, onClose, mediaItem }) {
  const [zoom, setZoom] = useState(1);
  const [showReport, setShowReport] = useState(false);

  if (!isOpen || !mediaItem) return null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = mediaItem.url || mediaItem.mediaUrl;
    link.download = mediaItem.name || mediaItem.fileName || 'vibely_image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const imgUrl = mediaItem.url || mediaItem.mediaUrl;
  const fileName = mediaItem.name || mediaItem.fileName || 'image.jpg';
  const sender = mediaItem.senderName || 'Sender';
  const size = mediaItem.size || '1.2 MB';

  return (
    <>
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between p-4 bg-slate-900/60 border-b border-slate-800 text-white z-10">
          <div className="flex items-center gap-3">
            <div>
              <h4 className="text-sm font-semibold truncate max-w-xs">{fileName}</h4>
              <p className="text-xs text-slate-400">
                Shared by {sender} • {size}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Download image"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowReport(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-semibold transition-colors"
              title="Report inappropriate image"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Report Image</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors ml-2"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Preview Canvas */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden cursor-grab">
          <img
            src={imgUrl}
            alt={fileName}
            style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease-out' }}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />
        </div>

        {/* Footer info caption */}
        {mediaItem.caption && (
          <div className="p-3 text-center text-sm text-slate-300 bg-slate-900/50 border-t border-slate-800">
            {mediaItem.caption}
          </div>
        )}
      </div>

      {showReport && (
        <ReportModal
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          targetType="image"
          targetId={mediaItem.id || 'img_report'}
          targetName={fileName}
          defaultCategory="inappropriate_media"
        />
      )}
    </>
  );
}
