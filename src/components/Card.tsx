"use client";

import { Card as CardType } from "@/data/vocabulary";
import Image from "next/image";

interface CardProps {
  card: CardType;
  isFlipped: boolean;
  isMatched: boolean;
  isMismatch: boolean;
  onClick: () => void;
  gridColumns: number;
}

export default function GameCard({
  card,
  isFlipped,
  isMatched,
  isMismatch,
  onClick,
  gridColumns,
}: CardProps) {
  const showFront = isFlipped || isMatched;

  // Determine border style
  let borderClass = "border-2 border-[#D4A12A]"; // default gold
  let extraStyle = "";
  if (isMatched) {
    borderClass = "border-2 border-[#2E8B6E]";
  } else if (isMismatch) {
    borderClass = "border-2 border-[#B5272D]";
  } else if (isFlipped) {
    borderClass = "border-2 border-[#F5C842]";
    extraStyle = "box-shadow: 0 0 12px rgba(245, 200, 66, 0.4), 0 0 24px rgba(245, 200, 66, 0.15)";
  }

  // Card width based on grid columns
  const widthClass = gridColumns === 3
    ? "w-[calc(33.333%-8px)]"
    : "w-[calc(25%-8px)]";

  return (
    <div
      className={`card ${showFront ? "flipped" : ""} ${isMismatch ? "mismatch" : ""} ${widthClass} aspect-[3/4] cursor-pointer select-none`}
      onClick={onClick}
      style={{ perspective: "600px" }}
    >
      <div className="card-inner relative w-full h-full">
        {/* Back face */}
        <div
          className={`card-face absolute inset-0 rounded-xl ${borderClass} overflow-hidden`}
          style={isFlipped || isMatched ? {} : extraStyle ? { boxShadow: extraStyle } : {}}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url(/card-back-burgundy.png)" }}
          />
        </div>

        {/* Front face */}
        <div
          className={`card-front card-face absolute inset-0 rounded-xl ${borderClass} overflow-hidden flex flex-col items-center justify-center p-2 ${isMatched ? "bg-[#2E8B6E]/10" : "bg-[#FAF0D6]"}`}
          style={isFlipped && !isMatched && !isMismatch ? {
            boxShadow: "0 0 12px rgba(245, 200, 66, 0.4), 0 0 24px rgba(245, 200, 66, 0.15)",
          } : {}}
        >
          <div className="relative w-[60%] aspect-square mb-1">
            <Image
              src={card.image}
              alt={card.english}
              fill
              className="object-contain"
              sizes="120px"
            />
          </div>
          <p className="font-bold text-[#75282B] text-sm sm:text-base leading-tight text-center">
            {card.khmer}
          </p>
          <p className="text-[#8B5E3C] text-xs leading-tight text-center">
            {card.english}
          </p>
        </div>
      </div>
    </div>
  );
}
