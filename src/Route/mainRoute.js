import { Route, Routes } from "react-router-dom";
import Layout from "./../Component/Main/Layout";
import WebContentRoute from "./webContentRoute";
import ProtectedRoute from "./ProtectedRoute";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import SiteSettings from "../Pages/Dashboard/Site-Settings/SiteSettings";
import NoPage from "./../NoPage";
import Category from "../Pages/Dashboard/Category/Category";
import Product from "../Pages/Dashboard/Products/Product";
import Profile from "./../Pages/Profile/Profile";
import AddToCart from "../Pages/Cart Page/AddToCart";
import Accomodations from "../Pages/Dashboard/Host/Accomodations";
import TravelPackages from "../Pages/Dashboard/Travel Agency/TravelPackages";
import UserManagement from "../Pages/Dashboard/User Management/UserManagement";
import UserDocumentation from "../Pages/Dashboard/User Management/UserDocumentation";
import MyHistory from "../Pages/History/MyHistory";
// import UserVerification from "../Component/Dashboard/Documentation/UserVerification";

function MainRoute() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/*" element={<WebContentRoute />} />

        <Route path="cart" element={<ProtectedRoute />}>
          <Route index element={<AddToCart />} />
        </Route>
      </Route>

      {/* Dashboard Routes */}
      <Route path="dashboard" element={<ProtectedRoute />}>
        <Route index element={<DashboardHome />} />
        <Route path="home" element={<DashboardHome />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="user-documentation" element={<UserDocumentation />} />
        {/* <Route path="user-verification" element={<UserVerification />} /> */}
        <Route path="site-settings" element={<SiteSettings />} />
        <Route path="category" element={<Category />} />
        <Route path="product" element={<Product />} />
        <Route path="accomodations" element={<Accomodations />} />
        <Route path="travelpackages" element={<TravelPackages />} />
      </Route>

      {/* Profile */}
      <Route path="profile" element={<Profile />} />

      {/* My Bookings - Protected Route */}
      <Route path="my-bookings" element={<ProtectedRoute />}>
        <Route index element={<MyHistory />} />
      </Route>

      <Route path="*" element={<NoPage />} />
    </Routes>
  );
}

export default MainRoute;
