# Consignes des sous-agents « séances modèles » (phase 4)

Dépôt : /Users/nathanrousselle/Documents/GitHub/Charge-Utile (PUBLIC). Tu n'écris QUE ton ou tes fichiers `recherche/modeles/<nom>.json`. Aucune commande git. Tu ne modifies rien d'autre.

## À lire d'abord (lecture seule)
1. `docs/data/SCHEMA.md`, section « Séances » : le format exact (blocs `cardio`, `circuit`, `series`, `libre`, `test` ; champs des items).
2. Une vraie séance : `python3 -c "import json;print(json.dumps(json.load(open('docs/data/sessions/demo.json'))['seances'][0],ensure_ascii=False,indent=1))"`.
3. Les exercices disponibles : `recherche/_brut/catalogue-index.md` (190 exercices existants) **et** les fiches candidates de `recherche/exercices/*.json` (liste compacte : `python3 -c "import json,glob;[print(x['id'],'|',x['nom'],'|',x['famille'],'|',x['type'],'|',','.join(x['materiel']),'|N'+str(x['niveau']),'|P'+str(x['priorite'])) for f in sorted(glob.glob('recherche/exercices/*.json')) for x in json.load(open(f))]"`). Tu peux utiliser les deux ; **préfère les exercices existants** quand ils conviennent (ils sont déjà animés), et mets en valeur les candidats de priorité 1.
4. La science : `recherche/science/A-force-endurance.md` (dosages, maintien, affûtage), `B-plio-tendons-prevention.md` (contacts de plio, mollet, os), `I-periodisation.md` (phases, semaines types), `G-adhesion.md` (séances courtes), et `recherche/regles/regles.md`. Les clés de sources sont dans `recherche/sources.json`.

## Format d'une séance modèle
Un fichier = `{"seances": [ ... ]}`. Chaque séance :
```json
{
  "id": "vtt-ppg-force-max-1",
  "titre": "Force max jambes (PPG)",
  "rpe": "7 à 8",
  "dureeMin": 60,
  "message": "1 ou 2 phrases pour l'athlète : l'objectif, et la consigne clé. Tutoiement.",
  "sport": "vtt",
  "phase": "PPG",
  "duree": 60,
  "materiel": "salle",
  "niveau": 2,
  "contextes": ["force-max"],
  "pourquoi": "Une phrase : à quoi sert cette séance pour ce sport à ce moment de la saison.",
  "preuve": "B · [@ronnestad2014] [@eihara2022]",
  "blocs": [
    {"nom": "Échauffement", "type": "cardio", "items": [{"ex": "velo", "duree": 300, "niveau": "Facile"}]},
    {"nom": "Activation", "type": "circuit", "tours": 2, "recupExo": 10, "recupTour": 30, "noRpe": true, "items": [{"ex": "…", "reps": 10}]},
    {"nom": "Force", "type": "series", "items": [
      {"ex": "squat-barre", "series": 4, "reps": 5, "rpe": 8, "recup": 180, "tempo": ["3","0","1","0"], "note": "Charge lourde : environ 80-85 % de ton max. Garde 2 reps en réserve."}
    ]},
    {"nom": "Retour au calme", "type": "cardio", "items": [{"ex": "velo", "duree": 300, "niveau": "Très facile"}]}
  ]
}
```
Règles :
- `sport` : `vtt`, `route`, `trail`, `triathlon`, `nordique` (selon le fichier) ; `tous` dans `transversal.json`.
- `phase` : `PPG`, `PPO`, `PPS`, `PPC`, `AFFUTAGE`, `TRANSITION`, `RECUP`. (PPG = préparation générale ; PPO = orientée ; PPS = spécifique ; PPC = période de compétition.)
- `duree` = `dureeMin` (minutes réelles, échauffement compris ; compte honnêtement : séries × (effort + récup)).
- `materiel` : `salle`, `halteres`, `elastique` ou `aucun`. Une séance `aucun` ne contient que des exercices sans matériel (tapis, mur, marche tolérés).
- `niveau` 1-3. `contextes` (liste, facultative) parmi : `maintien-saison`, `voyage`, `genou`, `cheville`, `epaule`, `retour-coupure`, `veille-course`, `plio-trail`, `force-max`, `puissance`, `recup`, `os`, `express`, `decouverte`, `tests`.
- **Pas de charge en kg ni de `pct`** dans un modèle : donne un `rpe` cible (1-10) et, en `note`, un repère (« environ 80 % de ton max », « 2 reps en réserve »). Jamais de série à l'échec (RPE 10) : RPE 7-8 pour la force, 6-7 en maintien et en affûtage.
- Exercices tenus (type `hold`) : `duree` en secondes. Unilatéral : `parCote: true` ou `alterne: true`.
- `preuve` : lettre + clés existantes. Sois honnête : **une séance modèle est une construction d'expert (D) appuyée sur des principes B ou C** ; écris par exemple `C · [@ronnestad2010b]` ou `D · construction d'expert, principes [@eihara2022]`.
- Pas de vocabulaire médical. Les séances « genou », « cheville », « épaule » sont du renforcement pour un athlète **sans douleur** (« genoux solides »), pas de la rééducation ; écris-le dans `message` : « si tu as une gêne, parles-en à ton coach ou à un kiné ».
- Repères scientifiques à respecter : force lourde 3-6 reps à RPE 7-8, 2 séances par semaine en préparation ; maintien en saison = 1 séance courte (25-30 min), 1-2 séries, charge lourde gardée ; affûtage = volume −40 à −60 %, intensité gardée ; veille de course = activation de 10-15 min, sans excentrique ni plio intense ; plio : 30-60 contacts pour un débutant, compte les contacts dans `pourquoi` ou `message` ; plio et explosif en début de séance ; séances courtes (30-45 min) de préférence.

## Contrôle
`python3 recherche/_outils/verifie_modeles.py recherche/modeles/<nom>.json` doit afficher OK. Écris par lots de 3-4 séances et relance le contrôle à chaque fois.

## Message final
≤ 120 mots : nombre de séances, phases et contextes couverts, exercices candidats les plus utilisés, limites.
