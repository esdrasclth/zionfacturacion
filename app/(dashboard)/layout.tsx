import { Sidebar } from "@/components/layout/sidebar";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-surface-1)" }}>
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto min-w-0">{children}</main>
    </div>
  );
}
