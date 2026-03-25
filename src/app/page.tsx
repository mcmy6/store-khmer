"use client";

import { useState, useCallback } from "react";
import { Difficulty } from "@/data/vocabulary";
import HomeScreen from "@/components/HomeScreen";
import GameScreen from "@/components/GameScreen";
import CompletionScreen from "@/components/CompletionScreen";

type Screen = "home" | "game" | "completion";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [finalFlips, setFinalFlips] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const handleSelectDifficulty = useCallback((d: Difficulty) => {
    setDifficulty(d);
    setGameKey((k) => k + 1);
    setScreen("game");
  }, []);

  const handleComplete = useCallback((flips: number, timeout: boolean) => {
    setFinalFlips(flips);
    setTimedOut(timeout);
    setScreen("completion");
  }, []);

  const handlePlayAgain = useCallback(() => {
    setGameKey((k) => k + 1);
    setScreen("game");
  }, []);

  const handleChooseLevel = useCallback(() => {
    setScreen("home");
  }, []);

  const handleHome = useCallback(() => {
    setScreen("home");
  }, []);

  if (screen === "game") {
    return (
      <GameScreen
        key={gameKey}
        difficulty={difficulty}
        onComplete={handleComplete}
        onHome={handleHome}
      />
    );
  }

  if (screen === "completion") {
    return (
      <CompletionScreen
        difficulty={difficulty}
        flips={finalFlips}
        timedOut={timedOut}
        onPlayAgain={handlePlayAgain}
        onChooseLevel={handleChooseLevel}
      />
    );
  }

  return <HomeScreen onSelectDifficulty={handleSelectDifficulty} />;
}
