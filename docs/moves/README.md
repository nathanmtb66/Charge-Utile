# Écrire un mouvement pour le mannequin Charge Utile

Un fichier par famille : `docs/moves/<famille>.js`, chargé après `js/engine.js`.
**Ne jamais modifier `js/engine.js`.** Tout se déclare depuis le fichier de famille.

```js
(function(){
const {V, lerp, clamp, sm, bump, osc, foot, hand, D2R} = Rig.util;
const kf = Rig.kf;
Rig.define('rdl', (s, o, t) => ({ /* pose */ }), {
  family:'hinge',
  cycle: 3.0,                 // durée d'une rep de démo (s) quand la séance ne donne pas de tempo
  tempo: true,                // true si s = profondeur (0 = position haute, 1 = position basse) → pilotable par un tempo
  frame: {tx:0, ty:.8, tz:0, H:2.0, W:1.6, el:10, az:30}  // cadrage caméra (voir plus bas)
});
})();
```

## Repère et gabarit

- Mètres. **Y en haut, l'athlète regarde +X, sa gauche est +Z.** Le sol est en y = 0.
- Longueurs : cuisse 0,445 · jambe 0,456 · bras 0,263 · avant-bras 0,27 (+ 0,085 jusqu'au creux de la main).
  La jambe tendue hanche → cheville mesure au plus **0,90 m** (l'IK plafonne à 0,90).
- Debout, relâché : bassin `pc = [-0.01, 0.955]`, chevilles à **y = 0,075** (pied à plat), pieds écartés `z = ±0.14…0.16`.
- Épaules au repos à y ≈ 1,44, z = ±0,21. Hanches à z = ±0,113 du centre du bassin.
- Pied à plat : `toe` 0,20 devant la cheville, même hauteur − 0 (le pied est parallèle au sol quand `toe.y = ankle.y`).
  Pointe de pied au sol talon levé : `toe.y ≈ 0.02`, `ankle.y` plus haut (0,12 à 0,18), `toeFlex` 40 à 70.

## L'objet pose (retourné par la fonction)

| champ | rôle |
|---|---|
| `pc: [x, y, z?]` | centre du bassin (z facultatif, pour décaler le bassin sur le côté) |
| `tilt` | inclinaison du buste en degrés dans le plan sagittal : 0 = droit, + = penché en avant, 90 = buste horizontal face au sol, −90 = allongé sur le dos |
| `dev: {pel, lum, thlow, thup}` | écarts (°) par étage de colonne par rapport à `tilt` : dos rond = valeurs +, cambré = valeurs − |
| `dev.twist` | rotation du buste autour de la colonne (°), répartie lombaires 30 % → haut du dos 100 %. **+ = poitrine tournée vers sa droite** |
| `dev.bend` | inclinaison latérale du buste (°). **+ = penché vers sa gauche** (+Z) |
| `dev.pelTwist`, `dev.pelBend` | mêmes rotations appliquées au bassin seul (hanches comprises) |
| `yaw` | cap de tout le haut du corps et du bassin (°), les pieds restent où tu les mets. **+ = tourné vers sa droite** |
| `headTurn`, `headTilt` | tête tournée (+ = vers la droite) / penchée (+ = vers la gauche), en plus du regard |
| `gaze` | `[x, y]` point regardé, ou `'knees' | 'floorAhead' | 'down' | 'up' | 'ceiling'` ; `gazeK` 0…1 = force du suivi |
| `legs: {L, R}` | `{ankle:[x,y,z], toe:[x,y,z], pole:[x,y,z], toeFlex, sole?}` ; `pole` = direction vers laquelle pointe le genou (ex. `[1,0,±.3]` debout ; `[0,1,…]` genou vers le plafond quand on est sur le dos) |
| `arms` | `{mode:'…'}` (voir ci-dessous) ou `{mode:'custom', curl, hold?, L:{…}, R:{…}}` |
| `carry` | accessoires tenus : `[{type, at, axis, off, up}]` |
| `world` | décor : `{bench:{x0,x1,h,z,w}, mat:true|{x,z,rot}, box:{x,h,z,w,d}, box2, box3, ball:{x,y?,z,r,roll}, bosu:{x,z,r,tiltX,tiltZ}, bosu2, wall:{x,z}, cones:{at:[[x,z],…]}, step:{x,h,z,w,d}, pullbar:{x,y}, anchor:{x,z,h}, bike:{a}, strap:{x,y}, treadmill:{belt}, rower:{seat}, skierg:true}` |
| `focus` | muscles en orange : `quads, quadsL, hams, glutes, calves, abs, obliques, lowback, pecs, delts, arms, biceps, triceps, forearms, lats, upperback, adductors, shins, hipflex` |
| `root` | rotation de tout le corps (exercices couchés sur le côté) : `{axis:'x', fit:[jointA, jointB], range:[deg0, deg1], floor:{joint: y}}` — voir `sideplank` dans `core.js` ; ou `{m: THREE.Matrix4}` pour une matrice libre |
| `phase` | (facultatif) pour les mouvements cycliques : 0 descente · 2 montée · 3 fin de rep (déclenche le compteur) |

### Bras

Modes prêts : `goblet`, `bag`, `frontBar`, `backBar`, `none` (bras tendus devant), `sides` (haltères le long du corps),
`hips` (mains sur les hanches), `bar` / `hipdb` (charge sur les hanches), `floor` (mains au sol à côté, sur le dos),
`plank` (avant-bras au sol), `plankHands` (mains au sol sous les épaules).

Mode `custom` : pour chaque main `L`/`R` :
- `{hand:[dx,dy,dz], pole, rel:'sh'}` : main placée par rapport à l'épaule ;
- `{hand:[x,y,z], pole, rel:'world'}` : main posée à un point fixe du monde (appuis au sol, barre de traction, poignée) ;
- `{t:[haut, avant, z], pole, rel:'torso'}` : main dans le repère du buste (haut = le long du buste, avant = devant la poitrine).

`pole` = direction du coude. `curl` = fermeture des doigts : `grip` (tient un objet), `fist`, `loose`, `flat` (main à plat au sol).
Attention : en `rel:'world'`, la main est au creux de la paume — pour une main à plat au sol, mets y = 0,03.

### Accessoires tenus (`carry`)

`type` ∈ `db` (haltère), `kb` (kettlebell, anse en haut), `plate` (disque), `bar` (barre chargée), `emptybar`, `handle` (poignée), `ball` (médecine-ball).
`at` = `'gripMid'` (entre les deux mains), `'gripL'`, `'gripR'`, ou `[x,y,z]`.
`axis` = axe de la poignée : `'grip'` (de la main droite à la main gauche), `'forearmL'`, `'forearmR'`, `'z'`, ou `[x,y,z]`.
`up` = oriente le haut de l'objet (ex. kettlebell : `up:[0,-1,0]` si la cloche doit pendre sous la main → attention, la cloche du `kb` est déjà vers −Y local).
`off` = décalage `[x,y,z]`.

### Nouveaux accessoires de décor

```js
Rig.prop('trx', {
  make(c){ /* c.THREE, c.mk(geo, mat), c.mats.{steel,dark,mach,pad,box,…}, c.M(color,rough,metal), c.V */ return group; },
  update(obj, spec, c){ /* c.sk = squelette posé (c.sk.gripL, c.sk.kneeL…) */ }
});
```

## Animation

- `s ∈ [0,1]`. Deux familles :
  - **tempo** (`meta.tempo: true`) : `s = 0` position de départ (haute), `s = 1` position la plus basse / la plus étirée.
    Le lecteur envoie `s` en suivant le tempo de la séance (descente, pause, montée explosive…). Pose = fonction continue de `s`.
  - **cycle** : `s` va de 0 à 1 puis reboucle. La pose en `s = 0` et en `s = 1` doit être identique.
- `t` = temps en secondes (pour une respiration discrète, un léger balancement d'équilibre).
- `kf(frames, s)` : interpolation par clés `{u, clé:…}` à **vitesse continue sans dépassement** (cubique monotone).
  Si la première et la dernière clé sont identiques, la boucle est fluide. `hold:true` sur une clé = arrêt net à cette clé
  (appui au sol, réception). Toutes les clés doivent avoir les mêmes champs.
- `bump(u, c, w)` : cloche 0→1→0 centrée en `c`, demi-largeur `w`, cyclique. `osc(u)` : 0→1→0 sinusoïdal.
- Mouvements alternés (droite/gauche) : un cycle complet = les deux côtés, `phase: 3` à la fin de chaque côté si chaque côté compte comme une rep.

## Réalisme exigé

1. **Pieds** : jamais sous le sol, jamais en l'air sans raison ; un pied en appui ne glisse pas (mêmes coordonnées pendant tout l'appui).
2. **Genoux** dans l'axe des pieds (pole cohérent), jamais en hyperextension, jamais pliés à l'envers.
3. **Dos** : neutre sur les charnières (RDL, soulevé de terre, swing) → `tilt` fort mais `dev` proches de 0 ; pas de dos rond sauf si l'exercice le veut.
4. **Mains** : une main qui tient un objet est dessus (vérifie de près) ; une main en appui reste fixe.
5. **Amplitudes** réelles (ex. squat : cuisses sous l'horizontale ; fente : genou arrière à 3-5 cm du sol ; RDL : barre à mi-tibia, genoux légèrement fléchis).
6. **Équilibre** : le bassin reste au-dessus de la base d'appui (debout), sinon le mouvement paraît faux.
7. **Rythme** : phases d'un saut = flexion, impulsion rapide, vol, réception amortie. Pas de mouvement linéaire robotique.

## Cadrage caméra (`meta.frame`)

`tx, ty, tz` = point visé ; `H`, `W` = hauteur / largeur de scène à montrer (m) ; `el` = élévation (°, 9 par défaut) ;
`az` = angle de vue par défaut (0 = profil vu depuis +Z, c'est-à-dire la gauche de l'athlète ; 90 = de face ; 30-40 = trois-quarts).
Le mouvement entier (y compris le matériel) doit rester dans le cadre à toutes les phases.

## Vérifier

```bash
node qa/shots.js <familles,csv> qa/out/<nom> '[["rdl",0,{},30,0,.9,3.2,12,0,0,"haut"], ["rdl",1,{},30,0,.9,3.2,12,0,0,"bas"]]' 4
```
Chaque entrée : `[anim, s, opts, az, tx, ty, dist, el, tz, t, légende]`. Produit `qa/out/<nom>_grid.png` à lire avec l'outil Read.
Vérifie toujours **au moins 4 phases** et **2 angles** (profil `az:0` et face `az:90` ou trois-quarts) par mouvement.
