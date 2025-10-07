import { useState, useEffect } from "react";
import ImageCarousel from "./ImageCarousel";
import { useNavigate } from "react-router-dom";
import PaginationControls from "../../PaginationControls";
import RatingStars from "../../RatingStars";
import FilterComponent from "./FilterStays";
import ErrorMessage from "../../ErrorMessage";
import LoadingSpinner from "../../LoadingSpinner";
import { useGetAccommodationsQuery } from "../../../Services/accomodationApiSlice";

const Stays = () => {
  const [sort, setSort] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Add filter state
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

  // Fetch homestays from API
  const { data: stays = [], isLoading, error } = useGetAccommodationsQuery();

  // Apply filters (basic example)
  const filteredStays = stays.filter((stay) => {
    let match = true;

    if (filters.q) {
      match =
        match && stay.name.toLowerCase().includes(filters.q.toLowerCase());
    }

    if (filters.type) {
      match = match && stay.type === filters.type;
    }

    if (filters.minPrice) {
      match = match && stay.pricePerNight >= Number(filters.minPrice);
    }

    if (filters.maxPrice) {
      match = match && stay.pricePerNight <= Number(filters.maxPrice);
    }

    return match;
  });

  // Sorting logic
  const handleSort = (items) => {
    if (!Array.isArray(items)) return [];
    if (sort === "price-low-high") {
      return [...items].sort(
        (a, b) => (a.pricePerNight || 0) - (b.pricePerNight || 0)
      );
    } else if (sort === "price-high-low") {
      return [...items].sort(
        (a, b) => (b.pricePerNight || 0) - (a.pricePerNight || 0)
      );
    }
    return items;
  };

  const sortedStays = handleSort([...filteredStays]);

  const getStayTypeColor = (stayType) => {
    const colors = {
      hotel: "#FF7F50",
      lodge: "#1E90FF",
      homestay: "#32CD32",
    };
    return colors[stayType] || "#000";
  };

  // Update items per page dynamically
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

  const handleStayClick = (slug) => {
    navigate(`/wheretostay/accomodation/${slug}`);
  };

  const gridColumnsClass =
    "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  if (isLoading) return <LoadingSpinner fullScreen={true} size="medium" />;
  if (error)
    return (
      <ErrorMessage
        message="Failed to load accomodations."
        className="my-4"
      />
    );

  return (
    <div className="flex flex-col md:flex-row py-2 px-4">
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

        {/* Stays Grid */}
        <div className={`grid gap-4 ${gridColumnsClass}`}>
          {displayedStays.map((stay) => (
            <div
              className="relative p-2 mb-4 cursor-pointer"
              key={stay.id}
              onClick={() => handleStayClick(stay.slug)}
            >
              <div className="border rounded-lg items-center mb-2 overflow-hidden">
                <ImageCarousel
                  images={stay.images || []}
                  stayType={stay.type}
                  getStayTypeColor={getStayTypeColor}
                />
              </div>

              <div className="py-1">
                <h2 className="font-medium text-[14px] md:text-[16px] font-Open">
                  {stay.name}
                </h2>
                <div className="flex flex-col md:flex-row text-[12px] md:text-[14px]">
                  <p className="text-gray-700">{stay.address}</p>
                  {stay.contact && (
                    <p className="text-gray-700 md:pl-2">
                      Mobile: {stay.contact}
                    </p>
                  )}
                </div>
                <RatingStars rating={stay.rating || 0} />
                <p className="font-bold mt-2 font-Open text-[15px] md:text-[17px]">
                  NRS {stay.pricePerNight}{" "}
                  <span className="text-[13px] md:text-[15px] font-medium">
                    / night
                  </span>
                </p>
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

export default Stays;
