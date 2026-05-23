import { redirect } from "next/navigation";

export default async function LegacyApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  Object.entries(sp).forEach(([k, v]) => {
    if (v) q.set(k, v);
  });
  const suffix = q.toString() ? `?${q.toString()}` : "";
  redirect(`/admin/admissions${suffix}`);
}
