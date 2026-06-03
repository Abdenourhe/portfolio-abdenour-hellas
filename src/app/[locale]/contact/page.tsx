"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Globe, Code, Mail, Phone, MapPin, Send, Download, CheckCircle, XCircle } from "lucide-react";
import { z } from "zod";
import SocialIcons from "@/components/public/SocialIcons";

const contactSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(2, "Sujet trop court"),
  content: z.string().min(10, "Message trop court"),
});

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", content: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setStatus("idle");

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0] && typeof err.path[0] === 'string') newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", content: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadCV = async () => {
    await fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "cv_download" }),
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Me contacter</h1>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Informations de contact</h2>
            <div className="space-y-3 mb-6 md:mb-8">
              <a href="mailto:Abdenour.Hellas@uqat.ca" className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-card border border-border hover:border-primary transition-colors">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm md:text-base break-all">Abdenour.Hellas@uqat.ca</span>
              </a>
              <a href="tel:418-350-5686" className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-card border border-border hover:border-primary transition-colors">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm md:text-base">418-350-5686</span>
              </a>
              <div className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-card border border-border">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm md:text-base">3490 Rue Principale, Baker-Brook, NB E7A 1Z6</span>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Réseaux sociaux</h2>
            <SocialIcons className="mb-6 md:mb-8" />

            <a
              href="/uploads/cv.pdf"
              onClick={handleDownloadCV}
              className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm md:text-base"
            >
              <Download size={16} />
              Télécharger mon CV
            </a>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Envoyer un message</h2>
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Nom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2.5 md:px-4 md:py-3 rounded-lg bg-card border focus:outline-none text-sm md:text-base transition-all ${errors.name ? "border-destructive" : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"}`}
                />
                {errors.name && <p className="text-destructive text-xs md:text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2.5 md:px-4 md:py-3 rounded-lg bg-card border focus:outline-none text-sm md:text-base transition-all ${errors.email ? "border-destructive" : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"}`}
                />
                {errors.email && <p className="text-destructive text-xs md:text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Sujet"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={`w-full px-3 py-2.5 md:px-4 md:py-3 rounded-lg bg-card border focus:outline-none text-sm md:text-base transition-all ${errors.subject ? "border-destructive" : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"}`}
                />
                {errors.subject && <p className="text-destructive text-xs md:text-sm mt-1">{errors.subject}</p>}
              </div>
              <div>
                <textarea
                  placeholder="Message"
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className={`w-full px-3 py-2.5 md:px-4 md:py-3 rounded-lg bg-card border focus:outline-none resize-none text-sm md:text-base transition-all ${errors.content ? "border-destructive" : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"}`}
                />
                {errors.content && <p className="text-destructive text-xs md:text-sm mt-1">{errors.content}</p>}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm md:text-base"
              >
                <Send size={16} />
                {submitting ? "Envoi..." : "Envoyer"}
              </button>

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-500 text-sm"
                >
                  <CheckCircle size={16} />
                  Message envoyé avec succès !
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
                >
                  <XCircle size={16} />
                  Une erreur s&apos;est produite. Veuillez réessayer.
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
