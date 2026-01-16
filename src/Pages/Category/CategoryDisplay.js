// CategoryPage.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "./../../Component/WebContent/Product/ProductCardDisplay";
import FilterComponent from "./../../Component/WebContent/Category/FilterComponent";
import PaginationControls from "./../../Component/PaginationControls";
import { useGetProductsByCategorySlugQuery } from "../../Services/productApiSlice";
import LoadingSpinner from "../../Component/LoadingSpinner";
import ErrorMessage from "../../Component/ErrorMessage";
import { BiSearch } from "react-icons/bi";

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const {
    data: categoryProduct,
    isLoading,
    isError,
  } = useGetProductsByCategorySlugQuery(slug);

  const categoryProducts = useMemo(() => {
    return categoryProduct?.data || [];
  }, [categoryProduct?.data]);

  const maxCategoryPrice = useMemo(() => {
    if (!categoryProducts.length) return 0;

    return Math.max(
      ...categoryProducts
        .map((p) => Number(p.price))
        .filter((price) => !isNaN(price))
    );
  }, [categoryProducts]);

  const [filteredProducts, setFilteredProducts] = useState(categoryProducts);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    selectedTags: [],
    inStock: false,
    sort: "newest",
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(9);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setFilteredProducts(categoryProducts);
  }, [categoryProducts]);

  const updateDisplayedProducts = useCallback(
    (page) => {
      if (Array.isArray(filteredProducts)) {
        const startIndex = (page - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
      } else {
        setDisplayedProducts([]);
      }
    },
    [filteredProducts, productsPerPage]
  );

  useEffect(() => {
    if (maxCategoryPrice > 0) {
      setFilters((prev) => ({
        ...prev,
        maxPrice: maxCategoryPrice,
      }));
    }
  }, [maxCategoryPrice]);

  useEffect(() => {
    if (Array.isArray(filteredProducts)) {
      const calculatedTotalPages = Math.ceil(
        filteredProducts.length / productsPerPage
      );
      setTotalPages(calculatedTotalPages);
      setCurrentPage(1);
      updateDisplayedProducts(1);
    }
  }, [filteredProducts, productsPerPage, updateDisplayedProducts]);

  useEffect(() => {
    updateDisplayedProducts(currentPage);
  }, [currentPage, updateDisplayedProducts]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setProductsPerPage(6);
      } else {
        setProductsPerPage(8);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allTags = [
    ...new Set(categoryProducts.flatMap((product) => product.tags || [])),
  ];

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleProductClick = (product) => {
    navigate(`/localproducts/product/${product.slug}`);
  };

  const handleFilterApply = () => {
    let filtered = [...categoryProducts];

    // ✅ Price filter
    filtered = filtered.filter(
      (product) =>
        Number(product.price) >= filters.minPrice &&
        Number(product.price) <= filters.maxPrice
    );

    // ✅ Rating filter
    filtered = filtered.filter(
      (product) => (product.averageRating || 0) >= filters.minRating
    );

    // ✅ Tags filter
    if (filters.selectedTags.length > 0) {
      filtered = filtered.filter((product) =>
        (product.tags || []).some((tag) => filters.selectedTags.includes(tag))
      );
    }

    // ✅ In stock filter
    if (filters.inStock) {
      filtered = filtered.filter((product) => Number(product.stock) > 0);
    }

    setFilteredProducts(filtered);
    setIsFilterOpen(false);
  };

  const handleSortChange = (sortType) => {
    let sortedProducts = [...filteredProducts];

    if (sortType === "lowToHigh") {
      sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortType === "highToLow") {
      sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortType === "newest") {
      sortedProducts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortType === "oldest") {
      sortedProducts.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }

    setFilteredProducts(sortedProducts);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError) return <ErrorMessage message="Failed to load categories." />;

  return (
    <div className="p-4 xl:mx-36 lg:mx-24 md:mx-20 mx-2">
      {/* Top Search and Filter Bar */}
      <div className="bg-white border-b border-gray-200 top-0 z-10">
        <div className="flex flex-col items-center justify-center w-full px-4 py-12 md:py-20 lg:py-24 xl:py-24">
          <div className="text-center mb-8 max-w-3xl">
            <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold font-Playfair mb-2 text-red-600">
              Local Products From Panchpokhari
            </h1>
            <p className="text-xs md:text-sm lg:text-base xl:text-lg text-slate-500 font-medium font-Open leading-relaxed">
              Discover handmade treasures and authentic local products crafted
              with care by the people of Panchpokhari
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <BiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search Products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={toggleFilter}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span className="font-medium text-gray-700">Filters</span>
              {(filters.selectedTags.length > 0 ||
                filters.minRating > 0 ||
                filters.inStock ||
                filters.minPrice > 0 ||
                filters.maxPrice < maxCategoryPrice) && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {filters.selectedTags.length +
                    (filters.minRating > 0 ? 1 : 0) +
                    (filters.inStock ? 1 : 0) +
                    (filters.minPrice > 0 ? 1 : 0) +
                    (filters.maxPrice < maxCategoryPrice ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <select
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 font-medium cursor-pointer"
            >
              <option value="">Newest</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
              <option value="newest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Panel - Expandable */}
      <FilterComponent
        isOpen={isFilterOpen}
        filters={filters}
        setFilters={setFilters}
        maxPrice={maxCategoryPrice}
        handleFilterApply={handleFilterApply}
        allTags={allTags}
        onClose={() => setIsFilterOpen(false)}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Category Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Products under{" "}
          {slug?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
          Categories
        </h1>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                handleProductClick={handleProductClick}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500 text-lg">No products available.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageClick={handlePageClick}
              handlePreviousPage={handlePreviousPage}
              handleNextPage={handleNextPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
