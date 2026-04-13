import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Topbar({ onCreate, search, setSearch }) {
  return (
    <div className="w-full h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-40">
      
      <input
        type="text"
        placeholder="Search templates..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded-lg w-64"
      />

      <button
        onClick={onCreate}
        className="bg-black text-white px-4 py-2 rounded-lg text-sm"
      >
        + New Template
      </button>
    </div>
  );
}