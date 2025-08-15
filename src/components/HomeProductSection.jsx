import { useNavigate } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Granite Landscape",
    slug: "granite-landscaping-products",
    image: "granite-landscaping-products.png",
    description: "Granite solutions for landscapes and architecture."
  },
  {
    id: 2,
    name: "Marble Tiles",
    slug: "marble-tiles",
    image: "marble-tiles.png",
    description: "Premium quality marble for floors and walls."
  },
  {
    id: 3,
    name: "Quartz Surfaces",
    slug: "quartz-surfaces",
    image: "quartz-surfaces.png",
    description: "Engineered quartz for modern living."
  },
  {
    id: 4,
    name: "Indoor Stone Cladding",
    slug: "indoor-stone-cladding",
    image: "indoor-cladding.png",
    description: "Elegant indoor wall solutions in natural stone."
  },
  {
    id: 5,
    name: "Outdoor Paving Stones",
    slug: "outdoor-paving-stones",
    image: "outdoor-paving.png",
    description: "Durable outdoor paving options that last."
  },
];

function HomeProductsSection() {
  const navigate = useNavigate();

  function handleProductClick(slug) {
    navigate(`/products/${slug}`);
  }

  return (
    <section id="products-section" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-10 text-center">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 place-items-center">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition flex flex-col items-center py-6 px-4 w-full max-w-xs"
            onClick={() => handleProductClick(product.slug)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-40 w-40 object-cover rounded-lg mb-5 shadow-sm border border-gray-200"
            />
            <div className="flex items-center justify-center mb-2 py-1 px-10 border-2 border-black rounded-full">
              <h3 className=" font-bold text-center">{product.name}</h3>
            </div>
            <p className="text-gray-600 text-sm text-center">
              {product.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HomeProductsSection;
