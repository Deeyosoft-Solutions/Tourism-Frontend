import { useState, useMemo } from "react";
import {
  useUploadVerificationDocumentsMutation,
  useGetVerificationRequirementsByRoleQuery,
} from "../../../Services/userVerification";
import { useFetchUserProfileQuery } from "../../../Services/userApiSlice";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const DOC_LABELS = {
  paymentQrCode: "Payment QR Code",
  citizenshipFront: "Citizenship Certificate (Front)",
  citizenshipBack: "Citizenship Certificate (Back)",
  wardRecommendation: "Ward Recommendation Letter",
  houseOwnershipProof: "House Ownership Proof",
  homestayRegistration: "Homestay Registration",
  companyRegistration: "Company Registration",
  panCertificate: "PAN Certificate",
  travelAgencyLicense: "Travel Agency License",
  bankGuarantee: "Bank Guarantee",
  officeAddressProof: "Office Address Proof",
};

const DOC_NOTES = {
  paymentQrCode: "भुक्तानी QR कोड",
  citizenshipFront: "तपाईंको नागरिकता प्रमाणपत्रको अगाडिको भागको स्पष्ट तस्वीर",
  citizenshipBack: "तपाईंको नागरिकता प्रमाणपत्रको पछाडिको भागको स्पष्ट तस्वीर",
  wardRecommendation: "वडा सिफारिस पत्र",
  houseOwnershipProof: "घर स्वामित्व प्रमाण",
  homestayRegistration: "होमस्टे दर्ता प्रमाणपत्र",
  companyRegistration: "कम्पनी दर्ता प्रमाणपत्र",
  panCertificate: "प्यान प्रमाणपत्र",
  travelAgencyLicense: "यात्रा एजेन्सी इजाजतपत्र",
  bankGuarantee: "बैंक ग्यारेन्टी",
  officeAddressProof: "कार्यालय ठेगाना प्रमाण",
};

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

// Image Modal Component
const ImageModal = ({ src, alt, onClose }) => {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-6xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300 transition-colors"
        >
          ✕
        </button>
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

const DocumentationPage = ({ userRole = "SELLER" }) => {
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [modalImage, setModalImage] = useState(null);

  // Fetch user profile to get user ID
  const { data: userProfile, refetch: refetchProfile } = useFetchUserProfileQuery();
  const userId = userProfile?.id || userProfile?._id;

  // Fetch verification requirements based on role
  const {
    data: requirements,
    isLoading: isLoadingRequirements,
    error: requirementsError,
  } = useGetVerificationRequirementsByRoleQuery(userRole);

  const [uploadVerificationDocuments, { isLoading, isSuccess, error }] =
    useUploadVerificationDocumentsMutation();

  // Get required documents from API response
  const requiredDocuments = useMemo(() => {
    return requirements?.requiredDocuments || [];
  }, [requirements]);

  // Get existing documents from user profile or requirements
  const existingDocuments = useMemo(() => {
    return (
      userProfile?.verificationDocuments ||
      requirements?.existingDocuments ||
      {}
    );
  }, [userProfile, requirements]);

  // Helper function to get full image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    // If it's already a full URL, return as is
    if (path.startsWith('http')) return path;
    // Otherwise, prepend the API base URL
    return `${API_BASE_URL}${path}`;
  };

  const uploadedCount = useMemo(() => {
    // Count both new files and existing documents
    const newFilesCount = Object.keys(files).length;
    const existingDocsCount = requiredDocuments.filter(
      (doc) => !files[doc] && existingDocuments[doc],
    ).length;
    return newFilesCount + existingDocsCount;
  }, [files, existingDocuments, requiredDocuments]);

  const totalCount = requiredDocuments.length;

  const handleFileChange = (key, file) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert("Only JPG, PNG or PDF files are allowed");
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert("File size must not exceed 5MB");
      return;
    }

    setFiles((prev) => ({ ...prev, [key]: file }));

    // Create preview ONLY for images
    if (file.type.startsWith("image/")) {
      setPreviews((prev) => ({
        ...prev,
        [key]: URL.createObjectURL(file),
      }));
    } else {
      setPreviews((prev) => ({ ...prev, [key]: null }));
    }
  };

  const handleRemoveFile = (key) => {
    setFiles((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

    setPreviews((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleImageClick = (imageUrl, label) => {
    setModalImage({ src: imageUrl, alt: label });
  };

  const handleSubmit = async () => {
    // Allow submission if at least one document is uploaded
    if (Object.keys(files).length === 0) {
      alert("Please upload at least one document to update");
      return;
    }

    const formData = new FormData();
    formData.append("role", userRole);
    formData.append("requiresVerification", true);

    if (userId) {
      formData.append("userId", userId);
    }

    Object.entries(files).forEach(([key, file]) => {
      formData.append(key, file);
    });

    try {
      await uploadVerificationDocuments(formData).unwrap();
      await refetchProfile(); // Refetch profile to get updated documents
      alert("Documents uploaded successfully");
      // Clear the new files after successful upload
      setFiles({});
      setPreviews({});
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoadingRequirements) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl p-8 shadow-sm text-center">
          <p className="text-gray-600">Loading requirements...</p>
        </div>
      </div>
    );
  }

  if (requirementsError) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-600">
            Failed to load verification requirements. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Image Modal */}
      {modalImage && (
        <ImageModal
          src={modalImage.src}
          alt={modalImage.alt}
          onClose={() => setModalImage(null)}
        />
      )}

      {/* Header */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Upload Required Documents</h2>
            <p className="text-sm text-gray-600 mt-1">
              {requirements?.description}
            </p>
          </div>
          <span className="text-red-500 font-semibold">
            {uploadedCount}/{totalCount}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded mt-3">
          <div
            className="h-2 bg-red-500 rounded transition-all duration-300"
            style={{
              width: `${totalCount > 0 ? (uploadedCount / totalCount) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm">
        <p className="font-medium mb-2">Important Guidelines:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>All documents must be clear and readable</li>
          <li>File size should not exceed 5MB per document</li>
          <li>Accepted formats: JPG, PNG, PDF</li>
          <li>Ensure all information and edges are visible</li>
          <li>
            You can update individual documents - submission is allowed with at
            least one document
          </li>
        </ul>
      </div>

      {/* Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requiredDocuments.map((key) => {
          const hasNewFile = !!files[key];
          const hasExistingDoc = !!existingDocuments[key];
          
          // Use preview for new files, or full URL for existing documents
          const displayUrl = hasNewFile
            ? previews[key]
            : hasExistingDoc
              ? getImageUrl(existingDocuments[key])
              : null;
              
          const isImage = hasNewFile
            ? files[key]?.type.startsWith("image/")
            : hasExistingDoc
              ? !existingDocuments[key]?.endsWith(".pdf")
              : false;

          return (
            <div
              key={key}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">
                    {DOC_LABELS[key] || key}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {DOC_NOTES[key] || ""}
                  </p>
                </div>

                {(hasNewFile || hasExistingDoc) && (
                  <span className="text-green-600 text-base font-semibold">
                    ✓
                  </span>
                )}
              </div>

              <div className="relative border-2 border-dashed rounded-lg h-44 flex items-center justify-center hover:border-red-400 transition-colors">
                {!hasNewFile && !hasExistingDoc ? (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-sm text-gray-500">
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleFileChange(key, e.target.files[0])}
                    />
                    <span>Click to upload</span>
                    <span className="text-xs">(Max 5MB)</span>
                  </label>
                ) : (
                  <>
                    {/* IMAGE PREVIEW/DISPLAY */}
                    {isImage && displayUrl ? (
                      <img
                        src={displayUrl}
                        alt={DOC_LABELS[key]}
                        className="w-full h-full object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() =>
                          handleImageClick(displayUrl, DOC_LABELS[key])
                        }
                      />
                    ) : (
                      /* PDF UI */
                      <div className="text-sm text-gray-700 flex flex-col items-center">
                        <span className="font-medium">PDF Uploaded</span>
                        <span className="text-xs text-gray-500">
                          {hasNewFile
                            ? files[key]?.name
                            : existingDocuments[key]?.split("/").pop() ||
                              "Document"}
                        </span>
                      </div>
                    )}

                    {/* REPLACE/REMOVE BUTTON */}
                    {hasNewFile ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(key)}
                        className="absolute top-2 right-2 bg-white border border-red-500 text-red-500 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        title="Remove new file"
                      >
                        ×
                      </button>
                    ) : (
                      <label className="absolute top-2 right-2 bg-white border border-blue-500 text-blue-500 rounded px-2 py-1 text-xs cursor-pointer hover:bg-blue-500 hover:text-white transition-colors">
                        <input
                          type="file"
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) =>
                            handleFileChange(key, e.target.files[0])
                          }
                        />
                        Replace
                      </label>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isLoading || Object.keys(files).length === 0}
          className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
        >
          {isLoading ? "Uploading..." : "Submit Documents"}
        </button>
      </div>

      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm">
            ✓ Verification submitted successfully.
          </p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">
            Failed to upload documents. Please try again.
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentationPage;