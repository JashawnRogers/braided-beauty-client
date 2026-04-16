import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./footer";
import SiteBreadcrumbs from "./SiteBreadcrumbs";
export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="lg:pt-8 xl:pt-10">
        <SiteBreadcrumbs className="pt-24 md:pb-2 lg:pt-24" />
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
