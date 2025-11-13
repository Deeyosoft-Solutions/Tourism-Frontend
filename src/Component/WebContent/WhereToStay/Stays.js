import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PaginationControls from "../../PaginationControls";
import FilterComponent from "./FilterStays";
import ErrorMessage from "../../ErrorMessage";
import LoadingSpinner from "../../LoadingSpinner";
import { useGetAccommodationsQuery } from "../../../Services/accomodationApiSlice";

const Stays = () => {
  const [sort, setSort] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [filters, setFilters] = useState({
    q: "",
    type: "",
    minPrice: "",
    maxPrice: "",
    guests: "",
    amenities: "",
    destinations: "",
    destinationSlug: "",
    withinKm: "",
    from: "",
    to: "",
    published: "yes",
    status: "",
  });
  const [sortBy, setSortBy] = useState("newest");

  const navigate = useNavigate();

  // ✅ Fetch accommodations from API
  const { data, isLoading, error } = useGetAccommodationsQuery();

  // ✅ Safely extract stays array from API response
  const stays = Array.isArray(data?.data) ? data.data : [];

  // ✅ Apply filters
  const filteredStays = stays.filter((stay) => {
    let match = true;

    if (filters.q) {
      match =
        match && stay.name?.toLowerCase().includes(filters.q.toLowerCase());
    }

    if (filters.type) {
      match = match && stay.type === filters.type;
    }

    if (filters.minPrice) {
      match = match && (stay.fromPrice || 0) >= Number(filters.minPrice);
    }

    if (filters.maxPrice) {
      match = match && (stay.fromPrice || 0) <= Number(filters.maxPrice);
    }

    return match;
  });

  // ✅ Sorting logic
  const handleSort = (items) => {
    if (!Array.isArray(items)) return [];
    if (sort === "price-low-high") {
      return [...items].sort((a, b) => (a.fromPrice || 0) - (b.fromPrice || 0));
    } else if (sort === "price-high-low") {
      return [...items].sort((a, b) => (b.fromPrice || 0) - (a.fromPrice || 0));
    }
    return items;
  };

  const sortedStays = handleSort(filteredStays);

  // ✅ Update items per page dynamically
  const updateItemsPerPage = () => {
    const width = window.innerWidth;
    if (width >= 1280) setItemsPerPage(8);
    else if (width >= 1024) setItemsPerPage(6);
    else if (width >= 768) setItemsPerPage(4);
    else setItemsPerPage(4);
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // ✅ Pagination logic
  const totalPages = Math.ceil(sortedStays.length / itemsPerPage);
  const displayedStays = sortedStays.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ✅ Handle stay click
  const handleStayClick = (slug) => {
    navigate(`/wheretostay/accomodation/${slug}`);
  };

  const gridColumnsClass =
    "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  // ✅ Loading & Error handling
  if (isLoading) return <LoadingSpinner fullScreen={true} size="medium" />;
  if (error)
    return (
      <ErrorMessage message="Failed to load accommodations." className="my-4" />
    );

  return (
    <div className="flex flex-col md:mx-24 md:flex-row py-2 px-4">
      <div className="w-full">
        {/* Filter Component */}
        <FilterComponent
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Sort Controls */}
        <div className="flex justify-end mb-4">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded p-2 text-sm"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </select>
        </div>

        {/* ✅ Stays Grid */}
        <div className={`grid gap-4 ${gridColumnsClass}`}>
          {displayedStays.map((stay) => (
            <div
              key={stay.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200"
            >
              {/* Image Section */}
              <div className="relative w-full h-52 overflow-hidden">
                <img
                  src={
                    stay.images?.[0]
                      ? `${process.env.REACT_APP_API_URL}${stay.images[0]}`
                      : "/assets/Images/house0.jpg"
                  }
                  alt={stay.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full capitalize">
                  {stay.type || "Stay"}
                </span>
              </div>

              {/* Content Section */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[16px] font-semibold text-gray-900 truncate">
                    {stay.name}
                  </h2>
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      className="w-4 h-4 text-yellow-400"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.176 0l-3.385 2.46c-.784.57-1.838-.197-1.539-1.118l1.286-3.97a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.97z" />
                    </svg>
                    <span>{stay.rating || "4.5"}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="w-4 h-4 text-gray-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2C6.686 2 4 4.686 4 8c0 3.632 3.833 8.415 5.534 10.451a1 1 0 001.532 0C12.167 16.415 16 11.632 16 8c0-3.314-2.686-6-6-6zM8 8a2 2 0 114 0 2 2 0 01-4 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {stay.address || "Location not specified"}
                </p>

                {/* Amenities Info */}
                <div className="flex flex-wrap gap-3 text-gray-600 text-sm mb-4">
                  <span>👥 {stay.guests || "2"}</span>
                  <span>🛏️ {stay.beds || "1"} beds</span>
                  <span>🛁 {stay.baths || "1"} baths</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Kathmandu", "City", stay.type || "Villa"].map((tag, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Price & Button */}
                <div className="flex items-center justify-between">
                  <p className="text-red-500 font-bold text-lg">
                    ${stay.fromPrice?.toLocaleString() || "1,299.00"}{" "}
                    <span className="text-gray-600 text-sm font-normal">
                      per Night
                    </span>
                  </p>
                  <button
                    onClick={() => handleStayClick(stay.slug)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Pagination */}
        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            handlePreviousPage={() => goToPage(currentPage - 1)}
            handleNextPage={() => goToPage(currentPage + 1)}
            handlePageClick={(page) => goToPage(page)}
          />
        )}
      </div>
    </div>
  );
};

export default Stays;
