import { useEffect } from "react";
import { useRedirect } from "ra-core";

export default function ListLoyaltyRedirect() {
  const redirect = useRedirect();

  useEffect(() => {
    redirect("edit", "loyalty-settings", "singleton");
  }, [redirect]);

  return <div className="p-20">Loading loyalty settings...</div>;
}
