import type { Gender, ReferralSource } from "@prisma/client";

export const GENDER_LABELS: Record<Gender, string> = {
  MALE: "ذكر",
  FEMALE: "أنثى",
};

export const REFERRAL_LABELS: Record<ReferralSource, string> = {
  WEBSITE: "الموقع الإلكتروني",
  SOCIAL_MEDIA: "شبكات التواصل",
  FAMILY_FRIEND: "توصية من معارف",
  SCHOOL_EVENT: "نشاط أو يوم مفتوح",
  ADVERTISEMENT: "إعلان",
  OTHER: "مصدر آخر",
};
