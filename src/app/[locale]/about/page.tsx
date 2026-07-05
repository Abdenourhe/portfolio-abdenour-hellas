import AboutPageClient from "@/components/public/AboutPageClient";
import { prisma } from "@/lib/prisma";

async function getProfile() {
  try {
    return await prisma.profile.findFirst();
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const profile = await getProfile();
  return <AboutPageClient profile={profile} />;
}
