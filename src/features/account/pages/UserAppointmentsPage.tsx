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

const PAST_PAGE_SIZE = 5;

export function UserAppointmentsPage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const [upcoming, setUpcoming] = useState<AppointmentSummaryDTO[]>([]);
  const [pastPage, setPastPage] = useState<Page<AppointmentSummaryDTO> | null>(
    null
  );

  const [pastPageIndex, setPastPageIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data whenever tab or page changes
  useEffect(() => {
    let isCancelled = false;

    // fetchData() is called within the useEffect
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        if (tab === "upcoming") {
          const data = await apiGet<AppointmentSummaryDTO[]>(
            `${import.meta.env.VITE_SERVER_API_URL}/appointments/me/next`
          );

          if (!isCancelled) {
            setUpcoming(data);
          }
        } else {
          const data = await apiGet<Page<AppointmentSummaryDTO>>(
            `${
              import.meta.env.VITE_SERVER_API_URL
            }/appointments/me/previous?page=${pastPageIndex}$size=${PAST_PAGE_SIZE}`
          );

          if (!isCancelled) {
            setPastPage(data);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.error(err);
          setError("Something went wrong loading your appointments");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }

      fetchData();

      return () => {
        isCancelled = true;
      };
    }
  }, [tab, pastPageIndex]);

  const rows = tab === "upcoming" ? upcoming : pastPage?.content ?? [];

  const handleCancel = async (appointmentId: string) => {
    // call cancel appointment endpoint
    console.log("Cancel appointment", appointmentId);
  };

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
          <Link to="/services">Book Next Appointment</Link>
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

          {(rows.length === 0 || upcoming.length === 0) && (
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
                      {appointment.appointmentTime}
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
                        onClick={() => handleCancel(appointment.id)}
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
    </div>
  );
}
