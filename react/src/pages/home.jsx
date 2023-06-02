import { useEffect } from "react";
import { useState } from "react";
import ArticlePages from "../components/articlePages";
import ArticleTabs from "../components/articleTabs";
import PopularTags from "../components/popularTags";
import PublicHomeBanner from "../components/publicHomeBanner";
import PublicNavbar from "../components/publicNavbar";
import UserNavbar from "../components/userNavbar";
import { isAuthentication } from "../services/authServices";

const Home = () => {
  const [isLogin, setIsLogin] = useState(false);
  const nonselectedTab =
    "border-transparent hover:text-gray-600 hover:border-gray-300";
  const nonselectedTabHidden =
    "border-transparent hover:text-gray-600 hover:border-gray-300 hidden";
  const [selectedTab, setSelectedTab] = useState("Global Feed");
  const [tabs, setTabs] = useState([
    { id: 1, name: "Global Feed", nonselected: nonselectedTab },
    { id: 2, name: "#1234", nonselected: nonselectedTabHidden },
  ]);
  const [url, setUrl] = useState(isAuthentication()?"articles/feed?limit=10": "articles?limit=10");
  useEffect(() => {
    // Update the document title using the browser API
    //console.log("user is"+isAuthentication());
    setIsLogin(isAuthentication());
    if(isAuthentication()){
      setTabs([
        { id: 1, name: "My Feed", nonselected: nonselectedTab },
        { id: 2, name: "Global Feed", nonselected: nonselectedTab },
        { id: 3, name: "#1234", nonselected: nonselectedTabHidden },
      ]);
      setUrl("articles/feed?limit=10");
      setSelectedTab("My Feed");
    }
  },[]);
  const handleClick = (name) => {
    //console.log(name);
    setSelectedTab(name);
    updateUrl(name);
  };
  const updateTabs = (tagName) => {
    const newList = tabs.map((item) => {
      if (item.name.startsWith('#') ) {
        const updatedItem = {
          ...item,
          name : "#"+tagName,
        };

        return updatedItem;
      }

      return item;
    });

    setTabs(newList);
    setSelectedTab("#"+tagName);
    updateUrl(tagName);
  };
  const updateUrl = (name) => {
    if(name == "Global Feed"){
      setUrl("articles?limit=10");
    }else if(name == "My Feed"){
      setUrl("articles/feed?limit=10");
    }
    else {
      setUrl("articles?limit=10&tag="+name);
    }
  };
  
  return (
    <>

      {isLogin ? <UserNavbar/> : <PublicNavbar />}
      {isLogin ? <div></div> : <PublicHomeBanner />}
      
      <div className="grid grid-cols-1 grid-row-2 md:container md:mx-auto mt-4 md:grid-cols-12 md:gap-2">
      
      <div className="md: col-span-8">
      <ArticleTabs
        tabs={tabs}
        selectedTabName={selectedTab}
        handleClick={handleClick}
      />
      <ArticlePages url={url}/>
      </div>
      <div className=" md: col-span-3">
      <PopularTags updateTabs={updateTabs}/>
      </div>
      
      </div>
      
    </>
  );
};

export default Home;
