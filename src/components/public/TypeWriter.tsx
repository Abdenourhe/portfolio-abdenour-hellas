"use client";

import { useState, useEffect } from "react";

interface TypeWriterProps {
  text: string;
  speed?: number;
  className?: string;
  delay?: number;
}

export default function TypeWriter({ text, speed = 55, className = "", delay = 0 }: TypeWriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setStarted(false);
    setDone(false);
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      setDone(true);
      return;
    }
    const interval = setInterval(() => {
      setDisplayed((prev) => {
        const next = text.slice(0, prev.length + 1);
        if (next.length >= text.length) {
          setDone(true);
        }
        return next;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed, displayed.length]);

  return (
    <span className={className}>
      {displayed}
      {!done && (
        <span className="inline-block w-[2px] h-[0.9em] bg-secondary ml-0.5 align-middle animate-cursor-blink" />
      )}
    </span>
  );
}
