import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetTravelPackagesQuery } from "../../../Services/travelPackageApiSlice";
import ErrorMessage from "../../ErrorMessage";
import LoadingSpinner from "../../LoadingSpinner";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const TravelPackagesCarousel = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [imagesPerSlide, setImagesPerSlide] = useState(4);
  const navigate = useNavigate();

  const { data: packagesRaw, isLoading, error } = useGetTravelPackagesQuery();
  const stays = packagesRaw?.data || [];

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
    if (!isSliding && stays.length) {
      setIsSliding(true);
      setTimeout(() => {
        setStartIndex((prev) =>
          prev === 0 ? stays.length - imagesPerSlide : prev - imagesPerSlide
        );
        setIsSliding(false);
      }, 300);
    }
  };

  const goToNextSlide = () => {
    if (!isSliding && stays.length) {
      setIsSliding(true);
      setTimeout(() => {
        setStartIndex((prev) =>
          prev + imagesPerSlide >= stays.length ? 0 : prev + imagesPerSlide
        );
        setIsSliding(false);
      }, 300);
    }
  };

  const handleSlideClick = (slug) => {
    navigate(`/travel-packages/travel-deals/${slug}`);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return  <ErrorMessage message="Failed to load travel packages." className="m-4" />;

  return (
    <div className="py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex md:space-x-4 items-center gap-2 md:gap-16 justify-center mx-auto">
          <button
            onClick={goToPrevSlide}
            className="bg-yellow-500 px-3 py-1 font-semibold rounded-full text-[22px] text-white shadow-md hover:bg-yellow-600"
          >
            &lt;
          </button>

          <h2 className="text-center font-Playfair font-semibold sm:text-2xl">
            Travel Packages
          </h2>

          <button
            onClick={goToNextSlide}
            className="bg-yellow-500 px-3 py-1 font-semibold rounded-full text-[22px] text-white shadow-md hover:bg-yellow-600"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${(startIndex / imagesPerSlide) * 100}%)`,
          }}
        >
          {stays.map((stay, index) => {
            const firstImage =
              stay.images?.length > 0
                ? `${API_BASE_URL}${stay.images[0]}`
                : "/assets/default-placeholder.png";

            return (
              <div
                key={stay.id || index}
                className="w-full mx-2 flex-shrink-0 sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-xl shadow-md hover:shadow-lg hover:border hover:border-blue-300 cursor-pointer"
                onClick={() => handleSlideClick(stay.slug)}
              >
                <div className="bg-white border border-gray-200 p-1 rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 flex flex-col h-full">
                  {/* Single Image */}
                  <div className="w-full h-48">
                    <img
                      src={firstImage}
                      alt={stay.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-4 flex flex-col">
                    <h2 className="font-medium text-[14px] font-Open">
                      {stay.name}
                    </h2>
                    <p className="text-gray-700 text-xs font-Open">
                      Duration: {stay.durationDays} Days / {stay.durationNights}{" "}
                      Nights
                    </p>
                    <p className="font-bold mt-2 font-Open text-red-600 text-[15px]">
                      NRS {stay.price}{" "}
                      <span className="text-[14px] font-medium text-black font-Open">
                        / person
                      </span>
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

export default TravelPackagesCarousel;
