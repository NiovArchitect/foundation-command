import * as React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarNavigation } from "@/components/console/SidebarNavigation";
import { TopBar } from "@/components/console/TopBar";
import { DataModeBanner } from "@/components/console";

export const Route = createFileRoute("/console")({
  component: ConsoleLayout,
});

function ConsoleLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <DataModeBanner />
      <TopBar onMenuClick={() => setMobileOpen((v) => !v)} />
      <div className="flex min-h-0 flex-1">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex">
          <SidebarNavigation />
        </div>
        {/* Mobile sidebar drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div
              className="flex-1 bg-background/60 backdrop-blur-[1px]"
              onClick={() => setMobileOpen(false)}
            />
            <SidebarNavigation onNavigate={() => setMobileOpen(false)} />
          </div>
        )}
        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
