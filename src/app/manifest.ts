import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/appIcon";

/** What makes the site installable: its name, icon, and that it opens full-screen like an app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BYUH Helper",
    short_name: "BYUH Helper",
    description: "The caf menu and what's open on campus at BYU–Hawaii",
    start_url: "/", // opens straight to today's caf menu
    display: "standalone", // no browser address bar
    background_color: "#0a0a0a",
    theme_color: BRAND,
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
