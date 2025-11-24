import React, { useEffect, useState } from "react";

const FeaturedActivities = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col mt-3 py-4 px-4 md:px-8">
      <h1 className="text-center font-Playfair font-semibold sm:text-2xl md:text-xl lg:text-2xl mb-6">
        Featured Activities
      </h1>
      {/* Images Grid */}
      {windowWidth > 640 ? (
        <div className="grid grid-cols-8 gap-0.5 w-full h-auto">
          {/* Image 1 */}
          <div className="col-span-1 row-span-2">
            <img
              src="/assets/Images/Activities-Home/Frame 40.png"
              alt="Yoga in nature"
              className="w-full h-full object-contain rounded-l-lg"
            />
          </div>
          {/* Image 2 */}
          <div className="col-span-1 row-span-2">
            <img
              src="/assets/Images/Activities-Home/Frame 39.png"
              alt="Pilgrimage"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          {/* Image 3 */}
          <div className="col-span-2">
            <img
              src="/assets/Images/Activities-Home/Frame 35.png"
              alt="Camping"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Image 4 */}
          <div className="col-span-2">
            <img
              src="/assets/Images/Activities-Home/Frame 34.png"
              alt="Trekking"
              className="w-full h-full object-contain"
            />
          </div>


          {/* Image 5 */}
          <div className="col-span-1">
            <img
              src="/assets/Images/Activities-Home/Frame 36.png"
              alt="Wildlife Spotting"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Image 7 */}
          <div className="col-span-1 row-span-2">
            <img
              src="/assets/Images/Activities-Home/Frame 38.png"
              alt="Cultural Immersion"
              className="w-full h-full object-cover rounded-r-lg"
            />
          </div>

          {/* Welcome Text */}
          <div className="col-span-4 flex items-center justify-center text-center p-2">
            <span className="text-yellow-500 text-3xl lg:text-4xl xl:text-5xl font-medium font-Open">
              Welcome to{" "}
              <span className="text-red-600 italic text-3xl lg:text-4xl xl:text-5xl font-medium font-allura">
                Panchpokhari
              </span>
            </span>
          </div>

          {/* Image 8 */}
          <div className="col-span-1">
            <img
              src="/assets/Images/Activities-Home/Frame 37.png"
              alt="Photography"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-0.5 w-full h-auto">
          {/* Image 1 */}
          <div className="col-span-2">
            <img
              src="/assets/Images/Activities-Home/Frame 40.png"
              alt="Yoga in nature"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
          {/* Image 2 */}
          <div className="col-span-2">
            <img
              src="/assets/Images/Activities-Home/Frame 39.png"
              alt="Pilgrimage"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
          {/* Image 3 */}
          <div className="col-span-4">
            <img
              src="/assets/Images/Activities-Home/Frame 35.png"
              alt="Camping"
              className="w-full h-full object-contain rounded-sm"
            />
          </div>
          {/* Image 4 */}
          <div className="col-span-4">
            <img
              src="/assets/Images/Activities-Home/Frame 34.png"
              alt="Trekking"
              className="w-full h-full object-contain rounded-sm"
            />
          </div>

          {/* Welcome Text */}
          <div className="col-span-4 flex items-center justify-center text-center p-2">
            <span className="text-orange-500 text-3xl font-medium font-Open">
              Welcome to{" "}
              <span className="text-red-600 italic text-3xl font-medium font-allura">
                Panchpokhari
              </span>
            </span>
          </div>

          {/* Image 5 */}
          <div className="col-span-2">
            <img
              src="/assets/Images/Activities-Home/Frame 36.png"
              alt="Wildlife Spotting"
              className="w-full h-full object-contain rounded-sm"
            />
          </div>

          {/* Image 7 */}
          <div className="col-span-2 row-span-2">
            <img
              src="/assets/Images/Activities-Home/Frame 38.png"
              alt="Cultural Immersion"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>

          {/* Image 8 */}
          <div className="col-span-2">
            <img
              src="/assets/Images/Activities-Home/Frame 37.png"
              alt="Photography"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>

        </div>
      )}
    </div>
  );
};

export default FeaturedActivities;
