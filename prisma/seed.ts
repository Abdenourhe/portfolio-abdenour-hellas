import { PrismaClient, EducationType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Reset seeded tables to avoid duplicates
  await prisma.article.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.interest.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.education.deleteMany({});
  await prisma.experience.deleteMany({});

  const adminEmail = (process.env.ADMIN_EMAIL || "contact@abdenour-hellas.online").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "Abdenour2026!";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Abdenour Hellas",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  await prisma.profile.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      fullName: "Abdenour Hellas",
      title: "Spécialiste en génie électrique & développement web",
      titleEn: "Electrical Engineering Specialist & Web Developer",
      titleAr: "أخصائي في الهندسة الكهربائية وتطوير الويب",
      email: "abdenour.hellas@gmail.com",
      phone: "+1 418-350-5686",
      location: "Baker-Brook, NB, Canada",
      bio: "Spécialiste en génie électrique avec double compétence en développement web, orienté vers la conception de systèmes électriques collaboratifs et l'automatisation industrielle. 5+ ans d'expérience internationale (Algérie, Canada) en maintenance, supervision et conception. Passionné par l'innovation énergétique et les solutions numériques. Recherche des opportunités à l'international.",
      bioEn: "Electrical engineering specialist with dual expertise in web development, focused on collaborative electrical systems design and industrial automation. 5+ years of international experience (Algeria, Canada) in maintenance, supervision and design. Passionate about energy innovation and digital solutions. Seeking opportunities in Canada, Europe and internationally.",
      bioAr: "أخصائي في الهندسة الكهربائية بخبرة مزدوجة في تطوير الويب، موجه نحو تصميم الأنظمة الكهربائية التعاونية والأتمتة الصناعية. أكثر من 5 سنوات من الخبرة الدولية (الجزائر، كندا) في الصيانة والإشراف والتصميم. شغوف بالابتكار الطاقي والحلول الرقمية. أبحث عن فرص في كندا وأوروبا وعالمياً.",
      linkedin: "https://www.linkedin.com/in/abdenour-hellas/",
      github: "https://github.com/Abdenourhe",
      twitter: "https://twitter.com",
      facebook: "https://facebook.com",
    },
  });

  const experiences = [
    {
      title: "Technicien en Génie Électrique",
      company: "Maisons Laprise",
      location: "Québec, QC",
      startDate: new Date("2025-12-01"),
      endDate: null,
      current: true,
      description: "Conception et maintenance du système collaboratif électrique TCOST (normes, standards, options de configuration). Développement d'une bibliothèque numérique complète : produits, prix, spécifications techniques, codes applicables. Formation de 15+ utilisateurs (électriciens, estimateurs, représentants) sur le système TCOST. Intégration de solutions innovantes : systèmes intelligents, efficacité énergétique, automatisations. Évolution continue du système pour projets résidentiels, multilogements et commerciaux.",
      category: "tech",
      order: 0,
    },
    {
      title: "Superviseur Département Électroménagers",
      company: "RONA",
      location: "Rouyn-Noranda, QC",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2025-11-30"),
      current: false,
      description: "Encadrement, formation et motivation d'une équipe de 5 conseillers pour atteindre les objectifs de vente et de service. Gestion des relations fournisseurs et suivi des factures/paiements. Organisation structurée des documents pour une traçabilité optimale. Supervision des inventaires et rotation des produits.",
      category: "commerce",
      order: 1,
    },
    {
      title: "Conseiller Spécialisé Électroménagers",
      company: "RONA",
      location: "Rouyn-Noranda, QC",
      startDate: new Date("2023-06-01"),
      endDate: new Date("2024-04-30"),
      current: false,
      description: "Accueil et évaluation des besoins clients en électroménagers. Présentation des produits, caractéristiques et avantages. Suivi des commandes et livraisons.",
      category: "commerce",
      order: 2,
    },
    {
      title: "Service Omni / Préparateur de commandes",
      company: "Walmart",
      location: "Rouyn-Noranda, QC",
      startDate: new Date("2023-05-01"),
      endDate: new Date("2024-05-31"),
      current: false,
      description: "Sélection, emballage et préparation des commandes clients pour ramassage ou livraison. Accueil clients, gestion des retours et réponses aux questions sur commandes en ligne.",
      category: "commerce",
      order: 3,
    },
    {
      title: "Électricien Industriel",
      company: "ENTP",
      location: "In-Amenas, Algérie",
      startDate: new Date("2018-11-01"),
      endDate: new Date("2019-08-31"),
      current: false,
      description: "Montage, réparation et entretien des circuits électriques, tableaux de distribution et dispositifs de commande. Diagnostic et résolution des dysfonctionnements (surchauffe, courts-circuits, défauts d'isolation). Rédaction des rapports d'intervention et mise à jour des schémas électriques.",
      category: "tech",
      order: 4,
    },
    {
      title: "Stages Techniques",
      company: "ENTP / SNP / Complexe Industriel TDA",
      location: "Algérie",
      startDate: new Date("2017-01-01"),
      endDate: new Date("2019-12-31"),
      current: false,
      description: "Maintenance préventive/corrective des équipements électriques et industriels. Inspection qualité, supervision travaux, gestion des stocks de pièces de rechange.",
      category: "tech",
      order: 5,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }

  const educations = [
    {
      degree: "M.Eng. Génie Électrique",
      school: "UQAT",
      location: "Rouyn-Noranda, QC",
      startDate: new Date("2023-05-01"),
      endDate: new Date("2025-06-01"),
      current: false,
      description: "Réalisation d'un radar avancé",
      order: 0,
    },
    {
      degree: "Master Électromécanique",
      school: "Université de Batna 2",
      location: "Batna, Algérie",
      startDate: new Date("2018-09-01"),
      endDate: new Date("2020-06-01"),
      current: false,
      description: "Étude et réalisation d'un radar commandé par PIC",
      order: 1,
    },
    {
      degree: "Licence Électromécanique",
      school: "Université de Batna 2",
      location: "Batna, Algérie",
      startDate: new Date("2015-09-01"),
      endDate: new Date("2018-06-01"),
      current: false,
      order: 2,
    },
    {
      degree: "Technicien Supérieur Informatique-Réseaux",
      school: "CFPA",
      location: "Algérie",
      startDate: new Date("2022-09-01"),
      endDate: new Date("2023-06-01"),
      current: false,
      description: "Création d'une installation réseau local",
      order: 3,
    },
    {
      degree: "Technicien Informatique-Réseaux",
      school: "CFPA",
      location: "Algérie",
      startDate: new Date("2021-10-01"),
      endDate: new Date("2022-06-01"),
      current: false,
      description: "Simulation d'une installation réseau local",
      order: 4,
    },
    {
      degree: "MBA Micro Opérateur Informatique",
      school: "CFPA",
      location: "Algérie",
      startDate: new Date("2017-09-01"),
      endDate: new Date("2019-06-01"),
      current: false,
      description: "Travail sur les applications et les systèmes d'exploitation",
      order: 5,
    },
    {
      degree: "ASP Construction (Santé & Sécurité)",
      school: "Centre Polymétier",
      location: "Rouyn-Noranda, QC",
      startDate: new Date("2024-07-01"),
      endDate: new Date("2024-09-30"),
      current: false,
      description: "Santé et sécurité générale sur les chantiers de construction",
      type: EducationType.CERTIFICATE,
      order: 6,
    },
    {
      degree: "Baccalauréat Sciences Expérimentales",
      school: "Lycée Kser Bellazma",
      location: "Algérie",
      startDate: new Date("2012-09-01"),
      endDate: new Date("2015-06-01"),
      current: false,
      order: 7,
    },
  ];

  for (const edu of educations) {
    await prisma.education.create({ data: edu });
  }

  const skills = [
    { name: "Génie Électrique", category: "électrique", level: 90, icon: "Zap", order: 0 },
    { name: "Électromécanique", category: "électrique", level: 85, icon: "Settings", order: 1 },
    { name: "Maintenance Industrielle", category: "électrique", level: 85, icon: "Wrench", order: 2 },
    { name: "Instrumentation & Systèmes Embarqués", category: "électrique", level: 85, icon: "Cpu", order: 3 },
    { name: "Automatisation", category: "électrique", level: 85, icon: "Settings", order: 4 },
    { name: "Câblage Industriel", category: "électrique", level: 80, icon: "Zap", order: 5 },
    { name: "Code québécois de l'électricité (CQE)", category: "normes", level: 85, icon: "ShieldCheck", order: 6 },
    { name: "Canadian Electrical Code (CEC)", category: "normes", level: 85, icon: "ShieldCheck", order: 7 },
    { name: "NFPA 70", category: "normes", level: 85, icon: "ShieldCheck", order: 8 },
    { name: "Next.js", category: "web", level: 85, icon: "Code", order: 9 },
    { name: "React", category: "web", level: 85, icon: "Code", order: 10 },
    { name: "TypeScript", category: "web", level: 85, icon: "Code", order: 11 },
    { name: "Prisma", category: "web", level: 80, icon: "Code", order: 12 },
    { name: "PostgreSQL", category: "web", level: 80, icon: "Database", order: 13 },
    { name: "Tailwind CSS", category: "web", level: 85, icon: "Code", order: 14 },
    { name: "Node.js", category: "web", level: 80, icon: "Code", order: 15 },
    { name: "Git", category: "web", level: 80, icon: "Code", order: 16 },
    { name: "GitHub", category: "web", level: 80, icon: "Code", order: 17 },
    { name: "Proteus 8", category: "logiciel", level: 85, icon: "Cpu", order: 18 },
    { name: "SolidWorks", category: "logiciel", level: 80, icon: "Box", order: 19 },
    { name: "MATLAB", category: "logiciel", level: 75, icon: "BarChart3", order: 20 },
    { name: "AutoCAD", category: "logiciel", level: 75, icon: "Box", order: 21 },
    { name: "Excel avancé", category: "logiciel", level: 90, icon: "FileText", order: 22 },
    { name: "Autonomie", category: "soft", level: 95, icon: "UserCheck", order: 23 },
    { name: "Leadership", category: "soft", level: 90, icon: "Users", order: 24 },
    { name: "Rigueur", category: "soft", level: 90, icon: "ShieldCheck", order: 25 },
    { name: "Travail d'équipe", category: "soft", level: 85, icon: "UsersRound", order: 26 },
    { name: "Gestion de projet", category: "soft", level: 80, icon: "FolderKanban", order: 27 },
    { name: "Arabe", category: "langue", level: 100, icon: "Globe", order: 28 },
    { name: "Français", category: "langue", level: 90, icon: "Globe", order: 29 },
    { name: "Anglais", category: "langue", level: 80, icon: "Globe", order: 30 },
  ];

  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }

  const projects = [
    {
      title: "TAHFIDZ — Plateforme SaaS de gestion d'écoles coraniques",
      description: "Système multi-utilisateurs avec suivi de mémorisation, évaluations, présences et notifications.",
      technologies: ["Next.js 15", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS", "NextAuth.js"],
      featured: true,
      order: 0,
    },
    {
      title: "CCI Montmagny — Site web communautaire",
      description: "Site vitrine pour le Centre Culturel Islamique de Montmagny, livré et en production.",
      technologies: ["Next.js 15", "React", "TypeScript", "Tailwind CSS", "Vercel"],
      featured: true,
      order: 1,
    },
    {
      title: "Radar Avancé — Projet de fin d'études UQAT",
      description: "Conception et réalisation d'un système radar pour détection et surveillance.",
      technologies: ["Électronique", "Signal Processing", "MATLAB"],
      featured: true,
      order: 2,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  const interests = [
    { name: "Football", icon: "Trophy", order: 0 },
    { name: "Vélo", icon: "Bike", order: 1 },
    { name: "Natation", icon: "Waves", order: 2 },
    { name: "Voyages", icon: "Plane", order: 3 },
  ];

  for (const interest of interests) {
    await prisma.interest.create({ data: interest });
  }

  const testimonials = [
    {
      name: "Ahmed Benali",
      role: "Directeur Technique",
      company: "ENTP In-Amenas",
      content: "Abdenour a démontré un excellent sens de l'initiative et une grande autonomie durant son stage. Sa capacité à assimiler rapidement les procédures et à proposer des améliorations a impressionné toute l'équipe.",
      order: 0,
    },
    {
      name: "Marie-Claire Dubois",
      role: "Responsable Rayon",
      company: "RONA Rouyn-Noranda",
      content: "Un superviseur exceptionnel. Abdenour a su motiver son équipe et atteindre des résultats record en matière de vente et de satisfaction client. Son leadership naturel fait toute la différence.",
      order: 1,
    },
    {
      name: "Prof. Karim Mansouri",
      role: "Proviseur",
      company: "Lycée Sheikh Amoud",
      content: "Enseignant passionné et pédagogue. Abdenour a su transmettre sa passion pour la physique à ses élèves et obtenir des résultats remarquables aux examens. Un atout pour n'importe quelle équipe.",
      order: 2,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  const articles = [
    {
      title: "Conception d'un Système Radar Avancé",
      slug: "radar-avance-uqat",
      excerpt: "Retour d'expérience sur la conception et la réalisation d'un radar avancé dans le cadre de mon Master à l'UQAT.",
      content: "Dans le cadre de mon projet de fin d'études à l'UQAT, j'ai conçu et réalisé un système radar avancé capable de détecter et de suivre des objets en mouvement...",
      published: true,
    },
    {
      title: "Les Défis de l'Électromécanique Moderne",
      slug: "electromecanique-moderne",
      excerpt: "Analyse des défis actuels et futurs dans le domaine de l'électromécanique industrielle.",
      content: "L'électromécanique est un domaine en constante évolution qui combine l'ingénierie électrique et mécanique...",
      published: true,
    },
    {
      title: "Gestion d'École Coranique : TAHFIDZ",
      slug: "tahfidz-plateforme",
      excerpt: "Présentation de la plateforme SaaS TAHFIDZ pour la gestion des écoles coraniques.",
      content: "TAHFIDZ est une plateforme complète que j'ai développée pour répondre aux besoins spécifiques des écoles coraniques...",
      published: true,
    },
  ];

  for (const article of articles) {
    await prisma.article.create({ data: article });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
