import { prisma } from "@/lib/prisma";

export async function generateTrackingNumber(): Promise<string> {
  const year = parseInt(process.env.TRACKING_YEAR ?? "2026", 10);

  const trackingNumber = await prisma.$transaction(async (tx) => {
    const counter = await tx.applicationCounter.upsert({
      where: { id: "default" },
      create: { id: "default", year, value: 0 },
      update: {},
    });

    let nextValue: number;

    if (counter.year !== year) {
      nextValue = 1;
      await tx.applicationCounter.update({
        where: { id: "default" },
        data: { year, value: nextValue },
      });
    } else {
      nextValue = counter.value + 1;
      await tx.applicationCounter.update({
        where: { id: "default" },
        data: { value: nextValue },
      });
    }

    const padded = String(nextValue).padStart(6, "0");
    return `NIB-${year}-${padded}`;
  });

  return trackingNumber;
}
