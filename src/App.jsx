import React, { useEffect, useMemo, useRef, useState } from 'react';
import TopBar from './components/TopBar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Editor from './components/Editor.jsx';
import PreviewPane from './components/PreviewPane.jsx';

const defaultHTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Vibe Code Studio</title>
  <style>
    body { font-family: Inter, ui-sans-serif, system-ui, -apple-system; margin: 0; padding: 2rem; background: #0f1221; color: #e6e8ff; }
    .card { background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)); border: 1px solid rgba(255,255,255,0.12); padding: 24px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.35); }
    h1 { margin: 0 0 8px; }
    p { opacity: 0.85; }
    .btn { display:inline-block; margin-top: 16px; padding: 10px 16px; background:#6366f1; color:#fff; border-radius:10px; text-decoration:none }
  </style>
</head>
<body>
  <div class="card">
    <h1>Welcome to Vibe Code Studio</h1>
    <p>Edit code on the left and toggle live preview from File → Preview.</p>
    <a class="btn" href="#">Nice! ✨</a>
  </div>
</body>
</html>`;

function usePublishedRoute() {
  const [publishedName, setPublishedName] = useState(null);
  useEffect(() => {
    const path = window.location.pathname;
    if (path && path !== '/' && !path.startsWith('/@vite')) {
      const name = decodeURIComponent(path.replace(/^\//, ''));
      setPublishedName(name);
    }
  }, []);
  return publishedName;
}

function PublishedView({ name }) {
  const [html, setHtml] = useState('');
  useEffect(() => {
    const map = JSON.parse(localStorage.getItem('publishedPages') || '{}');
    const code = map[name];
    if (code) setHtml(code);
  }, [name]);

  if (!html) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-200 flex items-center justify-center p-6">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-semibold mb-2">Not Published</h1>
          <p className="opacity-70 mb-6">No page found for “{name}”.</p>
          <a href="/" className="px-4 py-2 rounded bg-indigo-600 text-white">Back to Editor</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="w-full bg-gray-900 text-gray-200 text-sm px-4 py-2 flex items-center justify-between">
        <div>Published: /{name}</div>
        <a href="/" className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">Back to Editor</a>
      </div>
      <iframe title={`published-${name}`} className="w-full h-[calc(100vh-40px)] bg-white" srcDoc={html} sandbox="allow-scripts allow-same-origin allow-forms" />
    </div>
  );
}

function App() {
  const publishedName = usePublishedRoute();
  const [pages, setPages] = useState(() => {
    const saved = localStorage.getItem('vcs_pages');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'p1', name: 'index.html', content: defaultHTML },
    ];
  });
  const [currentId, setCurrentId] = useState(() => pages[0]?.id || null);
  const [previewOn, setPreviewOn] = useState(true);
  const [publishedLink, setPublishedLink] = useState('');

  // CBS typing state
  const [isTyping, setIsTyping] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const typingTimerRef = useRef(null);
  const typingTargetRef = useRef('');
  const originalBeforeTypeRef = useRef('');

  useEffect(() => {
    localStorage.setItem('vcs_pages', JSON.stringify(pages));
  }, [pages]);

  const currentPage = useMemo(() => pages.find(p => p.id === currentId) || null, [pages, currentId]);

  const currentHTML = useMemo(() => {
    const code = currentPage?.content || '';
    return code;
  }, [currentPage]);

  const setCurrentContent = (val) => {
    setPages(prev => prev.map(p => (p.id === currentId ? { ...p, content: val } : p)));
  };

  const addPage = () => {
    const name = prompt('New page name (e.g., page.html):', `page-${pages.length + 1}.html`);
    if (!name) return;
    const id = 'p' + Math.random().toString(36).slice(2, 9);
    const base = name.endsWith('.html') ? defaultHTML : '';
    const newPage = { id, name, content: base };
    setPages(prev => [...prev, newPage]);
    setCurrentId(id);
  };

  const deletePage = (id) => {
    const next = pages.filter(p => p.id !== id);
    setPages(next);
    if (currentId === id && next.length) setCurrentId(next[0].id);
  };

  const handleUploadProject = async (files) => {
    // Prefer HTML files; load their contents
    const htmlFiles = files.filter(f => f.name.toLowerCase().endsWith('.html'));
    const targets = htmlFiles.length ? htmlFiles : files;
    const loaded = await Promise.all(
      targets.map(async (f, idx) => {
        const text = await f.text();
        return { id: 'u' + idx + '_' + Math.random().toString(36).slice(2, 7), name: f.webkitRelativePath || f.name, content: text };
      })
    );
    if (loaded.length) {
      setPages(loaded);
      setCurrentId(loaded[0].id);
    }
  };

  const handlePublish = () => {
    if (!currentPage) return;
    const name = prompt('Publish name (letters, numbers, dashes):', currentPage.name.replace(/\.[^.]+$/, ''));
    if (!name) return;
    const map = JSON.parse(localStorage.getItem('publishedPages') || '{}');
    map[name] = currentPage.content;
    localStorage.setItem('publishedPages', JSON.stringify(map));
    const link = `${window.location.origin}/${encodeURIComponent(name)}`;
    setPublishedLink(link);
    alert(`Published at: ${link}`);
  };

  const togglePreview = () => setPreviewOn((v) => !v);

  const startCBS = () => {
    if (!currentPage) return;
    const input = prompt('CBS typing speed (1-100):', '60');
    if (!input) return;
    let speed = parseInt(input, 10);
    if (Number.isNaN(speed) || speed < 1) speed = 1;
    if (speed > 100) speed = 100;
    const cps = Math.max(2, Math.round(speed * 0.8)); // characters per second
    const interval = Math.max(16, Math.round(1000 / cps));

    // prepare typing
    originalBeforeTypeRef.current = currentPage.content;
    typingTargetRef.current = currentPage.content;
    setPages(prev => prev.map(p => (p.id === currentId ? { ...p, content: '' } : p)));
    setIsTyping(true);
    setTypingIndex(0);

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    typingTimerRef.current = setInterval(() => {
      setTypingIndex((idx) => {
        const nextIdx = idx + 1;
        const slice = typingTargetRef.current.slice(0, nextIdx);
        setCurrentContent(slice);
        if (nextIdx >= typingTargetRef.current.length) {
          clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
          setTimeout(() => setIsTyping(false), 200);
        }
        return nextIdx;
      });
    }, interval);
  };

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  if (publishedName) {
    return <PublishedView name={publishedName} />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <TopBar
        onTogglePreview={togglePreview}
        isPreviewOn={previewOn}
        onPublish={handlePublish}
        onCBSMode={startCBS}
        onUploadProject={handleUploadProject}
      />

      {publishedLink && (
        <div className="px-4 py-2 text-sm bg-emerald-900/40 text-emerald-200 border-b border-emerald-800">
          Published at: <a className="underline" href={publishedLink}>{publishedLink}</a>
        </div>
      )}

      <div className="flex-1 grid" style={{ gridTemplateColumns: previewOn ? '14rem 1fr 1fr' : '14rem 1fr' }}>
        <Sidebar
          pages={pages}
          currentId={currentId}
          onSelect={setCurrentId}
          onAdd={addPage}
          onDelete={deletePage}
        />

        <Editor
          value={currentPage?.content || ''}
          onChange={setCurrentContent}
          isTypingPlayback={isTyping}
          typingCursorIndex={typingIndex}
        />

        <PreviewPane html={currentHTML} visible={previewOn} />
      </div>

      <div className="h-8 bg-gray-900 border-t border-gray-800 text-xs text-gray-400 px-3 flex items-center justify-between">
        <div>Ready — {pages.length} page(s)</div>
        <div>{previewOn ? 'Live Preview: On' : 'Live Preview: Off'}</div>
      </div>
    </div>
  );
}

export default App;
