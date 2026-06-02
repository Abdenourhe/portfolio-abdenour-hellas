"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Message } from "@/types";
import { Trash2, Mail, MailOpen } from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      });
  };

  const toggleRead = async (message: Message) => {
    await fetch("/api/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: message.id, read: !message.read }),
    });
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce message ?")) return;
    await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
    fetchMessages();
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="h-64 bg-muted rounded" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold mb-8">Messages</h1>

      <div className="space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg border transition-colors ${
              message.read
                ? "bg-card border-border"
                : "bg-primary/5 border-primary"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleRead(message)}
                  className="text-primary hover:text-primary/80"
                >
                  {message.read ? <MailOpen size={18} /> : <Mail size={18} />}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{message.name}</h3>
                    {!message.read && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-white">
                        Non lu
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{message.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {new Date(message.createdAt).toLocaleDateString("fr-CA")}
                </span>
                <button
                  onClick={() => handleDelete(message.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="mt-3 ml-9">
              <p className="font-medium text-sm">{message.subject}</p>
              <p className="text-sm text-muted-foreground mt-1">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
