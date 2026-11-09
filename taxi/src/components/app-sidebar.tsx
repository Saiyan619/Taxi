"use client";

import * as React from "react";
import { Link, useLocation } from "react-router";
import {
  ChevronsUpDown,
  LayoutDashboard,
  Inbox,
  // FolderKanban,
  // CheckSquare,
  // CalendarDays,
  // BarChart3,
  Settings,
  HelpCircle,
  MessageSquare,
  LogOut,
  Loader2,
  User,
  CreditCard,
  // Bell, // TODO: come back to implementing notifications — re-enable this import too.
  // ChevronRight,
  Building2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarMenuSub,
  // SidebarMenuSubButton,
  // SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetGeneratedContent } from "@/features/ai/hooks/aiHook";
import { useLogout } from "@/features/auth/hooks/authHook";
import { useGetMe } from "@/features/home/hooks/userHook";
import { useCreateBillingPortal } from "@/features/billing/hooks/billingHook";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// ---------------------------------------------------------------------------
// Static data — swap these for real data from your auth/session + API layer.
// ---------------------------------------------------------------------------

const mainNav = [
  { title: "Home", url: "/home", icon: LayoutDashboard },
  { title: "Articulations", url: "/articulations", icon: Inbox },
  // {
  //   title: "Projects",
  //   icon: FolderKanban,
  //   items: [
  //     { title: "Website Redesign", url: "/projects/website-redesign" },
  //     { title: "Mobile App", url: "/projects/mobile-app" },
  //     { title: "Q3 Marketing", url: "/projects/q3-marketing" },
  //   ],
  // },
  // { title: "Tasks", url: "/tasks", icon: CheckSquare },
  // { title: "Calendar", url: "/calendar", icon: CalendarDays },
  // { title: "Analytics", url: "/analytics", icon: BarChart3 },
] as const;

const secondaryNav = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help & Support", url: "/help", icon: HelpCircle },
  { title: "Feedback", url: "/feedback", icon: MessageSquare },
] as const;

// ---------------------------------------------------------------------------

export function AppSidebar() {
  const location = useLocation();
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const { generatedData } = useGetGeneratedContent();
  const { data: profileData } = useGetMe();
  const { logoutUser, isPending: isLoggingOut } = useLogout();
  const { openPortal, isPending: isPortalPending } = useCreateBillingPortal();

  const isActive = (url: string) => location.pathname === url;
  const currentUser = {
    name: profileData?.user.name?.trim() || "User",
    email: profileData?.user.email || "arokoyueb11@gmail.com",
    avatarUrl: "",
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      {/* ---------------------------------------------------------------- */}
      {/* Header: workspace identity                                      */}
      {/* ---------------------------------------------------------------- */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Taxci Inc.</span>
                <span className="truncate text-xs text-sidebar-foreground/60">
                  Taxi
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* ---------------------------------------------------------------- */}
      {/* Content: main + secondary nav                                     */}
      {/* ---------------------------------------------------------------- */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => {
                if ("items" in item) {
                  // return (
                  //   <Collapsible
                  //     key={item.title}
                  //     defaultOpen={item.items.some((sub) =>
                  //       isActive(sub.url)
                  //     )}
                  //     className="group/collapsible"
                  //   >
                  //     <SidebarMenuItem>
                  //       <CollapsibleTrigger
                  //         render={<SidebarMenuButton tooltip={item.title} />}
                  //       >
                  //         <item.icon />
                  //         <span>{item.title}</span>
                  //         <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  //       </CollapsibleTrigger>
                  //       <CollapsibleContent>
                  //         <SidebarMenuSub>
                  //           {item.items.map((sub) => (
                  //             <SidebarMenuSubItem key={sub.title}>
                  //               <SidebarMenuSubButton
                  //                 render={<Link to={sub.url} />}
                  //                 isActive={isActive(sub.url)}
                  //               >
                  //                 <span>{sub.title}</span>
                  //               </SidebarMenuSubButton>
                  //             </SidebarMenuSubItem>
                  //           ))}
                  //         </SidebarMenuSub>
                  //       </CollapsibleContent>
                  //     </SidebarMenuItem>
                  //   </Collapsible>
                  // );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link to={item.url} />}
                      tooltip={item.title}
                      isActive={isActive(item.url)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {item.title === "Articulations" && (
                      generatedData?.length > 0 ? (
                      <SidebarMenuBadge>{generatedData?.length}</SidebarMenuBadge>
                    ) : (
                    <SidebarMenuBadge>0</SidebarMenuBadge> )
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup >
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link to={item.url} />}
                    tooltip={item.title}
                    isActive={isActive(item.url)}
                    size="sm"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      {/* ---------------------------------------------------------------- */}
      {/* Footer: user menu                                                */}
      {/* ---------------------------------------------------------------- */}
      <SidebarFooter>
        <SidebarMenu>
          {/**
           * TODO (coming back to this): notifications are commented out for now.
           * Restore the block below once /notifications exists and the badge
           * reads real unread counts instead of the hardcoded 3.
           *
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link to="/notifications" />} size="sm">
              <Bell />
              <span>Notifications</span>
              <SidebarMenuBadge className="static ml-auto peer-hover/menu-button:text-sidebar-accent-foreground">
                3
              </SidebarMenuBadge>
            </SidebarMenuButton>
          </SidebarMenuItem>
           */}

          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  />
                }
              >
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {currentUser.name}
                  </span>
                  <span className="truncate text-xs text-sidebar-foreground/60">
                    {currentUser.email}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
                side="right"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="size-8 rounded-lg">
                        <AvatarImage
                          src={currentUser.avatarUrl}
                          alt={currentUser.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          {currentUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {currentUser.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {currentUser.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem render={<Link to="/account" />} className="gap-2">
                    <User className="size-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2"
                    onClick={() => void openPortal()}
                    disabled={isPortalPending}
                  >
                    {isPortalPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <CreditCard className="size-4" />
                    )}
                    {isPortalPending ? "Opening billing..." : "Billing"}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 text-destructive focus:text-destructive"
                  onClick={() => setLogoutDialogOpen(true)}
                >
                  <LogOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <AlertDialog
        open={logoutDialogOpen}
        onOpenChange={(open) => {
          if (!isLoggingOut) {
            setLogoutDialogOpen(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of Taxi?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to sign in
              again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void logoutUser()}
              disabled={isLoggingOut}
              className="gap-1.5 bg-destructive text-white hover:bg-destructive/90"
            >
              {isLoggingOut && <Loader2 className="size-4 animate-spin" />}
              {isLoggingOut ? "Logging out..." : "Log out"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SidebarRail />
    </Sidebar>
  );
}