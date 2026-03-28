"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Difficulty, DIFFICULTIES, Card as CardType, shuffleCards } from "@/data/vocabulary";
import GameCard from "./Card";
import GroceryList from "./GroceryList";

interface GameScreenProps {
  difficulty: Difficulty;
  onComplete: (flips: number, timedOut: boolean) => void;
  onHome: () => void;
}

export default function GameScreen({ difficulty, onComplete, onHome }: GameScreenProps) {
  const config = DIFFICULTIES[difficulty];
  const [cards, setCards] = useState<CardType[]>(() => shuffleCards(config.items));
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [flipCount, setFlipCount] = useState(0);
  const [mismatchIndices, setMismatchIndices] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    config.timer ? config.timerSeconds : null
  );
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());
  const activeAudio = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasCompleted = useRef(false);
  const flipCountRef = useRef(0);

  // Preload audio
  useEffect(() => {
    const cache = audioCache.current;
    config.items.forEach((item) => {
      if (!cache.has(item.audio)) {
        const audio = new Audio(item.audio);
        audio.preload = "auto";
        cache.set(item.audio, audio);
      }
    });
  }, [config.items]);

  // Stop all audio on unmount
  useEffect(() => {
    const cache = audioCache.current;
    return () => {
      cache.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  // Timer
  useEffect(() => {
    if (!config.timer) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [config.timer]);

  // Check timer expiry
  useEffect(() => {
    if (timeRemaining === 0 && !hasCompleted.current) {
      hasCompleted.current = true;
      onComplete(flipCount, true);
    }
  }, [timeRemaining, flipCount, onComplete]);

  // Check win condition
  useEffect(() => {
    if (matchedIds.length === config.pairs && matchedIds.length > 0 && !hasCompleted.current) {
      hasCompleted.current = true;
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => onComplete(flipCountRef.current, false), 600);
    }
  }, [matchedIds.length, config.pairs, flipCount, onComplete]);

  const playAudio = useCallback((audioSrc: string): Promise<void> => {
    return new Promise((resolve) => {
      // Stop previous audio
      if (activeAudio.current) {
        activeAudio.current.pause();
        activeAudio.current.currentTime = 0;
      }

      const cached = audioCache.current.get(audioSrc);
      const audio = cached || new Audio(audioSrc);
      audio.currentTime = 0;

      const onEnd = () => {
        audio.removeEventListener("ended", onEnd);
        resolve();
      };
      audio.addEventListener("ended", onEnd);
      audio.play().catch(() => resolve());
      activeAudio.current = audio;
    });
  }, []);

  const handleCardClick = useCallback(
    (index: number) => {
      if (isProcessing) return;
      if (flippedIndices.includes(index)) return;
      if (cards[index]?.isMatched) return;

      const newFlipped = [...flippedIndices, index];
      setFlippedIndices(newFlipped);
      setFlipCount((prev) => {
        flipCountRef.current = prev + 1;
        return prev + 1;
      });

      // Play audio — block further clicks until it finishes
      setIsProcessing(true);
      playAudio(cards[index].audio).then(() => {
        if (newFlipped.length === 2) {
          const [first, second] = newFlipped;
          const card1 = cards[first];
          const card2 = cards[second];

          if (card1.id === card2.id) {
            // Match!
            setTimeout(() => {
              setMatchedIds((prev) => [...prev, card1.id]);
              setCards((prev) =>
                prev.map((c, i) =>
                  i === first || i === second ? { ...c, isMatched: true } : c
                )
              );
              setFlippedIndices([]);
              setIsProcessing(false);
            }, 200);
          } else {
            // Mismatch
            setTimeout(() => {
              setMismatchIndices([first, second]);
              setTimeout(() => {
                setMismatchIndices([]);
                setFlippedIndices([]);
                setIsProcessing(false);
              }, 300);
            }, 300);
          }
        } else {
          setIsProcessing(false);
        }
      });
    },
    [isProcessing, flippedIndices, cards, playAudio]
  );

  const timerPercent = config.timer && timeRemaining !== null
    ? (timeRemaining / config.timerSeconds) * 100
    : 100;

  return (
    <div className="min-h-screen bg-[#FAF0D6] flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={onHome}
            className="text-[#75282B] font-semibold text-sm"
          >
            ← Back
          </button>
          <h1 className="text-lg font-bold text-[#75282B]">Store Khmer</h1>
          <div className="text-sm font-semibold text-[#75282B] bg-[#F2E6C9] px-3 py-1 rounded-full">
            {config.label}
          </div>
        </div>

        {/* Flip counter */}
        <div className="text-center mt-2">
          <span className="text-[#8B5E3C] font-semibold text-sm">
            Flips: {flipCount}
          </span>
        </div>

        {/* Timer bar */}
        {config.timer && timeRemaining !== null && (
          <div className="max-w-md mx-auto mt-2">
            <div className="h-2 bg-[#F2E6C9] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                  timerPercent <= 20 ? "bg-[#B5272D] timer-warning" : timerPercent <= 50 ? "bg-[#D4A12A]" : "bg-[#2E8B6E]"
                }`}
                style={{ width: `${timerPercent}%` }}
              />
            </div>
            <p className={`text-center text-xs mt-1 font-semibold ${
              timeRemaining <= 10 ? "text-[#B5272D]" : "text-[#8B5E3C]"
            }`}>
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
            </p>
          </div>
        )}
      </div>

      {/* Card grid */}
      <div className="flex-1 px-3 sm:px-4">
        <div className="max-w-md mx-auto flex flex-wrap justify-center gap-2">
          {cards.map((card, index) => (
            <GameCard
              key={card.cardIndex}
              card={card}
              isFlipped={flippedIndices.includes(index)}
              isMatched={card.isMatched}
              isMismatch={mismatchIndices.includes(index)}
              onClick={() => handleCardClick(index)}
              gridColumns={config.gridColumns}
              difficulty={difficulty}
              cardPosition={index}
            />
          ))}
        </div>
      </div>

      {/* Grocery list */}
      <div className="px-4">
        <GroceryList
          items={[...config.items]}
          matchedIds={matchedIds}
        />
      </div>
    </div>
  );
}
