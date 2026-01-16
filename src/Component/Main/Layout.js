import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import "../../App.css";
import MainNavBar from "./../WebContent/NavBar/MainNavBar";
import SideNavBar from "./../WebContent/NavBar/SideNavBar";
import HeroSection from "./../WebContent/Hero/HeroSection";
import HomeDetails from "./../WebContent/Section Details/HomeDetails";
import WhereToGoDetails from "./../WebContent/Section Details/WhereToGoDetails";
import WhereToStayDetails from "./../WebContent/Section Details/WhereToStayDetails";
import LocalDetails from "./../WebContent/Section Details/LocalDetails";
import ContactUsDetails from "./../WebContent/Section Details/ContactUsDetails";
import TravelPackageDetails from "../WebContent/Section Details/TravelPackageDetails";

const Layout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const isProductPage = location.pathname.startsWith("/localproducts/product");
  const isDestinationPage = location.pathname.startsWith(
    "/wheretogo/destination"
  );
  const isAccomodationPage = location.pathname.startsWith(
    "/wheretostay/accomodation"
  );
  const isTravelDealsPage = location.pathname.startsWith(
    "/travel-packages/travel-deals"
  );
  const isCartPage = location.pathname.startsWith("/localproducts/cart");
  const isLocalPage = location.pathname.startsWith("/localproducts");
  const isStayPage = location.pathname.startsWith("/wheretostay");
  const isGoPage = location.pathname.startsWith("/wheretogo");
  const isTravelPage = location.pathname.startsWith("/travel-packages");
  const isCategoryPage = location.pathname.startsWith(
    "/localproducts/category"
  );
  const isSignUpPage = location.pathname.toLowerCase().startsWith("/signup");
  const isLogInPage = location.pathname.toLowerCase().startsWith("/login");
  const isResetPage = location.pathname
    .toLowerCase()
    .startsWith("/reset-password");

  return (
    <div className="w-full">
      {/* Navbar */}
      {!isSignUpPage && !isLogInPage && !isResetPage && (
        <>
          {isProductPage ||
          isDestinationPage ||
          isAccomodationPage ||
          isTravelDealsPage ||
          isCartPage ||
          isStayPage ||
          isTravelPage ||
          isGoPage ||
          isLocalPage ? (
            <SideNavBar />
          ) : (
            <MainNavBar />
          )}

          {/* Hero Section */}
          {!isCategoryPage &&
            ![
              "/localproducts",
              "/wheretogo",
              "/wheretostay",
              "/travel-packages",
            ].some(isActive) && <HeroSection />}
        </>
      )}

      {/* Page Details */}
      {isActive("/") ? (
        <HomeDetails />
      ) : isActive("/wheretogo") ? (
        <WhereToGoDetails />
      ) : isActive("/wheretostay") ? (
        <WhereToStayDetails />
      ) : isActive("/localproducts") ? (
        <LocalDetails />
      ) : isActive("/contactus") ? (
        <ContactUsDetails />
      ) : isActive("/travel-packages") ? (
        <TravelPackageDetails />
      ) : (
        <div className="hidden">No Details</div>
      )}

      {/* Main Content */}
      <main className="p-4">
        <Outlet />
      </main>

      {/* Footer - hidden on signup, login, reset */}
      {!isSignUpPage && !isLogInPage && !isResetPage && <Footer />}
    </div>
  );
};

export default Layout;
