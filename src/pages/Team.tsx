import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Plus } from "lucide-react";
import { FadeUp, PageTransition } from "../components/core/Animation";
import { Avatar } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { LoadingButton } from "../components/ui/loading-button";
import { Modal } from "../components/ui/modal";
import { SearchInput } from "../components/ui/search-input";
import { Select } from "../components/ui/select";
import { records } from "../data/mock";
import { useAppDispatch } from "../hooks/useStore";
import { notify } from "../store/slices/uiSlice";
const schema = z.object({
  name: z.string().min(2, "Enter a full name."),
  email: z.email("Enter a valid email."),
  role: z.string(),
});
type Values = z.infer<typeof schema>;
export default function Team() {
  const [team, setTeam] = useState(
    records
      .slice(0, 6)
      .map((p, i) => ({
        ...p,
        role: [
          "Designer",
          "Developer",
          "Marketing",
          "Support",
          "Developer",
          "Admin",
        ][i],
        invited: false,
      })),
  );
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { role: "Member" },
  });
  async function invite(v: Values) {
    await new Promise((r) => setTimeout(r, 350));
    setTeam([
      ...team,
      {
        ...records[0],
        ...v,
        id: `team-${Date.now()}`,
        avatar: v.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2),
        invited: true,
      },
    ]);
    reset();
    setOpen(false);
    dispatch(notify("Demo invitation created. No email was sent."));
  }
  const filtered = team.filter((p) =>
    `${p.name} ${p.role}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <PageTransition>
      <div className="page-heading">
        <div>
          <div className="eyebrow">BETTER, TOGETHER</div>
          <h1>The people behind it all.</h1>
          <p>One workspace. A whole lot of possibility.</p>
        </div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          <Plus size={16} />
          Invite member
        </Button>
      </div>
      <div className="collection-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Find a teammate..."
        />
        <span className="muted">{team.length} team members</span>
      </div>
      <div className="team-grid">
        {filtered.map((p, i) => (
          <FadeUp key={p.id} delay={i * 0.04}>
            <Card className="team-card">
              <Badge>{p.invited ? "Invited" : "Active"}</Badge>
              <Avatar initials={p.avatar} size="large" index={i} />
              <h2>{p.name}</h2>
              <p>{p.email}</p>
              <Select
                label={`Role for ${p.name}`}
                value={p.role}
                options={[
                  "Admin",
                  "Designer",
                  "Developer",
                  "Marketing",
                  "Support",
                  "Member",
                ]}
                onChange={(v) => {
                  setTeam(
                    team.map((t) => (t.id === p.id ? { ...t, role: v } : t)),
                  );
                  dispatch(notify("Team member role updated."));
                }}
              />
              <div className="team-card-footer">
                <Mail size={14} />
                <span>
                  {p.invited ? "Invitation pending" : "Joined September 2026"}
                </span>
              </div>
            </Card>
          </FadeUp>
        ))}
      </div>
      {!filtered.length && <EmptyState title="No teammates found" />}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Invite someone great"
      >
        <p className="muted modal-intro">
          Create an invitation in this demo workspace.
        </p>
        <form className="form-stack" onSubmit={handleSubmit(invite)}>
          <label>
            Full name
            <input {...register("name")} placeholder="e.g. Jamie Chen" />
            {errors.name && (
              <span className="form-error">{errors.name.message}</span>
            )}
          </label>
          <label>
            Email address
            <input {...register("email")} placeholder="jamie@company.com" />
            {errors.email && (
              <span className="form-error">{errors.email.message}</span>
            )}
          </label>
          <label>
            Role
            <select {...register("role")}>
              <option>Member</option>
              <option>Admin</option>
              <option>Designer</option>
              <option>Developer</option>
            </select>
          </label>
          <div className="modal-actions">
            <Button type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <LoadingButton loading={isSubmitting}>
              Create invitation
            </LoadingButton>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
}
