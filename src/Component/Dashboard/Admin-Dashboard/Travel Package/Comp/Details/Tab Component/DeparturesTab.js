import { useState } from 'react';
import { useGetDeparturesQuery, useDeleteDepartureMutation } from '../../../../../../../Services/departuresApiSlice';
import EditDepartureModal from '../Edit/EditDepartureModal';
import AddDepartureModal from '../Edit/AddDepartureModal';
import BulkAddDepartureModal from '../Edit/AddBulkDeparture';
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import LoadingSpinner from '../../../../../../LoadingSpinner';
import ErrorMessage from '../../../../../../ErrorMessage';

const DeparturesTab = ({ packageSlug }) => {
  const { data: response, isLoading, isError, error, refetch } = useGetDeparturesQuery(packageSlug);
  const [deleteDeparture] = useDeleteDepartureMutation();
  const departures = response?.data || [];

  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const openEditModal = (departure) => {
    setSelectedDeparture(departure);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedDeparture(null);
    setIsEditModalOpen(false);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openBulkAddModal = () => {
    setIsBulkAddModalOpen(true);
  };

  const closeBulkAddModal = () => {
    setIsBulkAddModalOpen(false);
  };

  const handleDelete = async (departure) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the departure on ${new Date(departure.date).toLocaleDateString()}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(departure.id);
    try {
      await deleteDeparture({ slug: packageSlug, id: departure.id }).unwrap();
      alert('Departure deleted successfully');
    } catch (error) {
      console.error('Failed to delete departure:', error);
      alert(error?.data?.message || 'Failed to delete departure. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading)
    return (
      <div className="text-gray-600">
        <LoadingSpinner />
      </div>
    );

  if (isError && error?.status !== 404)
    return (
      <ErrorMessage
        message="Oops! Something went wrong while loading departures."
        onRetry={refetch}
      />
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Departure Schedules</h3>
        <div className="flex gap-3">
          <button
            onClick={openBulkAddModal}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors font-medium"
          >
            Bulk Add
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
          >
            <FaPlus /> Add Departure
          </button>
        </div>
      </div>

      {departures.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No departures scheduled for this package.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departures.map((departure) => (
            <div
              key={departure.id}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(departure.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 font-medium">Available Seats</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {departure.capacityRemaining}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 font-medium">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        departure.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {departure.status === 'ACTIVE' ? 'Available' : 'Closed'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => openEditModal(departure)}
                    className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                    disabled={deletingId === departure.id}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(departure)}
                    disabled={deletingId === departure.id}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === departure.id ? (
                      <>
                        <span className="animate-spin">⏳</span> Deleting...
                      </>
                    ) : (
                      <>
                        <FaTrashAlt /> Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedDeparture && (
        <EditDepartureModal
          packageSlug={packageSlug}
          departure={selectedDeparture}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
        />
      )}

      <AddDepartureModal
        packageSlug={packageSlug}
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
      />

      <BulkAddDepartureModal
        packageSlug={packageSlug}
        isOpen={isBulkAddModalOpen}
        onClose={closeBulkAddModal}
      />
    </div>
  );
};

export default DeparturesTab;