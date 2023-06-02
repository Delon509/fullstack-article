const ArticleTabs = ({ tabs, selectedTabName, handleClick }) => {
  const selectedTab = "text-blue-600 border-b-2 border-blue-600 active";
  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
      <ul className="flex flex-wrap -mb-px">
        {tabs.map((tab) => (
          <li className="mr-2" key={tab.id}>
            <button
              className={` inline-block p-4 border-b-2 rounded-t-lg ${
                selectedTabName === tab.name ? selectedTab : tab.nonselected
              }`}
              onClick={() => handleClick(tab.name)}
            >
              {tab.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticleTabs;
