import { useNavigate } from "react-router-dom";
const EditProfileButton = () => {
  const navigate = useNavigate();
  const handleEditProfile = () => {
    navigate("/settings")
  }
  return (
    <div>
      <button
        type="button"
        onClick={() => handleEditProfile()}
        className={`text-slate-800 hover:bg-slate-500 flex justify-center py-2 focus:ring-4 focus:ring-blue-300 focus:bg-slate-600 font-medium rounded-lg text-xs px-3  border border-black `}>
          Edit Profile Settings
      </button>
    </div>
  );
};

export default EditProfileButton;
