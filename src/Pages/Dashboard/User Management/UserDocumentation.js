import DocumentationPage from "../../../Component/Dashboard/Documentation/UserDocumentation";
import Header from "../../../Component/Dashboard/Header";
import SideBar from "../../../Component/Dashboard/SideBar";
import { useFetchUserProfileQuery } from "../../../Services/userApiSlice";

const UserDocumentation = () => {
  const { data: userProfile, isLoading, error } = useFetchUserProfileQuery();

  if (isLoading) {
    return (
      <div className="flex h-full">
        <SideBar />
        <div className="flex-1 px-4">
          <Header />
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-600">Loading user profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userProfile?.role) {
    return (
      <div className="flex h-full">
        <SideBar />
        <div className="flex-1 px-4">
          <Header />
          <div className="flex items-center justify-center h-64">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600">
                Failed to load user profile. Please try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <SideBar />
      <div className="flex-1 px-4">
        <Header />
        <DocumentationPage userRole={userProfile.role} />
      </div>
    </div>
  );
};

export default UserDocumentation;