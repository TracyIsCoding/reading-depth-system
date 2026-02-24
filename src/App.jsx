import { useState } from "react";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [input, setInput] = useState("");

  // 核心：获取书籍封面的函数（使用免费Open Library API）
  const getBookCover = async (bookTitle) => {
    try {
      // 编码书名，避免特殊字符导致请求失败
      const encodedTitle = encodeURIComponent(bookTitle);
      // 调用Open Library搜索API
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${encodedTitle}`
      );
      const data = await response.json();

      // 取第一个搜索结果的封面ID（有结果才处理）
      if (data.docs && data.docs.length > 0) {
        const coverId = data.docs[0].cover_i;
        if (coverId) {
          // 返回中等尺寸封面（M=medium，可选S=小/L=大）
          return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
        }
      }
      // 无封面时返回占位图
      return "https://via.placeholder.com/40x60?text=No+Cover";
    } catch (error) {
      // 网络错误/API异常时也返回占位图，避免页面崩溃
      console.log("获取封面失败：", error);
      return "https://via.placeholder.com/40x60?text=No+Cover";
    }
  };

  // 改造后的添加书籍函数（含封面获取）
  const addBook = async () => {
    if (!input.trim()) { // 过滤空输入（含全空格）
      alert("请输入有效的书名！");
      return;
    }

    // 先获取封面，再添加书籍
    const coverUrl = await getBookCover(input);

    const newBook = {
      id: Date.now(),
      title: input.trim(),
      level: 1, // 默认基础阅读
      cover: coverUrl, // 新增封面字段
    };

    setBooks([...books, newBook]);
    setInput(""); // 清空输入框
  };

  // 原有升级书籍函数（无改动）
  const upgradeBook = (id) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === id
          ? { ...book, level: Math.min(book.level + 1, 4) }
          : book
      )
    );
  };

  // 渲染阅读阶段的函数（新增封面展示）
  const renderLevel = (levelNumber, levelName) => {
    return (
      <div className="level">
        <h2>{levelName}</h2>
        {books
          .filter((book) => book.level === levelNumber)
          .map((book) => (
            <div key={book.id} className="book">
              {/* 展示封面图片 */}
              <img 
                src={book.cover} 
                alt={`${book.title}的封面`} 
                className="book-cover" 
                loading="lazy" // 懒加载，提升性能
              />
              <span>{book.title}</span>
              {levelNumber < 4 && (
                <button onClick={() => upgradeBook(book.id)}>
                  ⬆️
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
      {/* 完善的slogan展示 */}
      <div className="slogan-container">
        <p className="main-slogan">阅读不是翻页，是关系的加深。</p>
        <p className="sub-slogan">A personal reading structure system</p>
        <p className="desc-slogan">基于《如何阅读一本书》的结构化阅读管理工具。</p>
      </div>

      {/* 输入区域 */}
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入书名（如：如何阅读一本书）"
          type="text" // 明确输入类型
        />
        <button onClick={addBook}>添加</button>
      </div>

      {/* 按阶段展示书籍（从高到低） */}
      {renderLevel(4, "主题阅读")}
      {renderLevel(3, "分析阅读")}
      {renderLevel(2, "检视阅读")}
      {renderLevel(1, "基础阅读")}
    </div>
  );
}

export default App;