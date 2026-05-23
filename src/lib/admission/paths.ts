export type AppLocale = "ar" | "fr" | "en";

export function getAdmissionPaths(locale: AppLocale) {
  return {
    intro: `/${locale}/admission/bidaya`,
    form: `/${locale}/admission`,
    success: `/${locale}/admission/najah`,
  } as const;
}
