import { useParams, useNavigate } from "react-router-dom";
import productsData from "../data/products.json";
import TypesGrid from "../components/productsType/TypesGrid";
import NavBar from "../components/Navbar"

export default function ProductTypesPage({ user, onLogout }) {
  const { slug } = useParams(); // category slug from URL
  const navigate = useNavigate();

  const productCategory = productsData.find(cat => cat.id === slug);

  if (!productCategory) {
    return <div className="max-w-6xl mx-auto px-4 py-8">Product category not found.</div>;
  }

  function handleTypeClick(typeId) {
    navigate(`/products/${slug}/${typeId}`);
  }

  return (
    
    <section>
      <NavBar  user={user} onLogout={onLogout} />
      <main className="max-w-6xl mx-auto px-4 py-8">
      
        <h1 className="text-3xl font-bold mb-3">{productCategory.name}</h1>
        <TypesGrid types={productCategory.types} onCardClick={handleTypeClick} />
      </main>
    </section>
  );
}
