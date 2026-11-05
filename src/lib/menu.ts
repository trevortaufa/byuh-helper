import * as cheerio from "cheerio";
import { cacheLife } from "next/cache";

export const MENU_URL = "https://foodservices.byuh.edu/weekly-menu";

export interface Meal {
  name: string; // "Breakfast", "Lunch", "Dinner"
  dishes: string[]; // ["Closed"] when the meal isn't served
}

export interface MenuDay {
  key: string; // "monday": the page's id for the day, matched against today's weekday
  label: string; // "Monday, Nov 02"
  meals: Meal[];
}

/**
 * The Banyan Dining Hall's menu for the week, read from the Food Services page.
 *
 * Cached for about an hour: however many students open the app, BYUH's site sees roughly one request an
 * hour. A failed fetch throws and isn't cached, so the next visit tries again.
 */
export async function getWeeklyMenu(): Promise<MenuDay[]> {
  "use cache";
  cacheLife("hours");

  const res = await fetch(MENU_URL);
  if (!res.ok) throw new Error(`Food Services menu request failed (${res.status})`);
  const $ = cheerio.load(await res.text());

  // Each day is a tab panel; inside it, one card per meal, with the dishes split by <br>.
  return $(".TabModule-panel[data-tab-content]")
    .map((_, panel) => ({
      key: $(panel).attr("data-tab-content")!,
      label: $(panel).find(".list-title").first().text().trim(),
      meals: $(panel)
        .find(".list-items-item")
        .map((_, card) => {
          const description = $(card).find(".promo-description");
          description.find("br").replaceWith("\n");
          return {
            name: $(card).find(".promo-title").text().trim(),
            dishes: description.text().split("\n").map((d) => d.trim()).filter(Boolean),
          };
        })
        .get(),
    }))
    .get();
}

/** "monday" etc. in Hawaii time. Vercel's servers run on UTC, which is already tomorrow by 2 pm here. */
export function hawaiiWeekday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "Pacific/Honolulu" }).format(now).toLowerCase();
}
