import { useState } from "react";
import { useLoginMutation } from "../../Services/auth/authApiSlice";
import { Link, useNavigate } from "react-router-dom"; // For navigation after login
import { useDispatch } from "react-redux"; // For dispatching Redux actions
import { setCredentials } from "../../Features/slice/authSlice"; // Corrected import for Redux action
import ForgetPasswordModal from "./ForgetPassword";
// import { useFetchUserProfileQuery } from "../../Services/auth/userApiSlice";

const LoginForm = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // For "Remember Me" functionality
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const navigate = useNavigate(); // Hook for navigation
  const dispatch = useDispatch(); // Hook for dispatching Redux actions
  // const { data: profile } = useFetchUserProfileQuery(); // Fetch profile

  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const openModal = () => {
    setShowModal(true); // Open the modal when the button is clicked
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const credentials = { email, password };
      const { accessToken, refreshToken } = await login(credentials).unwrap();

      dispatch(setCredentials({ accessToken, refreshToken }));

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      navigate("/");
      window.location.replace("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="bg-white lg:rounded-2xl p-8 w-full lg:max-w-md">
      <h1 className="text-5xl font-italiano font-light text-center mb-8 text-yellow-400">
        Welcome Back
        <img
          src="/assets/Images/red-line.png"
          alt="Panchpokhari Tourism"
          className="object-contain rounded-lg mb-5 -m-2 mx-auto"
        />
      </h1>
      <form onSubmit={handleLogin}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            email
          </label>
          <input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
            required
          />
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-all duration-300"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div>
            <button
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-500 focus:outline-none"
              onClick={() => {
                openModal();
              }}
            >
              Forget Password?
            </button>

            <ForgetPasswordModal
              showModal={showModal}
              closeModal={closeModal}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 text-white py-3 px-6 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:scale-105 transition-transform duration-300"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>

        {isError && (
          <div className="mt-4 text-center text-red-600">
            {error?.data?.message || "Login failed. Please try again."}
          </div>
        )}
      </form>

      <div className="mt-8 text-center">
        <Link
          to="/signup"
          className="text-red-600 text-base underline xl:text-[18px] lg:text-[14px] md:text-[12px]"
        >
          CREATE AN ACCOUNT
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
