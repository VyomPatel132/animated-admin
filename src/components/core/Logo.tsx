import LogoIcon from "./LogoIcon";
export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <LogoIcon />
      {!compact && (
        <span>
          aperture<span className="brand-dot">.</span>
        </span>
      )}
    </div>
  );
}
