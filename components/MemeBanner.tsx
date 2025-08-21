import { useMemo } from 'react';

const memes = [
  "When Lambo? 🚗💨",
  "Buy HMESH, get rich* (*in memes) 😂",
  "Presale: Because your doge needs a friend 🐶",
  "Serious dApp, unserious UI 😎",
  "Crypto is risky, but this UI is riskier! 🎲",
  "If you can read this, you’re early! 🥳",
  "May your bags be heavy and your memes be dank 💰🦄",
  "Presale: The only place where FOMO is fun! 🤡",
  "Click fast, moon faster! 🚀🌝",
  "Not financial advice, just meme advice. 🧠"
];

export default function MemeBanner() {
  const meme = useMemo(() => {
    return memes[Math.floor(Math.random() * memes.length)];
  }, []);
  return <div className="meme">{meme}</div>;
} 