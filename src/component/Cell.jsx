// Cell.jsx
import React from "react";

const colorPalette = [
  "bg-purple-200", "bg-orange-200", "bg-blue-200", "bg-green-200",
  "bg-gray-200", "bg-red-200", "bg-yellow-200", "bg-pink-200",
  "bg-indigo-200", "bg-lime-200", "bg-teal-200", "bg-rose-200",
  "bg-cyan-200", "bg-fuchsia-200", "bg-emerald-200", "bg-amber-200", 
  "bg-sky-200", "bg-violet-200", "bg-light-blue-200", "bg-warm-gray-200"
];

export default function Cell({ value, status, onClick, colorId }) {
  const bgColor = colorPalette[colorId % colorPalette.length];
  const errorColor = status === "error" ? "bg-red-600" : "";
  const validColor = status === "valid" ? "bg-green-600" : ""; 
  return (
    <div
      onClick={onClick}
      className={`aspect-square w-full h-full flex items-center justify-center 
                  border border-gray-400 text-3xl font-bold cursor-pointer select-none 
                  ${errorColor || validColor || bgColor} 
                  hover:ring-2 hover:ring-blue-500 transition-all duration-100 ease-in-out
                  ${value === '❌' ? 'text-red-600' : (value === '👑' ? 'text-purple-800' : 'text-gray-700')}`}
    >
      {value}
    </div>
  );
}