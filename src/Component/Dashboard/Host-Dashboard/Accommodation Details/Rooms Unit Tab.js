import { useState, useEffect } from "react";
import { FaArrowLeft, FaEdit, FaFilter, FaPlus, FaTrash, FaExclamationCircle } from "react-icons/fa";
import UnitModal from "../Hotels-Resorts/Rooms/RoomUnits";
import { useGetRoomUnitsQuery, useCreateRoomUnitMutation, useDeleteRoomUnitMutation } from "../../../../Services/acccommodationRoomUnitsApi";

const RoomUnitsTab = ({ room, onBack }) => {
  const { data: roomUnitsData, isLoading, isError } = useGetRoomUnitsQuery(room.id);
  const [createRoomUnit, { isLoading: isCreating }] = useCreateRoomUnitMutation();
  const [deleteRoomUnit] = useDeleteRoomUnitMutation();
  const [units, setUnits] = useState([]);

  useEffect(() => {
    if (roomUnitsData && Array.isArray(roomUnitsData)) {
      setUnits(roomUnitsData);
    }
  }, [roomUnitsData]);

  const [filterStatus, setFilterStatus] = useState("all");
  const [openUnitModal, setOpenUnitModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const handleAddUnit = () => {
    setSelectedUnit(null);
    setOpenUnitModal(true);
  };

  const handleEditUnit = (unit) => {
    setSelectedUnit(unit);
    setOpenUnitModal(true);
  };

  const handleDeleteUnit = async (id) => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      try {
        await deleteRoomUnit({ roomId: room.id, unitId: id }).unwrap();
        
        // Remove from local state after successful deletion
        setUnits(units.filter((u) => u.id !== id));
      } catch (error) {
        console.error("Failed to delete unit:", error);
        const errorMessage = error?.data?.message || "Failed to delete unit. Please try again.";
        alert(errorMessage);
      }
    }
  };

  const handleSaveUnit = async (unitData) => {
    if (selectedUnit) {
      // Update existing unit
      setUnits(
        units.map((u) =>
          u.id === selectedUnit.id ? { ...u, ...unitData } : u
        )
      );
    } else {
      // Create new unit
      try {
        // Transform the data to match API expectations
        const payload = {
          roomId: room.id,
          labels: [unitData.label], // Convert single label to array
          active: unitData.status === "active",
          notes: unitData.notes || ""
        };
        
        const response = await createRoomUnit(payload).unwrap();
        
        // Add the newly created unit(s) to the list
        // API might return an array of created units
        if (Array.isArray(response)) {
          setUnits([...units, ...response]);
        } else {
          setUnits([...units, response]);
        }
      } catch (error) {
        console.error("Failed to create unit:", error);
        const errorMessage = error?.data?.message || "Failed to create unit. Please try again.";
        alert(errorMessage);
        return; // Don't close modal on error
      }
    }
    setOpenUnitModal(false);
  };

  const filteredUnits = Array.isArray(units)
    ? filterStatus === "all"
      ? units
      : filterStatus === "active"
      ? units.filter((u) => u.active === true)
      : units.filter((u) => u.active === false)
    : [];

  const getStatusColor = (active) => {
    return active
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";
  };

  const roomUnitsSetting = 2;
  const activeUnits = Array.isArray(units) ? units.filter((u) => u.active === true).length : 0;
  const totalUnits = Array.isArray(units) ? units.length : 0;
  const exceedsCapacity = activeUnits > roomUnitsSetting;

  return (
    <div className="flex gap-6">
      {isLoading && (
        <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 px-6 py-12">
          <p className="text-center text-gray-500">Loading units...</p>
        </div>
      )}

      {isError && (
        <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 px-6 py-12">
          <p className="text-center text-red-500">Error loading units. Please try again.</p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-sm text-gray-600 border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaArrowLeft size={14} />
                  <span>Back to Rooms</span>
                </button>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Manage Units List</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{room.name}</p>
                </div>
              </div>

              <button
                onClick={handleAddUnit}
                disabled={isCreating}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPlus size={14} />
                {isCreating ? "Creating..." : "Add Unit"}
              </button>
            </div>

            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaFilter className="text-gray-400" size={14} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <p className="text-sm text-gray-600 font-medium">
                {filteredUnits.length} units
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Label
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUnits.map((unit) => (
                    <tr key={unit.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {unit.label}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            unit.active
                          )}`}
                        >
                          {unit.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(unit.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleEditUnit(unit)}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                            title="Edit Unit"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUnit(unit.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Delete Unit"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUnits.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500 text-sm">
                  No units found matching the selected filter.
                </p>
              </div>
            )}
          </div>

          <div className="w-80 bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Units vs Room Capacity
              </h3>

              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Room Units Setting:</span>{" "}
                  {roomUnitsSetting}
                </p>
                <p>
                  <span className="font-medium">Active Units:</span> {activeUnits}
                </p>
                <p>
                  <span className="font-medium">Total Units:</span> {totalUnits}
                </p>
              </div>

              {exceedsCapacity && (
                <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                  <FaExclamationCircle className="mt-0.5" />
                  <span>Active units exceed room capacity.</span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button className="w-full border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition">
                Sync to Active Units
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                This will keep the unit counts aligned with your room capacity settings.
              </p>
            </div>
          </div>

          {openUnitModal && (
            <UnitModal
              open={openUnitModal}
              onClose={() => setOpenUnitModal(false)}
              unit={selectedUnit}
              onSave={handleSaveUnit}
              isLoading={isCreating}
            />
          )}
        </>
      )}
    </div>
  );
};

export default RoomUnitsTab;