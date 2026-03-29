"use client";

import { useState, useEffect, useRef } from "react";
import { VocabItem, Difficulty } from "@/data/vocabulary";
import Image from "next/image";

interface GroceryBagProps {
  collectedItems: VocabItem[];
  totalSlots: number;
  difficulty: Difficulty;
}

function ConfettiEffect() {
  const colors = ["#FEC600", "#2E8B6E", "#B5272D", "#006E8D", "#D4A12A", "#75282B"];
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 1.5,
    color: colors[i % colors.length],
    size: 4 + Math.random() * 6,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute confetti-piece"
          style={{
            left: `${p.left}%`,
            top: "-10px",
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            borderRadius: "1px",
            transform: `rotate(${p.rotation}deg)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function GroceryBag({ collectedItems, totalSlots, difficulty }: GroceryBagProps) {
  const gridClass =
    difficulty === "easy"
      ? "grid-cols-3"
      : difficulty === "medium"
      ? "grid-cols-5"
      : "grid-cols-4";

  const slots = Array.from({ length: totalSlots }, (_, i) => collectedItems[i] || null);
  const [bouncingIndex, setBouncingIndex] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const prevCount = useRef(0);

  useEffect(() => {
    if (collectedItems.length > prevCount.current) {
      const newIndex = collectedItems.length - 1;
      setBouncingIndex(newIndex);
      setTimeout(() => setBouncingIndex(null), 500);

      if (collectedItems.length === totalSlots) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2500);
      }
    }
    prevCount.current = collectedItems.length;
  }, [collectedItems.length, totalSlots]);

  return (
    <div className="w-full max-w-md mx-auto mt-4 mb-4 px-1 relative">
      {showConfetti && <ConfettiEffect />}

      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-base font-bold text-[#75282B]">
          {"🛒 Ma-yay's shopping cart"}
        </span>
        <span className="text-sm font-semibold text-[#8B5E3C]">
          {collectedItems.length} / {totalSlots}
        </span>
      </div>

      {/* Slots grid */}
      <div className={`grid ${gridClass} gap-2`}>
        {slots.map((item, i) => (
          <div
            key={i}
            className={`rounded-full flex flex-col items-center justify-center ${
              item
                ? "border-2 border-[#2E8B6E] bg-[#2E8B6E]/10"
                : "border-2 border-dashed border-[#D4A12A]/50 bg-[#FAF0D6]/50"
            } ${bouncingIndex === i ? "bag-slot-bounce" : ""}`}
            style={{ aspectRatio: "1 / 1" }}
            aria-label={
              item
                ? `${item.english} - collected`
                : `Item ${i + 1} - not yet found`
            }
          >
            {item ? (
              <>
                <div className="relative w-[50%] aspect-square mb-0.5">
                  <Image
                    src={item.image}
                    alt={item.english}
                    fill
                    className="object-contain"
                    sizes="48px"
                  />
                </div>
                <p
                  className="font-bold text-[#75282B] text-[8px] sm:text-[10px] leading-tight text-center"
                  style={{ fontFamily: "var(--font-khmer), serif" }}
                >
                  {item.khmer}
                </p>
                <p className="text-[#8B5E3C] text-[7px] sm:text-[9px] leading-tight text-center">
                  {item.phonetic}
                </p>
              </>
            ) : (
              <span className="text-[#8B5E3C]/40 text-lg font-bold">?</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
