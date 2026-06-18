import { LayoutGrid, Pin, Trash2, Settings, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { useNavigate } from 'react-router-dom';

const TAG_COLORS = {
  Personal: 'bg-purple-500',
  Work: 'bg-green-500',
  Ideas: 'bg-yellow-500',
};

const Sidebar = ({ onNewNote }) => {
  const { user } = useAuth();
  const { counts, activeView, activeTag, setActiveView, setActiveTag, fetchNotes, fetchPinned, fetchTrash } = useNotes();
  const navigate = useNavigate();

  const handleViewChange = (view) => {
    setActiveView(view);
    setActiveTag(null);
    if (view === 'all') fetchNotes();
    else if (view === 'pinned') fetchPinned();
    else if (view === 'trash') fetchTrash();
    navigate('/');
  };

  const handleTagFilter = (tag) => {
    const newTag = activeTag === tag ? null : tag;
    setActiveTag(newTag);
    setActiveView('all');
    fetchNotes({ tag: newTag || undefined });
    navigate('/');
  };

  return (
    <aside className="w-[260px] min-h-screen bg-[#1a1a1a] border-r border-[#2e2e2e] flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#2e2e2e]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-purple-600 rounded-md flex items-center justify-center">
            <LayoutGrid size={14} className="text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">NoteSpace</span>
        </div>
      </div>

      {/* New Note Button */}
      <div className="px-4 py-4">
        <button
          onClick={onNewNote}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New note
        </button>
      </div>

      {/* Menu */}
      <nav className="px-3 flex-1">
        <p className="px-2 py-1 text-xs font-semibold text-[#555] uppercase tracking-wider mb-1">Menu</p>

        <button
          onClick={() => handleViewChange('all')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5 ${
            activeView === 'all' && !activeTag
              ? 'bg-[#2e2e2e] text-white'
              : 'text-[#aaa] hover:bg-[#242424] hover:text-white'
          }`}
        >
          <span className="flex items-center gap-3">
            <LayoutGrid size={16} />
            All notes
          </span>
          <span className="text-xs text-[#666] bg-[#333] rounded-md px-1.5 py-0.5">{counts.total}</span>
        </button>

        <button
          onClick={() => handleViewChange('pinned')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5 ${
            activeView === 'pinned'
              ? 'bg-[#2e2e2e] text-white'
              : 'text-[#aaa] hover:bg-[#242424] hover:text-white'
          }`}
        >
          <span className="flex items-center gap-3">
            <Pin size={16} />
            Pinned
          </span>
          <span className="text-xs text-[#666] bg-[#333] rounded-md px-1.5 py-0.5">{counts.pinned}</span>
        </button>

        <button
          onClick={() => handleViewChange('trash')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
            activeView === 'trash'
              ? 'bg-[#2e2e2e] text-white'
              : 'text-[#aaa] hover:bg-[#242424] hover:text-white'
          }`}
        >
          <Trash2 size={16} />
          Trash
        </button>

        {/* Tags */}
        <p className="px-2 py-1 text-xs font-semibold text-[#555] uppercase tracking-wider mt-4 mb-1">Tags</p>

        {Object.entries(TAG_COLORS).map(([tag, color]) => (
          <button
            key={tag}
            onClick={() => handleTagFilter(tag)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5 ${
              activeTag === tag
                ? 'bg-[#2e2e2e] text-white'
                : 'text-[#aaa] hover:bg-[#242424] hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${color}`} />
            {tag}
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-[#2e2e2e] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.initials || user?.fullName?.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-sm text-[#ccc] truncate max-w-[130px]">{user?.fullName}</span>
        </div>
        <button className="text-[#666] hover:text-[#aaa] transition-colors">
          <Settings size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
