import { Outlet, Navigate } from "react-router-dom";
import { useFetchUserProfileQuery } from "../Services/userApiSlice";

const ProtectedRoute = () => {
  const token = localStorage.getItem("accessToken");

  const {
    data: user,
    isLoading,
    isError,
  } = useFetchUserProfileQuery(undefined, {
    skip: !token,
  });

  // While verifying token → block UI
  if (token && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Checking session...
      </div>
    );
  }

  // ❌ No token or invalid session
  if (!token || isError || !user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated
  return <Outlet />;
};

export default ProtectedRoute;
