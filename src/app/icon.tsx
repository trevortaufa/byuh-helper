import { appIcon } from "@/lib/appIcon";

// Served at /icon/32, /icon/192 and /icon/512: the browser tab, and the two sizes Android needs to install.
const SIZES = [32, 192, 512];

export function generateImageMetadata() {
  return SIZES.map((size) => ({ id: String(size), size: { width: size, height: size }, contentType: "image/png" }));
}

export default async function Icon({ id }: { id: Promise<string> }) {
  return appIcon(Number(await id));
}
