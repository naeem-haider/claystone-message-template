import { Copy, Check, Pencil } from "lucide-react";

export default function MessageList({
  messages,
  generateMessage,
  handleCopy,
  handleEdit,
  copiedId,
}) {
  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div key={msg.id} className="p-4 border rounded-xl space-y-3">

          <p className="whitespace-pre-line">
            {generateMessage(msg.content)}
          </p>

          <div className="flex gap-3">
            <button onClick={() => handleCopy(msg)}>
              {copiedId === msg.id ? <Check /> : <Copy />}
            </button>

            <button onClick={() => handleEdit(msg)}>
              <Pencil />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}