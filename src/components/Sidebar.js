
export default function Sidebar({ templates, onSelect, selectedId, isOpen, onClose }) {
    return (
        <>
            {/* Overlay (mobile only) */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                />
            )}

            {/* Sidebar */}
            <div
                className={`
      fixed md:static top-0 left-0 h-screen w-74 bg-white p-5 z-50
      transform transition-transform duration-300 border-r

      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0
    `}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold px-5">Templates</h2>

                    <button onClick={onClose} className="md:hidden">
                        ✕
                    </button>
                </div>
                <div className="w-64 h-screen sticky top-0 bg-white p-5 overflow-y-auto">



                    <ul className="space-y-2">
                        {templates.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => {
                                    onSelect(item);
                                    onClose();
                                }}
                                className={`p-2 rounded-lg cursor-pointer ${selectedId === item.id
                                        ? "bg-gray-200"
                                        : "hover:bg-gray-100"
                                    }`}
                            >
                                <p className="font-medium">{item.title}</p>
                                <p className="text-xs text-gray-500">{item.category}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}