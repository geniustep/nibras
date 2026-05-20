interface Props {
  icon: string;
  title: string;
  description: string;
  index?: number;
}

export default function ActivityCard({ icon, title, description, index = 0 }: Props) {
  return (
    <div
      className="card-hover bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm flex flex-col items-center text-center gap-2"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="text-4xl mb-1">{icon}</div>
      <h3 className="text-base font-bold text-[#1a4a7a]">{title}</h3>
      <p className="text-[#4a5568] text-xs leading-relaxed">{description}</p>
    </div>
  );
}
