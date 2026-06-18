import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pin } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { getNote } from '../utils/api';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';

const TAGS = ['Personal', 'Work', 'Ideas'];

const EditNotePage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('Personal');
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { editNote } = useNotes();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getNote(id);
        setTitle(data.note.title);
        setContent(data.note.content);
        setTag(data.note.tag);
        setIsPinned(data.note.isPinned);
      } catch {
        toast.error('Note not found');
        navigate('/');
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    setLoading(true);
    try {
      await editNote(id, { title, content, tag, isPinned });
      toast.success('Note updated!');
      navigate(`/note/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update note');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#111]">
      <Sidebar onNewNote={() => navigate('/note/new')} />

      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2e2e2e]">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-[#666] hover:text-[#aaa] transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-white font-semibold text-lg">Edit note</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPinned(!isPinned)}
              className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border transition-colors ${
                isPinned
                  ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                  : 'border-[#2e2e2e] text-[#666] hover:border-[#444] hover:text-[#aaa]'
              }`}
            >
              <Pin size={14} />
              {isPinned ? 'Pinned' : 'Pin'}
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {loading ? 'Updating...' : 'Update note'}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 p-6 max-w-2xl w-full">
          <div className="mb-5">
            <label className="block text-sm text-[#888] mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-[#2e2e2e] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              autoFocus
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm text-[#888] mb-2">Tag</label>
            <div className="flex gap-2">
              {TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    tag === t
                      ? 'bg-white text-[#111] border-white'
                      : 'border-[#3a3a3a] text-[#888] hover:border-[#555]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#888] mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full bg-[#1e1e1e] border border-[#2e2e2e] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditNotePage;
