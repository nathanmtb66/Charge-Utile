# 06 — Modèle économique : combien ça coûte, combien ça peut rapporter

*Écrit le 1er octobre 2026. Les chiffres sont produits par `_outils/modele_eco.py` (hypothèses en tête du fichier, à modifier et relancer). Prix et taux vérifiés le 30/09 et le 01/10/2026 ; **tout le reste est une hypothèse**, signalée comme telle.*

## En 1 minute

- **Le coût technique est quasi nul.** Une séance dictée coûte **3 à 6 centimes** d'API Claude ; un athlète coûte **moins de 0,60 €/mois** ; l'hébergement Cloudflare coûte 5 $/mois pour des milliers d'utilisateurs. **Le vrai coût, c'est le temps de Nathan** : développement, support, sécurité, contenu.
- **Aucun modèle « logiciel » ne fait vivre Nathan en 36 mois dans le scénario réaliste** : SaaS coach environ 7 000 €/an de chiffre d'affaires, freemium environ 7 000 €/an, licences environ 1 800 €/an.
- **Le service « préparation physique par Nathan + appli » (M5) est le seul modèle rentable dès la première année** : environ 4 700 €/an de chiffre d'affaires dans le scénario réaliste à 12 mois (8 athlètes à 49 €), avec environ 35 € de marge nette par athlète et par mois, sans attendre un produit SaaS.
- **Recommandation : M6 mixte = M5 tout de suite + M1 en pilote gratuit, puis payant si les critères de `05` sont atteints.** Ne pas faire M2 (grand public) ni M4 (marketplace) avant d'avoir une audience.
- **Incertitude : très forte.** Les nombres de clients sont des hypothèses, pas des prévisions. Elles servent à comparer les modèles entre eux, pas à prédire un revenu.

## 1. Coûts unitaires réels

### API Claude (dictée → séance)
- Tarifs Sonnet 5.5 : 2 $ par million de tokens en entrée, 10 $ en sortie ; cache en lecture à 0,20 $, en écriture à 2,50 $ [@anthropic-prix-2026].
- **Taille mesurée** dans le dépôt : une séance fait environ 2 700 caractères de JSON, soit environ 1 100 tokens de sortie.
- **Contexte à envoyer** : environ 10 000 tokens (format `SCHEMA.md`, index du catalogue, profil de l'athlète, dictée, consignes), dont environ 7 500 réutilisables en cache.
- **Hypothèse** : 2 tours par séance (écriture, puis correction après la vérification automatique).
- **Coût API par séance dictée** : Sonnet 5.5 0,030 € (cache chaud) / 0,060 € (cache froid) ; Haiku 4.5 0,015 € ; Opus 5.5 0,058 €.
- Coût API par athlète et par mois (9 séances, pire cas cache froid) : 0,54 €.
- **Conclusion** : pour un service à 49 €/mois, l'API pèse environ 1 %. Pour un SaaS facturé 2 € par athlète, elle pèse **environ 25 %** au pire cas. Il faut donc garder le cache chaud, utiliser Haiku pour les corrections, et laisser le coach **réutiliser des séances modèles** sans repasser par l'IA.
- La dictée vocale passe par le clavier du téléphone (gratuit) : aucun coût de transcription.

### Hébergement et outils
| Poste | Coût | Source |
|---|---|---|
| Cloudflare Workers (relais, comptes) | gratuit jusqu'à 100 000 requêtes/jour ; 5 $/mois en offre payante | [@cloudflare-workers-prix] |
| Base de données D1 | gratuit jusqu'à 5 Go | [@cloudflare-workers-prix] |
| Vidéos des séries (R2) | 10 Go gratuits, puis 0,015 $/Go-mois, sortie gratuite. Une vidéo de 30 s ≈ 20-40 Mo : effacer après 30 jours suffit à rester gratuit | [@cloudflare-r2-prix] |
| Site (Cloudflare Pages) | gratuit (500 builds/mois) | [@cloudflare-pages-limites] |
| GitHub Pages | **interdit pour un SaaS commercial** : à quitter avant de vendre | [@github-pages-limites] |
| Paiement Stripe | 1,5 % + 0,25 € par paiement par carte européenne standard ; Billing (abonnements) 0,7 % de plus | [@stripe-prix-fr] |
| App Store (si appli native un jour) | 99 $/an | [@apple-developer-programme] |
| Assurance RC pro coach | dès 11 €/mois (prix d'appel), et RC éditeur dès 20 €/mois ; budget réaliste 150-500 €/an pour les deux | voir `07` |
| Médiateur de la consommation (obligatoire en vente aux particuliers) | quelques dizaines d'euros par an (non vérifié) | voir `07` |
| Juriste (relecture des CGU/CGV) | 500-1 500 € une fois (**hypothèse**, non vérifié) | voir `07` |

**Coûts fixes en mode vente** : environ 30 à 60 €/mois (Cloudflare, assurances, médiateur, domaine), plus 500 à 1 500 € de juriste au départ.

### Support
**Hypothèse** : 15 min par coach client et par mois, 10 min par athlète en service direct. À 25 €/h de valeur du temps de Nathan, cela fait environ 6 € par coach et par mois, à retirer des marges ci-dessous si l'on veut payer son temps.

### Fiscalité (micro-entreprise 2026, détail dans `07`)
- Plafond de chiffre d'affaires : **83 600 €** (services).
- **Pas de TVA sous 37 500 €** : la réforme qui abaissait ce seuil à 25 000 € a été abandonnée.
- Cotisations : **21,2 %** en BIC (abonnement logiciel, cas probable) ou **25,6 %** en BNC (coaching personnalisé), plus 1,7 % ou 2,2 % avec le versement libératoire de l'impôt.
- **ACRE** : probablement réduite à 25 % d'exonération pour les créations depuis le 01/07/2026 (à vérifier sur urssaf.fr).
- **Ventes à des particuliers ailleurs dans l'UE** : au-delà de 10 000 €/an, TVA du pays du client (guichet OSS), ou passer par un « merchant of record » (Paddle ou équivalent) qui s'en charge.

## 2. Marge par client, modèle par modèle

| Modèle | Prix unitaire (€/mois) | Cotisations | Stripe | Coûts variables | **Marge nette avant temps de Nathan** |
|---|---|---|---|---|---|
| M1 SaaS coach — coach de 12 athlètes à 2 €/athlète | 24,00 | 5,09 | 0,61 | 6,67 | **11,63** |
| M2 Freemium athlète — premium 3,99 € | 3,99 | 0,85 | 0,31 | 0,18 | **2,65** |
| M3 Licence structure — 600 €/an (30 athlètes), par mois | 50,00 | 10,60 | 1,00 | 8,28 | **30,12** |
| M4 Marketplace — programme 39 € vendu (commission 25 %) | 9,75 | 2,07 | 0,40 | 0,10 | **7,19** |
| M5 Service Nathan — prépa physique individuelle 49 € | 49,00 | 12,54 | 0,98 | 0,75 | **34,72** |
| M5 Service Nathan — groupe club 8 athlètes × 25 € | 200,00 | 51,20 | 3,25 | 4,52 | **141,03** |

*Marge nette = prix − cotisations − Stripe − API − part d'hébergement. **Le temps de Nathan n'est pas compté.***

## 3. Les cinq modèles comparés (+ le mixte)

### M1 — SaaS coach, prix par athlète
- **Prix recommandé : 3 athlètes gratuits, puis 2 € par athlète actif et par mois** (minimum 9 €/mois).
- **Justification par les prix concurrents** :
  - Nolio : 19,90-39,90 €/mois, puis 1 à 1,50 € par athlète au-delà du quota [@nolio-prix] ;
  - TrainHeroic : 17,99 $ pour 5 athlètes, soit environ 3,6 $ par athlète [@trainheroic-prix] ;
  - Hevy Coach : 25 $/mois [@hevycoach-prix] ;
  - TrainingPeaks : 9 à 4,50 $ par athlète Premium payé par le coach [@trainingpeaks-prix-coach].

  Un module **en plus** de la plateforme d'endurance doit coûter **moins** que la plateforme : 2 € par athlète, c'est 24 €/mois pour 12 athlètes.
- **Coûts** : l'API est le premier coût variable (voir plus haut). Il faut aussi des comptes, OAuth intervals, le paiement, des CGV et du support.
- **Point mort** (coûts fixes de 30 à 60 €/mois) : **3 à 5 coachs** payants, sans compter le temps de Nathan. Pour **rembourser 6 à 12 mois de développement**, il en faudrait des centaines. Ce n'est pas réaliste en France seule (`02`).
- **Acquisition (CAC, hypothèses)** :
  - forum intervals.icu et annuaire d'applis : gratuit, quelques dizaines d'essais attendus ;
  - bouche-à-oreille via les coachs des athlètes de Nathan : gratuit ;
  - publicité ciblée « coach trail / vélo » : 50 à 200 € par coach payant (**hypothèse**, aucune donnée sectorielle fiable trouvée).
- **Durée de vie et LTV (hypothèses)** : un coach qui adopte un outil le garde longtemps (2 à 3 ans, perte de 3 à 5 % par mois). Avec environ 11,60 € de marge par mois, cela fait **environ 230 à 390 €** par coach.

### M2 — Freemium athlète
- **Prix** : gratuit (séances du coach, récup) ; premium **3,99 €/mois** ou 29 €/an pour des programmes de force automatiques adaptés à l'endurance, les tests et l'historique.
- **Justification** : 10W2S coûte 6,99 $/mois, RideStrong 20 $/mois, Dialed Health 30 $/mois. Les athlètes refusent un deuxième abonnement cher (`04`).
- **Conversion de référence** : passage au payant à J35 **2,1 % en médiane** en freemium (toutes catégories) ; **environ 28 %** des abonnés annuels renouvellent après la première année ; 0,38 $ de revenu par installation à J60 [@revenuecat-2026].
- **Lecture** : il faut **4 000 à 5 000 installations pour 100 abonnés**. Sans budget marketing ni appli native, c'est hors de portée. **CAC** : publicité payante probablement supérieure à la LTV (2,65 € de marge par mois × quelques mois). **À ne pas faire.**

### M3 — Licence club / CREPS / pôle / fédération
- **Prix** : 600 €/an par structure jusqu'à 30 athlètes ; 1 200-1 500 €/an au-delà.
- **Justification** : AthleteMonitoring coûte 4 à 126 € par athlète et par an ; MyCoach Pro 20 à 50 € HT par mois et par membre du staff (`01`). 600 €/an, c'est environ 20 € par athlète et par an, au bas de la fourchette.
- **Réalité** :
  - cycle de vente long : budgets votés une fois par an, décision du directeur ou du responsable de la préparation physique ;
  - exigences de conformité : données de santé de mineurs, peut-être hébergement HDS (voir `07`) ;
  - les athlètes listés utilisent peut-être déjà Athlète 360 (INSEP).
- **Point fort** : un pôle signé est une **référence** qui vaut plus que son prix.
- **Projection** : 0 à 2 structures en 12 mois.

### M4 — Marketplace de programmes créés par des coachs
- **Prix** : programmes de 8 à 12 semaines à 29-49 € ; commission de 25 % (Nolio prend 25 à 33 % sur sa marketplace, `02`).
- **Réalité** : il faut une audience d'athlètes qui achètent (comme en P3) **et** des coachs qui produisent. C'est un modèle de plateforme, qui demande deux faces et beaucoup de volume. **Pas avant 2 000 utilisateurs actifs.** En revanche, **Nathan peut vendre ses propres programmes** (100 % pour lui, moins les frais) : c'est une variante de M5.

### M5 — Service « coach + appli » vendu par Nathan
- **Prix** :
  - **49 €/mois** de préparation physique individuelle à distance : programme personnalisé, ajusté chaque mois, appli, vue par le coach d'endurance de l'athlète ;
  - **25 €/mois par athlète en groupe** de club (minimum 8 athlètes) ;
  - **60 €** le bilan de tests (au CREPS ou en club).
- **Justification** :
  - la préparation physique vendue seule à distance coûte 55-70 €/mois en France (Réathlétik 55-70 € ; Trails in France 60 €/mois en option) [@reathletik-prix] [@trailsinfrance-coaching] ;
  - un coaching d'endurance complet coûte 80-130 €/mois (`02`).

  49 € place Nathan sous le marché, au tarif d'un jeune diplômé.
- **Coûts** :
  - API inférieure à 1 € par athlète ;
  - cotisations BNC 25,6 % ;
  - **temps** : environ 45-60 min par athlète et par mois (dictée, ajustement, réponses) ;
  - **carte professionnelle et RC pro obligatoires** (`07`).
- **Marge** : environ 35 € par athlète et par mois, soit environ 35-45 €/h de temps de Nathan. C'est très correct pour un étudiant.
- **Acquisition** : réseau Font-Romeu et CREPS, contenu Instagram (`08`), coachs d'endurance qui n'ont pas de préparateur. **CAC proche de zéro en argent**, coûteux en temps.
- **Durée de vie (hypothèse)** : une saison, soit environ 8-12 mois, avec une perte d'environ 8 %/mois. Cela fait une LTV d'environ 300 à 420 € par athlète.

### M6 — Mixte (recommandé)
1. **M5 tout de suite**, comme source de revenu et laboratoire.
2. **M1 en pilote gratuit** pour 3 à 5 coachs d'endurance (dont ceux des athlètes de M5). On mesure l'usage autonome.
3. **M1 devient payant** seulement si les critères de `05` sont atteints : au moins 5 coachs actifs chaque semaine pendant 8 semaines, au moins 3 prêts à payer 10 € et plus, OAuth réglé.
4. **M3** de façon opportuniste : un pôle ou un club qui le demande. Ne pas chasser les appels d'offres.

## 4. Projections à 12 et 36 mois

Nombre de clients payants **atteint** au mois 12 et au mois 36. Le CA est exprimé en **rythme annuel** à ce moment-là, pas en cumul. Les nombres de clients sont des **hypothèses** de ma part, choisies pour être plausibles pour un étudiant seul sans budget marketing.

| Modèle | Pessimiste M12 | Réaliste M12 | Optimiste M12 | Pessimiste M36 | Réaliste M36 | Optimiste M36 |
|---|---|---|---|---|---|---|
| M1 SaaS coach (coachs payants, 12 ath. moyens) | 1 → CA 288 €/an  marge 140 € | 4 → CA 1 152 €/an  marge 558 € | 10 → CA 2 880 €/an  marge 1 396 € | 5 → CA 1 440 €/an  marge 698 € | 25 → CA 7 200 €/an  marge 3 490 € | 80 → CA 23 040 €/an  marge 11 167 € |
| M2 Freemium athlète (abonnés premium) | 5 → CA 239 €/an  marge 159 € | 25 → CA 1 197 €/an  marge 796 € | 80 → CA 3 830 €/an  marge 2 547 € | 20 → CA 958 €/an  marge 637 € | 150 → CA 7 182 €/an  marge 4 775 € | 600 → CA 28 728 €/an  marge 19 101 € |
| M3 Licence structure (structures) | 0 → CA 0 €/an  marge 0 € | 1 → CA 600 €/an  marge 361 € | 2 → CA 1 200 €/an  marge 723 € | 1 → CA 600 €/an  marge 361 € | 3 → CA 1 800 €/an  marge 1 084 € | 8 → CA 4 800 €/an  marge 2 891 € |
| M4 Marketplace (programmes vendus / mois) | 1 → CA 117 €/an  marge 86 € | 3 → CA 351 €/an  marge 259 € | 8 → CA 936 €/an  marge 690 € | 3 → CA 351 €/an  marge 259 € | 10 → CA 1 170 €/an  marge 862 € | 30 → CA 3 510 €/an  marge 2 587 € |
| M5 Service Nathan (athlètes payants) | 3 → CA 1 764 €/an  marge 1 250 € | 8 → CA 4 704 €/an  marge 3 333 € | 15 → CA 8 820 €/an  marge 6 249 € | 5 → CA 2 940 €/an  marge 2 083 € | 20 → CA 11 760 €/an  marge 8 332 € | 40 → CA 23 520 €/an  marge 16 665 € |


**À quel point c'est incertain ?** Énormément.
- **Aucun** client n'a encore payé.
- La douleur « coach » n'est pas prouvée (`04`).
- Les scénarios optimistes de M1 et M2 à 36 mois supposent une diffusion internationale et une appli plus mûre, sans aucune preuve aujourd'hui.
- **Seul M5 repose sur un prix de marché observé** et sur un nombre de clients à la portée du réseau de Nathan.
- Les 20 entretiens et les tests de prix de `08` et `produit/experiences.md` doivent remplacer ces hypothèses avant toute décision d'investir du temps de développement.

**M6 combiné, scénario réaliste** :
- à 12 mois : M5 avec 8 athlètes + M1 en pilote gratuit, soit environ 4 700 €/an de CA et environ 3 300 € de marge ;
- à 36 mois : M5 avec 20 athlètes + M1 avec 25 coachs + 3 structures, soit environ 20 000 €/an de CA.

C'est un **complément de revenu étudiant solide, pas une startup**. Pour aller au-delà, il faudrait une équipe, l'international et probablement l'App Store. C'est une décision à prendre en 2028, données en main.

## 5. Seuils et obligations à surveiller

| Seuil | Valeur 2026 | Conséquence |
|---|---|---|
| Franchise de TVA (services) | 37 500 € (tolérance 41 250 €) | Au-delà : facturer la TVA à 20 %. Dans le scénario réaliste à 36 mois (environ 20 000 €), on reste dessous |
| Plafond micro-entreprise (services) | 83 600 € | Hors de portée des scénarios |
| Ventes à des particuliers dans les autres pays de l'UE | 10 000 €/an | TVA du pays du client (OSS) ou merchant of record |
| Carte professionnelle | dès le premier euro de coaching | Obligatoire pour M5 |
| Rattachement au foyer fiscal des parents ou bourse | dès le premier euro | Le revenu de la micro-entreprise compte pour la bourse et l'impôt des parents : en parler au CROUS |

## Sources

[@anthropic-prix-2026] [@cloudflare-workers-prix] [@cloudflare-r2-prix] [@cloudflare-pages-limites] [@github-pages-limites] [@stripe-prix-fr] [@apple-developer-programme] [@revenuecat-2026] [@nolio-prix] [@trainheroic-prix] [@hevycoach-prix] [@trainingpeaks-prix-coach] [@reathletik-prix] [@trailsinfrance-coaching]. Fiscalité et assurances : sources officielles dans `07-juridique-technique.md`.
