import { BiSolidEnvelope, BiSolidMap, BiSolidPhoneCall } from "react-icons/bi";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGetSiteSettingsQuery } from "../../Services/SiteSettingApi";
import ErrorMessage from "../ErrorMessage";
import LoadingSpinner from "../LoadingSpinner";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const Footer = () => {
  const { data, isLoading, error } = useGetSiteSettingsQuery();

  if (isLoading) return <LoadingSpinner fullScreen size="medium" />;
  if (error || !data)
    return (
      <ErrorMessage message="Failed to load site settings." className="m-4" />
    );

  const defaultSettings = {
    name: "PanchPokhari Tourism",
    phoneNumber: "+1012 3456 7890",
    email: "demo@gmail.com",
    address: "132 Dartmouth Street, Boston, MA 02156, USA",
    facebookLink: "#",
    instagramLink: "#",
    twitterLink: "#",
    linkedinLink: "#",
    logo: null,
  };

  const siteSettings = { ...defaultSettings, ...data };

  const {
    name,
    phoneNumber,
    email,
    address,
    facebookLink,
    instagramLink,
    twitterLink,
    linkedinLink,
    logo,
  } = siteSettings;

  return (
    <footer className="bg-[#EFEFEF] text-black">
      <div className="container mx-auto border-t-2 border-gray-800 py-10">
        {/* GRID WRAPPER */}
        <div className="mx-4 sm:mx-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 items-start">
          {/* LOGO & NAME */}
          <div className="text-center sm:text-left">
            {logo && (
              <img
                src={`${API_BASE_URL}${logo}`}
                alt="Logo"
                className="h-20 sm:h-24 md:h-28 mb-3 mx-auto sm:mx-0 object-contain"
              />
            )}
            <p className="lg:text-3xl xl:text-4xl md:text-2xl text-xl font-redressed text-red-700">
              {name}
            </p>
          </div>

          {/* CONTACT INFO */}
          <div className="text-center sm:text-left max-w-xs">
            <h2 className="lg:text-xl md:text-sm font-bold text-yellow-500 mb-4">
              Reach Us
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 justify-center sm:justify-start">
                <BiSolidPhoneCall className="text-xl flex-shrink-0" />
                <span className="text-gray-700 text-sm lg:text-base break-words">
                  {phoneNumber}
                </span>
              </li>

              <li className="flex items-start gap-4 justify-center sm:justify-start">
                <BiSolidEnvelope className="text-xl flex-shrink-0" />
                <span className="text-gray-700 text-sm lg:text-base break-words">
                  {email}
                </span>
              </li>

              <li className="flex items-start gap-4 justify-center sm:justify-start">
                <BiSolidMap className="text-xl flex-shrink-0" />
                <span className="text-gray-700 text-sm lg:text-base break-words">
                  {address}
                </span>
              </li>
            </ul>
          </div>

          {/* NAV LINKS */}
          <div className="text-center sm:text-left">
            <h2 className="lg:text-xl md:text-sm font-bold text-yellow-500 mb-4">
              {name}
            </h2>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-700 text-sm lg:text-base hover:text-yellow-500"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/ContactUs"
                  className="text-gray-700 text-sm lg:text-base hover:text-yellow-500"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* SOCIAL LINKS */}
          <div className="text-center sm:text-left">
            <h2 className="lg:text-xl md:text-sm font-bold text-yellow-500 mb-4">
              Find Us On
            </h2>
            <ul className="space-y-4">
              {[
                { icon: <FaTwitter />, label: "Twitter", link: twitterLink },
                {
                  icon: <FaInstagram />,
                  label: "Instagram",
                  link: instagramLink,
                },
                {
                  icon: <FaFacebookF />,
                  label: "Facebook",
                  link: facebookLink,
                },
                {
                  icon: <FaLinkedinIn />,
                  label: "LinkedIn",
                  link: linkedinLink,
                },
              ].map((social, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 justify-center sm:justify-start"
                >
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-red-700 text-white">
                    {social.icon}
                  </span>
                  <a
                    href={social.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 text-sm lg:text-base hover:text-yellow-500"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
