import { FaClock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../Features/slice/authSlice";
import { useFetchUserProfileQuery } from "../../Services/userApiSlice";
import LoadingSpinner from "../LoadingSpinner";

const SideBar = ({ isSidebarOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getLinkClasses = (isActive) =>
    `py-2 pl-4 flex gap-2 mx-2 mb-2 items-center rounded-md transition duration-200 ${
      isActive
        ? "text-white bg-gradient-to-r from-[#780E0E] to-[#FF5757]"
        : "text-gray-700 hover:bg-gray-200 hover:text-red-500"
    }`;

  const { data, isLoading } = useFetchUserProfileQuery();
  const role = data?.role;

  const confirmLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(logout());
      navigate("/");
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen={true} size="medium" />;

  const isAdmin = role === "ADMIN";
  const isSeller = role === "SELLER";
  const isHost = role === "HOST";
  const isTravelAgency = role === "TRAVELAGENCY";

  return (
    <div
      className={`fixed md:relative w-[220px] bg-gray-100 px-4 flex flex-col justify-between h-[650px] shadow-lg transform transition-transform duration-200 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 z-50 overflow-y-auto`}
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
          {(isAdmin || isHost) && (
            <div>
              <NavLink
                to="/dashboard/accomodations"
                className={({ isActive }) => getLinkClasses(isActive)}
                onClick={() =>
                  navigate("/dashboard/accomodations?view=overview")
                }
              >
                Accomodations
              </NavLink>

              {/* Submenu */}
              <div className="mx-2 mt-1 flex flex-col space-y-1">
                {["overview", "stays", "bookings"].map((sub) => {
                  const isActiveSub =
                    new URLSearchParams(window.location.search).get("view") ===
                      sub && window.location.pathname.includes("accomodations");

                  return (
                    <div key={sub}>
                      <button
                        onClick={() =>
                          navigate(`/dashboard/accomodations?view=${sub}`)
                        }
                        className={`py-2 text-center mx-2 bg-slate-200 text-sm rounded-md transition-colors w-full ${
                          isActiveSub
                            ? "text-red-500 font-medium"
                            : "text-gray-600 hover:text-red-500"
                        }`}
                      >
                        {sub.charAt(0).toUpperCase() + sub.slice(1)}
                      </button>

                      {/* 👇 Stays Submenu */}
                      {sub === "stays" && isActiveSub && (
                        <div className="ml-6 mt-1 flex flex-col space-y-1">
                          {["all", "add"].map((staySub) => {
                            const isActiveStaySub =
                              new URLSearchParams(window.location.search).get(
                                "stay"
                              ) === staySub;

                            return (
                              <div key={staySub}>
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/accomodations?view=stays&stay=${staySub}`
                                    )
                                  }
                                  className={`py-2 text-center mx-2 bg-slate-200 text-sm rounded-md transition-colors w-full ${
                                    isActiveStaySub
                                      ? "text-red-500 font-medium"
                                      : "text-gray-600 hover:text-red-500"
                                  }`}
                                >
                                  {staySub === "all" ? "All Stays" : "Add Stay"}
                                </button>

                                {/* 👇 Rooms Submenu under Add Stay */}
                                {staySub === "add" && isActiveStaySub && (
                                  <div className="ml-6 mt-1 flex flex-col space-y-1">
                                    {/* 👇 Accommodation Type (only for Admin) */}
                                    {isAdmin && (
                                      <button
                                        onClick={() =>
                                          navigate(
                                            `/dashboard/accomodations?view=stays&stay=add&type=true`
                                          )
                                        }
                                        className={`py-2 text-center mx-2 bg-slate-200 text-sm rounded-md transition-colors w-full ${
                                          new URLSearchParams(
                                            window.location.search
                                          ).get("type")
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
                                          `/dashboard/accomodations?view=stays&stay=add&room=true`
                                        )
                                      }
                                      className={`py-2 text-center mx-2 bg-slate-200 text-sm rounded-md transition-colors w-full ${
                                        new URLSearchParams(
                                          window.location.search
                                        ).get("room")
                                          ? "text-red-500 font-medium"
                                          : "text-gray-600 hover:text-red-500"
                                      }`}
                                    >
                                      Rooms
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(isAdmin || isTravelAgency) && (
            <div>
              <NavLink
                to="/dashboard/travelpackages"
                className={({ isActive }) => getLinkClasses(isActive)}
                onClick={() =>
                  navigate("/dashboard/travelpackages?view=overview")
                }
              >
                Travel Packages
              </NavLink>
              {/* Submenu */}
              <div className="mx-2 mt-1 flex flex-col space-y-1">
                {["overview", "packages"].map((sub) => {
                  const isActiveSub =
                    new URLSearchParams(window.location.search).get("view") ===
                    sub;
                  return (
                    <button
                      key={sub}
                      onClick={() =>
                        navigate(`/dashboard/travelpackages?view=${sub}`)
                      }
                      className={`py-2 text-center mx-2 bg-slate-200 text-sm rounded-md transition-colors ${
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
