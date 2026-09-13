import { motion } from "framer-motion";

export function Tabs({
  tabs,
  active,
  onChange,
  id = "tabs",
}: {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
  id?: string;
}) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          role="tab"
          aria-selected={active === tab}
          className={active === tab ? "active" : ""}
          key={tab}
          onClick={() => onChange(tab)}
        >
          {tab}
          {active === tab && <motion.span className="tab-line" layoutId={id} />}
        </button>
      ))}
    </div>
  );
}