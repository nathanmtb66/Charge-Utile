# Consignes des sous-agents « science » (phase 2)

Lis d'abord `_CONSIGNES.md` (produit, règles). Ce qui suit les complète.

## Public
Athlètes d'endurance de 18 à 25 ans, niveau régional à national : VTT cross-country (XCO), route, trail court (et, en second, triathlon, ski nordique). 8 à 20 h d'endurance par semaine, 1 à 3 séances de muscu. Coach : Nathan (L3 STAPS). Altitude : Font-Romeu, 1 800 m.

## Zéro référence inventée : méthode obligatoire
- Pour trouver et **ouvrir** les articles, utilise l'API Europe PMC avec `curl` dans Bash (rapide, fiable, donne le résumé) :
  - recherche : `curl -s -G "https://www.ebi.ac.uk/europepmc/webservices/rest/search" --data-urlencode "query=<requête>" --data-urlencode "format=json" --data-urlencode "resultType=lite" --data-urlencode "pageSize=25"`
  - résumé d'un article : `curl -s "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:<PMID>%20AND%20SRC:MED&format=json&resultType=core"` → champ `abstractText`.
  - Astuce requêtes : `PUB_TYPE:"systematic review"`, `PUB_TYPE:"meta-analysis"`, `TITLE:"..."`, `AUTH:"Ronnestad BR"`, `PUB_YEAR:[2018 TO 2026]`.
- Une source n'entre dans ta liste **que si tu as lu son résumé** (ou la page de l'éditeur / du consensus). Note dans `note` ce que le résumé montre, chiffres compris. Pas de chiffre que tu n'as pas lu.
- Consensus (CIO, ACSM, ECSS, ISSN, AIS, NSCA, BJSM) : ouvre-les aussi (Europe PMC ou page officielle).
- Podcasts, livres, coachs : niveau D, seulement si la page a été ouverte.
- Cherche activement les méta-analyses qui **contredisent** une idée populaire.

## Livrable (un fichier brut, presque final, que l'agent principal relira)
`recherche/_brut/science-<lettre>.md`, écrit **au fur et à mesure** (après chaque section), avec :
1. `# <Lettre> — <titre du domaine>` + « En 1 minute » (5-8 puces).
2. **Tableau d'affirmations** (au moins 30 lignes) :
   `| Affirmation | Preuve | Chiffres | Sources | Application pour l'appli / le coach |`
   - Preuve : **A** consensus ou méta-analyses cohérentes · **B** plusieurs essais cohérents · **C** peu d'études, contradictoires ou populations éloignées · **D** avis d'expert / terrain.
   - Sources : clés au format arobase entre crochets, par exemple `[@ronnestad2014]`, plusieurs possibles.
   - Chiffres : tailles d'effet, %, doses, durées tels que lus dans les résumés.
3. `## Chiffres clés` (puces chiffrées, sourcées).
4. `## Mythes et verdicts` (au moins 8 : mythe → verdict → preuve).
5. `## Règles pour l'entraîneur` : **20 à 40 règles actionnables**, numérotées, chacune avec sa lettre de preuve et ses clés.
6. `## Ce que l'appli devrait faire` : fonctions concrètes de Charge Utile qui découlent du savoir (et ce qu'il ne faut PAS faire).
7. `## Limites et incertitudes`.
8. `## Sources vérifiées` : bloc ```json, au moins **30 sources** dont au moins **10 méta-analyses, revues systématiques ou consensus**. Format :
   {"cle": "ronnestad2014", "auteurs": "Rønnestad BR, Mujika I", "annee": 2014, "titre": "…", "revue": "Scand J Med Sci Sports 24(4):603-612", "doi": "10.1111/sms.12104", "url": "https://doi.org/10.1111/sms.12104", "type": "meta-analyse|revue-systematique|consensus|revue|essai|observationnelle|podcast|site|livre", "niveau": "A|B|C|D", "verifie": true, "note": "ce que le résumé montre, en une phrase, avec chiffres"}
   - Clé : nom du premier auteur en minuscules sans accents + année (+ lettre si besoin : `helland2017b`). **Avant de créer une clé, regarde `recherche/sources.json`** : si l'article y est déjà, réutilise la même clé ; ne crée jamais une clé déjà prise par un autre article.
   - `url` : `https://doi.org/<doi>` si DOI, sinon l'URL Europe PMC/PubMed.

## Style
Français, phrases courtes, sans jargon inutile. Pas de diagnostic médical : « gêne », « zone à travailler », « parles-en à un kiné/médecin ». Honnêteté : dis quand la preuve est faible ou contradictoire. Citations ≤ 15 mots.
