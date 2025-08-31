import Navbar from "@/components/landingPage/Navbar";
import Hero from "@/components/landingPage/Hero";
import Banner from "@/components/landingPage/Banner";
import CallToAction from "@/components/ui/call-to-action";
import About from "@/components/ui/content-1";
import Footer from "@/components/shared/footer";

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Banner />
      <CallToAction />
      <About />
      <Footer />
    </>
  );
}

export default LandingPage;
