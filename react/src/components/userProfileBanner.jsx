import { useState, useEffect } from "react";
import axios from "axios";
import EditProfileButton from "./editProfileButton";
import FollowButton from "./followButton";
import authHeader, { checkUserIsAuthor } from "../services/authServices";
import { useNavigate } from "react-router-dom";
const UserProfileBanner = ({urlUsername}) => {
    const navigate = useNavigate();
    const [image, setImage] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [isFollowing,setIsFollowing] = useState(false);
    const [isSamePerson,setIsSamePerson] = useState(false);
    useEffect(() => {
        async function fetchProfile() {
          try {
            const response = await axios.get(
              import.meta.env.VITE_API_URL + "profiles/"+urlUsername,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: authHeader(),
                  // "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
                },
              }
            );
            // Set State
            //console.log(response.data.profile);
            if(response.data.profile.image !== null){
              setImage(response.data.profile.image);
            }
            if(response.data.profile.bio !== null){
              setBio(response.data.profile.bio);
            }
              setUsername(response.data.profile.username);
              setIsSamePerson(checkUserIsAuthor(response.data.profile.username));
              setIsFollowing(response.data.profile.following === "true");
          } catch (error) {
            //console.log(error.response.status);
            if(error.response.status == 400){
              navigate("/");
            }
            else if(error.response.status == 401){
              navigate("/login");
            }else{
              //console.log(error.response.data.body[0].message);
            }
        }
        }
        fetchProfile();
    },[urlUsername]);
    return (
      <div className=" w-full text-center bg-[#f3f3f3] py-4 ">
        <div className=" container mx-auto w-1/2">
        <img
            className="w-24 h-24 rounded-full mx-auto"
            src={image}
            alt=""
          />
        <div className=" text-3xl font-TWeb drop-shadow-lg my-4">{username}</div>
        <div className=" text-lg my-4 drop-shadow-md text-slate-700">
          {bio}
        </div>
        <div className="flex flex-row-reverse mb-6 ">
        {isSamePerson ? <EditProfileButton/> : <FollowButton urlUsername={username} following={isFollowing}/>}
        </div>
        </div>
        
      </div>
    );
  };
  
  export default UserProfileBanner;