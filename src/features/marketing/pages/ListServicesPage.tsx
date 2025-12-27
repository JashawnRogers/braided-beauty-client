import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import IntegrationCard from "./components/IntegrationCard";
import { apiGet } from "@/lib/apiClient";
import { ServiceCategoryResponseDTO } from "@/features/account/types";
import PLACEHOLDER from "@/assets/featured-work/featured-pic1.webp";

export function ListServicesPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceCategoryResponseDTO[]>([]);
  const { categoryId } = useParams<{ categoryId: string }>();

  const image = <img src={PLACEHOLDER} alt="" className="object-cover" />;

  useEffect(() => {
    const getServices = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await apiGet<ServiceCategoryResponseDTO[]>(
          `/service/category/${categoryId}`
        );

        setServices(data ?? []);
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
    <section>
      <div className="py-32">
        <div className="mx-auto max-w-5xl px-6">
          <header className="text-center">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
              Choose a service
            </h2>
          </header>

          {/* Loading state */}
          {isLoading && (
            <div className="mt-12 text-center text-sm text-muted-foreground">
              Loading services...
            </div>
          )}

          {/* Error state */}
          {!isLoading && error && (
            <div className="mt-12 text-center text-sm text-red-500">
              {error}
            </div>
          )}

          {/* Data state */}
          {!isLoading && !error && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
              {services.map((service) => {
                console.log("service:", service);
                console.log("service.id:", service.id);

                return (
                  <IntegrationCard
                    key={service.id ?? service.name}
                    title={service.name}
                    description={service.description}
                    img={image}
                    linkTitle="Book"
                    link={`/book/service/${service.id}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
