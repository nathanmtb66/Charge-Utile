# Revue contradictoire — fichiers business 02, 03, 05, 06, 07, 08, 09

*Relecteur : contradicteur (investisseur / coach concurrent / juriste). Faite le 1er octobre 2026. Fichiers relus en entier : `02`, `03`, `05`, `06` (+ `_outils/modele_eco.py`, relancé), `08`, `09`. `07` : résumé, sections 2, 4, 5, 6, 8 (DMA/stores) et 9.1 relues ; sections 1, 3, 7, 10 parcourues seulement. 33 pages web rouvertes par moi (tableau B).*

Gravité : **bloquant** (à régler avant toute décision, vente ou publication), **important**, **mineur**.

## Verdict en 6 lignes

1. **Les sources sont globalement bien lues.** Sur 31 faits revérifiés, 24 sont confirmés, 5 sont imprécis ou trop forts, 2 n'ont pas pu être confirmés. Aucune source inventée trouvée. Aucune clé `[@…]` manquante dans `sources.json`.
2. **Les calculs sont justes arithmétiquement**, mais la « marge nette » oublie les coûts fixes du service, et aucun scénario n'est confronté au temps disponible.
3. **Le problème n° 1 est juridique et de calendrier** : le plan fait vendre du coaching à des compétiteurs en novembre 2026, alors que Nathan n'a pas encore la licence qui le permet (problème 1).
4. **Le problème n° 2 est de publication** : `07` décrit dans un dépôt public comment écrire dans le compte intervals.icu d'un athlète, avant que la faille soit corrigée (problème 2).
5. **Le prix de 49 €/mois repose sur deux prix affichés, lus de façon sélective** (problème 7).
6. La recommandation « P2 puis P1 » est cohérente d'un fichier à l'autre sur le fond ; les **critères de bascule diffèrent** entre `05` et `08` (problème 10).

---

## A. Problèmes trouvés

### A1. Bloquants

**1. [bloquant — juriste] Le service M5 est planifié en novembre 2026 pour un public que Nathan n'a pas encore le droit d'encadrer contre rémunération.**
- Ce que disent les fichiers : `05` et `06` font de M5 la source de revenu « tout de suite » ; `09` prévoit « 2-3 premiers athlètes payants » en novembre 2026 ; la cible est partout décrite comme des compétiteurs régionaux à nationaux. Or `07` (5.3) et `09` (point 11) écrivent eux-mêmes que le DEUG exclut la compétition et que seule la licence Entraînement sportif le permet.
- Preuve : page de l'université de Montpellier rouverte : le DEUG autorise l'encadrement « à un niveau d'initiation, d'entretien ou de loisir », compétition exclue ; la licence l'autorise dans la discipline de l'annexe au diplôme (https://entrainement-sportif-staps.edu.umontpellier.fr/la-licence-entrainement-sportif/les-prerogatives/). Article L.212-1 rouvert : le II n'ouvre l'exercice rémunéré aux personnes en formation que dans les conditions du règlement du diplôme (https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037388193). Réponse ministérielle n° 714 rouverte : le distanciel est soumis aux mêmes obligations (https://www.assemblee-nationale.fr/dyn/17/questions/QANR5L17QE714).
- Conséquence : Nathan est en L3. S'il n'obtient la licence qu'à l'été 2027, M5 tel que décrit n'est pas vendable avant, soit **8 à 9 mois de décalage** sur le plan et sur le CA « réaliste » de 4 700 €. La page de Montpellier indique un an d'emprisonnement et 15 000 € d'amende pour le défaut de déclaration.
- Correction : écrire dans `05`, `06` et `09` une ligne « ce que Nathan peut vendre aujourd'hui, avec quel titre, à quel public ». Trois issues à faire trancher par le service départemental (SDJES) et par le responsable de la licence : (a) carte au titre du DEUG, donc public loisir seulement ; (b) convention de stage rémunéré dans le cadre de la L3 ; (c) attendre le diplôme et ne vendre d'ici là que des prestations qui ne sont pas de l'encadrement. Recaler le calendrier M5 sur la date réelle de la carte.

**2. [bloquant — juriste / sécurité] `07` publie le mode d'emploi d'une faille non corrigée, dans un dépôt public.**
**Deux défauts de sécurité ont été relevés dans le site et le relais actuels** (accès aux plans des athlètes ; intégrité des écritures vers intervals.icu). Les détails sont volontairement **hors du dépôt public** : voir `recherche/_prive/securite-relais.md` sur le Mac de Nathan.
- Correction : **corriger la faille avant de pousser `recherche/` sur GitHub**, ou retirer ce passage de `07` et le garder dans `prive/`. Après correction, changer tous les codes (ils sont dans l'historique git). Même remarque pour le présent rapport : ne pas le publier avant le correctif.

### A2. Importants

**3. [important — juriste / fiscal] La micro-entreprise existe déjà : `06` et `07` raisonnent comme si elle était à créer.**
- `09` écrit « Photo-vidéo en micro-entreprise ». `07` (section 6) et `09` (novembre) disent pourtant « immatriculer la micro-entreprise avant le premier euro ; ACRE dans les 60 jours ». Le mot « photo » n'apparaît ni dans `06` ni dans `07`.
- Conséquences si l'information de `09` est exacte : une personne n'a qu'une entreprise individuelle, donc il s'agit d'**ajouter une activité**, pas de créer ; l'ACRE ne se redemande pas pour une activité ajoutée (règle générale, non relue sur une page officielle : la page URSSAF a refusé la connexion) ; les seuils de 37 500 € (TVA) et de 83 600 € s'apprécient sur le **chiffre d'affaires total**, photo-vidéo comprise. La phrase de `06` « on reste dessous » n'est donc pas démontrée.
- Correction : demander à Nathan son CA photo-vidéo annuel et refaire le tableau des seuils avec le cumul ; remplacer « créer » par « déclarer une activité supplémentaire » ; retirer l'ACRE du plan tant que ce n'est pas vérifié auprès de l'URSSAF.

**4. [important — investisseur] Les volumes de `06` ne tiennent pas dans le budget temps de `09`.**
- `06` : 45-60 min par athlète et par mois, plus 10 min de support. À 8 athlètes : 7 à 9 h/mois, soit environ 2 h/semaine. `09` donne 2 h/semaine **au total** en décembre et en mai : rien ne reste pour les vidéos de décembre ni pour les entretiens.
- À 36 mois « réaliste » (20 athlètes + 25 coachs + 3 structures) : 20 × 55-70 min + 25 × 15 min ≈ 25 à 30 h/mois de pur suivi, soit 6 à 7 h/semaine sans une heure de développement, pour un budget de 5 h.
- Octobre 2026 à lui seul : corriger la faille, 10 entretiens (environ 1 h 30 chacun avec la prise de contact et les notes), mesurer l'adhésion, dossier de carte professionnelle. À 5 h/semaine, soit 22 h dans le mois, cela ne passe pas. Les 200 h de stage de L3 ne sont comptées nulle part.
- Correction : ajouter une colonne « heures de Nathan par mois » dans chaque scénario de `06` ; plafonner les scénarios par le temps (à 5 h/semaine, M5 seul plafonne vers 15-18 athlètes, sans rien développer) ; réduire octobre à deux choses : la faille et 5 entretiens.

**5. [important — investisseur] La « marge nette » de M5 oublie les coûts fixes du service.**
- Le script retire cotisations, Stripe, API et 1/20 de Cloudflare. Il ne retire ni la RC pro (150-500 €/an selon `06` lui-même), ni le médiateur, ni la CFE, ni la contribution à la formation professionnelle, ni l'impôt.
- Scénario pessimiste M12 (3 athlètes, marge affichée 1 250 €/an) : après assurance, il reste 750 à 1 100 € ; avec 500 à 1 500 € de juriste, **l'année 1 pessimiste est déficitaire**.
- Correction : une ligne « coûts fixes annuels » et une marge après coûts fixes par scénario ; nuancer « seul modèle rentable dès la première année ».

**6. [important — juriste] Calendrier de l'assurance incohérent.** `09` place « Assurance RC pro coach + éditeur (devis écrit) » en **juin 2027**, alors que les premiers athlètes payants sont prévus en novembre 2026 et que `07` (priorité 8) la veut « avant la vente ». La réponse n° 714 cite l'assurance parmi les obligations du coach en ligne. Correction : remonter la RC pro au mois qui précède le premier paiement.

**7. [important — coach concurrent] Le « prix de marché » de 55-70 €/mois est lu de façon sélective.**
- `02` (5.3) et `06` (M5) s'appuient sur deux pages. Rouvertes le 01/10/2026 :
  - Trails in France vend bien une préparation physique **personnalisée à 60 €/mois**, mais aussi un « renforcement général » et une formule spécifique trail à **8 €/mois** chacune (https://trails-in-france.com/coaching-trail-personnalise/). Ces deux offres ne sont citées nulle part.
  - Réathlétik est un centre avec kinésithérapie et bilans en présentiel ; ses offres à distance sont à 55, 70 et 80 €/mois (https://reathletikcenter.fr/pricing-3/).
- Lecture : le marché montre **deux étages**, 8 €/mois pour du contenu standard et 55-80 €/mois pour du personnalisé vendu par des professionnels installés. Un étudiant sans carte professionnelle, face à des athlètes de 18-25 ans qu'il suit aujourd'hui gratuitement, n'est pas dans l'étage haut par défaut.
- Correction : citer les deux étages dans `02` et `06` ; tester le prix avant de l'écrire dans le plan (c'est prévu dans `08`, mais `06` et `09` utilisent déjà 49 € comme acquis).

**8. [important — investisseur] `02`, point 5 : « un coach peut payer 5 à 15 €/mois par athlète pour un outil » contredit les chiffres du même fichier.** `02` (5.4) mesure un budget logiciel de 20-60 €/mois pour 10-25 athlètes, soit 2 à 6 % du CA, donc 2 à 6 € par athlète pour **tous** les outils. `06` retient 2 € par athlète. Les prix rouverts vont dans le même sens : Nolio 29,90 € pour 25 athlètes, soit 1,20 € par athlète (https://www.nolio.io/en/pricing/). Correction : remplacer « 5 à 15 € » par « 1 à 3 € », ou supprimer la phrase.

**9. [important — investisseur] `02` (5.6) : le marché du coaching « 35-55 M€/an » repose sur 10-15 athlètes payants par coach.** Le même paragraphe dit que « beaucoup de coachs ont 3-5 athlètes » et la section 3.4 que la majorité est à temps partiel. Avec 5 athlètes en moyenne : 3 000 × 5 × 100 € × 12 = 18 M€. L'arithmétique est juste, l'hypothèse centrale est haute. Correction : afficher 15-55 M€ et dire que le bas est le plus probable. Même section : « 141 000 éducateurs sportifs **salariés**, dont un tiers d'indépendants » est contradictoire dans les termes (à relire dans la source INSEE, non rouverte).

**10. [important — cohérence] Les critères de bascule vers P1 ne sont pas les mêmes dans `05` et dans `08`.**
- `05` (repris par `06`) : 5 coachs actifs chaque semaine pendant 8 semaines ; **3 qui « disent qu'ils paieraient »** 10 €/mois ; OAuth réglé ; délai de 6 à 9 mois.
- `08` (repris par `09`) : 5 coachs testant avec 3 athlètes pendant 4 semaines ; rétention de 60 % à 8 semaines ; **3 préventes payées** ; décision fin février 2027, soit 4 à 5 mois.
- Le critère déclaratif de `05` contredit la méthode Mom Test que `08` impose (« les compliments ne comptent pas »). `09` renvoie aux « critères de `08` », `06` aux « critères de `05` ».
- Correction : une seule liste, celle de `08` (paiement réel), recopiée dans `05` ; ajouter « OAuth réglé » à `08`.

**11. [important — méthode] `08` applique à 8 semaines un repère mesuré à 6 mois.** Le seuil « ≥ 60 % programment encore à 8 semaines (repère SaaS pour petites entreprises) » cite Lenny Rachitsky. Page rouverte : le repère de 60 % est une rétention **à 6 mois** (https://www.lennysnewsletter.com/p/what-is-good-retention-issue-29). À 8 semaines, un seuil de 60 % est donc trop indulgent. Correction : viser 80 % à 8 semaines, ou dire que le seuil est un choix sans repère publié. Autre seuil hors d'atteinte : le score de Sean Ellis exige 40 répondants, avec 5 à 10 coachs pilotes il ne sera jamais calculable dans l'année.

**12. [important — investisseur] Aucune preuve d'usage, et la base est plus petite qu'annoncé.** Les consignes parlent de 7 athlètes ; le fichier public d'équipe en liste 4, et `05` note que 3 fichiers de séances sur 4 sont vides. L'adhésion n'est donc mesurable aujourd'hui que sur **un** athlète. Le « signal d'arrêt global » de `08` (75 % de séances faites par les 7 athlètes pendant 8 semaines) suppose d'abord de mettre les 7 dans l'appli. Correction : le dire dans `09`, octobre : « embarquer les 7 » avant « mesurer ».

**13. [important — juriste] Pilotes avec des mineurs proposés avant le correctif de sécurité.** `08` classe en contacts n° 3 et 4 une section VTT de collège-lycée et une section biathlon « dès 11 ans », à tester d'ici fin novembre 2026. À cette date : fichiers publics, pas de consentement parental en place, pas de carte professionnelle. Correction : sortir les mineurs de la première vague ; ne garder que des adultes (stagiaires DEJEPS, étudiants STAPS, coachs indépendants).

**14. [important — cohérence] intervals.icu : trois chiffres différents selon le fichier.**
- Taille de l'équipe : `05` et `09` écrivent « 3 personnes » comme un fait ; `02` écrit « ~8 personnes » ; `03` signale la contradiction. Page « About » rouverte : 7 personnes nommées, plus des modérateurs bénévoles (https://www.intervals.icu/about/). Le « 3 » vient d'un article de presse de mai 2026.
- Utilisateurs : `02` écrit « 100 000+ athlètes et 111 M d'activités » ; `03` écrit 160 000+ et 193 M (page d'accueil).
- Correction : aligner `02`, `05` et `09` sur `03` ; écrire « petite équipe (3 à 8 personnes selon la source) ».

**15. [important — hypothèse] « 9 séances dictées par athlète et par mois, toutes par l'IA » appliqué au SaaS M1.** C'est ce qui fait peser l'API 27 % du prix (0,54 € sur 2 €) et qui écrase la marge M1 (6,48 € de coût variable sur 24 €). Un coach de 12 athlètes duplique la plupart de ses séances. Aucune mesure réelle du nombre de séances dictées n'existe. Correction : mesurer un mois réel de Nathan, puis remplacer l'hypothèse ; présenter 25 % comme un majorant.

### A3. Mineurs

16. **`06`, prix concurrents cités de façon imprécise.** « TrainingPeaks : 9 à 4,50 $ par athlète » : le tarif de 4,50 $ ne s'applique qu'à partir de 1 000 athlètes ; pour 10-19 athlètes, c'est 8,55 $ (https://www.trainingpeaks.com/pricing/for-coaches/). « Nolio : 1 à 1,50 € par athlète au-delà du quota » : vrai seulement pour l'offre Pro (au-delà de 30 athlètes).
17. **`06`, RevenueCat.** Les 2,1 % à J35 et 0,38 $ par installation sont confirmés. Le « environ 28 % de renouvellement annuel » n'a pas été retrouvé à la relecture (la page parle d'un tiers d'annulations du renouvellement automatique dès le premier mois). À relire ou retirer.
18. **Script : Stripe Billing (0,7 %) cité dans le texte, absent du calcul.** Sur 49 € : 0,34 € par mois. Ajouter la constante ou écrire que Billing ne sera pas utilisé. Le 0,7 % n'a pas été retrouvé à la relecture de la page Stripe (non affiché dans le résumé obtenu).
19. **Script : le « cache froid » facture l'écriture du cache aux deux tours.** En réalité le 2e tour lit le cache : une séance isolée coûte environ 0,048 € et non 0,060 €. C'est un majorant prudent, à dire. À l'inverse, le 2e tour renvoie la première réponse (environ 1 100 tokens d'entrée) : non compté, effet négligeable.
20. **`06`, incohérence interne.** Le tableau donne M1 « réaliste M12 = 4 coachs payants », alors que M6 réaliste à 12 mois dit « M1 en pilote gratuit » et que `09` prévoit les premiers coachs payants en juillet 2027 « si go ». Mettre 0 à 2.
21. **`06`, LTV de M5.** Une perte de 8 % par mois donne 34,72 ÷ 0,08 ≈ 434 €, pas « 300 à 420 € ». Deux méthodes sont mélangées.
22. **`05`, « ≈ 36 000 à 216 000 €/an en plafond ».** Dans `02`, 36 000 € est le scénario bas, pas un plafond.
23. **`05`, tableau de notes.** P2 reçoit « douleur prouvée : 4 », alors que les douleurs de `04` portent sur l'outil, pas sur l'envie de payer un préparateur à distance ; « concurrence : 4 » alors que le même fichier cite en « contre » tous les coachs qui incluent déjà la force. La ligne « risque juridique » ne dit pas si 5 signifie peu de risque ; P2 y reçoit 3 contre 2 pour P1, alors que P2 porte le risque pénal (problème 1). Le classement tient surtout à « compatible avec un étudiant seul » : le dire.
24. **`02` contre `08` sur Font-Romeu.** `02` (1 minute, 4.2, 4.4) écrit « Font-Romeu accueille un pôle espoir VTT » comme un fait ; `08` explique que c'est probablement un raccourci de l'office de tourisme. Page sports.gouv.fr rouverte : les 8 structures permanentes citées ne comprennent pas le VTT. Aligner `02` sur `08`. Nathan connaît la réponse : la lui demander.
25. **`02` contre `08` sur les pôles.** FFTri : `02` place le pôle espoirs à Montpellier seulement, `08` à Boulouris et à Montpellier. FFC : `02` compte « 4 pôles France relève », `08` « 3 relève + 1 outre-mer ».
26. **`02`, INJEP.** « 12 % des 15 ans et plus pratiquent avec une appli » : à la relecture, la base semble être les pratiquants, pas toute la population (https://injep.fr/publication/les-pratiques-sportives-en-france-en-2024-avant-les-jeux-de-paris/). À vérifier dans le PDF.
27. **`02`, VTT « en baisse depuis 4 ans » et « -0,64 % ».** DirectVelo confirme une baisse « sur plusieurs années » ; le chiffre et le « 4e année » n'ont pas été retrouvés. Le même article signale un recul de 5,8 % des licences validées au 15/10/2025 : à ajouter, c'est une mauvaise nouvelle omise.
28. **`03` contre `05` sur Garmin.** `03` (section 6) juge « probable à moyen terme » une offre Garmin intégrée ; `05` et `09` écrivent « peu probable ». DC Rainmaker, rouvert, parle d'une chance quasi nulle d'intégration **native dans Garmin Connect**, ce qui n'exclut pas des passerelles entre produits. Écrire la même nuance partout.
29. **`03`, attribution.** La phrase sur l'OAuth « par conception » est attribuée à « un modérateur, déc. 2025 ». La recherche du forum montre que la formule d'origine est du créateur lui-même, le 07/11/2023 (fil OAuth n° 2759). Le fait est donc plus solide qu'écrit. Corriger la source.
30. **`08`, « budget des teams avant le 1er novembre ».** La source est l'échéance 2025 pour la saison 2026 ; l'échéance 2026 n'est pas publiée. Et au 1er octobre, avec 5 h par semaine, cette fenêtre est de fait déjà passée pour un service payant : le dire au lieu de « la fenêtre, c'est maintenant ».
31. **`08`, Campus Coach.** « 350 000 à 500 000 abonnés YouTube » : la page dit 350 000 sur YouTube et 500 000 toutes plateformes confondues. Les 5 M€ sont un titre d'épisode, déclaratif.
32. **`07`, sanction pénale.** Le quantum vient d'une page d'université ; l'article L.212-8 n'a pas été relu. À relire sur Légifrance avant de le citer.
33. **`07`, ACRE.** Le passage à 25 % au 01/07/2026 est confirmé seulement par des sites privés concordants. `07` ne mentionne pas les conditions d'éligibilité (moins de 26 ans, demandeur d'emploi…) rappelées par ces mêmes sites.
34. **`sources.json` : 23 URL en double sous deux clés** (par exemple `font-romeu-cnea` et `fontromeu-creps-cnea`, `sports-gouv-creps-font-romeu` et `sportsgouv-creps-font-romeu`, `intervals-prix` et `intervals-icu-prix`, et 15 paires `forum-*` / `intervals-*`). À fusionner.

### A4. Regard des trois lecteurs

**Investisseur — ce qui est faible**
- Le dossier conclut lui-même « complément de revenu, pas une startup » : 20 000 €/an de CA à 36 mois. C'est honnête, et c'est un refus d'investissement.
- Zéro client payant, zéro entretien fait, adhésion mesurable sur un seul athlète (problème 12), fondateur à 5 h par semaine.
- Aucun avantage technique ne tient plus de quelques mois (`05` le dit). Le seul actif défendable est une personne.
- La plateforme d'appui change ses conditions avec 30 jours de préavis (confirmé) et le parcours « sans compte » disparaît dès qu'on vend (OAuth par athlète, confirmé).
- Tous les chiffres de clients sont des hypothèses de l'auteur, sans un seul point de mesure.

**Coach concurrent — ce qui est naïf**
- Croire qu'un coach d'endurance enverra son athlète payer 49 € à un autre intervenant : c'est une part de son propre budget client. `05` ne dit pas pourquoi il le ferait.
- Croire que le prix affiché par un centre de réathlétisation vaut pour un étudiant (problème 7).
- Vendre à ses propres athlètes ce qu'ils reçoivent gratuitement : la conversion des 7 n'est estimée nulle part.
- Prescrire des charges lourdes à distance à des jeunes sans les voir : un coach installé y verra un risque de blessure, donc un argument contre Nathan.
- Les stagiaires DEJEPS et les étudiants STAPS sont des testeurs gratuits par construction : ils ne paieront pas et partent en fin d'année.

**Juriste — ce qui est risqué**
- Exercice rémunéré sans la qualification requise (problème 1).
- Faille documentée publiquement, sur des données que `07` qualifie lui-même de données de santé (problème 2).
- Mineurs dans la première vague de tests (problème 13).
- Assurance après les premiers encaissements (problème 6).
- Squelette sous AGPL dans une appli qui serait vendue : bien identifié dans `07`, mais placé en avril 2027 dans `09`, soit après les premières ventes M5 qui utilisent l'appli. À discuter : M5 vend-il l'appli ou seulement le service ?
- Conclusion « pas d'HDS » fondée sur une FAQ de l'ANS que l'auteur n'a pas pu ouvrir ; le raisonnement sur l'article L.1111-8 est correct à la relecture, mais la licence M3 aux pôles et CREPS touche exactement le point de bascule que `07` décrit.
- Envoi de données d'athlètes à Claude : `07` demande la pseudonymisation ; rien dans `09` ne la planifie.

### A5. Données personnelles dans les fichiers relus (dépôt public)

| Constat | Fichier | Gravité | Action |
|---|---|---|---|
| Aucun nom de famille d'athlète, aucun détail médical individuel, aucune adresse e-mail dans les 7 fichiers (recherche faite) | tous | — | rien |
| Description précise de la faille et du fichier qui expose prénoms et codes | `07`, repris dans `05` et `09` | bloquant | problème 2 |
| « Un coach basé à Font-Romeu a demandé à figurer dans l'annuaire le 29/09/2026 », avec la supposition « c'est peut-être Nathan lui-même » | `03` (recommandation et section 2) | mineur | dans une commune de cette taille, la personne est identifiable ; retirer la date et la supposition |
| Effectifs très petits de jeunes par centre (« ≈ 2 », « ≈ 7 »), tirés d'un PDF nominatif de mineurs | `08` (1.2) | mineur | garder le total, retirer la ligne Pyrénées ou l'arrondir ; ne pas mettre le PDF en avant |
| Prénoms de deux coachs avec diplôme et année, tirés de leurs fiches commerciales | `02` (5.1) | mineur | remplacer par « un coach cyclisme (ProTrainer) » |
| Prénoms des salariés d'intervals.icu | `03` (un prénom) | mineur | inutile au propos : retirer |
| Pseudonymes de développeurs (ponts Hevy, dépôts GitHub) | `03` | acceptable | ce sont des noms de projets publics |
| Personnalités publiques (député, créateur d'intervals.icu, créateurs de contenu) | `03`, `07`, `08` | acceptable | — |

---

## B. Faits revérifiés (pages rouvertes par moi le 01/10/2026)

| # | Fait | Fichier | Verdict | Preuve |
|---|---|---|---|---|
| 1 | Plafond micro-entreprise services et libéral : 83 600 € ; sortie après 2 ans de dépassement | 06, 07 | **confirmé** | https://entreprendre.service-public.gouv.fr/vosdroits/F32353 (vérifiée le 21/02/2026) |
| 2 | Franchise de TVA services 37 500 €, tolérance 41 250 € | 06, 07 | **confirmé** | https://entreprendre.service-public.gouv.fr/vosdroits/F21746 |
| 3 | Réforme du seuil unique à 25 000 € « abandonnée » | 06, 07 | **confirmé** (mot exact de la page) | idem |
| 4 | Cotisations 21,2 % (BIC services), 25,6 % (BNC), 22,9 % et 27,8 % avec versement libératoire | 06, 07, script | **confirmé** | https://entreprendre.service-public.gouv.fr/vosdroits/F36232 |
| 5 | Réponse ministérielle n° 714 : coaching en ligne soumis à L.212-1 ; question du 08/10/2024, réponse du 29/04/2025 ; contrôles avec la DGCCRF | 07 | **confirmé** | https://www.assemblee-nationale.fr/dyn/17/questions/QANR5L17QE714 |
| 6 | L.212-1 II : exercice rémunéré possible en cours de formation, dans les conditions du règlement du diplôme | 07 | **confirmé** | https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037388193 |
| 7 | DEUG STAPS : compétition exclue ; licence ES : compétition dans la discipline de l'annexe | 07, 09 | **confirmé** (page d'université, pas le texte réglementaire) | https://entrainement-sportif-staps.edu.umontpellier.fr/la-licence-entrainement-sportif/les-prerogatives/ |
| 8 | API intervals.icu : licence gratuite, perpétuelle, usage commercial inclus ; 30 jours de préavis ; en vigueur au 23/10/2025 | 03 | **confirmé** | https://forum.intervals.icu/t/intervals-icu-api-terms-and-conditions/114087 |
| 9 | OAuth obligatoire pour une appli à plusieurs utilisateurs ; 5 000 requêtes/jour par clé | 03 | **confirmé** | https://forum.intervals.icu/t/api-access-to-intervals-icu/609 |
| 10 | Un jeton OAuth ne donne pas accès aux athlètes coachés, « by design » | 03, 05, 09 | **confirmé**, attribution à corriger (créateur, 07/11/2023) | recherche du forum : https://forum.intervals.icu/search.json?q=oauth%20coach%20athletes%20%22by%20design%22 ; non retrouvé dans la première page du fil 116453 |
| 11 | `GET /api/v1/athletes` refuse les jetons OAuth | 03 | **confirmé** (créateur, 08/06/2026) | https://forum.intervals.icu/t/onboarding-athletes-and-coaching-groups/108864 |
| 12 | GitHub Pages : usage SaaS commercial non autorisé ; 1 Go, 100 Go/mois | 05, 06, 09 | **confirmé** (« not intended for or allowed ») | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits |
| 13 | Prix API Claude : Sonnet 5.5 2 $/10 $, cache 0,20 $/2,50 $ ; Haiku 4.5 1 $/5 $ ; Opus 5.5 4 $/20 $, cache 0,20 $/5 $ | 06, script | **confirmé** | https://claude.com/pricing |
| 14 | Stripe : 1,5 % + 0,25 € (cartes standard EEE) | 06, script | **confirmé** ; Billing 0,7 % **non retrouvé** à cette lecture | https://stripe.com/fr/pricing |
| 15 | Nolio coach 19,90 / 29,90 / 39,90 € ; club 29,90-49,90 € ; Premium 6,90 € | 02, 06 | **confirmé** ; « 1-1,50 € par athlète » vrai pour l'offre Pro seulement | https://www.nolio.io/en/pricing/ |
| 16 | TrainingPeaks coach 21,99 $, Unlimited 54,99 $, 99 $ d'activation, Premium 9 $ | 02, 06 | **confirmé** ; « jusqu'à 4,50 $ » seulement à 1 000 athlètes et plus | https://www.trainingpeaks.com/pricing/for-coaches/ |
| 17 | Marketplace Nolio : 602 coachs | 08 | **confirmé** ; commission de 25-33 % **non retrouvée** sur cette page | https://www.nolio.io/marketplace/coach/ |
| 18 | FFTri : 75 519 licenciés (+6,4 %), 1 028 clubs | 02 | **confirmé** | https://www.sportbusiness.club/triathlon-hausse-de-licencies-a-la-federation-francaise/ |
| 19 | FFC : 109 964 licenciés en 2025 (+2,15 %), route -0,92 %, BMX +11,66 % | 02 | **confirmé** ; « VTT -0,64 %, 4e année » non retrouvé ; recul de 5,8 % à l'automne 2025 omis | https://www.directvelo.com/actualite/125444/ffc-une-hausse-des-licencies-contrastee |
| 20 | FFA : plus de 321 000 licenciés mi-janvier 2025, 2 535 clubs | 02 | **confirmé** | https://www.sporsora.com/membres/actualites-des-membres/item/9249-ff-athletisme-2024-2025-une-saison-record-pour-les-licencies |
| 21 | Trail : 42 000 licenciés FFA, +90 % en 3 ans, 5 900 trails en 2025 | 02 | **confirmé** | https://jogging-international.net/actualites/trail-les-chiffres-fous-qui-confirment-lengouement/ |
| 22 | Font-Romeu : 8 structures permanentes, environ 3 000 athlètes par an, 35 pays | 02, 08 | **confirmé** ; « 105 sportifs à l'année » et « 35 sports » non retrouvés à cette lecture ; VTT absent des structures permanentes | https://www.sports.gouv.fr/en/creps-occitanie-site-de-font-romeu |
| 23 | Font-Romeu : 142 sportifs, 11 pôles, dont « pôle espoir VTT » | 02, 08 | **confirmé** comme affirmation de l'office de tourisme | https://font-romeu.fr/en/accommodations/creps-cnea-centre-national-dentrainement-en-altitude/ |
| 24 | INJEP 2024 : 4 057 répondants, 58 % de pratique hebdomadaire, 12 % avec appli ou cours en ligne | 02 | **confirmé**, base du 12 % à vérifier | https://injep.fr/publication/les-pratiques-sportives-en-france-en-2024-avant-les-jeux-de-paris/ |
| 25 | INJEP/Céreq : 19 600 diplômes JEPS en 2023 ; 15 % d'indépendants à 3 ans | 02 | **confirmé** | https://injep.fr/publication/trois-ans-apres-le-diplome-83-des-diplomes-jeunesse-et-sports-en-emploi/ |
| 26 | Campus Coach : plus de 5 M€ de revenu récurrent, 50 personnes | 08 | **confirmé** comme déclaration du fondateur | https://www.gdiy.fr/podcast/nicolas-spiess-running-addict/ |
| 27 | Socialinsider : portée Instagram 3,20 %, 6,65 % pour 1 000-5 000 abonnés, 872 075 publications | 08 | **confirmé** | https://www.socialinsider.io/blog/social-media-reach/ |
| 28 | MDCG 2019-11 rév. 1 (juin 2025) : applis de fitness hors dispositif médical ; exemple de la rééducation personnalisée | 07 | **confirmé** (PDF relu en texte, 36 pages) | https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=md_mdcg_2019_11_guidance_qualification_classification_software_en.pdf |
| 29 | L.1111-8 CSP : champ, localisation UE/EEE (IV), interdiction de cession onéreuse (VII) ; version du 01/07/2025 | 07 | **confirmé** | https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000049577902 |
| 30 | Garmin a racheté TrainingPeaks et TrainHeroic le 22/07/2026 ; 500 000 utilisateurs, 10 000 coachs, 120 salariés | 02, 03, 05 | **confirmé** | https://www.dcrainmaker.com/2026/07/garmin-acquires-training-trainheroic.html |
| 31 | intervals.icu Supporter à 4 $/mois ; équipes et organisations réservées aux Supporters | 02, 03 | **confirmé** | https://www.intervals.icu/pricing/ |
| 32 | intervals.icu : « équipe de 3 personnes » | 05, 09 | **imprécis** : la page officielle nomme 7 personnes | https://www.intervals.icu/about/ |
| 33 | Préparation physique à distance « 55-70 €/mois » | 02, 05, 06 | **vrai mais sélectif** : 55/70/80 € chez l'un ; 60 € et deux offres à 8 € chez l'autre | https://reathletikcenter.fr/pricing-3/ ; https://trails-in-france.com/coaching-trail-personnalise/ |
| 34 | RevenueCat : 2,1 % à J35 en freemium, 0,38 $ par installation à J60 | 06 | **confirmé** ; « 28 % de renouvellement annuel » **non retrouvé** | https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026 |
| 35 | Rétention « 60 % = bon pour un SaaS de petites entreprises » | 08 | **mal appliqué** : repère à 6 mois, utilisé à 8 semaines | https://www.lennysnewsletter.com/p/what-is-good-retention-issue-29 |
| 36 | DEJEPS VTT : 16 places, septembre 2026 à octobre 2027, Montpellier et Font-Romeu, 8 820 € | 08 | **confirmé** | https://www.creps-montpellier.org/formation.fiche-DEJEPS-VTT |
| 37 | Labellisation des teams VTT : dossier et budget prévisionnel pour le 1er novembre 2025 | 08 | **confirmé** pour la saison 2026 ; extrapolé à 2026-2027 | https://www.comiteoccitanieffc.com/post/labellisation-teams-vtt-2026 |
| 38 | Cloudflare Workers : 100 000 requêtes/jour gratuites, 5 $/mois ; D1 5 Go | 06 | **confirmé** | https://developers.cloudflare.com/workers/platform/pricing/ |
| 39 | ACRE ramenée à 25 % pour les créations à partir du 01/07/2026 | 06, 07 | **non vérifiable** sur une page officielle (urssaf.fr a refusé la connexion) ; sites privés concordants | recherche web seulement |
| 40 | Licences 2024 INSEE (FFC 107,5 k, FFA 314,0 k…) | 02 | **non vérifiable** à cette lecture : la page s'ouvre, les lignes par fédération n'ont pas été restituées | https://www.insee.fr/fr/statistiques/2408252 |

**Calculs refaits** : coût par séance 0,030 € et 0,060 € ; 0,54 € par athlète et par mois ; les six marges du tableau ; toutes les projections ; marché par le bas de `02` (1,08 M€ ; 36-54 M€ ; 36 000 € et 216 000 €) ; entonnoir de `03` (25 à 420 coachs, 3 à 60 en France) ; 2 000 abonnés × 6,65 % ≈ 133 ; totaux du tableau de `05` (17, 27, 13). **Aucune erreur d'arithmétique.** Les réserves portent sur les hypothèses (problèmes 4, 5, 9, 15).

**Non revérifié faute de temps** : fiche CNOSF de la FFC (VTT 23,3 %), communiqué de résultats Garmin, TrainHeroic, Hevy Coach, App Store et Google Play, INPI (270 €), pages CNIL, WebKit, MakeHuman, FFS.

---

## Sources vérifiées

Une seule page ouverte par moi est absente de `sources.json` : la recherche du forum (3e entrée). Les deux premières URL y figurent déjà sous une autre clé : elles sont redonnées ici parce qu'elles portent le problème 1 ; à la fusion, garder la clé existante. Toutes les autres pages du tableau B sont déjà dans `sources.json`.

```json
[
  {"cle": "umontpellier-staps-prerogatives", "auteurs": "Université de Montpellier, UFR STAPS", "annee": 2026, "titre": "Licence Entraînement sportif : les prérogatives", "revue": "site universitaire", "doi": null, "url": "https://entrainement-sportif-staps.edu.umontpellier.fr/la-licence-entrainement-sportif/les-prerogatives/", "type": "site", "niveau": "D", "verifie": true, "note": "DEUG : initiation, entretien, loisir, compétition exclue ; licence ES : compétition dans la discipline de l'annexe ; défaut de déclaration puni d'un an et 15 000 €."},
  {"cle": "legifrance-code-sport-l212-1", "auteurs": "Légifrance", "annee": 2019, "titre": "Code du sport, article L212-1", "revue": "Légifrance", "doi": null, "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037388193", "type": "site", "niveau": "D", "verifie": true, "note": "I : qualification exigée pour encadrer contre rémunération ; II : personnes en formation, dans les conditions du règlement du diplôme."},
  {"cle": "forum-recherche-oauth-by-design", "auteurs": "Forum intervals.icu", "annee": 2023, "titre": "Recherche : oauth coach athletes by design", "revue": "forum officiel", "doi": null, "url": "https://forum.intervals.icu/search.json?q=oauth%20coach%20athletes%20%22by%20design%22", "type": "site", "niveau": "D", "verifie": true, "note": "Le créateur écrit le 07/11/2023 (fil OAuth 2759) que les jetons OAuth ne donnent pas accès aux athlètes suivis ou coachés, par conception ; repris par un membre le 10/12/2025."}
]
```
