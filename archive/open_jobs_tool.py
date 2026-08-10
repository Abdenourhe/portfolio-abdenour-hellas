import json
import webbrowser
import time
import os

# Charger les offres
with open('offres_jobbank.json', 'r', encoding='utf-8') as f:
    jobs = json.load(f)

print("=" * 70)
print("  OUTIL D'OUVERTURE RAPIDE DES OFFRES - ABDENOUR HELLAS")
print("=" * 70)
print()
print("Cet outil ouvre les liens des offres d'emploi dans votre navigateur")
print("par lots de 5, pour accélérer votre processus de postulation.")
print()
print("INSTRUCTIONS:")
print("1. Les onglets s'ouvriront automatiquement dans votre navigateur")
print("2. Pour chaque offre : copiez la lettre correspondante, postulez,")
print("   puis fermez l'onglet et passez à la suivante")
print("3. Appuyez sur ENTRÉE entre chaque lot pour continuer")
print()
print("=" * 70)
print()

batch_size = 5
total = len(jobs)

for batch_start in range(0, total, batch_size):
    batch_end = min(batch_start + batch_size, total)
    batch = jobs[batch_start:batch_end]
    
    print(f"\n{'='*70}")
    print(f"  LOT {batch_start//batch_size + 1} : Offres {batch_start+1} à {batch_end}")
    print(f"{'='*70}")
    
    for job in batch:
        num = jobs.index(job) + 1
        print(f"\n  [{num}] {job['company']}")
        print(f"      Poste: {job['title'][:50]}")
        print(f"      Lieu: {job.get('location', 'N/A')[:40]}")
        print(f"      Lettre: lettre_{num:03d}_{job['company'].replace(' ', '_').replace('/', '_')[:30]}.txt")
        print(f"      Lien: {job.get('link', 'N/A')[:60]}...")
        
        # Ouvrir le lien dans le navigateur
        link = job.get('link', '')
        if link:
            try:
                webbrowser.open_new_tab(link)
                time.sleep(0.5)
            except Exception as e:
                print(f"      ⚠ Impossible d'ouvrir: {e}")
    
    if batch_end < total:
        print(f"\n{'='*70}")
        print(f"  {batch_end} offres ouvertes sur {total}")
        print(f"  Appuyez sur ENTRÉE pour ouvrir le lot suivant...")
        print(f"  (ou tapez 'q' puis ENTRÉE pour quitter)")
        print(f"{'='*70}")
        
        try:
            response = input("> ")
            if response.lower() == 'q':
                print("\nArrêt demandé. À bientôt !")
                break
        except KeyboardInterrupt:
            print("\n\nArrêt. À bientôt !")
            break
    else:
        print(f"\n{'='*70}")
        print(f"  ✓ Toutes les {total} offres ont été ouvertes !")
        print(f"{'='*70}")

print("\n✓ Processus terminé.")
print("N'oubliez pas de mettre à jour le fichier Excel avec les statuts 'Postulé'.")
