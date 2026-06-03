"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Bike, Waves, Plane, MapPin, Mail, Phone } from "lucide-react";
import SocialIcons from "@/components/public/SocialIcons";
import SectionHeader from "@/components/public/SectionHeader";
import { Skeleton } from "@/components/public/Skeleton";

const interests = [
  { name: "Football", icon: Trophy },
  { name: "Vélo", icon: Bike },
  { name: "Natation", icon: Waves },
  { name: "Voyages", icon: Plane },
];

export default function AboutPage() {
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <Skeleton className="w-40 h-40 rounded-full flex-shrink-0" />
          <div className="space-y-3 w-full">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
      <SectionHeader
        title="À propos"
        subtitle="Passionné par l'innovation technique et la résolution de problèmes complexes."
      />

      <div className="max-w-3xl mx-auto mt-16">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0 mx-auto md:mx-0"
          >
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden ring-1 ring-border bg-muted">
              {profile?.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl font-semibold text-muted-foreground">
                    {profile?.fullName?.split(" ").map((n: string) => n[0]).join("") || "AH"}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 text-center md:text-left"
          >
            <h2 className="text-xl font-semibold text-foreground">
              {profile?.fullName || "Abdenour Hellas"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {profile?.title || "Ingénieur en Génie Électrique"}
            </p>

            <div className="mt-5 flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground">
              {profile?.email && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={13} />
                  {profile.email}
                </span>
              )}
              {profile?.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={13} />
                  {profile.phone}
                </span>
              )}
              {profile?.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={13} />
                  {profile.location}
                </span>
              )}
            </div>

            <p className="mt-5 text-sm md:text-base text-muted-foreground leading-relaxed">
              {profile?.bio || "Déterminé, sérieux, autonome et conscient du travail qui m'attend, je suis persuadé que je serais un élément moteur au sein de votre structure."}
            </p>

            <div className="mt-6 flex justify-center md:justify-start">
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

      <div className="max-w-3xl mx-auto mt-20">
        <SectionHeader title="Centres d'intérêt" subtitle="" />
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
          {interests.map((interest, index) => (
            <motion.div
              key={interest.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group p-5 rounded-xl border border-border bg-card text-center hover:border-foreground/20 transition-colors"
            >
              <interest.icon className="w-5 h-5 mx-auto mb-2.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <p className="text-sm font-medium text-foreground">{interest.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
