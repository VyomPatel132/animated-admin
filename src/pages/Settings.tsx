import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { PageTransition } from "../components/core/Animation";
import { Avatar } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { LoadingButton } from "../components/ui/loading-button";
import { Switch } from "../components/ui/switch";
import { Tabs } from "../components/ui/tabs";
import { useAppDispatch, useAppSelector } from "../hooks/useStore";
import { notify, setTheme } from "../store/slices/uiSlice";
import { updateProfile } from "../store/slices/authSlice";
const schema = z.object({
  name: z.string().min(2, "Your name should be at least 2 characters."),
  email: z.email("Enter a valid email address."),
  bio: z.string().max(240, "Keep your bio under 240 characters."),
});
type Values = z.infer<typeof schema>;
export default function Settings({ profile = false }: { profile?: boolean }) {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get("tab") || "My profile");
  const user = useAppSelector((s) => s.auth.user);
  const theme = useAppSelector((s) => s.ui.theme);
  const dispatch = useAppDispatch();
  const [preferences, setPreferences] = useState<Record<string, boolean>>(() =>
    JSON.parse(
      localStorage.getItem("aperture-preferences") ||
        '{"Email notifications":true,"Order updates":true,"Weekly digest":false,"Product announcements":false}',
    ),
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      email: user.email,
      bio:
        localStorage.getItem("aperture-bio") ||
        "Building something meaningful, one day at a time.",
    },
  });
  async function save(v: Values) {
    await new Promise((r) => setTimeout(r, 400));
    dispatch(updateProfile(v));
    localStorage.setItem("aperture-bio", v.bio);
    dispatch(notify("Your profile has been updated."));
  }
  return (
    <PageTransition>
      <div className="page-heading">
        <div>
          <div className="eyebrow">MAKE IT YOUR OWN</div>
          <h1>{profile ? "My profile" : "Workspace settings"}</h1>
          <p>A workspace that works the way you do.</p>
        </div>
      </div>
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          "My profile",
          "Appearance",
          "Notifications",
          "Billing",
          "Security",
        ]}
        id="settings-tabs"
      />
      <div className="settings-content">
        {tab === "My profile" && (
          <Card className="settings-card">
            <div className="settings-section-heading">
              <h2>Personal details</h2>
              <p>A little about you and how others see you.</p>
            </div>
            <form className="form-stack" onSubmit={handleSubmit(save)}>
              <div className="profile-avatar-row">
                <Avatar
                  initials={user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                  size="large"
                  index={2}
                />
                <div>
                  <strong>Your profile</strong>
                  <p>Your initials update automatically with your name.</p>
                </div>
              </div>
              <div className="form-grid">
                <label>
                  Full name
                  <input {...register("name")} />
                  {errors.name && (
                    <span className="form-error">{errors.name.message}</span>
                  )}
                </label>
                <label>
                  Email address
                  <input {...register("email")} />
                  {errors.email && (
                    <span className="form-error">{errors.email.message}</span>
                  )}
                </label>
              </div>
              <label>
                Bio
                <textarea {...register("bio")} rows={3} />
                {errors.bio && (
                  <span className="form-error">{errors.bio.message}</span>
                )}
              </label>
              <div className="modal-actions">
                <Button type="button" onClick={() => reset()}>
                  Discard changes
                </Button>
                <LoadingButton loading={isSubmitting}>
                  Save changes
                </LoadingButton>
              </div>
            </form>
          </Card>
        )}
        {tab === "Appearance" && (
          <Card className="settings-card">
            <div className="settings-section-heading">
              <h2>Your preferred perspective</h2>
              <p>Choose the look that feels right for you.</p>
            </div>
            <div className="theme-options">
              {(["dark", "light"] as const).map((t) => (
                <button
                  key={t}
                  className={`theme-option ${theme === t ? "selected" : ""}`}
                  onClick={() => dispatch(setTheme(t))}
                >
                  <div className={`theme-preview ${t}`}>
                    <aside />
                    <main>
                      <i />
                      <div>
                        <span />
                        <span />
                        <span />
                      </div>
                      <section />
                    </main>
                  </div>
                  <span>
                    {t === "dark" ? "After hours" : "A brighter day"}
                    {theme === t && <Check size={16} />}
                  </span>
                </button>
              ))}
            </div>
            <p className="muted">
              Your theme preference is saved automatically on this device.
            </p>
          </Card>
        )}
        {tab === "Notifications" && (
          <Card className="settings-card">
            <div className="settings-section-heading">
              <h2>Stay in the loop</h2>
              <p>Choose what you’d like to hear about.</p>
            </div>
            {Object.keys(preferences).map((key, i) => (
              <div className="preference-row" key={key}>
                <div>
                  <h3>{key}</h3>
                  <p>
                    {
                      [
                        "Important updates delivered to your inbox.",
                        "New orders, payments, and fulfillment updates.",
                        "Your weekly business performance at a glance.",
                        "New features and improvements to Aperture.",
                      ][i]
                    }
                  </p>
                </div>
                <Switch
                  label={key}
                  checked={preferences[key]}
                  onChange={() => {
                    const next = { ...preferences, [key]: !preferences[key] };
                    setPreferences(next);
                    localStorage.setItem(
                      "aperture-preferences",
                      JSON.stringify(next),
                    );
                    dispatch(notify("Notification preference saved."));
                  }}
                />
              </div>
            ))}
          </Card>
        )}
        {tab === "Billing" && (
          <Card className="settings-card">
            <div className="settings-section-heading">
              <h2>Room to grow</h2>
              <p>
                You’re on the Pro demo plan. No payment method is connected.
              </p>
            </div>
            <div className="plan-card">
              <Sparkles size={25} />
              <span className="eyebrow">APERTURE PRO</span>
              <h2>
                $29<span> / month</span>
              </h2>
              <p>Everything you need to see the bigger picture.</p>
              {[
                "Unlimited dashboards and reports",
                "Up to 20 team members",
                "Advanced analytics and exports",
                "Priority customer support",
              ].map((t) => (
                <div className="plan-feature" key={t}>
                  <Check size={15} />
                  {t}
                </div>
              ))}
              <span className="button primary">
                <CreditCard size={15} />
                Current demo plan
              </span>
            </div>
          </Card>
        )}
        {tab === "Security" && (
          <Card className="settings-card">
            <div className="settings-section-heading">
              <h2>Your workspace, protected</h2>
              <p>Session and account information.</p>
            </div>
            <div className="security-notice">
              <ShieldCheck size={28} />
              <div>
                <h3>Demo session</h3>
                <p>
                  This workspace uses a local demo sign-in. Passwords are never
                  stored. Connect an authentication provider before using real
                  customer data.
                </p>
              </div>
            </div>
            <div className="preference-row">
              <div>
                <h3>Current device</h3>
                <p>{navigator.platform} · Active now</p>
              </div>
              <span className="positive">This session</span>
            </div>
          </Card>
        )}
      </div>
    </PageTransition>
  );
}
