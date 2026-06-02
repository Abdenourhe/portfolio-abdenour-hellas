"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Globe, Code, Mail, FileText, Send } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  return <HomeClient />;
}

function HomeClient() {
  const [text, setText] = useState("");
  const fullText = "Ingénieur en Génie Électrique";
  const reducedMotion = useReducedMotion();

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
  }, [reducedMotion]);

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden px-4 py-12 md:py-0">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex-shrink-0"
          >
            <div className="w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">AH</span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl -z-10" />
          </motion.div>

          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center lg:text-left max-w-xl"
          >
            <p className="text-muted-foreground text-sm md:text-base mb-2">Bonjour, je suis</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-foreground">Abdenour </span>
              <span className="text-primary">Hellas</span>
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
              Déterminé, sérieux, autonome et conscient du travail qui m&apos;attend, 
              je suis persuadé que je serais un élément moteur au sein de votre structure !
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6 md:mb-8">
              <Link
                href="/fr/cv"
                className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm md:text-base"
              >
                <FileText size={16} />
                Voir mon CV
              </Link>
              <Link
                href="/fr/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-sm md:text-base"
              >
                <Send size={16} />
                Me contacter
              </Link>
            </div>
            <div className="flex gap-3 justify-center lg:justify-start">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 md:p-3 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Globe size={18} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 md:p-3 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Code size={18} />
              </a>
              <a
                href="mailto:Abdenour.Hellas@uqat.ca"
                className="p-2.5 md:p-3 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
