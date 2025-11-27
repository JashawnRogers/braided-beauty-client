import { Resource } from "ra-core";
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
} from "lucide-react";
import AddOnEdit from "@/features/admin/resources/addons/AddOnEdit";
import AddOnCreate from "@/features/admin/resources/addons/AddOnCreate";
import CreateBusinessHours from "@/features/admin/resources/businessHours/CreateBusinessHours";
import { httpClient } from "@/lib/httpClient";
import ListLoyaltyRedirect from "@/features/admin/resources/loyalty/ListLoyaltyRedirect";
import "@/styles/index.css";

const dataPovider = withLogger(
  springDataProvider(import.meta.env.VITE_SERVER_API_URL, httpClient)
);

export default function AdminDashboard() {
  return (
    <Admin basename="/dashboard/admin" dataProvider={dataPovider}>
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
    </Admin>
  );
}
