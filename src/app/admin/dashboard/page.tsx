"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Download, MessageSquare, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({ visits: 0, downloads: 0, messages: 0, unreadMessages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Visites", value: stats.visits, icon: Eye },
    { label: "Téléchargements", value: stats.downloads, icon: Download },
    { label: "Messages", value: stats.messages, icon: MessageSquare },
    { label: "Non lus", value: stats.unreadMessages, icon: TrendingUp },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight mb-8">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-5 rounded-xl border border-border bg-card"
          >
            <div className="flex items-center justify-between mb-3">
              <card.icon size={15} className="text-muted-foreground" />
            </div>
            <p className="text-2xl font-semibold tracking-tight">
              {loading ? "—" : card.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-5 rounded-xl border border-border bg-card">
        <h2 className="text-sm font-medium text-foreground mb-1">Bienvenue</h2>
        <p className="text-sm text-muted-foreground">
          Utilisez la barre latérale pour gérer votre portfolio.
        </p>
      </div>
    </div>
  );
}
