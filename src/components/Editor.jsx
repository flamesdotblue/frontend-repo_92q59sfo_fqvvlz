import React, { useEffect, useRef } from 'react';

function Editor({ value, onChange, isTypingPlayback, typingCursorIndex }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current && isTypingPlayback) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [value, isTypingPlayback]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="px-3 py-2 border-b bg-gray-900 text-gray-300 text-xs flex items-center justify-between">
        <span>editor.html</span>
        <span className="opacity-60">UTF-8 | LF | HTML</span>
      </div>
      <textarea
        ref={textareaRef}
        className="flex-1 w-full bg-[#0b0f17] text-gray-100 p-4 font-mono text-sm outline-none resize-none leading-6"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
      {isTypingPlayback && (
        <div className="px-3 py-1 text-xs text-indigo-300 bg-indigo-950/40 border-t border-indigo-900">
          CBS Mode typing… {typingCursorIndex}
        </div>
      )}
    </div>
  );
}

export default Editor;
