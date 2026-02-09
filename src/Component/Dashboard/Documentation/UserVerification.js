import { useState } from "react";
import DocumentationPage from "./UserDocumentation";

/* =======================
   MAIN CONTAINER
======================= */

const UserVerification = ({ userRole, status, rejectionReason }) => {
  const [showDocumentation, setShowDocumentation] = useState(false);

  if (showDocumentation) {
    return <DocumentationPage userRole={userRole} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <StatusScreen
          status={status}
          userRole={userRole}
          rejectionReason={rejectionReason}
          onResubmit={() => setShowDocumentation(true)}
        />
      </div>
    </div>
  );
};

export default UserVerification;

/* =======================
   STATUS SWITCH
======================= */

const StatusScreen = ({ status, userRole, rejectionReason, onResubmit }) => {
  switch (status) {
    case "PENDING":
      return <PendingUI userRole={userRole} onUpload={onResubmit} />;

    case "REJECTED":
      return (
        <RejectedUI
          userRole={userRole}
          reason={rejectionReason}
          onResubmit={onResubmit}
        />
      );

    case "APPROVED":
      return <ApprovedUI userRole={userRole} />;

    case "SUBMITTED":
      return <SubmittedUI userRole={userRole} />;

    default:
      return null;
  }
};

/* =======================
   PENDING
======================= */

const PendingUI = ({ userRole, onUpload }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      {/* Main Card */}
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-4xl">📤</span>
        </div>

        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Verification Pending
        </h2>

        <p className="text-gray-600 mb-2">
          You haven’t uploaded your verification documents yet.
        </p>

        <p className="text-sm text-gray-500 mb-8">
          To start using your account, please complete the document upload
          process.
        </p>

        <div className="flex flex-col items-center gap-6">
          <span className="inline-block bg-yellow-100 text-yellow-700 px-5 py-2 rounded-full text-sm font-medium">
            Action Required
          </span>

          <button
            onClick={onUpload}
            className="w-full max-w-md bg-red-500 text-white py-4 rounded-xl text-base font-medium hover:bg-red-600 transition"
          >
            Upload Documents Now
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar userRole={userRole} status="Pending" color="text-yellow-600" />
    </div>
  );
};

/* =======================
   REJECTED
======================= */

const RejectedUI = ({ userRole, reason, onResubmit }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-red-600 text-2xl font-bold">✕</span>
        </div>

        <h2 className="text-2xl font-semibold mb-2">Verification Rejected</h2>

        <p className="text-gray-600 mb-6">
          Unfortunately, your verification request has been rejected.
        </p>

        <span className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-medium mb-6">
          Rejected
        </span>

        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-left text-sm text-red-700 mb-6">
          <p className="font-semibold mb-1">Reason for Rejection:</p>
          <p>{reason}</p>
        </div>

        <button
          onClick={onResubmit}
          className="w-full bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition"
        >
          Resubmit Documents
        </button>
      </div>

      <Sidebar userRole={userRole} status="Rejected" color="text-red-600" />
    </div>
  );
};

/* =======================
   APPROVED
======================= */

const ApprovedUI = ({ userRole }) => {
  const getButtonText = () => {
    if (userRole === "SELLER") return "Add a Product";
    if (userRole === "HOST") return "Create Accommodation";
    if (userRole === "TRAVELAGENCY") return "Create Tour Package";
    return "Get Started";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-green-600 text-2xl font-bold">✓</span>
        </div>

        <h2 className="text-2xl font-semibold mb-3">
          Account Verified Successfully!
        </h2>

        <p className="text-gray-600 mb-6">
          Congratulations! Your account has been verified. You now have full
          access to all features.
        </p>

        <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
          Verified
        </span>

        <button className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition">
          {getButtonText()}
        </button>
      </div>

      <Sidebar userRole={userRole} status="Approved" color="text-green-600" />
    </div>
  );
};
/* =======================
   SUBMITTED
======================= */

const SubmittedUI = ({ userRole }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      <div className="bg-white rounded-2xl p-10 shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-blue-600 text-xl">🕒</span>
          </div>

          <h2 className="text-2xl font-semibold mb-3">
            Documents Under Review
          </h2>

          <p className="text-gray-600 mb-4">
            Our verification team is currently reviewing your documents.
          </p>

          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-8">
            In Progress
          </span>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Verification Process</h3>

          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <span className="text-green-600">✓</span>
              Documents Submitted
            </li>

            <li className="flex gap-3 text-blue-600">
              <span>🕒</span>
              Under Review (2–3 business days)
            </li>

            <li className="flex gap-3 text-gray-400">
              <span>○</span>
              Verification Complete
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-5">
        <Sidebar userRole={userRole} status="Submitted" color="text-blue-600" />

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm">
          <h4 className="font-semibold text-blue-900 mb-2">
            What Happens Next?
          </h4>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Our team reviews your documents</li>
            <li>Decision in 2–3 business days</li>
            <li>Full access after approval</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

/* =======================
   SIDEBAR
======================= */

const Sidebar = ({ userRole, status, color }) => {
  const getRoleDisplayName = (role) => {
    switch (role) {
      case "SELLER":
        return "Product Owner";
      case "HOST":
        return "Homestay/Hotel Owner";
      case "TRAVELAGENCY":
        return "Travel Agency";
      default:
        return "User";
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h4 className="font-semibold mb-3">Account Information</h4>

        <p className="text-sm text-gray-600">Account Type</p>
        <p className="font-medium mb-3">{getRoleDisplayName(userRole)}</p>

        <p className="text-sm text-gray-600">Status</p>
        <p className={`font-medium ${color}`}>{status}</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-5">
        <h4 className="font-semibold mb-2">Need Help?</h4>
        <p className="text-sm text-gray-600 mb-3">
          Have questions about the verification process?
        </p>
        <button className="w-full bg-gray-200 py-2 rounded-lg text-sm font-medium">
          Contact Support
        </button>
      </div>
    </div>
  );
};
