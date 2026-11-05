import { appIcon } from "@/lib/appIcon";

// iPhones ignore the manifest's icons and use this one for "Add to Home Screen".
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return appIcon(180);
}
