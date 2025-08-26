import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Banner from "./components/Banner";
import CallToAction from "@/components/call-to-action";
import About from "@/components/content-1";
import Footer from "@/components/footer";

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
