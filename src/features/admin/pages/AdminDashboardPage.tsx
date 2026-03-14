import { CustomRoutes, Resource } from "ra-core";
import { Route } from "react-router-dom";
import { Admin } from "@/features/admin";
import springDataProvider from "@/features/admin/ra/dataProvider";
import withLogger from "@/features/admin/ra/loggerDataProvider";
import UserList from "@/features/admin/resources/users/UserList";
import AppointmentList from "@/features/admin/resources/appointments/AppointmentsList";
import ServiceList from "@/features/admin/resources/services/ServiceList";
import EditBusinessHours from "@/features/admin/resources/businessHours/EditBusinessHours";
import ListBusinessHours from "@/features/admin/resources/businessHours/ListBusinessHours";
import EditLoyaltySettings from "@/features/admin/resources/loyalty/EditLoyaltySettings";
import UserEdit from "@/features/admin/resources/users/UserEdit";
import AppointmentEdit from "@/features/admin/resources/appointments/AppointmentEdit";
import ServiceEdit from "@/features/admin/resources/services/ServiceEdit";
import ServiceCreate from "@/features/admin/resources/services/ServiceCreate";
import AddOnsList from "@/features/admin/resources/addons/AddOnsList";
import ListCategories from "@/features/admin/resources/categories/ListCategories";
import EditCategories from "@/features/admin/resources/categories/EditCategories";
import CreateCategories from "@/features/admin/resources/categories/CreateCategories";
import {
  UsersRound,
  Scissors,
  Building,
  ArrowBigUp,
  ClipboardClock,
  CopyPlus,
  TextSelect,
  Settings,
  BadgeDollarSignIcon,
  PiggyBank,
} from "lucide-react";
import AddOnEdit from "@/features/admin/resources/addons/AddOnEdit";
import AddOnCreate from "@/features/admin/resources/addons/AddOnCreate";
import CreateBusinessHours from "@/features/admin/resources/businessHours/CreateBusinessHours";
import { httpClient } from "@/lib/httpClient";
import ListLoyaltyRedirect from "@/features/admin/resources/loyalty/ListLoyaltyRedirect";
import "@/styles/index.css";
import EditBusinessSettings from "../resources/businessSettings/EditBusinessSettings";
import ListBusinessSettingsRedirect from "../resources/businessSettings/ListBusinessSettingsRedirect";
import AdminAnalyticsDashboard from "../resources/analytics/AdminAnalyticsDashboard";
import ListPromoCodes from "../resources/promo/ListPromo";
import CreatePromoCodes from "../resources/promo/CreatePromo";
import EditPromoCode from "../resources/promo/EditPromo";
import AdminCalendarPage from "./AdminCalendarPage";
import ListFees from "../resources/fees/ListFees";
import CreateFees from "../resources/fees/CreateFees";
import EditFees from "../resources/fees/EditFees";

const dataPovider = withLogger(
  springDataProvider(`${import.meta.env.VITE_SERVER_API_URL}/admin`, httpClient)
);

export default function AdminDashboard() {
  return (
    <Admin
      basename="/dashboard/admin"
      dataProvider={dataPovider}
      dashboard={AdminAnalyticsDashboard}
    >
      <CustomRoutes>
        <Route path="/calendar" element={<AdminCalendarPage />} />
      </CustomRoutes>

      <Resource
        name="users"
        list={UserList}
        edit={UserEdit}
        icon={UsersRound}
        options={{ label: "Users" }}
      />
      <Resource
        name="appointments"
        list={AppointmentList}
        edit={AppointmentEdit}
        icon={ClipboardClock}
      />
      <Resource
        name="services"
        list={ServiceList}
        edit={ServiceEdit}
        create={ServiceCreate}
        icon={Scissors}
      />
      <Resource
        name="categories"
        list={ListCategories}
        edit={EditCategories}
        create={CreateCategories}
        icon={TextSelect}
      />
      <Resource
        name="add ons"
        list={AddOnsList}
        edit={AddOnEdit}
        create={AddOnCreate}
        icon={CopyPlus}
      />
      <Resource
        name="business hours"
        list={ListBusinessHours}
        edit={EditBusinessHours}
        create={CreateBusinessHours}
        icon={Building}
      />
      <Resource
        name="loyalty-settings"
        list={ListLoyaltyRedirect}
        edit={EditLoyaltySettings}
        icon={ArrowBigUp}
        options={{ label: "Loyalty points" }}
      />

      <Resource
        name="business-settings"
        list={ListBusinessSettingsRedirect}
        edit={EditBusinessSettings}
        icon={Settings}
        options={{ label: "Business settings" }}
      />

      <Resource
        name="promo"
        create={CreatePromoCodes}
        list={ListPromoCodes}
        edit={EditPromoCode}
        icon={BadgeDollarSignIcon}
        options={{ label: "Promo Codes" }}
      />
      <Resource
        name="fee"
        create={CreateFees}
        list={ListFees}
        edit={EditFees}
        icon={PiggyBank}
      />
    </Admin>
  );
}
