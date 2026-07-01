import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
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
      email: "abdenour.hellas@uqat.ca",
      phone: "+1 418-350-5686",
      location: "Baker-Brook, NB, Canada, E7A 1T9",
      bio: "Spécialiste en génie électrique avec double compétence en développement web, orienté vers la conception de systèmes électriques collaboratifs et l'automatisation industrielle. 5+ ans d'expérience internationale (Algérie, Canada) en maintenance, supervision et conception. Passionné par l'innovation énergétique et les solutions numériques. Recherche des opportunités en Canada, Europe et à l'international.",
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
      title: "Configurateur Électrique",
      company: "Maison La Prise",
      location: "Québec, QC",
      startDate: new Date("2025-12-02"),
      endDate: new Date("2026-03-08"),
      current: false,
      description: "Configuration et dimensionnement d'installations électriques résidentielles et commerciales.",
      category: "tech",
      order: 0,
    },
    {
      title: "Superviseur Département Électroménagers",
      company: "RONA",
      location: "Rouyn-Noranda, QC",
      startDate: new Date("2024-04-01"),
      endDate: new Date("2025-11-30"),
      current: false,
      description: "Encadrer, former et motiver l'équipe de conseillers en électroménagers pour atteindre les objectifs de vente et de service. Maintenir un contact régulier avec les fournisseurs pour suivre l'état des factures et des paiements. Organiser les factures de manière structurée pour une traçabilité efficace. Gérer les stocks, superviser les inventaires et veiller à la rotation des produits. Assurer un excellent service après-vente.",
      category: "commerce",
      order: 1,
    },
    {
      title: "Conseiller Spécialisé Électroménagers",
      company: "RONA",
      location: "Rouyn-Noranda, QC",
      startDate: new Date("2023-06-01"),
      endDate: new Date("2024-04-01"),
      current: false,
      description: "Accueillir les clients et évaluer leurs besoins en électroménagers. Présenter les produits disponibles, leurs caractéristiques et avantages. Effectuer le suivi des commandes et des livraisons.",
      category: "commerce",
      order: 2,
    },
    {
      title: "Service Omni",
      company: "Walmart",
      location: "Rouyn-Noranda, QC",
      startDate: new Date("2023-05-01"),
      endDate: new Date("2024-05-01"),
      current: false,
      description: "Sélectionner, emballer et préparer les commandes des clients pour le ramassage en magasin ou la livraison. Accueillir les clients, répondre à leurs questions concernant les commandes en ligne, et gérer les retours.",
      category: "commerce",
      order: 3,
    },
    {
      title: "Caissière",
      company: "PFK",
      location: "Rouyn-Noranda, QC",
      startDate: new Date("2023-05-01"),
      endDate: new Date("2023-06-01"),
      current: false,
      description: "Accueillir les clients, enregistrer leurs commandes avec précision et gérer les paiements en caisse ou au service au volant. Préparer les repas selon les normes de qualité et de sécurité alimentaire.",
      category: "commerce",
      order: 4,
    },
    {
      title: "Prof. Enseignement Secondaire (Physique)",
      company: "Lycée Sheikh Amoud",
      location: "In-amenas, Algérie",
      startDate: new Date("2022-02-01"),
      endDate: new Date("2022-08-01"),
      current: false,
      description: "Concevoir et enseigner des leçons de physique en accord avec le programme scolaire. Évaluer les progrès des élèves à travers des tests et des devoirs. Maintenir un environnement de travail structuré et accompagner individuellement les élèves.",
      category: "education",
      order: 5,
    },
    {
      title: "Stage",
      company: "ENTP (Entreprise Nationale des Grands Travaux Pétroliers)",
      location: "In-amenas, Algérie",
      startDate: new Date("2017-12-01"),
      endDate: new Date("2018-01-01"),
      current: false,
      description: "Soutien aux ingénieurs et techniciens sur le terrain pour superviser les travaux, effectuer des inspections et garantir la qualité des installations. Participation aux formations de sécurité et application des normes environnementales.",
      category: "tech",
      order: 6,
    },
    {
      title: "Stage",
      company: "SNP (Société Nationale de Production d'Électricité)",
      location: "Ain-djasser, Algérie",
      startDate: new Date("2019-05-01"),
      endDate: new Date("2019-05-31"),
      current: false,
      description: "Participer aux opérations de maintenance préventive et corrective des équipements électriques. Aider à l'inspection et au suivi des paramètres de performance des systèmes de production.",
      category: "tech",
      order: 7,
    },
    {
      title: "Stage",
      company: "Complexe Industriel TDA",
      location: "Ain-djasser, Algérie",
      startDate: new Date("2017-11-01"),
      endDate: new Date("2018-01-01"),
      current: false,
      description: "Aider les techniciens dans la maintenance préventive et corrective des machines et équipements industriels. Participer aux tests et contrôles de qualité des produits finis. Aider à la gestion des stocks de pièces de rechange.",
      category: "tech",
      order: 8,
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
      startDate: new Date("2024-08-01"),
      endDate: new Date("2024-10-01"),
      current: false,
      description: "Santé et sécurité générale sur les chantiers de construction",
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
    { name: "Excel avancé", category: "logiciel", level: 90, icon: "FileText", order: 0 },
    { name: "Proteus 8", category: "logiciel", level: 85, icon: "Cpu", order: 1 },
    { name: "SolidWorks", category: "logiciel", level: 80, icon: "Box", order: 2 },
    { name: "MATLAB", category: "logiciel", level: 75, icon: "BarChart3", order: 3 },
    { name: "AutoCAD", category: "logiciel", level: 75, icon: "Box", order: 4 },
    { name: "Génie Électrique", category: "technique", level: 90, icon: "Zap", order: 5 },
    { name: "Électromécanique", category: "technique", level: 85, icon: "Settings", order: 6 },
    { name: "Instrumentation & Systèmes Embarqués", category: "technique", level: 85, icon: "Cpu", order: 7 },
    { name: "Réseaux Informatiques", category: "technique", level: 80, icon: "Network", order: 8 },
    { name: "Maintenance Industrielle", category: "technique", level: 85, icon: "Wrench", order: 9 },
    { name: "Normes CQE / CEC / NFPA 70", category: "technique", level: 80, icon: "ShieldCheck", order: 10 },
    { name: "Next.js / React / TypeScript", category: "technique", level: 85, icon: "Code", order: 11 },
    { name: "Git / GitHub", category: "logiciel", level: 80, icon: "Code", order: 12 },
    { name: "Arabe", category: "langue", level: 100, icon: "Globe", order: 13 },
    { name: "Français", category: "langue", level: 90, icon: "Globe", order: 14 },
    { name: "Anglais", category: "langue", level: 80, icon: "Globe", order: 15 },
    { name: "Leadership", category: "soft", level: 90, icon: "Users", order: 16 },
    { name: "Autonomie", category: "soft", level: 95, icon: "UserCheck", order: 17 },
    { name: "Travail d'équipe", category: "soft", level: 85, icon: "UsersRound", order: 18 },
    { name: "Rigueur", category: "soft", level: 90, icon: "ShieldCheck", order: 19 },
  ];

  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }

  const projects = [
    {
      title: "TAHFIDZ",
      description: "Plateforme SaaS complète pour la gestion des écoles coraniques. Système multi-utilisateurs (admin, enseignant, parent, élève) avec suivi de mémorisation, évaluations, présences, certificats et notifications. Développé depuis 2024.",
      technologies: ["Next.js 15", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS", "NextAuth.js", "i18n"],
      featured: true,
      order: 0,
    },
    {
      title: "CCI Montmagny",
      description: "Conception et développement complet du site web pour le Centre Culturel Islamique de Montmagny. Site vitrine communautaire avec présentation institutionnelle, horaires de prière, actualités et événements. Projet livré en 2026.",
      technologies: ["Next.js 15", "React", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Vercel"],
      featured: true,
      order: 1,
    },
    {
      title: "Radar Avancé",
      description: "Projet de fin d'études à l'UQAT (2024-2025). Conception et réalisation d'un système radar avancé pour applications de détection et de surveillance.",
      technologies: ["Électronique", "Signal Processing", "MATLAB"],
      featured: true,
      order: 2,
    },
    {
      title: "Radar PIC",
      description: "Projet de Master. Étude et réalisation d'un radar commandé par microcontrôleur PIC pour applications éducatives et industrielles.",
      technologies: ["PIC Microcontrôleur", "Électronique", "C"],
      featured: false,
      order: 2,
    },
    {
      title: "Installation Réseau Local",
      description: "Projet technicien supérieur. Création complète d'une infrastructure réseau local incluant câblage, configuration et sécurisation.",
      technologies: ["Réseaux", "Cisco", "Sécurité"],
      featured: false,
      order: 3,
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
