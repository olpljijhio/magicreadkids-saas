"use client";

import * as React from "react";

export function Loader(): JSX.Element {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-400 border-t-transparent" />
    </div>
  );
}
