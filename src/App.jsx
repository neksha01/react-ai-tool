import { useState, useEffect, useRef } from "react";
import "./App.css";
import { URL } from "./constants";

import RecentSearch from "./Components/RecentSearch";
import QuestionAnswer from "./Components/QuestionAnswer";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history"))
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const scrollToAns = useRef();
  const [loader, setLoader] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const askQuestion = async () => {
    if (!question && !selectedHistory) return;

    if (question) {
      if (localStorage.getItem("history")) {
        let history = JSON.parse(localStorage.getItem("history"));
        history = history.slice(0, 19);
        history = [question, ...history];
        history = history.map(
          (item) => item.charAt(0).toUpperCase() + item.slice(1).trim()
        );
        history = [...new Set(history)];
        localStorage.setItem("history", JSON.stringify(history));
        setRecentHistory(history);
      } else {
        localStorage.setItem("history", JSON.stringify([question]));
        setRecentHistory([question]);
      }
    }

    const payloadData = question ? question : selectedHistory;
    const payload = {
      contents: [
        {
          parts: [{ text: payloadData }],
        },
      ],
    };

    setLoader(true);

    let response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    response = await response.json();
    let dataString = response.candidates[0].content.parts[0].text;
    dataString = dataString.split("* ").map((item) => item.trim());

    setResult((prev) => [
      ...prev,
      { type: "q", text: question ? question : selectedHistory },
      { type: "a", text: dataString },
    ]);

    setQuestion("");

    setTimeout(() => {
      if (scrollToAns.current) {
        scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
      }
    }, 300);

    setLoader(false);
  };

  const isEnter = (event) => {
    if (event.key === "Enter") {
      askQuestion();
    }
  };

  useEffect(() => {
    if (selectedHistory) askQuestion();
  }, [selectedHistory]);

  // Dark mode
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
      <div className="grid grid-cols-1 md:grid-cols-5 h-screen bg-white dark:bg-zinc-900 overflow-hidden text-center">

        {/* Dark Mode Toggle */}
        <select
          onChange={(event) => SetDarkMode(event.target.value)}
          className="fixed bottom-20 left-4 px-3 py-2
                     rounded-lg shadow-md 
                     dark:text-white text-zinc-800 
                     dark:bg-zinc-800 bg-red-100 
                     text-sm md:text-base z-50"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>

        {/* Mobile Sidebar Toggle Button */}
        <button
          className="absolute top-4 left-4 z-50 md:hidden 
                     bg-violet-600 text-white px-3 py-2 
                     rounded-lg shadow-lg"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          {mobileSidebarOpen ? "✕" : "☰"}
        </button>

        {/* Sidebar */}
        <div
          className={`border-r border-zinc-800 bg-red-100 dark:bg-zinc-800 
                      fixed md:static top-0 left-0 h-full w-64 md:w-auto 
                      transform ${
                        mobileSidebarOpen
                          ? "translate-x-0"
                          : "-translate-x-full"
                      } 
                      md:translate-x-0 transition-transform duration-300 
                      z-40 md:block`}
        >
          <RecentSearch
            recentHistory={recentHistory}
            setRecentHistory={setRecentHistory}
            setSelectedHistory={setSelectedHistory}
          />
        </div>

        {/* Main Content */}
        <div className="col-span-4 flex flex-col h-screen relative ">
          {/* Heading */}
          <div className="flex justify-center">
            <h1
              className="text-2xl md:text-4xl leading-relaxed p-4 
                         bg-clip-text text-transparent 
                         bg-gradient-to-r from-pink-700 to-violet-700
                         text-center mx-auto w-full max-w-xl"
            >
              Hello User, Ask me Anything
            </h1>
          </div>

          {/* Loader */}
          {loader ? (
            <div role="status" className="my-2 flex justify-center">
              <svg
                aria-hidden="true"
                className="w-6 h-6 md:w-8 md:h-8 
                           text-gray-200 animate-spin 
                           dark:text-gray-600 fill-purple-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051..."
                  fill="currentColor"
                />
                <path d="M93.9676 39.0409C96.393..." fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : null}

          {/* Answers */}
          <div
            ref={scrollToAns}
            className="flex-1 overflow-y-auto px-4 py-2 mb-20 
                       dark:text-zinc-300 text-zinc-800"
          >
            <ul>
              {result.map((item, index) => (
                <QuestionAnswer item={item} index={index} key={index} />
              ))}
            </ul>
          </div>

          {/* Input Bar */}
          <div
            className="dark:bg-zinc-800 bg-red-100 
                       w-[90%] sm:w-4/5 md:w-2/3 lg:w-[40%]
                       mx-auto mb-3
                       rounded-4xl border border-zinc-700 
                       flex justify-end items-center pr-2
                       h-12 md:h-14 fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50"
          >
            <input
              type="text"
              placeholder="Ask me anything"
              className="flex-[0.85] h-full px-3 md:px-4 bg-transparent outline-none 
                         text-sm md:text-base text-black dark:text-white"
              value={question}
              onKeyDown={isEnter}
              onChange={(event) => setQuestion(event.target.value)}
            />
            <button
              onClick={askQuestion}
              className="flex-[0.15] px-3 md:px-5 text-sm md:text-base 
                         text-zinc-300"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
