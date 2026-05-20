const accentColors = [
  "#1a4a7a",
  "#c9a227",
  "#1a4a7a",
  "#c9a227",
  "#1a4a7a",
];

interface Props {
  icon: string;
  title: string;
  description: string;
  index?: number;
}

export default function PillarCard({ icon, title, description, index = 0 }: Props) {
  const accent = accentColors[index % accentColors.length];

  return (
    <div
      className="card-hover bg-white rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col gap-3 overflow-hidden"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Accent top bar */}
      <div className="h-1 w-full" style={{ backgroundColor: accent }} />
      <div className="px-5 pb-6 flex flex-col gap-3">
        <div className="text-3xl mt-1">{icon}</div>
        <h3 className="text-base font-bold text-[#1a4a7a]">{title}</h3>
        <p className="text-[#4a5568] text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
