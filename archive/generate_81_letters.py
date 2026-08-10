import json
import re

# Charger les 81 offres
with open('offres_complet_75.json', 'r', encoding='utf-8') as f:
    jobs = json.load(f)

# Charger les modèles de lettres
letters = {}
for name in ['generale', 'automatisation', 'maintenance', 'supervision']:
    try:
        with open(f'lettre_motivation_{name}.txt', 'r', encoding='utf-8') as f:
            letters[name] = f.read()
    except FileNotFoundError:
        pass

# Fonction pour déterminer le type de lettre
def get_letter_type(title):
    t = title.lower()
    if any(w in t for w in ['apprentice', 'apprenti', 'technicien', 'technician', 'maintenance', 'electrotechnicien']):
        return 'maintenance'
    elif any(w in t for w in ['supervisor', 'superviseur', 'manager', 'chef', 'lead']):
        return 'supervision'
    elif any(w in t for w in ['automation', 'automatisation', 'control', 'contrôle', 'plc', 'scada']):
        return 'automatisation'
    else:
        return 'generale'

# Générer les lettres
print(f"Génération de {len(jobs)} lettres personnalisées...\n")

for i, job in enumerate(jobs, 1):
    letter_type = get_letter_type(job['title'])
    job['lettre_type'] = letter_type
    
    # Nettoyer le titre
    title_clean = re.sub(r'^(New|On site|Hybrid|Direct Apply|Posted on Job Bank|This job was).*', '', job['title'], flags=re.IGNORECASE)
    title_clean = re.sub(r'Talent\.com|Indeed|CareerBeacon|CivicJobs|Jobillico|Québec emploi', '', title_clean, flags=re.IGNORECASE)
    title_clean = ' '.join(title_clean.split())
    if not title_clean:
        title_clean = job['title']
    
    # Générer la lettre
    letter = letters.get(letter_type, letters['generale']).format(
        poste=title_clean,
        entreprise=job['company']
    )
    
    # Nom de fichier
    safe_company = re.sub(r'[^\w\s-]', '', job['company'])[:25].strip().replace(' ', '_')
    filename = f"lettre_{i:03d}_{safe_company}.txt"
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(f"{'='*70}\n")
        f.write(f"  LETTRE DE MOTIVATION - OFFRE #{i}\n")
        f.write(f"{'='*70}\n\n")
        f.write(f"Poste: {title_clean}\n")
        f.write(f"Entreprise: {job['company']}\n")
        f.write(f"Lieu: {job.get('location', 'N/A')}\n")
        f.write(f"Salaire: {job.get('salary', 'N/A')}\n")
        f.write(f"Lien: {job.get('link', 'N/A')}\n")
        f.write(f"Type lettre: {letter_type}\n")
        f.write(f"\n{'='*70}\n\n")
        f.write(letter)
    
    if i <= 5 or i == len(jobs):
        print(f"✓ {filename} ({title_clean[:40]}...)")
    elif i == 6:
        print(f"  ... ({len(jobs)-5} autres lettres)...")

# Mettre à jour le JSON
with open('offres_complet_75.json', 'w', encoding='utf-8') as f:
    json.dump(jobs, f, ensure_ascii=False, indent=2)

print(f"\n{'='*70}")
print(f"✓ {len(jobs)} lettres personnalisées générées avec succès!")
print(f"✓ Fichier offres_complet_75.json mis à jour")
