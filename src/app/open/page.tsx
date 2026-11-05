import type { Metadata } from "next";
import { OpenNow } from "@/components/OpenNow";
import { CHECKED } from "@/data/hours";

export const metadata: Metadata = { title: "What's open · BYUH Helper" };

export default function OpenPage() {
  const checked = new Date(`${CHECKED}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-6">
      <h1 className="text-3xl font-semibold tracking-tight">What&apos;s open now</h1>
      <OpenNow />
      <p className="text-xs text-zinc-500">
        Semester and holiday hours, checked {checked}. Breaks between semesters aren&apos;t included yet; tap a place for its own page.
      </p>
    </main>
  );
}
