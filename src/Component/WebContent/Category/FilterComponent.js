const FilterComponent = ({
  allTags,
  filters,
  maxPrice,
  setFilters,
  isOpen,
}) => {
  if (!isOpen) return null;

  // Function to reset all filters
  const handleClearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: maxPrice,
      minRating: 0,
      selectedTags: [],
      inStock: false,
    });
  };

  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">
            Filter Products
          </h2>
        </div>

        {/* FILTER ROW */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Min Price */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">Min Price</span>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minPrice: Number(e.target.value),
                }))
              }
              className="px-4 py-2 rounded-md border border-gray-300 text-sm bg-white"
            />
          </div>

          {/* Max Price */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">Max Price</span>
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              max={maxPrice}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  maxPrice: Number(e.target.value),
                }))
              }
              className="px-4 py-2 rounded-md border border-gray-300 text-sm bg-white"
            />
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">Rating</span>
            <select
              value={filters.minRating}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minRating: Number(e.target.value),
                }))
              }
              className="px-4 py-2 rounded-md border border-gray-300 text-sm bg-white"
            >
              <option value={0}>Any Rating</option>
              <option value={1}>1★ & up</option>
              <option value={2}>2★ & up</option>
              <option value={3}>3★ & up</option>
              <option value={4}>4★ & up</option>
              <option value={5}>5★</option>
            </select>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">Tags</span>
            <select
              value=""
              onChange={(e) => {
                const value = e.target.value;
                if (!value) return;

                setFilters((prev) => ({
                  ...prev,
                  selectedTags: prev.selectedTags.includes(value)
                    ? prev.selectedTags
                    : [...prev.selectedTags, value],
                }));
              }}
              className="px-4 py-2 rounded-md border border-gray-300 text-sm bg-white"
            >
              <option value="">Select Tag</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* In Stock */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">In Stock</span>
            <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-md border border-gray-300 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    inStock: e.target.checked,
                  }))
                }
              />
              In Stock
            </label>
          </div>
        </div>

        {/* X Button now clears all filters */}
        <div className="flex justify-end mt-2">
          <button
            onClick={handleClearFilters}
            className="px-4 py-1 rounded-lg border border-gray-600"
            title="Clear All Filters"
          >
            Clear All Filters
          </button>
        </div>

        {/* Selected Tags */}
        {filters.selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filters.selectedTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    selectedTags: prev.selectedTags.filter((t) => t !== tag),
                  }))
                }
              >
                {tag} ✕
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterComponent;
