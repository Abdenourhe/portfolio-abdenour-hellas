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
      });
  }, []);

  const cards = [
    { label: "Visites", value: stats.visits, icon: Eye, color: "bg-blue-500" },
    { label: "Téléchargements CV", value: stats.downloads, icon: Download, color: "bg-green-500" },
    { label: "Messages", value: stats.messages, icon: MessageSquare, color: "bg-purple-500" },
    { label: "Messages non lus", value: stats.unreadMessages, icon: TrendingUp, color: "bg-orange-500" },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.color} text-white`}>
                  <card.icon size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold">{loading ? "..." : card.value}</p>
              <p className="text-muted-foreground text-sm">{card.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-xl bg-card border border-border">
          <h2 className="text-xl font-semibold mb-4">Bienvenue, Abdenour !</h2>
          <p className="text-muted-foreground">
            Utilisez la barre latérale pour naviguer entre les différentes sections de l&apos;administration.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
