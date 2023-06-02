import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
const PopularTags = ({updateTabs}) => {
  const [listTags, setListTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const handleTagClick = (tagName) => {
    //console.log(tagName);
    setSelectedTag(tagName);
    updateTabs(tagName);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "tags",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        //console.log(response.data.tags);
        setListTags(response.data.tags);
      } catch (error) {
        //console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className=" bg-slate-100 p-2 h-auto w-auto flex-wrap">
      <div className=" font-bold">Popular Tags</div>
      <div className=" flex flex-wrap">
        {listTags.map((item) => (
          <button
            className={`rounded-lg px-2 py-1 my-1 text-white mx-1 hover:bg-slate-600 ${selectedTag == item ? "bg-slate-600" : "bg-slate-400"}`}
            key={item}
            onClick={() => handleTagClick(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularTags;
