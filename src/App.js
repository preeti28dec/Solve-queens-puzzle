// App.js
import React from "react";
import Board from './component/Board';
import GameRulesCard from './component/Rules';

export default function App() {
  const size = 8; 
  const regions = [
    [0, 0, 1, 1, 2, 2, 3, 3],
    [0, 1, 1, 2, 2, 3, 3, 4],
    [5, 5, 6, 6, 7, 7, 4, 4],
    [5, 6, 6, 7, 7, 8, 8, 4],
    [9, 9, 10, 10, 11, 11, 8, 8],
    [9, 10, 10, 11, 11, 12, 12, 13],
    [14, 14, 15, 15, 16, 16, 13, 13],
    [14, 15, 15, 16, 16, 17, 17, 13],
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 mb-6 text-center drop-shadow-md">
    👑 Queen Logic Puzzle
  </h1>

  <div className="flex flex-col lg:flex-row justify-center  mt-6 gap-8 lg:gap-16 w-full max-w-7xl mx-auto px-4">
    <div className="w-full max-w-md">
      <Board size={size} regions={regions} />
    </div>
    <div className="w-full max-w-md">
      <GameRulesCard />
    </div>
  </div>
</div>

  );
}
