import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useGetTravelPackagesQuery,
  useUpdateTravelPackageMutation,
  useDeleteTravelPackageMutation,
} from "../../../../Services/travelPackageApiSlice";
import LoadingSpinner from "../../../LoadingSpinner";
import PackagesListComponent from "./Comp/PackagesListComponent";
import PackageDetailsComponent from "./Comp/Details/PackageDetailsComponent";
import OverviewComponent from "./Comp/OverviewComponent";
import { FaArrowLeft } from "react-icons/fa";
import ErrorToast from "../../../ErrorToast";
import SuccessToast from "../../../SuccessToast";
import AllBookings from "./Comp/Travel Bookings/AllBookings";

const TravelPackagesDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const view = query.get("view") || "traveloverview";

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetTravelPackagesQuery();

  const [updateTravelPackage] = useUpdateTravelPackageMutation();
  const [deleteTravelPackage] = useDeleteTravelPackageMutation();
  const [searchTerm, setSearchTerm] = useState("");

  const packages = response?.data || [];
  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle departures
  const handleToggleDepartures = async (pkg, e) => {
    e?.stopPropagation();
    try {
      await updateTravelPackage({
        id: pkg.id,
        updates: { usesDepartures: !pkg.usesDepartures },
      }).unwrap();

      setNotification({
        show: true,
        message: `Departures ${
          pkg.usesDepartures ? "disabled" : "enabled"
        } for ${pkg.name}`,
        type: "success",
      });
      refetch();
    } catch (err) {
      setNotification({
        show: true,
        message: err.message || "Failed to update departures",
        type: "error",
      });
    }
  };

  // Delete package
  const handleDelete = async (pkg, e) => {
    e?.stopPropagation();
    if (!pkg?.slug)
      return setNotification({
        show: true,
        message: "Package slug not found",
        type: "error",
      });

    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await deleteTravelPackage(pkg.slug).unwrap();
        setNotification({
          show: true,
          message: "Package deleted successfully!",
          type: "success",
        });
        setSelectedPackage(null); // reset details view if deleted
        refetch();
      } catch (err) {
        setNotification({
          show: true,
          message: err.message || "Failed to delete package",
          type: "error",
        });
      }
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError)
    return (
      <ErrorToast
        message={error?.message || "Error fetching travel packages"}
        onClose={refetch}
      />
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50">
          {notification.type === "success" ? (
            <SuccessToast
              message={notification.message}
              onClose={() => setNotification({ ...notification, show: false })}
            />
          ) : (
            <ErrorToast
              message={notification.message}
              onClose={() => setNotification({ ...notification, show: false })}
            />
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedPackage ? (
          <>
            <button
              onClick={() => setSelectedPackage(null)}
              className="flex items-center gap-2 border border-gray-300 rounded-md mb-2 px-3 py-1.5 text-sm font-medium hover:bg-gray-100 transition"
            >
              <FaArrowLeft size={14} /> Go Back
            </button>

            <PackageDetailsComponent
              selectedPackage={selectedPackage}
              handleEdit={(pkg) => setSelectedPackage(pkg)}
              handleToggleDepartures={handleToggleDepartures}
              handleDelete={handleDelete}
            />
          </>
        ) : view === "traveloverview" ? (
          <OverviewComponent
            packages={packages}
            navigateTo={(page) =>
              navigate(`/dashboard/travelpackages?view=${page}`)
            }
          />
        ) : view === "travelbookings" ? (
          <AllBookings />
        ) : (
          <PackagesListComponent
            filteredPackages={filteredPackages}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleRowClick={(pkg) => setSelectedPackage(pkg)}
            handleToggleDepartures={handleToggleDepartures}
            handleDelete={handleDelete}
            refetch={refetch}
          />
        )}
      </div>
    </div>
  );
};

export default TravelPackagesDashboard;
