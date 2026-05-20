interface Props {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionTitle({
  title,
  subtitle,
  centered = true,
  light = false,
}: Props) {
  return (
    <div className={`mb-10 ${centered ? "text-center" : ""}`}>
      <h2
        className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-3 ${
          light ? "text-white" : "text-[#1a1a2e]"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base md:text-lg max-w-2xl ${
            centered ? "mx-auto" : ""
          } ${light ? "text-blue-100" : "text-[#4a5568]"}`}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`mt-4 h-1 w-16 rounded-full ${
          centered ? "mx-auto" : ""
        } bg-[#c9a227]`}
      />
    </div>
  );
}
