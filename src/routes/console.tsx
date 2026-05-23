import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarNavigation } from "@/components/console/SidebarNavigation";
import { TopBar } from "@/components/console/TopBar";
import { MockDataBanner } from "@/components/console";

export const Route = createFileRoute("/console")({
  component: ConsoleLayout,
});

function ConsoleLayout() {
  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <MockDataBanner />
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <SidebarNavigation />
        <main className="min-w-0 flex-1 overflow-y-auto px-6 py-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
