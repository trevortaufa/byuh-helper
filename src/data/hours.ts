/**
 * Campus opening hours, copied by hand from each place's page (checked against the pages on CHECKED).
 *
 * Hand-copied on purpose: hours change about once a semester, every page is laid out differently, and some
 * have typos (the Fitness Center lists "1 am - 5 pm" for 1 pm). Re-check the links at the start of each
 * semester and update CHECKED.
 *
 * Times are 24-hour "HH:MM" in Hawaii time; "24:00" is midnight at the end of the day. A slot with `only`
 * is open to just that group. Gaps between slots are closed (cleaning, classes, devotional).
 */

export const CHECKED = "2026-11-04";

export type Weekday = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";

export interface Slot {
  from: string;
  to: string;
  label?: string; // what's on during the slot, e.g. "Breakfast"
  only?: string; // e.g. "Faculty": open, but not to everyone
}

export interface Place {
  id: string;
  name: string;
  group: "Food" | "Study" | "Fitness" | "Shopping" | "Health";
  url: string;
  phone?: string;
  note?: string;
  week: Partial<Record<Weekday, Slot[]>>; // a missing day is closed all day
  /** Hours on every date in HOLIDAYS. Left out when the place doesn't post any, so the app says so instead of guessing. */
  holidays?: Slot[] | "closed";
  /** One-off dates that beat everything else; [] is closed. */
  dates?: Record<string, Slot[]>;
}

/** School holidays for the rest of this academic year (YYYY-MM-DD in Hawaii). Re-check each semester. */
export const HOLIDAYS: Record<string, string> = {
  "2026-11-26": "Thanksgiving",
  "2026-11-27": "Day after Thanksgiving",
  "2026-12-24": "Christmas Eve",
  "2026-12-25": "Christmas",
  "2026-12-31": "New Year's Eve",
  "2027-01-01": "New Year's Day",
};

const days = (names: Weekday[], slots: Slot[]) => Object.fromEntries(names.map((d) => [d, slots]));
const WEEKDAYS: Weekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];

export const PLACES: Place[] = [
  {
    id: "banyan",
    name: "Banyan Dining Hall",
    group: "Food",
    url: "https://foodservices.byuh.edu/banyan-dining-hall",
    note: "Fast Sunday: dinner only, 5–7 pm.",
    week: {
      ...days(WEEKDAYS, [
        { from: "07:00", to: "10:00", label: "Breakfast" },
        { from: "10:00", to: "11:00", label: "Late breakfast" },
        { from: "11:00", to: "14:00", label: "Lunch" },
        { from: "16:00", to: "20:00", label: "Dinner" },
      ]),
      saturday: [
        { from: "09:00", to: "13:00", label: "Brunch" },
        { from: "16:00", to: "20:00", label: "Dinner" },
      ],
      sunday: [
        { from: "11:00", to: "13:30", label: "Lunch" },
        { from: "16:00", to: "18:30", label: "Dinner" },
      ],
    },
    holidays: [
      { from: "08:00", to: "10:00", label: "Breakfast" },
      { from: "10:00", to: "11:00", label: "Late breakfast" },
      { from: "11:00", to: "14:00", label: "Lunch" },
      { from: "16:00", to: "20:00", label: "Dinner" },
    ],
  },
  {
    id: "library",
    name: "Joseph F. Smith Library",
    group: "Study",
    url: "https://library.byuh.edu/hours-of-the-library",
    phone: "(808) 675-3876",
    note: "Needs a current BYUH ID. Closed for devotional.",
    week: {
      ...days(["monday", "wednesday", "thursday"], [{ from: "07:00", to: "24:00" }]),
      tuesday: [
        { from: "07:00", to: "11:00" },
        { from: "12:00", to: "24:00" },
      ],
      friday: [{ from: "07:00", to: "20:00" }],
      saturday: [{ from: "09:00", to: "15:00" }],
    },
    holidays: "closed",
    dates: {
      "2026-11-27": [{ from: "09:00", to: "17:00" }],
      "2026-12-11": [{ from: "12:00", to: "17:00", label: "Graduation day" }],
    },
  },
  {
    id: "fitness-center",
    name: "Fitness Center",
    group: "Fitness",
    url: "https://seasidersports.byuh.edu/fitness-center",
    phone: "(808) 675-3715",
    note: "Closed 8–9 am for cleaning. Classes may be in the room 9–11 am.",
    week: {
      ...days(["monday", "wednesday"], [
        { from: "05:00", to: "08:00" },
        { from: "09:00", to: "11:00" },
        { from: "12:00", to: "13:00", only: "Faculty" },
        { from: "13:00", to: "17:00" },
        { from: "17:00", to: "18:30", only: "Men" },
        { from: "18:30", to: "22:00" },
      ]),
      ...days(["tuesday", "thursday"], [
        { from: "05:00", to: "08:00" },
        { from: "09:00", to: "11:00" },
        { from: "12:00", to: "13:00", only: "Faculty" },
        { from: "13:00", to: "17:00" },
        { from: "17:00", to: "18:30", only: "Women" },
        { from: "18:30", to: "22:00" },
      ]),
      friday: [
        { from: "05:00", to: "08:00" },
        { from: "09:00", to: "12:00" },
        { from: "12:00", to: "13:00", only: "Faculty" },
        { from: "15:00", to: "22:00" },
      ],
      saturday: [{ from: "06:00", to: "12:00" }],
    },
  },
  {
    id: "cardio-room",
    name: "Cardio Room",
    group: "Fitness",
    url: "https://seasidersports.byuh.edu/fitness-center",
    week: {
      ...days(["monday", "wednesday", "thursday", "friday"], [
        { from: "05:00", to: "08:00" },
        { from: "09:00", to: "22:00" },
      ]),
      tuesday: [
        { from: "05:00", to: "08:00" },
        { from: "09:00", to: "11:00" },
        { from: "12:00", to: "22:00" },
      ],
      saturday: [{ from: "06:00", to: "12:00" }],
    },
  },
  {
    id: "fitness-studio",
    name: "Fitness Studio",
    group: "Fitness",
    url: "https://seasidersports.byuh.edu/fitness-center",
    week: {
      ...days(["monday", "wednesday", "thursday", "friday"], [
        { from: "05:00", to: "14:00" },
        { from: "15:00", to: "22:00" },
      ]),
      tuesday: [
        { from: "05:00", to: "11:00" },
        { from: "12:00", to: "14:00" },
        { from: "15:00", to: "22:00" },
      ],
      saturday: [{ from: "06:00", to: "12:00" }],
    },
  },
  {
    id: "byuh-store",
    name: "BYU–Hawaii Store",
    group: "Shopping",
    url: "https://bookstore.byuh.edu/contact-us",
    phone: "(808) 675-3563",
    week: {
      ...days(["monday", "wednesday", "thursday", "friday"], [{ from: "09:00", to: "17:00" }]),
      tuesday: [
        { from: "09:00", to: "10:45" },
        { from: "12:00", to: "17:00" },
      ],
    },
    holidays: "closed",
  },
  {
    id: "shore-mini-mart",
    name: "The Shore Mini Mart",
    group: "Shopping",
    url: "https://bookstore.byuh.edu/contact-us",
    week: {
      ...days(["monday", "wednesday", "thursday", "friday", "saturday"], [{ from: "07:00", to: "23:00" }]),
      tuesday: [
        { from: "07:00", to: "10:45" },
        { from: "12:00", to: "23:00" },
      ],
    },
    holidays: "closed",
  },
  {
    id: "health-center",
    name: "Health Center",
    group: "Health",
    url: "https://healthservices.byuh.edu",
    phone: "(808) 675-3510",
    note: "Appointments by phone. After hours: Campus Security (808) 675-3911. Emergencies: 911.",
    week: {
      ...days(["monday", "tuesday", "thursday", "friday"], [
        { from: "08:00", to: "12:00" },
        { from: "14:00", to: "16:45" },
      ]),
      wednesday: [{ from: "08:00", to: "12:00" }],
    },
    holidays: "closed",
  },
];
