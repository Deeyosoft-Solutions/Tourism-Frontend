import SideBar from "../../../Component/Dashboard/SideBar";
import Header from "../../../Component/Dashboard/Header";
import { useFetchUserProfileQuery } from "../../../Services/userApiSlice";
import LoadingSpinner from "../../../Component/LoadingSpinner";
import TravelPackagesDashboard from "../../../Component/Dashboard/Admin-Dashboard/Travel Package/AllTravelPackages";
import AgencyTravelPackagesDashboard from "../../../Component/Dashboard/Travel-Dashboard/AllUserTravelPackages";
import { useState } from "react";

const TravelPackages = () => {
  const { data, isLoading } = useFetchUserProfileQuery();
  const role = data?.role;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="flex h-full">
      <SideBar
        isSidebarOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 px-4">
        <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        {role === "ADMIN" && <TravelPackagesDashboard />}
        {role === "TRAVELAGENCY" && <AgencyTravelPackagesDashboard />}
        {!["ADMIN", "TRAVELAGENCY"].includes(role) && (
          <p className="text-center mt-6 text-red-500">
            You do not have permission to view this page.
          </p>
        )}
      </div>
    </div>
  );
};

export default TravelPackages;
