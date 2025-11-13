import { useEffect, useState } from "react";
import { explore } from "../../../Data/ExplorePanchpokhari";
import DestinationCarousel from '../Home/Carousel/DestinationCarousel';

const ExplorePanchpokhari = () => { 
  const [currentPage, setCurrentPage] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [imagesPerSlide, setImagesPerSlide] = useState(4);

  useEffect(() => {
    const updateImagesPerSlide = () => {
      if (window.innerWidth >= 1200) {
        setImagesPerSlide(8); // XL: 8 images (4 per row, 2 rows)
      } else if (window.innerWidth >= 992) {
        setImagesPerSlide(6); // LG: 6 images (3 per row, 2 rows)
      } else if (window.innerWidth >= 768) {
        setImagesPerSlide(4); // MD: 4 images (2 per row, 2 rows)
      } else {
        setImagesPerSlide(1); // SM and below: 1 image per slide
      }
    };

    updateImagesPerSlide(); // Initial setup
    window.addEventListener("resize", updateImagesPerSlide); // Listen for resizing

    return () => window.removeEventListener("resize", updateImagesPerSlide); // Cleanup listener
  }, []);

  // Calculate total number of pages
  const totalPages = Math.ceil(explore.length / imagesPerSlide);

  const goToPrevSlide = () => {
    if (!isSliding) {
      setIsSliding(true);
      setTimeout(() => {
        setCurrentPage((prevPage) => 
          prevPage === 0 ? totalPages - 1 : prevPage - 1
        );
        setIsSliding(false);
      }, 300);
    }
  };

  const goToNextSlide = () => {
    if (!isSliding) {
      setIsSliding(true);
      setTimeout(() => {
        setCurrentPage((prevPage) => 
          prevPage === totalPages - 1 ? 0 : prevPage + 1
        );
        setIsSliding(false);
      }, 300);
    }
  };

  // Calculate the start index for the current page
  const startIndex = currentPage * imagesPerSlide;

  // Get destinations for the current page
  const displayedDestinations = explore.slice(
    startIndex, 
    startIndex + imagesPerSlide
  );

  return (
    <div className="py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex md:space-x-4 items-center gap-2 md:gap-16 justify-center mx-auto">
          <button
            onClick={goToPrevSlide}
            className="bg-yellow-500 px-3 py-1 font-semibold rounded-full text-[22px] text-white shadow-md hover:bg-yellow-600"
          >
            &lt;
          </button>
          <h2 className="text-center font-Playfair font-semibold sm:text-2xl">
            Explore Panchpokhari
          </h2>
          <button
            onClick={goToNextSlide}
            className="bg-yellow-500 px-3 py-1 font-semibold rounded-full text-[22px] text-white shadow-md hover:bg-yellow-600"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-all duration-300 ease-in-out ${
            isSliding ? 'opacity-50' : 'opacity-100'
          }`}
        >
          {displayedDestinations.map((destination, index) => (
            <div key={index} className="w-full">
              <DestinationCarousel
                title={destination.title}
                images={destination.image}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePanchpokhari;
