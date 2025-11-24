import { BiFilterAlt, BiSearch } from "react-icons/bi";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { Eye } from "lucide-react";
import CreatedByCell from "./CreatedByCell";
import { useState } from "react";
import CreateTravelPackageModal from "../CreatePackagesModal";
import UpdateTravelPackageModal from "../UpdatePackagesModal";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const PackagesListComponent = ({
  filteredPackages,
  searchTerm,
  setSearchTerm,
  handleRowClick,
  handleToggleDepartures,
  handleDelete,
  handleCreatePackage,
  handleUpdatePackage,
}) => {   
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const openUpdateModal = (pkg) => {
    setSelectedPackage(pkg);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
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
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
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
                  "Created By",
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
                    <td className="px-4 py-3">
                      <CreatedByCell userId={pkg.createdById} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {Number(pkg.bookingLeadHours)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-3">
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
                        <button
                          onClick={() => openUpdateModal(pkg)}
                          className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-md transition"
                          title="Edit Package"
                        >
                          <FaPencilAlt size={16} />
                        </button>
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
                    colSpan="8"
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
      <CreateTravelPackageModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(formData) => {
          handleCreatePackage(formData);
          setIsCreateModalOpen(false);
        }}
      />

      {/* Update Modal */}
      <UpdateTravelPackageModal
        isOpen={!!selectedPackage && isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        initialValues={selectedPackage}
        onUpdate={(formData) => {
          handleUpdatePackage(selectedPackage.id, formData);
          setIsUpdateModalOpen(false);
        }}
      />
    </div>
  );
};

export default PackagesListComponent;
