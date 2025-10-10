import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useGetTravelPackagesByCreatorIdQuery,
  useUpdateTravelPackageMutation,
  useDeleteTravelPackageMutation,
} from "../../../Services/travelPackageApiSlice";
import PackagesListComponent from "./Comp/PackagesListComponent";
import PackageDetailsComponent from "./Comp/Details/PackageDetailsComponent";
import OverviewComponent from "./Comp/OverviewComponent";
import { useFetchUserProfileQuery } from "../../../Services/userApiSlice";
import LoadingSpinner from "../../LoadingSpinner";
import ErrorToast from "../../ErrorToast";
import SuccessToast from "../../SuccessToast";

const AgencyTravelPackagesDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const view = query.get("view") || "overview";

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const {
    data: userProfile,
    isLoading: profileLoading,
    isError: profileError,
  } = useFetchUserProfileQuery();

  const creatorId = userProfile?.id;

  // ✅ 3. Fetch travel packages for that creatorId
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetTravelPackagesByCreatorIdQuery(creatorId, {
    skip: !creatorId, // don't run until creatorId is available
  });

  const [updateTravelPackage] = useUpdateTravelPackageMutation();
  const [deleteTravelPackage] = useDeleteTravelPackageMutation();
  const [searchTerm, setSearchTerm] = useState("");

  const packages = response?.data || [];

  // Get selected package from URL
  const packageId = query.get("packageId");
  const selectedPackage = packages.find((p) => p.id === packageId) || null;

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    return () => {
      document.querySelectorAll("img[src^='blob:']").forEach((img) => {
        URL.revokeObjectURL(img.src);
      });
    };
  }, []);

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
        navigate("/dashboard/travelpackages?view=packages");
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

  const handleUpdatePackage = async (id, updates) => {
    try {
      await updateTravelPackage({ id, updates }).unwrap();
      setNotification({
        show: true,
        message: "Package updated successfully!",
        type: "success",
      });
      refetch();
    } catch (err) {
      setNotification({
        show: true,
        message: err.message || "Failed to update package",
        type: "error",
      });
    }
  };

  if (profileLoading) return <LoadingSpinner fullScreen />;
  if (profileError)
    return (
      <ErrorToast
        message="Error fetching user profile"
        onClose={() => window.location.reload()}
      />
    );

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
              onClick={() =>
                navigate("/dashboard/travelpackages?view=packages")
              }
              className="mb-6 text-blue-600 hover:underline"
            >
              ← Back to Packages
            </button>

            <PackageDetailsComponent
              selectedPackage={selectedPackage}
              handleEdit={(pkg) =>
                navigate(
                  `/dashboard/travelpackages?view=packages&packageId=${pkg.id}`
                )
              }
              handleToggleDepartures={handleToggleDepartures}
              handleDelete={handleDelete}
            />
          </>
        ) : view === "overview" ? (
          <OverviewComponent
            packages={packages}
            navigateTo={(page) =>
              navigate(`/dashboard/travelpackages?view=${page}`)
            }
          />
        ) : (
          <PackagesListComponent
            filteredPackages={filteredPackages}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleRowClick={(pkg) =>
              navigate(
                `/dashboard/travelpackages?view=packages&packageId=${pkg.id}`
              )
            }
            handleToggleDepartures={handleToggleDepartures}
            handleDelete={handleDelete}
            handleUpdatePackage={handleUpdatePackage}
            handleCreatePackage={(formData) =>
              console.log("Create package:", formData)
            }
          />
        )}
      </div>
    </div>
  );
};

export default AgencyTravelPackagesDashboard;
