import json
import webbrowser
import time

with open('offres_complet_75.json', 'r', encoding='utf-8') as f:
    jobs = json.load(f)

# Ouvrir les 25 PREMIÈRES offres SANS attendre d'interaction
print("="*75)
print("  OUVERTURE AUTOMATIQUE DES 25 PREMIÈRES OFFRES")
print("="*75)
print()
print("Les onglets vont s'ouvrir automatiquement dans votre navigateur.")
print("Attendez 30 secondes que tout charge...")
print()

for i, job in enumerate(jobs[:25], 1):
    link = job.get('link', '')
    if link:
        try:
            webbrowser.open_new_tab(link)
            print(f"  [{i:02d}/25] Ouvert: {job['company'][:35]}...")
            time.sleep(0.5)
        except Exception as e:
            print(f"  [{i:02d}/25] ERREUR: {job['company'][:35]}... ({e})")

print()
print("="*75)
print("  ✓ 25 offres ouvertes dans votre navigateur!")
print("="*75)
print()
print("ACTIONS À FAIRE MAINTENANT:")
print("1. Allez dans votre navigateur (Chrome/Edge)")
print("2. Vous avez 25 onglets ouverts avec les offres")
print("3. Pour chaque onglet:")
print("   - Ouvrez le fichier lettre_XXX correspondant")
print("   - Copiez la lettre de motivation")
print("   - Postulez sur le site")
print("   - Fermez l'onglet quand terminé")
print()
print("4. Après les 25 premières, réexécutez ce script")
print("   en modifiant 'jobs[:25]' par 'jobs[25:50]' pour")
print("   les 25 suivantes, etc.")
print()
print("Estimation: 2-3 minutes par offre = 25 postes en ~1h")
print()
