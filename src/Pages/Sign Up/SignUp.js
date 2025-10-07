// components/RegisterForm.js
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../Services/registerApiSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

const RegisterPage = () => {
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const navigate = useNavigate();

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
      role: "NORMAL", // ✅ Default role
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
      role: Yup.string().required("Role is required"), // still required, but defaulted
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const { confirmPassword, ...apiPayload } = values;
        const response = await registerUser(apiPayload).unwrap();
        if (response.success) {
          navigate("/login");
        }
      } catch (err) {
        setStatus(
          err.data?.message || "Registration failed. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
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
                      : "border-gray-300 focus:ring-red-400 focus:border-red-400"
                  } bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-150`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs italic mt-1 font-medium">
                    {formik.errors.email}
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
