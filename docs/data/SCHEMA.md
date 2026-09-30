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

Champ de bloc `circuit` : `noRpe: true` supprime la question « ce tour, c'était comment ? » (échauffement, mise en route, mobilité : une donnée qui ne sert à rien coûte un tap par tour).

`focus` (fichier athlète, facultatif) : zones à travailler en priorité dans les routines Récup & mobilité (mêmes valeurs que `zones` des fiches).

## Charges en % du max estimé

Un item de bloc `series` peut être prescrit en % du max de l'exercice (mesuré par un test RM) :

```json
{"ex": "squat-barre", "series": 4, "reps": 5, "pct": 80, "base": "squat-barre", "charge": 60, "e1rm": 75, "e1rmDate": "2026-09-10", "pas": 5, "rpe": 8}
```

`base` = l'exercice testé (par défaut l'exercice lui-même ; `squat` et `sdt` restent acceptés). `charge`, `e1rm`, `e1rmDate` : donnés par `python3 coach.py charge <code> <exercice> <pct>` (arrondi en dessous : 2,5 kg à la barre, 2 kg aux haltères).
Si l'athlète a refait son test sur son téléphone après `e1rmDate`, l'appli recalcule la charge. L'ajustement au RPE reste actif.

## Tests — `data/tests.json` et bloc `test`

La batterie est décrite dans `data/tests.json` (protocole, mode de mesure, erreur de mesure `mdc`, seuils d'écart `asym`/`asymPct`, repère, sources).
Modes : `saisie` (mètre), `angle` (capteur du téléphone), `chrono`, `metronome` (reps comptées par l'appli), `force` (test RM), `video` (filmé puis critères oui/non).

Une séance de tests contient un bloc de type `test` (seule, ou avec un échauffement `cardio` : elle va alors dans l'onglet **Tests** ; mélangée à d'autres blocs, elle reste dans **Séances**) :

```json
{"nom": "Tests", "type": "test", "items": [
  {"test": "saut-unipodal"},
  {"test": "rm", "ex": "squat-barre", "reps": 5, "rir": 1, "box": true, "e1rm": 75, "e1rmDate": "2026-09-10"},
  {"test": "rm", "ex": "developpe-couche-barre", "reps": 1}
]}
```

**Test RM** (`"test": "rm"`), sur n'importe quel exercice du catalogue, réglé par Nathan :
`ex` (obligatoire) · `reps` visées pour la série test (1 à 12 ; **1 = vrai 1RM** par tentatives, réussi/raté) · `rir` reps gardées en réserve (0 à 3, défaut 1) ·
`pas` (kg, défaut 2,5 à la barre, 2 aux haltères) · `box` (squat touché-box, hauteur notée) · `barres` (forcer ou retirer la case « barres de sécurité », par défaut pour squat, fente et développé à la barre) ·
`echauffement` `[[% de la charge test, reps, récup s], …]` (défaut 40/60/80/90 %) · `e1rm`, `e1rmDate` (pour proposer la charge) · `note`.
Le résultat est rangé sous `rm:<exercice>` : un max par exercice.

`python3 coach.py batterie <code> A <date> squat-barre:5 souleve-de-terre:3:1 developpe-couche-barre:1` écrit la séance (saut ou assis-debout selon le profil + les tests RM choisis) ; `… B <date>` la batterie mobilité.

Les résultats restent sur le téléphone (onglet Tests, « Ma fiche ») et partent dans le message de fin, avec une ligne `FICHE …` que `coach.py fiche-ajoute` range dans `prive/fiches/<code>.json` (jamais publié : `prive/` est dans `.gitignore`).
