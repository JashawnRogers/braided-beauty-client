import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

type IntegrationCardProps = Readonly<{
  title: string;
  description: string;
  link?: string;
  children?: ReactNode;
  img?: ReactNode;
  linkTitle: string;
}>;

export default function IntegrationCard({
  title,
  description,
  link = "/",
  children,
  img,
  linkTitle,
}: IntegrationCardProps) {
  return (
    <Card className="p-6">
      <div className="relative">
        {img && <div className="w-full h-40 overflow-hidden">{img}</div>}

        {children && <div className="*:size-10">{children}</div>}

        <div className="space-y-2 py-6">
          <h3 className="text-lg font-semibold">{title}</h3>
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
              {linkTitle}
              <ChevronRight className="ml-0 !size-3.5 opacity-50" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
