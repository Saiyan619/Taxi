import { Outlet } from "react-router";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { UpgradeDialog } from "@/features/billing/components/UpgradeDialog";
import { useState } from "react";

// Wrap your routed pages with this layout, e.g.:
//   <Route element={<AppLayout />}>
//     <Route path="/dashboard" element={<DashboardPage />} />
//     ...
//   </Route>

export function AppLayout() {
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="ml-auto">
            <Button
              size="sm"
              className="gap-2 rounded-full px-4"
              onClick={() => setUpgradeOpen(true)}
            >
              <Sparkles className="size-4" />
              Upgrade
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </SidebarProvider>
  );
}