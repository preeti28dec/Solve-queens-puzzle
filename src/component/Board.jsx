import React, { useState, useEffect, useCallback } from "react";
import Cell from "./Cell"; // Assuming Cell.jsx is in the same directory

const symbols = ["", "❌", "👑"];

export default function Board({ size, regions }) {
  const [grid, setGrid] = useState(Array(size).fill().map(() => Array(size).fill("")));
  const [history, setHistory] = useState([]);
  const [solved, setSolved] = useState(false);
  const [showErrorCells, setShowErrorCells] = useState(false);

  const getStatus = useCallback((g, r, c) => {
    if (g[r][c] !== "👑") return "";

    if (g[r].filter(v => v === "👑").length > 1) return "error";
    if (g.map(row => row[c]).filter(v => v === "👑").length > 1) return "error";

    const regionId = regions[r][c];
    let queensInRegion = 0;
    for (let rowIdx = 0; rowIdx < size; rowIdx++) {
      for (let colIdx = 0; colIdx < size; colIdx++) {
        if (regions[rowIdx]?.[colIdx] === regionId && g[rowIdx][colIdx] === "👑") {
          queensInRegion++;
        }
      }
    }
    if (queensInRegion > 1) return "error";

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && g[nr][nc] === "👑") {
          return "error";
        }
      }
    }

    return "valid";
  }, [size, regions]);

  const checkSolved = useCallback((currentGrid) => {
    let allQueensValid = true;
    let totalQueens = 0;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (currentGrid[r][c] === "👑") {
          totalQueens++;
          if (getStatus(currentGrid, r, c) !== "valid") {
            allQueensValid = false;
            setShowErrorCells(true);
            break;
          }
        }
      }
      if (!allQueensValid) break;
    }

    setShowErrorCells(!allQueensValid);
    setSolved(allQueensValid && totalQueens === size);
  }, [size, getStatus]);

  useEffect(() => {
    checkSolved(grid);
  }, [grid, checkSolved]);

  const toggleCell = (r, c) => {
    setGrid(prev => {
      const next = prev.map(row => [...row]);
      const currentIndex = symbols.indexOf(next[r][c]);
      next[r][c] = symbols[(currentIndex + 1) % symbols.length];
      setHistory([...history, prev]);
      setShowErrorCells(true);
      return next;
    });
  };

  const undo = () => {
    if (history.length > 0) {
      const prevGrid = history[history.length - 1];
      setGrid(prevGrid);
      setHistory(history.slice(0, -1));
      setSolved(false);
      setShowErrorCells(true);
    }
  };

  const hint = () => {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === "") {
          const tempGrid = grid.map(row => [...row]);
          tempGrid[r][c] = "👑";
          if (getStatus(tempGrid, r, c) === "valid") {
            setHistory([...history, grid]);
            setGrid(tempGrid);
            setShowErrorCells(false);
            return;
          }
        }
      }
    }
    console.log("No hint found");
  };

  const resetGame = () => {
    setGrid(Array(size).fill().map(() => Array(size).fill("")));
    setHistory([]);
    setSolved(false);
    setShowErrorCells(false);
  };

  return (
    <div className=" bg-white rounded-lg shadow-xl  mx-auto w-full max-w-md p-4">
      <div
        className={`grid aspect-square border-2 border-black transition-all duration-300`}
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {grid.map((row, r) =>
          row.map((val, c) => (
            <Cell
              key={`${r}-${c}`}
              value={val}
              status={showErrorCells && getStatus(grid, r, c) === "error" ? "error" : (getStatus(grid, r, c) === "valid" ? "valid" : "")}
              colorId={regions[r][c]}
              onClick={() => toggleCell(r, c)}
            />
          ))
        )}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={undo}
          className="bg-gray-300 px-5 py-2 rounded-lg text-gray-800 font-semibold hover:bg-gray-400 disabled:opacity-50"
          disabled={history.length === 0}
        >
          Undo
        </button>
        <button
          onClick={hint}
          className="bg-yellow-300 px-5 py-2 rounded-lg text-gray-800 font-semibold hover:bg-yellow-400 disabled:opacity-50"
          disabled={solved}
        >
          Hint
        </button>
        <button
          onClick={resetGame}
          className="bg-red-500 px-5 py-2 rounded-lg text-white font-semibold hover:bg-red-600"
        >
          Reset
        </button>
      </div>

      {solved && (
        <div className="mt-6 text-green-600 font-bold text-xl text-center animate-bounce">
          🎉 You solved the puzzle! 🎉
        </div>
      )}
    </div>
  );
}
