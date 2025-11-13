"use client";

import React from "react";

export function PricingCard({
  title,
  price,
  period,
  features,
  onSelect,
  cta = "Choisir",
  highlight = false,
  badge,
  note,
}: {
  title: string;
  price: string;
  period?: string;
  features: string[];
  onSelect: () => void;
  cta?: string;
  highlight?: boolean;
  badge?: string;
  note?: string;
}) {
  return (
    <div
      className={[
        "relative rounded-3xl p-6 md:p-8 bg-white shadow-sm hover:shadow-md transition",
        highlight ? "ring-2 ring-[#c471ed] scale-[1.01]" : ""
      ].join(" ")}
    >
      {highlight && badge && (
        <div className="absolute -top-3 right-5">
          <span className="rounded-full px-3 py-1 text-xs font-bold bg-yellow-300 text-gray-900 shadow">
            {badge}
          </span>
        </div>
      )}
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-extrabold">{title}</h3>
        {note && <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{note}</span>}
      </div>

      <div className="mt-4 flex items-end gap-2">
        <div className="text-4xl md:text-5xl font-extrabold">{price}</div>
        {period && <div className="text-gray-500 mb-2">{period}</div>}
      </div>

      <ul className="mt-6 space-y-3 text-gray-700">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1">✅</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className={[
          "mt-8 w-full rounded-full px-5 py-3 font-semibold transition shadow",
          highlight
            ? "text-white bg-gradient-to-r from-[#c471ed] to-[#f64f59] hover:opacity-95"
            : "bg-gray-900 text-white hover:bg-gray-800"
        ].join(" ")}
      >
        {cta}
      </button>
    </div>
  );
}