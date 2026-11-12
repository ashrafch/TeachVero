import { ImageResponse } from "next/og";
export const runtime = "nodejs";
export const alt = "TeachVero — Italian for your kind of life";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
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
      }}
    >
      <div style={{ fontSize: 40 }}>teachvero ✳</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 100,
          lineHeight: 1,
          fontFamily: "serif",
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
    size,
  );
}
