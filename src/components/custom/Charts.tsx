import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { revenue } from "../../data/mock";
import { useAppSelector } from "../../hooks/useStore";
import { AnimatedCounter } from "../core/Animation";
import { Card } from "../ui/card";
const tooltipStyle = {
  backgroundColor: "var(--surface-raised)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  color: "var(--text)",
  fontSize: 12,
  boxShadow: "0 8px 30px #0003",
};
export function RevenueChart({ extended = false }: { extended?: boolean }) {
  const [metric, setMetric] = useState("Revenue");
  const period = useAppSelector((s) => s.dashboard.period);
  const days =
    period === "Last 7 days" ? 7 : period === "Last 90 days" ? 90 : 30;
  const multiplier = metric === "Orders" ? 0.03 : 1;
  const data = revenue
    .slice(days === 7 ? -7 : 0)
    .map((p) => ({
      ...p,
      current: Math.round(p.current * multiplier * (days === 90 ? 2.7 : 1)),
      previous: Math.round(p.previous * multiplier * (days === 90 ? 2.7 : 1)),
    }));
  return (
    <Card className={`revenue-card ${extended ? "extended-chart" : ""}`}>
      <div className="card-heading">
        <div>
          <h2>Revenue overview</h2>
          <p>A closer look at how your business is doing.</p>
        </div>
        <div className="chart-select">
          <select
            aria-label="Chart metric"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          >
            <option>Revenue</option>
            <option>Orders</option>
          </select>
          <ChevronDown size={13} />
        </div>
      </div>
      <div className="revenue-meta">
        <div className="revenue-total">
          <AnimatedCounter
            value={
              metric === "Revenue"
                ? days === 7
                  ? 12489
                  : days === 90
                    ? 124328
                    : 48295
                : days === 7
                  ? 342
                  : 1842
            }
            prefix={metric === "Revenue" ? "$" : ""}
            decimals={metric === "Revenue" ? 2 : 0}
          />
          <span className="positive">
            <ArrowUpRight size={13} />
            18.6%
          </span>
        </div>
        <div className="chart-legend">
          <span>
            <i className="legend-dot lime" />
            This period
          </span>
          <span>
            <i className="legend-dot gray" />
            Last period
          </span>
        </div>
      </div>
      <div className="revenue-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 12, right: 8, bottom: 0, left: -17 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c4ec88" stopOpacity={0.17} />
                <stop offset="100%" stopColor="#c4ec88" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="var(--chart-grid)"
              strokeDasharray="3 5"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              minTickGap={35}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              tickFormatter={(v) => `Sep ${v}`}
              dy={9}
            />
            <YAxis
              tickCount={5}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              tickFormatter={(v) =>
                metric === "Revenue" ? `$${v / 1000}k` : v
              }
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelFormatter={(v) => `September ${v}, 2026`}
              formatter={(v, name) => [
                metric === "Revenue"
                  ? `$${Number(v).toLocaleString()}`
                  : Number(v).toLocaleString(),
                name === "current" ? "This period" : "Last period",
              ]}
            />
            <Area
              type="monotone"
              dataKey="previous"
              stroke="#65676b"
              strokeWidth={1.5}
              strokeDasharray="4 5"
              fill="transparent"
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="current"
              stroke="#bddf8d"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              animationDuration={1400}
              activeDot={{
                r: 5,
                fill: "#c4ec88",
                stroke: "var(--surface)",
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-bottom">
        <span>
          <i className="live-dot" /> Revenue is trending above last month
        </span>
        <span>Updated just now</span>
      </div>
    </Card>
  );
}
export function SalesChart() {
  const [channel, setChannel] = useState<string | null>(null);
  const channels = [
    { name: "Direct", percent: 42, amount: "$20,283.90", color: "#c3e99b" },
    {
      name: "Organic search",
      percent: 28,
      amount: "$13,522.60",
      color: "#9e9acc",
    },
    { name: "Referral", percent: 18, amount: "$8,693.10", color: "#768f93" },
    {
      name: "Social media",
      percent: 12,
      amount: "$5,795.40",
      color: "#4a4b50",
    },
  ];
  let offset = 0;
  return (
    <Card className="sales-card">
      <div className="card-heading">
        <div>
          <h2>Sales by channel</h2>
          <p>Where your customers find you.</p>
        </div>
        <span className="small-label">30 days</span>
      </div>
      <div className="donut-wrap">
        <svg
          viewBox="0 0 220 180"
          className="donut"
          aria-label="Sales channels: Direct 42%, Organic 28%, Referral 18%, Social 12%"
        >
          <g transform="rotate(-90 110 96)">
            {channels.map((c) => {
              const start = offset;
              offset += c.percent;
              return (
                <circle
                  key={c.name}
                  cx="110"
                  cy="96"
                  r="67"
                  fill="none"
                  stroke={c.color}
                  strokeWidth={23}
                  strokeDasharray={`${c.percent * 4.21 - 4} ${421 - c.percent * 4.21 + 4}`}
                  strokeDashoffset={-start * 4.21}
                  opacity={channel && channel !== c.name ? 0.3 : 1}
                  className="donut-segment"
                />
              );
            })}
          </g>
          <text x="110" y="90" textAnchor="middle" className="donut-caption">
            {channel || "Total sales"}
          </text>
          <text x="110" y="116" textAnchor="middle" className="donut-number">
            {channel
              ? `${channels.find((c) => c.name === channel)?.percent}%`
              : "1,842"}
          </text>
        </svg>
        <span className="donut-growth">
          <ArrowUpRight size={12} /> 12.8% this month
        </span>
      </div>
      <div className="channel-list">
        {channels.map((c) => (
          <button
            key={c.name}
            onMouseEnter={() => setChannel(c.name)}
            onMouseLeave={() => setChannel(null)}
            onFocus={() => setChannel(c.name)}
            onBlur={() => setChannel(null)}
            onClick={() => setChannel(channel === c.name ? null : c.name)}
          >
            <i style={{ background: c.color }} />
            <span>{c.name}</span>
            <strong>{c.percent}%</strong>
            <small>{c.amount}</small>
          </button>
        ))}
      </div>
    </Card>
  );
}
export function ActivityChart() {
  return (
    <Card>
      <div className="card-heading">
        <div>
          <h2>Visitor activity</h2>
          <p>Engagement throughout the week</p>
        </div>
        <span className="positive">+9.4%</span>
      </div>
      <div style={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day, i) => ({
                day,
                visitors: [1400, 2100, 1800, 2700, 2200, 1600, 2350][i],
                returning: [700, 1100, 1000, 1500, 1300, 800, 1400][i],
              }),
            )}
          >
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
            <XAxis
              dataKey="day"
              tick={{ fill: "var(--muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: "var(--hover)" }}
            />
            <Bar
              dataKey="visitors"
              fill="#c3e99b"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />
            <Bar
              dataKey="returning"
              fill="#9e9acc"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
