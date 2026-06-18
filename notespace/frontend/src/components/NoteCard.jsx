import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import toast from 'react-hot-toast';

const TAG_STYLES = {
  Personal: 'bg-purple-600/20 text-purple-400 border border-purple-600/30',
  Work: 'bg-green-600/20 text-green-400 border border-green-600/30',
  Ideas: 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30',
};

const TAG_DOT = {
  Personal: 'bg-purple-500',
  Work: 'bg-green-500',
  Ideas: 'bg-yellow-500',
};

const NoteCard = ({ note, showActions = true }) => {
  const { moveToTrash } = useNotes();
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await moveToTrash(note._id);
      toast.success('Note moved to trash');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/note/${note._id}/edit`);
  };

  return (
    <div
      onClick={() => navigate(`/note/${note._id}`)}
      className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-xl p-4 cursor-pointer hover:border-[#444] transition-all group relative"
    >
      {/* Tag dot (top left accent) */}
      <span className={`absolute top-3 left-3 w-2 h-2 rounded-full ${TAG_DOT[note.tag] || 'bg-purple-500'}`} />

      {/* Tag pill */}
      <div className="mb-2 pl-4">
        <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${TAG_STYLES[note.tag]}`}>
          {note.tag}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-white font-semibold text-sm mb-1.5 leading-snug line-clamp-2">{note.title}</h3>

      {/* Content preview */}
      <p className="text-[#888] text-xs leading-relaxed line-clamp-3 mb-3">{note.content || 'No content'}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[#555] text-xs">
          {format(new Date(note.createdAt), 'MMM d, yyyy')}
        </span>

        {showActions && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              className="p-1.5 rounded-lg text-[#666] hover:text-purple-400 hover:bg-[#2e2e2e] transition-colors"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-[#666] hover:text-red-400 hover:bg-[#2e2e2e] transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
