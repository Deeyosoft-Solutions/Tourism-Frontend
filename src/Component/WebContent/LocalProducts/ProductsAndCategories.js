import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import PaginationControls from "./../../PaginationControls";
import ProductCard from "./../Product/ProductCardDisplay";
import { useGetCategoriesQuery } from "../../../Services/categoryApiSlice";
import { useGetProductsQuery } from "../../../Services/productApiSlice";
import LoadingSpinner from "../../LoadingSpinner";
import ErrorMessage from "../../ErrorMessage";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const LocalProductPage = () => {
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [visibleCategoryItems, setVisibleCategoryItems] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery();

  // Fetch products with pagination
  const {
    data: productsData = { data: [], totalProducts: 0 },
    isLoading: productsLoading,
    isError: productsError,
  } = useGetProductsQuery({
    page: currentPage,
    limit: productsPerPage,
  });

  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.data || [];
  const totalProducts = productsData?.total || 0;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handleCategoryClick = (category) =>
    navigate(`/localproducts/category/${category.slug}`);
  const handleProductClick = (product) =>
    navigate(`/localproducts/product/${product.slug}`);
  const products = useMemo(() => productsData?.data || [], [productsData]);

  // Filtered products for search
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

  useEffect(() => {
    const getVisibleCategoryItems = () => {
      if (window.innerWidth >= 1280) return 10;
      if (window.innerWidth >= 1024) return 5;
      if (window.innerWidth >= 768) return 4;
      return 2;
    };

    const getVisibleProductItems = () => {
      if (window.innerWidth >= 1280) return 20;
      if (window.innerWidth >= 1024) return 15;
      if (window.innerWidth >= 768) return 12;
      return 8;
    };

    const handleResize = () => {
      setVisibleCategoryItems(getVisibleCategoryItems());
      setProductsPerPage(getVisibleProductItems());
      setShowMoreCategories(false);
      setCurrentPage(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (categoriesLoading || productsLoading) return <LoadingSpinner />;
  if (categoriesError)
    return (
      <ErrorMessage message="Failed to load categories." className="m-4" />
    );
  if (productsError)
    return <ErrorMessage message="Failed to load products." className="m-4" />;

  return (
    <div className="p-4 xl:mx-44 lg:mx-32 md:mx-20 mx-2">
      {/* Search Bar */}
      <div className="relative flex items-center w-full bg-gray-200 gap-2 rounded-md border border-gray-300 p-3 mb-6">
        <div className="w-full flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* Left Search Icon */}
          <div className="flex items-center justify-center px-4">
            <MdSearch size={20} className="text-gray-400" />
          </div>

          {/* Input */}
          <input
            type="text"
            placeholder="Search Products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow py-2 text-gray-700 focus:outline-none placeholder-gray-400"
          />
        </div>
        <select className="py-2 px-4 border-l border-gray-200 rounded-md text-gray-600 text-sm focus:outline-none">
          <option>Newest</option>
          <option>Oldest</option>
        </select>

        {/* Floating Search Results */}
        {searchTerm && (
          <div
            className="absolute left-0 right-0 mt-2 w-full bg-white rounded-xl shadow-lg overflow-y-auto border border-gray-200 z-50"
            style={{ maxHeight: "280px" }}
          >
            {productsLoading ? (
              <div className="flex justify-center p-4">
                <LoadingSpinner />
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="flex items-center gap-3 py-2 px-4 cursor-pointer hover:bg-gray-50 transition-all border-b last:border-none"
                >
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <span className="font-medium text-gray-800">
                    {product.name}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-4 text-gray-500 text-center">
                No products found.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Product Categories Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-mono font-semibold">Categories</h1>
        {categories.length > visibleCategoryItems && (
          <button
            className="text-blue-500 text-sm hover:underline flex items-center gap-1"
            onClick={() => setShowMoreCategories(!showMoreCategories)}
          >
            {showMoreCategories ? "Show Less" : "View All"}
            {!showMoreCategories && <FaArrowRight className="inline-block" />}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        {categories
          .slice(
            0,
            showMoreCategories ? categories.length : visibleCategoryItems
          )
          .map((category, index) => (
            <div
              key={category.id || category.slug || index}
              className="border p-2 rounded-md cursor-pointer hover:border hover:text-blue-400 hover:border-blue-400 hover:shadow-md"
              onClick={() => handleCategoryClick(category)}
            >
              <img
                src={
                  category.imageUrl
                    ? `${API_BASE_URL}${category.imageUrl}`
                    : "/assets/Images/png-logo.png"
                }
                alt={category.name}
                className="w-full h-36 object-cover rounded-sm mb-2"
              />
              <h2 className="text-lg font-medium font-poppins text-center">
                {category.name}
              </h2>
            </div>
          ))}
      </div>

      {/* Products Section */}
      {searchTerm ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
          {filteredProducts.length ? (
            filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id || product.slug || index}
                product={{
                  ...product,
                  images: product.images,
                  category: product.category || {
                    _id: "",
                    name: "Uncategorized",
                  },
                }}
                handleProductClick={() => handleProductClick(product)}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No products found.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-mono font-semibold">Products</h1>
            <span className="text-gray-600">
              {totalProducts} products available
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product, index) => (
              <ProductCard
                key={product.id || product.slug || index}
                product={{
                  ...product,
                  images: product.images,
                  category: product.category || {
                    _id: "",
                    name: "Uncategorized",
                  },
                }}
                handleProductClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        </>
      )}

      {/* Pagination Controls */}
      {!searchTerm && totalProducts > productsPerPage && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          handlePreviousPage={() =>
            setCurrentPage((prev) => Math.max(prev - 1, 1))
          }
          handleNextPage={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          handlePageClick={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default LocalProductPage;
