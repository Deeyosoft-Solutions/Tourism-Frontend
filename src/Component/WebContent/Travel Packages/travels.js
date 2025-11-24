import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterComponent from "./FilterTravels";
import ImageCarousel from "../WhereToStay/ImageCarousel";
import PaginationControls from "../../PaginationControls";
import { useGetTravelPackagesQuery } from "../../../Services/travelPackageApiSlice";
import LoadingSpinner from "../../LoadingSpinner";
import ErrorMessage from './../../ErrorMessage';

const Travels = () => {
  const [sort, setSort] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Filter state
  const [filters, setFilters] = useState({
    q: "",
    minPrice: "",
    maxPrice: "",
    destinations: "",
  });
  const [sortBy, setSortBy] = useState("newest");

  const navigate = useNavigate();

  // Fetch travel packages
  const { data: packagesRaw, isLoading, error } = useGetTravelPackagesQuery();

  // Extract the array safely
  const packages = Array.isArray(packagesRaw?.data) ? packagesRaw.data : [];

  // Now you can safely use .filter, .map, etc.
  const filteredPackages = packages.filter((pkg) => {
    let match = true;

    const name = pkg?.name ?? "";
    const priceNum = Number(pkg?.price ?? 0);
    const dests = pkg?.destinationsRelation ?? [];

    if (filters.q) {
      match = match && name.toLowerCase().includes(filters.q.toLowerCase());
    }
    if (filters.minPrice) {
      match = match && priceNum >= Number(filters.minPrice);
    }
    if (filters.maxPrice) {
      match = match && priceNum <= Number(filters.maxPrice);
    }
    if (filters.destinations) {
      const q = String(filters.destinations).toLowerCase();
      match =
        match &&
        dests.some(
          (d) =>
            d?.slug?.toLowerCase().includes(q) ||
            d?.name?.toLowerCase().includes(q)
        );
    }
    return match;
  });

  // Sorting logic
  const handleSort = (items) => {
    if (!Array.isArray(items)) return [];
    if (sort === "price-low-high") {
      return [...items].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price-high-low") {
      return [...items].sort((a, b) => Number(b.price) - Number(a.price));
    }
    return items;
  };

  const sortedPackages = handleSort([...filteredPackages]);

  // Update items per page based on screen width
  const updateItemsPerPage = () => {
    const width = window.innerWidth;
    if (width >= 1024) setItemsPerPage(9); // lg and above: 3 columns x 3 rows
    else if (width >= 768) setItemsPerPage(6); // md: 2 columns x 3 rows
    else setItemsPerPage(4); // sm and below: 1 column x 4 rows
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(sortedPackages.length / itemsPerPage);
  const displayedPackages = sortedPackages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePackageClick = (slug) => {
    navigate(`/travel-packages/travel-deals/${slug}`);
  };

  const gridColumnsClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  if (isLoading) return <LoadingSpinner fullScreen={true} size="medium" />;
  if (error) return <ErrorMessage message="Failed to load travel packages." className="m-4" />;

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

        {/* Packages Grid */}
        <div className={`grid gap-3 ${gridColumnsClass}`}>
          {displayedPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              {/* Image Container with Badges */}
              <div className="relative h-48 overflow-hidden">
                <ImageCarousel
                  images={pkg.images || []}
                  stayType=""
                  getStayTypeColor={() => "#000"}
                />

                {/* Top Left Badge - Fixed dates */}
                <div className="absolute top-3 left-3 bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Fixed dates
                </div>

                {/* Top Right Badge - Available */}
                <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Available
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Title and Rating */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight flex-1 pr-2">
                    {pkg.name}
                  </h3>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <svg
                      className="w-4 h-4 fill-current text-blue-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-600">
                      {pkg.rating || "4.8"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {pkg.description?.slice(0, 80)}...
                </p>

                {/* Duration and Location Info */}
                <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      {pkg.durationDays}D/{pkg.durationNights}N
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      {pkg.destinationsRelation?.[0]?.name || "Destination"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{pkg.maxPeople || 15}/20</span>
                  </div>
                </div>

                {/* Price and Button */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xl font-bold text-red-500">
                      Rs.{pkg.price || "1,299"}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      per person
                    </span>
                  </div>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    onClick={() => handlePackageClick(pkg.slug)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
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

export default Travels;
