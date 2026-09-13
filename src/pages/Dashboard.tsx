import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Download,
  FileText,
  Plus,
  Sparkles,
} from "lucide-react";
import { FadeUp, PageTransition } from "../components/core/Animation";
import { Avatar } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Select } from "../components/ui/select";
import { Tabs } from "../components/ui/tabs";
import StatCards from "../components/custom/StatCards";
import {
  ActivityChart,
  RevenueChart,
  SalesChart,
} from "../components/custom/Charts";
import DataTable from "../components/custom/DataTable";
import Geography from "../components/custom/Geography";
import OrderModal from "../components/custom/OrderModal";
import ProductArt from "../components/custom/ProductArt";
import { useAppDispatch, useAppSelector } from "../hooks/useStore";
import { setPeriod } from "../store/slices/dashboardSlice";
import { activity, products } from "../data/mock";
import { currency, exportCsv } from "../utils/format";
export default function Dashboard({
  analytics = false,
}: {
  analytics?: boolean;
}) {
  const [tab, setTab] = useState("Overview");
  const [orderOpen, setOrderOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { orders, period } = useAppSelector((s) => s.dashboard);
  const user = useAppSelector((s) => s.auth.user);
  return (
    <PageTransition>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span className="live-dot" /> YOUR BUSINESS, AT A GLANCE
          </div>
          <h1>
            {analytics
              ? "Every number tells a story."
              : `Good morning, ${user.name.split(" ")[0]}`}{" "}
            {!analytics && <span className="greeting-spark">✳</span>}
          </h1>
          <p>
            {analytics
              ? "Go deeper into the moments that move your business forward."
              : "Here’s what’s happening with your business today."}
          </p>
        </div>
        <div className="heading-actions">
          <Button onClick={() => exportCsv(orders, "aperture-overview")}>
            <Download size={15} />
            Export
          </Button>
          <Button variant="primary" onClick={() => setOrderOpen(true)}>
            <Plus size={17} />
            Create order
          </Button>
        </div>
      </div>
      <div className="dashboard-toolbar">
        <Tabs
          tabs={["Overview", "Insights", "Activity"]}
          active={tab}
          onChange={setTab}
          id="dashboard-tabs"
        />
        <div className="period-control">
          <CalendarDays size={15} />
          <Select
            label="Date range"
            value={period}
            onChange={(v) => dispatch(setPeriod(v))}
            options={["Last 7 days", "Last 30 days", "Last 90 days"]}
          />
          <span className="period-compare">Compared to previous period</span>
        </div>
      </div>
      <StatCards />
      {tab === "Activity" ? (
        <div className="dashboard-secondary-grid">
          <FadeUp>
            <ActivityChart />
          </FadeUp>
          <FadeUp>
            <ActivityTimeline />
          </FadeUp>
        </div>
      ) : (
        <>
          <div className="dashboard-primary-grid">
            <FadeUp delay={0.18}>
              <RevenueChart extended={analytics} />
            </FadeUp>
            <FadeUp delay={0.24}>
              <SalesChart />
            </FadeUp>
          </div>
          {tab === "Insights" || analytics ? (
            <div className="dashboard-secondary-grid">
              <FadeUp>
                <ActivityChart />
              </FadeUp>
              <FadeUp>
                <Card className="insight-card">
                  <span className="insight-icon">
                    <Sparkles size={24} />
                  </span>
                  <span className="eyebrow">APERTURE INSIGHTS</span>
                  <h2>
                    Your next chapter
                    <br />
                    looks bright.
                  </h2>
                  <p>
                    Direct sales account for 42% of your revenue. Keep the
                    momentum going with a loyalty campaign for returning
                    customers.
                  </p>
                  <Link to="/customers" className="button primary">
                    Explore your customers <ArrowUpRight size={16} />
                  </Link>
                  <div className="insight-facts">
                    <span>
                      <strong>68%</strong>Returning customers
                    </span>
                    <span>
                      <strong>4.8 / 5</strong>Customer satisfaction
                    </span>
                  </div>
                </Card>
              </FadeUp>
            </div>
          ) : (
            <div className="dashboard-primary-grid">
              <FadeUp delay={0.28}>
                <Card className="transactions-card">
                  <div className="card-heading">
                    <div>
                      <h2>
                        Recent transactions{" "}
                        <span className="heading-count">{orders.length}</span>
                      </h2>
                      <p>The latest activity, all in one place.</p>
                    </div>
                    <Link className="text-link" to="/orders">
                      View all <ArrowUpRight size={14} />
                    </Link>
                  </div>
                  <DataTable rows={orders} compact />
                </Card>
              </FadeUp>
              <FadeUp delay={0.32}>
                <ActivityTimeline />
              </FadeUp>
            </div>
          )}
        </>
      )}
      <div className="dashboard-secondary-grid">
        <FadeUp>
          <Card className="products-card">
            <div className="card-heading">
              <div>
                <h2>Top products</h2>
                <p>The things your customers love.</p>
              </div>
              <Link className="text-link" to="/products">
                View products <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="top-product-labels">
              <span>Product</span>
              <span>Units sold</span>
              <span>Revenue</span>
            </div>
            {products.slice(0, 3).map((p) => (
              <Link to="/products" key={p.name} className="top-product">
                <ProductArt shape={p.shape} color={p.color} />
                <div>
                  <strong>{p.name}</strong>
                  <small>{p.category}</small>
                </div>
                <span>{p.sold}</span>
                <strong>{currency(p.sold * p.price, 0)}</strong>
              </Link>
            ))}
          </Card>
        </FadeUp>
        <FadeUp>
          <Geography />
        </FadeUp>
      </div>
      <FadeUp>
        <div className="dashboard-bottom-note">
          <span>
            <Sparkles size={15} /> A little clarity goes a long way. You’re
            doing great.
          </span>
          <Link to="/reports">
            Explore your reports <ArrowRight size={15} />
          </Link>
        </div>
      </FadeUp>
      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} />
    </PageTransition>
  );
}
function ActivityTimeline() {
  return (
    <Card className="activity-card">
      <div className="card-heading">
        <div>
          <h2>Activity feed</h2>
          <p>A pulse on your workspace.</p>
        </div>
        <span className="live-label">
          <i className="live-dot" /> Live
        </span>
      </div>
      <div className="activity-list">
        {activity.map((a, i) => (
          <div className="activity-item" key={a.name}>
            <div className="activity-avatar">
              {a.avatar ? (
                <Avatar initials={a.avatar} size="small" index={i} />
              ) : (
                <span className="report-avatar">
                  <FileText size={16} />
                </span>
              )}
              <span className="activity-check">
                <Check size={8} />
              </span>
            </div>
            <div>
              <p>
                <strong>{a.name}</strong> {a.action}
              </p>
              <span>{a.detail}</span>
              <small>{a.time}</small>
            </div>
          </div>
        ))}
      </div>
      <Link to="/events" className="activity-footer">
        View all activity <ArrowRight size={14} />
      </Link>
    </Card>
  );
}
