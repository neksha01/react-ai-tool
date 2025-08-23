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
        <SyntaxHighlighter
          {...props}
          children={String(children).replace(/\n$/, "")}
          language={match[1]}
          style={dark}
          PreTag="div"
          className="rounded-lg my-2 text-sm md:text-base"
        />
      ) : (
        <code {...props} className={`${className} bg-zinc-800 px-1 py-0.5 rounded`}>
          {children}
        </code>
      );
    },
  };

  return (
    <>
      {index === 0 && totalResult > 1 ? (
        <span className="pt-2 text-base md:text-lg block dark:text-white text-zinc-800 font-semibold break-words">
          {answer}
        </span>
      ) : heading ? (
        <span className="pt-2 text-base md:text-lg block dark:text-white text-zinc-800 font-semibold">
          {answer}
        </span>
      ) : (
        <span
          className={`block ${
            type === "q" ? "pl-2 md:pl-3" : "pl-4 md:pl-6"
          } text-sm md:text-base break-words`}
        >
          <ReactMarkdown components={renderer}>{answer}</ReactMarkdown>
        </span>
      )}
    </>
  );
};

export default Answer;
