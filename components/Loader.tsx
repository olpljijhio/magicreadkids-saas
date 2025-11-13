"use client";
import { Loader2 } from "lucide-react";

export function Loader({ label = "Chargement..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      <span>{label}</span>
    </div>
  );
}