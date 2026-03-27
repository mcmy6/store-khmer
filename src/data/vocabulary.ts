export interface VocabItem {
  id: string;
  english: string;
  khmer: string;
  image: string;
  audio: string;
}

export interface Card extends VocabItem {
  cardIndex: number;
  isMatched: boolean;
}

export const VOCABULARY: VocabItem[] = [
  { id: "jak", english: "Banana", khmer: "Jak", image: "/items/item-jak.png", audio: "/audio/jak.mp3" },
  { id: "doung", english: "Coconut", khmer: "Doung", image: "/items/item-doung.png", audio: "/audio/doung.mp3" },
  { id: "threi", english: "Fish", khmer: "Threi", image: "/items/item-threi.png", audio: "/audio/threi.mp3" },
  { id: "khnow", english: "Jackfruit", khmer: "Khnow", image: "/items/item-khnow.png", audio: "/audio/khnow.mp3" },
  { id: "ingkor", english: "Rice Grains", khmer: "Ingkor", image: "/items/item-ingkor.png", audio: "/audio/ingkor.mp3" },
  { id: "thouk", english: "Incense", khmer: "Thouk", image: "/items/item-thouk.png", audio: "/audio/thouk.mp3" },
  { id: "chan-srak", english: "Traditional Tiffin", khmer: "Chan Srak", image: "/items/item-chan-srak.png", audio: "/audio/chan-srak.mp3" },
  { id: "prahok", english: "Fermented Fish", khmer: "Prahok", image: "/items/item-prahok.png", audio: "/audio/prahok.mp3" },
];

export const DIFFICULTIES = {
  easy: {
    label: "Easy",
    pairs: 3,
    items: VOCABULARY.slice(0, 3),
    gridColumns: 3,
    totalCards: 6,
    timer: false,
    timerSeconds: 0,
  },
  medium: {
    label: "Medium",
    pairs: 5,
    items: VOCABULARY.slice(0, 5),
    gridColumns: 4,
    totalCards: 10,
    timer: true,
    timerSeconds: 60,
  },
  hard: {
    label: "Hard",
    pairs: 8,
    items: VOCABULARY,
    gridColumns: 4,
    totalCards: 16,
    timer: true,
    timerSeconds: 90,
  },
} as const;

export type Difficulty = keyof typeof DIFFICULTIES;

export const STAR_THRESHOLDS = {
  easy: { 5: 6, 4: 10, 3: 14, 2: 18 },
  medium: { 5: 10, 4: 16, 3: 24, 2: 32 },
  hard: { 5: 16, 4: 26, 3: 36, 2: 48 },
};

export function getStars(difficulty: Difficulty, flips: number): number {
  const thresholds = STAR_THRESHOLDS[difficulty];
  if (flips <= thresholds[5]) return 5;
  if (flips <= thresholds[4]) return 4;
  if (flips <= thresholds[3]) return 3;
  if (flips <= thresholds[2]) return 2;
  return 1;
}

export function shuffleCards(items: VocabItem[]): Card[] {
  const cards: Card[] = [...items, ...items].map((item, i) => ({
    ...item,
    cardIndex: i,
    isMatched: false,
  }));
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}
