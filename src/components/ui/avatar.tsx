export function Avatar({
  initials,
  size = "normal",
  index = 0,
}: {
  initials: string;
  size?: "small" | "normal" | "large";
  index?: number;
}) {
  return (
    <span className={`avatar ${size} avatar-${index % 6}`}>{initials}</span>
  );
}