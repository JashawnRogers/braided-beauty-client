import { Resource } from "ra-core";
import { Admin } from "@/components/admin";
import { dataProvider } from "@/data/dataProvider";
import UserList from "@/components/UserList";
import AppointmentList from "@/components/AppointmentsList";
import ServiceList from "@/components/ServiceList";
import EditBusinessHours from "@/components/EditBusinessHours";
import ListBusinessHours from "@/components/ListBusinessHours";
import LoyaltyList from "@/components/ListLoyaltyRecords";
import UserEdit from "@/components/UserEdit";
import AppointmentEdit from "@/components/AppointmentEdit";
import ServiceEdit from "@/components/ServiceEdit";
import ServiceCreate from "@/components/ServiceCreate";
import AddOnsList from "@/components/AddOnsList";
import {
  UsersRound,
  Scissors,
  Building,
  ArrowBigUp,
  ClipboardClock,
  CopyPlus,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <Admin basename="/dashboard/admin" dataProvider={dataProvider}>
      <Resource
        name="users"
        list={UserList}
        edit={UserEdit}
        icon={UsersRound}
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
      <Resource name="add ons" list={AddOnsList} icon={CopyPlus} />
      <Resource
        name="business_hours"
        list={ListBusinessHours}
        edit={EditBusinessHours}
        icon={Building}
      />
      <Resource name="loyalty_points" list={LoyaltyList} icon={ArrowBigUp} />
    </Admin>
  );
}
