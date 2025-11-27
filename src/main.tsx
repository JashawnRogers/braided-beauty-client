import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@/styles/index.css";
import "@/styles/ra-overrides.css";
import LandingPage from "@/features/marketing/pages/LandingPage";
import LoginPage from "@/features/auth/LoginPage";
import SignUpPage from "@/features/auth/SignUpPage";
import ServicesPage from "@/features/marketing/pages/ServicesPage";
import ServiceDetailsPage from "@/features/marketing/pages/ServiceDetailsPage";
import Layout from "@/components/shared/Layout";
import AdminDashboard from "@/features/admin/pages/AdminDashboardPage";
import UserLayout from "@/features/account/layouts/UserLayout";
import { UserDashboardPage } from "@/features/account/pages/UserDashboardPage";
import { UserAppointmentsPage } from "@/features/account/pages/UserAppointmentsPage";
import { UserProfilePage } from "@/features/account/pages/UserProfilePage";
import { userDashboardLoader } from "@/features/account/loaders/userDashboardLoader";

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
  {
    path: "/dashboard/me",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <UserDashboardPage />,
        loader: userDashboardLoader,
      },
      {
        path: "appointments",
        element: <UserAppointmentsPage />,
      },
      {
        path: "profile",
        element: <UserProfilePage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
