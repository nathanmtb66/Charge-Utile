# Charge Utile

L’appli de musculation des athlètes de Nathan (VTT, trail). Nathan parle à Claude, Claude écrit la séance, l’athlète l’ouvre sur son téléphone et se fait guider, même sans réseau en salle.

| Pour qui | Lien |
|---|---|
| Athlète | `https://<compte>.github.io/charge-utile/?a=<code>` (le code s’enregistre au premier lancement) |
| Nathan | `https://<compte>.github.io/charge-utile/catalogue.html` : la banque d’exercices animés |
| Démo | `https://<compte>.github.io/charge-utile/?a=demo` |

## Ce que fait l’appli (côté athlète)

1. **Mes séances** : les séances à venir, celles déjà faites, et « Reprendre » si la séance a été coupée.
2. **Présentation** : le message de Nathan et les blocs.
3. **Avant l’exercice** : mannequin animé, prescription (reps, charge, RPE visé), consignes, et trois boutons : **Voir en vrai** (fitnessprogramer, sinon YouTube), **Remplacer** (dernier recours), **Douleur**.
4. **Pendant la série** : mannequin en plein écran, compte à rebours de départ, **compteur de reps**, **tempo affiché et sonore** sur la même horloge que le mouvement (tic grave = descends, tic moyen = tiens, double note = monte), **consigne de respiration** adaptée (blocage sur charge lourde, souffle court en pliométrie…). Tout l’écran sert de bouton « fini ».
5. **Récup entre les séries** : chrono et **ressenti à chaque série** (reps en réserve, secondes, phrases pour la pliométrie, « trop facile / je perds l’équilibre » pour la proprio), puis ajustement automatique de la série suivante : charge, durée, +30 s de récup, ou **niveau** (facile → hardcore) pour les exercices de proprio.
6. **Vidéo** : la série demandée par Nathan se filme dans l’appli, puis « Envoyer la vidéo à Nathan » ouvre le partage du téléphone (WhatsApp).
7. **Fin** : RPE de séance, **conseils de récup** calculés sur le poids et le programme du lendemain (protéines, glucides, hydratation, froid, étirements, sommeil), message récapitulatif envoyé à Nathan (WhatsApp), rappel de mettre le RPE dans intervals.icu.
8. **Récup & mobilité** (accueil) : l’athlète choisit mobilité, étirements ou respiration, son temps (5 à 20 min), sa journée (vélo, trail, muscu, repos) et les zones douloureuses à éviter ; l’appli compose une routine guidée qui insiste sur les points faibles donnés par Nathan (`focus` dans son fichier). Respiration : cohérence cardiaque, soupir cyclique, respiration carrée, expiration longue.

## Organisation du dépôt

```
docs/                    ← le site publié par GitHub Pages
  index.html             ← généré (ne pas modifier : modifier index.template.html + body.fragment.html)
  catalogue.html         ← généré depuis catalogue.template.html
  sw.js                  ← généré (fonctionnement hors-ligne)
  js/engine.js           ← moteur d’animation du mannequin
  js/app.js              ← le lecteur de séance
  js/body.js             ← le mannequin (maillage MakeHuman CC0 stylisé)
  moves/*.js             ← les mouvements, par famille ; moves/index.json = liste chargée
  moves/README.md        ← comment écrire un mouvement
  data/exercises/*.json  ← les fiches exercices (source)
  data/exercises.json    ← généré : catalogue fusionné
  data/sessions/<code>.json ← les séances de chaque athlète
  data/SCHEMA.md         ← format des fiches et des séances
tools/
  build.py               ← valide tout et régénère (à lancer après chaque modification)
  check_sessions.py      ← vérifie les fichiers de séances
  nouvel_athlete.py      ← crée un code athlète
  liens_fitnessprogramer.json
qa/                      ← rendus de contrôle des mouvements et tests du parcours
```

## Commandes

```bash
python3 tools/build.py                       # à lancer avant chaque publication
python3 tools/nouvel_athlete.py "Léo"        # crée un code et affiche le lien
node qa/shots.js core,legs qa/out/test '[["lunge",1,{},0,0,.8,3.2]]'   # rendu de contrôle d’un mouvement
node qa/flow.js 0 ok                         # parcours complet d’une séance (serveur local sur :8765 requis)
node qa/offline.js                           # vérifie le hors-ligne
```

## Limites connues (honnêtes)

- Les mouvements sont **animés à la main**, pas capturés sur un humain. Ils sont vérifiés image par image, mais restent moins fins qu’une vraie vidéo. D’où le bouton « Voir en vrai ».
- Le poignet ne se plie pas : sur les appuis mains à plat, le bout des doigts passe un peu sous le sol.
- Les conseils de récup sont des repères généraux tirés de la littérature (ISSN 2017, Roberts 2015, Cochrane 2011), pas une prescription.
- iPhone : les bips suivent le mode silencieux (réglage « ambient » pour se mélanger à la musique). L’installation se fait par Safari (Partager → Sur l’écran d’accueil).
- Test automatique fait sur Chromium (Android émulé) ; Safari/iOS n’a pas pu être testé automatiquement dans l’environnement de Claude.
- Le squelette par défaut de MakeHuman est sous licence AGPL (le maillage et les cibles sont CC0) : sans effet pour un usage perso, à refaire avant toute vente.
