"use client";

import { useState, useEffect } from "react";

interface TypeWriterPhrasesProps {
  phrases: string[];
  speed?: number;
  deleteSpeed?: number;
  pause?: number;
  className?: string;
  delay?: number;
}

export default function TypeWriterPhrases({
  phrases,
  speed = 55,
  deleteSpeed = 25,
  pause = 2000,
  className = "",
  delay = 0,
}: TypeWriterPhrasesProps) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setPhraseIndex(0);
    setIsDeleting(false);
    setStarted(false);
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [phrases, delay]);

  useEffect(() => {
    if (!started || phrases.length === 0) return;

    const currentPhrase = phrases[phraseIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayed.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setDisplayed(currentPhrase.slice(0, displayed.length + 1));
        }, speed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), pause);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, displayed.length - 1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [started, phrases, phraseIndex, isDeleting, displayed, speed, deleteSpeed, pause]);

  return (
    <span className={className}>
      {displayed}
      <span className="inline-block w-[2px] h-[0.9em] bg-secondary ml-0.5 align-middle animate-cursor-blink" />
    </span>
  );
}
