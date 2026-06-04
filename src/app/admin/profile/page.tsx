"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Upload, FileText } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [loadingCV, setLoadingCV] = useState(false);

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
      body: JSON.stringify(profile),
    });

    if (res.ok) {
      setMessage("Profil mis à jour avec succès");
    } else {
      setMessage("Erreur lors de la mise à jour");
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom complet</label>
            <input type="text" value={profile.fullName || ""} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Titre</label>
            <input type="text" value={profile.title || ""} onChange={(e) => setProfile({ ...profile, title: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" value={profile.email || ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Téléphone</label>
            <input type="text" value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea rows={4} value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">CV PDF</label>
          <div className="flex items-center gap-4">
            {profile.cvUrl && (
              <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                <FileText size={16} className="inline mr-1" />
                {profile.cvFileName || "cv.pdf"}
              </a>
            )}
            <label className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors cursor-pointer">
              <Upload size={16} />
              {loadingCV ? "Chargement..." : "Uploader un CV"}
              <input type="file" accept=".pdf" className="hidden" onChange={handleCVUpload} />
            </label>
          </div>
        </div>

        {message && (
          <p className={`text-sm ${(message.includes("succès") || message.includes("prêt")) ? "text-green-500" : "text-destructive"}`}>{message}</p>
        )}

        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
          <Save size={18} />
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </motion.div>
  );
}
