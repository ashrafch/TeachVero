import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
export const runtime = "nodejs";
export const alt = "TeachVero — Italian for your kind of life";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image() {
  const font = await readFile(
    join(process.cwd(), "src/app/fonts/serif-og.woff"),
  );
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: "#faf6ef",
        padding: 70,
        color: "#352137",
        fontFamily: "TeachVero Serif",
      }}
    >
      <div style={{ fontSize: 40 }}>teachvero</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 100,
          lineHeight: 1,
          fontFamily: "TeachVero Serif",
        }}
      >
        Italian for
        <br />
        your kind of life.
      </div>
      <div style={{ fontSize: 26, color: "#b83d2d" }}>
        Italian, personally. With Veronica.
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "TeachVero Serif", data: font, weight: 400, style: "normal" },
      ],
    },
  );
}
