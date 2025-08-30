import "./index.css";
import Navbar from "./components/pages/landingPage/components/Navbar";
import Hero from "./components/pages/landingPage/components/Hero";
import CallToAction from "./components/ui/call-to-action";
import About from "./components/ui/content-1";
import Footer from "./components/shared/footer";
import Banner from "./components/pages/landingPage/components/Banner";

function App() {
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

export default App;
