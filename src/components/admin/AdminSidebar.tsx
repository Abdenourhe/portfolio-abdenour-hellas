"use client";

import { useState } from "react";
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
  Menu,
  X,
  ArrowUpRight,
  Printer,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profil", icon: User },
  { href: "/admin/experiences", label: "Expériences", icon: Briefcase },
  { href: "/admin/education", label: "Formations", icon: GraduationCap },
  { href: "/admin/skills", label: "Compétences", icon: Wrench },
  { href: "/admin/projects", label: "Projets", icon: FolderOpen },
  { href: "/admin/cv-print", label: "CV Print", icon: Printer },
  { href: "/admin/testimonials", label: "Témoignages", icon: Quote },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-primary-foreground shadow-lg"
        aria-label="Menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-primary text-primary-foreground flex flex-col transform transition-transform duration-200 ease-out md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-primary-foreground/10 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-sm font-semibold tracking-tight text-primary-foreground">
            Admin
          </Link>
          <button onClick={() => setOpen(false)} className="md:hidden p-1 rounded hover:bg-primary-foreground/10">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                pathname === item.href
                  ? "bg-primary-foreground/10 text-primary-foreground font-medium"
                  : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5"
              }`}
            >
              <item.icon size={15} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-primary-foreground/10 space-y-0.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 w-full rounded-md text-sm text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5 transition-colors"
          >
            <ArrowUpRight size={15} />
            <span>Voir le site</span>
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-2.5 px-3 py-2 w-full rounded-md text-sm text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5 transition-colors"
          >
            <LogOut size={15} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}
