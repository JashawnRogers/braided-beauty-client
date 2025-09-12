import { Resource } from "ra-core";
import { Admin, EditGuesser, ShowGuesser } from "@/components/admin";
import { dataProvider } from "@/data/dataProvider";
import UserList from "@/components/UserList";
import AppointmentList from "@/components/AppointmentsList";
import ServiceList from "@/components/ServiceList";
import EditBusinessHours from "@/components/EditBusinessHours";
import ListBusinessHours from "@/components/ListBusinessHours";
import LoyaltyList from "@/components/ListLoyaltyRecords";
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
        show={ShowGuesser}
        edit={EditGuesser}
        icon={UsersRound}
      />
      <Resource
        name="appointments"
        list={AppointmentList}
        show={ShowGuesser}
        edit={EditGuesser}
        icon={ClipboardClock}
      />
      <Resource
        name="services"
        list={ServiceList}
        show={ShowGuesser}
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
