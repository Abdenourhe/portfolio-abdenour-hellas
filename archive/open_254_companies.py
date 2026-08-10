import json
import webbrowser
import time

with open('entreprises_200_plus.json', 'r', encoding='utf-8') as f:
    companies = json.load(f)

print("="*75)
print("  OUVERTURE RAPIDE - 254 ENTREPRISES CANADIENNES")
print("="*75)
print()
print("Cet outil ouvre les pages carrières par lots de 5.")
print("Pour chaque entreprise : cherchez 'electrical engineer' sur leur site,")
print("postulez, puis passez à la suivante.")
print()
print("Appuyez sur ENTRÉE entre chaque lot pour continuer")
print("Tapez 'q' + ENTRÉE pour quitter")
print()
print("="*75)
print()

batch_size = 5
for batch_start in range(0, len(companies), batch_size):
    batch_end = min(batch_start + batch_size, len(companies))
    batch = companies[batch_start:batch_end]
    
    print(f"\n{'='*75}")
    print(f"  LOT {(batch_start//batch_size)+1} : Entreprises {batch_start+1} à {batch_end}")
    print(f"{'='*75}")
    
    for c in batch:
        print(f"\n  [{c['num']:03d}] {c['company']}")
        print(f"        Secteur: {c['sector']}")
        print(f"        Ville: {c['city']}")
        print(f"        Poste: {c['poste']}")
        
        link = c.get('careers', '')
        if link:
            try:
                webbrowser.open_new_tab(link)
                time.sleep(0.3)
            except:
                pass
    
    if batch_end < len(companies):
        print(f"\n{'='*75}")
        print(f"  {batch_end}/{len(companies)} entreprises ouvertes")
        print(f"  Appuyez sur ENTRÉE pour continuer (ou 'q' pour quitter)")
        print(f"{'='*75}")
        try:
            r = input("> ")
            if r.strip().lower() == 'q':
                print("\nArrêt demandé.")
                break
        except:
            break
    else:
        print(f"\n{'='*75}")
        print(f"  ✓ Toutes les {len(companies)} entreprises ont été ouvertes!")
        print(f"{'='*75}")

print("\n✓ Terminé. Postulez sur chaque site et suivez dans le Excel.")
