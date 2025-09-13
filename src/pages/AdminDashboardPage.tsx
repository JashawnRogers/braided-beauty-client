import { Resource } from "ra-core";
import { Admin, EditGuesser } from "@/components/admin";
import { dataProvider } from "@/data/dataProvider";
import UserList from "@/components/UserList";
import AppointmentList from "@/components/AppointmentsList";
import ServiceList from "@/components/ServiceList";
import EditBusinessHours from "@/components/EditBusinessHours";
import ListBusinessHours from "@/components/ListBusinessHours";
import LoyaltyList from "@/components/ListLoyaltyRecords";
import UserEdit from "@/components/UserEdit";
import {
  UsersRound,
  Scissors,
  Building,
  ArrowBigUp,
  ClipboardClock,
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
        edit={EditGuesser}
        icon={ClipboardClock}
      />
      <Resource
        name="services"
        list={ServiceList}
        edit={EditGuesser}
        icon={Scissors}
      />
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
