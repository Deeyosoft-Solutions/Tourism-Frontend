import Header from "../../../Component/Dashboard/Header";
import SideBar from "../../../Component/Dashboard/SideBar";
import UserContent from './../../../Component/Dashboard/Admin-Dashboard/UserManagement/UserContent';

const UserManagement = () => {
  return (
    <div className="flex h-full">
      <SideBar />
      <div className="flex-1 px-4">
        <Header />
        <UserContent />
      </div>
    </div>
  );
};

export default UserManagement;
