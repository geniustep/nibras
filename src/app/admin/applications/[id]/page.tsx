import { redirect } from "next/navigation";

export default async function LegacyApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/admissions/${id}`);
}
