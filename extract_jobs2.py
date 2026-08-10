import json
import re

# Lire le fichier log
log_path = r"C:/Users/heabd/AppData/Roaming/kimi-desktop/daimon-share/daimon/runtime/kimi-code/home/sessions/wd_mon-port-folio_e8890cbfec94/conv-7dc21ca66e1ae533f759aaf3/agents/main/tasks/bash-itj46xdf/output.log"

with open(log_path, 'r', encoding='utf-8') as f:
    raw = f.read()

# La structure est: {"ok":true,"data":{"type":"string","value":"<CONTENU JSON ÉCHAPPÉ>"}}
# Trouver le début et la fin de value
start = raw.find('"value":"') + len('"value":"')
if start == -1 + len('"value":"'):
    print("Pattern non trouvé")
    exit()

# Trouver la fin: la dernière occurrence de "}} avant la fin
end = raw.rfind('"}}')
if end == -1:
    end = len(raw)

json_escaped = raw[start:end]

# Déséchapper les caractères JSON
# En JSON string, \\n = \n en Python string, \n = newline
# \\t = \t en Python string, \t = tab
# \\\" = \" en Python string, \" = "
json_str = json_escaped.encode('utf-8').decode('unicode_escape')

# Mais attention: unicode_escape convertit aussi \\ en \, ce qui peut casser les URLs
# Utilisons json.loads avec le string original en le traitant comme un JSON string valide
# Wrappé dans un objet pour le parser correctement
wrapped = '{"jobs": "' + json_escaped + '"}'

try:
    parsed = json.loads(wrapped)
    jobs_json_str = parsed['jobs']
    jobs = json.loads(jobs_json_str)
    print(f"✓ {len(jobs)} offres extraites avec succès!")
except Exception as e:
    print(f"Erreur: {e}")
    # Approche alternative: trouver tous les liens et extraire manuellement
    jobs = []

# Si on a des jobs, les nettoyer
if jobs:
    for j in jobs:
        for key in j:
            if isinstance(j[key], str):
                j[key] = j[key].replace('\n', ' ').replace('\t', ' ').strip()
                j[key] = re.sub(r'\s+', ' ', j[key])
        # Nettoyer le titre
        j['title'] = re.sub(r'^Talent\.com\s*', '', j['title'])
        j['title'] = re.sub(r'^(\w+\s+\d+,\s+\d{4})\s*', '', j['title'])
        j['location'] = re.sub(r'^Location\s*', '', j['location'])
        j['salary'] = re.sub(r'^Salary\s*', '', j['salary'])
        j['status'] = 'À postuler'
        j['date_postulation'] = ''
        j['lettre_type'] = 'generale'
    
    # Sauvegarder
    with open('offres_jobbank.json', 'w', encoding='utf-8') as f:
        json.dump(jobs, f, ensure_ascii=False, indent=2)
    
    print(f"\nTop 10 offres:")
    for i, j in enumerate(jobs[:10], 1):
        print(f"  {i}. {j['title'][:50]} | {j['company'][:30]} | {j['location'][:30]} | {j['salary'][:40]}")
    
    print(f"\n✓ offres_jobbank.json mis à jour avec {len(jobs)} offres")
else:
    print("Aucune offre extraite")
