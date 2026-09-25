# Données Charge Utile

## Catalogue d'exercices — `data/exercises/<famille>.json`

Un tableau d'objets. Tout le texte est en **français simple**, tutoiement, phrases courtes (lu sur un téléphone, essoufflé).

```json
{
  "id": "rdl-barre",
  "nom": "Soulevé de terre jambes tendues (barre)",
  "famille": "charniere",
  "anim": "rdl",
  "opts": {"load": "bar"},
  "type": "reps",
  "unilateral": false,
  "cote": null,
  "muscles": ["hams", "glutes", "lowback"],
  "musclesTxt": "Ischios, fessiers, bas du dos",
  "materiel": ["barre"],
  "niveau": 2,
  "consignes": ["Pousse les fesses loin derrière", "Barre collée aux jambes", "Dos plat, regard au sol devant"],
  "erreurs": ["Arrondir le dos", "Plier les genoux comme un squat"],
  "pourquoi": "Des ischios solides encaissent mieux les descentes et protègent le genou.",
  "respiration": "Inspire en descendant, souffle en remontant.",
  "securite": "Si le bas du dos tire, réduis l'amplitude : la barre s'arrête sous les genoux.",
  "tags": ["descente-vtt", "foulee", "genou", "chaine-posterieure"],
  "alternatives": ["rdl-halteres", "rdl-unijambe"],
  "tempoConseille": ["3", "0", "1", "0"],
  "voirEnVrai": null,
  "valide": true
}
```

| champ | valeurs |
|---|---|
| `famille` | `squat`, `fente`, `charniere`, `mollet-cheville`, `plio`, `proprio`, `gainage`, `haut-du-corps`, `cardio`, `echauffement`, `mobilite` (dynamique), `etirement` (statique) |
| `anim` + `opts` | identifiant défini par `Rig.define` + options passées à la fonction de pose |
| `type` | `reps` (répétitions, question RPE = reps en réserve) · `hold` (tenue en secondes, question = secondes en réserve) · `plyo` (question = explosivité, en phrases) · `effort` (sprint / machine à fond, question = effort) · `cardio` (échauffement / retour au calme, pas de question) |
| `unilateral` | `true` si l'exercice se fait une jambe / un bras à la fois (la prescription se lit « par jambe » / « par côté ») |
| `muscles` | clés de zones musculaires du mannequin (voir `moves/README.md`) |
| `materiel` | `barre`, `halteres`, `kettlebell`, `disque`, `banc`, `box`, `swissball`, `demi-swissball`, `plots`, `elastique`, `barre-traction`, `mur`, `sangle`, `tapis`, `marche`, `rameur`, `ski-erg`, `velo`, `sac-leste`, `machine`, `aucun` |
| `niveau` | 1 débutant · 2 intermédiaire · 3 avancé |
| `tags` (besoins sportifs) | `descente-vtt`, `coup-de-pedale`, `foulee`, `montee`, `explosivite`, `genou`, `cheville`, `hanche`, `dos`, `gainage`, `proprio`, `chaine-posterieure`, `haut-du-corps`, `echauffement`, `cardio`, `retour-au-calme`, `mobilite`, `etirement`, `recuperation`, `avant-effort`, `velo`, `trail` |
| `alternatives` | ids d'exercices du catalogue, du plus proche au plus éloigné |
| `tempoConseille` | tempo par défaut `[excentrique, pause basse, concentrique, pause haute]` (`"X"` = explosif), ou `null` pour les mouvements cycliques |
| `voirEnVrai` | lien vers une vraie vidéo (fitnessprogramer si l'exercice y existe), sinon `null` (le lecteur ouvre alors une recherche YouTube) |
| `valide` | `true` = validé par Nathan (seuls les exercices validés sont proposés aux athlètes) |
| `zones` | zones du corps sollicitées ou étirées : `cou`, `epaules`, `haut-du-dos`, `bas-du-dos`, `hanches`, `fessiers`, `adducteurs`, `quadriceps`, `ischios`, `genoux`, `mollets`, `chevilles`, `pieds`, `poignets` (obligatoire en mobilité / étirement : sert à écarter un exo si l'athlète a mal à cet endroit) |
| `progression` | facultatif, pour les exercices à niveaux : `{"groupe": "equilibre-unipodal", "niveau": 1-4, "nom": "Facile" \| "Moyen" \| "Difficile" \| "Hardcore"}`. L'appli monte ou descend d'un niveau selon le ressenti |
| `dureeConseillee` | durée par défaut en secondes (tenues, étirements, mobilité) quand l'exo est tiré par le générateur de récup |
| `repsConseillees` | reps par défaut (mobilité dynamique) quand l'exo est tiré par le générateur de récup |

## Séances — `data/sessions/<code-athlète>.json`

```json
{
  "athlete": "k7m2qa",
  "prenom": "Léo",
  "coach": "Nathan",
  "focus": ["genoux", "chevilles"],
  "seances": [ { …séance… } ]
}
```

Séance :

```json
{
  "id": "2026-09-18-plio",
  "date": "2026-09-18",
  "titre": "Pliométrie",
  "rpe": "7 à 8",
  "dureeMin": 75,
  "message": "Objectif : des appuis explosifs.",
  "blocs": [
    {"nom": "Échauffement", "type": "cardio", "items": [{"ex": "tapis", "duree": 300, "niveau": "Facile"}]},
    {"nom": "Circuit", "type": "circuit", "tours": 3, "recupExo": 15, "recupTour": 120, "items": [
      {"ex": "jumping-jack", "duree": 30},
      {"ex": "hip-thrust-unijambe-pdc", "reps": 10, "alterne": true}
    ]},
    {"nom": "Corps de séance", "type": "series", "items": [
      {"ex": "squat-barre", "series": 4, "reps": 5, "charge": 60, "pas": 5, "rpe": 8, "recup": 240, "tempo": ["3","5","X","0"], "filmer": 2},
      {"ex": "box-jump", "series": 5, "reps": 8, "recup": 60, "intention": "Explosif"}
    ]},
    {"nom": "Exos genoux", "type": "libre", "min": 10, "max": 15, "note": "…", "items": [{"ex": "etoile-plots"}, {"ex": "equilibre-demi-swissball"}]},
    {"nom": "Retour au calme", "type": "cardio", "items": [{"ex": "tapis", "duree": 300, "niveau": "Très facile"}]}
  ]
}
```

Champs d'un item : `ex` (id du catalogue, obligatoire) · `reps` ou `duree` (s) · `series` · `charge` (nombre en kg ou texte : « disque 10 kg ») · `pas` (kg d'ajustement) ·
`rpe` (cible) · `recup` (s) · `tempo` · `alterne` · `parCote` · `intention` · `filmer` (numéro de série à filmer) · `consignes` (remplace celles du catalogue) ·
`nom` (remplace le nom du catalogue) · `note` (précision de Nathan).

`focus` (fichier athlète, facultatif) : zones à travailler en priorité dans les routines Récup & mobilité (mêmes valeurs que `zones` des fiches).

## Charges en % du max estimé

Un item de bloc `series` peut être prescrit en % du max estimé (1RM calculé par les tests) :

```json
{"ex": "squat-barre", "series": 4, "reps": 5, "pct": 80, "base": "squat", "charge": 60, "e1rm": 75, "e1rmDate": "2026-09-10", "pas": 5, "rpe": 8}
```

`base` = `squat` ou `sdt` (soulevé de terre). `charge` = les kilos calculés par `python3 coach.py charge <code> <base> <pct>` (arrondi à 2,5 kg en dessous), qui donne aussi `e1rm` et `e1rmDate`.
Si l'athlète a refait son test sur son téléphone après `e1rmDate`, l'appli recalcule la charge depuis son nouveau max. L'ajustement au RPE reste actif.

## Tests — `data/tests.json` et bloc `test`

La batterie est décrite dans `data/tests.json` (protocole, mode de mesure, erreur de mesure `mdc`, seuils d'écart `asym`/`asymPct`, repère, sources).
Modes : `saisie` (mètre), `angle` (capteur du téléphone), `chrono`, `metronome` (reps comptées par l'appli), `force` (max estimé, formule d'Epley), `video` (filmé puis critères oui/non).

Une séance de tests contient un bloc de type `test` :

```json
{"nom": "Tests", "type": "test", "items": [{"test": "saut-unipodal"}, {"test": "squat-e1rm", "e1rm": 75, "e1rmDate": "2026-09-10"}, {"test": "sdt-e1rm", "variante": "trap"}]}
```

`variante` (soulevé de terre) : `trap` ou `classique`. `e1rm` sert à proposer la charge de la série test.
Ne l'écris pas à la main : `python3 coach.py batterie <code> A|B <date>` construit la séance selon le profil privé de l'athlète.

Les résultats restent sur le téléphone (« Ma fiche ») et partent dans le message de fin, avec une ligne `FICHE …` que `coach.py fiche-ajoute` range dans `prive/fiches/<code>.json` (jamais publié : `prive/` est dans `.gitignore`).
