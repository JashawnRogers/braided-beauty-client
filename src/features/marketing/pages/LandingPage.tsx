import Hero from "@/features/marketing/pages/components/Hero";
import Banner from "@/features/marketing/pages/components/Banner";
import CallToAction from "@/components/ui/call-to-action";
import About from "@/components/ui/content-1";

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Banner />
      <CallToAction />
      <About />
    </div>
  );
}

export default LandingPage;
