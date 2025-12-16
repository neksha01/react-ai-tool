import Answer from "./Answers";

const QuestionAnswer = ({ item, index }) => {
  return (
    <div className="my-2">
      {item.type === "q" ? (
        // User Question (Right aligned)
        <div className="flex justify-end">
          <div className="max-w-[75%] text-base md:text-lg flex items-center justify-center text-right p-1 border-8 dark:bg-zinc-700 dark:border-zinc-700 bg-red-100 border-red-100 rounded-tl-3xl rounded-br-3xl rounded-bl-3xl w-fit break-words">
            <Answer
              ans={item.text}
              index={index}
              totalResult={1}
              type={item.type}
            />
          </div>
        </div>
      ) : (
        // AI Answer (Left aligned)
        <div className="flex flex-col items-start text-left p-2 gap-3">
          {Array.isArray(item.text) ? (
            item.text.map((ansItem, ansIndex) => (
              <div
                key={ansIndex}
                className="max-w-[85%] text-base md:text-lg text-zinc-600 dark:text-zinc-200 break-words"
              >
                <Answer
                  ans={ansItem}
                  index={ansIndex}
                  totalResult={item.text.length}
                  type={item.type}
                />
              </div>
            ))
          ) : (
            <div className="max-w-[85%] text-base md:text-lg text-zinc-600 dark:text-zinc-200 break-words">
              <Answer
                ans={item.text}
                index={0}
                totalResult={1}
                type={item.type}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionAnswer;
