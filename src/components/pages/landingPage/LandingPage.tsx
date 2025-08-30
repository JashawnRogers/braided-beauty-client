import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Banner from "./components/Banner";
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
