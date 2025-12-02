import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { phone } from "@/lib/formatPhone";
import { UserMemberProfile } from "../types";
import { apiGet } from "@/lib/apiClient";

// Simple date formatter for createdAt/updatedAt
function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function UserProfilePage() {
  // TODO: later replace MOCK_PROFILE with a real data hook, e.g.:
  // const { data: profile, isLoading, error } = useMemberProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserMemberProfile | null>(null);

  const didFetch = useRef(false);

  async function fetchUserProfile() {
    try {
      setIsLoading(true);
      const data = await apiGet<UserMemberProfile>(
        `${import.meta.env.VITE_SERVER_API_URL}/user/me/profile`
      );
      setProfile(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    void fetchUserProfile();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal details for Braided Beauty bookings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Main profile info */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Personal information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Name
                </p>
                <p className="text-sm font-medium">{profile.name}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Email
                </p>
                <p className="text-sm font-medium">{profile.email}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Phone number
                </p>
                <p className="text-sm font-medium">
                  {phone.formatFromE164(profile.phoneNumber) || (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Member type
                </p>
                <p className="text-sm font-medium">
                  {profile.userType || "Member"}
                  <Badge variant="outline" className="mt-1 ml-2">
                    {profile.userType || "Member"}
                  </Badge>
                </p>
              </div>
              <div className="space-y-1 col-end-[-1]">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Password
                </p>
                <Button variant="outline" size="sm">
                  Reset Password
                </Button>
              </div>
            </div>

            {/* You can later turn this into an editable form */}
            <div className="pt-2">
              <Button variant="outline" size="lg">
                Edit profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account metadata + loyalty */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Account details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Member since
                </p>
                <p className="text-sm font-medium">
                  {formatDate(profile.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Last updated
                </p>
                <p className="text-sm font-medium">
                  {formatDate(profile.updatedAt)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Member ID
                </p>
                <p className="text-xs font-mono text-muted-foreground break-all">
                  {profile.id}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Loyalty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Tier
                  </p>
                  <p className="text-lg font-semibold">{profile.loyaltyTier}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Loyalty Points
                  </p>
                  <p className="text-lg font-semibold text-center">
                    {profile.loyaltyRecord?.points}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Redeemed Points
                  </p>
                  <p className="text-lg font-semibold text-center">
                    {profile.loyaltyRecord?.redeemedPoints}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Optional: you could add a security/password section here later
          for "change password" / "set password" */}
    </div>
  );
}
