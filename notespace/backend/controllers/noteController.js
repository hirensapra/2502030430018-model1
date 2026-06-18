const Note = require('../models/Note');

// @desc    Get all notes (not trashed)
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res, next) => {
  try {
    const { search, tag } = req.query;
    const query = { user: req.user.id, isTrashed: false };

    if (tag && ['Personal', 'Work', 'Ideas'].includes(tag)) {
      query.tag = tag;
    }

    let notes;
    if (search && search.trim()) {
      notes = await Note.find({
        ...query,
        $text: { $search: search.trim() },
      }).sort({ isPinned: -1, createdAt: -1 });
    } else {
      notes = await Note.find(query).sort({ isPinned: -1, createdAt: -1 });
    }

    const total = await Note.countDocuments({ user: req.user.id, isTrashed: false });
    const pinned = await Note.countDocuments({ user: req.user.id, isPinned: true, isTrashed: false });

    res.json({
      success: true,
      count: notes.length,
      total,
      pinned,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pinned notes
// @route   GET /api/notes/pinned
// @access  Private
const getPinnedNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({
      user: req.user.id,
      isPinned: true,
      isTrashed: false,
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: notes.length, notes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trashed notes
// @route   GET /api/notes/trash
// @access  Private
const getTrashedNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({
      user: req.user.id,
      isTrashed: true,
    }).sort({ trashedAt: -1 });

    res.json({ success: true, count: notes.length, notes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
const getNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const { title, content, tag, isPinned } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const note = await Note.create({
      user: req.user.id,
      title: title.trim(),
      content: content || '',
      tag: tag || 'Personal',
      isPinned: isPinned || false,
    });

    res.status(201).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    const { title, content, tag, isPinned } = req.body;

    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) note.content = content;
    if (tag !== undefined) note.tag = tag;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();

    res.json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle pin note
// @route   PATCH /api/notes/:id/pin
// @access  Private
const togglePin = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Move note to trash
// @route   PATCH /api/notes/:id/trash
// @access  Private
const trashNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    note.isTrashed = true;
    note.trashedAt = new Date();
    note.isPinned = false;
    await note.save();

    res.json({ success: true, message: 'Note moved to trash', note });
  } catch (error) {
    next(error);
  }
};

// @desc    Restore note from trash
// @route   PATCH /api/notes/:id/restore
// @access  Private
const restoreNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    note.isTrashed = false;
    note.trashedAt = null;
    await note.save();

    res.json({ success: true, message: 'Note restored', note });
  } catch (error) {
    next(error);
  }
};

// @desc    Permanently delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    await note.deleteOne();

    res.json({ success: true, message: 'Note permanently deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Empty trash
// @route   DELETE /api/notes/trash/empty
// @access  Private
const emptyTrash = async (req, res, next) => {
  try {
    const result = await Note.deleteMany({ user: req.user.id, isTrashed: true });
    res.json({ success: true, message: `Deleted ${result.deletedCount} notes from trash` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  getPinnedNotes,
  getTrashedNotes,
  getNote,
  createNote,
  updateNote,
  togglePin,
  trashNote,
  restoreNote,
  deleteNote,
  emptyTrash,
};
