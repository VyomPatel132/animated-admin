import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  ShoppingBag,
  Users,
  MousePointer2,
} from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedCounter, FadeUp } from "../core/Animation";
import { useAppSelector } from "../../hooks/useStore";
const stats = [
  {
    label: "Total revenue",
    value: 48295,
    prefix: "$",
    decimals: 2,
    change: "18.6%",
    detail: "vs. previous month",
    icon: DollarSign,
    graph: "0,31 10,28 20,32 30,21 40,24 50,16 60,20 70,8 80,13 90,3 100,7",
    featured: true,
  },
  {
    label: "Total orders",
    value: 1842,
    change: "12.8%",
    detail: "vs. previous month",
    icon: ShoppingBag,
    graph: "0,32 10,26 20,28 30,22 40,26 50,17 60,19 70,11 80,16 90,5 100,8",
  },
  {
    label: "Total customers",
    value: 12486,
    change: "9.4%",
    detail: "vs. previous month",
    icon: Users,
    graph: "0,33 10,30 20,26 30,29 40,22 50,19 60,24 70,12 80,16 90,8 100,3",
  },
  {
    label: "Conversion rate",
    value: 3.62,
    suffix: "%",
    decimals: 2,
    change: "0.4%",
    detail: "vs. previous month",
    icon: MousePointer2,
    graph: "0,12 10,8 20,14 30,9 40,18 50,13 60,24 70,18 80,25 90,21 100,28",
    negative: true,
  },
];
export default function StatCards() {
  const period = useAppSelector((s) => s.dashboard.period);
  const factor =
    period === "Last 7 days" ? 0.28 : period === "Last 90 days" ? 2.6 : 1;
  return (
    <div className="stat-grid">
      {stats.map((s, i) => (
        <FadeUp delay={0.05 + i * 0.06} key={s.label}>
          <motion.section
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className={`stat-card ${s.featured ? "featured" : ""}`}
          >
            <div className="stat-label">
              <span>{s.label}</span>
              <s.icon size={16} />
            </div>
            <div className="stat-value">
              <AnimatedCounter
                value={s.suffix ? s.value : Math.round(s.value * factor)}
                prefix={s.prefix}
                suffix={s.suffix}
                decimals={s.decimals}
              />
              <svg
                width="88"
                height="37"
                viewBox="0 0 100 40"
                fill="none"
                aria-hidden="true"
              >
                <motion.polyline
                  points={s.graph}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: i * 0.12 }}
                />
              </svg>
            </div>
            <div className="stat-foot">
              <span className={`stat-change ${s.negative ? "negative" : ""}`}>
                {s.negative ? (
                  <ArrowDownRight size={12} />
                ) : (
                  <ArrowUpRight size={12} />
                )}
                {s.change}
              </span>
              <span>{s.detail}</span>
            </div>
          </motion.section>
        </FadeUp>
      ))}
    </div>
  );
}
