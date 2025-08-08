import { useParams, useNavigate } from "react-router-dom";
import productsData from "../data/products.json";
import VarietiesGrid from "../components/varieties/VarietiesGrid";
import NAVBAR from "../components/Navbar";

export default function VarietiesPage() {
  const { categoryId, typeId } = useParams();
  const navigate = useNavigate();

  const category = productsData.find(cat => cat.id === categoryId);
  const type = category?.types.find(t => t.id === typeId);

  if (!category || !type) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-red-600">Product or Type not found.</h2>
      </div>
    );
  }

  function handleVarietyClick(varietyId) {
    navigate(`/products/${categoryId}/${typeId}/${varietyId}`);
  }

  return (
    <div className="bg-white min-h-screen">
      {/* NAVBAR */}
      <NAVBAR />

      {/* Content wrapper */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-2">
          <ol className="flex space-x-2">
            <li>Products</li>
            <li>/</li>
            <li>{category.name}</li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{type.name}</li>
          </ol>
        </nav>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {type.name}
        </h1>

        {/* Paragraph */}
        <p className="text-sm text-gray-600 max-w-2xl mb-10">
          {type.description}
        </p>

        {/* Card grid */}
        <VarietiesGrid varieties={type.varieties || []} onCardClick={handleVarietyClick} />
      </main>
    </div>
  );
}
