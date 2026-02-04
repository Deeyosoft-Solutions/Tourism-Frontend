import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Button = ({ children, variant = "default", className = "", onClick, ...props }) => {
  const baseClasses =
    "px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2";
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", placeholder, value, onChange, type = "text", ...props }) => (
  <input
    type={type}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${className}`}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    {...props}
  />
);

const defaultFilters = {
  q: "",
  type: "",
  minPrice: "",
  maxPrice: "",
  guests: "",
  amenities: "",
  destinations: "",
  destinationSlug: "",
  withinKm: "",
  from: "",
  to: "",
  published: "yes",
  status: "",
};

export default function FilterComponent({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  categories = [],
}) {
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      ((func) => {
        let timeout;
        return (...args) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => func(...args), 300);
        };
      })((searchTerm) => {
        setFilters((prev) => ({ ...prev, q: searchTerm }));
      }),
    [setFilters]
  );

  const clearFilters = () => setFilters(defaultFilters);

  const activeFiltersCount = Object.values(filters).filter((v) => v && v !== "all").length;

  return (
    <div className="bg-gray-100 border rounded-lg border-gray-300 p-4 mb-4">
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Input
            placeholder="Search stays, locations..."
            className="pl-3 focus:ring-yellow-500"
            onChange={(e) => debouncedSearch(e.target.value)}
            value={filters.q}
          />
        </div>

        {/* Filter & Sort */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white"
          >
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="">Sort by</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden"
          >
            {/* Property Type */}
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, type: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="">All Types</option>
              {categories.map((cat) => (
                <option key={cat.id || cat.slug} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <Input
                placeholder="Min Price"
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
              />
              <Input
                placeholder="Max Price"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
              />
            </div>

            <Input
              placeholder="Guests"
              type="number"
              value={filters.guests}
              onChange={(e) => setFilters((prev) => ({ ...prev, guests: e.target.value }))}
            />

            <Input
              placeholder="Amenities (comma-separated)"
              value={filters.amenities}
              onChange={(e) => setFilters((prev) => ({ ...prev, amenities: e.target.value }))}
            />

            <Input
              placeholder="Destinations (comma-separated)"
              value={filters.destinations}
              onChange={(e) => setFilters((prev) => ({ ...prev, destinations: e.target.value }))}
            />
            <div className="flex gap-2 md:col-span-2">
              <Input
                placeholder="Check-in"
                type="date"
                value={filters.from}
                onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value }))}
              />
              <Input
                placeholder="Check-out"
                type="date"
                value={filters.to}
                onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value }))}
              />
            </div>

            <div className="flex justify-end md:col-span-2 lg:col-span-4">
              <Button variant="outline" onClick={clearFilters} className="px-3 py-1.5 text-sm">
                Clear All Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
