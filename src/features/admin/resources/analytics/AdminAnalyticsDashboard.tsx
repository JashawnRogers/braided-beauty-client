import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  MenuItem,
  Select,
  Typography,
  Skeleton,
  Alert,
  Chip,
} from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { apiGet } from "@/lib/apiClient";
import { buildMonthOptions } from "@/lib/months";

/** --- Types (match your backend DTOs) --- */
type ServicePopularityRow = {
  serviceId: string;
  name: string;
  completedCount: number;
};

type AdminMonthlyAnalyticsDTO = {
  month: string; // "2026-02" (YearMonth)
  completedAppointments: number;
  totalPaidByCard: string | number | null; // BigDecimal often arrives as string
  totalPaidByCash: string | number | null;
  mostPopularService: ServicePopularityRow | null;
  leastPopularService: ServicePopularityRow | null;
};

type AdminAllTimeAnalyticsDTO = {
  completedAppointmentsAllTime: number;
  totalPaidByCardAllTime: string | number | null;
  totalPaidByCashAllTime: string | number | null;
  mostPopularServiceAllTime: ServicePopularityRow | null;
  leastPopularServiceAllTime: ServicePopularityRow | null;
};

const GO_LIVE_YEAR = 2026;
const GO_LIVE_MONTH = 2;

/** --- Helpers --- */
function toNumber(v: string | number | null | undefined): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function money(v: string | number | null | undefined): string {
  const n = toNumber(v);
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function AdminAnalyticsDashboard() {
  const monthOptions = useMemo(
    () => buildMonthOptions(GO_LIVE_YEAR, GO_LIVE_MONTH),
    []
  );

  // Use the most recent option (current month) by default.
  const [month, setMonth] = useState<string>(
    monthOptions.at(-1)?.value ?? "2026-02"
  );

  const [monthly, setMonthly] = useState<AdminMonthlyAnalyticsDTO | null>(null);
  const [allTime, setAllTime] = useState<AdminAllTimeAnalyticsDTO | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [mRes, aRes] = await Promise.all([
          apiGet<AdminMonthlyAnalyticsDTO>(
            `/admin/analytics/monthly?month=${encodeURIComponent(month)}`
          ),
          apiGet<AdminAllTimeAnalyticsDTO>(`/admin/analytics/all-time`),
        ]);

        if (!cancelled) {
          setMonthly(mRes);
          setAllTime(aRes);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Failed to load analytics. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [month]);

  const monthCard = toNumber(monthly?.totalPaidByCard);
  const monthCash = toNumber(monthly?.totalPaidByCash);
  const allCard = toNumber(allTime?.totalPaidByCardAllTime);
  const allCash = toNumber(allTime?.totalPaidByCashAllTime);

  const paymentMixMonthData = useMemo(
    () => [
      { name: "Card", value: monthCard },
      { name: "Cash", value: monthCash },
    ],
    [monthCard, monthCash]
  );

  const paymentMixAllTimeData = useMemo(
    () => [
      { name: "Card", value: allCard },
      { name: "Cash", value: allCash },
    ],
    [allCard, allCash]
  );

  const popularityData = useMemo(() => {
    const most = monthly?.mostPopularService;
    const least = monthly?.leastPopularService;

    const rows: { name: string; value: number; kind: string }[] = [];
    if (most) {
      rows.push({
        name: most.name,
        value: most.completedCount,
        kind: "Most popular",
      });
    }
    if (least) {
      rows.push({
        name: least.name,
        value: least.completedCount,
        kind: "Least popular",
      });
    }
    return rows;
  }, [monthly?.mostPopularService, monthly?.leastPopularService]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2,
          flexDirection: { xs: "column", md: "row" },
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Month-to-date metrics and all-time totals.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Chip label="Monthly" variant="outlined" />
          <Select
            size="small"
            value={month}
            onChange={(e) => setMonth(String(e.target.value))}
            sx={{ minWidth: 140 }}
          >
            {monthOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* KPI cards */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card variant="outlined">
            <CardHeader
              title={
                <Typography variant="subtitle2" color="text.secondary">
                  Completed (month)
                </Typography>
              }
              sx={{ pb: 0 }}
            />
            <CardContent>
              {loading ? (
                <Skeleton height={40} />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {monthly?.completedAppointments ?? 0}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Month-to-date
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined">
            <CardHeader
              title={
                <Typography variant="subtitle2" color="text.secondary">
                  Paid by card (month)
                </Typography>
              }
              sx={{ pb: 0 }}
            />
            <CardContent>
              {loading ? (
                <Skeleton height={40} />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {money(monthly?.totalPaidByCard)}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Payments recorded as CARD
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card variant="outlined">
            <CardHeader
              title={
                <Typography variant="subtitle2" color="text.secondary">
                  Paid by cash (month)
                </Typography>
              }
              sx={{ pb: 0 }}
            />
            <CardContent>
              {loading ? (
                <Skeleton height={40} />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {money(monthly?.totalPaidByCash)}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Payments recorded as CASH
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card variant="outlined">
            <CardHeader
              title={
                <Typography variant="subtitle2" color="text.secondary">
                  Completed (all-time)
                </Typography>
              }
              sx={{ pb: 0 }}
            />
            <CardContent>
              {loading ? (
                <Skeleton height={40} />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {allTime?.completedAppointmentsAllTime ?? 0}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Total completed appointments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardHeader
              title={
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Payment mix (month)
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary">
                  Card vs cash totals
                </Typography>
              }
            />
            <Divider />
            <CardContent sx={{ height: 280 }}>
              {loading ? (
                <Skeleton height={240} />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentMixMonthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(v) => money(v as any)} />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardHeader
              title={
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Payment mix (all-time)
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary">
                  Card vs cash totals
                </Typography>
              }
            />
            <Divider />
            <CardContent sx={{ height: 280 }}>
              {loading ? (
                <Skeleton height={240} />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentMixAllTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(v) => money(v as any)} />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card variant="outlined">
            <CardHeader
              title={
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Service popularity (month)
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary">
                  Most and least popular (completed)
                </Typography>
              }
            />
            <Divider />
            <CardContent sx={{ height: 260 }}>
              {loading ? (
                <Skeleton height={220} />
              ) : popularityData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={popularityData}
                    layout="vertical"
                    margin={{ left: 16 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="kind" width={110} />
                    <Tooltip />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No popularity data available for this month yet.
                </Typography>
              )}
            </CardContent>

            {/* Details */}
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Most popular
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {monthly?.mostPopularService?.name ?? "—"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {monthly?.mostPopularService
                      ? `${monthly.mostPopularService.completedCount} completed`
                      : "No completed services yet"}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Least popular
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {monthly?.leastPopularService?.name ?? "—"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {monthly?.leastPopularService
                      ? `${monthly.leastPopularService.completedCount} completed`
                      : "No completed services yet"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
