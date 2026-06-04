"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Upload, FileText } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);

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

    setUploadingPhoto(true);
    setMessage("");
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const formData = new FormData();
      formData.append("base64", base64);
      formData.append("type", "photo");

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok && data.url) {
          setProfile({ ...profile, photoUrl: data.url });
          setMessage("Photo uploadée avec succès");
        } else {
          setMessage("Erreur upload : " + (data.error || "Service indisponible"));
        }
      } catch (err) {
        setMessage("Erreur réseau lors de l'upload");
      }
      setUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCV(true);
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "cv");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setProfile({ ...profile, cvUrl: data.url, cvFileName: data.fileName });
        setMessage("CV uploadé avec succès");
      } else {
        setMessage("Erreur upload CV : " + (data.error || "Service indisponible"));
      }
    } catch (err) {
      setMessage("Erreur réseau lors de l'upload");
    }
    setUploadingCV(false);
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
              {uploadingPhoto ? "Upload..." : "Changer la photo"}
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
              {uploadingCV ? "Upload..." : "Uploader un CV"}
              <input type="file" accept=".pdf" className="hidden" onChange={handleCVUpload} />
            </label>
          </div>
        </div>

        {message && (
          <p className={`text-sm ${message.includes("succès") ? "text-green-500" : "text-destructive"}`}>{message}</p>
        )}

        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
          <Save size={18} />
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </motion.div>
  );
}
