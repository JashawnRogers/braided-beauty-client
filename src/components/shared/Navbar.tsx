import { useEffect, useState } from "react";
import Logo from "@/assets/logos/Black-official-logo.jpeg";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { hardLogout } from "@/lib/authClient";

const menuItems = [
  { name: "About", href: "/about" },
  { name: "Policies", href: "/policies" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, isLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleDashboardClick() {
    if (!user) return;

    if (user.memberStatus === "ADMIN") {
      navigate("/dashboard/admin", { replace: false });
    } else {
      navigate("/dashboard/me", { replace: false });
    }

    closeMenu();
  }

  function DashboardLink({ className }: { className?: string }) {
    if (isLoading || !isAuthenticated || !user) return null;

    return (
      <Button
        type="button"
        onClick={handleDashboardClick}
        className={cn(className)}
      >
        Dashboard
      </Button>
    );
  }

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="relative">
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={cn(
          "fixed inset-x-0 top-0 z-50 px-3 pt-3 lg:transition-[padding] lg:duration-500 lg:ease-out",
          isScrolled ? "lg:px-6" : "lg:px-0"
        )}
      >
        <div
          className={cn(
            "w-full rounded-2xl bg-transparent transition-[background-color,box-shadow,border-color] duration-300 lg:origin-top lg:transform lg:transition-[transform,background-color,box-shadow,border-color] lg:duration-500 lg:ease-out",
            isScrolled
              ? "border border-border/60 bg-background/80 shadow-lg supports-[backdrop-filter]:backdrop-blur-md lg:scale-[0.975]"
              : "lg:scale-100"
          )}
        >
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-10 xl:px-12">
            {/* Left: logo */}
            <Link
              to="/"
              aria-label="Braided Beauty home"
              className="col-start-1 flex items-center"
              onClick={closeMenu}
            >
              <img
                src={Logo}
                alt="Braided Beauty Logo"
                loading="eager"
                fetchPriority="high"
                className="h-16 w-auto rounded-md sm:h-20 lg:h-24"
              />
            </Link>

            {/* Center: mobile brand text */}
            {!isHomePage && (
              <div className="col-start-2 min-w-0 text-center lg:hidden">
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="block truncate text-2xl font-semibold leading-none tracking-tight text-foreground"
                >
                  Braided Beauty
                </Link>
              </div>
            )}

            {/* Desktop center nav */}
            <div className="hidden lg:flex lg:justify-self-center">
              <ul className="flex items-center gap-10 xl:gap-12">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-lg xl:text-xl font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop right actions */}
            <div className="hidden lg:flex lg:justify-self-end">
              <div className="flex items-center gap-3">
                {!isAuthenticated && (
                  <>
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
                {isAuthenticated && (
                  <DashboardLink className="border border-border bg-transparent text-foreground hover:bg-accent" />
                )}
                <Button asChild size="sm">
                  <Link to="/categories">Book Appointment</Link>
                </Button>
              </div>
            </div>

            {/* Right: mobile toggle */}
            {!menuOpen && (
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded="false"
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen(true)}
                className="col-start-3 justify-self-end inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-sm transition hover:bg-accent lg:hidden"
              >
                <Menu className="size-5" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile backdrop + drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMenu}
          className={cn(
            "absolute inset-0 h-full w-full bg-black/40 transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Drawer */}
        <div
          id="mobile-menu"
          className={cn(
            "absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-background shadow-2xl transition-transform duration-300",
            menuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b px-5 py-4">
            <Link
              to="/"
              onClick={closeMenu}
              aria-label="Go to home page"
              className="flex items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <img
                src={Logo}
                alt="Braided Beauty Logo"
                className="h-12 w-auto rounded-md"
              />
              <span className="text-lg font-semibold">Menu</span>
            </Link>

            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-accent"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-between px-5 py-6">
            <ul className="space-y-5">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={closeMenu}
                    className="block text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-3">
              {!isAuthenticated && (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/login" onClick={closeMenu}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" className="w-full">
                    <Link to="/signup" onClick={closeMenu}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
              {isAuthenticated && (
                <>
                  <DashboardLink className="w-full border border-border bg-transparent text-foreground hover:bg-accent" />
                  <Button
                    asChild
                    variant="secondary"
                    className="w-full"
                    onClick={hardLogout}
                  >
                    Log out
                  </Button>
                </>
              )}
              <Button asChild className="w-full">
                <Link to="/categories" onClick={closeMenu}>
                  Book Appointment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
