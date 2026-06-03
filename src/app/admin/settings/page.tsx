"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Globe, Code } from "lucide-react";

function TwitterIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function WhatsAppIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        linkedin: profile.linkedin,
        github: profile.github,
        twitter: profile.twitter,
        facebook: profile.facebook,
        instagram: profile.instagram,
        whatsapp: profile.whatsapp,
      }),
    });

    if (res.ok) {
      setMessage("Paramètres enregistrés avec succès");
    } else {
      setMessage("Erreur lors de l'enregistrement");
    }
    setSaving(false);
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
      <h1 className="text-3xl font-bold mb-8">Paramètres</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Réseaux sociaux</h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Globe size={16} className="text-blue-500" />
                LinkedIn
              </label>
              <input
                type="url"
                value={profile.linkedin || ""}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Code size={16} className="text-gray-500" />
                GitHub
              </label>
              <input
                type="url"
                value={profile.github || ""}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <TwitterIcon className="text-sky-500" size={16} />
                Twitter / X
              </label>
              <input
                type="url"
                value={profile.twitter || ""}
                onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <FacebookIcon className="text-blue-600" size={16} />
                Facebook
              </label>
              <input
                type="url"
                value={profile.facebook || ""}
                onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <InstagramIcon className="text-pink-500" size={16} />
                Instagram
              </label>
              <input
                type="url"
                value={profile.instagram || ""}
                onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <WhatsAppIcon className="text-green-500" size={16} />
                WhatsApp
              </label>
              <input
                type="url"
                value={profile.whatsapp || ""}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                placeholder="https://wa.me/..."
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {message && (
          <p className={`text-sm ${message.includes("succès") ? "text-green-500" : "text-destructive"}`}>{message}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </motion.div>
  );
}
