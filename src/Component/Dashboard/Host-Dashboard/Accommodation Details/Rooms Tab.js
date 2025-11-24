import { useState } from "react";
import { FaCalendar, FaCog, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import {
  useDeleteRoomMutation,
  useGetRoomsQuery,
} from "../../../../Services/accommodationRoomApiSlice";
import RoomModal from "../Hotels-Resorts/Rooms/RoomFormPage";
import LoadingSpinner from './../../../LoadingSpinner';
import ErrorMessage from "./../../../ErrorMessage";

const RoomsTab = ({ accommodation, onViewRoomUnits, onViewCalendar }) => {
  const {
    data: roomsData,
    isLoading,
    error,
  } = useGetRoomsQuery(accommodation.slug);
  const rooms = roomsData?.data || [];

  const [openModal, setOpenModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const [deleteRoom] = useDeleteRoomMutation();

  const handleAddRoom = () => {
    setSelectedRoomId(null);
    setOpenModal(true);
  };

  const handleEditRoom = (id) => {
    setSelectedRoomId(id);
    setOpenModal(true);
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(id).unwrap();
        alert("Room deleted successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to delete room");
      }
    }
  };

  if (isLoading) {
    return (
      <LoadingSpinner fullScreen />
    );
  }

  if (error) {
    return (
      <ErrorMessage message="Failed to load rooms." />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Rooms</h2>
          <p className="text-sm text-gray-600">
            Manage your room types and pricing
          </p>
        </div>
        <button
          onClick={handleAddRoom}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
        >
          <FaPlus /> Add Room
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-900 text-xs font-semibold border-b">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Published</th>
              <th className="px-6 py-3">Base Price</th>
              <th className="px-6 py-3">Capacity/Max Guests</th>
              <th className="px-6 py-3">Units</th>
              <th className="px-6 py-3">Total Bookings</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{room.name}</div>
                    <div className="text-xs text-gray-500">
                      Stock: {room.stock} | {room.bedrooms}BR/{room.beds}Beds/
                      {room.bathrooms}BA
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize ${
                      room.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {room.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked={room.published}
                      readOnly
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-red-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </td>

                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">NPR</div>
                    <div className="text-gray-900">
                      {room.basePrice.toLocaleString()}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {room.capacity}/{room.maxGuests} guests
                </td>

                <td className="px-6 py-4">
                  <div className="text-xs">
                    {room.stock} active / {room.stock} total
                  </div>
                </td>

                <td className="px-6 py-4">{room.totalBookings || 0}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-5">
                    <button
                      onClick={() => onViewRoomUnits(room)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Manage Units"
                    >
                      <FaCog />
                    </button>

                    <button
                      onClick={() => onViewCalendar(room)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Calendar"
                    >
                      <FaCalendar />
                    </button>

                    <button
                      onClick={() => handleEditRoom(room.id)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Edit Room"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Room"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Room Modal */}
      <RoomModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        accommodationId={accommodation.id}
        roomId={selectedRoomId}
      />
    </div>
  );
};

export default RoomsTab;
