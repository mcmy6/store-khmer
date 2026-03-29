"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Difficulty, DIFFICULTIES, Card as CardType, VocabItem, shuffleCards } from "@/data/vocabulary";
import GameCard from "./Card";
import GroceryBag from "./GroceryBag";

interface GameScreenProps {
  difficulty: Difficulty;
  onComplete: (flips: number, timedOut: boolean) => void;
  onHome: () => void;
}

export default function GameScreen({ difficulty, onComplete, onHome }: GameScreenProps) {
  const config = DIFFICULTIES[difficulty];
  const [cards, setCards] = useState<CardType[]>(() => shuffleCards(config.items, difficulty));
  const [collectedItems, setCollectedItems] = useState<VocabItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [flipCount, setFlipCount] = useState(0);
  const [mismatchIndices, setMismatchIndices] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    config.timer ? config.timerSeconds : null
  );
  const audioCtx = useRef<AudioContext | null>(null);
  const audioBuffers = useRef<Map<string, AudioBuffer>>(new Map());
  const activeSource = useRef<AudioBufferSourceNode | null>(null);
  const activeHtmlAudio = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasCompleted = useRef(false);
  const flipCountRef = useRef(0);

  // Preload audio buffers (fetch raw data, decode after context exists)
  const rawAudioData = useRef<Map<string, ArrayBuffer>>(new Map());
  useEffect(() => {
    config.items.forEach(async (item) => {
      if (rawAudioData.current.has(item.audio) || audioBuffers.current.has(item.audio)) return;
      try {
        const response = await fetch(item.audio);
        const arrayBuffer = await response.arrayBuffer();
        rawAudioData.current.set(item.audio, arrayBuffer);
        // If context already exists, decode immediately
        if (audioCtx.current) {
          const buffer = await audioCtx.current.decodeAudioData(arrayBuffer.slice(0));
          audioBuffers.current.set(item.audio, buffer);
        }
      } catch {
        // Silently fail
      }
    });

    return () => {
      if (activeSource.current) {
        try { activeSource.current.stop(); } catch {}
      }
    };
  }, [config.items]);

  // Initialize AudioContext on first user gesture and decode all preloaded audio
  const ensureAudioContext = useCallback(() => {
    if (audioCtx.current) {
      if (audioCtx.current.state === "suspended") {
        audioCtx.current.resume();
      }
      return audioCtx.current;
    }
    const ctx = new AudioContext();
    audioCtx.current = ctx;
    // Decode all pre-fetched raw audio data
    rawAudioData.current.forEach(async (arrayBuffer, key) => {
      if (audioBuffers.current.has(key)) return;
      try {
        const buffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
        audioBuffers.current.set(key, buffer);
      } catch {
        // Silently fail
      }
    });
    return ctx;
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

  // Beep countdown at 5 seconds
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && timeRemaining <= 5) {
      // Only beep if context was already created by a user tap
      if (!audioCtx.current) return;
      const ctx = audioCtx.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(timeRemaining === 1 ? 880 : 660, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    }
  }, [timeRemaining]);

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
      const ctx = ensureAudioContext();
      const buffer = audioBuffers.current.get(audioSrc);

      // Stop any previous audio
      if (activeSource.current) {
        try { activeSource.current.stop(); } catch {}
      }
      if (activeHtmlAudio.current) {
        activeHtmlAudio.current.pause();
        activeHtmlAudio.current.currentTime = 0;
      }

      if (buffer) {
        // Web Audio API path (preferred — works reliably once context is unlocked)
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => resolve();
        source.start(0);
        activeSource.current = source;
      } else {
        // HTMLAudioElement fallback (first tap before buffers are decoded)
        const audio = new Audio(audioSrc);
        audio.addEventListener("ended", () => resolve(), { once: true });
        audio.play().catch(() => resolve());
        activeHtmlAudio.current = audio;
      }
    });
  }, [ensureAudioContext]);

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
              const matchedItem = config.items.find(item => item.id === card1.id);
              if (matchedItem) {
                setCollectedItems(prev => [...prev, matchedItem]);
              }
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
            className="text-[#75282B] font-semibold text-lg"
          >
            ←
          </button>
          <h1 className="text-lg font-bold text-[#75282B] uppercase tracking-wide">STORE KHMER</h1>
          <div className="text-sm font-semibold text-[#75282B] bg-[#F2E6C9] px-3 py-1 rounded-full">
            🛒 {collectedItems.length}/{config.pairs}
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

      {/* Ma-yay's shopping cart */}
      <div className="px-4">
        <GroceryBag
          collectedItems={collectedItems}
          totalSlots={config.pairs}
          difficulty={difficulty}
        />
      </div>
    </div>
  );
}
