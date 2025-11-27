import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Shape you can adjust to match your API DTOs
type AppointmentStatus = "UPCOMING" | "COMPLETED" | "CANCELLED";

type AppointmentRow = {
  id: string;
  startAt: string; // ISO string from backend
  startDisplay: string; // preformatted, or format on the client
  serviceName: string;
  stylistName: string;
  status: AppointmentStatus;
  canCancel: boolean;
};

// TEMP: mock data until you wire the API
const MOCK_APPOINTMENTS: AppointmentRow[] = [
  {
    id: "1",
    startAt: "2025-04-15T10:00:00Z",
    startDisplay: "Apr 15, 2025 • 10:00 AM",
    serviceName: "Small Box Braids",
    stylistName: "Courtney Reld",
    status: "UPCOMING",
    canCancel: true,
  },
  {
    id: "2",
    startAt: "2025-03-10T14:00:00Z",
    startDisplay: "Mar 10, 2025 • 2:00 PM",
    serviceName: "Knotless Braids",
    stylistName: "Courtney Reld",
    status: "COMPLETED",
    canCancel: false,
  },
];

export function UserAppointmentsPage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  // TODO: replace this with a real data-fetching hook:
  // const { data, isLoading, error } = useAppointments(tab);
  const upcoming = MOCK_APPOINTMENTS.filter((a) => a.status === "UPCOMING");
  const past = MOCK_APPOINTMENTS.filter(
    (a) => a.status === "COMPLETED" || a.status === "CANCELLED"
  );

  const rows = tab === "upcoming" ? upcoming : past;

  const handleCancel = (appointmentId: string) => {
    // TODO: call your cancel endpoint here
    // await api.cancelAppointment(appointmentId);
    // refetch appointments
    console.log("Cancel appointment", appointmentId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Appointments</h1>
        <p className="text-sm text-muted-foreground">
          View and manage your appointments.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your appointments
            </CardTitle>
            <Tabs
              value={tab}
              onValueChange={(v) => setTab(v as "upcoming" | "past")}
              className="w-full md:w-auto"
            >
              <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent>
          {/* TODO: if you use a real data hook, show loading/error states here */}
          {rows.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">
              {tab === "upcoming"
                ? "You don’t have any upcoming appointments."
                : "You don’t have any past appointments yet."}
            </p>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Stylist</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((appt) => (
                    <TableRow key={appt.id}>
                      <TableCell className="whitespace-nowrap">
                        {appt.startDisplay}
                      </TableCell>
                      <TableCell>{appt.serviceName}</TableCell>
                      <TableCell>{appt.stylistName}</TableCell>
                      <TableCell>
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {appt.status.toLowerCase()}
                        </span>
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          // TODO: later: open a details dialog / navigate to detail page
                          onClick={() => console.log("View", appt.id)}
                        >
                          View
                        </Button>

                        {tab === "upcoming" && appt.canCancel && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleCancel(appt.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
