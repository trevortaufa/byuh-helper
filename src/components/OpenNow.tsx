"use client";

import { useSyncExternalStore } from "react";
import { PLACES, type Place } from "@/data/hours";
import { formatTime, hawaiiTime, statusAt, type Status } from "@/lib/hours";

// The current minute, so the list re-checks itself while the page stays open. On the server there's no
// "now" worth trusting (the page may be served from a cache), so it renders a placeholder and the
// browser fills in the real times once it loads.
const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, 15_000);
  return () => clearInterval(id);
};
const currentMinute = () => Math.floor(Date.now() / 60_000);
const noMinuteOnServer = () => null;

export function OpenNow() {
  const minute = useSyncExternalStore(subscribe, currentMinute, noMinuteOnServer);
  if (minute === null) return <p className="text-zinc-500">Checking what&apos;s open…</p>;

  const now = hawaiiTime(new Date(minute * 60_000));
  const rows = PLACES.map((place) => ({ place, status: statusAt(place, now) }));
  // Open places first, in the order they're listed; closed ones after.
  rows.sort((a, b) => Number(b.status.open) - Number(a.status.open));

  return (
    <ul className="flex flex-col gap-3">
      {rows.map(({ place, status }) => (
        <Row key={place.id} place={place} status={status} />
      ))}
    </ul>
  );
}

function Row({ place, status }: { place: Place; status: Status }) {
  return (
    <li className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex items-baseline justify-between gap-3">
        <a href={place.url} className="font-medium hover:underline">
          {place.name}
        </a>
        <span className="text-xs text-zinc-500">{place.group}</span>
      </div>
      <p className={`mt-1 text-sm font-medium ${status.open ? (status.only ? "text-amber-600 dark:text-amber-400" : "text-teal-600 dark:text-teal-400") : "text-zinc-500"}`}>
        {describe(status)}
      </p>
      {(place.note || place.phone) && (
        <p className="mt-1 text-xs text-zinc-500">
          {place.note}
          {place.note && place.phone && " "}
          {place.phone && (
            <a href={`tel:${place.phone.replace(/\D/g, "")}`} className="underline">
              {place.phone}
            </a>
          )}
        </p>
      )}
    </li>
  );
}

function describe(status: Status): string {
  if (status.open) {
    const who = status.only ? `${status.only} only` : "Open";
    const what = status.label ? ` · ${status.label}` : "";
    return `${who} until ${formatTime(status.until)}${what}`;
  }
  if (!status.opens) return "Closed";
  const { day, at, only } = status.opens;
  const when = day === null ? "" : day === "tomorrow" ? " tomorrow" : ` ${day[0].toUpperCase()}${day.slice(1)}`;
  return `Closed · opens${when} ${formatTime(at)}${only ? ` (${only} only)` : ""}`;
}
