// src/pages/AccomodationPage.jsx
import { useParams } from "react-router-dom";
import { useGetAccommodationBySlugQuery } from "../../../Services/accomodationApiSlice";
import LoadingSpinner from "../../../Component/LoadingSpinner";
import ErrorMessage from "../../../Component/ErrorMessage";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const AccomodationPage = () => {
  const { slug } = useParams();
  const { data, error, isLoading, refetch } = useGetAccommodationBySlugQuery(slug);

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
    cleaningFee,
    serviceFeePct,
    taxPct,
    checkInFrom,
    checkOutUntil,
    houseRules,
    contactNote,
    amenities,
    images,
    destinations,
  } = data;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-2">{name}</h1>
      <p className="text-gray-600 mb-4">{description}</p>

      {/* Images Section */}
      {images && images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {images.map((img, i) => (
            <img
              key={i}
              src={`${API_BASE_URL}${img}`}
              alt={name}
              className="rounded-lg object-cover w-full h-48"
              onError={(e) =>
                (e.target.src = "/assets/Images/default-image.jpg")
              }
            />
          ))}
        </div>
      ) : (
        <img
          src="/assets/Images/default-image.jpg"
          alt="default"
          className="rounded-lg w-full h-64 object-cover mb-6"
        />
      )}

      {/* Address & Destination */}
      <div className="mb-4">
        <p>
          <strong>Address:</strong> {address}
        </p>
        {destinations && (
          <p>
            <strong>Destination:</strong> {destinations.join(", ")}
          </p>
        )}
      </div>

      {/* Stay Info */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <p>
          <strong>Min Nights:</strong> {minNights}
        </p>
        <p>
          <strong>Max Nights:</strong> {maxNights}
        </p>
        <p>
          <strong>Cleaning Fee:</strong> Rs. {cleaningFee}
        </p>
        <p>
          <strong>Service Fee:</strong> {serviceFeePct}%
        </p>
        <p>
          <strong>Tax:</strong> {taxPct}%
        </p>
      </div>

      {/* Check-in / Check-out */}
      <div className="mb-4">
        <p>
          <strong>Check-in From:</strong> {checkInFrom}
        </p>
        <p>
          <strong>Check-out Until:</strong> {checkOutUntil}
        </p>
      </div>

      {/* House Rules */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">House Rules</h2>
        <p className="text-gray-700">{houseRules}</p>
      </div>

      {/* Amenities */}
      {amenities && amenities.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Amenities</h2>
          <ul className="list-disc list-inside text-gray-700">
            {amenities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Contact Note */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Contact</h2>
        <p className="text-gray-700">{contactNote}</p>
      </div>
    </div>
  );
};

export default AccomodationPage;
