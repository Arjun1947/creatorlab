export default function ToolCard({ title, description }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <button className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700">
        Open Tool
      </button>
    </div>
  );
}
