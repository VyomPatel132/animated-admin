export default function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 29 15 7h6l10 22h-8l-5-12-5 12H5Z" fill="currentColor" />
      <path d="m11 23 7-5 7 5-7 5-7-5Z" fill="var(--sidebar, #161719)" />
      <rect x="15.5" y="22" width="5" height="5" rx="1" fill="currentColor" />
      <circle cx="29.5" cy="7.5" r="2.5" fill="currentColor" />
    </svg>
  );
}
