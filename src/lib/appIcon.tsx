import { ImageResponse } from "next/og";

export const BRAND = "#0d9488"; // Tailwind teal-600, the app's accent colour

/**
 * The app icon, drawn at any size: "BYUH" in white on teal. Full-bleed (no rounded corners) because
 * phones cut their own shape out of it, and Android's "maskable" icons crop up to the outer 10%.
 */
export function appIcon(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND,
          color: "white",
          fontSize: size * 0.26,
          fontWeight: 700,
          letterSpacing: -size * 0.01,
        }}
      >
        BYUH
      </div>
    ),
    { width: size, height: size },
  );
}
