const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  blue: {
    bg: "bg-[#F5F8FF]",
    border: "border-[#EAF1FF]",
    text: "text-[#153373]",
    badge: "bg-[#EAF1FF] text-[#153373]",
  },
  green: {
    bg: "bg-[#FFF8EE]",
    border: "border-[#FFF2DC]",
    text: "text-[#0E2250]",
    badge: "bg-[#FFF2DC] text-[#7A4A08]",
  },
  amber: {
    bg: "bg-[#FFF2DC]",
    border: "border-[#F6C77A]",
    text: "text-[#7A4A08]",
    badge: "bg-[#FFF2DC] text-[#B87518]",
  },
  red: {
    bg: "bg-[#F5F8FF]",
    border: "border-[#EAF1FF]",
    text: "text-[#153373]",
    badge: "bg-[#EAF1FF] text-[#1D4395]",
  },
};

interface Props {
  title: string;
  ages: string;
  description: string;
  color: string;
  icon?: string;
  index?: number;
}

export default function LevelCard({ title, ages, description, color, icon, index = 0 }: Props) {
  const colors = colorMap[color] ?? colorMap.blue;
  return (
    <div
      className={`card-hover rounded-2xl p-6 border-2 ${colors.bg} ${colors.border} flex flex-col gap-3`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {icon && <div className="text-3xl">{icon}</div>}
      <div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colors.badge}`}>
          {ages}
        </span>
      </div>
      <h3 className={`text-xl font-bold ${colors.text}`}>{title}</h3>
      <p className="text-[#64748B] text-sm leading-relaxed">{description}</p>
    </div>
  );
}
