# 06 — Modèle économique : combien ça coûte, combien ça peut rapporter

*Écrit le 1er octobre 2026, corrigé le même jour après relecture contradictoire (`_brut/revue-business.md`). Les chiffres sont produits par `_outils/modele_eco.py` (hypothèses en tête du fichier, à modifier et relancer). Prix et taux vérifiés le 30/09 et le 01/10/2026 ; **tout le reste est une hypothèse**, signalée comme telle.*

## En 1 minute

- **Le coût technique est quasi nul.** Une séance dictée coûte **3 à 6 centimes** d'API Claude ; un athlète coûte **moins de 0,60 €/mois** ; l'hébergement Cloudflare coûte 5 $/mois pour des milliers d'utilisateurs. **Le vrai coût, c'est le temps de Nathan**, plus environ **420 €/an de coûts fixes** dès qu'on vend (assurance, médiateur, hébergement) et 500 à 1 500 € de juriste au départ.
- **Aucun modèle ne fait vivre Nathan en 36 mois.** Scénario réaliste à 36 mois : SaaS coach environ 5 800 €/an de chiffre d'affaires, freemium environ 7 200 €/an, licences environ 1 800 €/an, service de Nathan environ 7 000 €/an (plafonné par son temps).
- **Le service « préparation physique par Nathan + appli » (M5) a la meilleure marge par heure** (environ 35 € par athlète et par mois). **Mais il ne peut pas démarrer tout de suite** : encadrer des compétiteurs contre rémunération exige la carte professionnelle, donc la licence STAPS, attendue à l'été 2027 (`07`). **Les premiers euros de M5 sont à prévoir en été 2027, pas en novembre 2026.**
- **Recommandation : M6 mixte.** D'ici l'été 2027 : pilotes gratuits (coachs adultes), entretiens, préventes du logiciel. À partir de l'été 2027 : M5 payant, et M1 payant si les critères de `08` sont atteints. Ne pas faire M2 (grand public) ni M4 (marketplace) sans audience.
- **Incertitude : très forte.** Aucun client n'a payé. Les nombres de clients sont des hypothèses, pas des prévisions.

## 1. Coûts unitaires réels

### API Claude (dictée → séance)
- Tarifs Sonnet 5.5 : 2 $ par million de tokens en entrée, 10 $ en sortie ; cache en lecture à 0,20 $, en écriture à 2,50 $ [@anthropic-prix-2026].
- **Taille mesurée** dans le dépôt : une séance fait environ 2 700 caractères de JSON, soit environ 1 100 tokens de sortie.
- **Contexte à envoyer** : environ 10 000 tokens (format `SCHEMA.md`, index du catalogue, profil de l'athlète, dictée, consignes), dont environ 7 500 réutilisables en cache.
- **Hypothèse** : 2 tours par séance (écriture, puis correction après la vérification automatique).
- **Coût API par séance dictée : Sonnet 5.5 0,030 € (cache chaud) / 0,060 € (cache froid) ; Haiku 4.5 0,015 € ; Opus 5.5 0,058 €**.
- Coût API par athlète et par mois (9 séances, pire cas cache froid) : 0,54 €.
- **C'est un majorant.** Le calcul « cache froid » facture l'écriture du cache aux deux tours (en réalité, le 2e tour le lit : environ 0,048 € par séance isolée). Il suppose aussi **9 séances dictées par athlète et par mois, toutes par l'IA**. Un coach de 12 athlètes duplique la plupart de ses séances. **Il faut mesurer un vrai mois de Nathan** pour remplacer cette hypothèse.
- **Conclusion** : pour un service à 49 €/mois, l'API pèse environ 1 %. Pour un SaaS facturé 2 € par athlète, elle pèse **25 % au maximum**. Il faut garder le cache chaud, utiliser Haiku pour les corrections, et laisser le coach **réutiliser des séances modèles** sans repasser par l'IA.
- La dictée vocale passe par le clavier du téléphone (gratuit) : aucun coût de transcription.

### Hébergement et outils
| Poste | Coût | Source |
|---|---|---|
| Cloudflare Workers (relais, comptes) | gratuit jusqu'à 100 000 requêtes/jour ; 5 $/mois en offre payante | [@cloudflare-workers-prix] |
| Base de données D1 | gratuit jusqu'à 5 Go | [@cloudflare-workers-prix] |
| Vidéos des séries (R2) | 10 Go gratuits, puis 0,015 $/Go-mois, sortie gratuite. Une vidéo de 30 s ≈ 20-40 Mo : effacer après 30 jours suffit à rester gratuit | [@cloudflare-r2-prix] |
| Site (Cloudflare Pages) | gratuit (500 builds/mois) | [@cloudflare-pages-limites] |
| GitHub Pages | **interdit pour un SaaS commercial** : à quitter avant de vendre | [@github-pages-limites] |
| Paiement Stripe | 1,5 % + 0,25 € par paiement par carte européenne standard (Stripe Billing, pour les abonnements, n'est pas compté dans le modèle : environ 0,7 % de plus, à revérifier) | [@stripe-prix-fr] |
| App Store (si appli native un jour) | 99 $/an | [@apple-developer-programme] |
| Assurance RC pro coach | dès 11 €/mois (prix d'appel), et RC éditeur dès 20 €/mois ; budget réaliste 150-500 €/an pour les deux | voir `07` |
| Médiateur de la consommation (obligatoire en vente aux particuliers) | quelques dizaines d'euros par an (non vérifié) | voir `07` |
| Juriste (relecture des CGU/CGV) | 500-1 500 € une fois (**hypothèse**, non vérifié) | voir `07` |

**Coûts fixes en mode vente** : environ **420 €/an** (assurance au milieu de la fourchette, médiateur, domaine, Cloudflare), plus 500 à 1 500 € de juriste au départ. La CFE, la contribution à la formation professionnelle et l'impôt ne sont pas comptés.

**Conséquence** : dans le scénario pessimiste (peu de clients), **la première année de vente est déficitaire** une fois l'assurance et le juriste payés.

### Temps de Nathan (le vrai coût)
- **Service M5** : environ 55 min par athlète et par mois (dictée, ajustement, réponses), plus 10 min de support. Soit **65 min par athlète et par mois**.
- **SaaS M1** : 15 min de support par coach et par mois (hypothèse).
- **Plafond** : avec 5 h par semaine (environ 22 h par mois, `09`), **M5 seul plafonne à environ 20 athlètes, sans une heure de développement, de contenu ni d'entretiens**. Un budget réaliste (la moitié du temps pour le suivi) donne **10 à 12 athlètes**.

### Fiscalité : la micro-entreprise de Nathan existe déjà
Nathan a déjà une micro-entreprise de photo-vidéo. **Il ne s'agit donc pas de créer une entreprise, mais de déclarer une activité supplémentaire** (détail dans `07`).
- Plafond de chiffre d'affaires : **83 600 €** (services), **toutes activités confondues**.
- **Pas de TVA sous 37 500 €** de chiffre d'affaires **total**, photo-vidéo comprise. **Il faut connaître le chiffre d'affaires photo-vidéo de Nathan** pour savoir quelle marge il reste : ce chiffre n'est pas dans le dépôt.
- Cotisations : **21,2 %** en BIC (abonnement logiciel, cas probable) ou **25,6 %** en BNC (coaching personnalisé), plus 1,7 % ou 2,2 % avec le versement libératoire. La ventilation entre activités est à confirmer avec l'URSSAF.
- **ACRE** : elle ne se redemande pas pour une activité ajoutée à une entreprise existante (règle générale, non relue sur une page officielle). **À retirer du plan.**
- **Ventes à des particuliers ailleurs dans l'UE** : au-delà de 10 000 €/an, TVA du pays du client (guichet OSS), ou passer par un « merchant of record ».

## 2. Marge par client, modèle par modèle

| Modèle | Prix unitaire (€/mois) | Cotisations | Stripe | Coûts variables | **Marge nette avant temps de Nathan** |
|---|---|---|---|---|---|
| M1 SaaS coach — coach de 12 athlètes à 2 €/athlète | 24,00 | 5,09 | 0,61 | 6,67 | **11,63** |
| M2 Freemium athlète — premium 3,99 € | 3,99 | 0,85 | 0,31 | 0,18 | **2,65** |
| M3 Licence structure — 600 €/an (30 athlètes), par mois | 50,00 | 10,60 | 1,00 | 8,28 | **30,12** |
| M4 Marketplace — programme 39 € vendu (commission 25 %) | 9,75 | 2,07 | 0,40 | 0,10 | **7,19** |
| M5 Service Nathan — prépa physique individuelle 49 € | 49,00 | 12,54 | 0,98 | 0,75 | **34,72** |
| M5 Service Nathan — groupe club 8 athlètes × 25 € | 200,00 | 51,20 | 3,25 | 4,52 | **141,03** |

*Marge = prix − cotisations − Stripe − API − part d'hébergement. **Ni les coûts fixes annuels (environ 420 €), ni le temps de Nathan ne sont comptés ici.***

## 3. Les cinq modèles comparés (+ le mixte)

### M1 — SaaS coach, prix par athlète
- **Prix recommandé : 3 athlètes gratuits, puis 2 € par athlète actif et par mois** (minimum 9 €/mois).
- **Justification par les prix concurrents** :
  - Nolio : 19,90 € (3 athlètes), 29,90 € (25 athlètes), 39,90 € (30 athlètes, puis 1 à 1,50 € par athlète en plus sur cette offre) : environ **1,20 € par athlète** à 25 athlètes [@nolio-prix] ;
  - TrainHeroic : 17,99 $ pour 5 athlètes, soit environ 3,6 $ par athlète [@trainheroic-prix] ;
  - Hevy Coach : dès 25 $/mois [@hevycoach-prix] ;
  - TrainingPeaks : Coach Edition à 21,99 $/mois + 99 $ d'ouverture ; athlète Premium payé par le coach 9 $, puis 8,55 $ à partir de 10 athlètes (4,50 $ seulement au-delà de 1 000) [@trainingpeaks-prix-coach].
- **Repère de budget** : un coach français dépense 2 à 6 % de son chiffre d'affaires en logiciel, soit **environ 1 à 3 € par athlète pour tous ses outils** (`02`). Un module **en plus** de la plateforme d'endurance ne peut donc pas coûter plus de 2 € par athlète.
- **Coûts** : l'API est le premier coût variable. Il faut aussi des comptes, OAuth intervals, le paiement, des CGV et du support.
- **Point mort** : avec environ 11,60 € de marge par coach et par mois, il faut **3 à 4 coachs pour couvrir les coûts fixes annuels**, sans compter le temps de Nathan. Pour **rembourser 6 à 12 mois de développement**, il en faudrait des centaines. Ce n'est pas réaliste en France seule (`02`).
- **Acquisition (CAC, hypothèses)** : forum intervals.icu et annuaire d'applis (gratuit) ; bouche-à-oreille (gratuit) ; publicité ciblée : 50 à 200 € par coach payant (**hypothèse**, aucune donnée sectorielle fiable).
- **Durée de vie et LTV (hypothèses)** : perte de 3 à 5 % par mois, soit 20 à 33 mois ; avec 11,60 € de marge par mois, **environ 230 à 390 €** par coach.

### M2 — Freemium athlète
- **Prix** : gratuit (séances du coach, récup) ; premium **3,99 €/mois** ou 29 €/an (programmes de force automatiques adaptés à l'endurance, tests, historique).
- **Justification** : Kiprun Pacer est **gratuit** ; Trails in France vend un renforcement standard à **8 €/mois** ; 10W2S coûte 6,99 $/mois, RideStrong 20 $/mois, Dialed Health 30 $/mois. Les athlètes refusent un deuxième abonnement cher (`04`).
- **Conversion de référence** : passage au payant à J35 **2,1 % en médiane** en freemium (toutes catégories) ; 0,38 $ de revenu par installation à J60 [@revenuecat-2026].
- **Lecture** : il faut **4 000 à 5 000 installations pour 100 abonnés**. Sans budget marketing ni appli native, c'est hors de portée. **À ne pas faire.**

### M3 — Licence club / CREPS / pôle / fédération
- **Prix** : 600 €/an par structure jusqu'à 30 athlètes ; 1 200-1 500 €/an au-delà.
- **Justification** : AthleteMonitoring coûte 4 à 126 € par athlète et par an ; MyCoach Pro 20 à 50 € HT par mois et par membre du staff (`01`).
- **Réalité** : cycle de vente long ; budgets votés une fois par an ; données de santé de mineurs ; **c'est le cas où la question de l'hébergement de données de santé (HDS) peut se reposer**, si la structure a un service médical (`07`) ; les athlètes listés utilisent peut-être déjà Athlète 360.
- **Point fort** : un pôle signé est une **référence** qui vaut plus que son prix.
- **Projection** : 0 à 1 structure en 12 mois.

### M4 — Marketplace de programmes créés par des coachs
- **Prix** : programmes de 8 à 12 semaines à 29-49 € ; commission de 25 % (Nolio prend 25 à 33 %, `02`).
- **Réalité** : modèle de plateforme à deux faces, qui demande beaucoup de volume. **Pas avant 2 000 utilisateurs actifs.**
- **Variante utile dès maintenant** : Nathan peut vendre **ses propres programmes standards** (pas de l'encadrement personnalisé). Le marché montre un étage bas à **8 €/mois** pour du contenu standard. À faire valider : un programme standard vendu sans suivi relève-t-il de l'encadrement au sens de l'article L.212-1 (`07`) ?

### M5 — Service « coach + appli » vendu par Nathan
- **Quand** : **à partir de l'obtention de la carte professionnelle** permettant d'encadrer des compétiteurs (licence STAPS Entraînement sportif, été 2027 au plus tôt). Trois issues à faire trancher par le service départemental (SDJES) et le responsable de la licence :
  - (a) une carte au titre du DEUG : public **loisir uniquement**, compétition exclue ;
  - (b) une convention de stage dans le cadre de la L3 (les 200 h de stage) ;
  - (c) attendre le diplôme, et ne vendre d'ici là que ce qui n'est pas de l'encadrement (logiciel, contenu, photo-vidéo).
- **Prix à tester (pas acquis)** : **49 €/mois** de préparation physique individuelle à distance ; **25 €/mois par athlète en groupe** (minimum 8 athlètes) ; **60 €** le bilan de tests.
- **Ce que montre le marché : deux étages.**
  - **Étage bas, 8 €/mois** : contenu standard (renforcement général, formule trail standard) [@trailsinfrance-coaching].
  - **Étage haut, 55-80 €/mois** : préparation physique **personnalisée**, vendue par des professionnels installés (Trails in France 60 € ; Réathlétik, centre avec kinésithérapie, 55, 70 et 80 €) [@trailsinfrance-coaching] [@reathletik-prix].
  - **Un jeune diplômé sans notoriété n'est pas dans l'étage haut par défaut.** 49 € est une hypothèse haute. **Il faut tester 29, 39 et 49 €** (`08`). Les 7 athlètes actuels reçoivent ce service gratuitement : leur conversion en clients payants n'est pas acquise.
- **Pourquoi un coach d'endurance enverrait-il son athlète payer quelqu'un d'autre ?** C'est le point faible. Réponses possibles, à vérifier en entretien : il n'a pas la compétence ou le temps pour la force ; la séance arrive dans **son** calendrier intervals ; Nathan lui reverse une part, ou le coach revend le service dans son offre.
- **Coûts** : API inférieure à 1 € par athlète ; cotisations BNC 25,6 % ; **65 min par athlète et par mois** ; carte professionnelle ; RC pro **souscrite avant le premier paiement**.
- **Marge** : environ 35 € par athlète et par mois, soit environ 32 €/h de temps de Nathan, **avant coûts fixes**.
- **Acquisition** : réseau Font-Romeu, contenu Instagram (`08`), coachs sans préparateur. CAC proche de zéro en argent, coûteux en temps.
- **Durée de vie (hypothèse)** : perte de 8 %/mois, soit une LTV d'environ **430 €** par athlète (34,72 ÷ 0,08).

### M6 — Mixte (recommandé)
1. **D'ici l'été 2027** : pas de coaching payant de compétiteurs. Pilotes gratuits du logiciel avec des **adultes** (coachs, stagiaires DEJEPS, étudiants STAPS), entretiens, préventes du logiciel (M1).
2. **À partir de l'été 2027** : M5 payant, plafonné à 10-12 athlètes par le temps disponible.
3. **M1 devient payant** seulement si les critères de `08` sont atteints (paiements réels, pas déclarations) et si l'OAuth intervals est réglé.
4. **M3** de façon opportuniste.

## 4. Projections à 12 et 36 mois

Nombre de clients payants **atteint** au mois 12 (septembre 2027) et au mois 36. Le CA est exprimé en **rythme annuel** à ce moment-là, pas en cumul. La dernière valeur est le **temps de Nathan par mois**. Les nombres de clients sont des **hypothèses** de ma part.

| Modèle | Pessimiste M12 | Réaliste M12 | Optimiste M12 | Pessimiste M36 | Réaliste M36 | Optimiste M36 |
|---|---|---|---|---|---|---|
| M1 SaaS coach (coachs payants, 12 ath. moyens) | 0 → CA 0 €/an ; marge 0 € ; 0 h/mois | 1 → CA 288 €/an ; marge 140 € ; 0 h/mois | 3 → CA 864 €/an ; marge 419 € ; 1 h/mois | 5 → CA 1 440 €/an ; marge 698 € ; 1 h/mois | 20 → CA 5 760 €/an ; marge 2 792 € ; 5 h/mois | 60 → CA 17 280 €/an ; marge 8 375 € ; 15 h/mois |
| M2 Freemium athlète (abonnés premium) | 0 → CA 0 €/an ; marge 0 € ; 0 h/mois | 10 → CA 479 €/an ; marge 318 € ; 0 h/mois | 50 → CA 2 394 €/an ; marge 1 592 € ; 1 h/mois | 20 → CA 958 €/an ; marge 637 € ; 0 h/mois | 150 → CA 7 182 €/an ; marge 4 775 € ; 2 h/mois | 600 → CA 28 728 €/an ; marge 19 101 € ; 10 h/mois |
| M3 Licence structure (structures) | 0 → CA 0 €/an ; marge 0 € ; 0 h/mois | 0 → CA 0 €/an ; marge 0 € ; 0 h/mois | 1 → CA 600 €/an ; marge 361 € ; 1 h/mois | 1 → CA 600 €/an ; marge 361 € ; 1 h/mois | 3 → CA 1 800 €/an ; marge 1 084 € ; 3 h/mois | 6 → CA 3 600 €/an ; marge 2 168 € ; 6 h/mois |
| M4 Marketplace (programmes vendus / mois) | 0 → CA 0 €/an ; marge 0 € ; 0 h/mois | 2 → CA 234 €/an ; marge 172 € ; 0 h/mois | 6 → CA 702 €/an ; marge 517 € ; 0 h/mois | 3 → CA 351 €/an ; marge 259 € ; 0 h/mois | 10 → CA 1 170 €/an ; marge 862 € ; 1 h/mois | 30 → CA 3 510 €/an ; marge 2 587 € ; 2 h/mois |
| M5 Service Nathan (athlètes payants) | 0 → CA 0 €/an ; marge 0 € ; 0 h/mois | 3 → CA 1 764 €/an ; marge 1 250 € ; 3 h/mois | 8 → CA 4 704 €/an ; marge 3 333 € ; 9 h/mois | 5 → CA 2 940 €/an ; marge 2 083 € ; 5 h/mois | 12 → CA 7 056 €/an ; marge 4 999 € ; 13 h/mois | 18 → CA 10 584 €/an ; marge 7 499 € ; 20 h/mois |

**Lecture**
- **À 12 mois, le chiffre d'affaires réaliste est proche de zéro** : M5 démarre à l'été 2027 (3 athlètes, environ 1 800 €/an en rythme annuel), M1 a au mieux 1 coach payant.
- **À 36 mois, M6 réaliste** : M5 avec 12 athlètes + M1 avec 20 coachs + 3 structures, soit **environ 14 600 €/an de chiffre d'affaires** et **environ 21 h par mois** de suivi et de support. C'est déjà tout le budget temps de Nathan (22 h par mois), **sans développement**.
- C'est un **complément de revenu étudiant, pas une startup**. Un investisseur lira ce dossier comme un refus d'investissement, et il aura raison.

**À quel point c'est incertain ?** Énormément.
- **Aucun** client n'a encore payé, aucun entretien n'est fait.
- L'adhésion n'est mesurable aujourd'hui que sur un seul athlète (`09`).
- La douleur « coach » n'est pas prouvée (`04`).
- Les scénarios optimistes de M1 et M2 à 36 mois supposent une diffusion internationale, sans aucune preuve aujourd'hui.

## 5. Seuils et obligations à surveiller

| Seuil | Valeur 2026 | Conséquence |
|---|---|---|
| Franchise de TVA (services) | 37 500 € de CA **total**, photo-vidéo comprise (tolérance 41 250 €) | Au-delà : facturer la TVA à 20 %. **À recalculer avec le CA photo-vidéo réel de Nathan** |
| Plafond micro-entreprise (services) | 83 600 €, toutes activités | Probablement hors de portée |
| Ventes à des particuliers dans les autres pays de l'UE | 10 000 €/an | TVA du pays du client (OSS) ou merchant of record |
| Carte professionnelle | dès le premier euro de coaching | **Obligatoire pour M5 ; conditionne le calendrier** |
| Assurance RC pro | avant le premier paiement | Devis écrit couvrant le coaching à distance et le dommage corporel |
| Rattachement au foyer fiscal des parents ou bourse | dès le premier euro | Le revenu compte pour la bourse et l'impôt des parents : en parler au CROUS |

## Sources

[@anthropic-prix-2026] [@cloudflare-workers-prix] [@cloudflare-r2-prix] [@cloudflare-pages-limites] [@github-pages-limites] [@stripe-prix-fr] [@apple-developer-programme] [@revenuecat-2026] [@nolio-prix] [@trainheroic-prix] [@hevycoach-prix] [@trainingpeaks-prix-coach] [@reathletik-prix] [@trailsinfrance-coaching]. Fiscalité et assurances : sources officielles dans `07-juridique-technique.md`.
