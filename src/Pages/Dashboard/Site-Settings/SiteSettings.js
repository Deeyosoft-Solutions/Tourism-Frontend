import SettingsContent from '../../../Component/Dashboard/Admin-Dashboard/SiteSettings/SettingContent'
import SideBar from '../../../Component/Dashboard/SideBar';
import Header from '../../../Component/Dashboard/Header';

const SiteSettings = () => {
  return (
    <div className="flex h-full">
      <SideBar />
      <div className="flex-1 px-4">
        <Header />
        <SettingsContent />
      </div>
      
    </div>
  )
}

export default SiteSettings
