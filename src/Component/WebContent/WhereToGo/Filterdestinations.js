import { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";

const DestinationFilter = ({ data, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter((dest) =>
        dest.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
    }

    onFilter(filtered);
  }, [searchTerm, data, onFilter]);

  return (
    <div className="w-full mb-10 px-4 py-4 bg-gray-100 rounded-md border border-gray-300 flex flex-col md:flex-row items-center justify-between gap-2">
      <input
        type="text"
        placeholder="Search destination..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 border border-gray-300 text-sm rounded-md w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
      <button className="text-gray-700 px-2 py-2 rounded-full hover:bg-gray-600 hover:text-white transition-all">
        <MdSearch size={24}/>
      </button>
    </div>
  );
};

export default DestinationFilter;
