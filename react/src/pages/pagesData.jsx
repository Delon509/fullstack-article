import Home from "./home";
import Login from "./login";
import Register from "./register";
import SettingPage from "./settingsPage";
import CreateArticleEditor from "./createArticleEditor";
import EditArticleEditor from "./editArticleEditor";
import Article from "./article";
import Profile from "./profile";
import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "./protectedRoute";
import {PublicOnlyRoute} from "./publicOnlyRoute";
const pagesData = [
  {
    path: "",
    element: <Home />,
    title: "Home",
  },
  {
    path: "login",
    element:<PublicOnlyRoute><Login /></PublicOnlyRoute> ,
    title: "Login",
  },
  {
    path: "register",
    element:<PublicOnlyRoute><Register /></PublicOnlyRoute> ,
    title: "Register",
  },
  {
    path: "settings",
    element:<ProtectedRoute><SettingPage /></ProtectedRoute> ,
    title: "Settings",
  },
  {
    path: "editor",
    element:<ProtectedRoute><CreateArticleEditor /></ProtectedRoute> ,
    title: "CreateArticle",
  },
  {
    path: "editor/:slug",
    element:<ProtectedRoute><EditArticleEditor /> </ProtectedRoute> ,
    title: "EditArticle",
  },
  {
    path: "article/:slug",
    element: <Article />,
    title: "Article",
  },
  {
    path: "profile/:username",
    element: <Profile />,
    title: "Profile",
  },
  {
    path: "*",
    element: <Navigate replace to="/" />,
    title: "Not Exist Page",
  },
];

export default pagesData;
