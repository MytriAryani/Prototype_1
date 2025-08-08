export default function ProductTypeCard({ type, onClick }) {
  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition flex flex-col"
      onClick={onClick}
    >
      <img src={type.image} alt={type.name} className="h-48 w-full object-cover rounded-t-xl" />
      <div className="p-4 text-center flex flex-col justify-center items-center">
        <div className="flex items-center justify-center mb-2 py-1 px-10 border-2 border-black w-fit rounded-full">
          <h2 className="text-lg font-bold">{type.name}</h2>
        </div>
        <p className="text-gray-600 text-sm">{type.description}</p>
      </div>
    </div>
  );
}
