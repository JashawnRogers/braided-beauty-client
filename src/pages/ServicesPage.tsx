import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import Logo from "@/assets/bb-logo.svg";
import { SERVICES } from "@/data/services";
import * as React from "react";
import { GooglePaLM } from "@/components/logos";

export default function ServicesPage() {
  return (
    <section>
      <div className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <Link to="/">
              <img
                src={Logo}
                alt=""
                className="h-20 w-auto mx-auto mb-2 rounded-md"
              />
            </Link>
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
              Choose your service
            </h2>
            <p className="text-muted-foreground mt-2 italic">
              Service that feels like home!
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <IntegrationCard
                key={service.slug}
                title={service.title}
                description={service.shortDescription}
                link={`/services/${service.slug}`}
              >
                <GooglePaLM />
              </IntegrationCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({
  title,
  description,
  children,
  link = "/",
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  link?: string;
}) => {
  return (
    <Card className="p-6">
      <div className="relative">
        <div className="*:size-10">{children}</div>

        <div className="space-y-2 py-6">
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {description}
          </p>
        </div>

        <div className="flex gap-3 border-t border-dashed pt-6">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="gap-1 pr-2 shadow-none"
          >
            <Link to={link}>
              Learn More
              <ChevronRight className="ml-0 !size-3.5 opacity-50" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
