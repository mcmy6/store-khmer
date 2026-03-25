"use client";

import { Difficulty, getStars } from "@/data/vocabulary";
import Image from "next/image";

interface CompletionScreenProps {
  difficulty: Difficulty;
  flips: number;
  timedOut: boolean;
  onPlayAgain: () => void;
  onChooseLevel: () => void;
}

function StarDisplay({ count }: { count: number }) {
  return (
    <div className="flex gap-1 justify-center my-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-10 h-10 ${i <= count ? "text-[#FEC600]" : "text-gray-300"}`}
          fill={i <= count ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      ))}
    </div>
  );
}

export default function CompletionScreen({
  difficulty,
  flips,
  timedOut,
  onPlayAgain,
  onChooseLevel,
}: CompletionScreenProps) {
  const stars = timedOut ? 0 : getStars(difficulty, flips);

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
        <div className="absolute inset-0 bg-[#FAF0D6]/75" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 max-w-sm">
        {timedOut ? (
          <>
            {/* Time's Up screen */}
            <h1
              className="text-5xl mb-2 text-[#B5272D]"
              style={{ fontFamily: "var(--font-khmer), serif", fontWeight: 700 }}
            >
              {"Time's Up!"}
            </h1>
            <p className="text-[#75282B] font-semibold text-center mt-4 text-lg">
              Ma-Yay still needs help!<br />Try again?
            </p>
          </>
        ) : (
          <>
            {/* Success screen */}
            <h1
              className="text-5xl mb-2"
              style={{ fontFamily: "var(--font-khmer), serif", fontWeight: 700, color: "#75282B" }}
            >
              អរគុណ!
            </h1>

            <StarDisplay count={stars} />

            <p className="text-[#75282B] font-semibold text-center mt-2">
              You got the groceries!<br />See you at the temple!
            </p>

            <p className="text-[#75282B] font-semibold text-center mt-3 text-lg">
              Sou Sdey Chnam Tmey 🇰🇭
            </p>

            <p className="text-[#8B5E3C] text-sm mt-2">
              Completed in {flips} flips
            </p>
          </>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full mt-8">
          <button
            onClick={onPlayAgain}
            className="game-button w-full"
            style={{
              background: "linear-gradient(180deg, #006E8D 0%, #005466 100%)",
              color: "#FEC600",
              fontFamily: "var(--font-pixelify), monospace",
              fontWeight: 700,
              border: "none",
              borderRadius: "10px",
              borderBottom: "3px solid #003D4A",
              padding: "14px 24px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Play Again
          </button>
          <button
            onClick={onChooseLevel}
            className="game-button w-full"
            style={{
              background: "linear-gradient(180deg, #006E8D 0%, #005466 100%)",
              color: "#FEC600",
              fontFamily: "var(--font-pixelify), monospace",
              fontWeight: 700,
              border: "none",
              borderRadius: "10px",
              borderBottom: "3px solid #003D4A",
              padding: "14px 24px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Choose Level
          </button>
        </div>

        {/* More info link */}
        <a
          href="#"
          className="mt-6 text-[#75282B] underline text-sm font-semibold"
        >
          More info
        </a>
      </div>
    </div>
  );
}
