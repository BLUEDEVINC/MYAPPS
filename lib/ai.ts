import { Task } from "./types";

export const generateLaunchTasks = (prompt: string) => {
  if (!prompt.toLowerCase().includes("launch")) return [];
  return ["Market research", "Landing page design", "Social media campaign", "Launch announcement"];
};

export const summarizeTask = (task: Task) =>
  `${task.title}: ${task.status}, owned by ${task.assignee}, priority ${task.priority}, due ${task.dueDate}. ${task.subtasks.filter((s) => s.done).length}/${task.subtasks.length} subtasks done.`;

export const suggestDeadline = (priority: Task["priority"]) => {
  const days = { Low: 14, Medium: 7, High: 3, Urgent: 1 }[priority];
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const workloadSignal = (tasks: Task[]) => {
  const byPerson = tasks.reduce<Record<string, number>>((acc, t) => {
    acc[t.assignee] = (acc[t.assignee] || 0) + (t.status === "Done" ? 0 : 1);
    return acc;
  }, {});
  const overloaded = Object.entries(byPerson)
    .filter(([, count]) => count >= 4)
    .map(([name]) => name);
  return overloaded.length
    ? `Balance suggestion: consider redistributing tasks from ${overloaded.join(", ")}.`
    : "Workload looks balanced across team members.";
};
