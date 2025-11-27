export type ServiceItem = {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  heroImage: string;
  priceFrom: number;
  durationMinutes: number;
};

export const SERVICES: ServiceItem[] = [
  {
    slug: "beauty-essentials",
    title: "Beauty Essentials",
    shortDescription: "Consultation with Braided Beauty",
    longDescription:
      "A focused consult to understand your hair goals, history, and maintenance preferences. We’ll align on style, care plan, and timing.",
    heroImage: "",
    priceFrom: 25,
    durationMinutes: 15,
  },
  {
    slug: "beauty-under-12",
    title: "Beauty Under 12",
    shortDescription: "For ages 12 & under",
    longDescription:
      "Kid-friendly services designed for comfort, gentleness, and confidence. Includes detangling guidance and home-care tips.",
    heroImage: "",
    priceFrom: 60,
    durationMinutes: 90,
  },
  {
    slug: "bohemian-knotless",
    title: "Bohemian Knotless",
    shortDescription:
      "Knotless braids with human hair strands throughout for a full boho look.",
    longDescription:
      "This variation blends human hair for texture and movement. Lightweight, low tension, and highly versatile.",
    heroImage: "",
    priceFrom: 220,
    durationMinutes: 240,
  },
  {
    slug: "feed-ins",
    title: "Feed-Ins",
    shortDescription:
      "Feed-in cornrows are a braiding technique where hair extensions are gradually added to the natural hair.",
    longDescription:
      "Extensions are seamlessly added to create natural-looking cornrows with no visible stitches. This technique creates a polished yet natural finish.",
    heroImage: "",
    priceFrom: 0,
    durationMinutes: 600,
  },
  {
    slug: "knotless",
    title: "Knotless",
    shortDescription:
      "Knotless braids are a protective hairstyle where extensions are added into the natural hair without a traditional knot.",
    longDescription:
      "A lighter, more natural look with less tension on the scalp. Perfect for reducing breakage while still providing long-lasting wear.",
    heroImage: "",
    priceFrom: 0,
    durationMinutes: 120,
  },
  {
    slug: "locs",
    title: "Locs",
    shortDescription: "Consists of sections of hair knotted together",
    longDescription:
      "Locs are sections of hair twisted or knotted into rope-like strands. They can be styled in many ways and maintained for a bold, lasting look.",
    heroImage: "",
    priceFrom: 0,
    durationMinutes: 120,
  },
  {
    slug: "mens-braided-styles",
    title: "Men's Braided Styles",
    shortDescription: "Individual Braids",
    longDescription:
      "Custom braiding styles designed for men. Includes individual braids and variations tailored to your preferred length and look.",
    heroImage: "",
    priceFrom: 0,
    durationMinutes: 120,
  },
  {
    slug: "twists",
    title: "Twists",
    shortDescription: "Mini twists are braided from root and twisted to tip.",
    longDescription:
      "This low-maintenance hairstyle promotes hair growth, reduces manipulation, and provides a lightweight, versatile look.",
    heroImage: "",
    priceFrom: 0,
    durationMinutes: 120,
  },
];
