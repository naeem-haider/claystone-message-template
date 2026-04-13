
export default function Sidebar({ templates, onSelect, selectedId }) {
  return (
    <div className="w-64 h-screen sticky top-0 bg-white border-r p-5 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-6">Templates</h2>

      <ul className="space-y-2">
        {templates.map((item) => (
          <li
            key={item.id}
            onClick={() => onSelect(item)}
            className={`p-2 rounded-lg cursor-pointer ${
              selectedId === item.id
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
  );
}