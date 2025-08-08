export default function ProductImages({ mainImage, thumbnails }) {
  return (
    <div>
      <img src={mainImage} alt="Main Product" className="w-96 h-96 object-cover rounded-lg"/>
      <div className="flex gap-2 mt-3">
        {thumbnails.map((thumb, i) => (
          <img key={i} src={thumb} alt="" className="w-16 h-16 rounded object-cover"/>
        ))}
      </div>
    </div>
  );
}
