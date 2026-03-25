"use client";

import { useState } from "react";
import { VocabItem } from "@/data/vocabulary";
import Image from "next/image";

interface GroceryListProps {
  items: VocabItem[];
  matchedIds: string[];
}

export default function GroceryList({ items, matchedIds }: GroceryListProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full max-w-md mx-auto mt-6 mb-4">
      {/* Tape graphic */}
      <div className="flex justify-center -mb-3 relative z-10">
        <div
          className="w-16 h-6 rounded-sm opacity-70 rotate-[-2deg]"
          style={{
            background: "linear-gradient(135deg, rgba(210, 180, 140, 0.7), rgba(210, 180, 140, 0.4))",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        />
      </div>

      {/* Note */}
      <div className="ripped-edge bg-[#FFF9E8] rounded-b-lg shadow-md overflow-hidden">
        {/* Header - always visible, acts as toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-6 pt-5 pb-2 flex items-center justify-between"
        >
          <h3
            className="text-lg text-[#75282B]"
            style={{ fontFamily: "var(--font-caveat), cursive", fontWeight: 600 }}
          >
            {"Yay's list for Khmer New Year"}
          </h3>
          <span className="text-[#75282B] text-sm">
            {isOpen ? "▲" : "▼"} {matchedIds.length}/{items.length}
          </span>
        </button>

        {/* Collapsible list */}
        {isOpen && (
          <div className="lined-paper px-4 pb-4">
            {/* Red margin line */}
            <div className="relative pl-6 border-l-2 border-[#E88B8B] ml-4">
              {items.map((item) => {
                const isMatched = matchedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 py-[6px] transition-opacity ${isMatched ? "opacity-60" : ""}`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isMatched
                          ? "bg-[#2E8B6E] border-[#2E8B6E]"
                          : "border-[#8B5E3C]/40 bg-transparent"
                      }`}
                    >
                      {isMatched && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Item image */}
                    <div className="relative w-7 h-7 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.english}
                        fill
                        className="object-contain"
                        sizes="28px"
                      />
                    </div>

                    {/* Names */}
                    <span
                      className={`text-base text-[#75282B] ${isMatched ? "line-through" : ""}`}
                      style={{ fontFamily: "var(--font-caveat), cursive", fontWeight: 500 }}
                    >
                      {item.khmer} — {item.english}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
