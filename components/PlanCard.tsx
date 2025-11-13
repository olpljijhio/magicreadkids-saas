"use client";

export function PlanCard({
  name,
  price,
  period = "mois",
  features = [],
  onSelect
}: {
  name: string;
  price: string;
  period?: string;
  features?: string[];
  onSelect?: () => void;
}) {
  return (
    <div className="rounded-2xl border p-6 shadow-sm bg-white flex flex-col gap-4">
      <div>
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-3xl font-extrabold mt-2">{price}<span className="text-base font-medium">/{period}</span></p>
      </div>
      <ul className="text-sm space-y-1">
        {features.map((f, i) => <li key={i}>• {f}</li>)}
      </ul>
      <button
        onClick={onSelect}
        className="mt-2 inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
      >
        Choisir
      </button>
    </div>
  );
}