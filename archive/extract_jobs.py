import json
import re
import os

# Lire le fichier log et extraire les offres
log_path = r"C:/Users/heabd/AppData/Roaming/kimi-desktop/daimon-share/daimon/runtime/kimi-code/home/sessions/wd_mon-port-folio_e8890cbfec94/conv-7dc21ca66e1ae533f759aaf3/agents/main/tasks/bash-itj46xdf/output.log"

with open(log_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extraire la partie JSON des offres
# Le format est: {"ok":true,"data":{"type":"string","value":"[...offres...]"}}
match = re.search(r'"value":"(\[.*\])"', content)

jobs = []
if match:
    json_str = match.group(1)
    # Remplacer les échappements JSON
    json_str = json_str.replace('\\n', '\n').replace('\\t', '\t').replace('\\"', '"')
    try:
        jobs = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"Erreur parsing JSON: {e}")
        # Essayer une approche alternative
        # Chercher tous les objets JSON individuellement
        pass

# Si le parsing a échoué, créons des offres à partir du texte brut
if not jobs:
    print("Parsing automatique échoué, extraction manuelle...")
    # Patterns pour extraire les infos
    titles = re.findall(r'"title":"([^"]+)"', content)
    companies = re.findall(r'"company":"([^"]+)"', content)
    locations = re.findall(r'"location":"Location([^"]+)"', content)
    salaries = re.findall(r'"salary":"Salary([^"]+)"', content)
    dates = re.findall(r'"date":"([^"]+)"', content)
    links = re.findall(r'"link":"([^"]+)"', content)
    
    for i in range(min(len(titles), 20)):
        title_clean = titles[i].replace('\\n', ' ').replace('\\t', ' ').strip()
        # Enlever les préfixes comme "Talent.com"
        title_clean = re.sub(r'^Talent\.com\s+', '', title_clean)
        title_clean = re.sub(r'\s+', ' ', title_clean)
        
        company_clean = companies[i].replace('\\n', ' ').replace('\\t', ' ').strip()
        loc_clean = locations[i].replace('\\n', ' ').replace('\\t', ' ').strip() if i < len(locations) else ''
        sal_clean = salaries[i].replace('\\n', ' ').replace('\\t', ' ').strip() if i < len(salaries) else ''
        date_clean = dates[i] if i < len(dates) else ''
        link_clean = links[i] if i < len(links) else ''
        
        jobs.append({
            'title': title_clean,
            'company': company_clean,
            'location': loc_clean,
            'salary': sal_clean,
            'date': date_clean,
            'link': link_clean,
            'status': 'À postuler',
            'lettre_type': 'generale'
        })

print(f"{len(jobs)} offres extraites")
for j in jobs[:5]:
    print(f"  - {j['title'][:60]} | {j['company'][:40]} | {j['location'][:40]}")

# Sauvegarder en JSON
with open('offres_jobbank.json', 'w', encoding='utf-8') as f:
    json.dump(jobs, f, ensure_ascii=False, indent=2)

print("\n✓ offres_jobbank.json créé")
