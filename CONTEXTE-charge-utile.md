# Charge Utile — contexte du projet

Document de reprise : à lire au début d'une conversation qui touche à l'appli.
Dernière mise à jour : 23 septembre 2026 (batterie de tests + fiche athlète).

## Ce que c'est

Web-app de musculation pour les 4 athlètes d'endurance que Nathan entraîne (bénévolement).
Nathan dicte une séance à Claude, Claude l'écrit et la publie, l'athlète la suit sur son téléphone, **hors-ligne**, guidé par un mannequin 3D, des bips de tempo et une question de ressenti après chaque série.

- **Site** : https://nathanmtb66.github.io/Charge-Utile/
- **Dépôt** : `nathanmtb66/Charge-Utile` — GitHub Pages, branche `main`, dossier `/docs`
- **Athlètes** : Simon `kjvtsl` (trail court ; focus genoux + chevilles) · Antonin `2qzstf` (VTT XCO + route) · Malone `4h6w4q` (VTT XCO ; focus épaules) · Amael `fmlmvk` (VTT XCO ; focus épaules + quadriceps) · `demo` pour tester
- **Lien athlète** : `…/Charge-Utile/?a=<code>`

## Où est le code

Dépôt cloné par GitHub Desktop sur le Mac de Nathan : **`Documents/GitHub/Charge-Utile`** (dossier relié, accessible avec `device_bash`).

```
coach.py                  outil coach : recherche d'exos, vérif, tests, fiche, charges en %
docs/                     le site publié
  index.html  catalogue.html  sw.js  manifest.webmanifest
  js/app.js               le lecteur de séance (séances, tests, fiche)
  js/engine.js            moteur 3D (squelette, IK, tempo) — ne jamais modifier à la légère
  moves/*.js              les animations, une famille par fichier (dont tests.js : positions des tests)
  data/exercises/*.json   les fiches sources (190 exercices)
  data/tests.json         la batterie de tests (protocoles, erreurs de mesure, repères, sources)
  data/sessions/<code>.json  les séances de chaque athlète
  data/SCHEMA.md          format exact des fiches, séances, tests et charges en %
prive/fiches/<code>.json  fiche maître de chaque athlète (résultats datés, profil) — jamais publiée (.gitignore)
tools/  build.py · build_catalog.py · anims.js · check_sessions.py · nouvel_athlete.py
qa/     flow.js · recup.js · offline.js · tests.js (batterie) · angles.js (preuve du calcul d'angle) · shots.js (rendus)
```

## Méthode de travail (et d'économie)

1. **Ne jamais lire `docs/data/exercises.json` en entier** : 190 fiches, très lourd. Passer par :
   ```
   python3 coach.py cherche squat barre    # trouve les ids
   python3 coach.py liste fente            # une famille
   python3 coach.py fiche squat-barre      # une fiche complète
   python3 coach.py verifie kjvtsl         # contrôle un fichier de séances
   python3 coach.py seances                # qui a quoi au programme
   ```
2. **Écrire une séance** ne demande ni rendu d'animation ni test Playwright. Ces étapes servent seulement quand on touche au code ou aux animations.
3. **Une conversation courte par sujet.** Le skill `charge-utile` contient la méthode complète.
4. Les tests lourds (`qa/flow.js`, etc.) tournent dans le conteneur cloud de Claude, pas sur le Mac.

## Publier

1. Écrire dans le dépôt (dossier relié), lancer `python3 tools/build.py` (change la version du service worker).
2. Montrer un récap court à Nathan. Après son ok : commit + push avec GitHub Desktop.
3. Contrôler le site en ligne (`fetch` de `data/tests.json`, du fichier de séance, de `js/app.js`). Le cache de GitHub Pages peut servir l'ancienne version quelques minutes.

Sur le téléphone, la nouvelle version arrive à la prochaine ouverture **avec du réseau**.

## Ce que l'appli fait aujourd'hui

- **Séance guidée** : mannequin 3D plein écran, compteur de reps, tempo affiché et sonore sur la même horloge que le mouvement, consigne de respiration, l'écran entier sert de bouton « fini ».
- **Ressenti après chaque série** (reps en réserve, secondes, phrases pour la plio, niveau pour la proprio) → ajustement automatique : charge, durée, récup, ou passage au niveau supérieur/inférieur.
- **Voir la séance en détail** avant de commencer : tous les blocs, exos, charges, tempos, récups, et un bouton pour l'envoyer en texte.
- **Réglages des sons** : trois interrupteurs séparés (rythme, décompte, signal de fin). Sur un exo au chrono : silence pendant l'effort, décompte sur les 5 dernières secondes.
- **Vidéo** d'une série demandée par Nathan, partagée par WhatsApp.
- **Fin de séance** : RPE de séance, conseils de récup chiffrés (boire, protéines, glucides, froid, sommeil) calculés sur le poids, la pesée après séance, le RPE et la journée du lendemain, avec les sources (littérature 2021-2026). Message récap envoyé à Nathan.
- **Récup & mobilité** : routine générée selon le temps, le sport du jour, les douleurs à éviter et le `focus` de l'athlète. Respiration guidée (cohérence cardiaque, soupir physiologique, carrée, expiration longue).
- **Installation** : écran plein écran au premier lancement, adapté iPhone/Android, plus un voyant « prête pour la salle » quand tout est enregistré hors-ligne.
- **Catalogue** : 190 exercices, 152 animations, dont proprio en 4 niveaux, chevilles trail, et 12 exercices d'épaule.
- **Tests en autonomie** (bloc `test`) : 14 tests, présentation animée, mesure guidée, résultat comparé au précédent, écart gauche/droite. Test A force (saut unipodal ou assis-debout, squat et soulevé de terre en max estimé), test B mobilité (genou au mur, Thomas, rotation de hanche, jambe tendue, épaules, squat bras levés filmé, équilibre yeux fermés, mollet, pont). Angles mesurés par le capteur du téléphone fixé sur le membre : vérification du capteur une fois par séance (téléphone debout = 90°, corrige un signe inversé), zéro automatique, angle = rotation depuis le zéro (indépendant du sens du téléphone sur le membre), valeur = moyenne de la fin d'une tenue stable, saisie à la main en secours. `node qa/angles.js` prouve le calcul (0,000° d'erreur sans bruit, sur 20 000 montages au hasard).
- **Ma fiche** : les résultats datés sur le téléphone ; ligne `FICHE …` dans le message à Nathan.
- **Charges en %** : `pct` + `base` dans une séance ; le téléphone recalcule si l'athlète a refait son test.

## Limites connues (à dire franchement)

- Animations faites à la main : justes mais pas parfaites ; bouton « Voir en vrai » (fitnessprogramer/YouTube) en filet de sécurité.
- Le poignet ne se plie pas : les doigts entrent un peu dans le sol sur les appuis mains à plat.
- Safari iOS n'est pas testable automatiquement (seul Chromium l'est).
- Une web-app ne s'installe pas toute seule : l'athlète doit l'ajouter à son écran d'accueil (iPhone : uniquement depuis Safari) et l'ouvrir une fois avec du réseau.
- Le site est public : jamais de nom de famille ni de détail médical dans les fichiers.
- Le squelette MakeHuman est sous licence AGPL (sans effet pour un usage perso, à refaire avant toute vente).
- Conseils de récup = repères généraux, pas un avis médical.

## À valider par Nathan

- Interprétations d'animations : routine vélo n°3 et n°10, étirements n°11, 12, 15 et 18 de la capture Nolio.

## Tests et fiche : la méthode

- Envoyer une séance de tests : `python3 coach.py batterie <code> A|B <date>` (adaptée au profil : `coach.py profil <code> sans_saut=1 sdt=trap sans_<test>=1`). Profils décidés : Simon sans saut (genou/cheville), Malone profil épaule (tests d'épaule faisables mais « Je ne peux pas » dispo), Amael suivi de l'écart des quadriceps.
- Ranger les résultats reçus : `python3 coach.py fiche-ajoute "<message collé>"`, puis `coach.py athlete <code>` (écarts à cibler).
- « squat 4×5 à 80 % » : `python3 coach.py charge <code> squat 80` → mettre les champs donnés dans l'item.
- Fréquence conseillée : test A toutes les 6 semaines (la force bouge vite), test B toutes les 8 à 12 semaines, jamais la veille d'une course.

## Prochain chantier

Premier passage réel des tests par les 4 athlètes (le capteur d'angle n'est testable automatiquement que sur Chromium : valider sur un iPhone).

## Comment Nathan veut travailler

Tutoiement, réponses courtes et denses, honnêteté radicale : dire ce qui ne marche pas, signaler les contradictions dans ses consignes, ne jamais enrober. Livrer fini et testé plutôt que proposer un plan. Ne pas ajouter de fonctionnalité gadget : l'appli doit rester simple.
