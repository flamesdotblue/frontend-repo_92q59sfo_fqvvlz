import React from 'react';

function PreviewPane({ html, visible }) {
  if (!visible) return null;
  return (
    <div className="h-full w-full border-l bg-black">
      <div className="px-3 py-2 border-b bg-gray-900 text-gray-300 text-xs">Live Preview</div>
      <iframe
        title="preview"
        className="w-full h-[calc(100%-32px)] bg-white"
        sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups allow-modals"
        srcDoc={html}
      />
    </div>
  );
}

export default PreviewPane;
