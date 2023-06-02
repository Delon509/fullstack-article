import { checkUserIsAuthor } from "../services/authServices";
import { useNavigate,Link } from "react-router-dom";
import axios  from "axios";
import authHeader from "../services/authServices";

const Comment = ({slug,id,createdAt,body,authorName,image,updateCommentUI}) => {
  
    return (
      <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 ">
       <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
           <textarea id="comment" rows="4" readOnly  className="w-full px-0 text-sm text-black bg-white border-0 dark:bg-gray-800 focus:ring-0 " >{body}</textarea>
       </div>
       <div className="flex items-center justify-between px-3 py-2 border-t ">
       <div className="block">
        <Link to={`/profile/${authorName}`} className="flex">
          <img
            className="w-10 h-10 rounded-full mr-1"
            src={image}
            alt=""
          />
          <div className="text-base font-semibold leading-none text-gray-900 ">
            <Link to={`/profile/${authorName}` } className="block underline text-blue-400 hover:text-blue-500">
              {" "}
              {authorName}
            </Link>
            <div className="text-slate-400 text-sm">{createdAt}</div>
          </div>
        </Link>
      </div>
           <div className="flex pl-0 space-x-1 sm:pl-2">
           {checkUserIsAuthor(authorName) ? <button onClick={() => updateCommentUI(id)} 
           className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 0 hover:bg-red-800">
               Delete comment
           </button>: <div></div>}
           </div>
       </div>
   </div>
    );
  };
  
  export default Comment;