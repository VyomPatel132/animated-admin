import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Download, Package, Plus, Truck } from "lucide-react";
import { PageTransition, FadeUp } from "../components/core/Animation";
import { Avatar } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { Select } from "../components/ui/select";
import DataTable from "../components/custom/DataTable";
import OrderModal from "../components/custom/OrderModal";
import { useAppDispatch, useAppSelector } from "../hooks/useStore";
import { currency, exportCsv } from "../utils/format";
import { updateStatus } from "../store/slices/dashboardSlice";
import { notify } from "../store/slices/uiSlice";
import type { Status } from "../types";
export default function Orders({ customers = false }: { customers?: boolean }) {
  const rows = useAppSelector((s) => s.dashboard.orders);
  const [open, setOpen] = useState(false);
  return (
    <PageTransition>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            {customers
              ? "RELATIONSHIPS THAT MATTER"
              : "EVERY ORDER, UNDER CONTROL"}
          </div>
          <h1>
            {customers ? "Customers" : "Orders"}
            <span className="title-count">{rows.length}</span>
          </h1>
          <p>
            {customers
              ? "Get to know the people behind your growth."
              : "From first click to front door. Keep things moving."}
          </p>
        </div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          <Plus size={16} />
          Create order
        </Button>
      </div>
      <div className="mini-stats">
        {(customers
          ? [
              { label: "Total customers", value: rows.length },
              { label: "Active customers", value: rows.length },
              {
                label: "Average spend",
                value: currency(
                  rows.reduce((a, r) => a + r.amount, 0) / rows.length,
                ),
              },
            ]
          : [
              { label: "All orders", value: rows.length },
              {
                label: "Completed",
                value: rows.filter((r) => r.status === "Completed").length,
              },
              {
                label: "In progress",
                value: rows.filter((r) =>
                  ["Pending", "Processing"].includes(r.status),
                ).length,
              },
              {
                label: "Total value",
                value: currency(rows.reduce((a, r) => a + r.amount, 0)),
              },
            ]
        ).map((s) => (
          <FadeUp key={s.label}>
            <Card>
              <span>{s.label}</span>
              <strong>{s.value}</strong>
            </Card>
          </FadeUp>
        ))}
      </div>
      <FadeUp>
        <Card>
          <DataTable rows={rows} customers={customers} />
        </Card>
      </FadeUp>
      <OrderModal open={open} onClose={() => setOpen(false)} />
    </PageTransition>
  );
}
export function Detail({ customer = false }: { customer?: boolean }) {
  const { id } = useParams();
  const order = useAppSelector((s) =>
    s.dashboard.orders.find((r) => r.id === id),
  );
  const dispatch = useAppDispatch();
  if (!order)
    return (
      <EmptyState
        title="Record not found"
        description="This record may have moved or no longer exists."
      >
        <Link className="button" to={customer ? "/customers" : "/orders"}>
          Go back
        </Link>
      </EmptyState>
    );
  return (
    <PageTransition>
      <Link className="back-link" to={customer ? "/customers" : "/orders"}>
        <ArrowLeft size={16} />
        Back to {customer ? "customers" : "orders"}
      </Link>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            {customer ? "CUSTOMER PROFILE" : "ORDER DETAILS"}
          </div>
          <h1>{customer ? order.name : `Order #${order.id}`}</h1>
          <p>
            {customer
              ? order.email
              : `Placed on ${order.date} by ${order.name}`}
          </p>
        </div>
        <Button onClick={() => exportCsv([order], order.id)}>
          <Download size={16} />
          Export {customer ? "customer" : "order"}
        </Button>
      </div>
      <div className="detail-grid">
        <Card className="padded-card">
          <div className="card-heading flush">
            <h2>{customer ? "Customer overview" : "Order summary"}</h2>
            <Badge>{customer ? "Active" : order.status}</Badge>
          </div>
          <div className="detail-profile">
            <Avatar initials={order.avatar} size="large" />
            <div>
              <h2>{order.name}</h2>
              <p>{order.email}</p>
            </div>
          </div>
          <dl className="detail-list">
            <div>
              <dt>Product</dt>
              <dd>{order.product}</dd>
            </div>
            <div>
              <dt>Order reference</dt>
              <dd>{order.id}</dd>
            </div>
            <div>
              <dt>Order date</dt>
              <dd>{order.date}</dd>
            </div>
            <div>
              <dt>Payment method</dt>
              <dd>Visa ending in 4242</dd>
            </div>
            <div>
              <dt>Total amount</dt>
              <dd className="detail-total">{currency(order.amount)}</dd>
            </div>
          </dl>
          {!customer && (
            <label className="status-control">
              Update order status
              <Select
                label="Order status"
                value={order.status}
                options={["Pending", "Processing", "Completed", "Cancelled"]}
                onChange={(v) => {
                  dispatch(
                    updateStatus({ ids: [order.id], status: v as Status }),
                  );
                  dispatch(notify("Order status updated."));
                }}
              />
            </label>
          )}
        </Card>
        <Card className="padded-card">
          <h2>Order journey</h2>
          <div className="order-journey">
            {[
              { title: "Order placed", detail: order.date, icon: Package },
              {
                title: "Payment confirmed",
                detail:
                  order.status === "Pending"
                    ? "Awaiting payment"
                    : "Payment received",
                icon: Check,
              },
              {
                title: "On its way",
                detail:
                  order.status === "Completed"
                    ? "Delivered to customer"
                    : "Preparing your order",
                icon: Truck,
              },
            ].map((step, i) => (
              <div
                key={step.title}
                className={
                  order.status === "Completed" || i === 0 ? "done" : ""
                }
              >
                <span>
                  <step.icon size={20} />
                </span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <Link className="button" to="/messages">
            Contact customer
          </Link>
        </Card>
      </div>
      {customer && (
        <Card className="mt-6">
          <div className="card-heading">
            <h2>Order history</h2>
          </div>
          <DataTable rows={[order]} />
        </Card>
      )}
    </PageTransition>
  );
}
