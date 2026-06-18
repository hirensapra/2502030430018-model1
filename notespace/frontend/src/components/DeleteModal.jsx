import { Trash2 } from 'lucide-react';

const DeleteModal = ({ noteName, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-red-400" />
        </div>
        <h2 className="text-white font-semibold text-lg mb-2">Delete this note?</h2>
        <p className="text-[#888] text-sm mb-6 leading-relaxed">
          "{noteName}" will be permanently deleted and cannot be recovered.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg bg-[#2e2e2e] hover:bg-[#3a3a3a] text-[#ccc] text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors disabled:opacity-60"
          >
            {loading ? 'Deleting...' : 'Yes, delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
