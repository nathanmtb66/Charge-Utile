# Charge Utile — contexte du projet

Document de reprise : à lire au début d'une conversation qui touche à l'appli.
Dernière mise à jour : 23 septembre 2026.

## Ce que c'est

Web-app de musculation pour les 4 athlètes d'endurance que Nathan entraîne (bénévolement).
Nathan dicte une séance à Claude, Claude l'écrit et la publie, l'athlète la suit sur son téléphone, **hors-ligne**, guidé par un mannequin 3D, des bips de tempo et une question de ressenti après chaque série.

- **Site** : https://nathanmtb66.github.io/Charge-Utile/
- **Dépôt** : `nathanmtb66/Charge-Utile` — GitHub Pages, branche `main`, dossier `/docs`
- **Athlètes** : Simon `kjvtsl` (trail court ; focus genoux + chevilles) · Antonin `2qzstf` (VTT XCO + route) · Malone `4h6w4q` (VTT XCO ; focus épaules) · Amael `fmlmvk` (VTT XCO ; focus épaules + quadriceps) · `demo` pour tester
- **Lien athlète** : `…/Charge-Utile/?a=<code>`

## Où est le code

Dossier relié au Mac de Nathan : **`Téléchargements/charge-utile-site`** (accessible avec `device_bash`). Il contient tout le projet.

```
coach.py                  outil de recherche (voir plus bas)
docs/                     le site publié
  index.html  catalogue.html  sw.js  manifest.webmanifest
  js/app.js               le lecteur de séance (~2700 lignes)
  js/engine.js            moteur 3D (squelette, IK, tempo) — ne jamais modifier à la légère
  js/body.js              maillage du mannequin (généré depuis MakeHuman)
  moves/*.js              les animations, une famille par fichier (139 animations)
  moves/README.md         API des poses — à lire avant d'écrire une animation
  data/exercises/*.json   les fiches sources (190 exercices)
  data/exercises.json     catalogue fusionné (généré)
  data/sessions/<code>.json  les séances de chaque athlète
  data/SCHEMA.md          format exact des fiches et des séances
tools/  build.py · build_catalog.py · anims.js · check_sessions.py · nouvel_athlete.py
qa/     shots.js (rendus) · flow.js · recup.js · offline.js · bips.js · BRIEF-AGENT.md
```

Le projet complet existe aussi en zip dans les livrables des conversations précédentes.

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

Seul le contenu de `docs/` compte pour le site.

1. Mettre les fichiers à jour dans `charge-utile-site/docs` (via `device_bash` ou `device_commit_files`).
2. Ouvrir à Nathan `https://github.com/nathanmtb66/Charge-Utile/upload/main` (**racine** du dépôt, jamais `/upload/main/docs`, sinon ça crée un `docs/docs/`).
3. Il glisse le dossier `docs`. Vérifier ensuite que tous les chemins affichés commencent par `/docs/`, écrire le message de commit, cliquer **Commit changes**.
4. Contrôler le site en ligne depuis une page github.io (`fetch` du fichier de séance, du catalogue, de `app.js`). Le cache de GitHub Pages peut servir l'ancienne version pendant quelques minutes.

**Testé et sans issue, ne pas réessayer** : l'envoi de fichiers par l'extension Chrome (elle refuse les fichiers venant de la session) et la frappe dans l'éditeur de code GitHub (les touches n'atteignent pas l'éditeur).

Sur le téléphone, la nouvelle version arrive à la prochaine ouverture **avec du réseau** (le service worker change de version à chaque build).

## Ce que l'appli fait aujourd'hui

- **Séance guidée** : mannequin 3D plein écran, compteur de reps, tempo affiché et sonore sur la même horloge que le mouvement, consigne de respiration, l'écran entier sert de bouton « fini ».
- **Ressenti après chaque série** (reps en réserve, secondes, phrases pour la plio, niveau pour la proprio) → ajustement automatique : charge, durée, récup, ou passage au niveau supérieur/inférieur.
- **Voir la séance en détail** avant de commencer : tous les blocs, exos, charges, tempos, récups, et un bouton pour l'envoyer en texte.
- **Réglages des sons** : trois interrupteurs séparés (rythme, décompte, signal de fin). Sur un exo au chrono : silence pendant l'effort, décompte sur les 5 dernières secondes.
- **Vidéo** d'une série demandée par Nathan, partagée par WhatsApp.
- **Fin de séance** : RPE de séance, conseils de récup chiffrés (boire, protéines, glucides, froid, sommeil) calculés sur le poids, la pesée après séance, le RPE et la journée du lendemain, avec les sources (littérature 2021-2026). Message récap envoyé à Nathan.
- **Récup & mobilité** : routine générée selon le temps, le sport du jour, les douleurs à éviter et le `focus` de l'athlète. Respiration guidée (cohérence cardiaque, soupir physiologique, carrée, expiration longue).
- **Installation** : écran plein écran au premier lancement, adapté iPhone/Android, plus un voyant « prête pour la salle » quand tout est enregistré hors-ligne.
- **Catalogue** : 190 exercices, 139 animations, dont proprio en 4 niveaux, chevilles trail, et 12 exercices d'épaule.

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

## Prochain chantier

Batterie de **tests terrain réalisables sans Nathan** (1RM estimé, mobilité type FMS/GMS, souplesse, force, équilibre), puis une **fiche athlète** qui stocke les résultats datés, pour prescrire les séances en pourcentage de 1RM et cibler les points faibles. Recherche à faire sur les tests les plus fiables et les plus simples en autonomie.

## Comment Nathan veut travailler

Tutoiement, réponses courtes et denses, honnêteté radicale : dire ce qui ne marche pas, signaler les contradictions dans ses consignes, ne jamais enrober. Livrer fini et testé plutôt que proposer un plan. Ne pas ajouter de fonctionnalité gadget : l'appli doit rester simple.
