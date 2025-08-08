import VarietyCard from "./VarietyCard";

export default function VarietiesGrid({ varieties, onCardClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
      {varieties.map(variety => (
        <VarietyCard key={variety.id} variety={variety} onViewProduct={() => onCardClick(variety.id)} />
      ))}
    </div>
  );
}
