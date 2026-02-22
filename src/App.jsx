import { useState } from "react";

const levels = [
  "基础阅读",
  "检视阅读",
  "分析阅读",
  "主题阅读"
];

export default function App() {
  const [booksByLevel, setBooksByLevel] = useState({
    0: [],
    1: [],
    2: [],
    3: []
  });

  const [title, setTitle] = useState("");

  const addBook = () => {
    if (!title) return;

    setBooksByLevel({
      ...booksByLevel,
      0: [...booksByLevel[0], title]
    });

    setTitle("");
  };

  const moveBook = (fromLevel, toLevel, bookIndex) => {
    if (fromLevel === toLevel) return;

    const book = booksByLevel[fromLevel][bookIndex];

    const updated = { ...booksByLevel };

    updated[fromLevel] = updated[fromLevel].filter(
      (_, index) => index !== bookIndex
    );

    updated[toLevel] = [...updated[toLevel], book];

    setBooksByLevel(updated);
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>阅读深度金字塔书架</h1>

      <div style={{ marginBottom: 30 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入书名"
        />
        <button onClick={addBook} style={{ marginLeft: 10 }}>
          添加到基础阅读
        </button>
      </div>

      {levels
        .map((level, levelIndex) => (
          <div
            key={levelIndex}
            style={{
              marginBottom: 40,
              padding: 20,
              background: "#f5f5f5",
              borderRadius: 8
            }}
          >
            <h2 style={{ textAlign: "center" }}>{level}</h2>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 20
              }}
            >
              {booksByLevel[levelIndex].map((book, bookIndex) => (
                <div
                  key={bookIndex}
                  style={{
                    padding: "8px 12px",
                    background: "white",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    cursor: "pointer"
                  }}
                >
                  <div>{book}</div>

                  <div style={{ marginTop: 6 }}>
                    {levelIndex > 0 && (
                      <button
                        onClick={() =>
                          moveBook(levelIndex, levelIndex - 1, bookIndex)
                        }
                      >
                        ↓ 浅一层
                      </button>
                    )}

                    {levelIndex < 3 && (
                      <button
                        onClick={() =>
                          moveBook(levelIndex, levelIndex + 1, bookIndex)
                        }
                        style={{ marginLeft: 6 }}
                      >
                        ↑ 深一层
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
        .reverse()}
    </div>
  );
}