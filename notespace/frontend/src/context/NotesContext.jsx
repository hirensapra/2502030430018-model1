import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getNotes,
  getPinnedNotes,
  getTrashedNotes,
  createNote,
  updateNote,
  togglePin,
  trashNote,
  restoreNote,
  deleteNote,
  emptyTrash,
} from '../utils/api';

const NotesContext = createContext(null);

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pinned: 0 });
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('all'); // 'all' | 'pinned' | 'trash'
  const [activeTag, setActiveTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNotes = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await getNotes(params);
      setNotes(data.notes);
      setCounts({ total: data.total, pinned: data.pinned });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPinned = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getPinnedNotes();
      setNotes(data.notes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrash = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getTrashedNotes();
      setNotes(data.notes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNote = async (noteData) => {
    const { data } = await createNote(noteData);
    await fetchNotes({ tag: activeTag || undefined, search: searchQuery || undefined });
    return data.note;
  };

  const editNote = async (id, noteData) => {
    const { data } = await updateNote(id, noteData);
    setNotes((prev) => prev.map((n) => (n._id === id ? data.note : n)));
    return data.note;
  };

  const pinNote = async (id) => {
    const { data } = await togglePin(id);
    if (activeView === 'pinned') {
      setNotes((prev) => prev.filter((n) => n._id !== id || data.note.isPinned));
    } else {
      setNotes((prev) => prev.map((n) => (n._id === id ? data.note : n)));
    }
    setCounts((c) => ({
      ...c,
      pinned: data.note.isPinned ? c.pinned + 1 : c.pinned - 1,
    }));
    return data.note;
  };

  const moveToTrash = async (id) => {
    await trashNote(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
    setCounts((c) => ({ ...c, total: c.total - 1 }));
  };

  const restoreFromTrash = async (id) => {
    await restoreNote(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  const permanentDelete = async (id) => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  const clearTrash = async () => {
    await emptyTrash();
    setNotes([]);
  };

  const refreshView = useCallback(() => {
    if (activeView === 'all') fetchNotes({ tag: activeTag || undefined, search: searchQuery || undefined });
    else if (activeView === 'pinned') fetchPinned();
    else if (activeView === 'trash') fetchTrash();
  }, [activeView, activeTag, searchQuery, fetchNotes, fetchPinned, fetchTrash]);

  return (
    <NotesContext.Provider
      value={{
        notes,
        counts,
        loading,
        activeView,
        activeTag,
        searchQuery,
        setActiveView,
        setActiveTag,
        setSearchQuery,
        fetchNotes,
        fetchPinned,
        fetchTrash,
        addNote,
        editNote,
        pinNote,
        moveToTrash,
        restoreFromTrash,
        permanentDelete,
        clearTrash,
        refreshView,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
};
