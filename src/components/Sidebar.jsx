import React from 'react';
import { Plus, File as FileIcon, Trash2 } from 'lucide-react';

function Sidebar({ pages, currentId, onSelect, onAdd, onDelete }) {
  return (
    <div className="h-full w-56 border-r bg-gray-900 text-gray-100 flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
        <span className="text-sm font-medium">Explorer</span>
        <button onClick={onAdd} className="p-1 rounded hover:bg-gray-800" title="New Page">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {pages.length === 0 && (
          <div className="p-3 text-xs text-gray-400">No pages yet. Click + to add one.</div>
        )}
        {pages.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`group flex items-center justify-between px-3 py-2 cursor-pointer text-sm border-b border-gray-800 ${
              currentId === p.id ? 'bg-gray-800' : 'hover:bg-gray-850'
            }`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <FileIcon className="w-4 h-4 text-gray-400" />
              <span className="truncate">{p.name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(p.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-700"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
