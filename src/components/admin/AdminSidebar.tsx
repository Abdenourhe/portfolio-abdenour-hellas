"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
  MessageSquare,
  Settings,
  LogOut,
  Quote,
  FileText,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profil", icon: User },
  { href: "/admin/experiences", label: "Expériences", icon: Briefcase },
  { href: "/admin/education", label: "Formations", icon: GraduationCap },
  { href: "/admin/skills", label: "Compétences", icon: Wrench },
  { href: "/admin/projects", label: "Projets", icon: FolderOpen },
  { href: "/admin/testimonials", label: "Témoignages", icon: Quote },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-5 border-b border-border">
        <Link href="/admin/dashboard" className="text-sm font-semibold tracking-tight text-foreground">
          Admin
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
              pathname === item.href
                ? "bg-muted text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <item.icon size={15} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2.5 px-3 py-2 w-full rounded-md text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
        >
          <LogOut size={15} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
