import { deleteLocalStorage } from "../services/authServices";
import { useNavigate } from "react-router-dom";
const LogoutButton = () => {
  const navigate = useNavigate();
 const handleLogout = () =>{
  deleteLocalStorage();
  navigate("/");
 } 
  return (
    <div className=" w-full max-w-screen-sm mx-auto p-3 border-t border-gray-200">
      <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
      onClick={() => handleLogout()}>
        Logout
      </button>

    </div>
  );
};

export default LogoutButton;
