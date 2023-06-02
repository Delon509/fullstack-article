import axios from "axios";
import { useState, useEffect } from "react";
import authHeader from "../services/authServices";
import ArticleView from "./articleView";
import { checkToken} from "../services/authServices";
import { useNavigate } from "react-router-dom";
const ArticlePages = ({url}) => {
  const navigate = useNavigate();
  const [datas, setDatas] = useState([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [max, setMax] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
        checkToken();
      //console.log("search url is"+url);
      try{
        const response = await axios.get(
          import.meta.env.VITE_API_URL + url+"&offset=" + offset,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader(),
              // "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
            },
          }
        );
        const data = response.data.articles;
        setDatas(data);
        setTotal(response.data.articlesCount);
        if (offset + 10 > response.data.articlesCount) {
          setMax(response.data.articlesCount);
        } else {
          setMax(offset + 10);
        }
      }catch(error){
        //console.log(error.response.data.status);
        if(error.response.data.status == 401){
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [offset,url]);
  const handlePrevClick = () => {
    const newOffset = offset - 10;
    if (newOffset >= 0) {
      setOffset(newOffset);
    }
  };
  const handleNextClick = () => {
    const newOffset = offset + 10;
    //console.log("newOffset is"+ newOffset);
    //console.log("total is "+total);
    if (newOffset < total) {
      setOffset(newOffset);
    }
  };
  if(max==0){
    return (<div>No articles yet..</div>)
  }
  return (
    <div>
      {datas.map((data) => (
        <ArticleView data={data} key={data.title} />
      ))}
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-700 dark:text-gray-400">
          Showing
          <span className="font-semibold text-gray-900 dark:text-white">
            {" "}
            {offset + 1}
          </span>{" "}
          to
          <span className="font-semibold text-gray-900 dark:text-white">
            {" "}
            {max}
          </span>{" "}
          of
          <span className="font-semibold text-gray-900 dark:text-white">
            {" "}
            {total}{" "}
          </span>
          Entries
        </span>

        <div className="inline-flex mt-2 xs:mt-0">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => handlePrevClick()}
          >
            Prev
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => handleNextClick()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticlePages;
