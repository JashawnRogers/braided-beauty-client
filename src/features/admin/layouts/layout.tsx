import { cn } from "@/lib/utils";
import { CoreLayoutProps } from "ra-core";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "@/features/admin/components/user-menu";
import { ThemeModeToggle } from "@/features/admin/hooks/theme-mode-toggle";
import { Notification } from "@/features/admin/hooks/notification";
import { AppSidebar } from "@/features/admin/layouts/app-sidebar";
import { RefreshButton } from "@/features/admin/components/buttons/refresh-button";
import { LocalesMenuButton } from "@/features/admin/components/buttons/locales-menu-button";

export const Layout = (props: CoreLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main
        className={cn(
          "ml-auto w-full max-w-full",
          "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
          "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
          "sm:transition-[width] sm:duration-200 sm:ease-linear",
          "flex h-svh flex-col",
          "group-data-[scroll-locked=1]/body:h-full",
          "has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh"
        )}
      >
        <header className="flex h-16 md:h-12 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="scale-125 sm:scale-100" />
          <div className="flex-1 flex items-center" id="breadcrumb" />
          <LocalesMenuButton />
          <ThemeModeToggle />
          <RefreshButton />
          <UserMenu />
        </header>
        <div className="flex flex-1 flex-col px-4 ">{props.children}</div>
      </main>
      <Notification />
    </SidebarProvider>
  );
};
