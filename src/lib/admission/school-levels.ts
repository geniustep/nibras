import type { CommonCoreTrack, SchoolCycle, SchoolLevel } from "@prisma/client";

export const CYCLE_LABELS: Record<SchoolCycle, string> = {
  EARLY_CHILDHOOD: "مرحلة الطفولة المبكرة والتعليم الأولي",
  PRIMARY: "التعليم الابتدائي",
  MIDDLE_SCHOOL: "التعليم الإعدادي",
  HIGH_SCHOOL: "التعليم الثانوي التأهيلي",
};

export const LEVEL_LABELS: Record<SchoolLevel, string> = {
  AGE_3: "قسم 3 سنوات / Petite Section",
  AGE_4: "قسم 4 سنوات / Moyenne Section",
  AGE_5: "قسم 5 سنوات / Grande Section",
  PRIMARY_1: "الأول ابتدائي / 1ère Année Primaire",
  PRIMARY_2: "الثاني ابتدائي / 2ème Année Primaire",
  PRIMARY_3: "الثالث ابتدائي / 3ème Année Primaire",
  PRIMARY_4: "الرابع ابتدائي / 4ème Année Primaire",
  PRIMARY_5: "الخامس ابتدائي / 5ème Année Primaire",
  PRIMARY_6: "السادس ابتدائي / 6ème Année Primaire",
  MIDDLE_1: "الأولى إعدادي / 1ère Année Collège",
  MIDDLE_2: "الثانية إعدادي / 2ème Année Collège",
  MIDDLE_3: "الثالثة إعدادي / 3ème Année Collège",
  COMMON_CORE: "الجذع المشترك / Tronc Commun",
};

export const TRACK_LABELS: Record<CommonCoreTrack, string> = {
  SCIENTIFIC: "الجذع المشترك العلمي / Tronc Commun Scientifique",
  LITERARY: "الجذع المشترك الأدبي / Tronc Commun Lettres",
  TECHNOLOGICAL: "الجذع المشترك التكنولوجي / Tronc Commun Technologique",
};

export const LEVELS_BY_CYCLE: Record<SchoolCycle, SchoolLevel[]> = {
  EARLY_CHILDHOOD: ["AGE_3", "AGE_4", "AGE_5"],
  PRIMARY: [
    "PRIMARY_1",
    "PRIMARY_2",
    "PRIMARY_3",
    "PRIMARY_4",
    "PRIMARY_5",
    "PRIMARY_6",
  ],
  MIDDLE_SCHOOL: ["MIDDLE_1", "MIDDLE_2", "MIDDLE_3"],
  HIGH_SCHOOL: ["COMMON_CORE"],
};

export const ALL_CYCLES = Object.keys(CYCLE_LABELS) as SchoolCycle[];
export const ALL_LEVELS = Object.keys(LEVEL_LABELS) as SchoolLevel[];
export const ALL_TRACKS = Object.keys(TRACK_LABELS) as CommonCoreTrack[];

export function isCommonCoreLevel(level: SchoolLevel): boolean {
  return level === "COMMON_CORE";
}

export function levelBelongsToCycle(
  cycle: SchoolCycle,
  level: SchoolLevel
): boolean {
  return LEVELS_BY_CYCLE[cycle].includes(level);
}

export function formatSchoolSelection(
  cycle: SchoolCycle,
  level: SchoolLevel,
  track?: CommonCoreTrack | null
): string {
  const parts = [LEVEL_LABELS[level], `(${CYCLE_LABELS[cycle]})`];
  if (track && isCommonCoreLevel(level)) {
    parts.push(`— ${TRACK_LABELS[track]}`);
  }
  return parts.join(" ");
}

export function formatSchoolSelectionShort(
  level: SchoolLevel,
  track?: CommonCoreTrack | null
): string {
  if (track && isCommonCoreLevel(level)) {
    return `${LEVEL_LABELS[level]} — ${TRACK_LABELS[track]}`;
  }
  return LEVEL_LABELS[level];
}
