import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import WhereToGo from "../Pages/WhereToGo/WhereToGo";
import WhereToStay from "../Pages/WhereToStay/WhereToStay";
import ContactUs from "../Pages/ContactUs/ContactUs";
import Login from "../Pages/Login/Login";
import ResetPassword from "../Pages/Reset Password/ResetPassword";
import Home from "./../Pages/Home/Home";
import CategoryPage from "./../Pages/Category/CategoryDisplay";
import ProductPage from "./../Pages/Products/ProductDisplay";
import LocalProducts from "./../Pages/Local Products/LocalProducts";
import DestinationPage from "../Pages/WhereToGo/Destinations/DestinationsPage";
import AccomodationPage from "../Pages/WhereToStay/Accomodations/AccomodationPage";
import TravelPackages from "../Pages/Travel Packages/TravelPackages";
import RegisterPage from "../Pages/Sign Up/SignUp";
import AddToCart from "../Pages/Cart Page/AddToCart";
import TravelDeals from "../Pages/Travel Packages/Travel Deals/TravelDeals";
// import ProtectedRoute from "./ProtectedRoute";
// import AddToCart from "./../Pages/Cart Page/AddToCart";

const WebContentRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route index element={<Home />} />

        <Route path="wheretogo" element={<Outlet />}>
          <Route index element={<WhereToGo />} />
          <Route path="destination/:slug" element={<DestinationPage />} />
        </Route>

        <Route path="wheretostay" element={<Outlet />}>
          <Route index element={<WhereToStay />} />
          <Route path="accomodation/:slug" element={<AccomodationPage />} />
        </Route>

        <Route path="travel-packages" element={<Outlet />}>
          <Route index element={<TravelPackages />} />
          <Route path="travel-deals/:slug" element={<TravelDeals />} />
        </Route>

        <Route path="contactus" element={<ContactUs />} />
        <Route path="signup" element={<RegisterPage />} />
        <Route path="login" element={<Login />} />

        <Route path="reset-password/:token" element={<ResetPassword />} />

        <Route path="localproducts" element={<Outlet />}>
          <Route index element={<LocalProducts />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="product/:slug" element={<ProductPage />} />
          <Route path="cart" element={<AddToCart />} />
        </Route>
      </Route>

      {/* Fallback route for unauthorized access */}
      <Route path="/unauthorized" element={<div>Unauthorized Access!</div>} />
    </Routes>
  );
};

export default WebContentRoute;
