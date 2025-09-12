import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import LandingPage from "@/pages/LandingPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import SignUpPage from "@/pages/SignUpPage.tsx";
import ServicesPage from "@/pages/ServicesPage.tsx";
import ServiceDetailsPage from "@/pages/ServiceDetailsPage.tsx";
import Layout from "./components/shared/Layout";
import AdminDashboard from "./pages/AdminDashboardPage";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
      },
      {
        path: "/services",
        element: <ServicesPage />,
      },
      {
        path: "/services/:slug",
        element: <ServiceDetailsPage />,
      },
    ],
  },
  {
    path: "/dashboard/admin/*",
    element: <AdminDashboard />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
