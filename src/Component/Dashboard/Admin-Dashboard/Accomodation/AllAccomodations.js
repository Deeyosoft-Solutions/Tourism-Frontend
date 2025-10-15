import { useLocation } from "react-router-dom";
// import AdminRoomsCreate from "./Hotels-Resorts/RoomType/CreateRoomTypes";
import ForAdminBookings from "./Bookings/AllBookings";
import AdminAccomodationsOverview from "./AccomodationsOverview";
import AdminAccomodationTable from "./AdminAccomodationTable";
import AccommodationType from "./AccommodationTypes/AddStayTypes";
import ForAdminAddStay from "./AdminAddStays";

const AllAccomodations = () => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const view = searchParams.get("view") || "overview";
  const stayView = searchParams.get("stay");
  // const showRooms = searchParams.get("room");
  const showType = searchParams.get("type");

  const renderView = () => {
    switch (view) {
      case "stays":
        // Handle stays submenu directly
        if (stayView === "all") return <AdminAccomodationTable />;
        if (showType) return <AccommodationType />;
        // if (showRooms) return <AdminRoomsCreate />;
        if (stayView === "add") return <ForAdminAddStay />;
        return <AdminAccomodationTable />;

      case "bookings":
        return <ForAdminBookings />;

      default:
        return <AdminAccomodationsOverview />;
    }
  };

  return <div className="w-full">{renderView()}</div>;
};

export default AllAccomodations;
