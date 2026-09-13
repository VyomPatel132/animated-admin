import { lazy, Suspense, useState } from "react";
import { Globe2 } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Card } from "../ui/card";
import ErrorBoundary from "../root/ErrorBoundary";
const GlobeScene = lazy(() => import("./GlobeScene"));
export default function Geography() {
  const [view3d, setView3d] = useState(false);
  const reduced = useReducedMotion();
  return (
    <Card className="geography-card">
      <div className="card-heading">
        <div>
          <h2>A world of possibility</h2>
          <p>Your customers, across the globe.</p>
        </div>
        <button
          className="globe-toggle"
          aria-label="Toggle interactive globe"
          onClick={() => setView3d(!view3d)}
        >
          <Globe2 size={16} />
        </button>
      </div>
      <div className="geo-content">
        <div className="world-map">
          {view3d && !reduced && window.innerWidth > 768 ? (
            <ErrorBoundary>
              <Suspense
                fallback={<div className="skeleton" style={{ height: 150 }} />}
              >
                <GlobeScene />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <svg
              viewBox="0 0 440 210"
              aria-label="World map highlighting United States, United Kingdom, and Germany"
            >
              <defs>
                <pattern
                  id="dots"
                  width="7"
                  height="7"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="3" cy="3" r="1.55" fill="var(--map-dot)" />
                </pattern>
              </defs>
              <path
                d="m28 39 34-15 46 6 22 20 29 2-7 24-20 12-8 25-14 3-5-20-24-2-13-18-25 1-8-17-12-5Zm80 72 31 5 18 22-7 29-20 33-11-4-3-29-14-28Zm60-85 20-12 18 13-7 23-23 3Zm47 28 20-14 20 7 15-13 39-7 37 14 34-1 28 27-18 17-24-4-9 24-21-5-7 25-20-16-9-21-30-2-14-17-15 8-15-6Zm5 33 31-6 31 23-6 37-27 35-12-5-6-27-16-21Zm114 18 20 4 8 25-10 7-13-16Zm22 44 32-9 26 12-5 24-33 4-22-14Z"
                fill="url(#dots)"
              />
              <circle cx="96" cy="64" r="13" fill="#c1df9620" />
              <circle cx="96" cy="64" r="5" fill="#c1df96" />
              <circle cx="227" cy="55" r="10" fill="#b0a3d530" />
              <circle cx="227" cy="55" r="4" fill="#b0a3d5" />
              <circle cx="246" cy="59" r="4" fill="#9cae9a" />
              <path
                d="M100 62Q163 1 226 55"
                stroke="#bddd8a"
                strokeOpacity=".4"
                strokeDasharray="3 4"
                fill="none"
              />
            </svg>
          )}
        </div>
        <div className="country-list">
          {[
            { flag: "US", name: "United States", value: 48, color: "#c3e99b" },
            { flag: "GB", name: "United Kingdom", value: 24, color: "#a5a0ca" },
            { flag: "DE", name: "Germany", value: 16, color: "#7a9790" },
          ].map((c) => (
            <div className="country" key={c.name}>
              <div>
                <span className="country-code">{c.flag}</span>
                <span>{c.name}</span>
                <strong>{c.value}%</strong>
              </div>
              <div className="country-track">
                <span
                  style={{ width: `${c.value * 1.8}%`, background: c.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
