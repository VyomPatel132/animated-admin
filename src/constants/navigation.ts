import {
  LayoutDashboard,
  ChartNoAxesCombined,
  ShoppingBag,
  Users,
  Package,
  CalendarDays,
  MessagesSquare,
  UsersRound,
  FileChartColumn,
  Settings2,
} from "lucide-react";
export const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", path: "/analytics", icon: ChartNoAxesCombined },
  { label: "Orders", path: "/orders", icon: ShoppingBag, count: "24" },
  { label: "Customers", path: "/customers", icon: Users },
  { label: "Products", path: "/products", icon: Package },
  { label: "Events", path: "/events", icon: CalendarDays },
  { label: "Messages", path: "/messages", icon: MessagesSquare, count: "4" },
  { label: "Team", path: "/team", icon: UsersRound },
  { label: "Reports", path: "/reports", icon: FileChartColumn },
  { label: "Settings", path: "/settings", icon: Settings2 },
];
