import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type {
  ServiceCategoryResponseDTO,
  ServiceResponseDTO,
} from "@/features/account/types";
import { apiPublicGet } from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import { Fragment, useEffect, useState } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";

type Crumb = Readonly<{
  label: string;
  to?: string;
}>;

type SiteBreadcrumbsProps = Readonly<{
  className?: string;
}>;

function getPublicBreadcrumbs(pathname: string): Crumb[] {
  if (pathname === "/" || matchPath("/auth/callback", pathname)) {
    return [];
  }

  const routes: Array<{ pattern: string; crumbs: Crumb[] }> = [
    {
      pattern: "/about",
      crumbs: [
        { label: "Home", to: "/" },
        { label: "About" },
      ],
    },
    {
      pattern: "/policies",
      crumbs: [
        { label: "Home", to: "/" },
        { label: "Policies" },
      ],
    },
    {
      pattern: "/contact",
      crumbs: [
        { label: "Home", to: "/" },
        { label: "Contact" },
      ],
    },
    {
      pattern: "/login",
      crumbs: [
        { label: "Home", to: "/" },
        { label: "Login" },
      ],
    },
    {
      pattern: "/signup",
      crumbs: [
        { label: "Home", to: "/" },
        { label: "Sign Up" },
      ],
    },
    {
      pattern: "/forgot-password",
      crumbs: [
        { label: "Home", to: "/" },
        { label: "Forgot Password" },
      ],
    },
    {
      pattern: "/reset-password",
      crumbs: [
        { label: "Home", to: "/" },
        { label: "Reset Password" },
      ],
    },
    {
      pattern: "/bootstrap-admin",
      crumbs: [
        { label: "Home", to: "/" },
        { label: "Bootstrap Admin" },
      ],
    },
    {
      pattern: "/categories",
      crumbs: [
        { label: "Home", to: "/" },
        { label: "Categories" },
      ],
    },
    {
      pattern: "/services/:categoryId",
      crumbs: [
        { label: "Home", to: "/" },
        { label: "Categories", to: "/categories" },
        { label: "Services" },
      ],
    },
    {
      pattern: "/book/service/:serviceId",
      crumbs: [
        { label: "Home", to: "/" },
        { label: "Categories", to: "/categories" },
        { label: "Service Details" },
      ],
    },
    {
      pattern: "/book/success",
      crumbs: [
        { label: "Home", to: "/" },
        { label: "Book Appointment", to: "/categories" },
        { label: "Booking Success" },
      ],
    },
    {
      pattern: "/book/final/success",
      crumbs: [
        { label: "Home", to: "/" },
        { label: "Book Appointment", to: "/categories" },
        { label: "Payment Success" },
      ],
    },
    {
      pattern: "/book/cancel",
      crumbs: [
        { label: "Home", to: "/" },
        { label: "Book Appointment", to: "/categories" },
        { label: "Booking Cancelled" },
      ],
    },
    {
      pattern: "/guest/cancel/:token",
      crumbs: [
        { label: "Home", to: "/" },
        { label: "Cancel Appointment" },
      ],
    },
  ];

  const matchedRoute = routes.find(({ pattern }) => matchPath(pattern, pathname));

  if (matchedRoute) {
    return matchedRoute.crumbs;
  }

  return [
    { label: "Home", to: "/" },
    { label: pathname.split("/").filter(Boolean).at(-1) ?? "Page" },
  ];
}

function getAccountBreadcrumbs(pathname: string): Crumb[] {
  const routes: Array<{ pattern: string; crumbs: Crumb[] }> = [
    {
      pattern: "/dashboard/me",
      crumbs: [
        { label: "Home", to: "/" },
        { label: "My Account" },
      ],
    },
    {
      pattern: "/dashboard/me/appointments",
      crumbs: [
        { label: "Home", to: "/" },
        { label: "My Account", to: "/dashboard/me" },
        { label: "Appointments" },
      ],
    },
    {
      pattern: "/dashboard/me/profile",
      crumbs: [
        { label: "Home", to: "/" },
        { label: "My Account", to: "/dashboard/me" },
        { label: "Profile" },
      ],
    },
  ];

  const matchedRoute = routes.find(({ pattern }) => matchPath(pattern, pathname));
  return matchedRoute?.crumbs ?? [];
}

async function buildPublicBreadcrumbs(pathname: string): Promise<Crumb[]> {
  const serviceMatch = matchPath("/book/service/:serviceId", pathname);
  if (serviceMatch?.params.serviceId) {
    try {
      const service = await apiPublicGet<ServiceResponseDTO>(
        `/service/${serviceMatch.params.serviceId}`
      );

      return [
        { label: "Home", to: "/" },
        { label: "Categories", to: "/categories" },
        {
          label: service.categoryName || "Services",
          to: service.categoryId ? `/services/${service.categoryId}` : undefined,
        },
        { label: service.name || "Service Details" },
      ];
    } catch {
      return getPublicBreadcrumbs(pathname);
    }
  }

  const categoryMatch = matchPath("/services/:categoryId", pathname);
  if (categoryMatch?.params.categoryId) {
    try {
      const categories = await apiPublicGet<ServiceCategoryResponseDTO[]>(
        "/category"
      );
      const currentCategory = categories.find(
        (category) => category.id === categoryMatch.params.categoryId
      );

      return [
        { label: "Home", to: "/" },
        { label: "Categories", to: "/categories" },
        { label: currentCategory?.name || "Services" },
      ];
    } catch {
      return getPublicBreadcrumbs(pathname);
    }
  }

  return getPublicBreadcrumbs(pathname);
}

export default function SiteBreadcrumbs({
  className,
}: SiteBreadcrumbsProps) {
  const location = useLocation();
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadBreadcrumbs = async () => {
      const nextCrumbs = location.pathname.startsWith("/dashboard/me")
        ? getAccountBreadcrumbs(location.pathname)
        : await buildPublicBreadcrumbs(location.pathname);

      if (!cancelled) {
        setCrumbs(nextCrumbs);
      }
    };

    loadBreadcrumbs();

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <div className={cn("hidden md:block", className)}>
      <div className="px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="w-fit max-w-full rounded-full border border-border/70 bg-background/90 px-4 py-2 shadow-sm supports-[backdrop-filter]:backdrop-blur">
          <Breadcrumb>
            <BreadcrumbList>
              {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1;

                return (
                  <Fragment key={`${crumb.label}-${index}`}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={crumb.to ?? "#"}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </div>
  );
}
