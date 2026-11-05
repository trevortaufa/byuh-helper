import type { Place, Weekday } from "@/data/hours";

const WEEK: Weekday[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export interface HawaiiTime {
  day: Weekday;
  minute: number; // minutes since midnight
}

export type Status =
  | { open: true; until: string; label?: string; only?: string }
  | { open: false; opens: { day: Weekday | "tomorrow" | null; at: string; only?: string } | null };

const minutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

/** The day and time in Hawaii, wherever the code runs (servers and some phones aren't on Hawaii time). */
export function hawaiiTime(date = new Date()): HawaiiTime {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Pacific/Honolulu",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: string) => parts.find((p) => p.type === type)!.value;
  return { day: part("weekday").toLowerCase() as Weekday, minute: Number(part("hour")) * 60 + Number(part("minute")) };
}

/** Whether a place is open at a moment, and until when — or when it next opens (null: never this week). */
export function statusAt(place: Place, now: HawaiiTime): Status {
  const today = place.week[now.day] ?? [];
  const i = today.findIndex((s) => minutes(s.from) <= now.minute && now.minute < minutes(s.to));
  if (i >= 0) {
    const slot = today[i];
    // Run on through back-to-back slots for the same people: Breakfast → Late breakfast → Lunch is one stretch.
    let until = slot.to;
    for (const next of today.slice(i + 1)) {
      if (next.from !== until || next.only !== slot.only) break;
      until = next.to;
    }
    return { open: true, until, label: slot.label, only: slot.only };
  }

  const later = today.find((s) => minutes(s.from) > now.minute);
  if (later) return { open: false, opens: { day: null, at: later.from, only: later.only } };
  const start = WEEK.indexOf(now.day);
  for (let ahead = 1; ahead <= 7; ahead++) {
    const day = WEEK[(start + ahead) % 7];
    const first = place.week[day]?.[0];
    if (first) return { open: false, opens: { day: ahead === 1 ? "tomorrow" : day, at: first.from, only: first.only } };
  }
  return { open: false, opens: null };
}

/** "07:00" → "7 am", "13:30" → "1:30 pm", "24:00" → "midnight". */
export function formatTime(t: string): string {
  const [h, m] = [Number(t.slice(0, 2)), t.slice(3)];
  if (h === 24 || (h === 0 && m === "00")) return "midnight";
  if (h === 12 && m === "00") return "noon";
  return `${h % 12 || 12}${m === "00" ? "" : `:${m}`} ${h < 12 ? "am" : "pm"}`;
}
