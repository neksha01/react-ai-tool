import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import RecentSearch from "../Components/RecentSearch";
import QuestionAnswer from "../Components/QuestionAnswer";
import API from "../services/api";

function Chat() {
    const [user, setUser] = useState(null);

  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
 const [recentHistory, setRecentHistory] = useState([]);

  const [selectedHistory, setSelectedHistory] = useState("");
  const scrollToAns = useRef();
  const [loader, setLoader] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    setUser(decoded);
  }
}, []);

 useEffect(() => {
  const loadHistory = async () => {
    try {
      const res = await API.get("/api/ai/history");

      const formatted = res.data.flatMap((chat) => [
        { type: "q", text: chat.question },
        { type: "a", text: chat.answer },
      ]);

      setResult(formatted);
      setRecentHistory(res.data.map(chat => chat.question));
    } catch (err) {
      console.error("Failed to load history");
    }
  };

  loadHistory();
}, []);



  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const askQuestion = async () => {
    if (!question && !selectedHistory) return;

    const payloadData = question || selectedHistory;
    setLoader(true);

    try {
      const res = await API.post("/api/ai/ask", {
        prompt: payloadData,
      });

      setResult((prev) => [
        ...prev,
        { type: "q", text: payloadData },
        { type: "a", text: res.data.response },
      ]);
    } catch {
      setResult((prev) => [
        ...prev,
        { type: "q", text: payloadData },
        { type: "a", text: "Error getting response from AI" },
      ]);
    }

    setQuestion("");
    setLoader(false);

    setTimeout(() => {
      scrollToAns.current?.scrollTo(
        0,
        scrollToAns.current.scrollHeight
      );
    }, 300);
  };

  useEffect(() => {
    if (selectedHistory) askQuestion();
  }, [selectedHistory]);

  // 🌗 DARK MODE (UNCHANGED)
  const [darkMode, SetDarkMode] = useState("dark");

  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={darkMode === "dark" ? "dark" : "light"}>
      <div className="grid grid-cols-1 md:grid-cols-5 h-screen bg-white dark:bg-zinc-900 text-center">

        {/* Dark Mode Toggle */}
        <select
          onChange={(e) => SetDarkMode(e.target.value)}
          className="fixed bottom-20 left-4 px-3 py-2 rounded-lg shadow-md 
                     dark:text-white text-zinc-800 
                     dark:bg-zinc-800 bg-red-100 
                     z-50"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>

        {/* Mobile Sidebar Button */}
        <button
          className="absolute top-4 left-4 z-[60] md:hidden 
                     bg-violet-600 text-white px-3 py-2 rounded-lg"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          {mobileSidebarOpen ? "✕" : "☰"}
        </button>

        {/* Sidebar */}
        <div
          className={`border-r border-zinc-800 bg-red-100 dark:bg-zinc-800 
          fixed md:static top-0 left-0 h-full w-64 md:w-auto 
          transform ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 z-40`}
        >
          <RecentSearch
            recentHistory={recentHistory}
            setRecentHistory={setRecentHistory}
            setSelectedHistory={setSelectedHistory}
          />
        </div>

        {/* Main Content */}
        <div className="col-span-4 flex flex-col h-screen relative pt-16 md:pt-4">

          {/* 🔥 HEADER + LOGOUT */}
          <div className="flex justify-between items-center px-4 min-h-[56px]">
  <div className="flex items-center gap-3">
    {/* Avatar */}
    <div className="w-10 h-10 rounded-full bg-violet-600 text-white 
                    flex items-center justify-center font-semibold">
      {user?.name?.charAt(0).toUpperCase()}
    </div>

    {/* Name */}
    <h1 className="text-xl md:text-2xl font-semibold
                   text-zinc-800 dark:text-zinc-200">
      Hi, {user?.name || "User"}
    </h1>
  </div>

  {/* Logout */}
  <button
    onClick={logout}
    className="px-4 py-2 rounded-lg text-sm
               bg-violet-600 hover:bg-violet-700 text-white
              cursor-pointer transition-all hover:scale-105 hover:font-semibold"
  >
    Logout
  </button>
</div>


          {/* Loader */}
          {loader && (
            <div className="flex justify-center my-2">
              <span className="animate-pulse text-violet-500">
                Thinking...
              </span>
            </div>
          )}

          {/* Answers */}
          <div
            ref={scrollToAns}
            className="flex-1 overflow-y-auto px-4 py-2 pb-32 
                       dark:text-zinc-300 text-zinc-800"
          >
            {result.map((item, index) => (
              <QuestionAnswer key={index} item={item} index={index} />
            ))}
          </div>

          {/* Input */}
          <div className="dark:bg-zinc-800 bg-red-100 
            w-[90%] md:w-2/3 lg:w-[40%]
            mx-auto mb-3 rounded-full border 
            flex items-center pr-2
            h-12 fixed bottom-4 left-1/2 
            -translate-x-1/2 z-50">

            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askQuestion()}
              placeholder="Ask me anything"
              className="flex-1 px-4 bg-transparent outline-none 
                         text-black dark:text-white"
            />

            <button onClick={askQuestion} className="px-4 cursor-pointer hover:text-violet-600 hover:scale-105 hover:font-semibold transition-all">
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
