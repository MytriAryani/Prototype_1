// src/pages/ProductDetailPage.jsx
import { useParams } from "react-router-dom";
import productsData from "../data/products.json";
import NavBar from "../components/Navbar";
import { useState } from "react";

export default function ProductDetailPage() {
  const { categoryId, typeId, varietyId } = useParams();

  const productCategory = productsData.find(c => c.id === categoryId);
  const productType = productCategory?.types.find(t => t.id === typeId);
  const variety = productType?.varieties.find(v => v.id === varietyId);

  const [selectedImage, setSelectedImage] = useState(variety?.images?.[0] || variety?.image);
  const [selectedSize, setSelectedSize] = useState(null);
  const [crateQty, setCrateQty] = useState(0);
  const [pieceQty, setPieceQty] = useState(0);

  if (!productCategory || !productType || !variety) {
    return <div className="max-w-6xl mx-auto px-4 py-8">Product not found.</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      <NavBar />

      <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Image Section */}
        <div>
          <img src={selectedImage} alt={variety.name} className="w-full h-[400px] object-cover rounded-lg" />

          <div className="flex mt-4 space-x-3">
            {[variety.image, ...(variety.images || [])].map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumb ${index}`}
                onClick={() => setSelectedImage(img)}
                className={`h-20 w-20 object-cover cursor-pointer border-2 rounded-md ${selectedImage === img ? "border-black" : "border-gray-200"}`}
              />
            ))}
          </div>
        </div>

        {/* Right: Info Section */}
        <div>
          <h1 className="text-2xl font-bold mb-4">{variety.name.toUpperCase()}</h1>

          {/* Size Options */}
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-4">Size options</h2>
            <div className="space-y-3">
              {variety.details.sizeOptions.map((option, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedSize(option)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${selectedSize?.size === option.size ? "border-black" : "border-gray-300"}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">{option.size}</p>
                    <p className="text-sm font-medium">₹{option.price.toFixed(2)}</p>
                  </div>
                  <div  className="flex justify-between items-center mb-1">
                    <p className="text-sm italic text-gray-500 mb-1">Weight: {option.weightPerPiece} | {option.piecesPerCrate} pieces/crate</p>
                    <p className="text-sm text-gray-500">Stock: {option.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Options */}
          {selectedSize && (
            <>
              <div className="mb-6">
                <h2 className="font-semibold text-lg mb-2">Purchase Options</h2>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center space-x-2">
                    <input type="radio" checked readOnly />
                    <span>Buy by Crate <span className="italic text-gray-400 text-xs">(66 pieces - Recommended)</span></span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" checked readOnly />
                    <span>Buy by Piece</span>
                  </label>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Quantity:</label>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <label className="text-sm">+</label>
                    <input
                      type="number"
                      value={crateQty}
                      onChange={e => setCrateQty(Number(e.target.value))}
                      min={0}
                      className="w-12 px-2 py-1 border rounded-md"
                    />
                    <label className="text-sm">Crate</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm">+</label>
                    <input
                      type="number"
                      value={pieceQty}
                      onChange={e => setPieceQty(Number(e.target.value))}
                      min={0}
                      className="w-12 px-2 py-1 border rounded-md"
                    />
                    <label className="text-sm">Piece</label>
                  </div>
                </div>
              </div>

              <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 transition">
                ADD TO CART
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
  