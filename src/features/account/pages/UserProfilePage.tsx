import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { phone } from "@/lib/formatPhone";
import {
  CurrentUser,
  UpdatePasswordPayload,
  UpdateUserProfilePayload,
} from "../types";
import { apiPatch } from "@/lib/apiClient";
import { useUser } from "@/context/UserContext";

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
  const { user, setUser, isLoading, error } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordValues, setPasswordValues] = useState<UpdatePasswordPayload>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<UpdateUserProfilePayload>({
    name: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (user) {
      setFormValues({
        name: user.name,
        phoneNumber: user.phoneNumber ?? "",
      });
    }
  }, [user]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setPasswordValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSavePassword(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    setPasswordError(null);
    setIsSavingPassword(true);

    const { currentPassword, newPassword, confirmNewPassword } = passwordValues;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("Please fill in all password fields");
      setIsSavingPassword(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New password and confirmation do not match");
      setIsSavingPassword(false);
      return;
    }

    try {
      await apiPatch<void>("/auth/change-password", {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      setPasswordValues({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      setIsChangingPassword(false);
      setPasswordSuccess("Your password has been updated");
    } catch (err: any) {
      console.error(err);
      setPasswordError(
        err?.message || "Something went wrong while updating your password"
      );
    } finally {
      setIsSavingPassword(false);
    }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSubmitError(null);
    setIsSaving(true);

    const formattedPhone = formValues.phoneNumber
      ? phone.toE164(formValues.phoneNumber)
      : null;

    const payload: UpdateUserProfilePayload = {
      name: formValues.name.trim(),
      phoneNumber: formattedPhone,
    };

    try {
      const updated = await apiPatch<CurrentUser>("/user/me/profile", payload);

      setUser(updated);
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      setSubmitError(
        err?.message ?? "Something went wrong while updating your profile."
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal details for Braided Beauty bookings.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main profile info */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Personal information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEditing ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Name
                    </p>
                    <p className="text-sm font-medium">{user.name}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Email
                    </p>
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Phone number
                    </p>
                    <p className="text-sm font-medium">
                      {user.phoneNumber ? (
                        phone.formatFromE164(user.phoneNumber)
                      ) : (
                        <span className="text-muted-foreground">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Member type
                    </p>
                    <p className="text-sm font-medium">
                      <Badge variant="outline" className="mt-1 ml-2">
                        {user.memberStatus || "Member"}
                      </Badge>
                    </p>
                  </div>
                </div>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(true);
                    }}
                  >
                    Edit profile
                  </Button>
                </div>{" "}
              </>
            ) : (
              <form onSubmit={handleSave} className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <label
                    htmlFor="name"
                    className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    className="input sz-md w-full"
                    value={formValues.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="phoneNumber"
                    className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    Phone number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    className="input sz-md w-full"
                    value={formValues.phoneNumber ?? ""}
                    onChange={handleChange}
                    placeholder="Optional"
                  />
                </div>

                {submitError && (
                  <p className="text-sm text-red-600">{submitError}</p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      // reset form to last saved values
                      setFormValues({
                        name: user.name,
                        phoneNumber: user.phoneNumber ?? "",
                      });
                      setSubmitError(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </form>
            )}
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
                  {formatDate(user.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Last updated
                </p>
                <p className="text-sm font-medium">
                  {formatDate(user.updatedAt)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Member ID
                </p>
                <p className="text-xs font-mono text-muted-foreground break-all">
                  {user.id}
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
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Tier
                  </p>
                  <p className="font-semibold">
                    <Badge variant="outline" className="mt-2">
                      {user.loyaltyTier}
                    </Badge>
                  </p>
                </div>

                <div className="space-y-1 text-center">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Loyalty Points
                  </p>
                  <p className="text-lg font-semibold text-center">
                    {user.loyaltyPoints}
                  </p>
                </div>

                <div className="space-y-1 text-center">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Redeemed Points
                  </p>
                  <p className="text-lg font-semibold text-center">
                    {user.redeemedPoints}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security / Change password */}
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isChangingPassword ? (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Update your password for this account.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Change password
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSavePassword}
                  className="space-y-4 max-w-md"
                  autoComplete="off"
                >
                  <div className="space-y-1">
                    <label
                      htmlFor="currentPassword"
                      className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      Current password
                    </label>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      className="input sz-md w-full"
                      value={passwordValues.currentPassword}
                      onChange={handlePasswordChange}
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="newPassword"
                      className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      New password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      className="input sz-md w-full"
                      value={passwordValues.newPassword}
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="confirmNewPassword"
                      className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      Confirm new password
                    </label>
                    <input
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      type="password"
                      className="input sz-md w-full"
                      value={passwordValues.confirmNewPassword}
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  {passwordError && (
                    <p className="text-sm text-red-600">{passwordError}</p>
                  )}
                  {passwordSuccess && (
                    <p className="text-sm text-emerald-600">
                      {passwordSuccess}
                    </p>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordError(null);
                        setPasswordSuccess(null);
                        setPasswordValues({
                          currentPassword: "",
                          newPassword: "",
                          confirmNewPassword: "",
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSavingPassword}>
                      {isSavingPassword ? "Saving…" : "Save password"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
