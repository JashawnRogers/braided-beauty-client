import { useEffect, useState } from "react";
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
import { AppointmentSummaryDTO, Page } from "../types";
import { apiGet } from "@/lib/apiClient";
import { Link } from "react-router-dom";
import { formatJavaDate } from "@/lib/date";
import { CancelAppointmentModal } from "../components/CancelAppointmentModal";
import { CheckCircle2, Clock, MapPin, Sparkles } from "lucide-react";

const PAST_PAGE_SIZE = 5;

export function UserAppointmentsPage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const [upcoming, setUpcoming] = useState<AppointmentSummaryDTO | null>(null);
  const [pastPage, setPastPage] = useState<Page<AppointmentSummaryDTO> | null>(
    null
  );

  const [pastPageIndex, setPastPageIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reloadKey, setReloadKey] = useState(0);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentSummaryDTO | null>(null);

  const handleCancel = (appointment: AppointmentSummaryDTO) => {
    setSelectedAppointment(appointment);
    setCancelOpen(true);
  };

  const handleCanceled = () => {
    setCancelOpen(false);
    setSelectedAppointment(null);

    setUpcoming(null);

    // Force reload of upcoming data
    setReloadKey((k) => k + 1);
  };

  // Fetch data whenever tab or page changes
  useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        if (tab === "upcoming") {
          const data = await apiGet<AppointmentSummaryDTO | null>(
            "/appointments/me/next"
          );

          if (!isCancelled) setUpcoming(data);
        } else {
          const data = await apiGet<Page<AppointmentSummaryDTO>>(
            `/appointments/me/previous?page=${pastPageIndex}&size=${PAST_PAGE_SIZE}`
          );

          if (!isCancelled) setPastPage(data);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error(err);
          setError("Something went wrong loading your appointments");
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [tab, pastPageIndex, reloadKey]);

  const rows =
    tab === "upcoming" ? (upcoming ? [upcoming] : []) : pastPage?.content ?? [];

  const handleTabChange = (value: string) => {
    const nextTab = value as "upcoming" | "past";
    setTab(nextTab);
    if (nextTab === "past") {
      // Reset to first page when switching to past tab
      setPastPageIndex(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Appointments</h1>
        <p className="text-sm text-muted-foreground mt-2">
          View, manage and book your next appointments.
        </p>
        <Button variant="default" size="lg" className="mt-3">
          <Link to="/categories">Book Next Appointment</Link>
        </Button>
      </header>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your appointments
            </CardTitle>
            <Tabs
              value={tab}
              onValueChange={handleTabChange}
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
          {/* Loading / error states */}
          {isLoading && (
            <p className="py-6 text-sm text-muted-foreground">
              Loading appointments...
            </p>
          )}

          {error && <p className="py-6 text-sm text-destructive">{error}</p>}

          {!isLoading && !error && rows.length === 0 && (
            <p className="py-6 text-sm text-muted-foreground">
              {tab === "upcoming"
                ? "You don’t have any upcoming appointments."
                : "You don’t have any past appointments yet."}
            </p>
          )}

          {/* Content */}
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatJavaDate(appointment.appointmentTime)}
                    </TableCell>
                    <TableCell>{appointment.serviceName}</TableCell>
                    <TableCell>
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {appointment.appointmentStatus?.toLowerCase()}
                      </span>
                    </TableCell>
                    {tab === "upcoming" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleCancel(appointment)}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination controls for past appointments */}
          {tab === "past" && pastPage && pastPage.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <p className="text-xs text-muted-foreground">
                Page {pastPage.number + 1} of {pastPage.totalPages}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pastPage.number === 0 || isLoading}
                  onClick={() =>
                    setPastPageIndex((prev) => Math.max(prev - 1, 0))
                  }
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    pastPage.number + 1 >= pastPage.totalPages || isLoading
                  }
                  onClick={() =>
                    setPastPageIndex((prev) =>
                      pastPage
                        ? Math.min(prev + 1, pastPage.totalPages - 1)
                        : prev + 1
                    )
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {tab === "upcoming" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Before your appointment
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border p-4 transition-colors hover:border-amber-300/60 hover:bg-amber-50/40 dark:hover:bg-amber-950/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-amber-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Come prepped</p>
                    <p className="text-xs text-muted-foreground">
                      Please arrive with your hair{" "}
                      <span className="font-medium">washed and blow-dried</span>
                      .
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 transition-colors hover:border-amber-300/60 hover:bg-amber-50/40 dark:hover:bg-amber-950/20">
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-amber-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Arrival window</p>
                    <p className="text-xs text-muted-foreground">
                      There is a{" "}
                      <span className="font-medium">
                        10-minute grace period
                      </span>
                      . After that, a late fee may apply.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 transition-colors hover:border-amber-300/60 hover:bg-amber-50/40 dark:hover:bg-amber-950/20">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-amber-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Confirm details</p>
                    <p className="text-xs text-muted-foreground">
                      Double-check your date/time and add-ons before your visit.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 transition-colors hover:border-amber-300/60 hover:bg-amber-50/40 dark:hover:bg-amber-950/20">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-amber-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Need help?</p>
                    <p className="text-xs text-muted-foreground">
                      If you have any questions, reply to your confirmation
                      email.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              These reminders help your appointment start on time and go
              smoothly.
            </p>
          </CardContent>
        </Card>
      )}

      <CancelAppointmentModal
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        appointment={selectedAppointment}
        onCanceled={handleCanceled}
      />
    </div>
  );
}
