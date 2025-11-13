import { useEffect, useState } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import {
  useCreateRoomMutation,
  useGetRoomsQuery,
  useUpdateRoomMutation,
} from "../../../../../Services/accommodationRoomApiSlice";

const RoomModal = ({ open, onClose, accommodationId, roomId }) => {
  const isEdit = Boolean(roomId);
  const { data } = useGetRoomsQuery(accommodationId);
  const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();

  const existingRoom = data?.data?.find((r) => r.id === roomId);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    accommodationId: accommodationId || "",
    units: 1,
    capacity: 1,
    maxGuests: 1,
    basePrice: 0,
    amenities: [],
    images: [],
    published: true,
    checkInFrom: "14:00:00",
    checkOutUntil: "11:00:00",
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    floor: "",
    roomSizeSqFt: 0,
    viewType: "",
    childrenAllowed: true,
    maxChildren: 0,
    extraGuestFee: 0,
    status: "active",
    newSlug: "",
    notes: "",
  });

  useEffect(() => {
    if (isEdit && existingRoom) {
      setForm((prev) => ({ ...prev, ...existingRoom }));
    }
  }, [existingRoom, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleAmenitiesChange = (e) => {
    setForm({
      ...form,
      amenities: e.target.value.split(",").map((a) => a.trim()),
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }
    const imagePaths = files.map((f) => URL.createObjectURL(f));
    setForm({ ...form, images: imagePaths });
  };

  const isLoading = isCreating || isUpdating;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateRoom({ id: roomId, body: form }).unwrap();
        alert("Room updated successfully!");
      } else {
        await createRoom({ ...form, accommodationId }).unwrap();
        alert("Room created successfully!");
      }
      onClose(); // close modal after success
    } catch (err) {
      console.error(err);
      alert("Failed to save room");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl p-6 max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <FaTimes size={18} />
        </button>

        <h2 className="text-2xl font-semibold mb-6">
          {isEdit ? "Edit Room" : "Create Room"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Room Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 mt-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slug
              </label>
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 mt-1"
                placeholder="Auto-generated if empty"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Units
              </label>
              <input
                type="number"
                name="units"
                value={form.units}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Max Guests
                </label>
                <input
                  type="number"
                  name="maxGuests"
                  value={form.maxGuests}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 mt-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Base Price (NPR)
              </label>
              <input
                type="number"
                name="basePrice"
                value={form.basePrice}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amenities
              </label>
              <input
                value={form.amenities.join(", ")}
                onChange={handleAmenitiesChange}
                className="w-full border rounded-md px-3 py-2 mt-1"
                placeholder="Comma separated (e.g. AC, Private Bathroom)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 mt-1"
                rows={3}
                placeholder="Optional notes about this room"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Images (max 5)
              </label>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                accept="image/*"
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
              <div className="grid grid-cols-3 gap-2 mt-2">
                {form.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="preview"
                    className="w-full h-24 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Check-In
                </label>
                <input
                  type="time"
                  name="checkInFrom"
                  value={form.checkInFrom}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Check-Out
                </label>
                <input
                  type="time"
                  name="checkOutUntil"
                  value={form.checkOutUntil}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={form.bedrooms}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={form.bathrooms}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 mt-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                View Type
              </label>
              <input
                name="viewType"
                value={form.viewType}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 mt-1"
                placeholder="e.g. Mountain, Garden"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="childrenAllowed"
                checked={form.childrenAllowed}
                onChange={handleChange}
                className="h-4 w-4 text-red-600"
              />
              <label className="text-sm text-gray-700">Children Allowed</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 mt-1"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md flex items-center gap-2 mt-4"
            >
              <FaSave size={14} />
              {isEdit ? "Update Room" : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;
