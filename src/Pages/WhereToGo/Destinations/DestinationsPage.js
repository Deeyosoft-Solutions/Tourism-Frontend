import { useParams } from "react-router-dom";
import { Activities } from "../../../Data/Activities";
import { useGetDestinationBySlugQuery } from "../../../Services/destinationApiSlice";

const API_BASE_URL = process.env.REACT_APP_API_URL; // ✅ Base URL

const DestinationPage = () => {
  const { slug } = useParams();
  const {
    data: destination,
    isLoading,
    error,
  } = useGetDestinationBySlugQuery(slug);

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error || !destination) {
    return (
      <div className="p-8 text-center text-red-500">Destination not found</div>
    );
  }

  const mainImage =
    (destination.images?.[0] && `${API_BASE_URL}${destination.images[0]}`) ||
    (destination.heroImageUrl && `${API_BASE_URL}y${destination.heroImageUrl}`);

  return (
    <div className="mx-auto -mt-3">
      <div className="relative mb-6 w-screen -ml-[calc(50vw-50%)]">
        <div className="w-full overflow-hidden">
          <img
            src={mainImage}
            alt={destination.name}
            className="w-full h-auto max-h-[500px] object-cover"
          />
          <h1 className="absolute bottom-1 left-24 z-20 text-5xl font-medium text-white font-redressed text-center mb-6">
            {destination.name}
          </h1>
        </div>
      </div>

      <div className="prose lg:mx-52 text-gray-700 mb-8">
        <h2 className="text-2xl font-medium mb-4">{destination.name}</h2>
        <p className="mb-4">{destination.description}</p>
      </div>

      {destination.images?.length >= 2 && (
        <div className="flex gap-4 mx-32 mb-10">
          {destination.images.slice(1, 3).map((img, index) => (
            <div key={index} className="image-container flex-1">
              <img
                src={`${API_BASE_URL}/${img}`}
                alt={destination.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}

      <div className="sm:my-[30px] flex flex-col items-center justify-center py-3 px-auto bg-gray-50 mx-16">
        <p className="font-Playfair text-xl font-medium text-center mb-2 md:mb-10">
          Things to do in {destination.name}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center md:mb-8 gap-x-32">
          {Activities.map((a) => (
            <p key={a.id} className="font-Open text-base mb-2 md:mb-10 flex">
              <span className="px-2 rounded-full bg-red-700 text-white mr-2">
                {a.id}
              </span>
              {a.activity}
            </p>
          ))}
        </div>
        <img
          src="/assets/Images/yellow-line.png"
          alt={destination.name}
          className="w-full object-contain rounded-lg p-1 mx-auto"
        />
      </div>
    </div>
  );
};

export default DestinationPage;
