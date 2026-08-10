import json

# Charger les offres
with open('offres_jobbank.json', 'r', encoding='utf-8') as f:
    jobs = json.load(f)

# Déterminer le type de lettre pour chaque offre
def get_letter_type(title, company):
    t = title.lower()
    if any(word in t for word in ['apprentice', 'apprenti', 'technicien', 'technician', 'maintenance']):
        return 'maintenance'
    elif any(word in t for word in ['supervisor', 'superviseur', 'manager', 'chef']):
        return 'supervision'
    elif any(word in t for word in ['automation', 'automatisation', 'control', 'contrôle']):
        return 'automatisation'
    else:
        return 'generale'

# Charger les modèles de lettres
letters = {}
for name in ['generale', 'automatisation', 'maintenance', 'supervision']:
    with open(f'lettre_motivation_{name}.txt', 'r', encoding='utf-8') as f:
        letters[name] = f.read()

# Générer une lettre personnalisée pour chaque offre
generated = []
for i, job in enumerate(jobs, 1):
    letter_type = get_letter_type(job['title'], job['company'])
    job['lettre_type'] = letter_type
    
    # Nettoyer le titre
    title_clean = job['title']
    title_clean = title_clean.replace('Talent.com', '').replace('Job Bank', '').replace('Indeed', '').replace('CareerBeacon', '').strip()
    title_clean = ' '.join(title_clean.split())
    
    # Générer la lettre
    letter = letters[letter_type].format(
        poste=title_clean,
        entreprise=job['company']
    )
    
    filename = f"lettre_{i:03d}_{job['company'].replace(' ', '_').replace('/', '_')[:30]}.txt"
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(f"=== OFFRE #{i} ===\n")
        f.write(f"Titre: {title_clean}\n")
        f.write(f"Entreprise: {job['company']}\n")
        f.write(f"Lieu: {job.get('location', 'N/A')}\n")
        f.write(f"Salaire: {job.get('salary', 'N/A')}\n")
        f.write(f"Lien: {job.get('link', 'N/A')}\n")
        f.write(f"Type lettre: {letter_type}\n")
        f.write("=" * 60 + "\n\n")
        f.write(letter)
    
    generated.append({
        'num': i,
        'filename': filename,
        'title': title_clean,
        'company': job['company'],
        'location': job.get('location', ''),
        'salary': job.get('salary', ''),
        'link': job.get('link', ''),
        'letter_type': letter_type
    })
    print(f"✓ {filename} ({title_clean[:40]}...)")

# Mettre à jour le JSON
with open('offres_jobbank.json', 'w', encoding='utf-8') as f:
    json.dump(jobs, f, ensure_ascii=False, indent=2)

print(f"\n{'='*60}")
print(f"✓ {len(generated)} lettres personnalisées générées")
print(f"✓ Fichier offres_jobbank.json mis à jour avec les types de lettre")
