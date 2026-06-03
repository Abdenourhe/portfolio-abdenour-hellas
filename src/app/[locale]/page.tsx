"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Send, Download, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import SocialIcons from "@/components/public/SocialIcons";
import { Skeleton } from "@/components/public/Skeleton";

export default function HomePage() {
  return <HomeClient />;
}

function HomeClient() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDownloadCV = async () => {
    await fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "cv_download" }),
    });
    if (profile?.cvUrl) {
      window.open(profile.cvUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-20">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <Skeleton className="w-48 h-48 md:w-56 md:h-56 rounded-full flex-shrink-0" />
            <div className="text-center lg:text-left space-y-4 max-w-xl w-full">
              <Skeleton className="h-4 w-24 mx-auto lg:mx-0" />
              <Skeleton className="h-12 w-3/4 mx-auto lg:mx-0" />
              <Skeleton className="h-6 w-1/2 mx-auto lg:mx-0" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-3 justify-center lg:justify-start pt-2">
                <Skeleton className="h-10 w-32 rounded-lg" />
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-20 lg:py-0">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex-shrink-0"
          >
            <div className="w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden ring-1 ring-border bg-muted">
              {profile?.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-5xl font-semibold text-muted-foreground">
                    {profile?.fullName?.split(" ").map((n: string) => n[0]).join("") || "AH"}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:text-left max-w-xl"
          >
            <p className="text-sm text-muted-foreground tracking-wide uppercase mb-3">
              Ingénieur en Génie Électrique
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
              {profile?.fullName || "Abdenour Hellas"}
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
              {profile?.bio || "Déterminé, sérieux, autonome et conscient du travail qui m'attend, je suis persuadé que je serais un élément moteur au sein de votre structure."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                href="/fr/cv"
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                <FileText size={15} />
                Voir mon CV
                <ArrowRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </Link>
              <Link
                href="/fr/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                <Send size={15} />
                Me contacter
              </Link>
              {profile?.cvUrl && (
                <button
                  onClick={handleDownloadCV}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-muted-foreground rounded-lg text-sm font-medium hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Download size={15} />
                  Télécharger
                </button>
              )}
            </div>

            <div className="mt-8 flex justify-center lg:justify-start">
              <SocialIcons
                linkedin={profile?.linkedin}
                github={profile?.github}
                twitter={profile?.twitter}
                facebook={profile?.facebook}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
