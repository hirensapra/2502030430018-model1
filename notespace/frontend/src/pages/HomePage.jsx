import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, NotebookText, Plus } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';

const VIEW_TITLES = {
  all: 'All notes',
  pinned: 'Pinned',
  trash: 'Trash',
};

const HomePage = () => {
  const {
    notes,
    loading,
    activeView,
    activeTag,
    searchQuery,
    setSearchQuery,
    fetchNotes,
    fetchPinned,
    fetchTrash,
    clearTrash,
    restoreFromTrash,
    permanentDelete,
  } = useNotes();

  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Sync search with backend
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (activeView === 'all') {
        fetchNotes({ tag: activeTag || undefined, search: searchQuery || undefined });
      }
    }, 400);
    return () => clearTimeout(debounce);
  }, [searchQuery]); // eslint-disable-line

  // Initial load based on view
  useEffect(() => {
    if (activeView === 'all') fetchNotes({ tag: activeTag || undefined });
    else if (activeView === 'pinned') fetchPinned();
    else if (activeView === 'trash') fetchTrash();
  }, [activeView, activeTag]); // eslint-disable-line

  const title = activeTag ? activeTag : VIEW_TITLES[activeView];

  const handlePermanentDelete = async () => {
    setDeleteLoading(true);
    try {
      await permanentDelete(deleteTarget._id);
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#111]">
      <Sidebar onNewNote={() => navigate('/note/new')} />

      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2e2e2e]">
          <h1 className="text-white font-semibold text-xl">{title}</h1>
          <div className="flex items-center gap-2">
            {activeView !== 'trash' && (
              <>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes..."
                    className="bg-[#1e1e1e] border border-[#2e2e2e] text-[#aaa] text-sm rounded-lg pl-8 pr-4 py-2 w-52 placeholder-[#555] focus:outline-none focus:border-[#444]"
                  />
                </div>
                <button className="p-2 rounded-lg text-[#555] hover:text-[#aaa] hover:bg-[#1e1e1e] transition-colors">
                  <SlidersHorizontal size={16} />
                </button>
              </>
            )}
            {activeView === 'trash' && notes.length > 0 && (
              <button
                onClick={clearTrash}
                className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 rounded-lg px-3 py-1.5 transition-colors"
              >
                Empty trash
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-14 h-14 rounded-full bg-[#1e1e1e] border border-[#2e2e2e] flex items-center justify-center mb-4">
                <NotebookText size={22} className="text-[#444]" />
              </div>
              <h3 className="text-white font-medium mb-2">No notes yet</h3>
              <p className="text-[#666] text-sm mb-5 max-w-xs">
                {activeView === 'trash'
                  ? 'Your trash is empty.'
                  : 'Start capturing your thoughts — click "New note" to create your first one.'}
              </p>
              {activeView !== 'trash' && (
                <button
                  onClick={() => navigate('/note/new')}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                >
                  <Plus size={15} />
                  New note
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) =>
                activeView === 'trash' ? (
                  <div key={note._id} className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-xl p-4 opacity-75">
                    <h3 className="text-white font-medium text-sm mb-1">{note.title}</h3>
                    <p className="text-[#666] text-xs mb-3 line-clamp-2">{note.content}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => restoreFromTrash(note._id)}
                        className="text-xs text-green-400 hover:text-green-300 transition-colors"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => setDeleteTarget(note)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete forever
                      </button>
                    </div>
                  </div>
                ) : (
                  <NoteCard key={note._id} note={note} />
                )
              )}
            </div>
          )}
        </div>
      </main>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-xl">🗑</span>
            </div>
            <h2 className="text-white font-semibold mb-2">Delete this note?</h2>
            <p className="text-[#888] text-sm mb-6">
              "{deleteTarget.title}" will be permanently deleted and cannot be recovered.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-lg bg-[#2e2e2e] hover:bg-[#3a3a3a] text-[#ccc] text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePermanentDelete}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium disabled:opacity-60"
              >
                {deleteLoading ? 'Deleting...' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
