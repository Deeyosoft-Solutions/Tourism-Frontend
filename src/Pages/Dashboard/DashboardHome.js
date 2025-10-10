import SideBar from "./../../Component/Dashboard/SideBar";
import Header from "./../../Component/Dashboard/Header";
import { useFetchUserProfileQuery } from "../../Services/userApiSlice";
import DashboardOverview from "../../Component/Dashboard/Overview";

const DashboardHome = () => {
  const { data, isLoading, error } = useFetchUserProfileQuery();

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>Error loading profile.</div>;

  const role = data?.role || "guest";
  const normalizedRole = role.toLowerCase();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar stays fixed full height */}
      <SideBar />

      {/* Main content scrolls independently */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-gray-50">
        <Header />
        <div className="p-4 flex-1 overflow-y-auto">
          <DashboardOverview role={normalizedRole} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
