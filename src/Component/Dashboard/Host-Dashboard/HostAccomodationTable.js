import { useState } from "react";
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import {
  useGetAccommodationsByHostQuery,
  useDeleteAccommodationMutation,
} from "../../../Services/accomodationApiSlice";
import ForAdminAddStay from "./HostStays/HostAddStays";
import HostAccommodationDetailsView from "./HostAccomodationDetailsView";
import ForAdminUpdateStay from "./HostStays/HostUpdateStays";
import ErrorMessage from "../../ErrorMessage";
import LoadingSpinner from './../../LoadingSpinner';
import { useFetchUserProfileQuery } from "../../../Services/userApiSlice";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const AdminAccomodationTable = () => {
    const { data:userData } = useFetchUserProfileQuery();
  const { data, isLoading, isError, error, refetch } =
    useGetAccommodationsByHostQuery(userData.id);
  const [deleteAccommodation] = useDeleteAccommodationMutation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [accommodationToEdit, setAccommodationToEdit] = useState(null);

  const accommodations = data?.data || [];

  const handleEdit = (accommodation) => {
    setAccommodationToEdit(accommodation);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this accommodation?")) {
      try {
        await deleteAccommodation(id).unwrap();
        refetch();
        alert("Accommodation deleted successfully!");
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete accommodation. Please try again.");
      }
    }
  };

  if (isLoading)
    return (
      <div className="p-6 text-center text-gray-600">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {selectedAccommodation ? (
        <HostAccommodationDetailsView
          accommodation={selectedAccommodation}
          onClose={() => setSelectedAccommodation(null)}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-red-500">
              All Accommodations
            </h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
            >
              <FaPlus /> Add Accommodation
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
            <table className="min-w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-900 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Address</th>
                  <th className="px-6 py-3">Price/Night</th>
                  <th className="px-6 py-3">Max Guests</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isError ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-6 text-center text-red-600"
                    >
                      <ErrorMessage
                        message={error?.message || "Internal server error"}
                        onRetry={refetch}
                      />
                    </td>
                  </tr>
                ) : accommodations.length > 0 ? (
                  accommodations.map((acc) => (
                    <tr
                      key={acc.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={
                            acc.images?.[0]
                              ? `${API_BASE_URL}${acc.images[0]}`
                              : "/placeholder.png"
                          }
                          alt={acc.name}
                          className="w-16 h-16 object-cover rounded-md border"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {acc.name}
                      </td>
                      <td className="px-6 py-4">{acc.address}</td>
                      <td className="px-6 py-4">Rs. {acc.pricePerNight}</td>
                      <td className="px-6 py-4">{acc.maxGuests}</td>
                      <td
                        className={`px-6 py-4 font-medium ${
                          acc.status === "active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {acc.status}
                      </td>
                      <td className="px-6 py-4 text-center space-x-3">
                        <button
                          onClick={() => setSelectedAccommodation(acc)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="View Details"
                        >
                          <FaEye className="inline-block w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(acc)}
                          className="text-green-500 hover:text-green-700 transition"
                          title="Edit"
                        >
                          <FaEdit className="inline-block w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(acc.id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete"
                        >
                          <FaTrash className="inline-block w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-6 text-center text-gray-500"
                    >
                      No accommodations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add Accommodation Modal */}
          {isAddModalOpen && (
            <ForAdminAddStay
              onClose={() => setIsAddModalOpen(false)}
              onAdded={refetch}
            />
          )}

          {/* Update Accommodation Modal */}
          {isUpdateModalOpen && (
            <ForAdminUpdateStay
              accommodation={accommodationToEdit}
              onClose={() => {
                setIsUpdateModalOpen(false);
                setAccommodationToEdit(null);
              }}
              onUpdated={refetch}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdminAccomodationTable;
