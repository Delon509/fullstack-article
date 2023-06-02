import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { isAuthentication } from "../services/authServices";
import PublicNavbar from "../components/publicNavbar";
import UserNavbar from "../components/userNavbar";
import authHeader, { checkUserIsAuthor,checkToken } from "../services/authServices";
import ArticleDetail from "../components/articleDetail";
import { useNavigate,Link } from "react-router-dom";
import axios  from "axios";
import CommentBox from "../components/commentBox";
import Comment from "../components/comment";
const Article = () => {
  const [isLogin, setIsLogin] = useState(isAuthentication());
  const [isSamePerson,setIsSamePerson] = useState(false);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [createdAt,setCreatedAt] = useState("");
  const [favorited, setFavorited] = useState(false);
  const [faCount, setFaCount] = useState(0);
  const [following, setFollowing] = useState(false);
  const [image,setImage]= useState("");
  const [authorName,SetAuthorName] = useState("");
  const { slug } = useParams();
  const [datas, setDatas] = useState([]);
  const [providedBody,setProvidedBody] = useState("");
  const handleDeleteComment = (providedId,) => {
    //console.log("Start Delete Comment");
    async function deleteComment() {
      try {
        const response = await axios.delete(
          import.meta.env.VITE_API_URL + "articles/"+slug+"/comments/"+providedId,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader(),
              // "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
            },
          }
        );
        //console.log(response.data);
        try {
          const result = await axios.get(
            import.meta.env.VITE_API_URL + "articles/"+slug+"/comments",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: authHeader(),
                // "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
              },
            }
          );
          //console.log(result.data.comments);
          
          setDatas(result.data.comments);
        } catch (error) {
          //console.log(error);
          //console.log(error.response.status);
          navigate("/login");
      }
      } catch (error) {
        //console.log(error);
        //console.log(error.response.status);
        navigate("/");
    }
    }
    deleteComment();
  }
  const handlePostComment = () => {
    //console.log("Start Add Comment");
    async function postComment() {
      try {
        const response = await axios.post(
          import.meta.env.VITE_API_URL + "articles/"+slug+"/comments",
          {"body":providedBody},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader(),
              // "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
            },
          }
        );
        //console.log(response.data);
        try {
          const result = await axios.get(
            import.meta.env.VITE_API_URL + "articles/"+slug+"/comments",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: authHeader(),
                // "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
              },
            }
          );
          //console.log(result.data.comments);
          setProvidedBody("");
          setDatas(result.data.comments);
        } catch (error) {
          //console.log(error);
          //console.log(error.response.status);
          navigate("/");
      }} catch (error) {
        //console.log(error);
        //console.log(error.response.status);
        navigate("/");
    }
    }
    
    if(providedBody!==""){
      postComment();
    }
  }
  useEffect(() => {
    // Get Current User Settings
    //console.log(slug);
    checkToken();
    async function fetchArticle() {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "articles/"+slug,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader(),
              // "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
            },
          }
        );
        //console.log(response.data.article);
        // Check User is Author of the Article
        setIsSamePerson(checkUserIsAuthor(response.data.article.author.username));
        //console.log("result of checkUserIsAuthor"+checkUserIsAuthor(response.data.article.author.username))
        // Set State
        if(response.data.article.description !== null){
          setDescription(response.data.article.description)
        }
        if(response.data.article.body !== null){
            setBody(response.data.article.body)
        }
        if(response.data.article.tagList !== null){
            setTags(response.data.article.tagList);
        }
        setCreatedAt(response.data.article.createdAt);
        setFavorited(response.data.article.favorited === "true");
        setFaCount(response.data.article.favoritesCount);
        setFollowing(response.data.article.author.following === "true");
        SetAuthorName(response.data.article.author.username);
  if(response.data.article.author.image !== null){
    setImage(response.data.article.author.image);
}
        setTitle(response.data.article.title);
      } catch (error) {
        //console.log(error);
        //console.log(error.response.status);
        navigate("/login");
    }
    }
    async function fetchComments() {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "articles/"+slug+"/comments",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader(),
              // "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
            },
          }
        );
        //console.log(response.data.comments);
        
        setDatas(response.data.comments);
      } catch (error) {
        //console.log(error);
        //console.log(error.response.status);
        navigate("/login");
    }
    }
    fetchArticle();
    fetchComments();
},[slug]);


  return (
    <div>
      {isLogin ? <UserNavbar/> : <PublicNavbar />}
      <ArticleDetail title={title} description={description} body={body} tagList={tags} 
      createdAt={createdAt} favorited={favorited} faCount={faCount} authorName={authorName} 
      image={image} following={following} isSamePerson={isSamePerson} slug={slug}/>
    <div className="w-full   py-4">
      <div className="container mx-auto w-1/2 space-y-4">
      {isLogin ? <CommentBox setProvidedBody={setProvidedBody} providedBody={providedBody} slug={slug} updateCommentUI={handlePostComment} /> : <div><Link to={`/login` } className=" text-green-400 hover:underline">Sign in</Link>  or <Link to={`/register`} className=" text-green-400 hover:underline">sign up</Link> to add comments on this article.</div>}
      
      {datas?.map((data) => (
        <Comment key={data.id} slug={slug} updateCommentUI={handleDeleteComment} id={data.id} createdAt={data.createdAt} body={data.body} authorName={data.author.username} image={data.author.image} />
      ))}
      </div>
      
    </div>
    </div>
  );
};

export default Article;
