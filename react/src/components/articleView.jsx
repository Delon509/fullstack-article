import { Link } from "react-router-dom";
import ImageUrl from "../assets/userImage.jpg";
import FavoriteButton from "./favoriteButton";

const ArticleView = ({ data }) => {
  return (
    <div className="p-3 border-b border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <Link to={`/profile/${data.author.username}`} className="flex">
          <img
            className="w-10 h-10 rounded-full mr-1"
            src={ImageUrl}
            alt="Jese Leos"
          />
          <div className="text-base font-semibold leading-none text-gray-900 dark:text-white">
            <div to={`/profile/${data.author.username}` } className="underline text-blue-400 hover:text-blue-500">
              {" "}
              {data.author.username}
            </div>
            <p className="text-slate-400 text-sm">{data.createdAt}</p>
          </div>
        </Link>
        <FavoriteButton
          slug={data.slug}
          favorited={data.favorited === "true"}
          favoriteCount={data.favoritesCount}
        />
      </div>

      <Link to={`/article/${data.slug}` } className="mb-4 font-semibold text-2xl">{data.title}</Link>
      <p></p>
      <Link to={`/article/${data.slug}` }className=" text-slate-500 text-lg">{data.description}</Link>
      <div className="flex flex-wrap items-center justify-between mx-auto  ">
        <Link to={`/article/${data.slug}` } className="text-slate-300">
          Read more...
        </Link>
        <ul className="font-medium flex  p-0   border-gray-100 rounded-lg  flex-row space-x-1 mt-0 border-0 bg-white text-slate-700">
          {data.tagList?.map((tag) => (
            <li key={tag}>
              <Link
                to={`/articl/${data.slug}` }
                className="block py-1 px-2 border-slate-300 text-slate-300  border rounded-lg  "
                aria-current="page"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ArticleView;
