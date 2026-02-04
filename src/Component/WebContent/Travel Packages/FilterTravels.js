import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- UI ---------------- */
const Button = ({ children, variant = "default", className = "", onClick, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2";
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
  minPrice: "",
  maxPrice: "",
  destinations: "",
  minDays: "",
  maxDays: "",
  dateFrom: "",
  dateTo: "",
};

/* ---------------- COMPONENT ---------------- */
export default function FilterTravels({ filters, setFilters, order, setOrder }) {
  const [showFilters, setShowFilters] = useState(false);

  // debounce search
  const debouncedSearch = useMemo(() => {
    let t;
    return (val) => {
      clearTimeout(t);
      t = setTimeout(() => setFilters((p) => ({ ...p, q: val })), 300);
    };
  }, [setFilters]);

  const activeCount = Object.values(filters).filter(Boolean).length;

  const clearFilters = () => setFilters(defaultFilters);

  return (
    <div className="bg-gray-100 border rounded-lg border-gray-300 p-4 mb-4">
      {/* SEARCH + SORT */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4 items-center">
        <Input
          placeholder="Search travel packages..."
          value={filters.q}
          onChange={(e) => debouncedSearch(e.target.value)}
          className="flex-1 min-w-[220px] focus:ring-yellow-500"
        />

        <div className="flex gap-2 items-center w-full lg:w-auto">
          <Button
            variant="outline"
            onClick={() => setShowFilters((p) => !p)}
            className="relative flex items-center gap-2 bg-white"
          >
            Filters
            {activeCount > 0 && (
              <span className="bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </Button>

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="">Sort by</option>
            <option value="ASC">Price: Low to High</option>
            <option value="DESC">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* ADVANCED FILTERS */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden"
          >
            <Input
              placeholder="Min Price"
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))}
            />
            <Input
              placeholder="Max Price"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))}
            />
            <Input
              placeholder="Min Days"
              type="number"
              value={filters.minDays}
              onChange={(e) => setFilters((p) => ({ ...p, minDays: e.target.value }))}
            />
            <Input
              placeholder="Max Days"
              type="number"
              value={filters.maxDays}
              onChange={(e) => setFilters((p) => ({ ...p, maxDays: e.target.value }))}
            />
            <Input
              placeholder="From Date"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters((p) => ({ ...p, dateFrom: e.target.value }))}
            />
            <Input
              placeholder="To Date"
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters((p) => ({ ...p, dateTo: e.target.value }))}
            />
            <Input
              placeholder="Destination (e.g., Pokhara)"
              value={filters.destinations}
              onChange={(e) => setFilters((p) => ({ ...p, destinations: e.target.value }))}
              className="lg:col-span-2"
            />

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
