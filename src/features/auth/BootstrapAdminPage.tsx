import { FormEvent, useState } from "react";
import Logo from "@/assets/logos/Black-official-logo.jpeg";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bootstrapAdmin } from "./authApi";

export default function BootstrapAdminPage() {
  const [secret, setSecret] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedSecret = secret.trim();
    if (!trimmedSecret) {
      setError("Bootstrap secret is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await bootstrapAdmin({ secret: trimmedSecret });
      setSuccessMessage(
        "Admin access was granted. Sign out and sign back in if the dashboard does not update immediately."
      );
      setSecret("");
    } catch (err: any) {
      setError(err?.message ?? "Failed to bootstrap admin access.");
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
            <h1 className="mb-1 mt-4 text-xl font-semibold">Bootstrap Admin</h1>
            <p className="text-sm">
              Temporary setup page for first admin bootstrap only.
            </p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bootstrap-secret" className="block text-sm">
                Bootstrap secret
              </Label>
              <Input
                id="bootstrap-secret"
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                required
                autoComplete="off"
              />
            </div>

            {successMessage && (
              <p className="text-sm text-emerald-700">{successMessage}</p>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Grant admin access"}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
