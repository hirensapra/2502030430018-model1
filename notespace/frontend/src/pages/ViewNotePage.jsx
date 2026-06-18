import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Pin } from 'lucide-react';
import { format } from 'date-fns';
import { getNote } from '../utils/api';
import { useNotes } from '../context/NotesContext';
import Sidebar from '../components/Sidebar';
import DeleteModal from '../components/DeleteModal';
import toast from 'react-hot-toast';

const TAG_STYLES = {
  Personal: 'bg-purple-600/20 text-purple-400 border border-purple-600/30',
  Work: 'bg-green-600/20 text-green-400 border border-green-600/30',
  Ideas: 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30',
};

const ViewNotePage = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { moveToTrash } = useNotes();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getNote(id);
        setNote(data.note);
      } catch {
        toast.error('Note not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await moveToTrash(id);
      toast.success('Note moved to trash');
      navigate('/');
    } catch {
      toast.error('Failed to delete note');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="flex min-h-screen bg-[#111]">
      <Sidebar onNewNote={() => navigate('/note/new')} />

      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2e2e2e]">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-[#666] hover:text-[#aaa] transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-white font-semibold text-lg">View note</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/note/${id}/edit`)}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-[#2e2e2e] text-[#aaa] hover:border-[#444] transition-colors"
            >
              <Pencil size={13} />
              Edit
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:border-red-500/60 transition-colors"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 max-w-2xl w-full">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TAG_STYLES[note.tag]}`}>
              {note.tag}
            </span>
            <span className="text-[#555] text-sm">
              {format(new Date(note.createdAt), 'MMM d, yyyy')}
            </span>
            {note.isPinned && (
              <span className="flex items-center gap-1 text-purple-400 text-xs border border-purple-500/30 rounded-full px-2 py-0.5">
                <Pin size={10} />
                Pinned
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-white font-bold text-2xl mb-4 leading-tight">{note.title}</h2>

          {/* Body */}
          <p className="text-[#ccc] text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
        </div>
      </main>

      {showDelete && (
        <DeleteModal
          noteName={note.title}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default ViewNotePage;
