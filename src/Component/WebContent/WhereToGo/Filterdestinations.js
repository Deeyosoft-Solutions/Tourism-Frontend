import { useState, useEffect } from "react";

const DestinationFilter = ({ data, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
    }

    onFilter(filtered);
  }, [searchTerm, data, onFilter]);

  return (
    <div className="w-full mb-10 px-4 py-4 bg-gray-100 rounded-md flex flex-col md:flex-row items-center justify-between gap-4">
      <input
        type="text"
        placeholder="Search destination..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
    </div>
  );
};

export default DestinationFilter;
