import React, { useState } from 'react';

const GridCell = ({ bgColor, content, pattern }) => (
  <div className={`relative w-12 h-12  md:w-20 md:h-20 border border-gray-400 ${bgColor} flex items-center justify-center`}>
    {pattern && (
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: 'repeating-linear-gradient(40deg, transparent, transparent 4px, #ef4444 4px, #ef4444 5px)',
        }}
      ></div>
    )}
    {content === 'Q' && <span className="text-xl relative z-10 m-auto">👑</span>}
    {content === 'X' && <span className="text-xl font-bold relative z-10 text-red-600">×</span>}
  </div>
);

const GridBoard = ({ boardData, caption }) => (
  <div className="flex flex-col items-center">
    <div className="grid grid-cols-5 grid-rows-5 border-2 border-gray-600 rounded-md overflow-hidden">
      {boardData.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <GridCell
            key={`${rowIndex}-${colIndex}`}
            bgColor={cell.bgColor}
            content={cell.content}
            pattern={cell.pattern}
          />
        ))
      )}
    </div>
    <p className="mt-3 text-sm text-gray-700 text-center max-w-xs px-2" dangerouslySetInnerHTML={{ __html: caption.replace(/<queen\/>/g, '👑') }} />
  </div>
);

const cell = (color, content = '', pattern = false) => ({
  bgColor: color,
  ...(content && { content }),
  ...(pattern && { pattern }),
});

const gameRules = [
  {
    grids: [{
      boardData: [
        [cell('bg-purple-200', 'Q'), cell('bg-orange-200', 'X'), cell('bg-orange-200', 'X'), cell('bg-orange-200', 'X'), cell('bg-orange-200', 'X')],
        [cell('bg-blue-200'), cell('bg-green-200'), cell('bg-blue-200'), cell('bg-orange-200'), cell('bg-blue-200')],
        [cell('bg-blue-200'), cell('bg-green-200'), cell('bg-blue-200'), cell('bg-blue-200'), cell('bg-blue-200')],
        [cell('bg-blue-200'), cell('bg-blue-200'), cell('bg-blue-200'), cell('bg-gray-200'), cell('bg-gray-200')],
        [cell('bg-blue-200'), cell('bg-blue-200'), cell('bg-blue-200'), cell('bg-blue-200'), cell('bg-blue-200')],
      ],
      caption: 'Each row can only have one 👑.',
    }],
  },
  {
    grids: [{
      boardData: [
        [cell('bg-purple-200', 'Q'), cell('bg-orange-200'), cell('bg-orange-200'), cell('bg-orange-200'), cell('bg-orange-200')],
        [cell('bg-blue-200', 'X'), cell('bg-green-200'), cell('bg-blue-200'), cell('bg-orange-200'), cell('bg-blue-200')],
        [cell('bg-blue-200', 'X'), cell('bg-green-200'), cell('bg-blue-200'), cell('bg-blue-200'), cell('bg-blue-200')],
        [cell('bg-blue-200', 'X'), cell('bg-blue-200'), cell('bg-blue-200'), cell('bg-gray-200'), cell('bg-gray-200')],
        [cell('bg-blue-200', 'X'), cell('bg-blue-200'), cell('bg-blue-200'), cell('bg-blue-200'), cell('bg-blue-200')],
      ],
      caption: 'Each column can also only have one 👑.',
    }],
  },
  {
    grids: [{
      boardData: [
        [cell('bg-purple-200'), cell('bg-orange-200'), cell('bg-orange-200'), cell('bg-orange-200'), cell('bg-orange-200')],
        [cell('bg-blue-200', '', true), cell('bg-green-200'), cell('bg-blue-200', '', true), cell('bg-orange-200'), cell('bg-blue-200', '', true)],
        [cell('bg-blue-200', '', true), cell('bg-green-200'), cell('bg-blue-200', '', true), cell('bg-blue-200', 'Q', true), cell('bg-blue-200', '', true)],
        [cell('bg-blue-200', '', true), cell('bg-blue-200', '', true), cell('bg-blue-200', '', true), cell('bg-gray-200'), cell('bg-gray-200')],
        [cell('bg-blue-200', '', true), cell('bg-blue-200', '', true), cell('bg-blue-200', 'Q', true), cell('bg-blue-200', '', true), cell('bg-blue-200', '', true)],
      ],
      caption: 'Each color region can also only have one 👑.',
    }],
  },
  {
    grids: [{
      boardData: [
        [cell('bg-purple-200'), cell('bg-orange-200'), cell('bg-orange-200'), cell('bg-orange-200'), cell('bg-orange-200')],
        [cell('bg-blue-200'), cell('bg-green-200'), cell('bg-blue-200'), cell('bg-orange-200', 'Q', true), cell('bg-blue-200')],
        [cell('bg-blue-200'), cell('bg-green-200'), cell('bg-blue-200', 'Q', true), cell('bg-blue-200'), cell('bg-blue-200')],
        [cell('bg-blue-200'), cell('bg-blue-200'), cell('bg-blue-200'), cell('bg-gray-200'), cell('bg-gray-200')],
        [cell('bg-blue-200'), cell('bg-blue-200'), cell('bg-blue-200'), cell('bg-blue-200'), cell('bg-blue-200')],
      ],
      caption: 'Two 👑 cannot touch each other, not even diagonally.',
    }],
  },
];

const GameRulesCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % gameRules.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + gameRules.length) % gameRules.length);
  const goToSlide = (index) => setCurrentIndex(index);

  const currentGrids = gameRules[currentIndex].grids;
  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === gameRules.length - 1;

  return (
    <div className=" bg-white rounded-lg shadow-xl overflow-hidden font-sans mx-auto ">
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">How to Play</h2>
        </div>

        <div className="relative">
          {currentGrids.map((gridItem, index) => (
            <GridBoard key={index} boardData={gridItem.boardData} caption={gridItem.caption} />
          ))}
        </div>

        <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
          {gameRules.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'} transition-colors duration-200`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
          <button
            className={`ml-3 text-gray-500 hover:text-gray-700 ${isFirstSlide ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handlePrev}
            disabled={isFirstSlide}
            aria-label="Previous rule"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className={`ml-2 text-gray-500 hover:text-gray-700 ${isLastSlide ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleNext}
            disabled={isLastSlide}
            aria-label="Next rule"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameRulesCard;
