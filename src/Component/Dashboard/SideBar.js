import { FaClock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../Features/slice/authSlice";
import { useFetchUserProfileQuery } from "../../Services/userApiSlice";
import LoadingSpinner from "../LoadingSpinner";

const SideBar = ({ isSidebarOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, isLoading } = useFetchUserProfileQuery();
  const role = data?.role;

  const isAdmin = role === "ADMIN";
  const isSeller = role === "SELLER";
  const isHost = role === "HOST";
  const isTravelAgency = role === "TRAVELAGENCY";

  if (isLoading) return <LoadingSpinner fullScreen={true} size="medium" />;

  const confirmLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(logout());
      navigate("/");
    }
  };

  const getLinkClasses = (isActive) =>
    `py-2 pl-4 flex gap-2 mx-2 mb-2 items-center rounded-md transition duration-200 ${
      isActive
        ? "text-white bg-gradient-to-r from-[#780E0E] to-[#FF5757]"
        : "text-gray-700 hover:bg-gray-200 hover:text-red-500"
    }`;

  // Track current path and query params
  const searchParams = new URLSearchParams(location.search);

  // Accommodations
  const activeAccomodationView = searchParams.get("view");
  const activeStay = searchParams.get("stay");
  const activeType = searchParams.get("type");
  const activeRoom = searchParams.get("room");

  const activeTravelPackageView = searchParams.get("view");
  const isAccomodationsActive =
    location.pathname === "/dashboard/accomodations";

  return (
    <div
      className={`fixed md:relative w-[220px] bg-gray-100 px-4 flex flex-col justify-between 
      h-screen shadow-lg transform transition-transform duration-200 ease-in-out 
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
      md:translate-x-0 z-50`}
    >
      {/* Close Button for Mobile */}
      <button
        className="md:hidden absolute top-2 right-2 p-2 text-gray-700 hover:text-red-500"
        onClick={onClose}
      >
        ✕
      </button>

      {/* Sidebar Content */}
      <h2 className="text-center py-3 lg:text-lg font-light md:text-sm font-redressed text-red-600">
        PanchPokhari Tourism
      </h2>

      {/* Dashboard Section */}
      <div className="mb-3">
        <h3 className="pl-2 text-left mb-2 text-gray-600 font-semibold">
          Dashboard
        </h3>
        <div className="py-1">
          <NavLink
            to="/dashboard/home"
            className={({ isActive }) => getLinkClasses(isActive)}
          >
            <FaClock className="text-lg" /> Overview
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/dashboard/site-settings"
              className={({ isActive }) => getLinkClasses(isActive)}
            >
              Site Settings
            </NavLink>
          )}
        </div>
      </div>

      <hr className="bg-gray-300 my-4 -mx-2" />

      {/* Web Content Section */}
      <div className="mb-3">
        <h3 className="pl-2 text-left mb-3 text-gray-600 font-semibold">
          Web Content
        </h3>
        <div className="py-1">
          {isAdmin && (
            <NavLink
              to="/dashboard/category"
              className={({ isActive }) => getLinkClasses(isActive)}
            >
              Category
            </NavLink>
          )}
          {(isAdmin || isSeller) && (
            <NavLink
              to="/dashboard/product"
              className={({ isActive }) => getLinkClasses(isActive)}
            >
              Products
            </NavLink>
          )}

          {/* Accommodations */}
          {(isAdmin || isHost) && (
            <div>
              <NavLink
                to="/dashboard/accomodations?view=overview"
                className={({ isActive }) =>
                  getLinkClasses(isAccomodationsActive)
                }
              >
                Accommodations
              </NavLink>

              <div className="mx-2 my-3 flex flex-col space-y-1">
                {["overview", "stays", "bookings"].map((sub) => (
                  <div key={sub}>
                    <button
                      onClick={() =>
                        navigate(
                          sub === "stays"
                            ? `/dashboard/accomodations?view=stays&stay=all`
                            : `/dashboard/accomodations?view=${sub}`
                        )
                      }
                      className={`py-2 text-center mx-2 bg-slate-200 text-sm rounded-md transition-colors w-full ${
                        activeAccomodationView === sub
                          ? "text-red-500 font-medium"
                          : "text-gray-600 hover:text-red-500"
                      }`}
                    >
                      {sub.charAt(0).toUpperCase() + sub.slice(1)}
                    </button>

                    {/* Stays submenu */}
                    {sub === "stays" && activeAccomodationView === "stays" && (
                      <div className="ml-6 mt-1 flex flex-col space-y-1">
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/accomodations?view=stays&stay=all`
                            )
                          }
                          className={`py-2 text-center mx-2 bg-slate-200 text-sm rounded-md transition-colors w-full ${
                            activeStay === "all"
                              ? "text-red-500 font-medium"
                              : "text-gray-600 hover:text-red-500"
                          }`}
                        >
                          All Stays
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/accomodations?view=stays&type=true`
                              )
                            }
                            className={`py-2 text-center mx-2 bg-slate-200 text-sm rounded-md transition-colors w-full ${
                              activeType
                                ? "text-red-500 font-medium"
                                : "text-gray-600 hover:text-red-500"
                            }`}
                          >
                            Accommodation Type
                          </button>
                        )}

                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/accomodations?view=stays&room=true`
                            )
                          }
                          className={`py-2 text-center mx-2 bg-slate-200 text-sm rounded-md transition-colors w-full ${
                            activeRoom
                              ? "text-red-500 font-medium"
                              : "text-gray-600 hover:text-red-500"
                          }`}
                        >
                          Rooms
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Travel Packages */}
          {(isAdmin || isTravelAgency) && (
            <div>
              <NavLink
                to="/dashboard/travelpackages?view=traveloverview"
                className={({ isActive }) =>
                  getLinkClasses(
                    isActive || activeTravelPackageView === "traveloverview"
                  )
                }
              >
                Travel Packages
              </NavLink>

              {/* Submenu */}
              <div className="mx-2 my-3 flex flex-col space-y-1">
                {["traveloverview", "packages"].map((sub) => {
                  const isActiveSub = activeTravelPackageView === sub;

                  return (
                    <button
                      key={sub}
                      onClick={() =>
                        navigate(`/dashboard/travelpackages?view=${sub}`)
                      }
                      className={`py-2 text-center mx-2 bg-slate-200 text-sm rounded-md transition-colors w-full ${
                        isActiveSub
                          ? "text-red-500 font-medium"
                          : "text-gray-600 hover:text-red-500"
                      }`}
                    >
                      {sub.charAt(0).toUpperCase() + sub.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <hr className="bg-gray-300 my-4 -mx-2" />

      <button
        onClick={(e) => {
          e.preventDefault();
          confirmLogout();
        }}
        className={getLinkClasses(false)}
      >
        Logout
      </button>
    </div>
  );
};

export default SideBar;
