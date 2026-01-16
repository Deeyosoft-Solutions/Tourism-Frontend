import { useState } from "react";
import { FaCalendar, FaCog, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import {
  useDeleteRoomMutation,
  useGetRoomsQuery,
  usePublishRoomMutation,
  useUpdateRoomMutation, 
} from "../../../../../Services/accommodationRoomApiSlice";
import RoomModal from "../Hotels-Resorts/Rooms/RoomFormPage";

const STATUS_OPTIONS = ["active", "inactive", "maintenance"];

const RoomsTab = ({ accommodation, onViewRoomUnits, onViewCalendar }) => {
  const {
    data: roomsData,
    isLoading,
    error,
    refetch,
  } = useGetRoomsQuery(accommodation.slug);

  const rooms = roomsData?.data || [];

  const [openModal, setOpenModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const [deleteRoom] = useDeleteRoomMutation();
  const [publishRoom, { isLoading: isPublishing }] =
    usePublishRoomMutation();
  const [updateRoom, { isLoading: isUpdatingStatus }] =
    useUpdateRoomMutation();

  const handleAddRoom = () => {
    setSelectedRoomId(null);
    setOpenModal(true);
  };

  const handleEditRoom = (id) => {
    setSelectedRoomId(id);
    setOpenModal(true);
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await deleteRoom(id).unwrap();
      alert("Room deleted successfully!");
      refetch();
    } catch {
      alert("Failed to delete room");
    }
  };

  // ✅ Publish / Unpublish
  const handlePublishToggle = async (room) => {
    if (room.published && room.totalBookings > 0) {
      alert(
        "Cannot unpublish this room because it has active bookings."
      );
      return;
    }

    try {
      await publishRoom({
        id: room.id,
        published: !room.published,
      }).unwrap();
      refetch();
    } catch (err) {
      alert(err?.data?.message || "Failed to update publish status");
    }
  };

  // ✅ Status change (active | inactive | maintenance)
  const handleStatusChange = async (room, newStatus) => {
    // Block leaving ACTIVE if bookings exist
    if (
      room.status === "active" &&
      newStatus !== "active" &&
      room.totalBookings > 0
    ) {
      alert(
        "Cannot change status while this room has active bookings."
      );
      return;
    }

    try {
      await updateRoom({
        id: room.id,
        status: newStatus,
      }).unwrap();
      refetch();
    } catch (err) {
      alert(err?.data?.message || "Failed to update room status");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">Loading rooms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-red-500">Error loading rooms</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b flex justify-between">
        <div>
          <h2 className="text-lg font-semibold">Rooms</h2>
          <p className="text-sm text-gray-600">
            Manage your room types and pricing
          </p>
        </div>
        <button
          onClick={handleAddRoom}
          className="bg-red-600 text-white px-4 py-2 rounded flex gap-2"
        >
          <FaPlus /> Add Room
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Published</th>
              <th className="px-6 py-3">Base Price</th>
              <th className="px-6 py-3">Capacity</th>
              <th className="px-6 py-3">Bookings</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-b">
                <td className="px-6 py-4">
                  <div className="font-medium">{room.name}</div>
                  <div className="text-xs text-gray-500">
                    Stock: {room.stock}
                  </div>
                </td>

                {/* STATUS DROPDOWN */}
                <td className="px-6 py-4">
                  <select
                    value={room.status}
                    disabled={isUpdatingStatus}
                    onChange={(e) =>
                      handleStatusChange(room, e.target.value)
                    }
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() +
                          status.slice(1)}
                      </option>
                    ))}
                  </select>

                  {room.status === "active" &&
                    room.totalBookings > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Cannot deactivate or put in maintenance
                        while bookings exist
                      </p>
                    )}
                </td>

                {/* PUBLISHED TOGGLE */}
                <td className="px-6 py-4">
                  <label className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={room.published}
                      disabled={
                        isPublishing ||
                        (room.published &&
                          room.totalBookings > 0)
                      }
                      onChange={() =>
                        handlePublishToggle(room)
                      }
                    />
                    <div
                      className={`w-11 h-6 rounded-full after:content-['']
                        after:absolute after:top-[2px] after:left-[2px]
                        after:bg-white after:h-5 after:w-5
                        after:rounded-full after:transition-all
                        peer-checked:after:translate-x-full
                        ${
                          room.published &&
                          room.totalBookings > 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-gray-200 peer-checked:bg-red-600"
                        }`}
                    ></div>
                  </label>
                </td>

                <td className="px-6 py-4">
                  NPR {room.basePrice.toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  {room.capacity}/{room.maxGuests}
                </td>

                <td className="px-6 py-4">
                  {room.totalBookings || 0}
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <button onClick={() => onViewRoomUnits(room)}>
                      <FaCog />
                    </button>
                    <button onClick={() => onViewCalendar(room)}>
                      <FaCalendar />
                    </button>
                    <button onClick={() => handleEditRoom(room.id)}>
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => handleDeleteRoom(room.id)}
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
