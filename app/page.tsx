"use client";

import { FormEvent, useMemo, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { generateLaunchTasks, suggestDeadline, summarizeTask, workloadSignal } from "@/lib/ai";
import { Priority, Task } from "@/lib/types";

const initial: Task[] = [
  {
    id: "1",
    title: "Setup analytics",
    description: "Install product analytics and core events",
    assignee: "Ava",
    priority: "High",
    dueDate: "2026-03-18",
    tags: ["Growth", "Setup"],
    status: "In Progress",
    subtasks: [
      { id: "s1", label: "Define events", done: true },
      { id: "s2", label: "Connect dashboard", done: false }
    ],
    checklist: [{ id: "c1", label: "Stakeholder review", done: false }],
    comments: [{ id: "m1", user: "Noah", text: "@Ava please attach implementation notes.", at: "09:12" }],
    timeSpentMinutes: 110
  }
];

const statuses: Task["status"][] = ["Backlog", "In Progress", "Review", "Done"];

export default function Home() {
  const [tasks, setTasks] = useState(initial);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [assignee, setAssignee] = useState("Liam");
  const [prompt, setPrompt] = useState("Plan a product launch.");
  const [query, setQuery] = useState("");
  const [activeView, setActiveView] = useState("List");

  const addTask = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        title,
        description: "",
        assignee,
        priority,
        dueDate: suggestDeadline(priority),
        tags: ["General"],
        status: "Backlog" as Task["status"],
        subtasks: [],
        checklist: [],
        comments: [],
        timeSpentMinutes: 0
      },
      ...prev
    ]);
    setTitle("");
  };

  const aiCreate = () => {
    const tasksFromPrompt = generateLaunchTasks(prompt);
    if (!tasksFromPrompt.length) return;
    const generated: Task[] = tasksFromPrompt.map((t, idx): Task => ({
      id: `${Date.now()}-${idx}`,
      title: t,
      description: `AI-generated from: ${prompt}`,
      assignee: idx % 2 ? "Ava" : "Liam",
      priority: "High",
      dueDate: suggestDeadline("High"),
      tags: ["AI"],
      status: "Backlog",
      subtasks: [],
      checklist: [],
      comments: [],
      timeSpentMinutes: 0
    }));
    setTasks((prev) => [...generated, ...prev]);
  };

  const filtered = useMemo(
    () => tasks.filter((t) => `${t.title} ${t.description} ${t.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())),
    [tasks, query]
  );

  const move = (taskId: string, to: Task["status"]) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: to } : t)));
  };

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-5 md:p-8">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">FlowPilot</h1>
          <p className="text-sm text-muted">AI-assisted workspaces · spaces · folders · lists · tasks</p>
        </div>
        <ThemeToggle />
      </header>

      <section className="mb-5 grid gap-3 md:grid-cols-4">
        {[
          ["Today", String(tasks.filter((t) => t.status !== "Done").length)],
          ["Upcoming", String(tasks.filter((t) => t.priority === "High" || t.priority === "Urgent").length)],
          ["Activity", `${tasks.reduce((a, b) => a + b.comments.length, 0)} comments`],
          ["Focus time", `${Math.round(tasks.reduce((a, b) => a + b.timeSpentMinutes, 0) / 60)}h`]
        ].map(([label, value]) => (
          <div key={label} className="card p-4">
            <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
            <p className="mt-2 text-xl font-semibold">{value}</p>
          </div>
        ))}
      </section>

      <section className="mb-5 card p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {["List", "Kanban", "Calendar", "Timeline", "Table"].map((v) => (
            <button key={v} className={`rounded-lg px-3 py-2 text-sm ${activeView === v ? "bg-accent text-white" : "border border-border"}`} onClick={() => setActiveView(v)}>
              {v} view
            </button>
          ))}
        </div>
        <p className="text-sm text-muted">Current view: {activeView}. Drag-and-drop simulation: move tasks between status columns.</p>
      </section>

      <section className="mb-5 grid gap-5 lg:grid-cols-3">
        <form onSubmit={addTask} className="card space-y-3 p-4">
          <h2 className="font-semibold">Quick task create</h2>
          <input className="w-full rounded-lg border border-border bg-transparent p-2" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded-lg border border-border bg-transparent p-2" value={assignee} onChange={(e) => setAssignee(e.target.value)} />
            <select className="rounded-lg border border-border bg-transparent p-2" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              {(["Low", "Medium", "High", "Urgent"] as Priority[]).map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <button className="w-full rounded-lg bg-accent p-2 text-white">Create task</button>
        </form>

        <div className="card space-y-3 p-4">
          <h2 className="font-semibold">AI Studio</h2>
          <textarea className="h-24 w-full rounded-lg border border-border bg-transparent p-2" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <button className="w-full rounded-lg bg-accent p-2 text-white" onClick={aiCreate}>Generate tasks from text</button>
          <p className="text-xs text-muted">Meeting notes → tasks, task summaries, deadline suggestions, workload balancing included.</p>
          <p className="text-xs text-muted">{workloadSignal(tasks)}</p>
        </div>

        <div className="card space-y-3 p-4">
          <h2 className="font-semibold">Search & shortcuts</h2>
          <input className="w-full rounded-lg border border-border bg-transparent p-2" placeholder="Natural language task search" value={query} onChange={(e) => setQuery(e.target.value)} />
          <ul className="text-xs text-muted">
            <li>⌘/Ctrl + K: open quick search</li>
            <li>N: new task</li>
            <li>T: toggle timer</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {statuses.map((col) => (
          <div key={col} className="card p-3">
            <h3 className="mb-3 font-semibold">{col}</h3>
            <div className="space-y-3">
              {filtered.filter((t) => t.status === col).map((t) => (
                <article key={t.id} className="rounded-lg border border-border p-3">
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-muted">{summarizeTask(t)}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {t.tags.map((tag) => (
                      <span key={tag} className="rounded bg-panel px-2 py-0.5 text-xs">#{tag}</span>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {statuses.map((s) => (
                      <button key={s} onClick={() => move(t.id, s)} className="rounded border border-border px-2 py-1 text-xs">
                        {s}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer className="mt-6 text-xs text-muted">
        Integrations ready: Slack, Google Drive, GitHub, Zoom, Email · Roles: Admin, Manager, Member · Real-time: WebSockets-ready.
      </footer>
    </main>
  );
}
