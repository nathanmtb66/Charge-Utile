# 07 — Juridique et technique pour vendre

*Collecte du 30 septembre au 1er octobre 2026 sur les sites officiels : CNIL, Légifrance, service-public, ANSM, Assemblée nationale, WebKit, Apple, Google, INPI. **Ce n'est pas un avis juridique.** Chaque point a un niveau de certitude. Les points marqués « à faire valider » méritent un juriste avant la vente. Détail et liens : `_brut/juridique.md`.*

## En 1 minute

| Question | Réponse courte | Certitude |
|---|---|---|
| RPE, douleurs, poids, tests = **données de santé** ? | **Oui** pour les douleurs et les tests ; très probablement pour l'ensemble suivi dans le temps ; le RPE seul est une zone grise. → À traiter comme des données de santé (art. 9 RGPD) : **consentement explicite**, registre, AIPD conseillée. Pas de DPO obligatoire. | Élevée |
| **Hébergement HDS** obligatoire ? | **Non** : la collecte se fait hors prise en charge sanitaire (art. L.1111-8 CSP). Mais **la revente des données de santé est interdite**, même avec l'accord de la personne. | Élevée |
| **Dispositif médical** ? | **Non**, tant que l'appli reste un outil de préparation physique pour sportifs en bonne santé. Le guide européen (MDCG 2019-11 rév. 1) exclut les applis de fitness, mais classe en dispositif médical les « exercices de rééducation personnalisés » destinés à soulager une pathologie. **La ligne se franchit avec les mots** (« soigner », « rééducation », « prévenir la blessure ») : liste plus bas. | Élevée |
| **Carte professionnelle** d'éducateur sportif ? | **Obligatoire dès que Nathan est payé pour coacher, même en ligne** : la réponse ministérielle n° 714 (29/04/2025) le confirme pour le coaching à distance. Le DEUG STAPS **exclut** l'encadrement de compétiteurs ; la licence Entraînement sportif le permet **dans la discipline inscrite sur l'annexe du diplôme**. Pour la simple vente du logiciel, a priori non. | Élevée (coaching) / moyenne (logiciel) |
| Peut-on s'exonérer d'une blessure dans les CGU ? | **Non.** Face à un consommateur, c'est une clause noire (art. R.212-1, 6° Code de la consommation). Il faut décrire le service, faire déclarer l'aptitude, afficher des consignes de sécurité, **plafonner les progressions dans le code** et souscrire une **RC pro** (environ 150-500 €/an pour le volet coach et le volet éditeur, sur devis). | Élevée |
| **Micro-entreprise** | Plafond de 83 600 € ; **pas de TVA sous 37 500 €** (la réforme à 25 000 € a été abandonnée) ; cotisations de 21,2 % (BIC, logiciel) ou 25,6 % (BNC, coaching) ; ACRE probablement réduite à 25 % depuis le 01/07/2026 (à vérifier) ; revenus déclarés sur le foyer des parents si Nathan y est rattaché (impact possible sur la bourse). | Élevée (chiffres) |
| **PWA ou App Store** ? | **PWA pour la première année.** Sur iOS, les notifications et un stockage durable ne fonctionnent que si l'appli est **ajoutée à l'écran d'accueil** : il faut un tutoriel obligatoire au premier lancement, et une sauvegarde côté serveur. L'App Store viendra plus tard, pour la visibilité (99 $/an, commission de 15 %). Attention : règle 5.1.1 (ix) d'Apple, les applis « santé » doivent être soumises par une personne morale. | Moyenne à élevée |
| **Licences** | Le maillage MakeHuman est CC0 (sans risque). Le **squelette est sous AGPL : à remplacer avant toute vente**. Le dépôt n'a aucune licence explicite. | Moyenne |
| **Vidéos externes** | Le **lien simple** actuel est la solution la plus sûre ; l'intégration par le lecteur YouTube officiel est admise ; **ne jamais copier les GIF** de fitnessprogramer. À terme : tourner ses propres vidéos. | Élevée |
| **IA** (AI Act, art. 50, applicable depuis le 02/08/2026) | Obligation faible tant que le coach relit. Le faire quand même par défaut : mention « séance écrite avec l'aide d'une IA, relue par ton coach » et champ `"genere_par"` dans le JSON. | Moyenne |
| **Marque « Charge Utile »** | **Disponibilité NON vérifiée** (bases INPI et EUIPO inaccessibles aux outils). Un **magazine « Charge Utile » existe depuis 1992** (camions anciens) : risque de confusion faible, mais à vérifier en priorité. Le nom est une marque faible (mots courants). Dépôt INPI en classes 9, 41 et 42 : **270 €**. | Faible (disponibilité) |

## ⚠️ À corriger tout de suite, même en gratuit (sécurité du dépôt actuel)

Constats faits en lecture seule le 01/10/2026. Je ne les ai pas modifiés : la consigne interdit de toucher à `docs/` et `relais/`.

**Deux défauts de sécurité ont été relevés dans le site et le relais actuels** (accès aux plans des athlètes ; intégrité des écritures vers intervals.icu). Les détails sont volontairement **hors du dépôt public** : voir `recherche/_prive/securite-relais.md` sur le Mac de Nathan.
3. Le PIN de la vue coach est comparé à temps constant (bien), mais **aucune limite du nombre d'essais** n'a été repérée (à vérifier).
4. La **clé API du coach** donne accès à tous les athlètes : c'est le secret le plus sensible. Elle est bien stockée en variable secrète du Worker : à garder ainsi.

**Correctifs minimaux** :
- codes longs et aléatoires, plus aucune liste publique ;
**Deux défauts de sécurité ont été relevés dans le site et le relais actuels** (accès aux plans des athlètes ; intégrité des écritures vers intervals.icu). Les détails sont volontairement **hors du dépôt public** : voir `recherche/_prive/securite-relais.md` sur le Mac de Nathan.
- limite de débit sur le PIN ;
- `focus` exprimé sans vocabulaire de santé, ou servi seulement après authentification.

Ce point est repris dans `audit.md`.

## Formulations : la ligne du dispositif médical

**À éviter**, dans l'appli, sur le site, dans les fiches, sur les réseaux et **dans les textes écrits par Claude** : « traiter », « soigner », « guérir », « rééducation », « réathlétisation après blessure », « prévenir / éviter la blessure de… », « diagnostic », « pathologie », « tendinite », « syndrome », « anormal », « thérapeutique ».

**Formulations sûres** : « renforcement », « préparation physique », « stabilité », « proprioception », « robustesse », « genoux et chevilles solides pour le VTT », « amplitude mesurée pour suivre ta progression », « si tu as mal, arrête l'exercice et parles-en à un professionnel de santé ».

**Destination à reprendre partout** : *« Charge Utile est un outil de préparation physique pour sportifs en bonne santé. Il n'est pas un dispositif médical et ne remplace pas l'avis d'un professionnel de santé. »*

**À faire dans le produit** : ajouter cette liste de mots interdits **aux consignes de Claude** (c'est lui qui rédige les `message` et les `note`). Renommer le bouton « Douleur » en « Gêne », comme le prévoit déjà la mission.

## Dans l'ordre : ce qu'il faut faire avant de vendre

| Priorité | Action | Coût | Quand |
|---|---|---|---|
| 1 | Corriger les deux défauts de sécurité du site et du relais (détails hors dépôt : `recherche/_prive/securite-relais.md`) | 0 € | **Tout de suite** |
| 2 | Vérifier la marque (data.inpi.fr, TMview), puis la déposer en classes 9, 41 et 42 | 270 € | Avant de communiquer sur une version payante |
| 3 | Micro-entreprise ; ACRE dans les 60 jours | 0 € | Avant le premier euro |
| 4 | Carte professionnelle ; vérifier l'annexe du diplôme STAPS | 0 € | Avant le premier coaching payé |
| 5 | Remplacer le squelette AGPL ; fichier `LICENCES.md` ; choisir une licence ou passer le dépôt en privé | temps | Avant la vente |
| 6 | Politique de confidentialité, consentement santé explicite, registre, AIPD simple, sous-traitants (Cloudflare, Anthropic, intervals.icu), pseudonymisation de ce qui part vers Claude | temps + relecture | Avant la vente |
| 7 | CGU/CGV (destination non médicale, sécurité, médiateur, résiliation en 3 clics, rétractation) | temps + juriste (quelques centaines d'euros, non vérifié) | Avant la vente |
| 8 | RC pro coach + éditeur, avec un devis écrit couvrant le **dommage corporel** et le **coaching à distance** | environ 150-500 €/an | Avant la vente |
| 9 | Quitter GitHub Pages (usage SaaS interdit) ; sauvegardes 3-2-1 | 0-5 $/mois | Avant la vente |
| 10 | App Store / Play Store | 99 $/an + 25 $ | Plus tard, si le marché le demande |

## Quand consulter un juriste

- **Oui** : relecture des CGU/CGV et de la politique de confidentialité avant la première vente (la dépense juridique la plus rentable) ; question précise sur la vente de **programmes générés par IA sans coach diplômé**.
- **Oui, si** la recherche de marque fait apparaître le magazine en classes 9 ou 41 (conseil en propriété industrielle).
- **Non** pour le statut, la PWA ou la sécurité. Pour la sécurité, un audit par un pair développeur est plus utile.

---

# Étude détaillée

Constats faits dans le dépôt (lecture seule, 01/10/2026), utiles pour tout ce qui suit :
**Deux défauts de sécurité ont été relevés dans le site et le relais actuels** (accès aux plans des athlètes ; intégrité des écritures vers intervals.icu). Les détails sont volontairement **hors du dépôt public** : voir `recherche/_prive/securite-relais.md` sur le Mac de Nathan.
- Les résultats de tests et les fiches restent dans `prive/`, exclu de git (bon réflexe).
- Le bouton « Douleur » de l'appli ajoute une ligne « Douleur : … » à la description de l'activité envoyée par le Worker Cloudflare vers intervals.icu ; la vue coach relit ces lignes (`relais/worker.js`, l. 240-241). Les données de douleur quittent donc le téléphone et transitent par Cloudflare puis intervals.icu.
- L'appli contient déjà des mentions prudentes (« pas une prescription », « Une douleur qui dure, c'est le kiné ou le médecin », `docs/js/app.js` l. 1485 et 2364).

---

### 1. RGPD : RPE, douleurs, poids, tests sont-ils des données de santé ?

#### Réponse franche
**Oui pour les douleurs et les résultats de tests ; très probablement oui pour l'ensemble dès qu'ils sont croisés et suivis dans le temps ; le RPE seul est une zone grise.** En pratique, Charge Utile doit être traité comme un traitement de **données de santé** (catégorie particulière, art. 9 RGPD). Construire la conformité sur l'hypothèse inverse serait risqué et n'apporterait presque rien.

Certitude : **élevée** pour la douleur signalée (information directe sur l'état physique) ; **moyenne à élevée** pour poids, mobilité et force mesurées ; **moyenne** pour le RPE isolé.

#### Les textes
- **Art. 4.15 RGPD** : les données concernant la santé sont les données « relatives à la santé physique ou mentale d'une personne physique […] qui révèlent des informations sur l'état de santé » (texte lu sur [cnil.fr, chapitre 1 du RGPD](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre1)).
- **Considérant 35** : inclut notamment les informations obtenues lors du test ou de l'examen d'une partie du corps, et toute information sur une maladie, un handicap, un risque de maladie ou l'état physiologique, **quelle que soit la source**. Texte vu via un extrait de recherche web ([privacy-regulation.eu, considérant 35](https://www.privacy-regulation.eu/fr/r35.htm)) ; la page EUR-Lex du RGPD n'a pas pu être rendue par l'outil (page vide), le texte exact n'a donc pas été relu sur EUR-Lex.
- **Art. 9** : interdiction de principe de traiter des données de santé, sauf exceptions, dont le **consentement explicite** (9.2.a). Non relu sur EUR-Lex (même problème technique) ; règle de base connue et non contestée.

#### Position CNIL
La fiche CNIL « Qu'est-ce qu'une donnée de santé ? » ([cnil.fr](https://www.cnil.fr/fr/quest-ce-ce-quune-donnee-de-sante), publiée le 08/01/2018) distingue trois cas :
1. **par nature** (antécédents, maladies, résultats d'examens…) ;
2. **par croisement** : la CNIL cite le « croisement d'une mesure de poids avec d'autres données (nombre de pas, mesure des apports caloriques…) » et le croisement de la tension avec la mesure de l'effort ;
3. **par destination** : données utilisées à des fins médicales.
Elle précise que les données recueillies hors contexte médical « par des outils de mesure de soi » ne sont pas automatiquement des données de santé, et que l'aptitude sportive seule n'en est pas une, mais le devient si elle est croisée avec d'autres informations. Exception utile : la loi ne s'applique pas à une appli de santé qui stocke **localement, sans connexion extérieure, à des fins exclusivement personnelles**. Ce n'est pas le cas de Charge Utile (envoi au coach et à intervals.icu).

#### Position européenne (G29, prédécesseur du CEPD)
L'annexe à la lettre du Groupe de l'article 29 du 05/02/2015 sur les applis de bien-être ([PDF, ec.europa.eu](https://ec.europa.eu/justice/article-29/documentation/other-document/files/2015/20150205_letter_art29wp_ec_health_data_after_plenary_annex_en.pdf), lu intégralement) est toujours la référence la plus précise. Ce qu'elle dit, résumé :
- Un simple compteur de pas sur une marche isolée, sans croisement et sans contexte médical, n'est pas une donnée de santé.
- Mais un poids, un pouls ou une tension **mesurés dans le temps**, surtout avec l'âge et le sexe, permettent d'inférer un état de santé : ce sont alors des données de santé.
- Les **conclusions tirées** sur la santé d'une personne sont des données de santé, qu'elles soient exactes ou non.
- Les données recueillies par un **questionnaire en ligne visant à donner un conseil de santé** sont des données de santé, quelle que soit la réponse.
Critères récapitulés : données médicales par nature ; données brutes qui, seules ou croisées, permettent de conclure sur l'état de santé ou un risque ; conclusions tirées sur la santé.

#### Application à Charge Utile

| Donnée | Qualification probable | Pourquoi |
|---|---|---|
| Douleur signalée (zone, intensité, « arrête cet exo ») | **Donnée de santé** | Information directe sur l'état physique, et l'appli en tire une conclusion (allègement, conseil kiné). |
| Résultats de tests de mobilité / force (angle mesuré au capteur, max estimé) | **Donnée de santé très probable** | « Test ou examen d'une partie du corps » (considérant 35), suivis dans le temps. |
| Poids | **Donnée de santé si suivi dans le temps ou croisé** (c'est le cas : charges, volume, intervals.icu) | CNIL et G29 citent explicitement le poids croisé. |
| RPE / RIR par série | **Zone grise** ; isolé c'est une donnée d'effort, croisé avec douleurs et charge c'est un indicateur d'état physiologique | Aucune position officielle trouvée sur le RPE en tant que tel. |
| `focus : genoux, chevilles` dans un fichier public | **Risque** : peut révéler une fragilité articulaire d'une personne nommée par son prénom | Voir « à faire tout de suite ». |

#### Conséquences concrètes
1. **Base légale** : pour les données de santé, la seule exception de l'art. 9.2 réaliste pour une appli commerciale est le **consentement explicite** (case à cocher dédiée, non pré-cochée, séparée des CGU, avec une phrase claire : « J'accepte que Charge Utile traite mes douleurs signalées, mon poids et mes résultats de tests pour adapter mes séances »). Pour le reste (compte, paiement), l'exécution du contrat (art. 6.1.b) suffit. Le consentement doit pouvoir être retiré aussi simplement qu'il a été donné. Certitude : élevée.
2. **Registre des traitements (art. 30)** : l'exemption des structures de moins de 250 personnes ne joue pas quand le traitement porte sur des catégories particulières de données ou n'est pas occasionnel. Donc **registre obligatoire**, même en micro-entreprise. La CNIL fournit un modèle simplifié. Certitude : élevée (règle connue ; le texte de l'art. 30.5 n'a pas pu être relu sur EUR-Lex).
3. **AIPD (analyse d'impact)** : la liste CNIL des 14 types de traitements imposant une AIPD ([PDF cnil.fr](https://www.cnil.fr/sites/default/files/atoms/files/liste-traitements-aipd-requise.pdf), lu) vise les données de santé des **établissements de santé**, les entrepôts de données de santé, le profilage, etc. ; elle ne vise pas nommément les applis sportives. Mais les lignes directrices du CEPD, reprises par la CNIL, rendent l'AIPD requise dès que 2 critères sur 9 sont réunis ; ici on coche au moins « données sensibles », « usage innovant » (IA générative, capteurs), et selon le public « personnes vulnérables » (mineurs). **Recommandation : faire une AIPD simple avec l'outil PIA gratuit de la CNIL avant l'ouverture payante.** Certitude : moyenne (obligation discutable à 7 athlètes, quasi certaine à quelques centaines d'utilisateurs).
4. **DPO** : obligatoire si l'activité de base consiste en un traitement **à grande échelle** de données sensibles. La CNIL ne donne aucun seuil chiffré, et cite comme exemple **non** à grande échelle le traitement des données de ses patients par un médecin exerçant seul ([cnil.fr, « grande échelle »](https://www.cnil.fr/en/cnil-direct/question/reglement-europeen-un-traitement-grande-echelle-cest-quoi)). **Pour une micro-entreprise avec quelques dizaines ou centaines d'athlètes : pas de DPO obligatoire**, mais il faut désigner soi-même un contact « vie privée » et documenter ce raisonnement. À réévaluer au-delà de quelques milliers d'utilisateurs actifs. Certitude : moyenne à élevée.
5. **Durée de conservation** : aucun texte ne fixe de durée pour une appli sportive. Règle raisonnable à écrire dans la politique de confidentialité : données d'entraînement conservées pendant l'abonnement, puis suppression ou anonymisation sous 3 mois après la clôture du compte (sauf factures : 10 ans, obligation comptable) ; douleurs détaillées conservées moins longtemps (ex. 12 mois glissants) car c'est la donnée la plus sensible. Certitude : c'est une proposition, pas une règle officielle.
6. **Sous-traitants et transferts hors UE** :
   - **Cloudflare** (Worker, futur hébergement) : société américaine, certifiée au **Data Privacy Framework UE–États-Unis**, avec clauses contractuelles types (CCT 2021/914) en secours dans son DPA ([Cloudflare, DPA et CCT](https://www.cloudflare.com/cloudflare-customer-scc/), vu via la recherche web). Le DPF a été validé par le Tribunal de l'UE le 03/09/2025 (affaire Latombe) ; un **pourvoi est pendant devant la CJUE (C-703/25 P)**, pas de décision attendue avant fin 2026 au plus tôt ([WilmerHale, 01/12/2025](https://www.wilmerhale.com/en/insights/blogs/wilmerhale-privacy-and-cybersecurity-law/20251201-european-court-of-justice-to-review-challenge-to-eu-us-data-privacy-framework), vu via recherche web). Risque juridique réel mais faible à court terme.
   - **Anthropic** (API Claude) : le DPA avec CCT est intégré aux conditions commerciales (sources secondaires seulement, non vérifié sur la page officielle d'Anthropic). Les entrées/sorties de l'API sont **supprimées sous 30 jours** sauf exceptions (violation de la politique d'usage, obligation légale, Files API…) ([privacy.claude.com, mis à jour le 01/07/2026](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data)). **Point clé : il faut éviter d'envoyer à Claude le prénom + les douleurs.** Utiliser le code athlète (pseudonyme) dans les prompts et ne transmettre que ce qui est nécessaire à la génération de séance.
   - **intervals.icu** : opéré par **Intervals.icu Ltd, Londres (Royaume-Uni)** ; données transférées en Allemagne et en Finlande, stockage cloud via Google, Backblaze et Wasabi ; la politique (en vigueur au 11/12/2025) qualifie elle-même le poids et la FC de repos de données de santé / bien-être ([politique de confidentialité](https://intervals.icu/privacy-policy.html), lue). Aucun DPA mentionné. Le Royaume-Uni bénéficie d'une **décision d'adéquation renouvelée le 19/12/2025 jusqu'au 27/12/2031** ([Hunton, vu via recherche web](https://www.hunton.com/privacy-and-information-security-law/european-commission-renews-uk-data-adequacy-decisions)). Qualification juridique : l'athlète a son propre compte intervals.icu ; intervals.icu est alors **responsable de traitement distinct** pour l'athlète, pas sous-traitant de Charge Utile. Mais c'est Charge Utile qui **pousse** les douleurs dans ce compte : il faut donc que l'athlète y consente explicitement (option « envoyer mes douleurs à intervals.icu », désactivable).
   - **GitHub Pages** : à quitter pour la version vendue (usage SaaS commercial interdit, voir `couts.md`), et surtout **ne plus jamais publier de données personnelles dans un dépôt public**.

#### Ce que Nathan doit faire
- **Tout de suite (même en gratuit)** : retirer les prénoms et le champ `focus` santé des fichiers publics, ou passer le dépôt de données en privé. Un plan nominatif « genoux, chevilles » dans un dépôt public GitHub est la faiblesse la plus visible aujourd'hui.
- Avant la vente : politique de confidentialité, écran de consentement explicite santé (séparé), registre (modèle CNIL), AIPD simple (outil PIA), liste des sous-traitants avec leurs DPA, procédure d'exercice des droits (export et suppression en un clic).
- Pseudonymiser tout ce qui part vers Claude.
- **Juriste** : une relecture de la politique de confidentialité et du texte de consentement (quelques centaines d'euros) est raisonnable avant d'ouvrir au public ; indispensable si mineurs (voir ci-dessous) ou si partenariat avec un club / CREPS.

#### Point d'attention : mineurs
Les athlètes actuels ont 18-25 ans. Si la version vendue accepte des moins de 15 ans, le consentement d'un titulaire de l'autorité parentale est requis en France pour les services en ligne (seuil de 15 ans fixé par la loi Informatique et Libertés, art. 45 ; non relu dans cette collecte). **Recommandation : réserver l'appli aux 15 ans et plus au lancement, ou aux 18 ans et plus** pour simplifier.

---

### 2. HDS (hébergement de données de santé) : obligatoire ?

#### Réponse franche
**Non, dans la configuration actuelle et prévue**, tant que Charge Utile reste une appli d'entraînement sportif vendue à des sportifs, hors de toute prise en charge par un professionnel de santé ou un établissement. Certitude : **moyenne à élevée**. Le point de bascule est clair : dès qu'un kiné, un médecin, un CREPS en tant que structure de suivi médical, ou une maison de santé utilise l'appli pour suivre ses patients, l'HDS devient très probablement obligatoire.

#### Le texte
L'**article L.1111-8 du Code de la santé publique** (version en vigueur au 01/07/2025, [Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000049577902), lu) vise « toute personne qui héberge des données de santé à caractère personnel **recueillies à l'occasion d'activités de prévention, de diagnostic, de soins ou de suivi social et médico-social** » pour le compte de ceux qui produisent ou recueillent ces données, ou pour le compte du patient lui-même. L'hébergeur de données numériques doit détenir un **certificat de conformité**. Deux autres points du même article comptent pour Charge Utile :
- **Localisation** : le IV impose que l'hébergement certifié se fasse sur le territoire d'un État membre de l'UE ou de l'EEE.
- **Interdiction de vente** : le VII interdit « tout acte de cession à titre onéreux » de données de santé identifiantes, **même avec l'accord de la personne**, sous peine de sanctions pénales. Donc : **jamais de revente ni de monétisation des données des athlètes**, même anonymisées approximativement. Ce point est valable que l'HDS s'applique ou non.

#### Ce que dit l'ANS (esante.gouv.fr)
**Non vérifié directement** : les pages de FAQ HDS d'esante.gouv.fr sont protégées par un anti-robot (Incapsula) et n'ont rendu aucun contenu à l'outil (tentatives du 01/10/2026). D'après l'extrait renvoyé par la recherche web pour la FAQ ANS « Quels sont les cas n'entrant pas dans l'obligation de certification HDS ? » ([URL](https://esante.gouv.fr/faq/quels-sont-les-cas-n-entrant-pas-dans-l-obligation-de-certification-hds)), les exclusions listées incluent les organismes d'assurance maladie pour la gestion des remboursements, les organismes de recherche dont les bases ne sont pas constituées initialement pour la prévention ou les soins, et **les associations proposant des activités sportives aux personnes handicapées**. Cette dernière exclusion montre que l'ANS ne considère pas l'activité sportive en soi comme une « activité de prévention » au sens de l'article. À confirmer par lecture directe.

#### Raisonnement appliqué
- Le critère de l'HDS n'est **pas** la nature de la donnée (santé ou non) mais le **contexte de recueil** : prévention, diagnostic, soins, suivi médico-social. Une donnée de santé au sens RGPD (section 1) peut parfaitement ne pas relever de l'HDS.
- Charge Utile recueille des RPE et des douleurs dans le cadre d'un **entraînement sportif** encadré par un coach, pas d'une prise en charge sanitaire.
- **Le mot « prévention » est le piège.** Si l'appli se présente comme un outil de « prévention des blessures », elle se rapproche du champ de l'article L.1111-8 et, surtout, de la définition du dispositif médical (section 4). Même logique de vocabulaire des deux côtés : rester sur « préparation physique », « renforcement », « performance ».

#### Ce que Nathan doit faire
- Ne pas payer d'hébergement HDS maintenant (les offres certifiées coûtent sensiblement plus cher qu'un Cloudflare gratuit ou à 5 $/mois).
- Choisir quand même, par prudence, un stockage des données sensibles **dans l'UE** quand ce sera possible sans surcoût (ex. localisation UE des bases Cloudflare D1 si disponible : non vérifié ici), ce qui simplifie aussi le RGPD.
- **Juriste / ANS** : obligatoire avant tout partenariat où un professionnel de santé ou une structure de soins utiliserait Charge Utile pour suivre des patients (kiné qui prescrit des séances dans l'appli, par exemple). À ce moment-là, soit hébergeur HDS, soit ne pas stocker ces données.

---

### 3. Position de la CNIL sur les applis sport, bien-être et objets connectés

#### Réponse franche
**Il n'existe pas de « pack de conformité » CNIL dédié aux applis sportives** (les packs existants visent d'autres secteurs, par exemple la silver économie ; aucun pack sport trouvé). La doctrine applicable tient en quatre documents, dont deux anciens mais jamais remplacés. Tous convergent : **consentement exprès pour les données de santé, suppression à la fermeture ou à l'inactivité du compte, portabilité, sécurité dès la conception.** Certitude : élevée sur le contenu, moyenne sur l'exhaustivité (d'autres fiches ont pu m'échapper).

#### Les documents
1. **« Applications mobiles en santé et protection des données personnelles : les questions à se poser »** ([cnil.fr](https://www.cnil.fr/fr/applications-mobiles-en-sante-et-protection-des-donnees-personnelles-les-questions-se-poser), 17/08/2018, lu). Pour une appli dite « bien-être », la CNIL demande que « l'accord exprès de la personne » soit recueilli pour la collecte de données de santé, et que les données ne soient pas conservées au-delà de la suppression ou de l'inactivité du compte. Elle rappelle le droit à la portabilité (récupérer ses données dans un format structuré et lisible par machine) et renvoie à l'HDS « selon les activités » de l'appli. C'est la fiche la plus directement applicable à Charge Utile.
2. **« Qu'est-ce qu'une donnée de santé ? »** (08/01/2018, voir section 1) : trois catégories, dont le croisement poids + activité.
3. **Questions-réponses sur le sport amateur** ([cnil.fr](https://www.cnil.fr/fr/sport-amateur-hors-contrat/questions-reponses), 04/08/2022, lu). Destinée aux clubs, mais transposable :
   - les statistiques de performance mesurées par objet connecté (distance, vitesse, contact au sol, FC, poids…) peuvent être sensibles ;
   - si l'objet collecte des données de santé, le consentement exprès est obligatoire, et il doit être « libre, spécifique, univoque et éclairé » ;
   - le consentement n'est pas valable s'il crée un **déséquilibre manifeste** entre le sportif et la structure (ex. refus = impossibilité de pratiquer). **Point important pour Charge Utile** : si un club impose l'appli à ses athlètes, le consentement de l'athlète devient fragile ; l'appli doit donc fonctionner (de façon dégradée) sans les données de douleur.
   - conservation des données d'adhérent : 3 ans maximum après la fin de l'adhésion (repère utile pour les comptes inactifs).
4. **Recommandation « applications mobiles »** (adoptée le 18/07/2024, publiée le 24/09/2024, version corrigée le 08/04/2025 ; [cnil.fr](https://www.cnil.fr/fr/recommandations-applications-mobiles), [version modifiée](https://www.cnil.fr/fr/recommandations-applications-mobiles-modifiee), lues). Vise éditeurs, développeurs, fournisseurs de SDK, OS et magasins d'applis : information claire au bon moment, permissions (caméra, micro, capteurs) liées à une finalité, refus aussi simple que l'acceptation, pas de SDK tiers inutile. La CNIL annonçait des **contrôles ciblés à partir du printemps 2025**. La page ne dit pas explicitement si une PWA est couverte ; l'esprit (permissions caméra pour la vidéo de série, capteurs de mouvement pour les tests de mobilité) s'applique de toute façon.

Document de contexte : le Cahier Innovation et prospective n° 2 du LINC (laboratoire de la CNIL) sur le « quantified self » et les capteurs corporels ([PDF](https://www.cnil.fr/sites/cnil/files/typo/document/CNIL_CAHIERS_IP2_WEB.pdf), vu via recherche web seulement, non relu).

#### Traduction pour Charge Utile
| Exigence CNIL | Mise en œuvre concrète |
|---|---|
| Consentement exprès santé | Écran dédié avant la 1re saisie de douleur / poids / test, case non pré-cochée, retrait possible dans les réglages. |
| Suppression à la fermeture / inactivité | Suppression automatique après X mois sans connexion (ex. 24 mois), avec e-mail d'avertissement. |
| Portabilité | Bouton « Exporter mes données » (JSON ou CSV). |
| Permissions | Demander caméra et capteurs **au moment** du test ou de la vidéo, avec une phrase qui dit pourquoi ; rien stocké par défaut côté serveur pour les vidéos. |
| Pas de SDK tiers | Pas d'outil d'analytics publicitaire ; si mesure d'audience, un outil exempté de consentement (configuration CNIL). |
| Déséquilibre club / athlète | Les fonctions santé restent optionnelles. |

#### Juriste ?
Pas nécessaire pour cette partie : les fiches CNIL sont directement applicables. Le service **CNIL « Besoin d'aide »** et les guides pour développeurs suffisent.

---

### 4. Dispositif médical : où est la ligne ?

#### Réponse franche
**Charge Utile, tel qu'il est, n'est pas un dispositif médical : c'est une appli de fitness / préparation physique, catégorie explicitement exclue.** Mais la ligne se franchit **par les mots**, pas par le code : la qualification dépend de la **destination revendiquée** par le fabricant (site, fiche de magasin d'applis, CGU, messages dans l'appli, publicité, posts Instagram). La même fonction (« baisser la charge quand l'athlète signale une douleur au genou ») est hors DM si elle est présentée comme de la gestion d'entraînement, et devient un logiciel DM si elle est présentée comme soulageant ou soignant une pathologie du genou. Certitude : **élevée** sur le principe, **moyenne** sur certains cas limites (tests de mobilité, routines « genou »).

Enjeu : un logiciel DM doit être **marqué CE** (classe I au minimum, classe IIa dès qu'il fournit une information servant à une décision diagnostique ou thérapeutique, ce qui impose un organisme notifié). Hors de portée d'une micro-entreprise.

#### Les textes
- **Règlement (UE) 2017/745 (MDR), art. 2.1** : est un dispositif médical tout logiciel destiné par le fabricant à être utilisé chez l'homme à des fins médicales, notamment le **diagnostic, la prévention, le contrôle, la prédiction, le pronostic, le traitement ou l'atténuation d'une maladie**, ou le **diagnostic, le contrôle, le traitement, l'atténuation ou la compensation d'une blessure ou d'un handicap**. Définition relue dans sa reprise intégrale par le guide MDCG (l'accès direct à EUR-Lex a été bloqué par un anti-robot le 01/10/2026). **Le mot « prévention » vise les maladies ; pour les blessures, ce sont diagnostic, contrôle, traitement, atténuation et compensation.** « Prévenir les blessures » n'est donc pas textuellement dans la définition, mais un régulateur peut le lire comme une finalité médicale : à éviter quand même.
- **Destination (art. 2.12 MDR)** : l'usage auquel le dispositif est destiné d'après les indications du fabricant sur l'étiquetage, la notice, **les documents ou indications promotionnels ou de vente**.
- **Règle 11 (annexe VIII MDR)**, reproduite dans le guide MDCG : logiciel destiné à fournir des informations utilisées pour des décisions diagnostiques ou thérapeutiques = **classe IIa** (IIb ou III selon la gravité) ; logiciel destiné à contrôler des processus physiologiques = IIa ; tout autre logiciel DM = classe I.

#### Le guide MDCG 2019-11 rév. 1 (juin 2025)
[PDF officiel, health.ec.europa.eu](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=md_mdcg_2019_11_guidance_qualification_classification_software_en.pdf), lu intégralement (36 pages). Ce qui compte pour Charge Utile :
- Le logiciel doit avoir **une finalité médicale propre** pour être un DM ; la destination décrite par le fabricant est déterminante.
- Liste explicite des logiciels qui **ne sont pas** des DM : facturation, planning, messagerie… et « **wellness or fitness apps** » (section 3.1).
- Le risque de dommage pour l'utilisateur **n'est pas** un critère de qualification (une appli de muscu peut blesser sans être un DM).
- **Contre-exemple décisif** (section 3.2) : est un logiciel DM celui qui utilise les données d'un patient atteint d'une **pathologie musculosquelettique précise** (radios, **amplitude de mouvement, poids, âge**) et qui vise à **soulager la douleur** liée à cette pathologie en recommandant des **exercices de rééducation personnalisés**. C'est exactement ce que Charge Utile deviendrait avec un module « genou douloureux : ta routine de rééducation ».
- Autre exemple DM : appli qui propose exercices et vidéos choisis selon les réponses du patient pour réduire des symptômes (dépression). Le schéma « questionnaire → exercices personnalisés pour réduire un symptôme » est un marqueur DM.
- La révision 1 ajoute des exemples de logiciels « destinés à prévenir le risque de maladie » en analysant des paramètres physiologiques (ex. placement des vertèbres dorsales) : **classe IIa**. Un « score de risque de blessure » calculé à partir des tests de mobilité se rapprocherait dangereusement de cet exemple.

#### Ce que dit l'ANSM
- Page « Le logiciel ou l'application santé que je vais mettre sur le marché relève-t-il du statut de DM ? » ([ansm.sante.fr](https://ansm.sante.fr/documents/reference/le-logiciel-ou-lapplication-sante-que-je-vais-mettre-sur-le-marche-releve-t-il-du-statut-de-dispositif-medical-dm-ou-de-dispositif-medical-de-diagnostic-in-vitro-dm-div), mise à jour du 06/01/2026, lue) : critères cumulatifs (finalité médicale, résultat propre à un patient, traitement des données qui crée une information médicale nouvelle) ; les applis de bien-être / fitness ne sont pas des DM ; la destination revendiquée dans la documentation et la publicité est déterminante.
- Page d'exemples ([ansm.sante.fr](https://ansm.sante.fr/documents/reference/exemples-de-logiciels-et-applications-mobiles-illustrant-le-positionnement-reglementaire), mise à jour 25/05/2021, lue) : une appli podomètre qui calcule les pas sur plusieurs jours et propose un **programme d'entraînement avec notifications personnalisées** est classée « **pas DM** ». C'est l'analogue le plus proche de Charge Utile.

#### Application aux fonctions de Charge Utile

| Fonction | Statut probable | Condition |
|---|---|---|
| Ajuster la charge au RPE / RIR | **Pas DM** | Autorégulation d'entraînement, pas de finalité médicale. |
| Bouton « Douleur » qui allège et dit « va voir un kiné » | **Pas DM** | Tant que c'est présenté comme une **règle de prudence d'entraînement** (arrêter, alléger, orienter), sans évaluer ni traiter la douleur. |
| Tests de mobilité au capteur | **Pas DM** | Si présentés comme un **repère de progression sportive**, sans seuil « normal / pathologique » ni interprétation clinique. |
| Routines « genoux / chevilles » | **Zone grise** | Pas DM si « renforcement des genoux pour le VTT » ; **DM probable** si « pour ton genou douloureux / après ton entorse / syndrome rotulien ». |
| Onglet Récup (respiration, étirements) | **Pas DM** | Bien-être, sans promesse de soin. |
| Orientation vers un kiné | **Pas DM** | Orienter vers un professionnel n'est pas un acte médical ; c'est même la bonne pratique. |
| « Score de risque de blessure », détection d'asymétrie présentée comme facteur de blessure | **Risque DM (IIa)** | À ne pas construire, ou à formuler comme un indicateur de performance. |
| Nutrition « chiffrée » | **Pas DM** en principe | Tant que ce sont des repères généraux de sportif, pas un régime pour une pathologie. |

#### Formulations à éviter (appli, site, fiches, réseaux sociaux, messages générés par Claude)
- « traiter », « soigner », « guérir », « soulager la douleur », « thérapeutique »
- « rééducation », « rééduquer », « réathlétisation après blessure » (sauf si c'est un kiné qui la mène hors de l'appli)
- « prévenir la blessure de… », « prévention des blessures », « réduire le risque de tendinite / de rupture du LCA »
- « diagnostic », « bilan », « dépister », « détecter une asymétrie à risque », « score de risque de blessure »
- « pour les douleurs au genou », « pour ton syndrome de l'essuie-glace », « après une entorse », tout nom de pathologie
- « protocole » associé à une pathologie, « prescription », « ordonnance d'exercices »
- « remplace une séance de kiné », « validé médicalement » (sans preuve)

#### Formulations sûres
- « renforcement », « préparation physique », « gainage », « stabilité », « proprioception » (au sens sportif), « robustesse »
- « genoux et chevilles solides pour le VTT », « renforcer les zones sollicitées par le trail »
- « repère de progression », « amplitude de mouvement mesurée pour suivre ta progression » (pas « normale / anormale »)
- « si tu ressens une douleur, arrête l'exercice et parles-en à un professionnel de santé » (déjà dans l'appli, à garder)
- « récupération », « retour au calme », « bien-être »
- « charge ajustée à ton ressenti (RPE) »

#### Ce que Nathan doit faire
- Ajouter dans les consignes données à Claude (qui rédige les séances) une **liste de mots interdits** reprenant la liste ci-dessus : c'est Claude qui écrit les `message` et `note` des séances, donc c'est là que le risque de dérapage est le plus fort.
- Rédiger une **destination** en une phrase et la reprendre partout : « Charge Utile est un outil de préparation physique pour sportifs en bonne santé. Il n'est pas un dispositif médical et ne remplace pas l'avis d'un professionnel de santé. »
- Relire la page de vente, la fiche de magasin d'applis et les posts avant publication.
- **Juriste ou consultant réglementaire DM** : seulement si Nathan veut un jour un module « retour de blessure » ou un partenariat avec des kinés qui prescrivent via l'appli. Sinon inutile.

---

### 5. CGU, responsabilité en cas de blessure, assurance, carte professionnelle

#### 5.1 Responsabilité et clauses limitatives face à un consommateur

**Réponse franche** : **on ne peut pas s'exonérer d'une blessure par une clause.** Face à un consommateur, une clause qui supprime ou réduit le droit à réparation en cas de manquement du professionnel est **présumée abusive de façon irréfragable** (« clause noire ») : article **R.212-1, 6° du Code de la consommation** (en vigueur depuis le 01/07/2016, [Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032807196), lu). Elle est réputée non écrite. Le 7° interdit aussi d'empêcher le consommateur de résilier en cas d'inexécution. Certitude : **élevée**.

Ce que les CGU **peuvent** faire utilement (et que les juges regardent) :
- **Définir précisément le service** : outil de planification d'entraînement pour sportifs en bonne santé, pas un suivi médical, pas un encadrement en présentiel.
- **Informer et faire déclarer** : l'utilisateur déclare ne pas avoir de contre-indication connue à la pratique, être invité à consulter un médecin en cas de doute, à arrêter tout exercice douloureux. Cela ne supprime pas la responsabilité, mais peut établir une **faute de la victime** qui réduit l'indemnisation.
- **Consignes de sécurité visibles** dans l'appli au bon moment (avant la pliométrie, les tests de max, la proprio sur surface instable), pas seulement dans les CGU.
- Limiter la responsabilité **entre professionnels** (clubs, coachs clients en B2B) : possible dans une certaine mesure, contrairement au B2C.

**Responsabilité du fait des produits défectueux et logiciels** : l'article 1245-14 du Code civil interdit déjà les clauses écartant ou limitant cette responsabilité ([Légifrance](https://legifrance.gouv.fr/affichCodeArticle.do?cidTexte=LEGITEXT000006070721&idArticle=LEGIARTI000032023655), vu via recherche web). La **directive (UE) 2024/2853** inclut explicitement les **logiciels** (dont SaaS et IA) dans la notion de produit ; elle est à transposer au plus tard le **09/12/2026** et s'applique aux produits mis sur le marché après cette date. Selon les sources consultées via recherche web (cabinets et blogs, ex. [DLA Piper](https://www.dlapiper.com/fr-fr/insights/publications/2024/11/responsabilite-des-produits-defectueux-une-nouvelle-directive-europeenne-pour-sadapter)), aucun texte de transposition français n'était encore publié. Conséquence pour Charge Utile : un défaut de l'algorithme (ex. bug qui double une charge) ayant causé une blessure pourrait engager la **responsabilité sans faute** de l'éditeur. Certitude : moyenne (texte de transposition inconnu). **Mesure concrète : plafonds de progression codés en dur** (jamais plus de +X % de charge d'une série à l'autre, jamais de max réel non encadré), tests automatiques sur l'algorithme d'ajustement, journal des versions.

**Autres obligations de consommation pour un abonnement** (vérifiées sur des pages officielles via recherche web) :
- **Résiliation « en trois clics »** : depuis le 01/06/2023, tout professionnel qui permet de souscrire en ligne doit offrir une fonction gratuite, directe et permanente « résilier votre contrat » dans le site ou l'appli ([communiqué economie.gouv.fr, 01/06/2023](https://presse.economie.gouv.fr/01062023-cp-entree-en-vigueur-de-la-resiliation-en-ligne-des-contrats-en-trois-clics/)).
- **Médiateur de la consommation** : obligatoire pour tout professionnel vendant à des consommateurs depuis le 01/01/2016 ; ses coordonnées doivent figurer sur le site et dans les CGV ([economie.gouv.fr, médiation](https://www.economie.gouv.fr/mediation-conso/vous-etes-un-professionnel/vos-principales-obligations-0)). Coût : adhésion à un médiateur référencé, souvent quelques dizaines d'euros par an pour un petit professionnel (ordre de grandeur **non vérifié**).
- **Droit de rétractation de 14 jours** pour un service en ligne, sauf renonciation expresse si l'exécution commence avant la fin du délai : à prévoir dans le parcours de paiement (règle générale connue, page DGCCRF non relue).
- Mentions légales, CGV, information précontractuelle (prix TTC, durée, reconduction).

#### 5.2 Assurance responsabilité civile professionnelle

| Profil | Obligatoire ? | Ordre de prix public (vérifié le 01/10/2026) |
|---|---|---|
| Éducateur sportif rémunéré (coaching en ligne inclus) | **Oui en pratique** : la réponse ministérielle n° 714 (voir 5.3) liste l'assurance RC parmi les obligations du coach en ligne ; l'art. L.321-7 du Code du sport impose l'assurance à l'exploitant d'un établissement d'APS, pour lui et ses enseignants ([Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006547692), vu via recherche web). | Insify : RC pro coach sportif « dès 11 € par mois », multirisque « dès 30 € par mois », RC jusqu'à 5 M€ par sinistre ([insify.fr](https://www.insify.fr/rc-pro/coach-sportifs/), lu). La page ne dit **rien du coaching en ligne** : à faire préciser par écrit. |
| Éditeur de logiciel / SaaS | **Non obligatoire** légalement, fortement recommandée | Onlynnov : RC pro éditeur de logiciel « à partir de 20 €/mois » ; les conséquences d'une faille de sécurité sont généralement exclues de la RC pro et relèvent d'une assurance cyber ([onlynnov.com](https://onlynnov.com/assurance-par-secteur/editeur-de-logiciel/), lu). |

**Point de vigilance majeur** : les contrats « coach sportif » couvrent des cours en présentiel ; les contrats « éditeur de logiciel » couvrent des pertes financières de clients (bug, retard) et souvent **pas les dommages corporels**. Charge Utile est à cheval : une blessure d'un utilisateur à cause d'une charge proposée par l'appli. **Il faut demander par écrit à l'assureur si le dommage corporel causé par un programme généré par l'appli est couvert**, et en quelle qualité (coach ou éditeur). Budget réaliste : 150 à 500 € par an pour les deux volets (estimation à partir des prix d'appel ci-dessus, à confirmer sur devis).

#### 5.3 Carte professionnelle d'éducateur sportif (art. L.212-1 Code du sport)

**Le texte** ([Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037388193), version en vigueur depuis le 01/01/2019, lu) : seuls peuvent, **contre rémunération**, « enseigner, animer ou encadrer une activité physique ou sportive ou entraîner ses pratiquants », même à titre secondaire ou occasionnel, les titulaires d'un diplôme ou certificat enregistré au RNCP garantissant la sécurité des pratiquants (liste à l'annexe II-1 de l'art. A.212-1). Le II autorise aussi les **personnes en cours de formation** à exercer contre rémunération, dans les conditions prévues par le règlement de leur diplôme. Obligation de **déclaration** (carte professionnelle, renouvelée tous les 5 ans) et d'**honorabilité**.

**Le coaching en ligne est visé** : réponse du ministère des Sports à la question écrite n° 714 de M. Xavier Roseren (question JO 08/10/2024, réponse JO 29/04/2025, [assemblee-nationale.fr](https://www.assemblee-nationale.fr/dyn/17/questions/QANR5L17QE714), PDF lu). Le ministère rappelle que l'article L.212-1 ne distingue pas présentiel et distanciel : un coach en ligne dont l'activité est de l'enseignement, de l'animation ou de l'encadrement est soumis à la qualification, à la déclaration (carte à jour), à l'honorabilité et à l'**assurance RC**. Le ministère indique travailler avec la **DGCCRF** à des contrôles sur les plateformes numériques. Certitude : **élevée**.

**Application à Nathan :**
| Situation | Carte pro requise ? | Certitude |
|---|---|---|
| Coaching **bénévole** de 7 athlètes (aujourd'hui) | **Non** (condition « contre rémunération » absente). L'honorabilité s'applique quand même aux bénévoles selon l'article. | Élevée |
| Coaching **payé** (séances dictées et personnalisées pour un athlète) | **Oui**. Diplôme + déclaration + carte + RC. | Élevée |
| Nathan étudiant L3 STAPS | **Ça dépend du parcours et du public.** D'après une université ([Montpellier, prérogatives](https://entrainement-sportif-staps.edu.umontpellier.fr/la-licence-entrainement-sportif/les-prerogatives/), lu) : le **DEUG STAPS** donne une carte pour l'initiation, l'entretien et le loisir **à l'exclusion de la compétition** ; la **licence Entraînement sportif** permet d'entraîner en compétition **dans la discipline indiquée dans l'annexe descriptive du diplôme**. Ses athlètes sont des compétiteurs régionaux à nationaux : il lui faut donc, en pratique, la **licence ES avec une mention cyclisme / VTT** (ou un BPJEPS, DEJEPS…), ou exercer en tant que stagiaire dans le cadre prévu par sa formation. | Moyenne : prérogatives exactes à vérifier sur l'annexe descriptive de **son** diplôme |
| **Éditeur d'appli** qui vend un logiciel où l'utilisateur (ou son coach) crée ses séances | **Non, a priori** : vendre un outil n'est pas « enseigner, animer, encadrer ». | Moyenne |
| Éditeur qui vend des **programmes personnalisés générés par IA** sans coach qualifié derrière | **Zone grise** : aucun texte ni réponse officielle ne tranche ; la réponse n° 714 montre que l'administration regarde la réalité de l'activité, pas le support. | Faible : à faire valider |

**Sanction** : exercer sans déclaration ou sans qualification est un délit (un an d'emprisonnement et 15 000 € d'amende selon la page de l'université de Montpellier ; article pénal correspondant, L.212-8, **non relu**).

#### Ce que Nathan doit faire
1. Vérifier l'**annexe descriptive** de son diplôme STAPS et demander sa **carte professionnelle** sur le téléservice du ministère dès qu'il est payé pour coacher (même 10 € par mois).
2. Séparer clairement deux offres : **(a)** le logiciel Charge Utile vendu à des coachs ou à des athlètes autonomes ; **(b)** le coaching personnalisé de Nathan, qui exige carte pro + RC coach.
3. CGU / CGV : description du service, déclaration d'aptitude, consignes de sécurité, médiateur, résiliation en ligne, pas de clause d'exonération pour les dommages corporels (inutile et abusive).
4. Assurance : devis écrit couvrant explicitement le **coaching à distance** et le **dommage corporel lié au programme**.
5. **Juriste** : relecture des CGU/CGV avant la vente (c'est la dépense juridique la plus rentable) ; question précise à poser sur l'offre « programme généré par IA sans coach diplômé ».

---

### 6. Micro-entreprise : plafonds, TVA, cotisations, statut étudiant

#### Réponse franche
La micro-entreprise suffit largement pour lancer Charge Utile. **Pas de TVA à facturer tant que le CA reste sous 37 500 €** (la réforme à 25 000 € a été **abandonnée**). Coût social : **21,2 % du CA** si l'activité est classée en prestation commerciale (BIC, cas probable du logiciel par abonnement), **25,6 %** en BNC (cas probable du coaching personnalisé). Certitude : **élevée** sur les chiffres 2026 (pages officielles), **moyenne** sur la qualification BIC/BNC.

#### Les chiffres 2026 (pages officielles lues le 01/10/2026)
| Élément | Valeur 2026 | Source |
|---|---|---|
| Plafond CA micro, prestations de services (BIC) et libéral (BNC) | **83 600 €** | [entreprendre.service-public.gouv.fr F32353](https://entreprendre.service-public.gouv.fr/vosdroits/F32353) |
| Plafond CA micro, vente de marchandises | 203 100 € | idem |
| Sortie du régime | seulement après **2 années consécutives** de dépassement | idem |
| Franchise en base de TVA, services | **37 500 €** (seuil de tolérance 41 250 €) | [F21746](https://entreprendre.service-public.gouv.fr/vosdroits/F21746), vérifiée au 01/01/2026 |
| Franchise TVA, ventes | 85 000 € (tolérance 93 500 €) | idem |
| Réforme « seuil unique 25 000 € » (loi de finances 2025) | **abandonnée** ; seuils 2026 inchangés | idem |
| Cotisations sociales, prestations de services BIC | **21,2 %** du CA (22,9 % avec versement libératoire) | [F36232](https://entreprendre.service-public.gouv.fr/vosdroits/F36232) |
| Cotisations, activité libérale non réglementée (BNC) | **25,6 %** du CA (27,8 % avec versement libératoire) | idem |
| Cotisations, vente | 12,3 % | idem |
| Versement libératoire de l'impôt | 1 % vente, **1,7 % BIC services**, **2,2 % BNC** ; possible si le revenu fiscal de référence est sous un plafond allant d'environ 29 579 € (1 part) à 88 738 € selon la composition du foyer | [F23267](https://entreprendre.service-public.gouv.fr/vosdroits/F23267) |

Note : une recherche web a fait remonter des sites privés affichant d'autres valeurs (ex. 77 700 € / 188 700 €, anciens plafonds 2023-2025 ; 26,1 % en BNC). **Les valeurs ci-dessus sont celles des pages officielles** ; les autres sont périmées ou fausses.

#### ACRE
D'après plusieurs sources secondaires concordantes (non vérifié sur une page officielle, la page URSSAF a refusé la connexion le 01/10/2026) : la loi de financement de la Sécurité sociale pour 2026 (n° 2025-1403 du 30/12/2025) **ramène l'exonération ACRE des micro-entrepreneurs à 25 % des cotisations pour les créations à partir du 01/07/2026** (50 % avant) ; demande à faire dans les **60 jours** suivant le début d'activité ; exonération jusqu'à la fin du 3e trimestre civil suivant la création ([exemple de source secondaire](https://www.legalstart.fr/fiches-pratiques/autoentrepreneur/accre-autoentrepreneur/)). Certitude : moyenne. **À vérifier sur urssaf.fr au moment de la création.** Avec 25 %, l'ACRE ramènerait le taux BIC d'environ 21,2 % à environ 15,9 % la première année : gain modeste sur de petits montants.

#### BIC ou BNC ?
- **Abonnement à un logiciel / SaaS standardisé** (même produit pour tous) : **BIC, prestation de services commerciale** selon la pratique majoritaire relevée dans des guides privés ([Legalplace](https://www.legalplace.fr/guides/bic-bnc-prestation-service/), vu via recherche web). Pas de texte officiel lu qui tranche pour le SaaS. Abattement fiscal forfaitaire en BIC services : 50 % (règle connue, non relue).
- **Coaching personnalisé** (Nathan écrit les séances d'un athlète) : **BNC** (activité libérale), abattement 34 %.
- Si Nathan fait les deux : une seule micro-entreprise peut exercer des activités mixtes, mais il faut **ventiler le CA** entre les deux catégories dans les déclarations, et les plafonds se cumulent selon des règles spécifiques. **À faire confirmer** par l'URSSAF ou un expert-comptable au moment de l'immatriculation (choix du code APE).

#### Cumul avec le statut étudiant
- Un étudiant majeur peut être micro-entrepreneur en parallèle de ses études ([F36612](https://entreprendre.service-public.gouv.fr/vosdroits/F36612), lu). Les cotisations sont dues sur le CA, indépendamment de l'affiliation sécurité sociale étudiante.
- **Point fiscal** : si Nathan est **rattaché au foyer fiscal de ses parents**, le revenu de la micro-entreprise est déclaré sur leur déclaration (même page). Cela peut augmenter leur impôt et, surtout, le **revenu fiscal de référence** sert au calcul de la **bourse sur critères sociaux** et à l'éligibilité au versement libératoire. Si Nathan est boursier, en parler au CROUS avant de facturer.
- La bourse est en principe compatible avec une activité rémunérée tant que l'assiduité aux cours et examens est respectée (service-public, F18291, vu via recherche web).
- **Statut national étudiant-entrepreneur** (via un PEPITE) : permet d'aménager les études et d'être accompagné ; à envisager (page etudiant.gouv.fr vue via recherche web seulement).

#### Clients hors de France : TVA sur les services électroniques (B2C)
- Un abonnement à une appli est un **service fourni par voie électronique**. Pour un client particulier d'un autre pays de l'UE, la TVA est en principe due dans le pays du client, **sauf sous un seuil de 10 000 €** de ventes B2C intra-UE cumulées (année en cours et précédente) : en dessous, les règles françaises s'appliquent, donc la **franchise en base** de Nathan continue de jouer ([BOFiP, critères d'éligibilité OSS](https://bofip.impots.gouv.fr/bofip/13240-PGP.html/identifiant=BOI-TVA-DECLA-20-20-60-10-20211222) et page impots.gouv « Suis-je concerné ? », vues via recherche web).
- Au-delà de 10 000 € : TVA du pays de chaque client, déclarée via le **guichet unique OSS** sur impots.gouv.fr, même si Nathan est en franchise en France. C'est lourd pour une micro-entreprise.
- **Solution pratique** : vendre via un **« merchant of record »** (Paddle, Lemon Squeezy…) ou via l'App Store / Google Play, qui collectent et reversent la TVA eux-mêmes ; Nathan facture alors une seule entreprise (B2B). Coût : commission plus élevée (non vérifié ici, voir les pages de prix concernées).
- Le coaching personnalisé par Nathan (intervention humaine) n'est **pas** un service électronique au sens TVA : règles différentes.

#### Ce que Nathan doit faire
1. Immatriculer la micro-entreprise **avant le premier euro encaissé** (guichet unique de l'INPI, gratuit), demander l'ACRE dans les 60 jours.
2. Choisir l'activité principale (logiciel = BIC services) et vérifier avec l'URSSAF le traitement d'un coaching BNC en activité secondaire.
3. Opter ou non pour le versement libératoire (avantageux si le foyer est peu imposé ; vérifier le plafond de revenu).
4. Rester sous 37 500 € de CA pour ne pas facturer de TVA ; surveiller le seuil de 10 000 € de ventes B2C dans les autres pays de l'UE ou passer par un merchant of record.
5. Ouvrir un compte bancaire dédié (obligatoire au-delà de 10 000 € de CA deux années de suite : règle connue, non relue ici).
6. **Expert-comptable** : une consultation ponctuelle (souvent proposée gratuitement par les CCI ou les réseaux d'accompagnement) suffit au début.

---

### 7. Sécurité et comptes utilisateurs

#### Réponse franche
Le RGPD (art. 32) n'impose pas de liste technique : il impose une sécurité **adaptée au risque**, et avec des données de santé le risque est élevé. Les références françaises pratiques sont la **recommandation CNIL « mots de passe »** (2022) et le **guide CNIL de la sécurité des données personnelles** (édition 2024). Une fuite de données de santé doit être notifiée à la CNIL sous 72 h et, vu la sensibilité, probablement aux personnes concernées (art. 33 et 34 RGPD, règles connues, non relues sur EUR-Lex). Certitude : élevée.

#### Recommandation CNIL « mots de passe »
Délibération n° 2022-100 du 21/07/2022, publiée en octobre 2022 ([cnil.fr](https://www.cnil.fr/fr/mots-de-passe-recommandations-pour-maitriser-sa-securite), lu ; [délibération PDF](https://www.cnil.fr/sites/default/files/atoms/files/deliberation-2022-100-du-21-juillet-2022_recommandation-aux-mots-de-passe.pdf), vu via recherche web). Trois cas :
1. **Mot de passe seul** : entropie d'au moins **80 bits** (exemple CNIL : 12 caractères mêlant majuscules, minuscules, chiffres et caractères spéciaux).
2. **Mot de passe + restriction d'accès** (blocage temporaire après des échecs, délai croissant, CAPTCHA) : **50 bits** suffisent. Cas typique d'un service en ligne grand public : **c'est le cas à viser pour Charge Utile**.
3. **Mot de passe + dispositif matériel** (carte, téléphone) : 13 bits (code PIN), blocage après 3 échecs.
- Stockage : **jamais en clair** ; fonction de hachage lente avec sel (scrypt, Argon2…).
- Plus de renouvellement périodique imposé pour les comptes ordinaires.

**Plus simple et plus sûr pour une petite équipe : ne pas gérer de mots de passe du tout.** Lien magique par e-mail, passkeys (WebAuthn), ou connexion via un fournisseur d'identité. Moins de surface d'attaque, pas de base de hachés à protéger.

#### Guide CNIL de la sécurité (édition 2024)
Publié le 26/03/2024 ([cnil.fr](https://www.cnil.fr/fr/guide-de-la-securite-des-donnees-personnelles-nouvelle-edition-2024), lu), 25 fiches, dont des fiches nouvelles sur les **applis mobiles, le cloud, les API et l'IA**. Fiche « Sauvegarder » (contenu renvoyé par recherche web, [cnil.fr](https://www.cnil.fr/fr/securite-sauvegarder)) : sauvegardes fréquentes, au moins une copie sur un site géographiquement distinct, au moins une copie **hors ligne**, sauvegardes chiffrées et protégées comme la production, **tests de restauration réguliers**, règle « 3-2-1 » (3 copies, 2 supports, 1 hors ligne).

#### Constats sur l'architecture actuelle (lecture du dépôt, 01/10/2026)
**Deux défauts de sécurité ont été relevés dans le site et le relais actuels** (accès aux plans des athlètes ; intégrité des écritures vers intervals.icu). Les détails sont volontairement **hors du dépôt public** : voir `recherche/_prive/securite-relais.md` sur le Mac de Nathan.
3. La vue coach est protégée par un PIN comparé à temps constant (bon point) ; aucun mécanisme de limitation des essais n'a été repéré lors de cette lecture rapide (à vérifier) : un PIN court sans limitation ne respecte pas le cas n° 2 de la CNIL.
4. La **clé API de coach intervals.icu** dans le Worker donne accès en lecture et écriture à tous les athlètes coachés (constat déjà fait dans `intervals.md`) : c'est le secret le plus sensible du système.

#### Minimum à mettre en place avant de vendre
| Mesure | Pourquoi |
|---|---|
| Limitation des tentatives sur le PIN coach et sur toute connexion (Cloudflare propose des règles de limitation de débit) | Cas n° 2 de la CNIL. |
| HTTPS partout (déjà le cas), en-têtes de sécurité (CSP) | Base. |
| Chiffrement des données de santé au repos, séparation des secrets (clés API en variables secrètes du Worker, déjà le cas pour `ICU_KEY`) | Art. 32. |
| Journal des accès aux données sensibles, sans y écrire les données elles-mêmes | Détection et preuve. |
| Sauvegarde quotidienne chiffrée de la base vers un second fournisseur + test de restauration trimestriel | Fiche CNIL « Sauvegarder ». |
| Procédure écrite de violation de données (qui fait quoi en 72 h) | Art. 33-34. |
| Mises à jour et revue des dépendances | Base. |

#### Juriste ?
Non. Un **audit de sécurité léger** par un pair développeur ou un étudiant en cybersécurité est plus utile qu'un juriste ici. L'ANSSI et la CNIL publient gratuitement tout le nécessaire.

---

### 8. PWA ou App Store / Play Store en 2026 ?

#### Réponse franche
**Rester en PWA pour lancer et vendre, sans appli native, au moins pendant la première année.** Les limites iOS qui comptaient (notifications, effacement des données) sont levées **à condition que l'appli soit ajoutée à l'écran d'accueil**, ce qui est déjà le parcours de Charge Utile (lien personnel ouvert puis installé). Le passage en magasin d'applis se justifie plus tard, pour la **découverte** (recherche dans l'App Store) et la **confiance**, pas pour des raisons techniques. Certitude : **moyenne à élevée** (techniquement vérifié ; l'effet sur les ventes est une hypothèse).

#### Limites iOS actuelles (vérifiées sur webkit.org)
- **Notifications Web Push** : disponibles depuis **iOS / iPadOS 16.4** (bêta annoncée le 16/02/2023), **uniquement pour les web apps ajoutées à l'écran d'accueil**, après un geste de l'utilisateur (bouton « s'abonner »). Pas besoin d'adhérer au programme développeur Apple. L'API de pastille (badge) est aussi disponible ([webkit.org, Web Push for Web Apps on iOS and iPadOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/), lu).
- **Effacement après 7 jours** : depuis mars 2020, Safari efface le stockage écrit par script (localStorage, IndexedDB, service worker) d'un site **après 7 jours d'utilisation de Safari sans interaction avec ce site**. Les **web apps ajoutées à l'écran d'accueil ne sont pas concernées** : elles ont leur propre compteur, qui avance seulement quand on les utilise ; WebKit qualifie l'effacement de données propres d'une telle appli de bogue grave ([webkit.org, 24/03/2020](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/), lu). **Conséquence pour Charge Utile** : un athlète qui utilise le lien dans Safari sans l'installer peut perdre son historique local (charges, RPE) s'il ne s'en sert pas pendant une semaine d'usage de Safari. L'appli stocke aujourd'hui l'état dans `localStorage` (`docs/js/app.js`, l. 32-34) : **il faut pousser l'installation à l'écran d'accueil** et, pour la version vendue, sauvegarder côté serveur.
- **Quotas de stockage** (Safari 17 et plus) : jusqu'à 60 % du disque par origine dans un navigateur, 15 % dans les autres applis ; une web app de l'écran d'accueil a les mêmes quotas. `navigator.storage.persist()` est accordé selon des heuristiques, notamment si le site est ouvert comme web app de l'écran d'accueil ([webkit.org, Updates to Storage Policy](https://webkit.org/blog/14403/updates-to-storage-policy/), lu ; date de l'article non relevée, Safari 17 = 2023).
- **Installation** : sur iOS, pas d'invite d'installation automatique ; l'utilisateur doit passer par le menu Partager > « Sur l'écran d'accueil ». Il faut un petit tutoriel illustré dans l'appli (règle d'usage connue, non relue sur une page Apple).

#### Situation dans l'UE (DMA)
- En février 2024, Apple avait annoncé la suppression des web apps de l'écran d'accueil dans l'UE avec iOS 17.4 (justification : obligations du DMA sur les moteurs de navigateur alternatifs), puis a **fait marche arrière le 01/03/2024** : les web apps de l'écran d'accueil restent disponibles dans l'UE, construites sur WebKit ([The Register, 02/03/2024](https://www.theregister.com/software/2024/03/02/apple-reverses-decision-to-remove-home-screen-web-apps-in-eu/307995), [MacRumors, 01/03/2024](https://www.macrumors.com/2024/03/01/apple-walks-back-decision-to-disable-eu-web-apps/), vus via recherche web ; la page Apple d'origine n'a pas été relue). Aucune information trouvée sur une nouvelle restriction depuis.
- Conditions commerciales Apple dans l'UE : page « DMA and apps in the EU » ([developer.apple.com](https://developer.apple.com/support/dma-and-apps-in-the-eu/), lue le 01/10/2026) qui annonce des **conditions unifiées en vigueur au 01/10/2026** : commission sur achat intégré 26 % (standard) ou **15 %** (Small Business Program, et abonnements après la 1re année) ; paiement alternatif dans l'appli 20 % / 10 % ; **offres hors appli** (lien vers un site) possibles, avec 15 % / 10 % sur les ventes faites dans les 7 jours suivant le clic ; Core Technology Commission de 5 % pour la distribution hors App Store. **À relire attentivement** : ces conditions venaient d'entrer en vigueur et le résumé a été produit par l'outil de lecture ; les montants exacts sont à recontrôler avant décision.

#### Coûts et commissions (pages officielles lues le 01/10/2026)
| Poste | Apple | Google |
|---|---|---|
| Inscription | **99 $ par an** ([Apple Developer Program](https://developer.apple.com/programs/how-it-works/)) ; dispense possible pour certaines structures | **25 $ une fois** ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en), vu via recherche web) |
| Commission petite entreprise | **15 %** sous 1 M$ de produit annuel (Small Business Program, adhésion effective 15 jours après acceptation) ; 10 % dans l'UE sur conditions alternatives pour les abonnements après la 1re année ([page Small Business Program](https://developer.apple.com/app-store/small-business-program/)) | **Abonnements : 10 % + 5 % de frais de facturation** ; nouveaux barèmes déployés dans l'EEE, au Royaume-Uni et aux États-Unis à partir du **30/06/2026** ([Play Console Help, frais de service](https://support.google.com/googleplay/android-developer/answer/112622), lu) |
| Contraintes d'entrée | Règle 4.2 : une appli ne doit pas être un simple site « reconditionné » ; règle 3.1.1 : abonnement numérique = achat intégré (sauf exceptions UE / liens externes) ; règle 5.1.1 (ix) : les services dans des domaines très réglementés (dont la **santé**) doivent être soumis par une **personne morale**, pas un développeur individuel ([App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/), lu) | Comptes personnels créés après le 13/11/2023 : **test fermé avec au moins 12 testeurs pendant 14 jours** avant la mise en production (vu via recherche web, [Play Console Help](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)) |

Point d'attention Apple : la règle 1.4.1 impose de justifier toute mesure de santé et de rappeler de consulter un médecin pour les applis médicales. Les **tests de mobilité au capteur** devront être présentés comme des repères sportifs, sans prétention de mesure clinique, sinon risque de refus. La règle 5.1.1 (ix) peut poser problème si Apple classe l'appli comme « santé » : un micro-entrepreneur est une personne physique (point **non vérifié** : la pratique d'Apple pour les applis de fitness tenues par des entrepreneurs individuels n'a pas été trouvée).

#### Avantages / inconvénients
| | PWA seule | Appli en magasin (native ou PWA emballée) |
|---|---|---|
| Coût | ~0 € | 99 $/an + 25 $ + temps de revue |
| Commission | 0 % (hors frais de paiement Stripe etc.) | 15 % (ou 10 % + 5 %) si paiement via le magasin |
| Mises à jour | instantanées (déjà le cas avec GitHub Pages) | revue Apple à chaque version native |
| Découverte | nulle hors bouche-à-oreille et réseaux | recherche App Store / Play |
| Confiance perçue | plus faible (« c'est un site ? ») | plus forte |
| Capteurs, caméra, hors-ligne | suffisants pour l'usage actuel | accès complet (HealthKit, Apple Watch, notifications fiables) |
| TVA européenne | à gérer soi-même (ou merchant of record) | gérée par Apple / Google |

#### Recommandation : faut-il une appli native, et quand ?
1. **Maintenant → premiers 100 abonnés payants** : PWA, paiement web (Stripe ou merchant of record), tutoriel « ajouter à l'écran d'accueil » obligatoire au premier lancement, sauvegarde serveur de l'historique.
2. **Signal pour passer en magasin** : (a) une part importante des ventes perdues parce que « pas sur l'App Store », (b) besoin d'**intégrations santé natives** (HealthKit, Apple Watch, Garmin via Health Connect) que le web ne permet pas, (c) des notifications Web Push qui ne suffisent plus.
3. **Première étape magasin peu coûteuse** : emballer la PWA (Trusted Web Activity pour Google Play ; Capacitor ou équivalent pour iOS) plutôt que réécrire en natif, en ajoutant assez de fonctions natives pour passer la règle 4.2 d'Apple.
4. Avant de soumettre à Apple : avoir une **structure juridique** claire (micro-entreprise au minimum) et vérifier la règle 5.1.1 (ix).

5. **Juriste ?** Non pour ce choix technique. Relire seulement les conditions Apple / Google (contrat « Paid Apps ») avant de signer, en particulier les clauses UE en vigueur au 01/10/2026.

---

### 9. Droits : animations 3D, liens vidéo, contenu généré par IA

#### 9.1 Mannequin MakeHuman : maillage CC0, squelette AGPL

**Réponse franche** : **le maillage est sans risque ; le squelette est le seul vrai problème de licence du projet, et Nathan l'a déjà identifié** (`README.md` l. 63 et `CONTEXTE-charge-utile.md` l. 82 : « à refaire avant toute vente »). Pour une vente, **il faut le remplacer** par un squelette fait maison (ou issu d'une source CC0 / licence permissive), ou démontrer qu'il provient d'un export officiel couvert par l'exception CC0. Certitude : **moyenne** (le site de licence MakeHuman était injoignable le 01/10/2026 ; voir ci-dessous).

Ce qui a été vérifié :
- **Règles MakeHuman** : le code source et les données de MakeHuman sont sous **AGPL 3** ; une **exception CC0** couvre les **modèles exportés** via la fonction d'export d'une version **officielle et non modifiée** de MakeHuman. Cette exception ne s'applique pas si on utilise MakeHuman comme bibliothèque, en mode serveur, avec des modifications de code ou un plugin tiers (extrait de la page « License explanation » de makehumancommunity.org renvoyé par la recherche web ; la page elle-même a refusé la connexion lors de deux tentatives). La FAQ officielle « Can I sell models created with MakeHuman? » ([static.makehumancommunity.org](https://static.makehumancommunity.org/oldsite/faq/can_i_sell_models_created_with_makehuman.html), lue) confirme que les modèles exportés sont **CC0** et utilisables commercialement, y compris dans des jeux commerciaux fermés, sans attribution ; elle ne détaille pas le cas du squelette.
- **AGPL 3, article 13** ([gnu.org](https://www.gnu.org/licenses/agpl-3.0.html), lu) : quiconque **modifie** le programme et le propose à des utilisateurs à travers un réseau doit leur offrir gratuitement le **code source correspondant** de sa version. L'article 13 ne vise que les versions modifiées.

Conséquences pour une vente en SaaS / PWA :
1. Une PWA **envoie** le JavaScript et les données au navigateur de l'utilisateur : ce n'est pas seulement une « interaction à distance », c'est une **distribution** du code. Si les coordonnées du squelette (`docs/js/body.js`, objet `joints`) sont reprises d'un fichier AGPL et intégrées au moteur, le risque est que l'ensemble moteur + squelette soit considéré comme une œuvre dérivée, à distribuer **sous AGPL avec son code source**. Pour un dépôt déjà public, l'obligation de publier le code est presque remplie ; le vrai problème serait l'**interdiction de fermer le code** ou d'y ajouter des restrictions (licence propriétaire, CGU interdisant la copie).
2. Des coordonnées d'articulations sont des données factuelles peu originales : leur protection par le droit d'auteur est **discutable**. Mais miser là-dessus n'a pas de sens quand le remplacement est peu coûteux.
3. **Action** : recalculer les positions des articulations à partir du maillage CC0 (placement manuel ou script maison), noter la provenance dans un fichier `LICENCES.md` (maillage : MakeHuman CC0 ; squelette : création originale ; Three.js : licence MIT, non vérifiée ici), et garder une trace datée (commit) du remplacement.
4. Les **animations faites à la main** par Nathan (`docs/moves/*.js`) sont sa création : elles lui appartiennent et sont protégeables, sous réserve de les publier sous une licence choisie. **Le dépôt est public sans licence explicite repérée** : par défaut, tous droits réservés, mais n'importe qui peut lire et s'inspirer ; si Nathan veut vendre, il doit décider s'il garde le dépôt public.

#### 9.2 Liens vers des vidéos externes (YouTube, fitnessprogramer)

**Réponse franche** : **le lien simple qu'utilise l'appli aujourd'hui est la solution la plus sûre ; l'intégration via le lecteur YouTube officiel est aussi admise ; télécharger ou réhéberger les vidéos ou GIF ne l'est pas.** Certitude : élevée pour le lien simple, moyenne pour l'intégration dans une appli payante.

- **État actuel** : le bouton « Voir en vrai » ouvre dans un nouvel onglet soit une page de fitnessprogramer.com (correspondances dans `tools/liens_fitnessprogramer.json`, relevées dans les sitemaps du site), soit une **recherche YouTube** (`docs/js/app.js` l. 593). Aucune vidéo n'est intégrée ni copiée.
- **Jurisprudence UE** (vue via recherche web, arrêts non relus sur curia / EUR-Lex qui bloquaient l'outil) : *Svensson* (C-466/12, 2014) : un lien vers une œuvre **librement accessible** sur un autre site, avec l'accord du titulaire, n'est pas une communication à un public nouveau ; *BestWater* (C-348/13, ordonnance du 21/10/2014, [Legalis](https://www.legalis.net/jurisprudences/cour-de-justice-de-lunion-europeenne-9eme-chambre-arret-du-21-octobre-2014/)) : même solution pour l'**intégration (« framing »)** d'une vidéo déjà librement et licitement accessible. Nuance importante connue mais **non relue ici** : l'arrêt *GS Media* (C-160/15, 2016) présume que celui qui met un lien **dans un but lucratif** vers un contenu **publié illégalement** savait que c'était illégal. Pour une appli payante, il faut donc lier uniquement vers des sources officielles (chaînes des auteurs, sites éditeurs), pas vers des copies piratées.
- **YouTube** : les conditions d'utilisation (version du 09/01/2026, [youtube.com/t/terms](https://www.youtube.com/t/terms), lues) autorisent la diffusion des vidéos **par le lecteur intégré YouTube** ; elles interdisent l'usage non personnel ou commercial du contenu par d'autres moyens et la vente de publicité sur des pages dont le contenu YouTube est la valeur principale ou unique. Pour Charge Utile, l'intégration via le lecteur officiel reste possible tant que la vidéo est un complément et non le produit vendu.
- **fitnessprogramer.com** : la page lue indique que tous les contenus sont protégés et exclusifs au site ; les conditions générales détaillées n'ont pas été lues (lien présent mais non ouvert). **Ne jamais intégrer (hotlink) ni copier leurs GIF dans l'appli** ; le lien simple vers leur page reste la pratique la moins risquée.
- **Recommandation** : garder le lien simple ; à terme, remplacer par des vidéos tournées par Nathan (il est vidéaste : c'est un avantage concurrentiel et la fin du risque).

#### 9.3 Contenu généré par IA (séances, messages, conseils)

**Réponse franche** : deux sujets distincts. (a) **Responsabilité** : ce que Claude écrit dans une séance engage Nathan comme s'il l'avait écrit ; c'est l'argument le plus fort pour garder la relecture humaine. (b) **Propriété** : un texte produit sans apport créatif humain est mal protégé par le droit d'auteur français (qui exige une création portant l'empreinte de la personnalité de l'auteur : principe connu, **non relu** dans cette collecte) ; ce n'est pas grave pour des séances, qui ont peu de valeur en tant que textes.

- **Règlement européen sur l'IA, article 50** (FAQ de la Commission, [digital-strategy.ec.europa.eu](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act), lue) : applicable depuis le **02/08/2026**. Une entreprise qui construit une appli sur l'API d'un modèle tiers est en général **fournisseur** du système d'IA qui en résulte. Obligations : informer les personnes qu'elles **interagissent avec une IA** (sauf si c'est évident) pour les systèmes conçus pour échanger directement avec elles ; marquage lisible par machine des contenus générés (délai jusqu'au 02/12/2026 pour les systèmes déjà sur le marché avant le 02/08/2026) ; étiquetage des textes d'intérêt public publiés sans relecture humaine. Sanctions jusqu'à 15 M€ ou 3 % du CA mondial.
- **Application à Charge Utile** :
  - Aujourd'hui, l'athlète ne parle pas à l'IA : c'est le coach qui dicte, et Claude écrit un JSON que Nathan publie. Une séance relue par le coach n'est pas un texte « d'intérêt public » : **obligation probablement faible**.
  - Si la version vendue laisse l'athlète **dialoguer** avec un assistant ou génère des séances **sans relecture humaine**, il faut afficher clairement « séance générée par IA » / « assistant IA », et prévoir un marquage technique (métadonnée dans le JSON de séance, ex. `"genere_par": "IA"`). Coût quasi nul, à faire par défaut.
  - Garder un **contrôle humain** ou des **garde-fous codés** (plafonds de charge, liste de mots interdits de la section 4, exclusion des exercices à risque selon les douleurs signalées) entre la sortie de Claude et l'athlète.
- **Conditions d'Anthropic** : les conditions commerciales de l'API (propriété des sorties, interdictions d'usage, usage dans des contextes médicaux) **n'ont pas été relues** ; seule la page de conservation des données l'a été (section 1). À lire avant la vente, en particulier la politique d'usage sur les conseils de santé.

#### Ce que Nathan doit faire
1. Remplacer le squelette AGPL avant toute vente ; créer un fichier de provenance des licences.
2. Choisir une licence (ou passer en privé) pour le dépôt.
3. Garder les liens simples vers des sources officielles ; tourner ses propres vidéos à moyen terme.
4. Mention « généré avec l'aide d'une IA, relu par ton coach » sur les séances ; marquage dans le JSON.
5. **Juriste** : utile seulement si Nathan veut **fermer le code** et que le doute AGPL persiste, ou s'il lance un assistant IA conversationnel en santé/sport.

---

### 10. Marque « Charge Utile »

#### Réponse franche
**Je n'ai pas pu interroger les bases de marques** : data.inpi.fr renvoie une erreur 403 (protection anti-robot) à l'outil comme à une requête directe, et TMview / eSearch de l'EUIPO sont des applications JavaScript qui ne renvoient aucun contenu exploitable (tentatives du 01/10/2026). **La disponibilité de « Charge Utile » en classes 9, 41, 42 et 44 n'est donc PAS vérifiée.** Nathan doit faire la recherche lui-même (10 minutes, gratuit, procédure ci-dessous) avant tout investissement dans le nom.

Ce que la recherche web a permis d'établir :
- **Un magazine « Charge Utile »** existe depuis **1992**, consacré à l'histoire des camions de collection et véhicules utilitaires anciens, vendu en kiosque et par abonnement ([UNI-Presse](https://www.uni-presse.fr/abonnement/charge-utile/), lu). Il est probable que son éditeur ait une marque déposée, au moins en classe 16 (imprimés), peut-être en 41 (publication de revues) et 9 (publications électroniques). **À vérifier en priorité.** Le risque de confusion avec une appli de musculation est **faible** (produits et services différents, public différent), mais une opposition reste possible si la marque antérieure couvre largement les classes 9 et 41.
- **Aucune appli, logiciel ou service de coaching sportif nommé « Charge Utile »** n'est apparu dans les recherches web (recherche « charge utile » + application / logiciel / coaching musculation). Ce n'est pas une preuve d'absence de marque déposée.

#### Distinctivité : « charge utile » est-il un terme générique ?
- En français courant, la **charge utile** est la masse transportable par un véhicule (camion, avion, fusée : en anglais *payload*). C'est un terme **descriptif dans les transports et l'aérospatial**, pas dans le sport.
- En musculation, « charge » désigne le poids soulevé : « Charge Utile » **évoque** la charge d'entraînement « utile », juste ce qu'il faut. C'est un **jeu de mots évocateur**, généralement enregistrable, et non un terme purement descriptif des services (comme « Coaching Musculation » le serait). Certitude : moyenne ; l'examinateur de l'INPI peut toujours soulever un défaut de distinctivité en classe 41 si le libellé vise « programmes d'entraînement de charge ».
- **Faiblesse pratique** : une marque formée de mots courants est une **marque faible**. Elle protège contre la reprise à l'identique (« Charge Utile Coach »), beaucoup moins contre des noms proches (« La Bonne Charge », « Charge Juste »). Et le référencement sur « charge utile » sera dominé par la définition du dictionnaire et le magazine.
- Option pour renforcer : déposer une **marque semi-figurative** (nom + logo) en plus ou à la place de la marque verbale, ou ajouter un élément distinctif.

#### Classes utiles (classification de Nice)
| Classe | Contenu à viser |
|---|---|
| **9** | logiciels et applications mobiles téléchargeables d'entraînement physique |
| **41** | coaching sportif, services d'entraînement physique, mise à disposition de programmes d'entraînement en ligne non téléchargeables, formation |
| **42** | logiciel-service (SaaS), plateforme en ligne |
| **44** | **à éviter** : c'est la classe des services médicaux, de kinésithérapie et de santé. Y déposer contredirait le positionnement « pas un dispositif médical » de la section 4. |

Recommandation : **classes 9, 41 et 42**.

#### Coûts (vérifiés le 01/10/2026)
- **INPI (France)** : dépôt électronique **190 € pour une classe**, **40 € par classe supplémentaire** ([inpi.fr, « Le déposant et le coût d'une marque »](https://www.inpi.fr/realiser-demarches/propriete-intellectuelle/deposant-et-cout-dune-marque), page mise à jour le 05/12/2024 ; montants confirmés par la grille « Tarifs applicables au 2 juillet 2026 » vue via recherche web, [PDF INPI](https://www.inpi.fr/inpi-block/download-document?id=20516)). **Pour les classes 9, 41, 42 : 190 + 40 + 40 = 270 €.** Protection 10 ans renouvelable (règle connue, non relue sur cette page).
- **EUIPO (marque de l'UE)** : **850 €** pour une classe en ligne, **50 €** pour la 2e, **150 €** par classe à partir de la 3e, soit **1 050 €** pour 3 classes ; validité 10 ans renouvelable (extrait de la page EUIPO « Fees and payments » renvoyé par recherche web, [euipo.europa.eu](https://www.euipo.europa.eu/en/trade-marks/before-applying/fees-payments) ; la page de détail a renvoyé 403). Inutile au lancement pour un produit vendu en France.
- Recherche d'antériorité par l'INPI (similarités orthographiques, phonétiques, intellectuelles par des experts) : proposée, **prix non affiché** sur la page lue ([inpi.fr, base marques](https://www.inpi.fr/ressources/propriete-intellectuelle/rechercher-une-marque-base-marques)).

#### Procédure pour Nathan
1. **Recherche gratuite** sur [data.inpi.fr](https://data.inpi.fr) (la base couvre les marques françaises depuis 1976, les marques de l'UE et les marques internationales visant la France) : chercher « charge utile », « chargeutile », « charge-utile », puis regarder les classes 9, 41, 42 de chaque résultat et leur statut (en vigueur / expirée).
2. Même recherche sur **TMview** (tmdn.org) pour les marques de l'UE et des autres pays.
3. Vérifier aussi : nom de domaine (chargeutile.fr / .app), comptes Instagram / YouTube, dénominations sociales (annuaire des entreprises).
4. Si rien de bloquant : dépôt en ligne sur le portail INPI en classes 9, 41, 42 (**270 €**), libellés rédigés précisément (pas de termes médicaux).
5. Publication au BOPI puis **délai d'opposition de 2 mois** pour les titulaires de marques antérieures (règle connue, non relue sur la page INPI) ; enregistrement en l'absence d'opposition.
6. **Conseil en propriété industrielle** : recommandé **si** la recherche fait apparaître la marque du magazine ou une marque proche dans les classes 9 ou 41 (une consultation coûte généralement quelques centaines d'euros : ordre de grandeur non vérifié). Sinon, le dépôt direct est à la portée de Nathan.

**Quand déposer ?** Avant de dépenser de l'argent en logo, nom de domaine, communication ou fiche App Store, et **avant** la première annonce publique de la version payante : en France, le premier qui dépose est en principe le titulaire.

---

### Synthèse : ce qu'il faut faire, dans l'ordre

| Priorité | Action | Coût | Quand |
|---|---|---|---|
| 1 | Corriger les deux défauts de sécurité du site et du relais (détails hors dépôt : `recherche/_prive/securite-relais.md`) | 0 € | Tout de suite (même en gratuit) |
| 2 | Vérifier la marque sur data.inpi.fr et TMview, puis déposer en classes 9, 41, 42 | 270 € | Avant toute communication sur la version payante |
| 3 | Micro-entreprise (BIC services), ACRE dans les 60 jours | 0 € (+ cotisations 21,2 % du CA) | Avant le 1er euro |
| 4 | Carte pro d'éducateur sportif si Nathan coache contre rémunération ; vérifier les prérogatives de son diplôme | 0 € | Avant le 1er coaching payé |
| 5 | Remplacer le squelette AGPL ; fichier de licences | temps | Avant la vente |
| 6 | Politique de confidentialité, consentement explicite santé, registre, AIPD simple, liste des sous-traitants, pseudonymisation vers Claude | temps (+ relecture juriste conseillée) | Avant la vente |
| 7 | CGU/CGV (destination non médicale, sécurité, médiateur, résiliation en ligne) ; liste de mots interdits dans les consignes de Claude | temps + relecture juriste | Avant la vente |
| 8 | Assurance RC (coach + éditeur), devis écrit couvrant dommage corporel et coaching à distance | ~150-500 €/an (estimation) | Avant la vente |
| 9 | Quitter GitHub Pages pour l'hébergement commercial ; sauvegardes 3-2-1 | 0-5 $/mois | Avant la vente |
| 10 | App Store / Play | 99 $/an + 25 $ | Plus tard, sur signal de marché |

Budget juridique raisonnable avant ouverture : relecture CGU/CGV + politique de confidentialité par un avocat ou une legaltech (ordre de grandeur de quelques centaines d'euros, **non vérifié**), plus 270 € de marque et l'assurance.

## Sources

Liens directs dans le texte. Pages officielles enregistrées dans `sources.json` : [@cnil-donnee-sante] [@cnil-rgpd-chapitre1] [@privacy-regulation-considerant35] [@g29-annexe-applis-sante-2015] [@cnil-liste-aipd] [@cnil-grande-echelle] [@intervals-politique-confidentialite] [@intervals-forum-allemagne] [@anthropic-conservation-api] [@cloudflare-dpa-cct] [@wilmerhale-dpf-cjue] [@hunton-adequation-uk] [@legifrance-csp-l1111-8] [@cnil-applis-sante-questions] [@cnil-sport-amateur] [@cnil-reco-applis-mobiles] [@cnil-reco-applis-mobiles-modifiee] [@mdcg-2019-11-rev1] [@ansm-qualification-logiciel] [@ansm-exemples-logiciels] [@legifrance-conso-r212-1] [@legifrance-civil-1245-14] [@dlapiper-directive-2024-2853] [@economie-resiliation-3-clics] [@economie-mediation-obligations] [@insify-rc-coach] [@onlynnov-editeur-logiciel] [@legifrance-sport-l321-7] [@legifrance-sport-l212-1] [@an-qe-714-coachs-en-ligne] [@umontpellier-prerogatives-staps] [@sp-plafonds-micro-2026] [@sp-franchise-tva-2026] [@sp-cotisations-micro-2026] [@sp-regime-fiscal-micro] [@sp-etudiant-micro] [@legalstart-acre-2026] [@legalplace-bic-bnc] [@bofip-oss-eligibilite] [@cnil-mots-de-passe] [@cnil-deliberation-2022-100] [@cnil-guide-securite-2024] [@cnil-fiche-sauvegarder] [@webkit-web-push-ios] [@webkit-storage-policy] [@webkit-itp-7-jours] [@apple-dma-ue] [@apple-developer-program] [@apple-small-business] [@apple-review-guidelines] [@google-play-frais-service] [@google-play-inscription] [@google-play-12-testeurs] [@theregister-apple-pwa-ue] [@macrumors-apple-pwa-ue] [@makehuman-faq-vente] [@gnu-agpl-3] [@legalis-bestwater] [@youtube-conditions] [@fitnessprogramer-terms] [@ce-ai-act-article-50] [@inpi-cout-marque] [@inpi-tarifs-juillet-2026] [@inpi-base-marques] [@euipo-frais] [@unipresse-magazine-charge-utile].
