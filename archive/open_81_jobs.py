import json
import webbrowser
import time

with open('offres_complet_75.json', 'r', encoding='utf-8') as f:
    jobs = json.load(f)

print("="*75)
print("  OUTIL D'OUVERTURE RAPIDE - 81 OFFRES")
print("="*75)
print()
print("Cet outil ouvre les liens par lots de 5 dans votre navigateur.")
print("Pour chaque offre : copiez la lettre, postulez, fermez l'onglet.")
print()
print("INSTRUCTIONS:")
print("- Les onglets s'ouvrent automatiquement")
print("- Postulez sur chaque site")
print("- Appuyez sur ENTRÉE pour le lot suivant")
print("- Tapez 'q' + ENTRÉE pour quitter")
print()
print("="*75)
print()

batch_size = 5
for batch_start in range(0, len(jobs), batch_size):
    batch_end = min(batch_start + batch_size, len(jobs))
    batch = jobs[batch_start:batch_end]
    
    print(f"\n{'='*75}")
    print(f"  LOT {(batch_start//batch_size)+1} : Offres {batch_start+1} à {batch_end}")
    print(f"{'='*75}")
    
    for job in batch:
        num = jobs.index(job) + 1
        print(f"\n  [{num:03d}] {job['company']}")
        print(f"        {job['title'][:55]}")
        print(f"        Lettre: lettre_{num:03d}_*.txt")
        link = job.get('link', '')
        if link:
            try:
                webbrowser.open_new_tab(link)
                time.sleep(0.3)
            except:
                pass
    
    if batch_end < len(jobs):
        print(f"\n{'='*75}")
        print(f"  {batch_end}/{len(jobs)} offres ouvertes")
        print(f"  Appuyez sur ENTRÉE pour continuer (ou 'q' pour quitter)")
        print(f"{'='*75}")
        try:
            r = input("> ")
            if r.strip().lower() == 'q':
                print("\nArrêt. À bientôt!")
                break
        except:
            break
    else:
        print(f"\n{'='*75}")
        print(f"  ✓ Toutes les {len(jobs)} offres ont été ouvertes!")
        print(f"{'='*75}")

print("\n✓ Terminé. Mettez à jour le Excel avec les statuts 'Postulé'.")
