"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Upload, FileText, X } from "lucide-react";
import SpellCheck from "@/components/admin/SpellCheck";
import { DEFAULT_CV_PAGE_RANGES } from "@/lib/cvPages";
import LangTabs, { AdminLang, fieldKey } from "@/components/admin/LangTabs";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [loadingCV, setLoadingCV] = useState(false);
  const [activeLang, setActiveLang] = useState<AdminLang>("fr");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data || {});
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    // Send only text fields to avoid huge base64 payloads
    const payload = {
      fullName: profile.fullName,
      title: profile.title,
      titleEn: profile.titleEn,
      titleAr: profile.titleAr,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      bio: profile.bio,
      bioEn: profile.bioEn,
      bioAr: profile.bioAr,
      linkedin: profile.linkedin,
      github: profile.github,
      twitter: profile.twitter,
      facebook: profile.facebook,
      instagram: profile.instagram,
      whatsapp: profile.whatsapp,
      photoUrl: profile.photoUrl,
      cvUrl: profile.cvUrl,
      cvFileName: profile.cvFileName,
      cvPageRanges: profile.cvPageRanges,
    };

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMessage("Profil mis à jour avec succès");
    } else {
      const err = await res.json().catch(() => ({}));
      setMessage("Erreur : " + (err.error || "Mise à jour échouée"));
    }
    setSaving(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingPhoto(true);
    setMessage("");
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setProfile({ ...profile, photoUrl: base64 });
      setMessage("Photo prête — clique sur Enregistrer pour sauvegarder");
      setLoadingPhoto(false);
    };
    reader.onerror = () => {
      setMessage("Erreur lors de la lecture de la photo");
      setLoadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingCV(true);
    setMessage("");
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setProfile({ ...profile, cvUrl: base64, cvFileName: file.name });
      setMessage("CV prêt — clique sur Enregistrer pour sauvegarder");
      setLoadingCV(false);
    };
    reader.onerror = () => {
      setMessage("Erreur lors de la lecture du CV");
      setLoadingCV(false);
    };
    reader.readAsDataURL(file);
  };

  const getPageRange = (lang: "fr" | "en" | "ar"): [number, number] => {
    const ranges = profile.cvPageRanges || DEFAULT_CV_PAGE_RANGES;
    const range = ranges?.[lang] || DEFAULT_CV_PAGE_RANGES[lang];
    return [range[0], range[1]];
  };

  const setPageRange = (lang: "fr" | "en" | "ar", index: 0 | 1, value: number) => {
    const current = profile.cvPageRanges || DEFAULT_CV_PAGE_RANGES;
    const currentRange = current[lang] || DEFAULT_CV_PAGE_RANGES[lang];
    const nextRange = [...currentRange];
    nextRange[index] = value;
    setProfile({
      ...profile,
      cvPageRanges: { ...current, [lang]: nextRange },
    });
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
      <h1 className="text-3xl font-bold mb-8">Profil</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="Photo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-primary">AH</span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Photo de profil</label>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
              <Upload size={16} />
              {loadingPhoto ? "Chargement..." : "Changer la photo"}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium mb-1">Langue des champs traduisibles (Titre, Bio)</span>
          <LangTabs value={activeLang} onChange={setActiveLang} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom complet</label>
            <input type="text" value={profile.fullName || ""} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" />
            <SpellCheck text={profile.fullName || ""} onApply={(v) => setProfile({ ...profile, fullName: v })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Titre ({activeLang.toUpperCase()})</label>
            <input
              type="text"
              value={profile[fieldKey("title", activeLang)] || ""}
              onChange={(e) => setProfile({ ...profile, [fieldKey("title", activeLang)]: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
            />
            <SpellCheck
              text={profile[fieldKey("title", activeLang)] || ""}
              onApply={(v) => setProfile({ ...profile, [fieldKey("title", activeLang)]: v })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" value={profile.email || ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Téléphone</label>
            <input type="text" value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Adresse</label>
            <input type="text" value={profile.location || ""} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" />
            <SpellCheck text={profile.location || ""} onApply={(v) => setProfile({ ...profile, location: v })} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bio ({activeLang.toUpperCase()})</label>
          <textarea
            rows={4}
            value={profile[fieldKey("bio", activeLang)] || ""}
            onChange={(e) => setProfile({ ...profile, [fieldKey("bio", activeLang)]: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
          />
          <SpellCheck
            text={profile[fieldKey("bio", activeLang)] || ""}
            onApply={(v) => setProfile({ ...profile, [fieldKey("bio", activeLang)]: v })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">CV PDF (un seul fichier, multilingue)</label>
          <div className="flex items-center gap-4">
            {profile.cvUrl && (
              <>
                <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                  <FileText size={16} className="inline mr-1" />
                  {profile.cvFileName || "cv.pdf"}
                </a>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, cvUrl: null, cvFileName: null })}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors"
                >
                  <X size={14} />
                  Retirer
                </button>
              </>
            )}
            <label className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors cursor-pointer">
              <Upload size={16} />
              {loadingCV ? "Chargement..." : (profile.cvUrl ? "Changer le CV" : "Uploader un CV")}
              <input type="file" accept=".pdf" className="hidden" onChange={handleCVUpload} />
            </label>
          </div>

          {profile.cvUrl && (
            <div className="mt-4 p-4 rounded-lg border border-border bg-background/50">
              <p className="text-sm font-medium mb-3">Pages par langue</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(["fr", "en", "ar"] as const).map((lang) => {
                  const [start, end] = getPageRange(lang);
                  const langLabel = lang === "fr" ? "Français" : lang === "en" ? "English" : "العربية";
                  return (
                    <div key={lang}>
                      <span className="block text-xs text-muted-foreground mb-1">{langLabel}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          value={start}
                          onChange={(e) => setPageRange(lang, 0, Number(e.target.value))}
                          className="w-16 px-2 py-1.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-sm"
                        />
                        <span className="text-muted-foreground text-sm">à</span>
                        <input
                          type="number"
                          min={1}
                          value={end}
                          onChange={(e) => setPageRange(lang, 1, Number(e.target.value))}
                          className="w-16 px-2 py-1.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-sm"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Indique les pages du PDF correspondant à chaque langue (ex : 1 à 2 pour le français). L&apos;affichage et le téléchargement s&apos;adaptent automatiquement à la langue du site.
              </p>
            </div>
          )}
        </div>

        {message && (
          <p className={`text-sm ${(message.includes("succès") || message.includes("prêt")) ? "text-secondary" : "text-destructive"}`}>{message}</p>
        )}

        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
          <Save size={18} />
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </motion.div>
  );
}
