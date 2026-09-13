import { Suspense, useCallback, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  Bell,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  CircleHelp,
  Command,
  Globe2,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  Search,
  Settings2,
  Sparkles,
  Sun,
  User,
  X,
} from "lucide-react";
import Logo from "../core/Logo";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { IconButton } from "../ui/icon-button";
import { Modal } from "../ui/modal";
import { SearchInput } from "../ui/search-input";
import { Skeleton } from "../ui/skeleton";
import { Toast } from "../ui/toast";
import { navigation } from "../../constants/navigation";
import { records } from "../../data/mock";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import {
  notify,
  setCommandOpen,
  setMobileOpen,
  setTheme,
  toggleSidebar,
} from "../../store/slices/uiSlice";
import { markAllRead } from "../../store/slices/notificationSlice";
import { signOut } from "../../store/slices/authSlice";
import ErrorBoundary from "./ErrorBoundary";

export default function Layout() {
  const { theme, collapsed, mobileOpen, commandOpen, toast } = useAppSelector(
    (s) => s.ui,
  );
  const user = useAppSelector((s) => s.auth.user);
  const notifications = useAppSelector((s) => s.notifications.items);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [popup, setPopup] = useState("");
  const [query, setQuery] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [faq, setFaq] = useState(0);
  const { scrollY } = useScroll();
  const shadow = useTransform(
    scrollY,
    [0, 60],
    ["0 0 0 transparent", "0 8px 24px #00000015"],
  );
  const current =
    navigation.find((item) => location.pathname.startsWith(item.path))?.label ||
    "Profile";
  const closeToast = useCallback(() => dispatch(notify("")), [dispatch]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        dispatch(setCommandOpen(!commandOpen));
      }
      if (e.key === "Escape") {
        setPopup("");
        dispatch(setMobileOpen(false));
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [dispatch, commandOpen]);
  function go(path: string) {
    navigate(path);
    dispatch(setCommandOpen(false));
    dispatch(setMobileOpen(false));
    setPopup("");
    setQuery("");
  }
  const sidebar = (
    <>
      <div className="sidebar-logo">
        <NavLink to="/dashboard" aria-label="Aperture home">
          <Logo compact={collapsed && !mobileOpen} />
        </NavLink>
        <button
          className="collapse-button"
          aria-label="Collapse sidebar"
          onClick={() => dispatch(toggleSidebar())}
        >
          <PanelLeftClose size={16} />
        </button>
        <button
          className="mobile-close icon-button"
          aria-label="Close navigation"
          onClick={() => dispatch(setMobileOpen(false))}
        >
          <X size={20} />
        </button>
      </div>
      <button
        className="workspace-switch"
        onClick={() => setPopup(popup === "workspace" ? "" : "workspace")}
        aria-expanded={popup === "workspace"}
      >
        <span className="workspace-icon">
          <Globe2 size={18} />
        </span>
        <span className="nav-label">
          <strong>Aperture workspace</strong>
          <small>
            Pro plan <span className="tiny-lime">PRO</span>
          </small>
        </span>
        <ChevronsUpDown size={14} className="nav-label" />
      </button>
      {popup === "workspace" && (
        <div className="workspace-popup">
          <strong>Aperture workspace</strong>
          <p>You’re in your personal demo workspace.</p>
          <Button onClick={() => go("/settings")}>
            Workspace settings <ArrowUpRight size={14} />
          </Button>
        </div>
      )}
      <div className="nav-group-label nav-label">WORKSPACE</div>
      <nav aria-label="Main navigation">
        {navigation.slice(0, 7).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : undefined}
            onClick={() => dispatch(setMobileOpen(false))}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <item.icon size={18} />
            <span className="nav-label">{item.label}</span>
            {item.count && (
              <span
                className={`nav-count nav-label ${item.label === "Messages" ? "lime-count" : ""}`}
              >
                {item.count}
              </span>
            )}
          </NavLink>
        ))}
        <div className="nav-group-label nav-label management-label">
          MANAGEMENT
        </div>
        {navigation.slice(7).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : undefined}
            onClick={() => dispatch(setMobileOpen(false))}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <item.icon size={18} />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="upgrade-card nav-label">
          <span className="upgrade-icon">
            <Sparkles size={18} />
          </span>
          <h3>A little more possibility.</h3>
          <p>
            Power up your workspace with
            <br />
            advanced tools and insights.
          </p>
          <Button onClick={() => go("/settings?tab=Billing")}>
            Explore plans <ArrowUpRight size={15} />
          </Button>
        </div>
        <button className="help-button" onClick={() => setHelpOpen(true)}>
          <CircleHelp size={18} />
          <span className="nav-label">Help & getting started</span>
          <ArrowUpRight className="nav-label" size={14} />
        </button>
        <button className="sidebar-user" onClick={() => go("/profile")}>
          <Avatar initials="AM" index={2} />
          <span className="nav-label">
            <strong>{user.name}</strong>
            <small>{user.role}</small>
          </span>
          <ChevronsUpDown className="nav-label" size={15} />
        </button>
      </div>
    </>
  );
  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <aside className="sidebar desktop-sidebar">{sidebar}</aside>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setMobileOpen(false))}
          >
            <motion.aside
              className="sidebar mobile-sidebar"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {sidebar}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="main-shell">
        <motion.header className="topbar" style={{ boxShadow: shadow }}>
          <div className="breadcrumb">
            <button
              className="mobile-menu icon-button"
              aria-label="Open navigation"
              onClick={() => dispatch(setMobileOpen(true))}
            >
              <Menu size={20} />
            </button>
            <span className="breadcrumb-workspace">Workspace</span>
            <ChevronRight size={13} className="breadcrumb-workspace" />
            <span>{current}</span>
          </div>
          <div className="topbar-actions">
            <button
              className="global-search"
              onClick={() => dispatch(setCommandOpen(true))}
            >
              <Search size={16} />
              <span>Search anything...</span>
              <kbd>⌘ K</kbd>
            </button>
            <span className="topbar-divider" />
            <IconButton
              label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              onClick={() =>
                dispatch(setTheme(theme === "dark" ? "light" : "dark"))
              }
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>
            <div className="popup-anchor">
              <button
                className="icon-button notification-button"
                aria-label="Notifications"
                aria-expanded={popup === "notifications"}
                onClick={() =>
                  setPopup(popup === "notifications" ? "" : "notifications")
                }
              >
                <Bell size={18} />
                {notifications.some((n) => !n.read) && (
                  <span className="notification-dot" />
                )}
              </button>
              <AnimatePresence>
                {popup === "notifications" && (
                  <motion.div
                    className="dropdown notifications-dropdown"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                  >
                    <div className="dropdown-title">
                      <h3>Notifications</h3>
                      <button onClick={() => dispatch(markAllRead())}>
                        Mark all read
                      </button>
                    </div>
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`notification-item ${n.read ? "read" : ""}`}
                      >
                        <span className="notification-icon">
                          <Bell size={15} />
                        </span>
                        <div>
                          <strong>{n.title}</strong>
                          <p>{n.detail}</p>
                          <small>{n.time}</small>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="popup-anchor">
              <button
                className="profile-button"
                aria-label="Profile menu"
                aria-expanded={popup === "profile"}
                onClick={() => setPopup(popup === "profile" ? "" : "profile")}
              >
                <Avatar initials="AM" size="small" index={2} />
                <ChevronDown size={13} />
              </button>
              <AnimatePresence>
                {popup === "profile" && (
                  <motion.div
                    className="dropdown profile-dropdown"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                  >
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                    <button onClick={() => go("/profile")}>
                      <User size={16} />
                      My profile
                    </button>
                    <button onClick={() => go("/settings")}>
                      <Settings2 size={16} />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        dispatch(signOut());
                        go("/login");
                      }}
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.header>
        {popup && (
          <div className="popup-dismiss" onClick={() => setPopup("")} />
        )}
        <main className="main-content">
          <ErrorBoundary key={location.pathname}>
            <Suspense fallback={<Skeleton />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
          <footer className="page-footer">
            <span>© 2026 Aperture. A clearer view of your business.</span>
            <span>
              <i /> All systems operational
            </span>
          </footer>
        </main>
      </div>
      <Modal
        open={commandOpen}
        onClose={() => dispatch(setCommandOpen(false))}
        title="Jump to anything"
        className="command-modal"
      >
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search pages, people, or orders..."
        />
        <div className="command-results">
          {navigation
            .filter((item) =>
              item.label.toLowerCase().includes(query.toLowerCase()),
            )
            .map((item) => (
              <button key={item.path} onClick={() => go(item.path)}>
                <item.icon size={18} />
                <span>{item.label}</span>
                <ChevronRight size={15} />
              </button>
            ))}
          {query.length > 1 &&
            records
              .filter((person) =>
                person.name.toLowerCase().includes(query.toLowerCase()),
              )
              .slice(0, 4)
              .map((person) => (
                <button
                  key={person.id}
                  onClick={() => go(`/customers/${person.id}`)}
                >
                  <User size={18} />
                  <span>{person.name}</span>
                  <ChevronRight size={15} />
                </button>
              ))}
        </div>
        <div className="command-footer">
          <Command size={12} /> K to open <span>esc to close</span>
        </div>
      </Modal>
      <Modal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="Make yourself at home"
      >
        <p className="muted modal-intro">
          A few things to help you get the most out of Aperture.
        </p>
        {[
          "How do I create an order?",
          "How do I export my data?",
          "Is my workspace connected to a backend?",
        ].map((q, i) => (
          <div className="faq-item" key={q}>
            <button onClick={() => setFaq(faq === i ? -1 : i)}>
              {q}
              <ChevronDown size={16} />
            </button>
            <AnimatePresence>
              {faq === i && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  {
                    [
                      "Use Create order on the dashboard or Orders page. Fill in the customer and product details, then save.",
                      "Use Export on the dashboard, Orders, or Reports page to download a CSV file.",
                      "This is a working demo with realistic sample data. Orders and messages live in the current session; theme and login preferences are saved on this device.",
                    ][i]
                  }
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </Modal>
      <Toast message={toast} onClose={closeToast} />
    </div>
  );
}
