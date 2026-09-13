import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  Video,
} from "lucide-react";
import { PageTransition } from "../components/core/Animation";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { IconButton } from "../components/ui/icon-button";
import { Modal } from "../components/ui/modal";
import { useAppDispatch } from "../hooks/useStore";
import { notify } from "../store/slices/uiSlice";
export default function Events() {
  const [month, setMonth] = useState(8);
  const [year, setYear] = useState(2026);
  const [selected, setSelected] = useState(13);
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Weekly team sync",
      date: "2026-09-13",
      time: "10:00",
      type: "Team",
    },
    {
      id: 2,
      title: "Product launch review",
      date: "2026-09-16",
      time: "14:00",
      type: "Product",
    },
    {
      id: 3,
      title: "Customer success catch-up",
      date: "2026-09-22",
      time: "11:30",
      type: "Customers",
    },
    {
      id: 4,
      title: "September performance review",
      date: "2026-09-28",
      time: "15:00",
      type: "Business",
    },
  ]);
  const dispatch = useAppDispatch();
  const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(selected).padStart(2, "0")}`;
  const days = new Date(year, month + 1, 0).getDate();
  const start = new Date(year, month, 1).getDay();
  function move(n: number) {
    const d = new Date(year, month + n, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setSelected(1);
  }
  return (
    <PageTransition>
      <div className="page-heading">
        <div>
          <div className="eyebrow">MAKE TIME FOR WHAT MATTERS</div>
          <h1>A little more organized.</h1>
          <p>Your meetings, milestones, and moments worth remembering.</p>
        </div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          <Plus size={16} />
          New event
        </Button>
      </div>
      <div className="calendar-layout">
        <Card className="calendar-card">
          <div className="card-heading">
            <h2>
              {new Date(year, month).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="flex gap-2">
              <IconButton label="Previous month" onClick={() => move(-1)}>
                <ChevronLeft size={17} />
              </IconButton>
              <Button
                onClick={() => {
                  setYear(2026);
                  setMonth(8);
                  setSelected(13);
                }}
              >
                Today
              </Button>
              <IconButton label="Next month" onClick={() => move(1)}>
                <ChevronRight size={17} />
              </IconButton>
            </div>
          </div>
          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div className="calendar-weekday" key={d}>
                {d}
              </div>
            ))}
            {Array.from({ length: start }, (_, i) => (
              <div className="calendar-blank" key={`blank-${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const event = events.find(
                (e) =>
                  e.date ===
                  `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`,
              );
              return (
                <button
                  className={`calendar-day ${selected === i + 1 ? "selected" : ""}`}
                  key={i}
                  onClick={() => setSelected(i + 1)}
                >
                  <span>{i + 1}</span>
                  {event && <small>{event.title}</small>}
                </button>
              );
            })}
          </div>
        </Card>
        <Card className="padded-card">
          <span className="eyebrow">YOUR AGENDA</span>
          <h2 className="agenda-heading">
            {new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </h2>
          {events
            .filter((e) => e.date === date)
            .map((e) => (
              <div className="event-item" key={e.id}>
                <span className="event-icon">
                  <Video size={20} />
                </span>
                <small>{e.type}</small>
                <h3>{e.title}</h3>
                <p>
                  <Clock3 size={14} />
                  {e.time} · 45 minutes
                </p>
                <Button
                  onClick={() => {
                    setEvents(events.filter((item) => item.id !== e.id));
                    dispatch(notify("Event removed from your calendar."));
                  }}
                >
                  Remove event
                </Button>
              </div>
            ))}
          {!events.some((e) => e.date === date) && (
            <EmptyState
              title="A little breathing room"
              description="No events planned for this day."
            />
          )}
          <Button onClick={() => setOpen(true)}>
            <CalendarDays size={15} />
            Schedule something
          </Button>
        </Card>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Create an event">
        <form
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            setEvents([
              ...events,
              {
                id: Date.now(),
                title: String(data.get("title")),
                date: String(data.get("date")),
                time: String(data.get("time")),
                type: "Team",
              },
            ]);
            setOpen(false);
            dispatch(notify("Event added to your calendar."));
          }}
        >
          <label>
            Event name
            <input
              name="title"
              required
              minLength={3}
              placeholder="What’s the occasion?"
            />
          </label>
          <div className="form-grid">
            <label>
              Date
              <input name="date" type="date" required defaultValue={date} />
            </label>
            <label>
              Time
              <input name="time" type="time" required defaultValue="10:00" />
            </label>
          </div>
          <div className="modal-actions">
            <Button type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary">Create event</Button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
}
