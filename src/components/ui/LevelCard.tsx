const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-800",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    badge: "bg-green-100 text-green-800",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-800",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    badge: "bg-red-100 text-red-800",
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
      <p className="text-[#4a5568] text-sm leading-relaxed">{description}</p>
    </div>
  );
}
