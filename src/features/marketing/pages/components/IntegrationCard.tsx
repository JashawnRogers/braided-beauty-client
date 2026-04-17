import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

type IntegrationCardProps = Readonly<{
  title: string;
  description?: string | null;
  link?: string;
  children?: ReactNode;
  linkTitle: string;
}>;

export default function IntegrationCard({
  title,
  link = "/",
  children,
  linkTitle,
}: IntegrationCardProps) {
  return (
    <Card className="group overflow-hidden rounded-[2rem] border border-primary/15 bg-white/88 p-0 shadow-[0_24px_60px_-40px_rgba(52,34,12,0.42)] backdrop-blur">
      <div className="relative">
        {children && <div className="px-7 pt-7 *:size-10">{children}</div>}

        <div className="px-7 py-7">
          <h3 className="font-serif text-2xl leading-tight text-stone-950">
            {title}
          </h3>
        </div>

        <div className="flex gap-3 border-t border-primary/10 px-7 py-5">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="h-10 rounded-full border border-primary/15 bg-primary/10 px-5 text-foreground shadow-none hover:bg-primary/15"
          >
            <Link to={link}>
              {linkTitle}
              <ChevronRight className="ml-0 !size-3.5 opacity-60" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
