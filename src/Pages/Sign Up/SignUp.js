import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation, useLazyCheckEmailQuery } from "../../Services/registerApiSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect, useRef } from "react";
import { X, Upload, User } from "lucide-react";
import ErrorToast from "../../Component/ErrorToast";
import SuccessToast from './../../Component/SuccessToast';


const RegisterPage = () => {
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [checkEmail, { data: emailCheckData, isFetching: isCheckingEmail }] = useLazyCheckEmailQuery();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [emailValidationStatus, setEmailValidationStatus] = useState(null);
  const debounceTimer = useRef(null);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      permanentAddress: "",
      temporaryAddress: "",
      gender: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "NORMAL",
      images: null,
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string().required("Phone is required"),
      gender: Yup.string().required("Gender is required"),
      username: Yup.string().required("Username is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
      role: Yup.string().required("Role is required"),
      images: Yup.mixed().nullable(),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const { confirmPassword, ...apiPayload } = values;
        await registerUser(apiPayload).unwrap();
        
        // Show success toast regardless of response structure
        setToastMessage("Registration successful! Redirecting to login...");
        setShowSuccessToast(true);
        
        // Wait 2 seconds then navigate
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (err) {
        console.error("Registration error:", err);
        const errorMessage = err?.data?.message || err?.message || "Registration failed. Please try again.";
        setToastMessage(errorMessage);
        setShowErrorToast(true);
        setStatus(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("images", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("images", null);
    setImagePreview(null);
  };

  // Debounced email validation
  useEffect(() => {
    const emailValue = formik.values.email;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!emailValue || !emailValue.includes("@")) {
      setEmailValidationStatus(null);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      checkEmail(emailValue);
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [formik.values.email, checkEmail]);

  // Update validation status based on API response
  useEffect(() => {
    if (emailCheckData !== undefined) {
      setEmailValidationStatus(
        emailCheckData.available || emailCheckData.success ? "valid" : "invalid"
      );
    }
  }, [emailCheckData]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Toast Notifications */}
      {(showSuccessToast || showErrorToast) && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          {showSuccessToast && (
            <SuccessToast
              message={toastMessage}
              onClose={() => setShowSuccessToast(false)}
              duration={2000}
            />
          )}
          {showErrorToast && (
            <ErrorToast
              message={toastMessage}
              onClose={() => setShowErrorToast(false)}
              duration={5000}
            />
          )}
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 py-5 px-6 flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold tracking-wide">
            User Registration
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={formik.handleSubmit}
          className="p-8 space-y-10 bg-gray-50"
        >
          {formik.status && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
              <p>{formik.status}</p>
            </div>
          )}

          {/* Role Selection Section */}
          <div className="mb-8">
            <h2 className="text-gray-800 font-semibold text-lg mb-4 pb-2 border-b-2 border-red-100">
              Account Type
            </h2>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="role"
              >
                Select Role
              </label>
              <select
                id="role"
                name="role"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.role}
                className="w-full px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-150"
              >
                <option value="NORMAL">Normal User</option>
                <option value="SELLER">Seller</option>
                <option value="TRAVELAGENCY">Travel Agency</option>
                <option value="HOST">Host</option>
              </select>
              <p className="text-gray-500 text-xs mt-2 italic">
                You can skip selecting a specific role and remain as a Normal User if you don't need any special permissions.
              </p>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="mb-8">
            <h2 className="text-gray-800 font-semibold text-lg mb-4 pb-2 border-b-2 border-red-100">
              Profile Picture
            </h2>
            <div className="flex flex-col items-center">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-40 h-40 rounded-full object-cover border-4 border-red-500 shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="w-40 h-40 rounded-full bg-gray-200 border-4 border-dashed border-gray-400 flex items-center justify-center">
                  <User size={60} className="text-gray-400" />
                </div>
              )}
              
              <label
                htmlFor="images"
                className="mt-4 cursor-pointer bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <Upload size={18} />
                {imagePreview ? "Change Photo" : "Upload Photo"}
              </label>
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-gray-500 text-xs mt-2">Optional - JPG, PNG, GIF (Max 5MB)</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-gray-800 font-semibold text-lg mb-4 pb-2 border-b-2 border-red-100">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="firstName"
                >
                  First Name*
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                  className={`w-full px-4 py-2.5 border ${
                    formik.touched.firstName && formik.errors.firstName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-red-400 focus:border-red-400"
                  } bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-150`}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="text-red-500 text-xs italic mt-1 font-medium">
                    {formik.errors.firstName}
                  </p>
                )}
              </div>

              {/* Middle Name */}
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="middleName"
                >
                  Middle Name
                </label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.middleName}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-gray-50 transition-all duration-150"
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="lastName"
                >
                  Last Name*
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                  className={`w-full px-4 py-2.5 border ${
                    formik.touched.lastName && formik.errors.lastName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-red-400 focus:border-red-400"
                  } bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-150`}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="text-red-500 text-xs italic mt-1 font-medium">
                    {formik.errors.lastName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email*
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={`w-full px-4 py-2.5 border ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : emailValidationStatus === "invalid"
                        ? "border-red-500 focus:ring-red-500"
                        : emailValidationStatus === "valid"
                        ? "border-green-500 focus:ring-green-500"
                        : "border-gray-300 focus:ring-red-400 focus:border-red-400"
                    } bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-150`}
                  />
                  {isCheckingEmail && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                    </div>
                  )}
                  {!isCheckingEmail && emailValidationStatus === "valid" && (
                    <div className="absolute right-3 top-3 text-green-500">
                      ✓
                    </div>
                  )}
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs italic mt-1 font-medium">
                    {formik.errors.email}
                  </p>
                )}
                {!isCheckingEmail && emailValidationStatus === "invalid" && (
                  <p className="text-red-500 text-xs italic mt-1 font-medium">
                    Email is already taken
                  </p>
                )}
                {!isCheckingEmail && emailValidationStatus === "valid" && (
                  <p className="text-green-600 text-xs italic mt-1 font-medium">
                    Email is available
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="md:col-span-2">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="gender"
                >
                  Gender*
                </label>
                <select
                  id="gender"
                  name="gender"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.gender}
                  className={`w-full px-4 py-2.5 border ${
                    formik.touched.gender && formik.errors.gender
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-red-400 focus:border-red-400"
                  } bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-150`}
                >
                  <option value="" label="Select gender" />
                  <option value="MALE" label="Male" />
                  <option value="FEMALE" label="Female" />
                  <option value="OTHERS" label="Other" />
                </select>
                {formik.touched.gender && formik.errors.gender && (
                  <p className="text-red-500 text-xs italic mt-1 font-medium">
                    {formik.errors.gender}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="md:col-span-2">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="phone"
                >
                  Phone*
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  className={`w-full px-4 py-2.5 border ${
                    formik.touched.phone && formik.errors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-red-400 focus:border-red-400"
                  } bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-150`}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-red-500 text-xs italic mt-1 font-medium">
                    {formik.errors.phone}
                  </p>
                )}
              </div>

              {/* Permanent Address */}
              <div className="md:col-span-2">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="permanentAddress"
                >
                  Permanent Address
                </label>
                <input
                  type="text"
                  id="permanentAddress"
                  name="permanentAddress"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.permanentAddress}
                  placeholder="Enter permanent address"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-gray-50 transition-all duration-150"
                />
              </div>

              {/* Temporary Address */}
              <div className="md:col-span-2">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="temporaryAddress"
                >
                  Temporary Address
                </label>
                <input
                  type="text"
                  id="temporaryAddress"
                  name="temporaryAddress"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.temporaryAddress}
                  placeholder="Enter temporary address"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-gray-50 transition-all duration-150"
                />
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="mb-8">
            <h2 className="text-gray-800 font-semibold text-lg mb-4 pb-2 border-b-2 border-red-100">
              Account Information
            </h2>
            <div className="space-y-6">
              {/* Username */}
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="username"
                >
                  Username*
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  className={`w-full px-4 py-2.5 border ${
                    formik.touched.username && formik.errors.username
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-red-400 focus:border-red-400"
                  } bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-150`}
                />
                {formik.touched.username && formik.errors.username && (
                  <p className="text-red-500 text-xs italic mt-1 font-medium">
                    {formik.errors.username}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password*
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={`w-full px-4 py-2.5 border ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-red-400 focus:border-red-400"
                  } bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-150`}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-xs italic mt-1 font-medium">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm Password*
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  className={`w-full px-4 py-2.5 border ${
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-red-400 focus:border-red-400"
                  } bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-150`}
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="text-red-500 text-xs italic mt-1 font-medium">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading || formik.isSubmitting}
              className={`bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold py-2.5 px-8 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition-all duration-200 ${
                isLoading || formik.isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading || formik.isSubmitting ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;