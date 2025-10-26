import React, { useRef } from 'react';
import { Menu, Upload, Play, Eye, Share2 } from 'lucide-react';

function TopBar({ onTogglePreview, isPreviewOn, onPublish, onCBSMode, onUploadProject }) {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUploadProject(Array.from(files));
      e.target.value = '';
    }
  };

  return (
    <div className="w-full border-b bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 text-gray-100">
      <div className="flex items-center justify-between px-4 h-12">
        <div className="flex items-center gap-3">
          <Menu className="w-5 h-5 text-gray-300" />
          <div className="font-semibold tracking-wide">Vibe Code Studio</div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-300">
            <div className="relative group cursor-default">
              <span className="font-medium">File</span>
              <div className="absolute left-0 mt-2 hidden group-hover:block z-20 min-w-[220px] rounded-md border border-gray-700 bg-gray-800 p-2 shadow-xl">
                <button onClick={onTogglePreview} className="w-full text-left px-3 py-2 rounded hover:bg-gray-700/70 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> {isPreviewOn ? 'Hide Preview' : 'Show Preview'}
                </button>
                <button onClick={onPublish} className="w-full text-left px-3 py-2 rounded hover:bg-gray-700/70 flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> Publish…
                </button>
                <button onClick={handleUploadClick} className="w-full text-left px-3 py-2 rounded hover:bg-gray-700/70 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Upload Project…
                </button>
              </div>
            </div>
            <span className="opacity-60">Edit</span>
            <span className="opacity-60">View</span>
            <span className="opacity-60">Run</span>
            <span className="opacity-60">Help</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCBSMode} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium">
            <Play className="w-4 h-4" /> CBS Mode
          </button>
          <button onClick={onTogglePreview} className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-sm">
            <Eye className="w-4 h-4" /> {isPreviewOn ? 'Preview On' : 'Preview Off'}
          </button>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        webkitdirectory="true"
        directory="true"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default TopBar;
