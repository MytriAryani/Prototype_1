import { useState } from "react";

export default function PurchaseOptions({ purchaseOptions }) {
  const [selected, setSelected] = useState(purchaseOptions[0].type);
  const [qty, setQty] = useState(1);

  return (
    <div className="mt-6">
      <div className="mb-2 font-medium">Purchase Options:</div>
      <div className="flex gap-4 mb-4">
        {purchaseOptions.map(opt => (
          <label key={opt.type} className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="purchase"
              value={opt.type}
              checked={selected === opt.type}
              onChange={() => setSelected(opt.type)}
              className="accent-black"
            />
            <span className="text-sm">{opt.desc}</span>
          </label>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-3">
        <span>Quantity:</span>
        <button type="button" className="border px-2" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
        <span>{qty}</span>
        <button type="button" className="border px-2" onClick={() => setQty(q => q + 1)}>+</button>
      </div>
      <button className="mt-5 w-full bg-black text-white rounded py-3 font-semibold">Add to Cart</button>
    </div>
  );
}
