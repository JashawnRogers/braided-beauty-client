import { useLoaderData, Link } from "react-router-dom";
import { UserDashboardDTO, LoyaltyTier } from "../types";
import { formatJavaDate } from "@/lib/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarPlus, ClipboardList, Sparkles } from "lucide-react";

export function UserDashboardPage() {
  const profile = useLoaderData<UserDashboardDTO>();
  console.log("📄 useLoaderData in page:", profile);

  if (!profile) {
    return <p>Loading...</p>;
  }

  const firstName = (profile.name.split(" ")[0] ?? profile.name) || "Guest";
  const appointmentCount = profile.appointmentCount;

  function displayLoyaltyTier(loyaltyTier: LoyaltyTier) {
    if (loyaltyTier === "GOLD") {
      return <p className="text-lg font-semibold text-amber-500">Gold</p>;
    }

    if (loyaltyTier === "SILVER") {
      return <p className="text-lg font-semibold text-gray-600">Silver</p>;
    }

    return <p className="text-lg font-semibold text-amber-800">Bronze</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {firstName}
        </p>
      </div>

      {/* Top row: next appt + metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Next appointment
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {profile.nextApt ? (
              <div className="pt-5">
                <p className="text-2xl font-medium">
                  {formatJavaDate(profile.nextApt?.appointmentTime)}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold">
                    {profile.nextApt?.serviceName}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                You don’t have any upcoming appointments.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Loyalty tier
              </CardTitle>
            </CardHeader>
            <CardContent>{displayLoyaltyTier(profile.loyaltyTier)}</CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Appointment history
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{appointmentCount}</p>
              <p className="text-xs text-muted-foreground">
                Completed appointments
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom section: quick actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Quick actions
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Book */}
          <Link to="/categories" className="group block">
            <div
              className="relative rounded-xl border p-4 transition-all
                      hover:border-amber-400/70
                      hover:bg-amber-50/40
                      hover:shadow-sm"
            >
              <div className="flex items-start gap-3">
                <CalendarPlus className="h-5 w-5 text-muted-foreground transition group-hover:text-amber-600" />
                <div>
                  <p className="text-sm font-medium">Book an appointment</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Browse services and pick a time.
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Manage appointments */}
          <Link to="/dashboard/me/appointments" className="group block">
            <div
              className="relative rounded-xl border p-4 transition-all
                      hover:border-amber-400/70
                      hover:bg-amber-50/40
                      hover:shadow-sm"
            >
              <div className="flex items-start gap-3">
                <ClipboardList className="h-5 w-5 text-muted-foreground transition group-hover:text-amber-600" />
                <div>
                  <p className="text-sm font-medium">Manage appointments</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    View, cancel, and track your bookings.
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Contextual card */}
          {profile.nextApt ? (
            <div className="rounded-xl border p-4 bg-amber-50/30 border-amber-200">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium">Next appointment</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatJavaDate(profile.nextApt.appointmentTime)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <span className="font-medium">
                      {profile.nextApt.serviceName}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/categories" className="group block">
              <div
                className="relative rounded-xl border p-4 transition-all
                        hover:border-amber-400/70
                        hover:bg-amber-50/40
                        hover:shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-muted-foreground transition group-hover:text-amber-600" />
                  <div>
                    <p className="text-sm font-medium">
                      No upcoming appointment
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ready to book your next one?
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
