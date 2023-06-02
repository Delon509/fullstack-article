import { useParams } from "react-router-dom";
import UserNavbar from "../components/userNavbar";
import UserProfileBanner from "../components/userProfileBanner";
import ArticlePages from "../components/articlePages";
import ArticleTabs from "../components/articleTabs";
import { useEffect,useState } from "react";
import { isAuthentication } from "../services/authServices";
import PublicNavbar from "../components/publicNavbar";
const Profile = () => {
  const { username } = useParams();
  const nonselectedTab =
  "border-transparent hover:text-gray-600 hover:border-gray-300";
const [selectedTab, setSelectedTab] = useState("My Articles");
const [tabs, setTabs] = useState([
  { id: 1, name: "My Articles", nonselected: nonselectedTab },
  { id: 2, name: "Favorited Articles", nonselected: nonselectedTab },
]);
const [url, setUrl] = useState("articles?limit=10&author="+username);
const [isLogin,setIsLogin]= useState(isAuthentication());
const handleClick = (name) => {
  //console.log(name);
  setSelectedTab(name);
  updateUrl(name);
};
const updateUrl = (name) => {
  if(name == "My Articles"){
    setUrl("articles?limit=10&author="+username);
  }else if(name == "Favorited Articles"){
    setUrl("articles?limit=10&favorited="+username);
  }
};
  return (
    <div>
      {isLogin ? <UserNavbar/> : <PublicNavbar />}
      <UserProfileBanner urlUsername={username}/>
      <div className="container mx-auto">
      <ArticleTabs
        tabs={tabs}
        selectedTabName={selectedTab}
        handleClick={handleClick}
      />
      <ArticlePages url={url}/>
      </div>
    </div>
  );
};

export default Profile;
