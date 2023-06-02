import { useParams } from "react-router-dom";
import EditArticleForm from "../components/editArticleForm";
import UserNavbar from "../components/userNavbar";
const EditArticleEditor = () => {
  const { slug } = useParams();
  return (
    <div>
      <UserNavbar/>
      <EditArticleForm slug={slug}/>
    </div>
  );
};

export default EditArticleEditor;
