import { BiFilterAlt, BiSearch } from "react-icons/bi";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { Eye } from "lucide-react";
import { useState } from "react";
import { useDeleteTravelPackageMutation } from "../../../../../Services/travelPackageApiSlice";
import CreatePackageModal from "../CreatePackagesModal";
import UpdatePackageModal from "../UpdatePackagesModal";
import SuccessToast from "../../../../SuccessToast";
import ErrorToast from "../../../../ErrorToast";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const PackagesListComponent = ({
  filteredPackages,
  searchTerm,
  setSearchTerm,
  handleRowClick,
  handleToggleDepartures,
  refetch,
}) => {
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [deleteTravelPackage] = useDeleteTravelPackageMutation();

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
      } catch (err) {
        setNotification({
          show: true,
          message: err.message || "Failed to delete package",
          type: "error",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
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

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-red-500">
          All Travel Packages
        </h2>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search travel packages..."
            className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <BiSearch
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition">
            <BiFilterAlt size={18} className="mr-2" />
            <span className="text-sm font-medium">Filter</span>
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full md:w-auto disabled:opacity-50"
            aria-label="Add new Category"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Add Package
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                {[
                  "Image",
                  "Name",
                  "Price",
                  "Destination",
                  "Departures",
                  "Lead Time",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPackages?.length > 0 ? (
                filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      {pkg.images?.[0] ? (
                        <img
                          src={`${API_BASE_URL}${pkg.images[0]}`}
                          alt={pkg.name}
                          className="w-14 h-14 rounded-md object-cover shadow-sm"
                          onError={(e) => {
                            e.target.src = "/assets/no-image.png";
                          }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {pkg.name}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      Rs. {Number(pkg.price)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {pkg.destinationsRelation?.[0]?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => handleToggleDepartures(pkg, e)}
                        className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors ${
                          pkg.usesDepartures ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform ${
                            pkg.usesDepartures
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {Number(pkg.bookingLeadHours)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        {/* View button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(pkg);
                          }}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {/* Edit button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPackage(pkg);
                            setIsUpdateModalOpen(true);
                          }}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition"
                          title="Edit Package"
                        >
                          <FaEdit size={16} />
                        </button>
                        {/* Delete button */}
                        <button
                          onClick={(e) => handleDelete(pkg, e)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                          title="Delete Package"
                        >
                          <FaTrashAlt size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "No matching travel packages found"
                      : "No travel packages available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreatePackageModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false); // Close modal
            refetch(); // Refresh table
            setNotification({
              show: true,
              message: "Package created successfully!",
              type: "success",
            });
          }}
        />
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && selectedPackage && (
        <UpdatePackageModal
          packageData={selectedPackage}
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedPackage(null);
          }}
          onSuccess={() => {
            setIsUpdateModalOpen(false);
            setSelectedPackage(null);
            refetch(); // Refresh table
            setNotification({
              show: true,
              message: "Package updated successfully!",
              type: "success",
            });
          }}
        />
      )}
    </div>
  );
};

export default PackagesListComponent;
