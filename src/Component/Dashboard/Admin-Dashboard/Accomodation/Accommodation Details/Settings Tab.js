const SettingsTab = ({ accommodation }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            className="mt-1 block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm"
            defaultValue={accommodation.status}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Max Guests
          </label>
          <input
            type="number"
            className="mt-1 block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm"
            defaultValue={accommodation.maxGuests}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Featured</label>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                defaultChecked={accommodation.featured}
              />
              <span className="ml-2 text-sm text-gray-600">
                Mark as featured property
              </span>
            </label>
          </div>
        </div>

        <div className="pt-4">
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md text-sm font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;