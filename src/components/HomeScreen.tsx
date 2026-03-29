"use client";

import { Difficulty, DIFFICULTIES } from "@/data/vocabulary";
import Image from "next/image";

interface HomeScreenProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

export default function HomeScreen({ onSelectDifficulty }: HomeScreenProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Temple background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-temple.jpg"
          alt="Temple background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#FAF0D6]/50" />
      </div>

      {/* Green solid border */}
      <div className="relative z-10 m-4 sm:m-8 flex-1 flex flex-col items-center justify-center w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] border-[3px] border-solid border-[#2E8B6E] rounded-xl p-6 sm:p-10">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-[#75282B] tracking-wide mb-1">
          STORE KHMER
        </h1>
        <p className="text-lg sm:text-xl font-semibold text-[#75282B] mb-6">
          Cambodian Matching Game
        </p>

        {/* Description */}
        <p className="text-center text-[#75282B] font-semibold max-w-sm mb-10 text-sm sm:text-base">
          {"Ma-yay needs your help! Match the groceries before Khmer New Year — she's counting on you!"}
        </p>

        {/* Difficulty buttons */}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          {(Object.keys(DIFFICULTIES) as Difficulty[]).map((key) => (
            <button
              key={key}
              onClick={() => onSelectDifficulty(key)}
              className="game-button w-full"
            >
              {DIFFICULTIES[key].label}
            </button>
          ))}
        </div>

        {/* Feedback link */}
        <a
          href="https://forms.gle/Pah1MZPp4AuqR9RbA"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 text-sm text-[#8B5E3C] underline underline-offset-2 hover:text-[#75282B] transition-colors"
        >
          📝 Share your feedback
        </a>

      </div>

    </div>
  );
}
