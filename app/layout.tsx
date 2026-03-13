import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FlowPilot | AI Productivity Platform",
  description: "Simple, fast project management with AI workflows"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
