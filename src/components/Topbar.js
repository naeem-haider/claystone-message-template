import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Menu } from "lucide-react";


export default function Topbar({ onCreate, search, setSearch, toggleSidebar }) {
    return (
        <div className="w-full h-16 bg-white border-b flex items-center justify-between px-7 sticky top-0 z-40 py-2">

            <div className="flex items-center gap-3">

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 border rounded-lg"
                >
                    <Menu size={18} />
                </button>

                <input
                    type="text"
                    placeholder="Search templates..."
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded-lg w-40 md:w-74"
                />
            </div>

            

            <button
                onClick={onCreate}
                className="bg-black text-white px-3 py-2 rounded-lg text-sm border"
            >
                + Template
            </button>
        </div>
    );
}