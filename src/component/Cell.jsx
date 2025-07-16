import React from "react";

const colorPalette = [
    "bg-purple-200", "bg-orange-200", "bg-blue-200", "bg-green-200",
    "bg-gray-200", "bg-red-200", "bg-yellow-200", "bg-pink-200",
    "bg-indigo-200", 
    "bg-lime-200", "bg-teal-200", "bg-rose-200", 
    "bg-cyan-200", "bg-fuchsia-200", "bg-emerald-200", "bg-amber-200",
    "bg-sky-200", "bg-violet-200", "bg-light-blue-200", "bg-warm-gray-200"
];

const borderColorMap = {
    "purple": "border-purple-400", "purple-dark": "border-purple-700",
    "orange": "border-orange-400", "orange-dark": "border-orange-700",
    "blue": "border-blue-400", "blue-dark": "border-blue-700",
    "green": "border-green-400", "green-dark": "border-green-700",
    "gray": "border-gray-400", "gray-dark": "border-gray-700",
    "red": "border-red-400", "red-dark": "border-red-700",
    "yellow": "border-yellow-400", "yellow-dark": "border-yellow-700",
    "pink": "border-pink-400", "pink-dark": "border-pink-700",
    "indigo": "border-indigo-400", "indigo-dark": "border-indigo-700",
    "lime": "border-lime-400", "lime-dark": "border-lime-700",
    "teal": "border-teal-400", "teal-dark": "border-teal-700",
    "rose": "border-rose-400", "rose-dark": "border-rose-700",
    "cyan": "border-cyan-400", "cyan-dark": "border-cyan-700",
    "fuchsia": "border-fuchsia-400", "fuchsia-dark": "border-fuchsia-700",
    "emerald": "border-emerald-400", "emerald-dark": "border-emerald-700",
    "amber": "border-amber-400", "amber-dark": "border-amber-700",
    "sky": "border-sky-400", "sky-dark": "border-sky-700",
    "violet": "border-violet-400", "violet-dark": "border-violet-700",
    "light-blue": "border-blue-400", "light-blue-dark": "border-blue-700",
    "warm-gray": "border-gray-400", "warm-gray-dark": "border-gray-700"
};

export default function Cell({ value, status, onClick, colorId, isRowValid, isColValid, isRegionValid }) {
    const bgColorClass = colorPalette[colorId % colorPalette.length];
    const baseColorName = bgColorClass.replace("bg-", "").replace("-200", "");
    let actualBorderColorClass = "border-gray-400";
    if (isRowValid || isColValid || isRegionValid) {
       actualBorderColorClass = borderColorMap[`${baseColorName}-dark`] || actualBorderColorClass;
    }

    const errorColor = status === "error" ? "bg-red-600" : "";
    const validColor = status === "valid" ? "bg-green-600" : "";

    return (
        <div onClick={onClick}
            className={`aspect-square w-full h-full flex items-center justify-center
                        border ${actualBorderColorClass} text-xl font-bold cursor-pointer select-none
                        ${errorColor || validColor || bgColorClass}
                        ${value === '❌' ? 'text-red-600' : (value === '👑' ? 'text-purple-800' : 'text-gray-700')}`}
        >
            {value}
        </div>
    );
}