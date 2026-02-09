import { useState, useMemo } from "react";
import {
  FiFilter,
  FiX,
  FiUser,
  FiCalendar,
  FiDownload,
  FiFileText,
} from "react-icons/fi";
import PaginationControls from "../../../PaginationControls";
import {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
} from "../../../../Services/userApiSlice";
import { useUpdateVerificationStatusMutation } from "../../../../Services/userVerification";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const roles = ["SELLER", "HOST", "TRAVELAGENCY"];

const UserContent = () => {
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [userToUpdate, setUserToUpdate] = useState(null);

  // Backend query (only page & limit)
  const queryParams = useMemo(() => ({ page, limit: 10 }), [page]);
  const { data, isLoading, refetch } = useGetAllUsersQuery(queryParams);

  // Fetch all users for counts (exclude NORMAL)
  const { data: countsData, refetch: refetchCounts } = useGetAllUsersQuery({
    page: 1,
    limit: 1000,
  });

  const { data: userData, isLoading: isUserLoading } = useGetUserByIdQuery(
    selectedUserId,
    { skip: !selectedUserId },
  );

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateVerificationStatusMutation();

  // =========================
  // CLIENT-SIDE FILTERING
  // =========================
  const allUsers = (countsData?.items || []).filter(
    (user) => user.role !== "NORMAL",
  );

  // Filtering
  const filteredUsers = allUsers
    .filter((user) => (role ? user.role === role : true))
    .filter((user) =>
      search
        ? user.username.toLowerCase().includes(search.toLowerCase())
        : true,
    )
    .filter((user) =>
      status === "ALL" ? true : user.verificationStatus === status,
    );

  // Sorting
  const sortedUsers = [...filteredUsers].sort((a, b) =>
    sort === "newest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt),
  );

  // Pagination
  const usersPerPage = 10;
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const paginatedUsers = sortedUsers.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage,
  );

  const meta = data?.meta;
  const currentPage = meta?.currentPage || 1;

  // Status counts
  const statusCounts = useMemo(() => {
    const list = countsData?.items || [];
    const filteredList = list.filter((u) => u.role !== "NORMAL");
    return {
      ALL: filteredList.length,
      PENDING: filteredList.filter((u) => u.verificationStatus === "PENDING")
        .length,
      SUBMITTED: filteredList.filter(
        (u) => u.verificationStatus === "SUBMITTED",
      ).length,
      APPROVED: filteredList.filter((u) => u.verificationStatus === "APPROVED")
        .length,
      REJECTED: filteredList.filter((u) => u.verificationStatus === "REJECTED")
        .length,
    };
  }, [countsData]);

  const statusTabs = [
    { key: "ALL", label: "All Users" },
    { key: "PENDING", label: "Pending Verification" },
    { key: "SUBMITTED", label: "Submitted" },
    { key: "APPROVED", label: "Verified" },
    { key: "REJECTED", label: "Rejected" },
  ];

  const handlePreviousPage = () => {
    if (currentPage > 1) setPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setPage(currentPage + 1);
  };

  const handlePageClick = (pageNumber) => setPage(pageNumber);

  const getFullName = (user) =>
    [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ");

  const getInitials = (user) => {
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  const getRoleColor = (role) => {
    const colors = {
      NORMAL: "text-blue-600",
      SELLER: "text-green-600",
      HOST: "text-purple-600",
      TRAVELAGENCY: "text-orange-600",
    };
    return colors[role] || "text-gray-600";
  };

  const getDocuments = (userData) => {
    const docs = [];
    const verificationDocs = userData.verificationDocuments || {};

    const docMap = {
      citizenshipFront: "Citizenship (Front)",
      citizenshipBack: "Citizenship (Back)",
      wardRecommendation: "Ward Recommendation",
      houseOwnershipProof: "House Ownership Proof",
      homestayRegistration: "Homestay Registration",
      companyRegistration: "Company Registration",
      panCertificate: "PAN Certificate",
      travelAgencyLicense: "Travel Agency License",
      bankGuarantee: "Bank Guarantee",
      officeAddressProof: "Office Address Proof",
    };

    Object.entries(docMap).forEach(([key, label]) => {
      if (verificationDocs[key]) {
        docs.push({ key, label, url: verificationDocs[key] });
      }
    });

    if (userData.paymentQrCode) {
      docs.push({
        key: "paymentQrCode",
        label: "Payment QR Code",
        url: userData.paymentQrCode,
      });
    }

    return docs;
  };

  const handleViewUser = (userId) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUserId(null);
  };

  const refreshData = () => {
    refetch();
    refetchCounts();
  };

  const handleApprove = async (userId) => {
    try {
      await updateStatus({ id: userId, status: "APPROVED" }).unwrap();
      alert("User approved successfully!");
      refreshData();
    } catch (error) {
      alert("Failed to approve user: " + (error.message || "Unknown error"));
    }
  };

  const handleReject = (userId) => {
    setUserToUpdate(userId);
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      await updateStatus({
        id: userToUpdate,
        status: "REJECTED",
        rejectionReason: rejectionReason.trim(),
      }).unwrap();
      alert("User rejected successfully!");
      setShowRejectModal(false);
      setRejectionReason("");
      setUserToUpdate(null);
      refreshData();
    } catch (error) {
      alert("Failed to reject user: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="mt-8 space-y-4">
      {/* STATUS TABS */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusTabs.map((tab) => {
          const isActive = status === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => {
                setStatus(tab.key);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition
                ${
                  isActive
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {tab.label}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs
                  ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }
                `}
              >
                {statusCounts[tab.key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search by username..."
          className="w-full px-4 py-2 border rounded-md"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset page
          }}
        />

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md bg-white sm:w-auto w-full"
        >
          <FiFilter />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md border">
          {/* Role filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Roles</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Sort by */}
          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="hidden md:block overflow-x-auto border rounded-md">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-center">Role</th>
              <th className="p-3 text-center">Registered</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  Loading users...
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {user.images ? (
                        <img
                          src={`${API_BASE_URL}${user.images}`}
                          alt={getFullName(user)}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                          {getInitials(user)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{getFullName(user)}</div>
                        <div className="text-xs text-gray-500">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="text-sm">{user.email}</div>
                    <div className="text-sm text-gray-600">{user.phone}</div>
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`font-semibold ${getRoleColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="p-3 text-center text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.verificationStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : user.verificationStatus === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.verificationStatus}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewUser(user.id)}
                        className="px-3 py-1.5 border rounded-md hover:bg-gray-50 flex items-center gap-1 text-sm"
                        title="View Details"
                      >
                        <FiUser size={14} />
                        View
                      </button>
                      {user.verificationStatus === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApprove(user.id)}
                            className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                            title="Approve"
                            disabled={isUpdating}
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => handleReject(user.id)}
                            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            title="Reject"
                            disabled={isUpdating}
                          >
                            ✕
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          handlePageClick={handlePageClick}
        />
      )}

      {/* USER DETAILS MODAL - New Design */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 p-4 flex items-center justify-between rounded-t-lg">
              <h2 className="text-lg font-semibold text-white">
                User Verification Details
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-white hover:bg-white/20 rounded-full p-1"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-5">
              {isUserLoading ? (
                <div className="text-center py-8">Loading user details...</div>
              ) : userData ? (
                <div className="space-y-5">
                  {/* User Profile */}
                  <div className="flex items-center gap-4">
                    {userData.images ? (
                      <img
                        src={`${API_BASE_URL}${userData.images}`}
                        alt={getFullName(userData)}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                        {getInitials(userData)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {getFullName(userData)}
                      </h3>
                      <p
                        className={`text-sm font-medium ${getRoleColor(userData.role)}`}
                      >
                        {userData.role}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userData.email} • {userData.phone}
                      </p>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FiUser size={16} />
                      <h4 className="font-semibold text-sm">
                        Personal Information
                      </h4>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date of Birth</span>
                        <span className="font-medium">
                          {userData.dateOfBirth || "10/12/1990"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender</span>
                        <span className="font-medium">
                          {userData.gender || "Male"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address</span>
                        <span className="font-medium text-right">
                          {userData.permanentAddress ||
                            "Pokhara Chitlai, Lalitpur"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Documents */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-sm">
                        Uploaded Documents ({getDocuments(userData).length})
                      </h4>
                    </div>

                    <div className="space-y-2">
                      {getDocuments(userData).length === 0 ? (
                        <div className="text-center py-6 text-gray-500 text-sm">
                          No documents available
                        </div>
                      ) : (
                        getDocuments(userData).map((doc, index) => (
                          <div
                            key={doc.key}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                                <FiFileText
                                  className="text-red-500"
                                  size={20}
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {doc.label}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Uploaded on{" "}
                                  {new Date(
                                    userData.createdAt,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <a
                              href={`${API_BASE_URL}${doc.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 text-sm flex items-center gap-1 hover:text-blue-600"
                            >
                              <FiDownload size={14} />
                              Download
                            </a>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Registration & Activity */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FiCalendar size={16} />
                      <h4 className="font-semibold text-sm">
                        Registration & Activity
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">
                          Joined Date
                        </p>
                        <p className="text-sm font-medium">
                          {new Date(userData.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(userData.createdAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Last Login</p>
                        <p className="text-sm font-medium">
                          {new Date(userData.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(userData.updatedAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {userData.rejectionReason && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                      <p className="text-xs font-semibold text-red-800 mb-1">
                        Rejection Reason:
                      </p>
                      <p className="text-sm text-red-700">
                        {userData.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2 justify-end">
                    {userData.verificationStatus === "SUBMITTED" && (
                      <>
                        <button
                          onClick={() => {
                            handleReject(userData.id);
                            handleCloseModal();
                          }}
                          className="px-6 py-2.5 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 font-medium text-sm"
                          disabled={isUpdating}
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            handleApprove(userData.id);
                            handleCloseModal();
                          }}
                          className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium text-sm"
                          disabled={isUpdating}
                        >
                          Approve
                        </button>
                      </>
                    )}

                    {userData.verificationStatus === "APPROVED" && (
                      <button
                        onClick={() => {
                          handleReject(userData.id);
                          handleCloseModal();
                        }}
                        className="px-6 py-2.5 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 font-medium text-sm"
                        disabled={isUpdating}
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  User not found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Reject User</h2>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                  setUserToUpdate(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows="4"
                  placeholder="Please provide a reason for rejection..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                    setUserToUpdate(null);
                  }}
                  className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
                  disabled={isUpdating || !rejectionReason.trim()}
                >
                  {isUpdating ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserContent;
