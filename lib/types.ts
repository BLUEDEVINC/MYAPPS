export type Priority = "Low" | "Medium" | "High" | "Urgent";

export type Task = {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: Priority;
  dueDate: string;
  tags: string[];
  status: "Backlog" | "In Progress" | "Review" | "Done";
  subtasks: { id: string; label: string; done: boolean }[];
  checklist: { id: string; label: string; done: boolean }[];
  comments: { id: string; user: string; text: string; at: string }[];
  timeSpentMinutes: number;
};
