import { useState } from "react";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [input, setInput] = useState("");

  const addBook = () => {
    if (!input) return;

    const newBook = {
      id: Date.now(),
      title: input,
      level: 1, // 默认从基础阅读开始
    };

    setBooks([...books, newBook]);
    setInput("");
  };

  const upgradeBook = (id) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === id
          ? { ...book, level: Math.min(book.level + 1, 4) }
          : book
      )
    );
  };

  const renderLevel = (levelNumber, levelName) => {
    return (
      <div className="level">
        <h2>{levelName}</h2>
        {books
          .filter((book) => book.level === levelNumber)
          .map((book) => (
            <div key={book.id} className="book">
              <span>{book.title}</span>
              {levelNumber < 4 && (
                <button onClick={() => upgradeBook(book.id)}>
                  升级
                </button>
              )}
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="container">
      <h1>Reading Depth System</h1>
      <p>阅读不是翻页，而是关系的加深。</p>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入书名"
        />
        <button onClick={addBook}>添加</button>
      </div>

      {renderLevel(4, "主题阅读")}
      {renderLevel(3, "分析阅读")}
      {renderLevel(2, "检视阅读")}
      {renderLevel(1, "基础阅读")}
    </div>
  );
}

export default App;