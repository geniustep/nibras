import Image from "next/image";
import Link from "next/link";

const LOGO_SRC = "/logo_nibrass.png";
const LOGO_ALT = "مدارس النبراس";

type BrandLogoProps = {
  href?: string | null;
  priority?: boolean;
  className?: string;
  height?: number;
};

export function BrandLogo({
  href = "/",
  priority = false,
  className = "",
  height = 44,
}: BrandLogoProps) {
  const image = (
    <Image
      src={LOGO_SRC}
      alt={LOGO_ALT}
      width={220}
      height={height}
      className={`w-auto object-contain ${className}`}
      style={{ height, width: "auto", maxWidth: 220 }}
      priority={priority}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {image}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 items-center">{image}</span>;
}
