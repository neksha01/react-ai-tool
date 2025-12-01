function RecentSearch({ recentHistory, setRecentHistory, setSelectedHistory }) {
  const clearHistory = () => {
    localStorage.removeItem("history");
    setRecentHistory([]);
  };

  const clearSelectedHistory = (selectedItem) => {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history = history.filter((item) => item !== selectedItem);
    setRecentHistory(history);
    localStorage.setItem("history", JSON.stringify(history));
  };

  return (
    <div className="col-span-1 dark:bg-zinc-800 bg-red-100 pt-3 h-full md:h-auto w-full md:w-auto">
      {/* Header */}
      <h1 className="text-lg md:text-xl dark:text-white text-zinc-800 flex items-center justify-between px-3 md:px-5">
        <span>Recent Search</span>
        <button
          onClick={clearHistory}
          className="cursor-pointer p-1 md:p-2 rounded-md hover:bg-zinc-900 bg-zinc-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="18"
            viewBox="0 -960 960 960"
            width="18"
            fill="#e3e3e3"
          >
            <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336Z" />
          </svg>
        </button>
      </h1>

      {/* Search List */}
      <ul className="text-left overflow-y-auto mt-2 max-h-[50vh] md:max-h-[70vh]">
        {recentHistory &&
          recentHistory.map((item, index) => (
            <div key={index} className="flex justify-between items-center pr-2 md:pr-3 py-1">
              <li
                className="w-full px-3 md:px-5 dark:text-zinc-400 text-zinc-800 cursor-pointer dark:hover:bg-zinc-700 dark:hover:text-zinc-200 hover:bg-red-200 hover:text-zinc-900 truncate text-sm md:text-base"
                onClick={() => setSelectedHistory(item)}
              >
                {item}
              </li>

              <button
                onClick={() => clearSelectedHistory(item)}
                className="cursor-pointer p-1 md:p-2 rounded-md hover:bg-zinc-900 bg-zinc-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  viewBox="0 -960 960 960"
                  width="16"
                  fill="#e3e3e3"
                >
                  <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336Z" />
                </svg>
              </button>
            </div>
          ))}
      </ul>
    </div>
  );
}

export default RecentSearch;
