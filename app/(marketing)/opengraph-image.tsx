import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Lovdash — The Creator Operating System";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #be123c 100%)",
          position: "relative",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            zIndex: 1,
          }}
        >
          {/* Logo with heart icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Heart SVG */}
            <svg
              width="80"
              height="80"
              viewBox="0 0 100 100"
              fill="none"
              style={{ marginRight: 8 }}
            >
              <path
                d="M50 88C50 88 10 58 10 35C10 20 22 10 35 10C43 10 50 15 50 15C50 15 57 10 65 10C78 10 90 20 90 35C90 58 50 88 50 88Z"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M50 88L50 50"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>
            
            {/* Lovdash text */}
            <span
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: "white",
                letterSpacing: "-2px",
              }}
            >
              Lovdash
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.9)",
              letterSpacing: "0.5px",
            }}
          >
            The Creator Operating System
          </div>

          {/* Subtext */}
          <div
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.7)",
              marginTop: 8,
            }}
          >
            Upload once. Publish everywhere. Track everything.
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 32,
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: 16,
          }}
        >
          <span>AI-Powered</span>
          <span>•</span>
          <span>Multi-Platform</span>
          <span>•</span>
          <span>For Creators & Agencies</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
