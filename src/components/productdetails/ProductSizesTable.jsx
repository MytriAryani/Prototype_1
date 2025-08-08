export default function ProductSizesTable({ sizeOptions }) {
  return (
    <table className="min-w-full border mt-6 text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-2 py-2">Size</th>
          <th>Weight</th>
          <th>Per Crate</th>
          <th>Price ($)</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>
        {sizeOptions.map((opt, idx) => (
          <tr key={idx}>
            <td className="px-2 py-2">{opt.size}</td>
            <td>{opt.weightPerPiece}</td>
            <td>{opt.piecesPerCrate}</td>
            <td>{opt.price}</td>
            <td>{opt.stock}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
