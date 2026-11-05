"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Caf menu" },
  { href: "/open", label: "Open now" },
];

export function Nav() {
  const path = usePathname();
  return (
    <nav className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-3">
        <span className="mr-auto text-sm font-semibold text-teal-700 dark:text-teal-400">BYUH Helper</span>
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={path === href ? "page" : undefined}
            className="text-sm text-zinc-600 hover:text-black aria-[current=page]:font-semibold aria-[current=page]:text-black dark:text-zinc-400 dark:hover:text-white dark:aria-[current=page]:text-white"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
