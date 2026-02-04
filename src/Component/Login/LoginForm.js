import { useState } from "react";
import { useLoginMutation } from "../../Services/auth/authApiSlice";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../Features/slice/authSlice";
import ForgetPasswordModal from "./ForgetPassword";

const LoginForm = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState(""); // Local error state
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError(""); // Clear any previous errors
    
    try {
      const credentials = { email, password };
      const result = await login(credentials).unwrap();

      // Only proceed if we actually got tokens back
      if (result?.accessToken && result?.refreshToken) {
        const { accessToken, refreshToken } = result;
        
        dispatch(setCredentials({ accessToken, refreshToken }));

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Only navigate/reload on successful login
        window.location.replace("/");
      } else {
        // If no tokens, something is wrong
        setLocalError("Login failed. Please try again.");
      }
    } catch (err) {
      // Capture the error in local state to prevent it from disappearing
      console.error("Login failed:", err);
      const errorMessage = err?.data?.message || err?.message || "Login failed. Please try again.";
      setLocalError(errorMessage);
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

        {(isError || localError) && (
          <div className="mt-4 text-center text-red-600">
            {localError || error?.data?.message || "Login failed. Please try again."}
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