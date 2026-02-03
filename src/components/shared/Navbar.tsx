import { useEffect, useState } from "react";
import Logo from "@/assets/bb-logo.svg";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const menuItems = [
  { name: "Gallery", href: "/" },
  { name: "Book an appointment", href: "/categories" },
  { name: "Meet your braider", href: "/" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, isLoading } = useUser();

  const navigate = useNavigate();

  function handleDashboardClick() {
    if (!user) return;

    if (user.memberStatus === "ADMIN") {
      navigate("/dashboard/admin", { replace: false });
    } else {
      navigate("/dashboard/me", { replace: false });
    }
  }

  function DashboardLink({ className }: { className: string }) {
    if (isLoading) return null;
    if (!isAuthenticated || !user) return null;

    return (
      <Button
        type="button"
        onClick={() => {
          handleDashboardClick();
          setMenuOpen(false);
        }}
        className={cn("duration-150 hover:text-accent-foreground", className)}
      >
        Dashboard
      </Button>
    );
  }

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // optional: close the menu when resizing to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header role="banner" className="relative overflow-x-hidden">
      <nav
        role="navigation"
        aria-label="Main"
        className="fixed inset-x-0 top-0 z-20 w-full px-2"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              // feature-detect backdrop-filter so it degrades gracefully
              "max-w-4xl rounded-2xl border bg-background/50 lg:px-5 supports-[backdrop-filter]:bg-background/40 supports-[backdrop-filter]:backdrop-blur-lg"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            {/* Brand + mobile toggle */}
            <div className="flex w-full items-center justify-between lg:w-auto">
              <Link
                to="/"
                aria-label="Home"
                className="flex items-center gap-2"
              >
                <img
                  src={Logo}
                  alt="Braided Beauty Logo"
                  loading="eager"
                  fetchPriority="high"
                  className="h-10 w-auto rounded-md"
                />
                <h3 className="font-semibold">Braided Beauty</h3>
              </Link>

              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen((v) => !v)}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu
                  className={cn(
                    "m-auto size-6 transition duration-200",
                    menuOpen && "rotate-180 scale-0 opacity-0"
                  )}
                />
                <X
                  className={cn(
                    "absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 transition duration-200",
                    menuOpen && "rotate-0 scale-100 opacity-100"
                  )}
                />
              </button>
            </div>

            {/* Desktop menu (centered) */}
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="block text-muted-foreground duration-150 hover:text-accent-foreground text-base font-semibold"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions + Mobile menu panel */}
            <div
              id="mobile-menu"
              className={cn(
                "mb-6 mx-auto hidden max-w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border bg-background px-4 shadow-2xl shadow-zinc-300/20 sm:px-6 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none",
                menuOpen && "block lg:flex"
              )}
            >
              {/* Mobile links */}
              <div className="lg:hidden pt-3">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="block text-muted-foreground duration-150 hover:text-accent-foreground"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}

                  {/* <li>
                    <DashboardLink className="text-muted-foreground" />
                  </li> */}
                </ul>
              </div>

              {/* Auth/CTA */}
              {!isAuthenticated ? (
                <div className="flex w-full flex-col space-y-3 pb-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                  {/* On mobile, show Login/Sign Up; on scroll */}
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className={cn(isScrolled)}
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild size="sm" className={cn(isScrolled)}>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex w-full flex-col space-y-3 pb-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                  <DashboardLink className="text-muted-foreground text-white mt-3" />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
