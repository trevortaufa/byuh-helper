import { HOLIDAYS, type Place, type Slot, type Weekday } from "@/data/hours";

const WEEK: Weekday[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export interface HawaiiTime {
  date: string; // "2026-11-26"
  minute: number; // minutes since midnight
}

type Opens = { day: Weekday | "tomorrow" | null; at: string; only?: string } | null;

export type Status =
  | { state: "open"; until: string; label?: string; only?: string; holiday?: string }
  | { state: "closed"; opens: Opens; holiday?: string }
  | { state: "unknown"; holiday: string }; // a holiday the place hasn't posted hours for

const minutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

// Dates are handled as plain "YYYY-MM-DD" strings at UTC midnight, so adding a day never trips over time zones.
const weekdayOf = (date: string) => WEEK[new Date(`${date}T00:00:00Z`).getUTCDay()];
const addDays = (date: string, n: number) => new Date(Date.parse(`${date}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

/** The date and time in Hawaii, wherever the code runs (servers and some phones aren't on Hawaii time). */
export function hawaiiTime(at = new Date()): HawaiiTime {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Pacific/Honolulu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(at);
  const part = (type: string) => parts.find((p) => p.type === type)!.value;
  return { date: `${part("year")}-${part("month")}-${part("day")}`, minute: Number(part("hour")) * 60 + Number(part("minute")) };
}

/** A place's hours on one date: one-off dates first, then holidays, then its usual week. null = holiday, hours not posted. */
export function slotsOn(place: Place, date: string): Slot[] | null {
  if (place.dates?.[date]) return place.dates[date];
  if (HOLIDAYS[date]) return place.holidays === "closed" ? [] : (place.holidays ?? null);
  return place.week[weekdayOf(date)] ?? [];
}

/** Whether a place is open at a moment, and until when — or when it next opens (null: not within a week). */
export function statusAt(place: Place, now: HawaiiTime): Status {
  const holiday = HOLIDAYS[now.date];
  const today = slotsOn(place, now.date);
  if (today === null) return { state: "unknown", holiday };

  const i = today.findIndex((s) => minutes(s.from) <= now.minute && now.minute < minutes(s.to));
  if (i >= 0) {
    const slot = today[i];
    // Run on through back-to-back slots for the same people: Breakfast → Late breakfast → Lunch is one stretch.
    let until = slot.to;
    for (const next of today.slice(i + 1)) {
      if (next.from !== until || next.only !== slot.only) break;
      until = next.to;
    }
    return { state: "open", until, label: slot.label, only: slot.only, holiday };
  }

  const later = today.find((s) => minutes(s.from) > now.minute);
  if (later) return { state: "closed", opens: { day: null, at: later.from, only: later.only }, holiday };
  for (let ahead = 1; ahead <= 7; ahead++) {
    const date = addDays(now.date, ahead);
    const slots = slotsOn(place, date);
    if (slots === null) break; // a holiday with no posted hours: don't promise a time
    if (slots[0]) {
      return { state: "closed", opens: { day: ahead === 1 ? "tomorrow" : weekdayOf(date), at: slots[0].from, only: slots[0].only }, holiday };
    }
  }
  return { state: "closed", opens: null, holiday };
}

/** "07:00" → "7 am", "13:30" → "1:30 pm", "24:00" → "midnight". */
export function formatTime(t: string): string {
  const [h, m] = [Number(t.slice(0, 2)), t.slice(3)];
  if (h === 24 || (h === 0 && m === "00")) return "midnight";
  if (h === 12 && m === "00") return "noon";
  return `${h % 12 || 12}${m === "00" ? "" : `:${m}`} ${h < 12 ? "am" : "pm"}`;
}
