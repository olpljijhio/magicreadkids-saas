"use client";

export function StoryCard({ title, content }: { title: string; content: string }) {
  return (
    <article className="rounded-xl border p-4 shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="prose prose-sm max-w-none whitespace-pre-wrap">{content}</div>
    </article>
  );
}