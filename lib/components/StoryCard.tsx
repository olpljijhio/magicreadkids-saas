interface StoryCardProps {
  title: string;
  content: string;
  createdAt?: string;
}

export function StoryCard({ title, content, createdAt }: StoryCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-200">
      <h3 className="text-2xl font-bold mb-4 text-purple-700">{title}</h3>
      <div className="prose max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
      </div>
      {createdAt && (
        <p className="text-sm text-gray-500 mt-4">
          Créée le {new Date(createdAt).toLocaleDateString("fr-FR")}
        </p>
      )}
    </div>
  );
}
