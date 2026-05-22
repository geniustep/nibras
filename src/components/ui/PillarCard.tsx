const accentColors = [
  "#1D4395",
  "#EEA748",
  "#1D4395",
  "#EEA748",
  "#1D4395",
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
      className="card-hover bg-white rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col gap-3 overflow-hidden"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Accent top bar */}
      <div className="h-1 w-full" style={{ backgroundColor: accent }} />
      <div className="px-5 pb-6 flex flex-col gap-3">
        <div className="text-3xl mt-1">{icon}</div>
        <h3 className="text-base font-bold text-[#1D4395]">{title}</h3>
        <p className="text-[#64748B] text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
