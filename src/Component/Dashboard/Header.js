import { FiMenu } from "react-icons/fi";
import { useFetchUserProfileQuery } from "../../Services/userApiSlice";
import HomeButton from "../HomeButton";
import LoadingSpinner from "../LoadingSpinner";

const Header = ({ onMenuToggle }) => {
  const { data, isLoading } = useFetchUserProfileQuery();

  if (isLoading) return <LoadingSpinner fullScreen={true} size="medium" />;

const userName = `${data?.firstName || "User"} ${data?.lastName || ""}`;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-4 py-2 border-b-2 border-gray-300">
      <div className="w-full flex justify-between mb-2">
        {/* Greeting Text */}
        <div className="text-center md:text-left md:mb-0">
          <p className="font-Playfair text-lg md:text-2xl text-gray-700">
            Hi! <span className="ml-2 text-gray-600">{userName}</span>
          </p>
        </div>

        {/* Menu Button for Mobile */}
        <button className="md:hidden p-2" onClick={onMenuToggle}>
          <FiMenu className="w-4 h-4" />
        </button>
      </div>

      {/* Notification, Home, and User Profile */}
      <div className="flex items-center gap-4">
        {/* Home Button */}
        <HomeButton />
        <img
          src="/assets/Images/carbon_notification.svg"
          alt="Notification"
          className="w-6 h-6"
        />
        <img
          src={data?.images || "/assets/Images/default-avatar-image.jpg"}
          alt="User"
          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default Header;
