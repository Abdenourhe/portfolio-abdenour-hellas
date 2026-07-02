"use client";

import { Profile, Experience, Education, Skill, Project } from "@/types";

interface CVPrintTemplateProps {
  profile: Profile | null;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

function toBullets(text: string): string[] {
  if (!text) return [];
  return text
    .split(/\. (?=[A-ZÀ-ÖØ-öø-ÿ0-9])/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith(".") ? s : s + "."));
}

function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-CA", { month: "short", year: "numeric" });
}

export default function CVPrintTemplate({
  profile,
  experiences,
  education,
  skills,
  projects,
}: CVPrintTemplateProps) {
  if (!profile) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Aucun profil trouvé. Veuillez compléter votre profil d'abord.
      </div>
    );
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const technicalSkills = groupedSkills["technique"] || [];
  const softwareSkills = groupedSkills["logiciel"] || [];
  const webSkills = groupedSkills["web"] || [];
  const softSkills = groupedSkills["soft"] || [];
  const languageSkills = groupedSkills["langue"] || [];

  const mainExperiences = experiences.filter(
    (e) => !["caissier", "service omni", "préposé"].some((ot) => e.title.toLowerCase().includes(ot))
  );
  const otherExperiences = experiences.filter(
    (e) => ["caissier", "service omni", "préposé"].some((ot) => e.title.toLowerCase().includes(ot))
  );

  return (
    <div
      id="cv-print-content"
      className="bg-white text-[#1a1a1a] p-[9mm_10mm_10mm_10mm]"
      style={{
        width: "210mm",
        minHeight: "297mm",
        fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSize: "9pt",
        lineHeight: 1.3,
      }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-3 pb-2 mb-3"
        style={{ borderBottom: "2px solid #1E3A5F" }}
      >
        <div className="text-center shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="42"
            height="42"
            viewBox="0 0 31 31"
            shapeRendering="crispEdges"
          >
            <path fill="#FFFFFF" d="M0 0h31v31H0z" />
            <path
              stroke="#1E3A5F"
              d="M1 1.5h7m5 0h2m2 0h1m2 0h1m2 0h7M1 2.5h1m5 0h1m1 0h1m1 0h1m1 0h1m1 0h3m2 0h2m1 0h1m5 0h1M1 3.5h1m1 0h3m1 0h1m2 0h3m1 0h2m1 0h1m3 0h1m1 0h1m1 0h3m1 0h1M1 4.5h1m1 0h3m1 0h1m3 0h6m3 0h1m2 0h1m1 0h3m1 0h1M1 5.5h1m1 0h3m1 0h1m1 0h2m4 0h1m2 0h3m2 0h1m1 0h3m1 0h1M1 6.5h1m5 0h1m3 0h1m1 0h2m4 0h2m2 0h1m5 0h1M1 7.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M10 8.5h1m2 0h3m1 0h2m1 0h2M1 9.5h1m1 0h1m1 0h1m1 0h1m3 0h1m1 0h1m1 0h2m1 0h1m1 0h2m3 0h1m2 0h1M2 10.5h1m1 0h1m4 0h1m3 0h1m1 0h2m4 0h3m2 0h1m2 0h1M1 11.5h1m2 0h1m2 0h2m2 0h1m1 0h2m3 0h1m2 0h2m1 0h2m1 0h3M1 12.5h1m2 0h1m1 0h1m1 0h2m1 0h2m3 0h1m1 0h6m4 0h1M3 13.5h1m1 0h1m1 0h1m2 0h1m6 0h2m1 0h4m2 0h1m1 0h2M2 14.5h1m1 0h1m3 0h1m1 0h5m1 0h2m3 0h3m2 0h1m2 0h1M1 15.5h1m1 0h3m1 0h1m1 0h2m1 0h1m2 0h4m3 0h1m2 0h2m1 0h2M2 16.5h1m2 0h1m3 0h2m1 0h4m1 0h2m1 0h2m1 0h1m2 0h1m1 0h1M1 17.5h2m1 0h1m1 0h2m2 0h1m1 0h2m1 0h2m1 0h1m2 0h3m2 0h1m1 0h2M2 18.5h1m1 0h1m3 0h1m1 0h1m1 0h1m2 0h2m4 0h1m1 0h1m2 0h2m1 0h1M1 19.5h1m4 0h2m2 0h1m2 0h2m6 0h3m4 0h2M2 20.5h1m1 0h1m3 0h1m2 0h2m3 0h1m1 0h1m1 0h1m3 0h1m1 0h1m1 0h1M1 21.5h1m1 0h2m2 0h3m1 0h1m5 0h2m1 0h6M9 22.5h1m1 0h1m1 0h2m1 0h2m2 0h2m3 0h1m1 0h3M1 23.5h7m2 0h1m1 0h2m1 0h3m1 0h3m1 0h1m1 0h2m1 0h2M1 24.5h1m5 0h1m2 0h1m3 0h2m1 0h3m1 0h1m3 0h2m1 0h2M1 25.5h1m1 0h3m1 0h1m1 0h1m1 0h3m1 0h4m2 0h5m2 0h1M1 26.5h1m1 0h3m1 0h1m7 0h2m7 0h2m1 0h1M1 27.5h1m1 0h3m1 0h1m1 0h5m4 0h1m1 0h1m1 0h1m1 0h3m2 0h1M1 28.5h1m5 0h1m4 0h1m1 0h1m1 0h3m1 0h3m5 0h1M1 29.5h7m1 0h2m3 0h2m1 0h2m2 0h1m3 0h1m2 0h2"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div style={{ fontSize: "21pt", fontWeight: 700, color: "#1E3A5F", letterSpacing: "-0.5px" }}>
            {profile.fullName}
          </div>
          <div style={{ fontSize: "10.5pt", color: "#4a6fa5", fontWeight: 600, marginTop: "2px" }}>
            {profile.title}
          </div>
          <div className="flex flex-wrap gap-2 mt-1" style={{ fontSize: "8.5pt", color: "#333" }}>
            <span>📧 {profile.email}</span>
            <span>📱 {profile.phone}</span>
            <span>📍 {profile.location}</span>
            <span>🔗 {profile.linkedin?.replace(/^https?:\/\//, "")}</span>
            <span>🌐 abdenour-hellas.online</span>
          </div>
        </div>

      </header>

      {/* Profile */}
      <section>
        <h2
          style={{
            fontSize: "9.5pt",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: "#1E3A5F",
            borderBottom: "1px solid #c9d6e8",
            paddingBottom: "2px",
            marginTop: "9px",
            marginBottom: "5px",
          }}
        >
          Profil
        </h2>
        <p style={{ textAlign: "justify", fontSize: "8.8pt", color: "#222" }}>{profile.bio}</p>
      </section>

      {/* Experiences */}
      <section>
        <h2
          style={{
            fontSize: "9.5pt",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: "#1E3A5F",
            borderBottom: "1px solid #c9d6e8",
            paddingBottom: "2px",
            marginTop: "9px",
            marginBottom: "5px",
          }}
        >
          Expériences professionnelles
        </h2>

        {mainExperiences.map((exp) => (
          <div key={exp.id} style={{ marginBottom: "5px" }}>
            <div className="flex justify-between items-baseline">
              <span style={{ fontWeight: 700, fontSize: "9.5pt", color: "#1E3A5F" }}>{exp.title}</span>
              <span style={{ fontSize: "8pt", color: "#555", whiteSpace: "nowrap" }}>
                {formatDate(exp.startDate)} — {exp.current ? "Présent" : formatDate(exp.endDate)}
              </span>
            </div>
            <div style={{ fontSize: "8.5pt", color: "#444", fontWeight: 600 }}>
              {exp.company} — {exp.location}
            </div>
            {toBullets(exp.description).length > 1 ? (
              <ul style={{ margin: 0, paddingLeft: "13px", fontSize: "8.3pt", color: "#333" }}>
                {toBullets(exp.description).map((b, i) => (
                  <li key={i} style={{ marginBottom: "0.5px" }}>
                    {b}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: "8.3pt", color: "#333", marginTop: "1.5px" }}>{exp.description}</p>
            )}
          </div>
        ))}

        {otherExperiences.length > 0 && (
          <div style={{ marginBottom: "5px" }}>
            <div className="flex justify-between items-baseline">
              <span style={{ fontWeight: 700, fontSize: "9.5pt", color: "#1E3A5F" }}>
                {otherExperiences.map((e) => e.title).join(" / ")}
              </span>
              <span style={{ fontSize: "8pt", color: "#555", whiteSpace: "nowrap" }}>
                {formatDate(otherExperiences[0].startDate)} —{" "}
                {otherExperiences[otherExperiences.length - 1].endDate
                  ? formatDate(otherExperiences[otherExperiences.length - 1].endDate)
                  : "Présent"}
              </span>
            </div>
            <div style={{ fontSize: "8.5pt", color: "#444", fontWeight: 600 }}>
              {Array.from(new Set(otherExperiences.map((e) => e.company))).join(" / ")} —{" "}
              {otherExperiences[0].location}
            </div>
            <p style={{ fontSize: "8.3pt", color: "#333", marginTop: "1.5px" }}>
              {otherExperiences.map((e) => e.description).join(" ")}
            </p>
          </div>
        )}
      </section>

      {/* Two columns */}
      <div className="flex gap-3">
        <div style={{ width: "64mm", flexShrink: 0 }}>
          {/* Skills */}
          <section>
            <h2
              style={{
                fontSize: "9.5pt",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "#1E3A5F",
                borderBottom: "1px solid #c9d6e8",
                paddingBottom: "2px",
                marginTop: "9px",
                marginBottom: "5px",
              }}
            >
              Compétences
            </h2>
            {technicalSkills.length > 0 && (
              <div style={{ marginBottom: "3px" }}>
                <h3 style={{ fontSize: "7.5pt", textTransform: "uppercase", color: "#555", marginBottom: "1px" }}>
                  Techniques
                </h3>
                <div style={{ fontSize: "8.2pt", color: "#222" }}>
                  {technicalSkills.map((s) => s.name).join(", ")}
                </div>
              </div>
            )}
            {webSkills.length > 0 && (
              <div style={{ marginBottom: "3px" }}>
                <h3 style={{ fontSize: "7.5pt", textTransform: "uppercase", color: "#555", marginBottom: "1px" }}>
                  Développement web
                </h3>
                <div style={{ fontSize: "8.2pt", color: "#222" }}>{webSkills.map((s) => s.name).join(", ")}</div>
              </div>
            )}
            {softwareSkills.length > 0 && (
              <div style={{ marginBottom: "3px" }}>
                <h3 style={{ fontSize: "7.5pt", textTransform: "uppercase", color: "#555", marginBottom: "1px" }}>
                  Logiciels
                </h3>
                <div style={{ fontSize: "8.2pt", color: "#222" }}>
                  {softwareSkills.map((s) => s.name).join(", ")}
                </div>
              </div>
            )}
            {softSkills.length > 0 && (
              <div style={{ marginBottom: "3px" }}>
                <h3 style={{ fontSize: "7.5pt", textTransform: "uppercase", color: "#555", marginBottom: "1px" }}>
                  Soft skills
                </h3>
                <div style={{ fontSize: "8.2pt", color: "#222" }}>{softSkills.map((s) => s.name).join(", ")}</div>
              </div>
            )}
          </section>

          {/* Languages */}
          {languageSkills.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "9.5pt",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: "#1E3A5F",
                  borderBottom: "1px solid #c9d6e8",
                  paddingBottom: "2px",
                  marginTop: "9px",
                  marginBottom: "5px",
                }}
              >
                Langues
              </h2>
              {languageSkills.map((lang) => (
                <div key={lang.id} className="flex justify-between" style={{ fontSize: "8.5pt", marginBottom: "1px" }}>
                  <span>{lang.name}</span>
                  <span>
                    {lang.level}% —{" "}
                    {lang.level >= 100 ? "Natif" : lang.level >= 90 ? "Courant" : "Professionnel"}
                  </span>
                </div>
              ))}
            </section>
          )}
        </div>

        <div style={{ flex: 1 }}>
          {/* Education */}
          <section>
            <h2
              style={{
                fontSize: "9.5pt",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "#1E3A5F",
                borderBottom: "1px solid #c9d6e8",
                paddingBottom: "2px",
                marginTop: "9px",
                marginBottom: "5px",
              }}
            >
              Formation
            </h2>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: "5px" }}>
                <div className="flex justify-between items-baseline">
                  <span style={{ fontWeight: 700, fontSize: "9.5pt", color: "#1E3A5F" }}>{edu.degree}</span>
                  <span style={{ fontSize: "8pt", color: "#555", whiteSpace: "nowrap" }}>
                    {formatDate(edu.startDate)} — {edu.current ? "Présent" : formatDate(edu.endDate)}
                  </span>
                </div>
                <div style={{ fontSize: "8.5pt", color: "#444", fontWeight: 600 }}>
                  {edu.school} — {edu.location}
                </div>
              </div>
            ))}
          </section>

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "9.5pt",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: "#1E3A5F",
                  borderBottom: "1px solid #c9d6e8",
                  paddingBottom: "2px",
                  marginTop: "9px",
                  marginBottom: "5px",
                }}
              >
                Projets
              </h2>
              {projects.map((project) => (
                <div key={project.id} style={{ marginBottom: "4px" }}>
                  <div className="flex justify-between items-baseline">
                    <span style={{ fontWeight: 700, fontSize: "8.8pt", color: "#1E3A5F" }}>{project.title}</span>
                  </div>
                  <p style={{ fontSize: "8pt", color: "#333" }}>{project.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.technologies.slice(0, 6).map((tech) => (
                      <span
                        key={tech}
                        style={{
                          display: "inline-block",
                          background: "#eef3fa",
                          color: "#1E3A5F",
                          padding: "0.5px 4px",
                          borderRadius: "2px",
                          fontSize: "7.5pt",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer
        className="flex justify-between"
        style={{
          marginTop: "8px",
          paddingTop: "4px",
          borderTop: "1px solid #c9d6e8",
          fontSize: "7.5pt",
          color: "#666",
        }}
      >
        <span>{profile.fullName}</span>
        <span>CV généré le {new Date().toLocaleDateString("fr-CA")}</span>
      </footer>
    </div>
  );
}
