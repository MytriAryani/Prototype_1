export default function VarietyCard({ variety, onViewProduct }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md w-full max-w-xs">
      <img
        src={variety.image}
        alt={variety.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{variety.name}</h3>
        <p className="text-sm text-gray-600 mt-1 mb-4">
          {variety.description}
        </p>
        <button
          onClick={onViewProduct}
          className="w-full bg-slate-900 text-white text-sm py-2 rounded-md hover:bg-slate-800"
        >
          Get Quote
        </button>
      </div>
    </div>
  );
}
