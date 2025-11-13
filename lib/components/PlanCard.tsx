import { Button } from "./ui/Button";

interface PlanCardProps {
  name: string;
  price: string;
  features: string[];
  onSelect: () => void;
  popular?: boolean;
}

export function PlanCard({ name, price, features, onSelect, popular = false }: PlanCardProps) {
  return (
    <div className={`bg-white p-8 rounded-2xl shadow-xl border-2 ${
      popular ? "border-purple-500" : "border-gray-200"
    }`}>
      {popular && (
        <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
          Populaire
        </span>
      )}
      <h3 className="text-2xl font-bold mt-4">{name}</h3>
      <p className="text-4xl font-extrabold mt-4">{price}</p>
      <ul className="mt-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <Button onClick={onSelect} className="w-full mt-8">
        Choisir ce plan
      </Button>
    </div>
  );
}
