import { Resource } from "ra-core";
import { Admin } from "@/components/admin";
import springDataProvider from "@/data/dataProvider";
import withLogger from "@/components/utils/loggerDataProvider";
import UserList from "@/components/dashboard/adminCustom/UserList";
import AppointmentList from "@/components/dashboard/adminCustom/AppointmentsList";
import ServiceList from "@/components/dashboard/adminCustom/ServiceList";
import EditBusinessHours from "@/components/dashboard/adminCustom/EditBusinessHours";
import ListBusinessHours from "@/components/dashboard/adminCustom/ListBusinessHours";
import EditLoyaltySettings from "@/components/dashboard/adminCustom/EditLoyaltySettings";
import UserEdit from "@/components/dashboard/adminCustom/UserEdit";
import AppointmentEdit from "@/components/dashboard/adminCustom/AppointmentEdit";
import ServiceEdit from "@/components/dashboard/adminCustom/ServiceEdit";
import ServiceCreate from "@/components/dashboard/adminCustom/ServiceCreate";
import AddOnsList from "@/components/dashboard/adminCustom/AddOnsList";
import ListCategories from "@/components/dashboard/adminCustom/ListCategories";
import EditCategories from "@/components/dashboard/adminCustom/EditCategories";
import CreateCategories from "@/components/dashboard/adminCustom/CreateCategories";
import {
  UsersRound,
  Scissors,
  Building,
  ArrowBigUp,
  ClipboardClock,
  CopyPlus,
  TextSelect,
} from "lucide-react";
import AddOnEdit from "@/components/dashboard/adminCustom/AddOnEdit";
import AddOnCreate from "@/components/dashboard/adminCustom/AddOnCreate";
import CreateBusinessHours from "@/components/dashboard/adminCustom/CreateBusinessHours";
import { httpClient } from "@/components/utils/httpClient";
import ListLoyaltyRedirect from "@/components/dashboard/adminCustom/ListLoyaltyRedirect";
import "../index.css";

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
