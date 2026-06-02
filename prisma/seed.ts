import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Create profile
  await prisma.profile.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      fullName: "Abdenour Hellas",
      title: "Ingénieur en Génie Électrique",
      titleEn: "Electrical Engineer",
      titleAr: "مهندس كهرباء",
      email: "Abdenour.Hellas@uqat.ca",
      phone: "418-350-5686",
      location: "3490 Rue Principale, Baker-Brook, NB E7A 1Z6",
      bio: "Déterminé, sérieux, autonome et conscient du travail qui m'attend, je suis persuadé que je serais un élément moteur au sein de votre structure !",
      bioEn: "Determined, serious, autonomous and aware of the work ahead of me, I am convinced that I would be a driving force within your organization!",
      bioAr: "مصمم وجاد ومستقل وواعٍ بالعمل الذي ينتظرني، أنا مقتنع بأنني سأكون عنصرًا محركًا داخل مؤسستك!",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  });

  // Create experiences
  const experiences = [
    {
      title: "Configurateur Électrique",
      company: "Maison La Prise",
      location: "Québec, QC",
      startDate: new Date("2025-12-02"),
      endDate: new Date("2026-03-08"),
      current: false,
      description: "Configuration et dimensionnement d'installations électriques résidentielles et commerciales.",
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
      order: 8,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }

  // Create education
  const educations = [
    {
      degree: "M.D. Génie Électrique",
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
      startDate: new Date("2024-09-01"),
      endDate: new Date("2024-10-01"),
      current: false,
      description: "Santé et sécurité générale sur les chantiers de construction",
      order: 6,
    },
    {
      degree: "Licence Sciences Expérimentales",
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

  // Create skills
  const skills = [
    { name: "Microsoft Office", category: "logiciel", level: 90, icon: "FileText", order: 0 },
    { name: "Proteus 8", category: "logiciel", level: 85, icon: "Cpu", order: 1 },
    { name: "SolidWorks", category: "logiciel", level: 80, icon: "Box", order: 2 },
    { name: "MATLAB", category: "logiciel", level: 75, icon: "BarChart3", order: 3 },
    { name: "Génie Électrique", category: "technique", level: 90, icon: "Zap", order: 4 },
    { name: "Électromécanique", category: "technique", level: 85, icon: "Settings", order: 5 },
    { name: "Réseaux Informatiques", category: "technique", level: 80, icon: "Network", order: 6 },
    { name: "Maintenance Industrielle", category: "technique", level: 85, icon: "Wrench", order: 7 },
    { name: "Systèmes Radar", category: "technique", level: 80, icon: "Radar", order: 8 },
    { name: "Arabe", category: "langue", level: 100, icon: "Globe", order: 9 },
    { name: "Français", category: "langue", level: 85, icon: "Globe", order: 10 },
    { name: "Anglais", category: "langue", level: 60, icon: "Globe", order: 11 },
    { name: "Leadership", category: "soft", level: 90, icon: "Users", order: 12 },
    { name: "Autonomie", category: "soft", level: 95, icon: "UserCheck", order: 13 },
    { name: "Travail d'équipe", category: "soft", level: 85, icon: "UsersRound", order: 14 },
    { name: "Rigueur", category: "soft", level: 90, icon: "ShieldCheck", order: 15 },
  ];

  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }

  // Create projects
  const projects = [
    {
      title: "TAHFIDZ",
      description: "Plateforme SaaS complète pour la gestion des écoles coraniques. Système multi-utilisateurs (admin, enseignant, parent, élève) avec suivi de mémorisation, évaluations, présences, certificats et notifications.",
      technologies: ["Next.js 15", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS", "NextAuth.js", "i18n"],
      featured: true,
      order: 0,
    },
    {
      title: "Radar Avancé",
      description: "Projet de fin d'études à l'UQAT. Conception et réalisation d'un système radar avancé pour applications de détection et de surveillance.",
      technologies: ["Électronique", "Signal Processing", "MATLAB"],
      featured: true,
      order: 1,
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

  // Create interests
  const interests = [
    { name: "Football", icon: "Trophy", order: 0 },
    { name: "Vélo", icon: "Bike", order: 1 },
    { name: "Natation", icon: "Waves", order: 2 },
    { name: "Voyages", icon: "Plane", order: 3 },
  ];

  for (const interest of interests) {
    await prisma.interest.create({ data: interest });
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
