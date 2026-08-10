import json

# Modèles de lettres de motivation adaptées au profil d'Abdenour Hellas

LETTRE_GENERALE = """Objet : Candidature au poste d'ingénieur électrique / {poste}

Madame, Monsieur,

Je me permets de vous adresser ma candidature pour le poste de {poste} au sein de votre entreprise {entreprise}. Détenteur d'un M.Eng. en Génie Électrique de l'UQAT (2025) et d'un Master en Électromécanique de l'Université de Batna2, je dispose d'une double expertise technique en conception de systèmes électriques et en automatisation industrielle, enrichie par 5+ ans d'expérience internationale en Algérie et au Canada.

Mon parcours m'a permis de développer des compétences solides en :
• Conception et maintenance de systèmes électriques collaboratifs (projet TCOST)
• Supervision d'équipes et gestion de projets techniques (RONA, Maisons Laprise)
• Diagnostic et résolution de pannes complexes sur équipements industriels
• Développement de solutions numériques innovantes (Next.js, React, TypeScript)

Je maîtrise les normes canadiennes (CQE, CEC, NFPA 70) et les logiciels de CAO (AutoCAD, SolidWorks, Proteus 8, MATLAB). Mon admission en cours à l'Ordre des ingénieurs du Québec témoigne de mon engagement envers l'excellence professionnelle.

Autonome, rigoureux et doté d'un fort esprit d'équipe, je suis convaincu que mon profil correspond aux besoins de votre organisation. Je serais ravi de pouvoir échanger avec vous lors d'un entretien.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Abdenour Hellas
Nouveau-Brunswick, Canada
abdenour.hellas@uqat.ca | +1 418 350 5686
https://abdenour-hellas.online
"""

LETTRE_AUTOMATISATION = """Objet : Candidature au poste d'ingénieur en automatisation / {poste}

Madame, Monsieur,

C'est avec un vif intérêt que je vous soumets ma candidature pour le poste de {poste} chez {entreprise}. Fort de mon M.Eng. en Génie Électrique et de mon expérience pratique en maintenance industrielle et automatisation, je suis particulièrement motivé par les défis liés à l'optimisation des processus de production.

Au cours de mon mandat chez ENTP (Algérie), j'ai conçu et maintenu le système collaboratif électrique TCOST, intégrant des solutions d'automatisation intelligente et d'efficacité énergétique. J'ai également développé une bibliothèque numérique complète répertoriant produits, prix et spécifications techniques, démontrant ma capacité à structurer et digitaliser des processus complexes.

Mes compétences en programmation (Next.js, React, Node.js, PostgreSQL) me permettent de concevoir des interfaces de supervision et des outils de gestion technique innovants, combinant expertise électrique et solutions numériques.

Trilingue (arabe natif, français courant, anglais professionnel) et adaptable à des environnements multiculturels, je suis prêt à m'investir pleinement au sein de votre équipe.

Dans l'attente de votre réponse, je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.

Abdenour Hellas
abdenour.hellas@uqat.ca | +1 418 350 5686
"""

LETTRE_MAINTENANCE = """Objet : Candidature au poste de technicien/ingénieur en maintenance électrique / {poste}

Madame, Monsieur,

Je souhaite postuler au poste de {poste} au sein de votre organisation {entreprise}. Avec plus de 5 ans d'expérience en maintenance préventive et corrective d'équipements électriques et industriels, je possède l'expertise technique et le sens de l'urgence nécessaires pour ce type de fonction.

Mon expérience chez Maisons Laprise (Québec) m'a permis de maîtriser le montage, la réparation et l'entretien des circuits électriques, tableaux de distribution et dispositifs de commande. J'ai développé une expertise particulière dans le diagnostic des dysfonctionnements (surchauffe, courts-circuits, défauts d'isolation) et la rédaction de rapports d'intervention détaillés.

Par ailleurs, ma formation en génie électrique (M.Eng. UQAT) et ma connaissance approfondie des codes canadiens de l'électricité (CQE, CEC) garantissent le respect des normes les plus strictes en matière de sécurité et de qualité.

Je serais honoré de mettre mes compétences au service de votre entreprise et de contribuer à la fiabilité de vos installations.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Abdenour Hellas
abdenour.hellas@uqat.ca | +1 418 350 5686
"""

LETTRE_SUPERVISION = """Objet : Candidature au poste de superviseur / chef d'équipe électrique / {poste}

Madame, Monsieur,

Je vous propose ma candidature pour le poste de {poste} chez {entreprise}. Mon expérience de superviseur au département électroménagers de RONA (Rouyn-Noranda), combinée à ma formation d'ingénieur en génie électrique, fait de moi un candidat idéal pour un poste de leadership technique.

Durant mes deux années et demie chez RONA, j'ai supervisé les opérations d'un département stratégique, coordonné des équipes pluridisciplinaires et optimisé les processus logistiques et commerciaux. Cette expérience m'a permis de développer des compétences en gestion d'équipe, en prise de décision rapide et en communication efficace — des atouts essentiels pour tout poste de supervision.

Ma double compétence technique (électromécanique, automatisation, développement web) me permet d'appréhender les enjeux opérationnels sous un angle global et d'identifier des leviers d'amélioration continus.

Leader naturel, rigoureux et orienté résultats, je suis impatient de rejoindre votre équipe et de contribuer à vos succès.

Dans l'attente de vous rencontrer, je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.

Abdenour Hellas
abdenour.hellas@uqat.ca | +1 418 350 5686
"""

# Sauvegarder tous les modèles
modeles = {
    "generale": LETTRE_GENERALE,
    "automatisation": LETTRE_AUTOMATISATION,
    "maintenance": LETTRE_MAINTENANCE,
    "supervision": LETTRE_SUPERVISION
}

for nom, contenu in modeles.items():
    with open(f"lettre_motivation_{nom}.txt", "w", encoding="utf-8") as f:
        f.write(contenu)
    print(f"✓ lettre_motivation_{nom}.txt créée")

print("\nToutes les lettres de motivation sont prêtes !")
