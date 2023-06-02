import { Link } from "react-router-dom";
import FollowButton from "./followButton";
import FavoriteButton from "./favoriteButton";
import DeleteButton from "./deleteButton";
import EditArticleButton from "./editArticleButton";
const UserView = ({authorName,following,favorited,faCount,isSamePerson,createdAt,image,slug}) => {

    return (
      <div className="">
        <div className="flex">
        <Link to={`/profile/${authorName}`} >
          <img
            className="w-10 h-10 rounded-full mr-1"
            src={image}
            alt=""
          />
          </Link>
          <div className="text-base font-semibold leading-none text-gray-900 dark:text-white mr-4">
            <Link to={`/profile/${authorName}` } className="underline text-blue-400 hover:text-blue-500">
              {" "}
              {authorName}
            </Link>
            <p className=" text-slate-300 text-sm">{createdAt}</p>
          </div>
        {isSamePerson ? <div className="flex"><EditArticleButton slug={slug}/> <DeleteButton type="article" slug={slug}/> </div> 
        : <div className="flex space-x-2"> <FollowButton urlUsername={authorName} following={following}/> <FavoriteButton slug={slug} favorited={favorited} favoriteCount={faCount}/> </div>}
        </div>
      </div>
    );
  };
  
  export default UserView;