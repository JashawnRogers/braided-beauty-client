import { FormEvent, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Logo from "@/assets/logos/Black-official-logo.jpeg";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ChecklistItem from "@/components/shared/CheckListItem";
import PasswordInput from "./components/PasswordInput";
import { evaluatePasswordRules, sanitizePasswordInput } from "@/lib/password";
import { resetPassword } from "./authApi";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordRules = useMemo(
    () => evaluatePasswordRules(newPassword),
    [newPassword]
  );
  const passwordsMatch =
    sanitizePasswordInput(newPassword) ===
    sanitizePasswordInput(confirmPassword);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("This password reset link is invalid or expired.");
      return;
    }

    if (!passwordRules.isPasswordValid) {
      setError("Please fix the password requirements before continuing.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({
        token,
        newPassword: sanitizePasswordInput(newPassword),
        confirmPassword: sanitizePasswordInput(confirmPassword),
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Unable to reset password right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link to="/" aria-label="go home" className="mx-auto block w-fit">
              <img
                src={Logo}
                alt="Braided Beauty Logo"
                className="h-16 w-auto rounded-md"
              />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Create a new password
            </h1>
            <p className="text-sm">
              Enter a new password for your Braided Beauty account.
            </p>
          </div>

          <div className="mt-6 space-y-6">
            {isSuccess && (
              <p className="text-sm text-emerald-700">
                Your password has been reset. You can now sign in.
              </p>
            )}

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="newPassword" className="text-sm">
                  New password
                </Label>
              </div>

              <PasswordInput
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="confirmPassword" className="text-sm">
                  Confirm new password
                </Label>
              </div>

              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <ol className="mt-3 space-y-1 text-sm">
              <li>
                <ChecklistItem ok={passwordRules.minLengthMet}>
                  At least 8 characters
                </ChecklistItem>
              </li>
              <li>
                <ChecklistItem ok={passwordRules.hasUppercase}>
                  Must include 1 uppercase letter
                </ChecklistItem>
              </li>
              <li>
                <ChecklistItem ok={passwordRules.hasLowercase}>
                  Must include 1 lowercase letter
                </ChecklistItem>
              </li>
              <li>
                <ChecklistItem ok={passwordRules.hasNumber}>
                  Must include 1 number
                </ChecklistItem>
              </li>
              <li>
                <ChecklistItem ok={passwordRules.hasSymbol}>
                  Must include at least one symbol: Ex. !, &, %, etc..
                </ChecklistItem>
              </li>
              <li>
                <ChecklistItem ok={passwordsMatch}>
                  Passwords match
                </ChecklistItem>
              </li>
            </ol>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {!isSuccess ? (
              <Button
                className="w-full"
                type="submit"
                disabled={
                  isSubmitting ||
                  !passwordRules.isPasswordValid ||
                  !passwordsMatch
                }
              >
                {isSubmitting ? "Saving..." : "Reset password"}
              </Button>
            ) : (
              <Button asChild className="w-full">
                <Link to="/login">Back to login</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Remembered your password?
            <Button asChild variant="link" className="px-2">
              <Link to="/login">Back to login</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
