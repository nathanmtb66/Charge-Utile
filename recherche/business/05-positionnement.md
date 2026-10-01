# 05 — Positionnement : pourquoi Charge Utile, et pas une autre ?

*S'appuie sur `01-concurrence.md`, `02-marche.md`, `03-intervals-ecosysteme.md`, `04-douleurs.md`. Écrit le 1er octobre 2026.*

## La phrase

> **Charge Utile, c'est la préparation physique d'un athlète d'endurance, de la consigne du coach à la séance faite et comptée dans sa charge. Le coach la dicte en une minute, l'athlète la fait guidé et hors-ligne, l'appli ajuste chaque série, et le résultat arrive dans intervals.icu.**

Version courte pour un coach : « Ta muscu, enfin dans le même circuit que l'endurance. »

## La démonstration, point par point

| Promesse | Preuve que le besoin existe | Preuve que les autres ne le font pas | Solidité |
|---|---|---|---|
| **Ne pas casser l'endurance** : séance dosée (RIR, ajustement, placement) | Douleur n° 1 : 34 citations en thème principal sur la peur de la fatigue ou du poids, 19 sur « je ne sais pas quoi faire » (`04`) ; la science le permet : la force lourde améliore l'économie sans prise de masse notable [@ronnestad2014] [@blagrove2018] (détail en phase 2 A) | Les applis de force généralistes ignorent l'endurance ; les plateformes d'endurance prescrivent la force sans l'ajuster (`01`) | **Moyenne** : c'est du savoir, donc copiable, mais il faut une vraie expertise pour bien le faire |
| **Remontée dans la plateforme d'endurance** | 30 citations en thème principal sur « la muscu ne compte pas » (33 mentions), 15 sur la ressaisie (21 mentions) (`04`) ; une quinzaine de « +1 » pour un pont Hevy → intervals [@intervals-hevy-integration] | Aucun des 18 logiciels de force ne pousse vers intervals.icu ; TrainingPeaks Strength n'exporte rien et laisse le TSS à saisir à la main (`01`, `03`) | **Moyenne** : techniquement simple (quelques semaines) ; l'avantage tient à ce que personne ne l'a fait *avec* l'exécution guidée |
| **Exécution guidée, hors-ligne, sans compte** | Demandes de vidéos, liens YouTube collés dans les descriptions [@intervals-video-exercise] ; « ouvrir l'appli et s'entraîner, c'est tout » (`04`, Q47) | Bips de tempo vus nulle part ; aucun outil sans compte ; hors-ligne inégal (`01`) | **Moyenne-faible** : copiable, mais personne n'a intérêt à copier le « sans compte » |
| **Ajustement série par série dans un outil de coach** | Les coachs prescrivent un RPE mais ne peuvent pas l'appliquer en direct | Seules des applis pour athlète seul le font (Volt, JuggernautAI, Alpha Progression, Enode) ; aucun outil de coach (`01`) | **Moyenne** : algorithme simple, copiable en 3 mois |
| **Dictée → séance en une minute** | Le coach gagne du temps de rédaction | Banal en 2026 : Trainerize, Everfit, WHOOP, générateur TrainingPeaks, LLM + MCP (`01`) | **Faible** : ce n'est plus un différenciateur |
| **Proprio à niveaux, plio, tests au capteur, récup** | Coachs de juniors et de trail (genou, cheville) ; pas de douleur forte exprimée en ligne | Rien vu d'équivalent sans capteur à 200-2 300 € (`01`, groupe mesure) | **Moyenne** : rare, mais secondaire pour l'achat |
| **Nathan lui-même** | Confiance locale, crédibilité d'athlète, STAPS, réseau à Font-Romeu et au CREPS, contenu photo/vidéo | Non copiable | **Forte, mais locale et non transférable** |

## Les avantages, et s'ils sont copiables en 3 mois

| Avantage | Copiable en 3 mois par un concurrent outillé ? | Commentaire franc |
|---|---|---|
| IA : voix du coach → séance | **Oui, en jours** | Ne pas le vendre comme une innovation. C'est une commodité. |
| Lien direct avec la charge d'endurance (intervals) | **Oui, en semaines** | Garmin (TrainingPeaks + TrainHeroic) peut le faire en natif chez lui ; intervals.icu peut ajouter des champs. L'avance est réelle mais courte. |
| Appli pensée pour l'endurant | **Partiellement** (6-12 mois) | La bibliothèque spécifique, les règles et les séances modèles (phases 2 à 5) demandent de l'expertise. C'est le meilleur fossé **de contenu**. |
| Tests au capteur, hors-ligne, pas de compte | **Oui** pour le hors-ligne ; **non voulu** pour le sans compte ; **oui** pour le capteur | Le « sans compte » sera abandonné de toute façon pour une version vendue (OAuth, sauvegarde : `03`, `07`). |
| Animations 3D faites main | **Non** (190 animations), **mais personne n'en a besoin** | Les concurrents ont 1 000 à 3 000 **vraies vidéos**, souvent jugées plus claires. L'animation a deux vrais atouts : elle est légère et hors-ligne, et elle est synchronisée au tempo. Ce n'est pas un argument d'achat. |
| Prix (0 €) | **Oui** | Everfit est gratuit jusqu'à 5 clients, intervals.icu gratuit, Hevy gratuit pour l'athlète. Le prix ne protège pas. |
| Nathan (athlète, coach, STAPS, photographe-vidéaste, réseau CREPS) | **Non** | C'est le seul avantage vraiment défendable. Mais il ne passe pas à l'échelle et ne vaut qu'en France, dans l'endurance et en montagne. |

**Conclusion du tableau** : aucun avantage *technique* ne tient plus de quelques mois face à un acteur doté d'une équipe. Ce qui peut tenir, c'est **le contenu expert** (exercices, séances, règles adaptées à l'endurance), **la relation** (Nathan, Font-Romeu, une communauté de coachs francophones) et **l'exécution** (une petite chose très bien faite).

## Les faiblesses qui tuent

1. **Un seul développeur, étudiant, en saison de VTT.** Support, sécurité, disponibilité : un client payant attend tout cela. C'est le risque n° 1.
2. **Dépendance à Claude** pour écrire les séances. Coût, disponibilité, erreurs possibles. Il faut que le coach **valide avant publication** et qu'un éditeur manuel existe (`produit/mvp-vendable.md`).
3. **Dépendance à intervals.icu** : 3 personnes, conditions changeables avec 30 jours de préavis. Et le mode « clé du coach » **ne passe pas à l'échelle** : il faudra un OAuth athlète par athlète (`03`).
4. **GitHub Pages interdit un usage SaaS commercial** [@github-pages-limites]. Le site public actuel publie les séances en JSON lisible par tous. Pour vendre, il faut un hébergement et des accès protégés (Cloudflare Pages + Workers + D1), donc une partie de l'appli à reconstruire.
5. **Pas d'appli native** : sur iPhone, l'installation passe par Safari « Sur l'écran d'accueil », les notifications ne marchent qu'une fois l'appli installée, et Safari peut effacer le stockage. Détail dans `07-juridique-technique.md`.
6. **Animations faites main** et squelette MakeHuman sous **licence AGPL** : à refaire ou à isoler avant toute vente (`07`).
7. **190 exercices** contre 1 000 et plus chez les autres. La phase 3 vise 250 de plus, mais chaque animation coûte du temps.
8. **Pas de preuve d'usage** : aujourd'hui, 3 des 4 fichiers de séances d'athlètes réels sont vides dans le dépôt. Il faut **mesurer l'adhésion** des 7 athlètes avant de vendre quoi que ce soit (`08`, `produit/experiences.md`).
9. **La menace Garmin** (TrainingPeaks + TrainHeroic + montres) peut rendre le créneau « muscu + endurance » banal en 12 à 24 mois.

## Trois positionnements possibles

### P1 — « Le module force des coachs d'endurance » (logiciel pour coachs)
- **Pour qui** : coachs d'endurance indépendants et clubs, d'abord francophones, sur intervals.icu, puis Nolio et TrainingPeaks.
- **Promesse** : « tu dictes la muscu, ton athlète la fait guidée, tu la vois dans ta plateforme ».
- **Pour** : c'est là que la douleur outil est prouvée (ressaisie, charge non comptée) ; le coach paie déjà pour un logiciel (0-100 €/mois, `02`) ; le marché est international.
- **Contre** :
  - marché adressable petit en France (≈ 36 000 à 216 000 €/an en plafond, `02`) ;
  - la douleur « le coach ne sait pas si c'est fait » n'est **pas prouvée** (`04`) ;
  - Nolio et TrainingPeaks Strength sont déjà installés chez les coachs ;
  - Garmin arrive ;
  - il faut un vrai SaaS (comptes, OAuth, paiement, support) : 6 à 12 mois de travail pour un étudiant seul.

### P2 — « La préparation physique de Nathan, augmentée par l'appli » (service + outil)
- **Pour qui** : athlètes d'endurance (VTT, trail, route, triathlon, nordique) et leurs coachs d'endurance qui **n'ont pas de préparateur physique**, d'abord à Font-Romeu et en Occitanie, puis à distance.
- **Promesse** : « ton plan de force et de prévention fait par un préparateur STAPS, qui tient compte de ton endurance, guidé dans l'appli et visible par ton coach ».
- **Pour** :
  - se vend **tout de suite**, sans produit SaaS : la préparation physique à distance se paie **55-70 €/mois** en France (`02`) ;
  - s'appuie sur le seul avantage non copiable (Nathan, son réseau, son contenu vidéo) ;
  - teste la valeur réelle de l'appli avec de vrais clients ;
  - le statut micro-entreprise suffit ; coût marginal faible.
- **Contre** :
  - ne passe pas à l'échelle (le temps de Nathan) ;
  - **carte professionnelle d'éducateur sportif obligatoire** pour encadrer contre rémunération (`02`, `07`) ;
  - en concurrence avec les coachs qui incluent déjà la préparation physique ;
  - responsabilité en cas de blessure (assurance responsabilité civile professionnelle).

### P3 — « L'appli de force pour cyclistes et traileurs » (grand public, l'athlète paie)
- **Pour qui** : athlètes d'endurance autonomes.
- **Promesse** : « des programmes de force qui s'adaptent à ta saison et à ta fatigue ».
- **Pour** : le plus grand nombre d'utilisateurs potentiels ; la douleur n° 1 (dosage) est grand public.
- **Contre** :
  - **marché saturé et en consolidation** : RideStrong (20 $/mois), Dialed Health (30 $/mois), 10W2S, StrengthApp, Runna (Strava), Garmin Connect+, WHOOP, Volt ;
  - les athlètes refusent un deuxième abonnement (`04`, T7) ;
  - les applis de fitness perdent la plupart de leurs utilisateurs en quelques semaines (phase 2 G) ;
  - il faut des programmes automatiques **sans coach**, soit le contraire de l'ADN actuel ;
  - il faut une appli native et du marketing payant.

### Comparaison

| Critère (note sur 5) | P1 Logiciel coachs | P2 Service Nathan + appli | P3 Grand public |
|---|---|---|---|
| Douleur prouvée | 3 | 4 | 4 |
| Concurrence | 2 | 4 | 1 |
| Avantage défendable | 2 | 5 | 1 |
| Revenu possible en 12 mois | 2 | 4 | 1 |
| Revenu possible en 36 mois | 4 | 3 | 3 |
| Compatible avec un étudiant seul | 2 | 4 | 1 |
| Risque juridique et technique | 2 | 3 | 2 |
| **Total** | **17** | **27** | **13** |

*Notes de ma part, à partir des données des fichiers 01 à 04. Elles servent à ordonner, pas à mesurer.*

## Recommandation

**P2 maintenant, P1 ensuite, seulement si les chiffres le justifient. Jamais P3.**

1. **Dès cet automne (P2)** :
   - vendre la **préparation physique pour athlètes d'endurance** (Nathan + appli), en individuel et en petit groupe de club ;
   - viser 5 à 15 athlètes payants à 40-60 €/mois en 12 mois ;
   - obtenir d'abord la **carte professionnelle** (à vérifier : la L3 STAPS Entraînement sportif y donne droit sous conditions, voir `07`) et une **assurance responsabilité civile professionnelle**.
2. **En même temps, préparer P1 à petit coût** :
   - donner l'appli **gratuitement** aux coachs d'endurance qui confient la préparation physique à Nathan, ou à 3-5 coachs pilotes ;
   - mesurer s'ils l'utilisent seuls ;
   - faire les 20 entretiens (`08`).
3. **Basculer vers P1 (logiciel payant) seulement si**, dans les 6 à 9 mois :
   - au moins 5 coachs non payés l'utilisent chaque semaine pendant 8 semaines ;
   - au moins 3 disent qu'ils paieraient 10 €/mois ou plus ;
   - l'OAuth athlète est réglé techniquement.

   Sinon, Charge Utile reste l'**outil de travail** de Nathan, ce qui a déjà de la valeur.

**Pourquoi pas P1 tout de suite** :
- la douleur coach n'est pas prouvée ;
- le marché France est petit ;
- il faut 6 à 12 mois de travail technique (comptes, OAuth, hébergement, paiement, données de santé) avant le premier euro ;
- Garmin peut fermer la fenêtre pendant ce temps.

**Pourquoi jamais P3** :
- tous les grands s'y sont déjà installés (Strava + Runna, Garmin, WHOOP) ;
- on ne gagne contre eux qu'avec de l'argent et du marketing ;
- ce serait le contraire de ce que Nathan sait faire (coacher).

## Ce qui serait révolutionnaire de façon crédible, et ce qui ne l'est pas

**Crédible, et rare en 2026** :
- **Fermer la boucle complète** : prescription par un humain → exécution guidée → ajustement série par série → retour dans la charge d'endurance → **séance suivante ajustée selon la charge d'endurance** (TSB, séance clé du lendemain, course A). Chaque morceau existe quelque part ; **personne ne les relie** pour l'athlète d'endurance. La science le permet (règles de la phase 5) sans promettre de miracle.
- **La muscu qui se place toute seule autour de l'endurance** : alerter le coach quand une séance de jambes lourde tombe moins de 6 à 24 h avant une séance clé, alléger la séance en semaine de course (règles de la phase 5).
- **Une base de connaissances graduée par niveau de preuve**, visible dans l'appli (« pourquoi cet exercice : preuve B »). Rare et crédible chez les coachs STAPS.

**Pas révolutionnaire (ne pas le vendre comme tel)** :
- « L'IA écrit tes séances » : banal en 2026.
- « Le TSS de la muscu » : aucun consensus scientifique sur un équivalent du TSS. Seule une **charge sRPE** honnête est défendable (phase 2 D).
- Le mannequin 3D : utile, pas décisif face à la vidéo.
- « Prévenir les blessures » : formulation interdite pour ne pas devenir un dispositif médical (`07`), et preuves souvent modestes (phase 2 B).
- L'analyse vidéo de la série par IA : peu fiable en 2026 pour juger la qualité d'un mouvement chargé (phase 2 H, `produit/idees-folles.md`).

## Sources

Les preuves chiffrées sont dans les fichiers 01 à 04 et leurs sources. Clés citées ici : [@ronnestad2014] [@blagrove2018] [@intervals-hevy-integration] [@intervals-video-exercise] [@github-pages-limites].
