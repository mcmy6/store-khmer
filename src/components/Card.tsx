"use client";

import { Card as CardType, Difficulty } from "@/data/vocabulary";
import Image from "next/image";

interface CardProps {
  card: CardType;
  isFlipped: boolean;
  isMatched: boolean;
  isMismatch: boolean;
  onClick: () => void;
  gridColumns: number;
  difficulty: Difficulty;
  cardPosition: number;
}

export default function GameCard({
  card,
  isFlipped,
  isMatched,
  isMismatch,
  onClick,
  gridColumns,
  difficulty,
  cardPosition,
}: CardProps) {
  const showFront = isFlipped || isMatched;

  // Determine border and glow style
  let borderClass = "border-[3px] border-[#D4A12A]";
  let glowStyle: React.CSSProperties = {
    boxShadow: "0 0 8px rgba(212, 161, 42, 0.3), 0 0 16px rgba(212, 161, 42, 0.15)",
  };
  if (isMatched) {
    borderClass = "border-[3px] border-[#2E8B6E]";
    glowStyle = {
      boxShadow: "0 0 10px rgba(46, 139, 110, 0.4), 0 0 20px rgba(46, 139, 110, 0.2)",
    };
  } else if (isMismatch) {
    borderClass = "border-[3px] border-[#B5272D]";
    glowStyle = {
      boxShadow: "0 0 10px rgba(181, 39, 45, 0.5), 0 0 20px rgba(181, 39, 45, 0.25)",
    };
  } else if (isFlipped) {
    borderClass = "border-[3px] border-[#F5C842]";
    glowStyle = {
      boxShadow: "0 0 16px rgba(245, 200, 66, 0.6), 0 0 32px rgba(245, 200, 66, 0.3), 0 0 48px rgba(245, 200, 66, 0.15)",
    };
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
          style={showFront ? {} : glowStyle}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${
              difficulty === "easy" ? "/card-back-burgundy.png"
              : difficulty === "medium" ? "/card-back-teal.png"
              : (() => {
                  const row = Math.floor(cardPosition / gridColumns);
                  const col = cardPosition % gridColumns;
                  const isEvenRow = row % 2 === 0;
                  const isEvenCol = col % 2 === 0;
                  return (isEvenRow ? isEvenCol : !isEvenCol) ? "/card-back-burgundy.png" : "/card-back-teal.png";
                })()
            })` }}
          />
        </div>

        {/* Front face */}
        <div
          className={`card-front card-face absolute inset-0 rounded-xl ${borderClass} overflow-hidden flex flex-col items-center justify-center p-2 ${isMatched ? "bg-[#2E8B6E]/10" : "bg-[#FAF0D6]"}`}
          style={showFront ? glowStyle : {}}
        >
          {card.variant === "full" && (
            <>
              <div className="relative w-[50%] aspect-square mb-1">
                <Image
                  src={card.image}
                  alt={card.english}
                  fill
                  className="object-contain"
                  sizes="120px"
                />
              </div>
              <p
                className="font-bold text-[#75282B] text-sm leading-tight text-center"
                style={{ fontFamily: "var(--font-khmer), serif" }}
              >
                {card.khmer}
              </p>
              <p className="text-[#8B5E3C] text-xs leading-tight text-center">
                {card.phonetic}
              </p>
            </>
          )}
          {card.variant === "image" && (
            <>
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
                {card.english}
              </p>
            </>
          )}
          {card.variant === "text" && (
            <>
              <p
                className="font-bold text-[#75282B] text-xl sm:text-2xl leading-tight text-center mb-1"
                style={{ fontFamily: "var(--font-khmer), serif" }}
              >
                {card.khmer}
              </p>
              <p className="text-[#8B5E3C] text-sm leading-tight text-center">
                {card.phonetic}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
