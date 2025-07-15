import React, { useState } from "react";
import Board from "./component/Board"; // Adjust the path if needed
import GameRulesCard from "./component/Rules"; // Optional: Replace if you have a rules component

export default function App() {
  const size = 8;

  const getUniqueRegionsAndQueenCount = (regions) => {
    const uniqueRegions = new Set();
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        uniqueRegions.add(regions[r][c]);
      }
    }
    return uniqueRegions.size;
  };

  const levels = [
    {
      name: "Level 1",
      regions: [
        [0, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 2, 2, 1, 1, 1],
        [0, 0, 2, 2, 2, 2, 1, 1],
        [0, 0, 2, 3, 2, 2, 1, 1],
        [4, 4, 2, 3, 2, 2, 5, 5],
        [4, 4, 2, 3, 2, 5, 5, 5],
        [4, 4, 2, 2, 2, 5, 5, 5],
        [4, 4, 4, 4, 4, 5, 5, 5],
      ],
      initialQueens: [],
    },
    {
      name: "Level 2",
      regions: [
        [0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 2, 2, 2, 0, 1],
        [0, 0, 3, 2, 2, 2, 4, 1],
        [0, 0, 3, 2, 2, 2, 4, 1],
        [0, 0, 3, 2, 2, 2, 4, 1],
        [0, 0, 0, 2, 2, 2, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 1],
      ],
      initialQueens: [],
    },
    {
      name: "Level 3",
      regions: [
        [0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 2, 2, 2, 0, 0, 1],
        [0, 0, 2, 2, 2, 0, 0, 1],
        [0, 0, 2, 3, 2, 0, 0, 1],
        [0, 0, 2, 2, 2, 0, 0, 1],
        [0, 0, 2, 2, 2, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 1],
      ],
      initialQueens: [],
    },
    {
      name: "Level 4",
      regions: [
        [1, 1, 1, 1, 2, 2, 2, 2],
        [1, 1, 1, 2, 2, 2, 2, 3],
        [1, 1, 2, 2, 2, 2, 3, 3],
        [1, 2, 2, 2, 2, 3, 3, 3],
        [2, 2, 2, 2, 3, 3, 3, 4],
        [2, 2, 2, 3, 3, 3, 4, 4],
        [2, 2, 3, 3, 3, 4, 4, 4],
        [2, 3, 3, 3, 4, 4, 4, 4],
      ],
      initialQueens: [],
    },
  ];

  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const currentLevelData = levels[currentLevelIndex];
  const numQueensForCurrentLevel = getUniqueRegionsAndQueenCount(
    currentLevelData.regions
  );

  const handleNextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex((prev) => prev + 1);
    }
  };

  const handlePrevLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-inter">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
        👑 Queen Logic Puzzle
      </h1>
      <div className="flex flex-col lg:flex-row justify-center mt-6 gap-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 text-center sm:text-left">
            <button
              onClick={handlePrevLevel}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 w-full sm:w-auto"
              disabled={currentLevelIndex === 0}
            >
              Previous
            </button>

            <h2 className="text-lg font-bold text-gray-700 flex-1 sm:text-center">
              {currentLevelData.name} ({currentLevelIndex + 1}/{levels.length})
              <br />
              <span className="text-sm text-gray-600">
                Queens to place: {numQueensForCurrentLevel}
              </span>
            </h2>

            <button
              onClick={handleNextLevel}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 w-full sm:w-auto"
              disabled={currentLevelIndex === levels.length - 1}
            >
              Next
            </button>
          </div>
          <Board
            size={size}
            regions={currentLevelData.regions}
            initialQueens={currentLevelData.initialQueens}
            numQueensToPlace={numQueensForCurrentLevel}
            key={currentLevelIndex} // force reset on level change
          />
        </div>
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
          <GameRulesCard />
        </div>
      </div>
    </div>
  );
}
