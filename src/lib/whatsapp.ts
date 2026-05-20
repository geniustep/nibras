import { siteConfig } from "../../site.config";

const messages: Record<string, string> = {
  ar: "السلام عليكم، أود الحصول على معلومات حول التسجيل في مدارس النبراس.",
  fr: "Bonjour, je souhaite obtenir des informations concernant l'inscription à Madaris Nibras.",
  en: "Hello, I would like to get information about registration at Madaris Nibras.",
};

export function getWhatsAppUrl(locale: string): string {
  const message = messages[locale] ?? messages["ar"];
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}
