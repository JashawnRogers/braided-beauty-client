import { useEffect, useState } from "react";
import { apiGet } from "@/lib/apiClient";
import { ServiceCategoryResponseDTO } from "@/features/account/types";
import IntegrationCard from "./components/IntegrationCard";
import { Sparkles } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ServiceCategoryResponseDTO[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await apiGet<ServiceCategoryResponseDTO[]>("/category");

        setCategories(data ?? []);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    getCategories();
  }, []);

  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(193,150,73,0.22),transparent_46%),linear-gradient(180deg,#f7f1ea_0%,#f6efe6_42%,#f9f6f3_100%)]" />
      <div className="absolute left-[-7rem] top-36 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-[-4rem] top-20 -z-10 h-64 w-64 rounded-full bg-amber-100 blur-3xl" />

      <section className="px-6 pb-14 pt-32 sm:pt-12 lg:px-8 lg:pb-18">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-sm text-foreground/80 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              Start with a service family
            </div>
            <h1 className="mt-8 font-serif text-5xl leading-[0.95] text-stone-950 sm:text-6xl">
              Categories
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/72 sm:text-xl">
              Browse the main style groups first, then move into the individual
              services that best match the look, size, and appointment flow you
              want.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          {isLoading && (
            <div className="rounded-[2rem] border border-primary/12 bg-white/80 px-6 py-12 text-center text-sm text-muted-foreground shadow-[0_22px_60px_-38px_rgba(52,34,12,0.35)]">
              Loading categories...
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-[2rem] border border-red-200 bg-white/80 px-6 py-12 text-center text-sm text-red-500 shadow-[0_22px_60px_-38px_rgba(52,34,12,0.35)]">
              {error}
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => (
                <IntegrationCard
                  key={category.id}
                  title={category.name}
                  description={category.description}
                  link={`/services/${category.id}`}
                  linkTitle="services"
                />
              ))}

              {categories.length === 0 && (
                <div className="col-span-full rounded-[2rem] border border-primary/12 bg-white/80 px-6 py-12 text-center text-sm text-muted-foreground shadow-[0_22px_60px_-38px_rgba(52,34,12,0.35)]">
                  No categories are available yet. Please check back soon.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
