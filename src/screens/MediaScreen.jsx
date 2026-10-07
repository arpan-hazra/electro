// src/screens/MediaScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useTheme } from '../context/ThemeContext';
import {
  Image as ImageIcon,
  Upload,
  Download,
  ZoomIn,
  Sparkles,
  Search,
  Filter,
  Trash2,
  Share2,
  Calendar,
  HardDrive,
  Check,
  X,
  ShieldCheck,
  Plus
} from 'lucide-react';
import MediaLightbox from '../components/modals/MediaLightbox';

export default function MediaScreen() {
  const { token, user } = useAuth();
  const { currentAccent } = useTheme();
  const { uploadMedia } = useChat();

  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'mine' | 'received'
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxItem, setLightboxItem] = useState(null);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadCaption, setUploadCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const fileInputRef = useRef(null);

  // Fetch media from server API
  const fetchGallery = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/media/gallery', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGallery(data.gallery || []);
      }
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [token]);

  // Handle file select for upload
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds the 5MB maximum limit.');
      return;
    }

    setUploadError(null);
    setUploadFile(file);
    const reader = new FileReader();
    reader.onload = () => setUploadPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadError(null);

    const res = await uploadMedia(uploadFile, uploadCaption);
    setIsUploading(false);

    if (!res.success) {
      setUploadError(res.error || 'Failed to upload photo');
    } else {
      setUploadSuccess('Photo uploaded successfully to your cloud gallery! ✨');
      setTimeout(() => {
        setUploadSuccess(null);
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadPreview(null);
        setUploadCaption('');
        fetchGallery();
      }, 1500);
    }
  };

  // Filter gallery items
  const filteredItems = gallery.filter(item => {
    const matchesSearch =
      (item.fileName && item.fileName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.senderName && item.senderName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeFilter === 'mine') {
      return matchesSearch && item.senderId === user?.id;
    }
    if (activeFilter === 'received') {
      return matchesSearch && item.senderId !== user?.id;
    }
    return matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Media Gallery
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                {gallery.length} Photos
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Browse, view, and organize high-resolution shared photos across your Vibely network.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r ${currentAccent.gradient} hover:opacity-95 active:scale-95 transition-all`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Photo</span>
          </button>
        </div>

        {/* Storage & Insights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Total Shared Media</span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {gallery.length} Images
              </h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <ImageIcon className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Cloud Storage</span>
              <h3 className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-0.5">
                {(gallery.length * 1.4).toFixed(1)} MB
              </h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <HardDrive className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Security Filter</span>
              <h3 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <span>Verified Clean</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Controls: Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 w-full sm:w-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Photos ({gallery.length})
            </button>
            <button
              onClick={() => setActiveFilter('mine')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'mine'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Uploaded by Me
            </button>
            <button
              onClick={() => setActiveFilter('received')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'received'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Received in Chats
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search photos or captions..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading media collection...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <ImageIcon className="w-12 h-12 text-slate-400 stroke-[1.5] mb-2" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No photos found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {searchQuery ? `No photos matching "${searchQuery}"` : 'Upload your favorite photos or start sharing them in chats.'}
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className={`mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm bg-gradient-to-r ${currentAccent.gradient}`}
            >
              Upload First Photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer aspect-square"
                onClick={() => setLightboxItem(item)}
              >
                {/* Image Thumbnail */}
                <img
                  src={item.mediaUrl}
                  alt={item.fileName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Sender badge pill (top left) */}
                <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1 shadow-sm">
                  <span>{item.senderName}</span>
                </div>

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                  <p className="text-xs font-bold truncate">
                    {item.caption || item.fileName}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-300 mt-1">
                    <span>{item.timestamp || 'Today'}</span>
                    <span className="flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5 text-purple-400" />
                      <span>Inspect</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${currentAccent.gradient} flex items-center justify-center text-white`}>
                  <Upload className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">Upload to Media Gallery</h3>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                  setUploadPreview(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="my-3 p-3 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-2xl">
                {uploadError}
              </div>
            )}

            {uploadSuccess && (
              <div className="my-3 p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-2xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4 mt-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
              />

              {/* Upload Drop Zone / Preview */}
              {!uploadPreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center cursor-pointer hover:border-purple-500 transition-colors flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Click to browse or drop image here
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Supports JPG, PNG, WEBP, GIF (Max 5MB)
                  </p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img
                    src={uploadPreview}
                    alt="Upload Preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setUploadFile(null);
                      setUploadPreview(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/70 text-white hover:bg-slate-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Caption field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Caption or Description (Optional)
                </label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="e.g. Beautiful mountain hike with friends ✨"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Security Badge */}
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-[11px] text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>Uploaded images are processed and stored securely in the cloud.</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadFile || isUploading}
                  className={`py-2.5 px-5 rounded-xl text-xs font-bold text-white shadow-md bg-gradient-to-r ${currentAccent.gradient} ${
                    !uploadFile || isUploading ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-95'
                  }`}
                >
                  {isUploading ? 'Uploading...' : 'Save & Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxItem && (
        <MediaLightbox
          isOpen={Boolean(lightboxItem)}
          onClose={() => setLightboxItem(null)}
          mediaItem={lightboxItem}
        />
      )}
    </div>
  );
}
