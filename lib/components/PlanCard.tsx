"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

export interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  description?: string;
  features: string[];
  onSelect: () => void;
  popular?: boolean;
}

export function PlanCard(props: PlanCardProps): JSX.Element {
  const { name, price, period, description, features, onSelect, popular } = props;

  return (
    <div
      className={[
        "flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-transform",
        popular ? "border-purple-500 shadow-md scale-[1.02]" : "border-gray-200",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {popular && (
        <div className="mb-3 inline-flex items-center self-start rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
          Populaire
        </div>
      )}
      <h3 className="text-lg font-bold text-gray-900">{name}</h3>
      <p className="mt-1 text-3xl font-extrabold text-gray-900">
        {price}
        <span className="ml-1 text-sm font-medium text-gray-500">/ {period}</span>
      </p>
      {description && (
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      )}
      <ul className="mt-4 flex-1 space-y-2 text-sm text-gray-700">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-xs text-purple-700">
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Button
          type="button"
          variant={popular ? "primary" : "secondary"}
          className="w-full"
          onClick={onSelect}
        >
          Choisir cette formule
        </Button>
      </div>
    </div>
  );
}
