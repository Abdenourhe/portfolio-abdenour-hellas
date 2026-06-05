"use client";

import { useState, useCallback } from "react";
import { Check, X, Loader2, Wand2 } from "lucide-react";

interface Match {
  message: string;
  offset: number;
  length: number;
  replacements: { value: string }[];
  context: { text: string; offset: number; length: number };
}

interface SpellCheckProps {
  text: string;
  lang?: string;
  onApply: (corrected: string) => void;
  label?: string;
}

export default function SpellCheck({ text, lang = "fr", onApply, label }: SpellCheckProps) {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [appliedCount, setAppliedCount] = useState(0);

  const check = useCallback(async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setAppliedCount(0);
    try {
      const params = new URLSearchParams();
      params.append("text", text);
      params.append("language", lang);
      params.append("enabledOnly", "false");
      const res = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();
      setMatches(data.matches || []);
      setOpen(true);
    } catch (e) {
      setError("Impossible de vérifier l'orthographe.");
    } finally {
      setLoading(false);
    }
  }, [text, lang]);

  const applyReplacement = (match: Match, replacement: string) => {
    const before = text.slice(0, match.offset);
    const after = text.slice(match.offset + match.length);
    const corrected = before + replacement + after;
    onApply(corrected);
    setMatches((prev) => prev.filter((m) => m !== match));
    setAppliedCount((c) => c + 1);
  };

  const ignoreMatch = (match: Match) => {
    setMatches((prev) => prev.filter((m) => m !== match));
  };

  if (!text.trim()) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={check}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C9A962] hover:text-[#C9A962]/80 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />}
        {label || "Vérifier l'orthographe"}
      </button>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {open && matches.length > 0 && (
        <div className="absolute z-50 mt-2 w-80 max-h-72 overflow-y-auto rounded-lg border border-border bg-card shadow-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">{matches.length} suggestion(s)</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          </div>
          {matches.map((match, i) => (
            <div key={i} className="rounded-md border border-border bg-background p-2 text-xs space-y-1.5">
              <p className="text-muted-foreground">{match.message}</p>
              <p className="font-mono text-red-400 bg-red-400/10 inline-block px-1 rounded">
                {match.context.text.slice(match.context.offset, match.context.offset + match.context.length)}
              </p>
              <div className="flex flex-wrap gap-1">
                {match.replacements.slice(0, 4).map((r, j) => (
                  <button
                    key={j}
                    type="button"
                    onClick={() => applyReplacement(match, r.value)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#C9A962]/20 text-[#1E3A5F] dark:text-foreground font-medium hover:bg-[#C9A962]/30 transition-colors"
                  >
                    <Check size={10} />
                    {r.value}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => ignoreMatch(match)}
                  className="px-2 py-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Ignorer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && matches.length === 0 && !loading && (
        <div className="absolute z-50 mt-2 w-64 rounded-lg border border-border bg-card shadow-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-green-600">
              {appliedCount > 0 ? `${appliedCount} correction(s) appliquée(s) ✓` : "Aucune faute détectée ✓"}
            </span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
