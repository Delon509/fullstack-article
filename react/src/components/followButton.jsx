import axios from "axios";
import authHeader, { checkToken } from "../services/authServices";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
const FollowButton = ({urlUsername,following}) => {
  const [allowFollow, setAllowFollow] = useState(true);
  const navigate = useNavigate();
  const [username,setUsername]= useState("");
  useEffect(()=>{
    //console.log("username in follow button is"+urlUsername);
    setUsername(urlUsername);
    //console.log("following is"+ (following).toString());
    //console.log("allowFollow in follow button is"+(!following).toString());
    setAllowFollow(!following);
  },[following,urlUsername])
  const handleFollow = async () => {
    checkToken();
    if (allowFollow === false) {
      //start unfollow action
      //console.log("start Unfollow");
      try {
        const response = await axios.delete(
          import.meta.env.VITE_API_URL + "profiles/" + username + "/follow",
          {
            headers: {
              Authorization: authHeader(),
              "Content-Type": "application/json",
              // "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
            },
          }
        );
        setAllowFollow(true);
      } catch (error) {
        //console.log(error);
        // navigate("/login");
        if(error.response.data.status == 401){
          navigate("/login");
        }
      }
    } else {
      //start favorite action
      //console.log("start Follow");
      try {
        const response = await axios.post(
          import.meta.env.VITE_API_URL + "profiles/" + username + "/follow",
          {},
          {
            headers: {
              Authorization: authHeader(),
              "Content-Type": "application/json",
              // "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
            },
          }
        );
        setAllowFollow(false);
      } catch (error) {
        //console.log(error);
        // navigate("/login");
        if(error.response.data.status == 401){
          navigate("/login");
        }
      }
    }
  };
  return (
    <div>
       allowFollow:{allowFollow}
      <button
        type="button"
        onClick={() => handleFollow()}
        className={`text-slate-800 flex justify-center py-2 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3  border border-black ${
          allowFollow === false
            ? " bg-slate-500  hover:bg-slate-600"
            : "  bg-white  hover:bg-slate-400"
        }`}
      >
        {allowFollow? <div>Follow {username}</div> : <div>Unfollow {username}</div>}
      </button>
    </div>
  );
};

export default FollowButton;
