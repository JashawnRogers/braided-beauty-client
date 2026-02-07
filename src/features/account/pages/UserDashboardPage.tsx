import { useLoaderData } from "react-router-dom";
import { UserDashboardDTO, LoyaltyTier } from "../types";
import { formatJavaDate } from "@/lib/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
              <>
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
                <div className="flex">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              </>
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

      {/* Bottom section: upcoming appointments list */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Upcoming appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* For now just a placeholder; later replace with table/list */}
          <p className="text-sm text-muted-foreground">
            No upcoming appointments to show.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
