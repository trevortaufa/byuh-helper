import { connection } from "next/server";
import { Suspense } from "react";
import { getWeeklyMenu, hawaiiWeekday, MENU_URL, type MenuDay } from "@/lib/menu";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <header>
        <p className="text-sm font-medium text-teal-700 dark:text-teal-400">BYUH Helper</p>
        <h1 className="text-3xl font-semibold tracking-tight">What&apos;s at the caf</h1>
      </header>
      <Suspense fallback={<p className="text-zinc-500">Loading the menu…</p>}>
        <Menu />
      </Suspense>
    </main>
  );
}

async function Menu() {
  // "Today" depends on when you open the app, so this part runs on every visit. The menu itself comes
  // from the hourly cache, so visits don't each hit BYUH's site.
  await connection();
  let week: MenuDay[];
  try {
    week = await getWeeklyMenu();
  } catch {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        Couldn&apos;t load the menu right now.{" "}
        <a href={MENU_URL} className="underline">
          See it on Food Services
        </a>
        .
      </p>
    );
  }

  const today = hawaiiWeekday();
  const todays = week.find((d) => d.key === today);
  const rest = week.filter((d) => d !== todays);

  return (
    <>
      {todays ? <Day day={todays} today /> : <p className="text-zinc-500">No menu posted for today.</p>}
      <details>
        <summary className="cursor-pointer text-sm font-medium text-zinc-600 dark:text-zinc-400">Rest of the week</summary>
        <div className="mt-4 flex flex-col gap-6">
          {rest.map((d) => (
            <Day key={d.key} day={d} />
          ))}
        </div>
      </details>
      <p className="text-xs text-zinc-500">
        From{" "}
        <a href={MENU_URL} className="underline">
          BYUH Food Services
        </a>
        . Salad bar, cereal, waffles, desserts, rice and drinks are out all day. Menu may change without notice.
      </p>
    </>
  );
}

function Day({ day, today = false }: { day: MenuDay; today?: boolean }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">
        {today && <span className="mr-2 rounded bg-teal-600 px-1.5 py-0.5 text-xs font-semibold uppercase text-white">Today</span>}
        {day.label}
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {day.meals.map((meal) => (
          <div key={meal.name} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <h3 className="font-medium">{meal.name}</h3>
            <ul className="mt-2 flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              {meal.dishes.map((dish) => (
                <li key={dish} className={dish === "Closed" ? "text-zinc-400" : ""}>
                  {dish}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
