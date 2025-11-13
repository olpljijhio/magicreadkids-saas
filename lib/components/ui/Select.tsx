"use client";

import * as React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export function Select(props: SelectProps): JSX.Element {
  const { label, id, options, className, error, ...rest } = props;
  const selectId =
    id ?? (label ? `select-${label.replace(/\s+/g, "-")}` : undefined);

  const baseClasses =
    "block w-full rounded-xl border px-4 py-2 text-sm shadow-sm bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500";
  const errorClasses = error ? "border-red-500" : "border-gray-300";
  const classes = [baseClasses, errorClasses, className].filter(Boolean).join(" ");

  return (
    <div className="space-y-1 text-left">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-gray-800"
        >
          {label}
        </label>
      )}
      <select id={selectId} className={classes} {...rest}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
