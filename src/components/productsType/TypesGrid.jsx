import ProductTypeCard from "./ProductTypeCard";

export default function TypesGrid({ types, onCardClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-10 place-items-center">
      {types.map(type => (
        <ProductTypeCard key={type.id} type={type} onClick={() => onCardClick(type.id)} />
      ))}
    </div>
  );
}
