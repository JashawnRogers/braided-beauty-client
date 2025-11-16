import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function UserDashboardPage() {
  // TODO: replace with real data from your API hook
  const userName = "Jane"; // from auth/me
  const hasUpcomingAppointment = true;
  const nextAppointment = {
    dateTimeDisplay: "April 15, 2024 • 10:00 AM",
    serviceName: "Small Box Braids",
    stylistName: "Courtney Reld",
  };
  const loyaltyTier = "Gold";
  const appointmentHistoryCount = 6;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {userName}
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
            {hasUpcomingAppointment ? (
              <>
                <div className="pt-5">
                  <p className="text-2xl font-medium">
                    {nextAppointment.dateTimeDisplay}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-bold">
                      {nextAppointment.serviceName}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
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
            <CardContent>
              <p className="text-lg font-semibold text-amber-700">
                {loyaltyTier}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Appointment history
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{appointmentHistoryCount}</p>
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
