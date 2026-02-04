// src/pages/LoginPage.js
import { Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import LoginForm from "../../Component/Login/LoginForm.js";

const Login = () => {
  return (
    <div className="h-screen -m-4">
      <Link
        to="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg transition"
      >
        <HiHome className="text-xl" />
        <span className="hidden sm:inline font-medium">Home</span>
      </Link>

      <div className="h-full gap-2 lg:flex lg:flex-row justify-center items-center p-1">
        {/* Left Section (Tourism Info) */}
        <div className="p-2 text-center items-center w-full lg:w-1/2">
          <div className="p-2 mx-4 sm:mx-8 md:mx-16">
            <img
              src="/assets/Images/Gov1.png"
              alt="Panchpokhari Tourism"
              className="w-32 h-28 sm:w-40 sm:h-36 md:w-52 md:h-44 object-cover rounded-lg mb-5 mx-auto"
            />
            <h2 className="text-red-600 text-3xl sm:text-4xl md:text-5xl font-medium font-redressed transform hover:scale-105 transition-transform duration-300">
              Panchpokhari Tourism
            </h2>
            <p className="text-xl sm:text-2xl my-2 leading-relaxed">
              PanchPokhari Thangpal Gaupailka
            </p>
            <p className="text-sm sm:text-base my-2 text-gray-700 leading-relaxed">
              Discover authentic destinations and unforgettable experiences
              tailored for every traveler.
            </p>
          </div>
        </div>

        {/* Right Section (Login Form) */}
        <div className="lg:h-full bg-gray-200 w-full lg:w-1/2 flex justify-center items-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
