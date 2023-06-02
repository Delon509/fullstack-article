import { FaHeart } from "react-icons/fa";
import axios from "axios";
import authHeader, { checkToken } from "../services/authServices";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
const FavoriteButton = ({ slug, favorited, favoriteCount }) => {
  const [count, setCount] = useState(favoriteCount);
  const [allowFav, setAllowFav] = useState(!favorited);
  const navigate = useNavigate();

  useEffect(()=>{
    setAllowFav(!favorited);
    setCount(favoriteCount);
  },[])
  const handleFavorite = async () => {
    checkToken();
    if (allowFav === false) {
      //start unfavorite action
      //console.log("start Unfav");
      try {
        const response = await axios.delete(
          import.meta.env.VITE_API_URL + "articles/" + slug + "/favorite",
          {
            headers: {
              Authorization: authHeader(),
              "Content-Type": "application/json",
              // "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
            },
          }
        );
        setCount(response.data.article.favoritesCount);
        //console.log(response.data.article.favoritesCount);
        //console.log(response.data.article.favorited);
        setAllowFav(true);
      } catch (error) {
        //console.log(error);
        // navigate("/login");
        if(error.response.data.status == 401){
          navigate("/login");
        }
      }
    } else {
      //start favorite action
      //console.log("start Fav");
      try {
        const response = await axios.post(
          import.meta.env.VITE_API_URL + "articles/" + slug + "/favorite",
          {},
          {
            headers: {
              Authorization: authHeader(),
              "Content-Type": "application/json",
              // "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
            },
          }
        );
        setCount(response.data.article.favoritesCount);
        //console.log(response.data.article.favoritesCount);
        //console.log(response.data.article.favorited);
        setAllowFav(false);
      } catch (error) {
        //console.log(error);
        // navigate("/login");
        //console.log(error.response.data.status)
        if(error.response.data.status == 401){
          navigate("/login");
        }
      }
    }
  };
  return (
    <div className="group">
      <button
        type="button"
        onClick={() => handleFavorite()}
        className={`group-hover:text-white group-hover:bg-green-400 flex justify-center py-2 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3  border border-green-400 ${
          allowFav 
            ? "text-green-400  bg-white":
            "text-white bg-green-400"
        }`}
      >
        <FaHeart
          className={` mr-1 group-hover:text-white ${
            allowFav  ? "text-green-400 ":"text-white"
          }`}
          size={16}
        />
        (
        {count}
        ) 
        {allowFav ? ` Favourite Article` : `Unfavourite Article`}
      </button>
    </div>
  );
};

export default FavoriteButton;
