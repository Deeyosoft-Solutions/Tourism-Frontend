import SideBar from "../../../Component/Dashboard/SideBar";
import Header from "../../../Component/Dashboard/Header";
import { useFetchUserProfileQuery } from "../../../Services/userApiSlice";
import LoadingSpinner from "../../../Component/LoadingSpinner";
import AllHostAccomodations from './../../../Component/Dashboard/Host-Dashboard/AllHostAccomodations';
import AllAccomodations from './../../../Component/Dashboard/Admin-Dashboard/Accomodation/AllAccomodations';

const Accomodations = () => {
  const { data, isLoading } = useFetchUserProfileQuery();
  const role = data?.role;

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="flex h-full">
      <SideBar />
      <div className="flex-1 px-4">
        <Header />
        {role === "ADMIN" && <AllAccomodations />}
        {role === "HOST" && <AllHostAccomodations />}
        {!["ADMIN", "HOST"].includes(role) && (
          <p className="text-center mt-6 text-red-500">
            You do not have permission to view this page.
          </p>
        )}
      </div>
    </div>
  );
};

export default Accomodations;
