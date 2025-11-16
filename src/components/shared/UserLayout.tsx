import { Outlet, NavLink } from "react-router";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { cn } from "@/lib/utils";
import LOGO from "../../assets/bb-logo.svg";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      {/* Replace with your real logo component/image */}
      <img
        src={LOGO}
        alt="Braided Beauty Logo"
        loading="eager"
        fetchPriority="high"
        className="h-7 w-auto rounded-md"
      />
      <span className="text-sm font-semibold tracking-tight">
        Braided Beauty
      </span>
    </div>
  );
}

const navItems = [
  { to: "/me", label: "Dashboard", end: true },
  { to: "/me/appointments", label: "Appointments" },
  { to: "/me/profile", label: "Profile" },
];

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-muted">
      {/* Mobile top bar */}
      <header className="border-b bg-background md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                <div className="border-b px-4 py-3">
                  <Logo />
                </div>
                <nav className="flex-1 space-y-1 px-2 py-4">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                          isActive
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
                <div className="border-t px-4 py-3">
                  {/* Wire up to log out handler */}
                  <Button variant="outline" className="w-full" size="sm">
                    Log out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex h-screen max-w-none">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-64 border-r bg-background md:flex md:flex-col">
          <div className="flex items-center justify-between border-b px-4 py-4">
            <Logo />
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t px-4 py-4">
            {/* Wire up to log out handler */}
            <Button variant="outline" className="w-full" size="sm">
              Log out
            </Button>
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 md:px-12 lg:px-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
