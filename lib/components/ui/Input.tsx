"use client";

import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input(props: InputProps): JSX.Element {
  const { label, id, error, className, ...rest } = props;
  const inputId = id ?? (label ? `field-${label.replace(/\s+/g, "-")}` : undefined);

  const baseClasses =
    "block w-full rounded-xl border px-4 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500";
  const errorClasses = error ? "border-red-500" : "border-gray-300";
  const classes = [baseClasses, errorClasses, className].filter(Boolean).join(" ");

  return (
    <div className="space-y-1 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-800"
        >
          {label}
        </label>
      )}
      <input id={inputId} className={classes} {...rest} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
