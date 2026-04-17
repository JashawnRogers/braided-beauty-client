import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import IntegrationCard from "./components/IntegrationCard";
import { apiGet } from "@/lib/apiClient";
import { ServiceCategoryResponseDTO } from "@/features/account/types";
import { Sparkles } from "lucide-react";

export function ListServicesPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceCategoryResponseDTO[]>([]);
  const [categoryName, setCategoryName] = useState<string>("Services");
  const { categoryId } = useParams<{ categoryId: string }>();

  useEffect(() => {
    const getServices = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [servicesData, categoriesData] = await Promise.all([
          apiGet<ServiceCategoryResponseDTO[]>(
            `/service/category/${categoryId}`
          ),
          apiGet<ServiceCategoryResponseDTO[]>("/category"),
        ]);

        setServices(servicesData ?? []);
        const matchedCategory = (categoriesData ?? []).find(
          (category) => category.id === categoryId
        );
        setCategoryName(matchedCategory?.name ?? "Services");
      } catch (err) {
        console.error(err);
        setError("Failed to load services");
      } finally {
        setIsLoading(false);
      }
    };

    getServices();
  }, [categoryId]);

  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(193,150,73,0.22),transparent_46%),linear-gradient(180deg,#f7f1ea_0%,#f6efe6_42%,#f9f6f3_100%)]" />
      <div className="absolute left-[-7rem] top-36 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-[-4rem] top-20 -z-10 h-64 w-64 rounded-full bg-amber-100 blur-3xl" />

      <section className="px-6 pb-14 pt-16 sm:pt-36 lg:px-8 lg:pb-18">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-sm text-foreground/80 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              Refined service selection
            </div>
            <h1 className="mt-8 font-serif text-5xl leading-[0.95] text-stone-950 sm:text-6xl">
              {categoryName}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/72 sm:text-xl">
              Choose the service that fits your style goals, then move into the
              calendar and booking flow with clearer expectations.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          {isLoading && (
            <div className="rounded-[2rem] border border-primary/12 bg-white/80 px-6 py-12 text-center text-sm text-muted-foreground shadow-[0_22px_60px_-38px_rgba(52,34,12,0.35)]">
              Loading services...
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-[2rem] border border-red-200 bg-white/80 px-6 py-12 text-center text-sm text-red-500 shadow-[0_22px_60px_-38px_rgba(52,34,12,0.35)]">
              {error}
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <IntegrationCard
                  key={service.id ?? service.name}
                  title={service.name}
                  description={service.description}
                  linkTitle="view details"
                  link={`/book/service/${service.id}`}
                />
              ))}

              {services.length === 0 && (
                <div className="col-span-full rounded-[2rem] border border-primary/12 bg-white/80 px-6 py-12 text-center text-sm text-muted-foreground shadow-[0_22px_60px_-38px_rgba(52,34,12,0.35)]">
                  No services are available in this category yet.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
