import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/root/Layout";
import { Skeleton } from "../components/ui/skeleton";
import { useAppSelector } from "../hooks/useStore";
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Orders = lazy(() => import("../pages/Orders"));
const Detail = lazy(() =>
  import("../pages/Orders").then((m) => ({ default: m.Detail })),
);
const Products = lazy(() => import("../pages/Products"));
const Events = lazy(() => import("../pages/Events"));
const Messages = lazy(() => import("../pages/Messages"));
const Team = lazy(() => import("../pages/Team"));
const Reports = lazy(() => import("../pages/Reports"));
const Settings = lazy(() => import("../pages/Settings"));
const Login = lazy(() => import("../pages/Login"));
const NotFound = lazy(() => import("../pages/NotFound"));
export default function AppRoutes() {
  const signedIn = useAppSelector((s) => s.auth.signedIn);
  return (
    <Suspense fallback={<Skeleton />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={signedIn ? <Layout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Dashboard analytics />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<Detail />} />
          <Route path="/customers" element={<Orders customers />} />
          <Route path="/customers/:id" element={<Detail customer />} />
          <Route path="/products" element={<Products />} />
          <Route path="/events" element={<Events />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/team" element={<Team />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Settings profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
