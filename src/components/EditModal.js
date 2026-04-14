export default function EditModal({
  isOpen,
  tempText,
  setTempText,
  onClose,
  onSave,
  onCopy,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl p-6 rounded-xl space-y-4">

        <textarea
          value={tempText}
          onChange={(e) => setTempText(e.target.value)}
          className="w-full h-[70vh] border p-4 rounded"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onCopy}>Copy</button>
          <button onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
}