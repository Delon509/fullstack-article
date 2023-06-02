import { getCurrentUserImage } from "../services/authServices";
import { useNavigate,Link } from "react-router-dom";
import axios  from "axios";
import authHeader from "../services/authServices";
import { useState } from "react";

const CommentBox = ({updateCommentUI,providedBody,setProvidedBody}) => {
  
    return (
      <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 ">
       <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
           <textarea value={providedBody} id="body" rows="4" onChange={(e) => setProvidedBody(e.target.value)}  className="w-full px-0 text-sm text-black bg-white border-0 dark:bg-gray-800 focus:ring-0  "placeholder="Write a comment..." ></textarea>
       </div>
       <div className="flex items-center justify-between px-3 py-2 border-t ">
       <div className="block">
          <img
            className="w-10 h-10 rounded-full mr-1"
            src={getCurrentUserImage()}
            alt=""
          />
          
      </div>
           <div className="flex pl-0 space-x-1 sm:pl-2">
           <button onClick={() => {updateCommentUI(providedBody);}}
            
           className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
               Post comment
           </button>
           </div>
       </div>
   </div>
    );
  };
  
  export default CommentBox;