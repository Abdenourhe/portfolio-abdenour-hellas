"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FileText, Send, Download } from "lucide-react";
import { useEffect, useState } from "react";
import SocialIcons from "@/components/public/SocialIcons";

export default function HomePage() {
  return <HomeClient />;
}

function HomeClient() {
  const [profile, setProfile] = useState<any>(null);
  const [text, setText] = useState("");
  const fullText = profile?.title || "Ingénieur en Génie Électrique";
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => setProfile(data));
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setText(fullText);
      return;
    }
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, [fullText, reducedMotion]);

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

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden px-4 py-12 md:py-0">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative flex-shrink-0"
          >
            <div className="w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-1">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                {profile?.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">AH</span>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl -z-10 animate-pulse" />
          </motion.div>

          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-center lg:text-left max-w-xl"
          >
            <p className="text-muted-foreground text-sm md:text-base mb-2">Bonjour, je suis</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-foreground">{profile?.fullName?.split(" ")[0] || "Abdenour"} </span>
              <span className="text-primary">{profile?.fullName?.split(" ")[1] || "Hellas"}</span>
            </h1>
            <div className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-4 md:mb-6 min-h-[1.75rem]">
              <span className="inline-block">{text}</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-0.5 h-5 md:h-6 bg-primary ml-1 align-middle"
              />
            </div>
            <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-6 md:mb-8 leading-relaxed">
              {profile?.bio || "Déterminé, sérieux, autonome et conscient du travail qui m'attend, je suis persuadé que je serais un élément moteur au sein de votre structure !"}
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6 md:mb-8">
              <Link
                href="/fr/cv"
                className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all hover:scale-105 hover:shadow-lg text-sm md:text-base"
              >
                <FileText size={16} />
                Voir mon CV
              </Link>
              <Link
                href="/fr/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-all hover:scale-105 text-sm md:text-base"
              >
                <Send size={16} />
                Me contacter
              </Link>
              {profile?.cvUrl && (
                <button
                  onClick={handleDownloadCV}
                  className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-all hover:scale-105 hover:shadow-lg text-sm md:text-base"
                >
                  <Download size={16} />
                  Télécharger CV
                </button>
              )}
            </div>
            <SocialIcons
              linkedin={profile?.linkedin}
              github={profile?.github}
              twitter={profile?.twitter}
              facebook={profile?.facebook}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
