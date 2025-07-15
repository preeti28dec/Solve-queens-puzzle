import React, { useState, useEffect, useCallback, useRef } from "react";
import Cell from "./Cell"; // Assuming Cell.jsx is in the same directory

const symbols = ["", "❌", "👑"];

export default function Board({ size, regions, initialQueens, numQueensToPlace }) {
    const createInitialGrid = useCallback(() => {
        const newGrid = Array(size).fill().map(() => Array(size).fill(""));
        initialQueens.forEach(([r, c]) => {
            if (r >= 0 && r < size && c >= 0 && c < size) {
                newGrid[r][c] = "👑";
            }
        });
        return newGrid;
    }, [size, initialQueens]);

    const [grid, setGrid] = useState(createInitialGrid);
    const [history, setHistory] = useState([]);
    const [solved, setSolved] = useState(false);
    const [showErrorCells, setShowErrorCells] = useState(false);

    const [validRows, setValidRows] = useState(Array(size).fill(false));
    const [validCols, setValidCols] = useState(Array(size).fill(false));
    const [validRegions, setValidRegions] = useState(new Set());

    const hasShownAlert = useRef(false); // Prevent multiple alerts

    useEffect(() => {
        resetGame();
    }, [initialQueens, regions]);

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

        const newValidRows = Array(size).fill(false);
        const newValidCols = Array(size).fill(false);
        const newValidRegions = new Set();

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (currentGrid[r][c] === "👑") {
                    totalQueens++;
                    if (getStatus(currentGrid, r, c) !== "valid") {
                        allQueensValid = false;
                    }
                }
            }
        }

        if (allQueensValid) {
            for (let r = 0; r < size; r++) {
                const queensInRow = currentGrid[r].filter(v => v === "👑").length;
                if (queensInRow === 1) {
                    const queenCol = currentGrid[r].indexOf("👑");
                    if (queenCol !== -1 && getStatus(currentGrid, r, queenCol) === "valid") {
                        newValidRows[r] = true;
                    }
                }
            }

            for (let c = 0; c < size; c++) {
                let queensInCol = 0, queenRow = -1;
                for (let r = 0; r < size; r++) {
                    if (currentGrid[r][c] === "👑") {
                        queensInCol++;
                        queenRow = r;
                    }
                }
                if (queensInCol === 1 && queenRow !== -1 && getStatus(currentGrid, queenRow, c) === "valid") {
                    newValidCols[c] = true;
                }
            }

            const uniqueRegionIds = new Set();
            regions.forEach(row => row.forEach(id => uniqueRegionIds.add(id)));

            uniqueRegionIds.forEach(regionId => {
                let queensInRegion = [];
                for (let r = 0; r < size; r++) {
                    for (let c = 0; c < size; c++) {
                        if (regions[r]?.[c] === regionId && currentGrid[r][c] === "👑") {
                            queensInRegion.push({ r, c });
                        }
                    }
                }

                if (queensInRegion.length === 1) {
                    const { r, c } = queensInRegion[0];
                    if (getStatus(currentGrid, r, c) === "valid") {
                        newValidRegions.add(regionId);
                    }
                }
            });
        }

        setValidRows(newValidRows);
        setValidCols(newValidCols);
        setValidRegions(newValidRegions);
        setShowErrorCells(!allQueensValid);
        setSolved(allQueensValid && totalQueens === numQueensToPlace);
    }, [size, getStatus, regions, numQueensToPlace]);

    useEffect(() => {
        checkSolved(grid);

        // Count total queens placed
        let totalQueens = 0;
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (grid[r][c] === "👑") totalQueens++;
            }
        }

        // Show alert once when puzzle is solved and correct number of queens placed
        if (solved && totalQueens === numQueensToPlace && !hasShownAlert.current) {
           // alert(`🎉 Puzzle Solved! You placed all ${numQueensToPlace} queens correctly!`);
            hasShownAlert.current = true;
        }
    }, [grid, checkSolved, solved, numQueensToPlace, size]);

    const toggleCell = (r, c) => {
        if (solved) return;
        setGrid(prev => {
            const next = prev.map(row => [...row]);
            const currentIndex = symbols.indexOf(next[r][c]);
            next[r][c] = symbols[(currentIndex + 1) % symbols.length];
            setHistory([...history, prev]);
            return next;
        });
    };

    const undo = () => {
        if (history.length > 0) {
            const prevGrid = history[history.length - 1];
            setGrid(prevGrid);
            setHistory(history.slice(0, -1));
            setSolved(false);
            hasShownAlert.current = false; // Reset alert flag
        }
    };

    const hint = () => {
        if (solved) return;
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (grid[r][c] === "") {
                    const tempGrid = grid.map(row => [...row]);
                    tempGrid[r][c] = "👑";
                    if (getStatus(tempGrid, r, c) === "valid") {
                        setHistory([...history, grid]);
                        setGrid(tempGrid);
                        return;
                    }
                }
            }
        }
        console.log("No valid hint found.");
    };

    const resetGame = useCallback(() => {
        setGrid(createInitialGrid());
        setHistory([]);
        setSolved(false);
        setShowErrorCells(false);
        setValidRows(Array(size).fill(false));
        setValidCols(Array(size).fill(false));
        setValidRegions(new Set());
        hasShownAlert.current = false; // Reset alert flag
    }, [createInitialGrid, size]);

    return (
        <div className="bg-white rounded-lg shadow-xl mx-auto w-full max-w-md p-4">
            <div
                className={`grid aspect-square border-2 border-black transition-all duration-300`}
                style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
            >
                {grid.map((row, r) =>
                    row.map((val, c) => (
                        <Cell
                            key={`${r}-${c}`}
                            value={val}
                            status={
                                showErrorCells && getStatus(grid, r, c) === "error"
                                    ? "error"
                                    : getStatus(grid, r, c) === "valid"
                                    ? "valid"
                                    : ""
                            }
                            colorId={regions[r][c]}
                            onClick={() => toggleCell(r, c)}
                            isRowValid={validRows[r]}
                            isColValid={validCols[c]}
                            isRegionValid={validRegions.has(regions[r][c])}
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
