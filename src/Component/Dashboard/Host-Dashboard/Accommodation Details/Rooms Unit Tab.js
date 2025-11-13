import { useState, useEffect } from "react";
import { FaArrowLeft, FaEdit, FaFilter, FaPlus, FaTrash, FaExclamationCircle } from "react-icons/fa";
import UnitModal from "../Hotels-Resorts/Rooms/RoomUnits";
import { useGetRoomUnitsQuery } from "../../../../Services/acccommodationRoomUnitsApi"; // Adjust path as needed

const RoomUnitsTab = ({ room, onBack }) => {
  const { data: roomUnitsData, isLoading, isError } = useGetRoomUnitsQuery(room.id);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    if (roomUnitsData?.data) {
      setUnits(roomUnitsData.data);
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

  const handleDeleteUnit = (id) => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      setUnits(units.filter((u) => u.id !== id));
    }
  };

  const filteredUnits =
    filterStatus === "all"
      ? units
      : units.filter((u) => u.status === filterStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "maintenance":
        return "bg-orange-100 text-orange-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Example values (you can replace these with actual data later)
  const roomUnitsSetting = 2;
  const activeUnits = units.filter((u) => u.status === "active").length;
  const totalUnits = units.length;

  const exceedsCapacity = activeUnits > roomUnitsSetting;

  return (
    <div className="flex gap-6">
      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 px-6 py-12">
          <p className="text-center text-gray-500">Loading units...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 px-6 py-12">
          <p className="text-center text-red-500">Error loading units. Please try again.</p>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !isError && (
        <>
          {/* Left Section - Main Table */}
          <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100">
            {/* Header */}
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
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <FaPlus size={14} />
                Add Unit
              </button>
            </div>

            {/* Filter and Count */}
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
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <p className="text-sm text-gray-600 font-medium">
                {filteredUnits.length} units
              </p>
            </div>

            {/* Table */}
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
                      Notes
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
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            unit.status
                          )}`}
                        >
                          {unit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {unit.notes || "—"}
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

          {/* Right Side Card */}
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

          {/* Unit Modal */}
          {openUnitModal && (
            <UnitModal
              open={openUnitModal}
              onClose={() => setOpenUnitModal(false)}
              unit={selectedUnit}
              onSave={(unitData) => {
                if (selectedUnit) {
                  setUnits(
                    units.map((u) =>
                      u.id === selectedUnit.id ? { ...u, ...unitData } : u
                    )
                  );
                } else {
                  const newUnit = { id: units.length + 1, ...unitData };
                  setUnits([...units, newUnit]);
                }
                setOpenUnitModal(false);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default RoomUnitsTab;