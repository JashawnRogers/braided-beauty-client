import { useEffect, useState } from "react";
import { apiGet } from "@/lib/apiClient";
import { ServiceCategoryResponseDTO } from "@/features/account/types";
import IntegrationCard from "./components/IntegrationCard";

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
    <section>
      <div className="py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
              Here's what we have to offer
            </h2>
            <p className="text-muted-foreground mt-2 italic">
              Service that feels like home!
            </p>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="mt-12 text-center text-sm text-muted-foreground">
              Loading categories...
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
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <IntegrationCard
                  key={category.id}
                  title={category.name}
                  description={category.description}
                  link={`/services/${category.id}`}
                  linkTitle="View services"
                ></IntegrationCard>
              ))}

              {categories.length === 0 && (
                <div className="col-span-full text-center text-sm text-muted-foreground">
                  No categories are available yet. Please check back soon.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
