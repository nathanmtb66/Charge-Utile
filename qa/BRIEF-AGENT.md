# Brief commun — animateur·rice de mouvements Charge Utile

Tu travailles sur l'appli de musculation de Nathan (entraîneur bénévole de 4 athlètes d'endurance : VTT, trail).
L'athlète voit un **mannequin 3D épuré** (gris, sans visage, muscles travaillés en orange) qui montre l'exercice.
Priorité absolue de Nathan : **le mouvement doit être exact**, fidèle à ce qu'un préparateur physique montrerait. La beauté vient après.

## À lire d'abord
1. `/home/claude/muscu-app/v5/docs/moves/README.md` — API complète des poses (obligatoire).
2. `/home/claude/muscu-app/v5/docs/moves/core.js` — 15 mouvements existants qui marchent (exemples : `squat`, `split`, `thrust`, `boxjump`, `sideplank`, `crossbody`).
3. `/home/claude/muscu-app/v5/docs/js/engine.js` — le moteur (lecture seule, **ne le modifie jamais**). Nouveau : `dev.twist`, `dev.bend`, `yaw`, `headTurn` permettent enfin la rotation et l'inclinaison du buste (voir README).
5. D'autres familles déjà faites pour t'inspirer : `docs/moves/posterior.js` (aides shAt, ballFoot, mirror), `balance.js`, `trunk.js` (poses couchées, `root:{m}`), `upper.js`, `legs.js`.
4. `/home/claude/muscu-app/v5/docs/data/SCHEMA.md` — format des fiches exercices.

## Ce que tu livres
1. `docs/moves/<ta-famille>.js` : tes mouvements via `Rig.define(nom, fn, meta)` avec `meta.family`, `meta.cycle`, `meta.tempo` (si piloté par tempo), `meta.frame` (cadrage).
   Les accessoires manquants se créent dans ton fichier avec `Rig.prop(...)` (noms préfixés par ta famille pour éviter les collisions, ex. `lunge_xxx`).
2. `docs/data/exercises/<ta-famille>.json` : une fiche par exercice (schéma de `SCHEMA.md`), texte en français simple, tutoiement, 3 consignes courtes (≤ 45 caractères chacune), 2 erreurs fréquentes, `pourquoi` relié à l'endurance (VTT, trail) en une phrase, `voirEnVrai: null`, `valide: true`.
3. Une planche de contrôle finale `qa/out/<ta-famille>_final_grid.png` : chaque mouvement à 3 phases au moins.

## Méthode obligatoire
- Pour chaque mouvement : écris la pose → rends-la avec `node qa/shots.js core,legs,posterior,balance,trunk,upper,<ta-famille> qa/out/<nom> '<tableau>' 4` (depuis `/home/claude/muscu-app/v5`) → **regarde l'image avec Read** → corrige → recommence jusqu'à ce que ce soit juste.
  Vérifie au moins 4 phases (s = 0, .25, .5, .75, 1) et 2 angles (profil `az:0`, face `az:90` ou 3/4 `az:35`).
- Contrôle sur chaque image : pieds posés sur le sol (pas dedans, pas au-dessus), genoux dans l'axe, dos neutre quand il doit l'être, mains sur les objets tenus, rien qui traverse le décor, amplitude réaliste, équilibre crédible.
- Contrôle aussi le cadrage `meta.frame` : tout le mouvement doit rester visible à toutes les phases dans un cadre portrait (W/H ≈ 0,75) ; teste en simulant avec `dist` ≈ max(H, W/0.75)/2/tan(14°)*1.06.
- Les rendus prennent ~10 s pour 8 images : groupe tes vérifications.
- Astuce cadrage : passe `null` comme az et `"auto"` comme dist pour rendre avec le cadrage de `meta.frame`, exactement comme dans l'appli : `["anim",0.5,{},null,0,0,"auto",0,0,0,"légende"]`.
- Après tes fiches, lance `node tools/anims.js && python3 tools/build_catalog.py` depuis `/home/claude/muscu-app/v5` : les deux doivent passer sans erreur. Ajoute ta famille dans `docs/moves/index.json` si elle n'y est pas.
- Si un mouvement est impossible à rendre correctement avec l'API (ex. rotation du buste), choisis la variante la plus fidèle possible et **dis-le dans ton rapport** plutôt que de livrer un mouvement faux.
- Termine par `node -e "global.window={};"` inutile — à la place vérifie simplement que ton fichier se charge sans erreur (le script `qa/shots.js` affiche `ERRORS` sinon).

## Rapport final (ta réponse)
Court : liste des `anim` créés (avec opts), liste des ids de fiches, accessoires créés, limites honnêtes (ce qui n'est pas parfait), chemin de la planche finale.
