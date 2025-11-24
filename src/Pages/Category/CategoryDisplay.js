import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "./../../Component/WebContent/Product/ProductCardDisplay";
import FilterComponent from "./../../Component/WebContent/Category/FilterComponent";
import PaginationControls from "./../../Component/PaginationControls";
import { useGetProductsByCategorySlugQuery } from "../../Services/productApiSlice";
import LoadingSpinner from "../../Component/LoadingSpinner";
import ErrorMessage from "../../Component/ErrorMessage";

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const {
    data: categoryProduct,
    isLoading,
    isError,
  } = useGetProductsByCategorySlugQuery(slug);

  // Get products from response or empty array if not available
  const categoryProducts = useMemo(() => {
    return categoryProduct?.data || [];
  }, [categoryProduct?.data]);
  // State for filtered products
  const [filteredProducts, setFilteredProducts] = useState(categoryProducts);

  // State for filters
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    selectedSubCategories: [],
    minRating: 0,
    selectedTags: [],
  });

  // State for filter panel visibility (mobile)
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(9);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Update filtered products when category products change
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
        console.warn(
          "filteredProducts is not an array or is undefined:",
          filteredProducts
        );
        setDisplayedProducts([]);
      }
    },
    [filteredProducts, productsPerPage]
  );

  // Update pagination when filtered products or productsPerPage changes
  useEffect(() => {
    if (Array.isArray(filteredProducts)) {
      const calculatedTotalPages = Math.ceil(
        filteredProducts.length / productsPerPage
      );
      setTotalPages(calculatedTotalPages);
      setCurrentPage(1);
      updateDisplayedProducts(1);
    } else {
      console.warn("filteredProducts is not an array:", filteredProducts);
    }
  }, [filteredProducts, productsPerPage, updateDisplayedProducts]);

  // Update displayed products when currentPage changes
  useEffect(() => {
    updateDisplayedProducts(currentPage);
  }, [currentPage, updateDisplayedProducts]);

  // Update productsPerPage based on screen size
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

  // Get unique subcategories from categoryProducts
  const subcategories = [
    ...new Set(categoryProducts.map((product) => product.subcategory)),
  ];

  // Get unique tags from categoryProducts
  const allTags = [
    ...new Set(categoryProducts.flatMap((product) => product.tags || [])),
  ];

  // Pagination handlers
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
    navigate(`/localproducts/product/${product.slug}`); // Changed from product.id to product._id
  };

  // Filtering logic
  const handleFilterApply = () => {
    let filtered = categoryProducts;

    // Price range filter
    filtered = filtered.filter(
      (product) =>
        parseFloat(product.price) >= filters.priceRange[0] &&
        parseFloat(product.price) <= filters.priceRange[1]
    );

    // Subcategory filter (only if exists)
    if (filters.selectedSubCategories.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product.subcategory &&
          filters.selectedSubCategories.includes(product.subcategory)
      );
    }

    // Rating filter
    filtered = filtered.filter(
      (product) => (product.averageRating || 0) >= filters.minRating
    );

    // Tags filter
    if (filters.selectedTags.length > 0) {
      filtered = filtered.filter((product) =>
        (product.tags || []).some((tag) => filters.selectedTags.includes(tag))
      );
    }

    setFilteredProducts(filtered);

    if (window.innerWidth < 768) {
      setIsFilterOpen(false);
    }
  };

  // Sorting logic
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

  // Toggle filter panel (mobile)
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError)
    return (
      <ErrorMessage message="Failed to load categories." />
    );

  return (
    <div className="w-full px-4 py-2">
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden w-full flex justify-between items-center mb-4">
        <button
          onClick={toggleFilter}
          className="flex items-center bg-gray-100 px-4 py-2 rounded-md text-sm font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 6a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm4 6a1 1 0 011-1h2a1 1 0 010 2h-2a1 1 0 01-1-1z"
            />
          </svg>
          Filters
        </button>

        <div className="flex items-center">
          <p className="font-poppins text-[14px] text-gray-500 mr-2">
            Sort By:
          </p>
          <select
            className="text-[12px] font-medium font-poppins text-gray-500 p-1 border rounded-sm"
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="">Select</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
            <option value="newest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-4">
        {/* Filters sidebar - hidden on mobile until toggled */}
        <div
          className={`${
            isFilterOpen ? "block" : "hidden"
          } lg:block lg:w-64 bg-white p-4 rounded-md shadow-sm mb-4 lg:mb-0`}
        >
          <FilterComponent
            filters={filters}
            setFilters={setFilters}
            handleFilterApply={handleFilterApply}
            subcategories={subcategories}
            allTags={allTags}
          />
        </div>

        {/* Main content area with products and pagination */}
        <div className="flex-1 flex flex-col min-h-full">
          {/* Desktop controls row */}
          <div className="hidden lg:flex justify-between items-center p-2 mb-4">
            <div className="flex p-1 items-center">
              <p className="font-poppins text-[14px] text-gray-500 mr-2">
                Sort By:
              </p>
              <select
                className="text-[12px] font-medium font-poppins text-gray-500 p-1 border rounded-sm"
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="">Select</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
                <option value="newest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            <span className="text-xl font-semibold font-poppins">
              {filteredProducts.length}{" "}
              <span className="text-sm font-light font-poppins">
                {filteredProducts.length === 1 ? "Result" : "Results"} found
              </span>
            </span>
          </div>

          {/* Mobile results count */}
          <div className="lg:hidden text-center mb-4">
            <span className="text-xl font-semibold font-poppins">
              {filteredProducts.length}{" "}
              <span className="text-sm font-light font-poppins">
                {filteredProducts.length === 1 ? "Result" : "Results"} found
              </span>
            </span>
          </div>

          {/* Product section and pagination container */}
          <div className="flex flex-col flex-grow justify-between">
            {/* Product Grid - will stretch to fill available space */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id} // Changed from product.id to product._id
                    product={product}
                    handleProductClick={handleProductClick}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No products available.</p>
                </div>
              )}
            </div>

            {/* Pagination - always at the bottom */}
            {totalPages > 1 ? (
              <div className="mt-auto pt-6">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageClick={handlePageClick}
                  handlePreviousPage={handlePreviousPage}
                  handleNextPage={handleNextPage}
                />
              </div>
            ) : (
              <div className="mt-auto pt-6"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
