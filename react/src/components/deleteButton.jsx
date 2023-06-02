import { useNavigate } from "react-router-dom";
import axios from "axios";
import authHeader from "../services/authServices";
const DeleteButton = ({type,slug,id}) => {
  const navigate = useNavigate();
  const handleDelete = async() => {
    try {
      const response = await axios.delete(
        import.meta.env.VITE_API_URL + "articles/"+slug,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader(),
            // "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
          },
        }
      );
      navigate("/");
    } catch (error) {
      //console.log(error);
      //console.log(error.response.status);
      if(error.response.status == 401){
        navigate("/login");
      }else{
        navigate("/");
      }
  }
}
  return (
    <div>
      <button
        type="button"
        onClick={() => handleDelete()}
        className={`text-red-700 hover:bg-red-500 flex justify-center py-2 focus:ring-4 focus:ring-blue-300 focus:bg-red-600 font-medium rounded-lg text-xs px-3  border border-red `}>
          Delete {type}
      </button>
    </div>
  );
};

export default DeleteButton;
