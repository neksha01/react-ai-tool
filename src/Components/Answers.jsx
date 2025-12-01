import { useEffect, useState } from "react";
import { checkHeading, replaceHeadingStarts } from "../helper";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

const Answer = ({ ans, totalResult, index, type }) => {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);

  useEffect(() => {
    if (ans && checkHeading(ans)) {
      setHeading(true);
      setAnswer(replaceHeadingStarts(ans));
    }
  }, [ans]);

  const renderer = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <div className="overflow-x-auto rounded-lg my-2">
          <SyntaxHighlighter
            {...props}
            language={match[1]}
            style={dark}
            PreTag="div"
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code
          {...props}
          className={`${className} bg-zinc-800 px-1 py-0.5 rounded`}
        >
          {children}
        </code>
      );
    },
  };

  return (
    <>
      {index === 0 && totalResult > 1 ? (
        <div className="pt-2 text-base sm:text-lg block text-white break-words font-semibold">
          {answer}
        </div>
      ) : heading ? (
        <div className="pt-2 text-base sm:text-lg block text-white break-words font-semibold">
          {answer}
        </div>
      ) : (
        <div
          className={`${
            type === "q" ? "pl-1" : "pl-3 sm:pl-5"
          } text-sm sm:text-base leading-relaxed break-words`}
        >
          <ReactMarkdown components={renderer}>{answer}</ReactMarkdown>
        </div>
      )}
    </>
  );
};

export default Answer;
