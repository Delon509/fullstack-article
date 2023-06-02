import LogoutButton from "../components/logoutButton";
import SettingForm from "../components/settingForm";
import UserNavbar from "../components/userNavbar";

const SettingsPage = () => {
  return (
    <div>
      <UserNavbar/>
      <SettingForm/>
      <LogoutButton/>
    </div>
  );
};

export default SettingsPage;
