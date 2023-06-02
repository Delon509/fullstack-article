
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authHeader, { checkToken } from "../services/authServices";

const CreateArticleForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "title") {
      setTitle(value);
    } else if (id === "description") {
      setDescription(value);
    }else if (id === "body") {
      setBody(value);
    }else if (id === "tags") {
      setTags(value);
    }
  };
  const handleCreateArticleSubmit = async () => {
    //console.log(title,description,body,tags);
    //console.log("Sending Create Article Request");
    const tagList = tags.toLowerCase().split(",");
    checkToken();
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "articles",
        { title,description,body,tagList },
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
        <div className="mb-6">
          <input
            type="title"
            id="title"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Article Title"
            onChange={(e) => handleInputChange(e)}
            required
          />
          <p
            className={` mt-2 text-sm text-red-600 dark:text-red-500 ${
              errorMessage === "Title can't be empty or null" ? "" : "hidden"
            }`}
          >
            <span className="font-medium">Oops!</span> Title can not be empty!
          </p>
          <p
            className={` mt-2 text-sm text-red-600 dark:text-red-500 ${
              errorMessage === "Slug already exist" ? "" : "hidden"
            }`}
          >
            <span className="font-medium">Oops!</span> Slug already exist!
          </p>
        </div>
        <div className="mb-6">
          <input
            type="description"
            id="description"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="What's this article about"
            onChange={(e) => handleInputChange(e)}
            required
          />
          <p
            className={` mt-2 text-sm text-red-600 dark:text-red-500 ${
              errorMessage === "Description can't be empty or null" ? "" : "hidden"
            }`}
          >
            <span className="font-medium">Oops!</span> Description can not be
            empty!
          </p>
        </div>
        <div className="mb-6">
<textarea id="body" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your article (in markdown) 
" onChange={(e) => handleInputChange(e)}></textarea>

          <p
            className={` mt-2 text-sm text-red-600 dark:text-red-500 ${
              errorMessage === "Body can't be empty or null" ? "" : "hidden"
            }`}
          >
            <span className="font-medium">Oops!</span> Body can not be
            empty!
          </p>
        </div>
        <div className="mb-6">
          <input
            type="tags"
            id="tags"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter tags"
            onChange={(e) => handleInputChange(e)}
            required
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => handleCreateArticleSubmit()}
        >
          Publish Article
        </button>
      </div>
    </>
  );
};

export default CreateArticleForm;
