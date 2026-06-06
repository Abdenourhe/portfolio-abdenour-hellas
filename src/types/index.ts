export interface Profile {
  id: string;
  fullName: string;
  title: string;
  titleEn?: string | null;
  titleAr?: string | null;
  email: string;
  phone: string;
  location: string;
  bio: string;
  bioEn?: string | null;
  bioAr?: string | null;
  photoUrl?: string | null;
  cvUrl?: string | null;
  cvFileName?: string | null;
  linkedin?: string | null;
  github?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  updatedAt: Date;
}

export interface Experience {
  id: string;
  title: string;
  titleEn?: string | null;
  titleAr?: string | null;
  company: string;
  location: string;
  startDate: Date;
  endDate?: Date | null;
  current: boolean;
  description: string;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  url?: string | null;
  certificateImage?: string | null;
  category: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  id: string;
  degree: string;
  degreeEn?: string | null;
  degreeAr?: string | null;
  school: string;
  location: string;
  startDate: Date;
  endDate?: Date | null;
  current: boolean;
  description?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  url?: string | null;
  certificateImage?: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  nameEn?: string | null;
  nameAr?: string | null;
  category: string;
  categoryEn?: string | null;
  categoryAr?: string | null;
  level: number;
  icon?: string | null;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  titleEn?: string | null;
  titleAr?: string | null;
  description: string;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  technologies: string[];
  category?: string | null;
  imageUrl?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Interest {
  id: string;
  name: string;
  nameEn?: string | null;
  nameAr?: string | null;
  icon?: string | null;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  imageUrl?: string | null;
  order: number;
  createdAt: Date;
}

export interface Article {
  id: string;
  title: string;
  titleEn?: string | null;
  titleAr?: string | null;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl?: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  read: boolean;
  reply?: string;
  createdAt: Date;
}

export interface Stat {
  id: string;
  type: string;
  value: number;
  date: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}
