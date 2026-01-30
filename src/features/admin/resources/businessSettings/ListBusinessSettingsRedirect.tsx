import { useEffect } from "react";
import { useRedirect } from "ra-core";

export default function ListBusinessSettingsRedirect() {
  const redirect = useRedirect();

  useEffect(() => {
    redirect("edit", "business-settings", "singleton");
  }, [redirect]);

  return <div className="p-20">Loading business settings</div>;
}
