"use client";

import { motion } from "framer-motion";
import { Trophy, Bike, Waves, Plane, MapPin, Mail, Phone } from "lucide-react";
import SocialIcons from "@/components/public/SocialIcons";
import SectionHeader from "@/components/public/SectionHeader";
import { useT } from "@/components/public/I18nProvider";
import { useLocale } from "@/hooks/useLocale";

interface AboutPageClientProps {
  profile: any;
}

const interests = [
  { name: "Football", icon: Trophy },
  { name: "Vélo", icon: Bike },
  { name: "Natation", icon: Waves },
  { name: "Voyages", icon: Plane },
];

export default function AboutPageClient({ profile }: AboutPageClientProps) {
  const t = useT();
  const locale = useLocale();

  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
      <SectionHeader title={t("about.title")} subtitle={t("about.subtitle")} />

      <div className="max-w-3xl mx-auto mt-16">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0 mx-auto md:mx-0"
          >
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden ring-2 ring-primary/20 bg-muted">
              {profile?.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl font-semibold text-primary/40">
                    {profile?.fullName?.split(" ").map((n: string) => n[0]).join("") || "AH"}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 text-center md:text-left"
          >
            <h2 className="text-xl font-semibold text-primary">
              {profile?.fullName || "Abdenour Hellas"}
            </h2>
            <p className="text-sm text-secondary mt-1 font-medium">
              {profile?.title || t("hero.title")}
            </p>

            <div className="mt-5 flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground">
              {profile?.email && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={13} className="text-primary/60" />
                  {profile.email}
                </span>
              )}
              {profile?.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={13} className="text-primary/60" />
                  {profile.phone}
                </span>
              )}
              {profile?.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={13} className="text-primary/60" />
                  {profile.location}
                </span>
              )}
            </div>

            <p className="mt-5 text-sm md:text-base text-muted-foreground leading-relaxed">
              {locale === "ar" && profile?.bioAr ? profile.bioAr : locale === "en" && profile?.bioEn ? profile.bioEn : profile?.bio || t("hero.subtitle")}
            </p>

            <div className="mt-6 flex justify-center md:justify-start">
              <SocialIcons
                linkedin={profile?.linkedin}
                github={profile?.github}
                twitter={profile?.twitter}
                facebook={profile?.facebook}
                instagram={profile?.instagram}
                whatsapp={profile?.whatsapp}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-20">
        <SectionHeader title={t("about.interests")} subtitle="" />
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
          {interests.map((interest, index) => (
            <motion.div
              key={interest.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group p-5 rounded-xl border border-border bg-card text-center hover:border-primary/30 transition-colors"
            >
              <interest.icon className="w-5 h-5 mx-auto mb-2.5 text-primary/50 group-hover:text-primary transition-colors" />
              <p className="text-sm font-medium text-primary">{interest.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
