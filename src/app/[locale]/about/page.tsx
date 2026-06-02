"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Trophy, Bike, Waves, Plane } from "lucide-react";

const interests = [
  { name: "Football", icon: Trophy },
  { name: "Vélo", icon: Bike },
  { name: "Natation", icon: Waves },
  { name: "Voyages", icon: Plane },
];

export default function AboutPage() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">À propos de moi</h1>
        
        <div className="max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-primary to-secondary p-1 flex-shrink-0">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <span className="text-4xl md:text-5xl font-bold text-primary">AH</span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">Abdenour Hellas</h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Déterminé, sérieux, autonome et conscient du travail qui m&apos;attend, 
                je suis persuadé que je serais un élément moteur au sein de votre structure !
              </p>
              <div className="mt-4 space-y-1.5 md:space-y-2">
                <p className="text-xs md:text-sm"><span className="font-medium">Email:</span> Abdenour.Hellas@uqat.ca</p>
                <p className="text-xs md:text-sm"><span className="font-medium">Téléphone:</span> 418-350-5686</p>
                <p className="text-xs md:text-sm"><span className="font-medium">Adresse:</span> 3490 Rue Principale, Baker-Brook, NB E7A 1Z6</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center">Centres d&apos;intérêt</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.name}
                initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 md:p-6 rounded-xl bg-card border border-border text-center hover:border-primary transition-colors"
              >
                <interest.icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 md:mb-3 text-primary" />
                <p className="font-medium text-sm md:text-base">{interest.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
