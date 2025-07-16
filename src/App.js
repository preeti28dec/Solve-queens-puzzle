import React, { useState } from "react";
import Board from "./component/Board"; 
import GameRulesCard from "./component/Rules"; 
import { levels } from "./levels"; 
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

  // Function to go back to the previous level
  const handlePrevLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex((prev) => prev - 1);
    }
  };

  const handleCancelGame = () => {
    console.log("Game canceled. Staying on current level.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 flex flex-col items-center p-4 font-inter text-gray-800">
      <h1 className="text-4xl font-extrabold text-purple-800 mb-6 drop-shadow-md">
        👑Queen Puzzle
      </h1>

      <div className="flex flex-col lg:flex-row justify-center mt-6 gap-8 w-full max-w-6xl">
        <div className="w-full lg:w-3/5 bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 w-full">
            <button
              onClick={handlePrevLevel}
              className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-all duration-300 ease-in-out disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              disabled={currentLevelIndex === 0}
            >
              Previous Level
            </button>

            <h2 className="text-xl font-bold text-center flex-1">
              {currentLevelData.name} ({currentLevelIndex + 1}/{levels.length})
              <br />
              <span className="text-base text-gray-600 font-medium">
                Queens to place: {numQueensForCurrentLevel}
              </span>
            </h2>
            <button
              onClick={handleNextLevel}
              className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-all duration-300 ease-in-out disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              disabled={currentLevelIndex === levels.length - 1}
            >
              Next Level
            </button>
          </div>
          {/* Board Component */}
          <Board
            size={size}
            regions={currentLevelData.regions}
            initialQueens={currentLevelData.initialQueens}
            numQueensToPlace={numQueensForCurrentLevel}
            key={currentLevelIndex}
            onNextLevel={handleNextLevel} 
            onCancel={handleCancelGame} 
          />
        </div>
        <div className="w-full lg:w-2/5 bg-white rounded-3xl shadow-xl p-6">
          <GameRulesCard />
        </div>
      </div>
    </div>
  );
}
