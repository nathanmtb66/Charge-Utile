# Consignes des sous-agents « exercices » (phase 3)

Dépôt : /Users/nathanrousselle/Documents/GitHub/Charge-Utile (PUBLIC). Tu n'écris QUE ton fichier `recherche/exercices/<nom>.json`. Aucune commande git. Tu ne modifies ni `docs/`, ni `tools/`, ni `qa/`.

## À lire d'abord (lecture seule)
1. `docs/data/SCHEMA.md` : le format exact d'une fiche (section « Catalogue d'exercices »).
2. `recherche/_brut/catalogue-index.md` : les 190 exercices existants (ids, familles, animations et options utilisées) et les 152 animations disponibles. **Ne propose rien qui existe déjà** (même mouvement sous un autre nom = refus).
3. Pour voir une fiche complète : `python3 coach.py fiche <id>` (depuis la racine du dépôt). Regarde 3-4 fiches proches de ton lot pour copier le ton.
4. Les fichiers `recherche/science/*.md` (domaines A à H) pour la justification et les clés de sources ; `recherche/sources.json` pour vérifier qu'une clé existe.

## Public
Athlètes d'endurance 18-25 ans, régional à national : VTT XCO, route, trail court ; aussi triathlon et ski nordique. Lecture sur téléphone, essoufflé : **français simple, tutoiement, phrases courtes**.

## Format d'une fiche candidate (tous les champs sont obligatoires)
```json
{
 "id": "kebab-case-francais-inedit",
 "nom": "Nom clair en français (matériel entre parenthèses si utile)",
 "famille": "squat|fente|charniere|mollet-cheville|plio|proprio|gainage|haut-du-corps|cardio|echauffement|mobilite|etirement",
 "anim": "nom d'une animation existante proche, sinon null",
 "opts": {},
 "animAFaire": "SEULEMENT si anim est null : description précise de la pose pour un animateur — position de départ (s=0), position basse ou étirée (s=1), appuis au sol, angles approximatifs des articulations, matériel et où il est tenu",
 "type": "reps|hold|plyo|effort|cardio",
 "unilateral": false,
 "cote": null,
 "muscles": ["clés parmi : quads, quadsL, hams, glutes, calves, abs, obliques, lowback, pecs, delts, arms, biceps, triceps, forearms, lats, upperback, adductors, shins, hipflex"],
 "musclesTxt": "Muscles en français",
 "materiel": ["parmi : barre, halteres, kettlebell, disque, banc, box, swissball, demi-swissball, plots, elastique, barre-traction, mur, sangle, tapis, marche, rameur, ski-erg, velo, sac-leste, machine, aucun"],
 "niveau": 1,
 "consignes": ["3 consignes", "de 48 caractères maximum", "tutoiement, impératif"],
 "erreurs": ["2 erreurs fréquentes", "courtes"],
 "pourquoi": "Une phrase reliée au VTT, à la route, au trail (ou au triathlon / ski nordique).",
 "respiration": "Une phrase.",
 "securite": "Une phrase. Jamais de vocabulaire médical : « gêne », « si ça tire », « parles-en à un kiné ».",
 "tags": ["parmi : descente-vtt, coup-de-pedale, foulee, montee, explosivite, genou, cheville, hanche, dos, gainage, proprio, chaine-posterieure, haut-du-corps, echauffement, cardio, retour-au-calme, mobilite, etirement, recuperation, avant-effort, velo, trail"],
 "zones": ["OBLIGATOIRE en mobilite et etirement ; parmi : cou, epaules, haut-du-dos, bas-du-dos, hanches, fessiers, adducteurs, quadriceps, ischios, genoux, mollets, chevilles, pieds, poignets"],
 "alternatives": ["ids EXISTANTS du catalogue, du plus proche au plus éloigné (1 à 3)"],
 "tempoConseille": ["3", "0", "1", "0"],
 "progression": {"groupe": "nom-de-chaine", "niveau": 1, "nom": "Facile"},
 "dureeConseillee": 30,
 "repsConseillees": 10,
 "voirEnVrai": null,
 "valide": false,
 "priorite": 1,
 "prescription": "3×6-8/jambe, tempo 3-1-1-0, 2 min",
 "preuve": "B · [@blagrove2018]",
 "sports": ["xco", "route", "trail", "triathlon", "nordique"],
 "varianteDe": null
}
```
Précisions :
- `tempoConseille` : `[excentrique, pause basse, concentrique, pause haute]` en chaînes (`"X"` = explosif), ou `null` pour les mouvements cycliques, tenues, plio, étirements.
- `progression` : seulement si l'exercice appartient à une chaîne de niveaux (1 Facile, 2 Moyen, 3 Difficile, 4 Hardcore) ; sinon ne mets pas le champ.
- `dureeConseillee` (secondes) pour les tenues, étirements, mobilité tenue ; `repsConseillees` pour la mobilité dynamique. Sinon ne mets pas ces champs.
- `anim` + `opts` : **réutilise une animation existante quand le mouvement est vraiment proche**, avec des options déjà vues dans l'index (ex. `{"load":"bar"}`, `{"hold":"backBar"}`). N'invente pas d'option. Si le mouvement n'est pas proche, `anim: null` + `animAFaire`. Mieux vaut un `animAFaire` honnête qu'une animation fausse.
- `voirEnVrai` : un lien vidéo **que tu as ouvert** (WebFetch) et qui montre bien l'exercice (chaîne ou site officiel d'un préparateur, fédération, fitnessprogramer.com/exercise/<slug>/). Sinon `null`. Ne mets jamais un lien non ouvert. Ne passe pas plus de 2 essais par exercice à chercher un lien : `null` est acceptable.
- `priorite` : 1 = comble un trou important de la carte de couverture et utile à la majorité des athlètes ; 2 = utile ; 3 = variante ou cas particulier.
- `preuve` : lettre A/B/C/D + clé(s) de `recherche/sources.json` entre crochets avec arobase, ex. `B · [@ronnestad2014]`. A/B/C exigent une clé existante. `D` (avis d'expert / pratique de terrain) peut être sans clé : écris alors `D · pratique de terrain`. Sois honnête : la plupart des exercices précis sont C ou D ; la preuve porte souvent sur la méthode (force lourde, plio, excentrique), pas sur l'exercice.
- `sports` : ceux pour lesquels l'exercice est pertinent.
- `varianteDe` : id EXISTANT dont c'est une variante, sinon `null`.
- Matériel absent de la liste (medecine-ball, trap bar, landmine, TRX…) : choisis la valeur la plus proche (`sac-leste` pour un medecine-ball, `barre` pour trap bar et landmine, `sangle` pour TRX) et précise le vrai matériel dans le `nom`.
- Respiration guidée : famille `cardio`, type `hold` ou `cardio`, tags `retour-au-calme` et `recuperation`, `animAFaire` décrivant la posture.

## Qualité
- Chaque exercice doit être **réellement utile** à un athlète d'endurance et **distinct** de l'existant et des autres fiches de ton lot. Pas de remplissage.
- Pas de promesse médicale (« prévient la blessure », « soigne ») : écris « renforce », « rend plus solide », « prépare ».
- Vérifie ton fichier avec : `python3 recherche/_outils/verifie_fiches.py recherche/exercices/<nom>.json` (depuis la racine). **Il doit afficher OK.** Écris le fichier par lots de 10-15 fiches et relance le contrôle à chaque fois.

## Message final
≤ 150 mots : nombre de fiches, répartition des priorités, combien d'animations réutilisées / à créer, combien de liens vidéo vérifiés, ce que tu as volontairement écarté.
