import { useParams } from "react-router-dom";
import { useGetAccommodationBySlugQuery } from "../../../Services/accomodationApiSlice";
import LoadingSpinner from "../../../Component/LoadingSpinner";
import ErrorMessage from "../../../Component/ErrorMessage";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const AccomodationPage = () => {
  const { slug } = useParams();
  const { data, error, isLoading, refetch } =
    useGetAccommodationBySlugQuery(slug);

  if (isLoading)
    return (
      <p className="text-center text-gray-500">
        <LoadingSpinner />
      </p>
    );
  if (error)
    return (
      <ErrorMessage
        message={error?.message || "Internal server error"}
        onRetry={refetch}
      />
    );
  if (!data)
    return <p className="text-center text-gray-500">No accommodation found.</p>;

  const {
    name,
    description,
    address,
    minNights,
    maxNights,
    amenities,
    images,
    destinations,
  } = data;

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative w-full h-96">
        <img
          src={
            images?.[0]
              ? `${API_BASE_URL}${images[0]}`
              : "/assets/Images/default-image.jpg"
          }
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
          <h1 className="text-3xl md:text-4xl text-white font-bold">{name}</h1>
          <p className="text-white mt-1">{address}</p>
        </div>
        <button className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded shadow">
          Reserve
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Property Details</h2>
            <p className="text-gray-700">{description}</p>

            {/* Guests / Beds Info */}
            <div className="flex flex-wrap gap-4 mt-4 text-gray-700">
              <span>
                👥 {minNights}-{maxNights} nights
              </span>
            </div>

            {/* Amenities */}
            {amenities && amenities.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((item, i) => (
                    <span
                      key={i}
                      className="bg-fuchsia-100 px-2 py-1 text-fuchsia-600 hover:text-white hover:bg-rose-400 font-poppins rounded-xl text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Destinations */}
            {destinations && destinations.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Destinations</h3>
                <div className="flex flex-wrap gap-2">
                  {destinations.map((item, i) => (
                    <span
                      key={i}
                      className="bg-green-100 px-2 py-1 hover:bg-emerald-600 hover:text-white font-poppins rounded-xl text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Map Placeholder */}
            <div className="mt-4 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              Map goes here
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4 top-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold ">Quote & Book</h2>
              <p className="text-red-500 font-bold text-lg">
                $120.00/night
              </p>
            </div>
            {/* Calendar Placeholder */}
            <div className="bg-gray-100 rounded p-4 mb-4 text-center">
              Calendar Component
            </div>
            {/* Guests */}
            <input
              type="number"
              placeholder="Number of Guests"
              className="w-full border rounded px-3 py-2 mb-4"
            />
            <button className="w-full bg-red-500 text-white py-2 rounded">
              Get Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccomodationPage;
