import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, ShieldCheck } from "lucide-react";
import { PageTransition } from "../components/core/Animation";
import { Avatar } from "../components/ui/avatar";
import { Card } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { IconButton } from "../components/ui/icon-button";
import { SearchInput } from "../components/ui/search-input";
import { records } from "../data/mock";
type Message = { text: string; mine: boolean; time: string };
const contacts = records.slice(0, 5);
const initial: Record<string, Message[]> = Object.fromEntries(
  contacts.map((p, i) => [
    p.id,
    [
      {
        text: [
          "Hey Alex! Just wanted to check on my latest order. Really looking forward to the new headphones.",
          "Thanks for adding me to the workspace! Excited to get started.",
          "The desk lamp arrived and it looks amazing. Thank you!",
          "Could you help me with an invoice for my last order?",
          "Hey! Do you have an update on the new collection?",
        ][i],
        mine: false,
        time: "9:41 AM",
      },
      {
        text: "Hi there! Happy to help. Let me take a look for you.",
        mine: true,
        time: "9:43 AM",
      },
    ],
  ]),
);
export default function Messages() {
  const [selected, setSelected] = useState(contacts[0].id);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [threads, setThreads] = useState(initial);
  const [mobileThread, setMobileThread] = useState(false);
  const person = contacts.find((p) => p.id === selected)!;
  function send() {
    if (!text.trim()) return;
    setThreads({
      ...threads,
      [selected]: [
        ...threads[selected],
        {
          text: text.trim(),
          mine: true,
          time: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
        },
      ],
    });
    setText("");
  }
  return (
    <PageTransition>
      <div className="page-heading">
        <div>
          <div className="eyebrow">GOOD THINGS START WITH A CONVERSATION</div>
          <h1>
            Messages<span className="title-count">4</span>
          </h1>
          <p>A more personal way to stay connected.</p>
        </div>
        <span className="muted small-label">
          <ShieldCheck size={14} /> Demo workspace conversations
        </span>
      </div>
      <Card className={`messages-layout ${mobileThread ? "show-thread" : ""}`}>
        <div className="conversation-list">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search conversations..."
          />
          {contacts
            .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
            .map((p, i) => (
              <button
                key={p.id}
                className={`conversation ${selected === p.id ? "selected" : ""}`}
                onClick={() => {
                  setSelected(p.id);
                  setMobileThread(true);
                }}
              >
                <Avatar initials={p.avatar} index={i} />
                <span>
                  <strong>{p.name}</strong>
                  <small>{threads[p.id].at(-1)?.text}</small>
                </span>
                <i />
              </button>
            ))}
          {!contacts.some((p) =>
            p.name.toLowerCase().includes(search.toLowerCase()),
          ) && <EmptyState title="No conversations found" />}
        </div>
        <div className="message-thread">
          <div className="thread-heading">
            <button
              className="mobile-menu icon-button"
              aria-label="Back to conversations"
              onClick={() => setMobileThread(false)}
            >
              <ArrowLeft size={17} />
            </button>
            <Avatar initials={person.avatar} />
            <div>
              <strong>{person.name}</strong>
              <small>
                <i className="live-dot" />
                Online
              </small>
            </div>
          </div>
          <div className="messages-body">
            <span className="message-date">Today</span>
            {threads[selected].map((m, i) => (
              <motion.div
                key={`${selected}-${i}`}
                className={`message ${m.mine ? "mine" : ""}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p>{m.text}</p>
                <small>
                  {m.time}
                  {m.mine ? " · Sent" : ""}
                </small>
              </motion.div>
            ))}
          </div>
          <form
            className="message-composer"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              aria-label="Write a message"
              placeholder={`Message ${person.name.split(" ")[0]}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <IconButton
              label="Send message"
              disabled={!text.trim()}
              type="submit"
            >
              <Send size={18} />
            </IconButton>
          </form>
        </div>
      </Card>
    </PageTransition>
  );
}
