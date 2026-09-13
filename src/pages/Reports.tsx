import { useState } from "react";
import { ArrowDownToLine, FileChartColumn, Plus } from "lucide-react";
import { FadeUp, PageTransition } from "../components/core/Animation";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { Modal } from "../components/ui/modal";
import { SearchInput } from "../components/ui/search-input";
import { useAppDispatch, useAppSelector } from "../hooks/useStore";
import { exportCsv } from "../utils/format";
import { notify } from "../store/slices/uiSlice";
export default function Reports() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [reports, setReports] = useState([
    {
      name: "September revenue overview",
      category: "Revenue",
      date: "Sep 13, 2026",
    },
    {
      name: "August monthly performance",
      category: "Performance",
      date: "Sep 01, 2026",
    },
    {
      name: "Customer growth report",
      category: "Customers",
      date: "Sep 10, 2026",
    },
    {
      name: "Product sales breakdown",
      category: "Products",
      date: "Sep 08, 2026",
    },
  ]);
  const orders = useAppSelector((s) => s.dashboard.orders);
  const dispatch = useAppDispatch();
  const filtered = reports.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <PageTransition>
      <div className="page-heading">
        <div>
          <div className="eyebrow">TURN NUMBERS INTO NEXT STEPS</div>
          <h1>Clarity, on demand.</h1>
          <p>Your business story, ready to share.</p>
        </div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          <Plus size={16} />
          Create report
        </Button>
      </div>
      <div className="report-banner">
        <span className="report-banner-icon">
          <FileChartColumn size={32} />
        </span>
        <div>
          <span className="eyebrow">YOUR MONTH IN FOCUS</span>
          <h2>Great progress deserves a closer look.</h2>
          <p>
            Explore the trends, wins, and opportunities behind your numbers.
          </p>
        </div>
        <Button
          onClick={() => {
            exportCsv(orders, "september-performance");
            dispatch(notify("September performance report downloaded."));
          }}
        >
          Download summary <ArrowDownToLine size={15} />
        </Button>
      </div>
      <div className="collection-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Find a report..."
        />
        <span className="muted">{reports.length} reports</span>
      </div>
      <div className="report-grid">
        {filtered.map((r, i) => (
          <FadeUp key={r.name} delay={i * 0.04}>
            <Card className="report-card">
              <div>
                <span className="report-file-icon">
                  <FileChartColumn size={24} />
                </span>
                <Badge>Completed</Badge>
              </div>
              <span className="eyebrow">{r.category}</span>
              <h2>{r.name}</h2>
              <p>Created {r.date} · CSV export</p>
              <Button
                onClick={() => {
                  exportCsv(orders, r.name.toLowerCase().replaceAll(" ", "-"));
                  dispatch(notify("Report downloaded."));
                }}
              >
                <ArrowDownToLine size={15} />
                Download report
              </Button>
            </Card>
          </FadeUp>
        ))}
      </div>
      {!filtered.length && <EmptyState title="No reports found" />}
      <Modal open={open} onClose={() => setOpen(false)} title="Create a report">
        <form
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            setReports([
              {
                name: String(data.get("name")),
                category: String(data.get("category")),
                date: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }),
              },
              ...reports,
            ]);
            setOpen(false);
            dispatch(notify("Your report is ready to download."));
          }}
        >
          <label>
            Report name
            <input
              name="name"
              required
              minLength={3}
              placeholder="e.g. Quarterly revenue"
            />
          </label>
          <label>
            Category
            <select name="category">
              <option>Revenue</option>
              <option>Customers</option>
              <option>Products</option>
              <option>Performance</option>
            </select>
          </label>
          <p className="muted">
            Reports include the current workspace order data.
          </p>
          <div className="modal-actions">
            <Button type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary">Generate report</Button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
}
