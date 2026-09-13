export default function ProductArt({
  shape,
  color = "#a99ec2",
  large = false,
}: {
  shape: string;
  color?: string;
  large?: boolean;
}) {
  return (
    <div
      className={`product-art ${large ? "large" : ""}`}
      style={{ background: `${color}18`, color }}
    >
      <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
        {shape === "headphones" ? (
          <>
            <path
              d="M21 46V35a19 19 0 0 1 38 0v11"
              stroke="currentColor"
              strokeWidth="6"
            />
            <rect
              x="17"
              y="38"
              width="12"
              height="24"
              rx="6"
              fill="currentColor"
            />
            <rect
              x="51"
              y="38"
              width="12"
              height="24"
              rx="6"
              fill="currentColor"
            />
            <path
              d="M25 30a15 15 0 0 1 30 0"
              stroke="white"
              strokeOpacity=".2"
              strokeWidth="2"
            />
          </>
        ) : shape === "keyboard" ? (
          <>
            <rect
              x="9"
              y="24"
              width="62"
              height="34"
              rx="5"
              fill="currentColor"
            />
            {Array.from({ length: 24 }, (_, i) => (
              <rect
                key={i}
                x={15 + (i % 8) * 6.5}
                y={30 + Math.floor(i / 8) * 7}
                width="4"
                height="4"
                rx="1"
                fill="#202522"
                opacity=".55"
              />
            ))}
            <rect
              x="29"
              y="51"
              width="25"
              height="3"
              rx="1"
              fill="#202522"
              opacity=".55"
            />
          </>
        ) : shape === "lamp" ? (
          <>
            <path
              d="M24 61h34M42 59V30M24 33h34L45 14h-9L24 33Z"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path d="M24 33h34L45 14h-9L24 33Z" fill="currentColor" />
            <ellipse
              cx="41"
              cy="36"
              rx="10"
              ry="3"
              fill="#f3d6a1"
              opacity=".45"
            />
          </>
        ) : shape === "chair" ? (
          <>
            <rect
              x="20"
              y="15"
              width="40"
              height="33"
              rx="11"
              fill="currentColor"
            />
            <rect
              x="16"
              y="41"
              width="48"
              height="15"
              rx="6"
              fill="currentColor"
            />
            <path
              d="m23 54-4 14m38-14 4 14"
              stroke="currentColor"
              strokeWidth="4"
            />
          </>
        ) : (
          <>
            <rect
              x="22"
              y="13"
              width="36"
              height="54"
              rx="12"
              fill="currentColor"
            />
            <circle cx="40" cy="44" r="12" fill="#262629" opacity=".4" />
            <circle cx="40" cy="44" r="7" stroke="currentColor" />
            <circle cx="40" cy="23" r="2" fill="#262629" />
          </>
        )}
      </svg>
    </div>
  );
}
