import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";

type Testimonial = {
  quote: string;
  author: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Sophia delivers each service with precision, intention, and respect for your time. Communication is seamless, and the studio environment is thoughtfully curated, warm, welcoming, and complete with client-centered touches. Most importantly, she provides something invaluable: a trusted professional you can feel confident returning to.",
    author: "K. Williams",
  },
  {
    quote:
      "We absolutely love Sophia! She has incredible talent and always does an amazing job on my daughter's hair. My daughter leaves feeling confident and looking flawless every time!",
    author: "Courtney N.",
  },
  {
    quote:
      "She was the definition of professional - clear, prompt, and genuinely warm, making scheduling for us effortless.",
    author: "Dom C.",
  },
];

function initials(name: string) {
  // "K. Williams" -> "KW", "Courtney N." -> "CN"
  const cleaned = name.replace(/[^a-zA-Z.\s]/g, "").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

export default function ReviewsCard() {
  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">What clients say</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              A few words from recent clients.
            </p>
          </div>

          {/* Static “5-star” vibe (curated testimonials) */}
          <div className="flex items-center gap-0.5 pt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-primary text-primary opacity-90"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {TESTIMONIALS.map((t, idx) => (
          <div key={t.author}>
            <figure className="rounded-lg border bg-background/40 p-4">
              <blockquote className="text-sm leading-relaxed text-foreground/90">
                “{t.quote}”
              </blockquote>

              <figcaption className="mt-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted text-xs font-semibold">
                  {initials(t.author)}
                </div>

                <div className="leading-tight">
                  <div className="text-sm font-medium">{t.author}</div>
                  <div className="text-xs text-muted-foreground">
                    Verified testimonial
                  </div>
                </div>
              </figcaption>
            </figure>

            {idx !== TESTIMONIALS.length - 1 ? (
              <Separator className="my-4" />
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
