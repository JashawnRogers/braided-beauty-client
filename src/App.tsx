import "./index.css";
import Navbar from "./components/shared/Navbar";
import Hero from "./features/marketing/pages/components/Hero";
import CallToAction from "./components/ui/call-to-action";
import About from "./components/ui/content-1";
import Footer from "./components/shared/footer";
import Banner from "./features/marketing/pages/components/Banner";

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
