import { useLocation } from "react-router-dom";
import ForAdminBookings from "./Bookings/AllBookings";
import HostAccomodationsOverview from "./HostAccomodationsOverview";
import HostAccomodationTable from "./HostAccomodationTable";
import ForHostAddStay from "./HostStays/HostAddStays";

const AllAccomodations = () => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const view = searchParams.get("view") || "overview";
  const stayView = searchParams.get("stay");

  const renderView = () => {
    switch (view) {
      case "stays":
        if (stayView === "all") return <HostAccomodationTable />;
        if (stayView === "add") return <ForHostAddStay />;
        return <HostAccomodationTable />;

      case "bookings":
        return <ForAdminBookings />;

      default:
        return <HostAccomodationsOverview />;
    }
  };

  return <div className="w-full">{renderView()}</div>;
};

export default AllAccomodations;
