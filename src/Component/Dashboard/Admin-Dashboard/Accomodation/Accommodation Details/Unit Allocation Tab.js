import { useState } from "react";
import { FaArrowLeft, FaCalendar } from "react-icons/fa";

const UnitAllocationTab = ({ room, onBack }) => {
  const [dateRange, setDateRange] = useState({
    start: "Oct 6",
    end: "Oct 12, 2025"
  });

  const handleThisWeek = () => {
    setDateRange({
      start: "Oct 6",
      end: "Oct 12, 2025"
    });
  };

  const handleNextWeek = () => {
    setDateRange({
      start: "Oct 13",
      end: "Oct 19, 2025"
    });
  };

  // Sample data for the allocation matrix
  const units = ["101", "102", "103", "104", "105", "106", "107", "108"];
  const days = [
    { day: "Mon", date: "Oct 6" },
    { day: "Tue", date: "Oct 7" },
    { day: "Wed", date: "Oct 8" },
    { day: "Thu", date: "Oct 9" },
    { day: "Fri", date: "Oct 10" },
    { day: "Sat", date: "Oct 11" },
    { day: "Sun", date: "Oct 12" },
    { day: "Sun", date: "Oct 12" },
    { day: "Sun", date: "Oct 12" },
    { day: "Sun", date: "Oct 12" },
  ];

  // Sample allocation data
  const allocations = {
    "101": {
      "Oct 7": { status: "booked", code: "AYK902" },
      "Oct 8": { status: "booked", code: "AYK902" },
      "Oct 9": { status: "booked", code: "AYK902" },
    },
    "102": {
      "Oct 11": { status: "booked", code: "Z3L1K0" },
      "Oct 12": { status: "booked", code: "Z3L1K0" },
    },
    "105": {
      "Oct 6": { status: "maintenance" },
      "Oct 7": { status: "maintenance" },
      "Oct 8": { status: "maintenance" },
      "Oct 9": { status: "maintenance" },
      "Oct 10": { status: "maintenance" },
      "Oct 11": { status: "maintenance" },
      "Oct 12": { status: "maintenance" },
    },
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "booked":
        return "bg-red-100 border-red-300 text-red-700";
      case "maintenance":
        return "bg-orange-100 border-orange-300 text-orange-700";
      case "blocked":
        return "bg-gray-200 border-gray-400 text-gray-700";
      default:
        return "bg-white border-gray-200 hover:border-gray-300";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-gray-600 border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaArrowLeft size={14} />
              <span>Back to Rooms</span>
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Unit Allocation</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Which units are taken this week?
              </p>
            </div>
          </div>
        </div>

        {/* Date Range and Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="font-medium">Date Range:</span>
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                <FaCalendar className="text-gray-400" size={14} />
                <span>{dateRange.start} - {dateRange.end}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleThisWeek}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                This Week
              </button>
              <button 
                onClick={handleNextWeek}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Next Week
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
              <span className="text-gray-600">Free</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
              <span className="text-gray-600">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 border-2 border-gray-400 rounded"></div>
              <span className="text-gray-600">Blocked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100 border-2 border-orange-300 rounded"></div>
              <span className="text-gray-600">Maintenance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Allocation Matrix */}
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Allocation Matrix</h3>
        
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Header Row */}
            <div className="flex mb-2">
              <div className="w-20 flex-shrink-0"></div>
              {days.map((day, idx) => (
                <div key={idx} className="w-24 flex-shrink-0 px-1">
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-900">{day.day}</div>
                    <div className="text-xs text-gray-500">{day.date}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Unit Rows */}
            {units.map((unit) => (
              <div key={unit} className="flex mb-2 items-center">
                <div className="w-20 flex-shrink-0">
                  <div className="bg-gray-100 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 text-center">
                    {unit}
                  </div>
                </div>
                {days.map((day, idx) => {
                  const allocation = allocations[unit]?.[day.date];
                  const status = allocation?.status;
                  const code = allocation?.code;

                  return (
                    <div key={idx} className="w-24 flex-shrink-0 px-1">
                      <div
                        className={`rounded-lg border-2 h-12 flex items-center justify-center text-xs font-medium cursor-pointer transition-all ${getStatusClass(
                          status
                        )}`}
                      >
                        {code && <span>{code}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitAllocationTab;