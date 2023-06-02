import ArticleBanner from "./articleBanner";

const ArticleDetail = ({title ,description, body ,tagList, 
  createdAt, favorited, faCount, authorName, 
  image, following ,isSamePerson,slug}) => {
    return (
      <div>
        <ArticleBanner title={title} authorName={authorName} following={following}
        favorited={favorited} faCount={faCount} isSamePerson={isSamePerson}
        createdAt={createdAt} image={image} slug={slug}/>
          
          <div className=" w-full   py-4 ">
        <div className=" container mx-auto w-4/6">
        <div className=" text-2xl font-TWeb my-4 text-slate-500  border-b border-slate-200 pb-10">{body}</div>
        
        </div>
        
      </div>
      </div>
    );
  };
  
  export default ArticleDetail;