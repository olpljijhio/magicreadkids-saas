"use client";

import * as React from "react";

export interface StoryCardProps {
  title: string;
  content: string;
  createdAt?: string | Date;
}

export function StoryCard(props: StoryCardProps): JSX.Element {
  const { title, content, createdAt } = props;

  let dateLabel: string | null = null;
  if (createdAt) {
    const d = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
    if (!Number.isNaN(d.getTime())) {
      dateLabel = d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  }

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <header className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {dateLabel && (
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {dateLabel}
          </span>
        )}
      </header>
      <div className="prose prose-sm max-w-none whitespace-pre-line text-gray-800">
        {content}
      </div>
    </article>
  );
}
