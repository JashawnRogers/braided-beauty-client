import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/assets/logos/braided-beauty-alt-dark.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "./authApi";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC_SUCCESS_MESSAGE =
  "If an account with that email exists, password reset instructions have been sent.";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setRequestError(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError("Email is required");
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword({ email: trimmedEmail });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setRequestError(
        "We couldn't send reset instructions right now. Please try again."
      );
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
              Forgot your password?
            </h1>
            <p className="text-sm">
              Enter your email and we will send reset instructions.
            </p>
          </div>

          <div className="mt-6 space-y-6">
            {isSuccess && (
              <p className="text-sm text-emerald-700">
                {GENERIC_SUCCESS_MESSAGE}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <p className="text-sm text-red-600">{emailError}</p>
              )}
            </div>

            {requestError && (
              <p className="text-sm text-red-600">{requestError}</p>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Sending..." : "Send reset instructions"}
            </Button>
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
