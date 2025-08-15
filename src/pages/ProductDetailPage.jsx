import { useParams } from "react-router-dom";
import productsData from "../data/products.json";
import NavBar from "../components/Navbar";
import { useState, useMemo } from "react";
import { useCart } from "../context/CartContext"; // ✅ use cart

export default function ProductDetailPage() {
  const { categoryId, typeId, varietyId } = useParams();
  const { addToCart } = useCart();

  // ✅ Safe product lookups
  const productCategory = useMemo(
    () => productsData.find(c => c.id === categoryId),
    [categoryId]
  );
  const productType = useMemo(
    () => productCategory?.types?.find(t => t.id === typeId),
    [productCategory, typeId]
  );
  const variety = useMemo(
    () => productType?.varieties?.find(v => v.id === varietyId),
    [productType, varietyId]
  );

  const [selectedImage, setSelectedImage] = useState(
    variety?.images?.[0] || variety?.image || ""
  );
  const [selectedSize, setSelectedSize] = useState(null);
  const [crateQty, setCrateQty] = useState(0);
  const [pieceQty, setPieceQty] = useState(0);
  const [showWarning, setShowWarning] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // ✅ Handle "product not found" gracefully
  if (!productCategory || !productType || !variety) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        ❌ Product not found. Please check the URL or browse products.
      </div>
    );
  }

  const totalPieces =
    crateQty * (selectedSize?.piecesPerCrate || 0) + pieceQty;
  const totalWeight = totalPieces * (selectedSize?.weightPerPiece || 0);

  const actuallyAddToCart = () => {
    addToCart({
    id: variety.id,
    name: variety.name,
    image: selectedImage,
    selectedSizeId: selectedSize.size,
    crateQty,
    pieceQty,
    pricePerPiece: selectedSize.price,
    piecesPerCrate: selectedSize.piecesPerCrate,
    weightPerPiece: selectedSize.weightPerPiece,
    size: selectedSize.size,
  });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }
    setShowSizeError(false);

    if (totalWeight > 48000) {
      setShowConfirmModal(true);
      return;
    }

    actuallyAddToCart();
  };

  return (
    <div className="bg-white min-h-screen relative">
      <NavBar />

      {/* Floating dismissible warning */}
      {showWarning && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg flex items-center space-x-3 z-50">
          <span>⚠️ Shipping isn't possible for orders over 48,000 lbs.</span>
          <button
            onClick={() => setShowWarning(false)}
            className="text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Image Section */}
        <div>
          <img
            src={selectedImage}
            alt={variety.name}
            className="w-full h-[400px] object-cover rounded-lg"
          />
          <div className="flex mt-4 space-x-3">
            {[variety.image, ...(variety.images || [])]
              .filter(Boolean)
              .map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumb ${index}`}
                  onClick={() => setSelectedImage(img)}
                  className={`h-20 w-20 object-cover cursor-pointer border-2 rounded-md ${
                    selectedImage === img
                      ? "border-black"
                      : "border-gray-200"
                  }`}
                />
              ))}
          </div>
        </div>

        {/* Right: Info Section */}
        <div>
          <h1 className="text-2xl font-bold mb-4">{variety.name}</h1>

          {/* Size Options */}
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-4">Size options</h2>
            <div className="space-y-3">
              {variety.details?.sizeOptions?.map((option, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedSize(option)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedSize?.size === option.size
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">{option.size}</p>
                    <p className="text-sm font-medium">
                      ₹{option.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm italic text-gray-500">
                      Weight: {option.weightPerPiece} |{" "}
                      {option.piecesPerCrate} pieces/crate
                    </p>
                    <p className="text-sm text-gray-500">
                      Stock: {option.stock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Options */}
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-2">Purchase Options</h2>
            <div className="flex gap-8 text-sm">
              <div>
                <span className="font-medium">Buy by Crate</span>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() =>
                      setCrateQty(Math.max(crateQty - 1, 0))
                    }
                    className="px-2 border rounded"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={crateQty}
                    onChange={(e) =>
                      setCrateQty(Math.max(0, Number(e.target.value)))
                    }
                    min={0}
                    className="w-12 px-2 py-1 border rounded-md text-center"
                  />
                  <button
                    onClick={() => setCrateQty(crateQty + 1)}
                    className="px-2 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <span className="font-medium">Buy by Piece</span>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() =>
                      setPieceQty(Math.max(pieceQty - 1, 0))
                    }
                    className="px-2 border rounded"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={pieceQty}
                    onChange={(e) =>
                      setPieceQty(Math.max(0, Number(e.target.value)))
                    }
                    min={0}
                    className="w-12 px-2 py-1 border rounded-md text-center"
                  />
                  <button
                    onClick={() => setPieceQty(pieceQty + 1)}
                    className="px-2 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Size Error */}
          {showSizeError && (
            <p className="text-sm text-red-600 mb-3">
              Please select a size option before adding to cart.
            </p>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 rounded-md transition ${
              addedToCart
                ? "bg-green-600 hover:bg-green-700"
                : "bg-black hover:bg-gray-900 text-white"
            }`}
          >
            {addedToCart ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-4">
              ⚠️ Weight Limit Exceeded
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Your order exceeds 48,000 lbs. Shipping is not possible.
              Please arrange pickup.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  actuallyAddToCart();
                }}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
              >
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
