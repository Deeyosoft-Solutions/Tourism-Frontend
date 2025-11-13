import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetPublishedDestinationsQuery } from "../../../Services/destinationApiSlice";
import LoadingSpinner from "../../LoadingSpinner";
import DestinationFilter from "./Filterdestinations";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const Destinations = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [imagesPerSlide, setImagesPerSlide] = useState(4);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetPublishedDestinationsQuery();
  const destinations = useMemo(() => data?.data || [], [data]);

  // Initialize filtered destinations when data loads
  useEffect(() => {
    setFilteredDestinations(destinations);
  }, [destinations]);

  // Responsive slides
  useEffect(() => {
    const updateImagesPerSlide = () => {
      if (window.innerWidth >= 1200) setImagesPerSlide(4);
      else if (window.innerWidth >= 768) setImagesPerSlide(3);
      else setImagesPerSlide(1);
    };

    updateImagesPerSlide();
    window.addEventListener("resize", updateImagesPerSlide);
    return () => window.removeEventListener("resize", updateImagesPerSlide);
  }, []);

  // Carousel navigation
  const goToPrevSlide = () => {
    if (!isSliding && filteredDestinations.length > imagesPerSlide) {
      setIsSliding(true);
      setTimeout(() => {
        setStartIndex((prevIndex) =>
          prevIndex === 0
            ? filteredDestinations.length - imagesPerSlide
            : prevIndex - imagesPerSlide
        );
        setIsSliding(false);
      }, 300);
    }
  };

  const goToNextSlide = () => {
    if (!isSliding && filteredDestinations.length > imagesPerSlide) {
      setIsSliding(true);
      setTimeout(() => {
        setStartIndex((prevIndex) =>
          prevIndex + imagesPerSlide >= filteredDestinations.length
            ? 0
            : prevIndex + imagesPerSlide
        );
        setIsSliding(false);
      }, 300);
    }
  };

  const handleSlideClick = (slug) => {
    navigate(`/wheretogo/destination/${slug}`);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner />
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500">Failed to load destinations.</p>
    );

  return (
    <div className="py-10 px-4">
      {/* Filter */}
      <DestinationFilter
        data={destinations}
        onFilter={setFilteredDestinations}
      />

      {/* Section Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex md:space-x-4 items-center gap-2 md:gap-16 justify-center mx-auto">
          <button
            onClick={goToPrevSlide}
            className="bg-yellow-500 px-3 py-1 font-semibold rounded-full text-[22px] text-white shadow-md hover:bg-yellow-600"
          >
            &lt;
          </button>
          <h2 className="text-center font-Playfair font-semibold sm:text-2xl text-gray-800">
            Popular Destinations
          </h2>
          <button
            onClick={goToNextSlide}
            className="bg-yellow-500 px-3 py-1 font-semibold rounded-full text-[22px] text-white shadow-md hover:bg-yellow-600"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Destination Cards */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(startIndex / imagesPerSlide) * 100}%)`,
          }}
        >
          {filteredDestinations.map((destination) => {
            const imageUrl = destination.images?.[0]
              ? `${API_BASE_URL}${destination.images[0]}`
              : destination.heroImageUrl
              ? `${API_BASE_URL}${destination.heroImageUrl}`
              : "/assets/Images/png-logo.png";

            return (
              <div
                key={destination.id}
                onClick={() => handleSlideClick(destination.slug)}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 p-3 cursor-pointer"
              >
                <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 flex flex-col">
                  <div className="w-full h-52">
                    <img
                      src={imageUrl}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-gray-900 font-semibold text-[16px] truncate mb-1">
                        {destination.name}
                      </h3>
                      <p className="text-gray-600 text-sm flex items-center gap-1 mb-3">
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
                        {destination.location || "Unknown Location"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {destination.tags?.slice(0, 3)?.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSlideClick(destination.slug);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Destinations;
