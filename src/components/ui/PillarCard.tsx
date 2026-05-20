interface Props {
  icon: string;
  title: string;
  description: string;
  index?: number;
}

export default function PillarCard({ icon, title, description, index = 0 }: Props) {
  return (
    <div
      className="card-hover bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm flex flex-col gap-3"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="text-4xl mb-1">{icon}</div>
      <h3 className="text-lg font-bold text-[#1a4a7a]">{title}</h3>
      <p className="text-[#4a5568] text-sm leading-relaxed">{description}</p>
    </div>
  );
}
