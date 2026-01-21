import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@/styles/index.css";
import "@/styles/ra-overrides.css";
import LandingPage from "@/features/marketing/pages/LandingPage";
import LoginPage from "@/features/auth/LoginPage";
import SignUpPage from "@/features/auth/SignUpPage";
import CategoriesPage from "@/features/marketing/pages/CategoriesPage";
import ServiceDetailsPage from "@/features/marketing/pages/ServiceDetailsPage";
import Layout from "@/components/shared/Layout";
import AdminDashboard from "@/features/admin/pages/AdminDashboardPage";
import UserLayout from "@/features/account/layouts/UserLayout";
import { UserDashboardPage } from "@/features/account/pages/UserDashboardPage";
import { UserAppointmentsPage } from "@/features/account/pages/UserAppointmentsPage";
import { UserProfilePage } from "@/features/account/pages/UserProfilePage";
import { userDashboardLoader } from "@/features/account/loaders/userDashboardLoader";
import { UserProvider } from "@/context/UserContext";
import { OAuthCallbackPage } from "@/features/auth/OAuthCallbackPage";
import { ListServicesPage } from "@/features/marketing/pages/ListServicesPage";
import BookingSuccessPage from "@/features/marketing/pages/BookingSuccessPage";
import BookingCancelPage from "@/features/marketing/pages/BookingCancelPage";
import FinalPaymentSuccessPage from "./features/marketing/pages/FinalPaymentSuccessPage";

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
        path: "/categories",
        element: <CategoriesPage />,
      },
      {
        path: "/services/:categoryId",
        element: <ListServicesPage />,
      },
      {
        path: "/book/service/:serviceId",
        element: <ServiceDetailsPage />,
      },
      {
        path: "/book/success",
        element: <BookingSuccessPage />,
      },
      {
        path: "/book/final/success",
        element: <FinalPaymentSuccessPage />,
      },
      {
        path: "/book/cancel",
        element: <BookingCancelPage />,
      },
      {
        path: "/auth/callback",
        element: <OAuthCallbackPage />,
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
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
