"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Message } from "@/types";
import { Trash2, Mail, MailOpen, Send, Reply, X } from "lucide-react";
import SpellCheck from "@/components/admin/SpellCheck";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");

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

  const handleReply = async () => {
    if (!replying || !replyText.trim()) return;
    await fetch("/api/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: replying.id, reply: replyText.trim() }),
    });
    setReplying(null);
    setReplyText("");
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
                  onClick={() => {
                    setReplying(message);
                    setReplyText(message.reply || "");
                  }}
                  className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                  title="Répondre"
                >
                  <Reply size={16} />
                </button>
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
              {message.reply && (
                <div className="mt-3 p-3 rounded-md bg-primary/5 border border-primary/20">
                  <p className="text-xs font-medium text-primary mb-1 flex items-center gap-1">
                    <Send size={12} /> Votre réponse
                  </p>
                  <p className="text-sm text-muted-foreground">{message.reply}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {replying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-xl border border-border shadow-lg w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Répondre à {replying.name}</h2>
              <button
                onClick={() => { setReplying(null); setReplyText(""); }}
                className="p-1 rounded-md hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Message original</p>
                <p className="text-sm text-foreground bg-muted p-3 rounded-md">{replying.content}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Votre réponse</p>
                <div className="space-y-1">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    placeholder="Écrivez votre réponse..."
                  />
                  <SpellCheck text={replyText} onApply={(v) => setReplyText(v)} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-border">
              <button
                onClick={() => { setReplying(null); setReplyText(""); }}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Envoyer la réponse
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
