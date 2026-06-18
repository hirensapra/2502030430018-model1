const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
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
} = require('../controllers/noteController');

router.use(protect);

router.route('/').get(getNotes).post(createNote);
router.get('/pinned', getPinnedNotes);
router.get('/trash', getTrashedNotes);
router.delete('/trash/empty', emptyTrash);
router.route('/:id').get(getNote).put(updateNote).delete(deleteNote);
router.patch('/:id/pin', togglePin);
router.patch('/:id/trash', trashNote);
router.patch('/:id/restore', restoreNote);

module.exports = router;
