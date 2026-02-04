
const PackageDetailsTab = ({ packageData }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">
        About this package
      </h3>

      {/* Description */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-gray-600">
          Description:<br /> <div dangerouslySetInnerHTML={{ __html: packageData.description }} />
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Price</p>
          <p className="font-semibold text-gray-900">
            Rs. {Number(packageData.price || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Duration</p>
          <p className="font-semibold text-gray-900">
            {packageData.durationDays || 0} Days /{" "}
            {packageData.durationNights || 0} Nights
          </p>
        </div>
      </div>

      {/* Destinations */}
      {packageData.destinationsRelation?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-gray-800">Destinations</h4>
          <ul className="space-y-1">
            {packageData.destinationsRelation.map((dest, index) => (
              <li
                key={index}
                className="bg-gray-50 p-3 rounded-lg border border-gray-200"
              >
                <p className="font-semibold text-gray-900">{dest.name}</p>
                <p className="text-gray-600">
                  {dest.summary || dest.description || "No summary available."}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Included Items */}
      {packageData.included?.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Included</h4>
          <ul className="list-disc list-inside space-y-1">
            {packageData.included.map((item, index) => (
              <li key={index} className="text-gray-600">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Not Included Items */}
      {packageData.notIncluded?.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Not Included</h4>
          <ul className="list-disc list-inside space-y-1">
            {packageData.notIncluded.map((item, index) => (
              <li key={index} className="text-gray-600">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PackageDetailsTab;
