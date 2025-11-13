import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./../../LoadingSpinner";
import { useGetAccommodationsQuery } from "../../../Services/accomodationApiSlice";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const FeaturedAccomodations = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [imagesPerSlide, setImagesPerSlide] = useState(4);

  const navigate = useNavigate();

  const { data, isLoading, error } = useGetAccommodationsQuery();
  const stays = Array.isArray(data?.data) ? data.data : [];

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

  const goToPrevSlide = () => {
    if (!isSliding && stays.length > imagesPerSlide) {
      setIsSliding(true);
      setTimeout(() => {
        setStartIndex((prevIndex) =>
          prevIndex === 0 ? stays.length - imagesPerSlide : prevIndex - imagesPerSlide
        );
        setIsSliding(false);
      }, 300);
    }
  };

  const goToNextSlide = () => {
    if (!isSliding && stays.length > imagesPerSlide) {
      setIsSliding(true);
      setTimeout(() => {
        setStartIndex((prevIndex) =>
          prevIndex + imagesPerSlide >= stays.length ? 0 : prevIndex + imagesPerSlide
        );
        setIsSliding(false);
      }, 300);
    }
  };

  const handleStayClick = (slug) => {
    navigate(`/wheretostay/accomodation/${slug}`);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner />
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500">Failed to load accommodations.</p>
    );

  return (
    <div className="py-8 px-4">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex md:space-x-4 items-center gap-2 md:gap-16 justify-center mx-auto">
          <button
            onClick={goToPrevSlide}
            className="bg-yellow-500 px-3 py-1 font-semibold rounded-full text-[22px] text-white shadow-md hover:bg-yellow-600"
          >
            &lt;
          </button>
          <h2 className="text-center font-Playfair font-semibold sm:text-2xl">
            Featured Accommodations
          </h2>
          <button
            onClick={goToNextSlide}
            className="bg-yellow-500 px-3 py-1 font-semibold rounded-full text-[22px] text-white shadow-md hover:bg-yellow-600"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Accommodation Cards */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(startIndex / imagesPerSlide) * 100}%)`,
          }}
        >
          {stays.map((stay) => {
            const imageUrl =
              stay.images?.length > 0
                ? `${API_BASE_URL}${stay.images[0]}`
                : "/assets/Images/png-logo.png";

            return (
              <div
                key={stay.id}
                className="w-full flex-shrink-0 sm:w-1/2 md:w-1/3 lg:w-1/4 p-3 cursor-pointer"
                onClick={() => handleStayClick(stay.slug)}
              >
                <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 flex flex-col h-full">
                  {/* Image Section */}
                  <div className="w-full h-52 relative">
                    <img
                      src={imageUrl}
                      alt={stay.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full capitalize">
                      {stay.type || "Stay"}
                    </span>
                  </div>

                  {/* Info Section */}
                  <div className="p-4 flex flex-col justify-between flex-1 min-h-[140px]">
                    <h3 className="text-gray-900 font-semibold text-[16px] truncate mb-1">
                      {stay.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{stay.address}</p>
                    <p className="font-bold text-[15px] mb-1">
                      {stay.fromPrice ? `NRS ${stay.fromPrice.toFixed(2)}` : "Price N/A"}{" "}
                      <span className="text-[14px] font-medium">/ night</span>
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      {stay.contactNote || "-"}
                    </p>
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

export default FeaturedAccomodations;
