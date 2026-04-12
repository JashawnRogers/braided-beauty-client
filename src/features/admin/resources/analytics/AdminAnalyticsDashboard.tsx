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
  ThemeProvider,
  createTheme,
  CssBaseline,
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
import { logger } from "@/lib/logger";

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
const brandGold = "hsl(var(--primary))";
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
        logger.error("admin.analytics.load_failed", e, { month });
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

  const pageSx = {
    minHeight: "100%",
    p: { xs: 2, md: 3 },
    backgroundColor: "hsl(var(--background))",
  };

  const containerSx = {
    maxWidth: 1200,
    mx: "auto",
  };

  const cardSx = {
    borderRadius: 1,
    border: "1px solid hsl(var(--border))",
    backgroundColor: "hsl(var(--card))",
    backgroundImage: "none",
    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
  };

  const cardHeaderSx = {
    pb: 0,
    "& .MuiCardHeader-title": { fontWeight: 800 },
    "& .MuiCardHeader-subheader": { mt: 0.25 },
  };

  const kpiValueSx = {
    fontWeight: 900,
    letterSpacing: "-0.02em",
  };

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "dark",
          background: {
            // match your shadcn CSS vars
            default: "hsl(var(--background))",
            paper: "hsl(var(--card))",
          },
          text: {
            primary: "hsl(var(--foreground))",
            secondary: "hsl(var(--muted-foreground))",
          },
          divider: "hsl(var(--border))",
          primary: { main: "hsl(var(--primary))" },
        },
        shape: { borderRadius: 16 },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                // removes the “subtle background” overlay / gradient feel
                backgroundImage: "none",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                border: "1px solid hsl(var(--border))",
              },
            },
          },
        },
      }),
    []
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box sx={pageSx}>
        <Box sx={containerSx}>
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
              <Typography
                variant="h5"
                sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}
              >
                Analytics
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Month-to-date metrics and all-time totals.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Select
                size="small"
                value={month}
                onChange={(e) => setMonth(String(e.target.value))}
                sx={{
                  minWidth: 180,
                  borderRadius: 2,
                  backgroundColor: "hsl(var(--card))",

                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "hsl(var(--border))",
                  },

                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "hsl(var(--primary))",
                  },

                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "hsl(var(--primary))",
                    borderWidth: "2px",
                  },
                }}
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
              <Card variant="outlined" sx={cardSx}>
                <CardHeader
                  title={
                    <Typography variant="subtitle2" color="text.secondary">
                      Completed (month)
                    </Typography>
                  }
                  sx={cardHeaderSx}
                />
                <CardContent>
                  {loading ? (
                    <Skeleton height={40} />
                  ) : (
                    <Typography variant="h4" sx={kpiValueSx}>
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
              <Card variant="outlined" sx={cardSx}>
                <CardHeader
                  title={
                    <Typography variant="subtitle2" color="text.secondary">
                      Paid by card (month)
                    </Typography>
                  }
                  sx={cardHeaderSx}
                />
                <CardContent>
                  {loading ? (
                    <Skeleton height={40} />
                  ) : (
                    <Typography variant="h5" sx={kpiValueSx}>
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
              <Card variant="outlined" sx={cardSx}>
                <CardHeader
                  title={
                    <Typography variant="subtitle2" color="text.secondary">
                      Paid by cash (month)
                    </Typography>
                  }
                  sx={cardHeaderSx}
                />
                <CardContent>
                  {loading ? (
                    <Skeleton height={40} />
                  ) : (
                    <Typography variant="h5" sx={kpiValueSx}>
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
              <Card variant="outlined" sx={cardSx}>
                <CardHeader
                  title={
                    <Typography variant="subtitle2" color="text.secondary">
                      Completed (all-time)
                    </Typography>
                  }
                  sx={cardHeaderSx}
                />
                <CardContent>
                  {loading ? (
                    <Skeleton height={40} />
                  ) : (
                    <Typography variant="h4" sx={kpiValueSx}>
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
              <Card variant="outlined" sx={cardSx}>
                <CardHeader
                  title={
                    <Typography variant="subtitle1">
                      Payment mix (month)
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body2" color="text.secondary">
                      Card vs cash totals
                    </Typography>
                  }
                  sx={cardHeaderSx}
                />
                <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
                <CardContent sx={{ height: 280 }}>
                  {loading ? (
                    <Skeleton height={240} />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={paymentMixMonthData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => money(value)} />
                        <Bar
                          dataKey="value"
                          fill={brandGold}
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={cardSx}>
                <CardHeader
                  title={
                    <Typography variant="subtitle1">
                      Payment mix (all-time)
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body2" color="text.secondary">
                      Card vs cash totals
                    </Typography>
                  }
                  sx={cardHeaderSx}
                />
                <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
                <CardContent sx={{ height: 280 }}>
                  {loading ? (
                    <Skeleton height={240} />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={paymentMixAllTimeData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => money(value)} />
                        <Bar
                          dataKey="value"
                          fill={brandGold}
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Card variant="outlined" sx={cardSx}>
                <CardHeader
                  title={
                    <Typography variant="subtitle1">
                      Service popularity (month)
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body2" color="text.secondary">
                      Most and least popular (completed)
                    </Typography>
                  }
                  sx={cardHeaderSx}
                />
                <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
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
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="kind" width={110} />
                        <Tooltip
                          formatter={(value: any) =>
                            Number(value).toLocaleString()
                          }
                        />
                        <Bar
                          dataKey="value"
                          fill={brandGold}
                          radius={[0, 8, 8, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No popularity data available for this month yet.
                    </Typography>
                  )}
                </CardContent>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Most popular
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 800 }}>
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
                      <Typography variant="body1" sx={{ fontWeight: 800 }}>
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
      </Box>
    </ThemeProvider>
  );
}
