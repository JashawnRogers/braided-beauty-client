import { useMemo, useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

type Props = {
  readonly images: string[];
  readonly alt?: string;
};

export default function ServiceGallery({
  images,
  alt = "Service photo",
}: Props) {
  const clean = useMemo(
    () => Array.from(new Set(images.filter(Boolean))).slice(0, 5),
    [images]
  );

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!clean.length) return null;

  const go = (i: number) => api?.scrollTo(i);
  const prev = () => api?.scrollPrev();
  const next = () => api?.scrollNext();

  const activeSrc = clean[index] ?? clean[0];

  return (
    <div className="mt-6 space-y-3">
      {/* HERO */}
      <Card className="relative overflow-hidden rounded-xl border bg-card shadow-sm">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative block w-full"
          title="View photo"
        >
          <img
            src={activeSrc}
            alt={alt}
            className="h-[240px] w-full object-cover sm:h-[320px]"
            loading="lazy"
          />

          {/* Soft gradient so text on top would be readable if you ever overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
        </button>

        {/* Arrows (only show if >1) */}
        {clean.length > 1 && (
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="pointer-events-auto rounded-full opacity-90"
              onClick={prev}
              title="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="pointer-events-auto rounded-full opacity-90"
              onClick={next}
              title="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </Card>

      {/* THUMBNAILS */}
      <Carousel setApi={setApi} opts={{ align: "start", dragFree: true }}>
        <CarouselContent className="-ml-2">
          {clean.map((src, i) => {
            const active = i === index;
            return (
              <CarouselItem key={src} className="pl-2 basis-1/5">
                <button
                  type="button"
                  onClick={() => go(i)}
                  className={[
                    "block w-full overflow-hidden rounded-lg border",
                    active
                      ? "ring-2 ring-primary"
                      : "opacity-80 hover:opacity-100",
                  ].join(" ")}
                  title={`Photo ${i + 1}`}
                >
                  <img
                    src={src}
                    alt={`${alt} ${i + 1}`}
                    className="h-16 w-full object-cover"
                    loading="lazy"
                  />
                </button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* FULLSCREEN VIEW */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl p-2 sm:p-4">
          <img
            src={activeSrc}
            alt={alt}
            className="max-h-[80vh] w-full rounded-lg object-contain"
          />
          {clean.length > 1 && (
            <div className="mt-3 flex items-center justify-between">
              <Button type="button" variant="secondary" onClick={prev}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Prev
              </Button>
              <div className="text-sm text-muted-foreground">
                {index + 1} / {clean.length}
              </div>
              <Button type="button" variant="secondary" onClick={next}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
