import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpDown,
  ArrowUpRight,
  CheckCheck,
  Download,
  MoreHorizontal,
} from "lucide-react";
import { Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { EmptyState } from "../ui/empty-state";
import { IconButton } from "../ui/icon-button";
import { Pagination } from "../ui/pagination";
import { SearchInput } from "../ui/search-input";
import { Select } from "../ui/select";
import type { RecordItem } from "../../types";
import { currency, exportCsv } from "../../utils/format";
import { useAppDispatch } from "../../hooks/useStore";
import { updateStatus } from "../../store/slices/dashboardSlice";
import { notify } from "../../store/slices/uiSlice";
export default function DataTable({
  rows,
  compact = false,
  customers = false,
}: {
  rows: RecordItem[];
  compact?: boolean;
  customers?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"date" | "amount" | "name">("date");
  const [ascending, setAscending] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [action, setAction] = useState("");
  const dispatch = useAppDispatch();
  const filtered = useMemo(
    () =>
      rows
        .filter(
          (r) =>
            `${r.name} ${r.email} ${r.id} ${r.product}`
              .toLowerCase()
              .includes(search.toLowerCase()) &&
            (status === "All statuses" || status === r.status),
        )
        .sort(
          (a, b) =>
            (typeof a[sort] === "number"
              ? (a[sort] as number) - (b[sort] as number)
              : String(a[sort]).localeCompare(String(b[sort]))) *
            (ascending ? 1 : -1),
        ),
    [rows, search, status, sort, ascending],
  );
  const size = compact ? 5 : 7;
  const pageRows = filtered.slice((page - 1) * size, page * size);
  function toggle(id: string) {
    setSelected(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    );
  }
  function sortBy(key: typeof sort) {
    setSort(key);
    setAscending(sort === key ? !ascending : true);
  }
  function complete(ids: string[]) {
    dispatch(updateStatus({ ids, status: "Completed" }));
    dispatch(
      notify(
        `${ids.length} order${ids.length === 1 ? "" : "s"} marked completed.`,
      ),
    );
    setSelected([]);
    setAction("");
  }
  return (
    <div className={`data-table ${compact ? "compact-table" : ""}`}>
      {!compact && (
        <div className="table-toolbar">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder={customers ? "Search customers..." : "Search orders..."}
          />
          <div className="table-toolbar-actions">
            <Select
              label="Filter by status"
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              options={[
                "All statuses",
                "Completed",
                "Pending",
                "Processing",
                "Cancelled",
              ]}
            />
            <Button
              onClick={() =>
                exportCsv(
                  filtered,
                  customers ? "aperture-customers" : "aperture-orders",
                )
              }
            >
              <Download size={15} />
              Export
            </Button>
          </div>
        </div>
      )}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            className="bulk-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <span>{selected.length} selected</span>
            <Button
              variant="ghost"
              onClick={() =>
                exportCsv(
                  rows.filter((r) => selected.includes(r.id)),
                  "selected-records",
                )
              }
            >
              <Download size={14} />
              Export selected
            </Button>
            {!customers && (
              <Button variant="ghost" onClick={() => complete(selected)}>
                <CheckCheck size={15} />
                Mark completed
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th className="checkbox-cell">
                <input
                  type="checkbox"
                  aria-label="Select all rows on this page"
                  checked={
                    pageRows.length > 0 &&
                    pageRows.every((r) => selected.includes(r.id))
                  }
                  onChange={(e) =>
                    setSelected(
                      e.target.checked
                        ? [
                            ...new Set([
                              ...selected,
                              ...pageRows.map((r) => r.id),
                            ]),
                          ]
                        : selected.filter(
                            (id) => !pageRows.some((r) => r.id === id),
                          ),
                    )
                  }
                />
              </th>
              <th>
                <button onClick={() => sortBy("name")}>
                  Customer <ArrowDown size={12} />
                </button>
              </th>
              {!customers && !compact && <th>Order ID</th>}
              <th>
                <button onClick={() => sortBy("date")}>
                  Date <ArrowUpDown size={11} />
                </button>
              </th>
              <th>
                <button onClick={() => sortBy("amount")}>
                  {customers ? "Total spent" : "Amount"}{" "}
                  <ArrowUpDown size={11} />
                </button>
              </th>
              <th>{customers ? "Account" : "Status"}</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {pageRows.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.025 }}
                  className={selected.includes(r.id) ? "selected-row" : ""}
                >
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Select ${r.name}`}
                      checked={selected.includes(r.id)}
                      onChange={() => toggle(r.id)}
                    />
                  </td>
                  <td>
                    <Link className="customer-cell" to={`/customers/${r.id}`}>
                      <Avatar initials={r.avatar} index={i} size="small" />
                      <span>
                        <strong>{r.name}</strong>
                        <small>{r.email}</small>
                      </span>
                    </Link>
                  </td>
                  {!customers && !compact && (
                    <td>
                      <Link to={`/orders/${r.id}`}>{r.id}</Link>
                    </td>
                  )}
                  <td className="date-cell">
                    {new Date(`${r.date}T12:00:00`).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "2-digit", year: "numeric" },
                    )}
                  </td>
                  <td className="amount-cell">{currency(r.amount)}</td>
                  <td>
                    <Badge>{customers ? "Active" : r.status}</Badge>
                  </td>
                  <td className="table-action-cell">
                    <IconButton
                      label={`Actions for ${r.id}`}
                      onClick={() => setAction(action === r.id ? "" : r.id)}
                    >
                      <MoreHorizontal size={17} />
                    </IconButton>
                    {action === r.id && (
                      <div className="row-menu">
                        <Link
                          to={`/${customers ? "customers" : "orders"}/${r.id}`}
                        >
                          View details <ArrowUpRight size={13} />
                        </Link>
                        {!customers && (
                          <button onClick={() => complete([r.id])}>
                            Mark completed
                          </button>
                        )}
                        <button
                          onClick={() => {
                            exportCsv([r], r.id);
                            setAction("");
                          }}
                        >
                          Export record
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      {!pageRows.length && <EmptyState title="No matching records" />}
      <div className="table-footer">
        {compact ? (
          <>
            <span>Showing 5 of {rows.length} recent transactions</span>
            <Link to="/orders">
              View all transactions <ArrowUpRight size={13} />
            </Link>
          </>
        ) : (
          <Pagination
            page={page}
            total={filtered.length}
            pageSize={size}
            onChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
