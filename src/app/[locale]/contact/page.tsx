"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, XCircle, FileText } from "lucide-react";
import { z } from "zod";
import SocialIcons from "@/components/public/SocialIcons";
import SectionHeader from "@/components/public/SectionHeader";
import { useT } from "@/components/public/I18nProvider";
import { useLocale, useLocalizedPath } from "@/components/public/useLocale";

const contactSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(2, "Sujet trop court"),
  content: z.string().min(10, "Message trop court"),
});

export default function ContactPage() {
  const t = useT();
  useLocale();
  const cvPath = useLocalizedPath("/cv");
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", content: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => setProfile(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setStatus("idle");

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0] && typeof err.path[0] === "string") newErrors[err.path[0]] = err.message;
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
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
      <SectionHeader title={t("contact.title")} subtitle={t("contact.subtitle")} />

      <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-base font-semibold text-primary mb-5">{t("contact.info")}</h2>
          <div className="space-y-2">
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors group"
              >
                <Mail className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors flex-shrink-0" />
                <span className="text-sm text-foreground break-all">{profile.email}</span>
              </a>
            )}
            {profile?.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors group"
              >
                <Phone className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors flex-shrink-0" />
                <span className="text-sm text-foreground">{profile.phone}</span>
              </a>
            )}
            {profile?.location && (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                <MapPin className="w-4 h-4 text-primary/60 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{profile.location}</span>
              </div>
            )}
          </div>

          <h2 className="text-base font-semibold text-primary mt-8 mb-4">{t("contact.social")}</h2>
          <SocialIcons />

          <a
            href="/cv/Abdenour_Hellas_CV.pdf"
            download
            onClick={handleDownloadCV}
            className="mt-8 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors"
          >
            <FileText size={14} />
            {t("contact.downloadCv")}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-base font-semibold text-primary mb-5">{t("contact.sendMessage")}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder={t("contact.name")}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-lg bg-card border text-sm transition-colors placeholder:text-muted-foreground/60 ${
                  errors.name ? "border-destructive" : "border-border hover:border-primary/30 focus:border-primary focus:outline-none"
                }`}
              />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                type="email"
                placeholder={t("contact.email")}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-lg bg-card border text-sm transition-colors placeholder:text-muted-foreground/60 ${
                  errors.email ? "border-destructive" : "border-border hover:border-primary/30 focus:border-primary focus:outline-none"
                }`}
              />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder={t("contact.subject")}
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-lg bg-card border text-sm transition-colors placeholder:text-muted-foreground/60 ${
                  errors.subject ? "border-destructive" : "border-border hover:border-primary/30 focus:border-primary focus:outline-none"
                }`}
              />
              {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject}</p>}
            </div>
            <div>
              <textarea
                placeholder={t("contact.message")}
                rows={5}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-lg bg-card border text-sm resize-none transition-colors placeholder:text-muted-foreground/60 ${
                  errors.content ? "border-destructive" : "border-border hover:border-primary/30 focus:border-primary focus:outline-none"
                }`}
              />
              {errors.content && <p className="text-destructive text-xs mt-1">{errors.content}</p>}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send size={14} />
              {submitting ? t("contact.sending") : t("contact.send")}
            </button>

            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-secondary/15 text-[#8B6914] text-sm"
              >
                <CheckCircle size={14} />
                {t("contact.success")}
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
              >
                <XCircle size={14} />
                {t("contact.error")}
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
