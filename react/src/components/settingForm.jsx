
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authHeader, { checkToken, storeNewToken, updateLocalStorage } from "../services/authServices";

const SettingForm = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "image") {
      setImage(value);
    } else if (id === "username") {
      setUsername(value);
    }else if (id === "bio") {
      setBio(value);
    }else if (id === "email") {
      setEmail(value);
    }else if (id === "password") {
      setPassword(value);
    }
  };
  useEffect(() => {
    // Get Current User Settings
    checkToken();
    async function fetchUserSettings() {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "user",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader(),
              // "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
            },
          }
        );
        // Set State
        //console.log(response.data.user);
        if(response.data.user.profile.image === null){
          setImage("");
        }else{
          setImage(response.data.user.profile.image);
        }
        if(response.data.user.profile.bio === null){
          setBio("");
        }else{
          setBio(response.data.user.profile.bio);
        }
          setUsername(response.data.user.username);
          setEmail(response.data.user.email);
      } catch (error) {
        //console.log(error.response.status);
        if(error.response.status == 401){
          navigate("/login");
        }else{
          //console.log(error.response.data.body[0].message);
        setErrorMessage(error.response.data.body[0].message);
        }
    }
    }
    fetchUserSettings();
},[]);
  const handleUpdateUserSubmit = async () => {
    //console.log(image,username,bio,email,password);
    //console.log("Sending Update User Request");
    checkToken();
    try {
      const response = await axios.put(
        import.meta.env.VITE_API_URL + "user",
        { image,username,bio,email,password },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader(),
            // "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
          },
        }
      );
      // Update LocalStorage
      //console.log("Updating LocalStorage");
      //console.log(response.data.user.username);
      updateLocalStorage(response.data.user.username, response.data.user.email,response.data.user.profile.image, response.data.user.profile.bio)
      storeNewToken(response.data.user.token);
      navigate("/profile/"+response.data.user.username);
    } catch (error) {
      //console.log(error.response.status);
      if(error.response.status == 401){
        navigate("/login");
      }else{
        //console.log(error.response.data.body[0].message);
      setErrorMessage(error.response.data.body[0].message);
      }
      
    }
  };

  return (
    <>
      <div className=" w-full max-w-screen-sm mx-auto">
      <div className=" text-center mb-4 ">
        <div className=" text-4xl mb-2">Your Settings</div>
        
      </div>
        <div className="mb-6">
          <input
            type=""
            id="image"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="URL of profile picture"
            value={image}
            onChange={(e) => handleInputChange(e)}
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="username"
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Username"
            value={username}
            onChange={(e) => handleInputChange(e)}
            required
          />
          <p
            className={` mt-2 text-sm text-red-600 dark:text-red-500 ${
              errorMessage === "Username can't be empty or null" ? "" : "hidden"
            }`}
          >
            <span className="font-medium">Oops!</span> Username can not be
            empty!
          </p>
          <p
            className={` mt-2 text-sm text-red-600 dark:text-red-500 ${
              errorMessage === "Username already exist" ? "" : "hidden"
            }`}
          >
            <span className="font-medium">Oops!</span> Username already exist!
          </p>
        </div>
        <div className="mb-6">
<textarea id="bio" rows="6" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Short bio about you 
" onChange={(e) => handleInputChange(e)} value={bio}></textarea>
        </div>
        <div className="mb-6">
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => handleInputChange(e)}
            required
          />
          <p
            className={` mt-2 text-sm text-red-600 dark:text-red-500 ${
              errorMessage === "Email can't be empty or null" ? "" : "hidden"
            }`}
          >
            <span className="font-medium">Oops!</span> Email can not be
            empty!
          </p>
          <p
            className={` mt-2 text-sm text-red-600 dark:text-red-500 ${
              errorMessage === "Email already exist" ? "" : "hidden"
            }`}
          >
            <span className="font-medium">Oops!</span> Email already exist!
          </p>
        </div>
        <div className="mb-6">
          <input
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="New Password"
            onChange={(e) => handleInputChange(e)}
            required
          />
        </div>
        <div className="flex flex-row-reverse mb-6">
        <button
          type="submit"
          className="mr-0 ml-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => handleUpdateUserSubmit()}
        >
          Update Settings
        </button>
        </div>
      </div>
    </>
  );
};

export default SettingForm;

