import UserView from "./userView";
const ArticleBanner = ({authorName,title,following,favorited,faCount,isSamePerson,createdAt,image,slug}) => {

  return (
    <div className=" w-full  bg-[#333] py-4 ">
        <div className=" container mx-auto w-4/6">
        <div className=" text-3xl font-TWeb drop-shadow-lg my-4 text-white mb-10">{title}</div>
        <UserView authorName={authorName} following={following}
        favorited={favorited} faCount={faCount} isSamePerson={isSamePerson}
        createdAt={createdAt} image={image} slug={slug}/>
        </div>
        
      </div>
  );
};

export default ArticleBanner;
