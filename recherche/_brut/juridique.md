# Cadre juridique, fiscal et technique pour vendre Charge Utile en France

Collecte du 30/09/2026 au 01/10/2026. Ce document n'est pas un avis juridique : c'est une synthèse de textes et de pages officielles, avec un niveau de certitude pour chaque point. Les passages marqués « à faire valider » méritent un avis de juriste avant la vente.

Constats faits dans le dépôt (lecture seule, 01/10/2026), utiles pour tout ce qui suit :
**Deux défauts de sécurité ont été relevés dans le site et le relais actuels** (accès aux plans des athlètes ; intégrité des écritures vers intervals.icu). Les détails sont volontairement **hors du dépôt public** : voir `recherche/_prive/securite-relais.md` sur le Mac de Nathan.
- Les résultats de tests et les fiches restent dans `prive/`, exclu de git (bon réflexe).
- Le bouton « Douleur » de l'appli ajoute une ligne « Douleur : … » à la description de l'activité envoyée par le Worker Cloudflare vers intervals.icu ; la vue coach relit ces lignes (`relais/worker.js`, l. 240-241). Les données de douleur quittent donc le téléphone et transitent par Cloudflare puis intervals.icu.
- L'appli contient déjà des mentions prudentes (« pas une prescription », « Une douleur qui dure, c'est le kiné ou le médecin », `docs/js/app.js` l. 1485 et 2364).

---

## 1. RGPD : RPE, douleurs, poids, tests sont-ils des données de santé ?

### Réponse franche
**Oui pour les douleurs et les résultats de tests ; très probablement oui pour l'ensemble dès qu'ils sont croisés et suivis dans le temps ; le RPE seul est une zone grise.** En pratique, Charge Utile doit être traité comme un traitement de **données de santé** (catégorie particulière, art. 9 RGPD). Construire la conformité sur l'hypothèse inverse serait risqué et n'apporterait presque rien.

Certitude : **élevée** pour la douleur signalée (information directe sur l'état physique) ; **moyenne à élevée** pour poids, mobilité et force mesurées ; **moyenne** pour le RPE isolé.

### Les textes
- **Art. 4.15 RGPD** : les données concernant la santé sont les données « relatives à la santé physique ou mentale d'une personne physique […] qui révèlent des informations sur l'état de santé » (texte lu sur [cnil.fr, chapitre 1 du RGPD](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre1)).
- **Considérant 35** : inclut notamment les informations obtenues lors du test ou de l'examen d'une partie du corps, et toute information sur une maladie, un handicap, un risque de maladie ou l'état physiologique, **quelle que soit la source**. Texte vu via un extrait de recherche web ([privacy-regulation.eu, considérant 35](https://www.privacy-regulation.eu/fr/r35.htm)) ; la page EUR-Lex du RGPD n'a pas pu être rendue par l'outil (page vide), le texte exact n'a donc pas été relu sur EUR-Lex.
- **Art. 9** : interdiction de principe de traiter des données de santé, sauf exceptions, dont le **consentement explicite** (9.2.a). Non relu sur EUR-Lex (même problème technique) ; règle de base connue et non contestée.

### Position CNIL
La fiche CNIL « Qu'est-ce qu'une donnée de santé ? » ([cnil.fr](https://www.cnil.fr/fr/quest-ce-ce-quune-donnee-de-sante), publiée le 08/01/2018) distingue trois cas :
1. **par nature** (antécédents, maladies, résultats d'examens…) ;
2. **par croisement** : la CNIL cite le « croisement d'une mesure de poids avec d'autres données (nombre de pas, mesure des apports caloriques…) » et le croisement de la tension avec la mesure de l'effort ;
3. **par destination** : données utilisées à des fins médicales.
Elle précise que les données recueillies hors contexte médical « par des outils de mesure de soi » ne sont pas automatiquement des données de santé, et que l'aptitude sportive seule n'en est pas une, mais le devient si elle est croisée avec d'autres informations. Exception utile : la loi ne s'applique pas à une appli de santé qui stocke **localement, sans connexion extérieure, à des fins exclusivement personnelles**. Ce n'est pas le cas de Charge Utile (envoi au coach et à intervals.icu).

### Position européenne (G29, prédécesseur du CEPD)
L'annexe à la lettre du Groupe de l'article 29 du 05/02/2015 sur les applis de bien-être ([PDF, ec.europa.eu](https://ec.europa.eu/justice/article-29/documentation/other-document/files/2015/20150205_letter_art29wp_ec_health_data_after_plenary_annex_en.pdf), lu intégralement) est toujours la référence la plus précise. Ce qu'elle dit, résumé :
- Un simple compteur de pas sur une marche isolée, sans croisement et sans contexte médical, n'est pas une donnée de santé.
- Mais un poids, un pouls ou une tension **mesurés dans le temps**, surtout avec l'âge et le sexe, permettent d'inférer un état de santé : ce sont alors des données de santé.
- Les **conclusions tirées** sur la santé d'une personne sont des données de santé, qu'elles soient exactes ou non.
- Les données recueillies par un **questionnaire en ligne visant à donner un conseil de santé** sont des données de santé, quelle que soit la réponse.
Critères récapitulés : données médicales par nature ; données brutes qui, seules ou croisées, permettent de conclure sur l'état de santé ou un risque ; conclusions tirées sur la santé.

### Application à Charge Utile

| Donnée | Qualification probable | Pourquoi |
|---|---|---|
| Douleur signalée (zone, intensité, « arrête cet exo ») | **Donnée de santé** | Information directe sur l'état physique, et l'appli en tire une conclusion (allègement, conseil kiné). |
| Résultats de tests de mobilité / force (angle mesuré au capteur, max estimé) | **Donnée de santé très probable** | « Test ou examen d'une partie du corps » (considérant 35), suivis dans le temps. |
| Poids | **Donnée de santé si suivi dans le temps ou croisé** (c'est le cas : charges, volume, intervals.icu) | CNIL et G29 citent explicitement le poids croisé. |
| RPE / RIR par série | **Zone grise** ; isolé c'est une donnée d'effort, croisé avec douleurs et charge c'est un indicateur d'état physiologique | Aucune position officielle trouvée sur le RPE en tant que tel. |
| `focus : genoux, chevilles` dans un fichier public | **Risque** : peut révéler une fragilité articulaire d'une personne nommée par son prénom | Voir « à faire tout de suite ». |

### Conséquences concrètes
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

### Ce que Nathan doit faire
- **Tout de suite (même en gratuit)** : retirer les prénoms et le champ `focus` santé des fichiers publics, ou passer le dépôt de données en privé. Un plan nominatif « genoux, chevilles » dans un dépôt public GitHub est la faiblesse la plus visible aujourd'hui.
- Avant la vente : politique de confidentialité, écran de consentement explicite santé (séparé), registre (modèle CNIL), AIPD simple (outil PIA), liste des sous-traitants avec leurs DPA, procédure d'exercice des droits (export et suppression en un clic).
- Pseudonymiser tout ce qui part vers Claude.
- **Juriste** : une relecture de la politique de confidentialité et du texte de consentement (quelques centaines d'euros) est raisonnable avant d'ouvrir au public ; indispensable si mineurs (voir ci-dessous) ou si partenariat avec un club / CREPS.

### Point d'attention : mineurs
Les athlètes actuels ont 18-25 ans. Si la version vendue accepte des moins de 15 ans, le consentement d'un titulaire de l'autorité parentale est requis en France pour les services en ligne (seuil de 15 ans fixé par la loi Informatique et Libertés, art. 45 ; non relu dans cette collecte). **Recommandation : réserver l'appli aux 15 ans et plus au lancement, ou aux 18 ans et plus** pour simplifier.

---

## 2. HDS (hébergement de données de santé) : obligatoire ?

### Réponse franche
**Non, dans la configuration actuelle et prévue**, tant que Charge Utile reste une appli d'entraînement sportif vendue à des sportifs, hors de toute prise en charge par un professionnel de santé ou un établissement. Certitude : **moyenne à élevée**. Le point de bascule est clair : dès qu'un kiné, un médecin, un CREPS en tant que structure de suivi médical, ou une maison de santé utilise l'appli pour suivre ses patients, l'HDS devient très probablement obligatoire.

### Le texte
L'**article L.1111-8 du Code de la santé publique** (version en vigueur au 01/07/2025, [Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000049577902), lu) vise « toute personne qui héberge des données de santé à caractère personnel **recueillies à l'occasion d'activités de prévention, de diagnostic, de soins ou de suivi social et médico-social** » pour le compte de ceux qui produisent ou recueillent ces données, ou pour le compte du patient lui-même. L'hébergeur de données numériques doit détenir un **certificat de conformité**. Deux autres points du même article comptent pour Charge Utile :
- **Localisation** : le IV impose que l'hébergement certifié se fasse sur le territoire d'un État membre de l'UE ou de l'EEE.
- **Interdiction de vente** : le VII interdit « tout acte de cession à titre onéreux » de données de santé identifiantes, **même avec l'accord de la personne**, sous peine de sanctions pénales. Donc : **jamais de revente ni de monétisation des données des athlètes**, même anonymisées approximativement. Ce point est valable que l'HDS s'applique ou non.

### Ce que dit l'ANS (esante.gouv.fr)
**Non vérifié directement** : les pages de FAQ HDS d'esante.gouv.fr sont protégées par un anti-robot (Incapsula) et n'ont rendu aucun contenu à l'outil (tentatives du 01/10/2026). D'après l'extrait renvoyé par la recherche web pour la FAQ ANS « Quels sont les cas n'entrant pas dans l'obligation de certification HDS ? » ([URL](https://esante.gouv.fr/faq/quels-sont-les-cas-n-entrant-pas-dans-l-obligation-de-certification-hds)), les exclusions listées incluent les organismes d'assurance maladie pour la gestion des remboursements, les organismes de recherche dont les bases ne sont pas constituées initialement pour la prévention ou les soins, et **les associations proposant des activités sportives aux personnes handicapées**. Cette dernière exclusion montre que l'ANS ne considère pas l'activité sportive en soi comme une « activité de prévention » au sens de l'article. À confirmer par lecture directe.

### Raisonnement appliqué
- Le critère de l'HDS n'est **pas** la nature de la donnée (santé ou non) mais le **contexte de recueil** : prévention, diagnostic, soins, suivi médico-social. Une donnée de santé au sens RGPD (section 1) peut parfaitement ne pas relever de l'HDS.
- Charge Utile recueille des RPE et des douleurs dans le cadre d'un **entraînement sportif** encadré par un coach, pas d'une prise en charge sanitaire.
- **Le mot « prévention » est le piège.** Si l'appli se présente comme un outil de « prévention des blessures », elle se rapproche du champ de l'article L.1111-8 et, surtout, de la définition du dispositif médical (section 4). Même logique de vocabulaire des deux côtés : rester sur « préparation physique », « renforcement », « performance ».

### Ce que Nathan doit faire
- Ne pas payer d'hébergement HDS maintenant (les offres certifiées coûtent sensiblement plus cher qu'un Cloudflare gratuit ou à 5 $/mois).
- Choisir quand même, par prudence, un stockage des données sensibles **dans l'UE** quand ce sera possible sans surcoût (ex. localisation UE des bases Cloudflare D1 si disponible : non vérifié ici), ce qui simplifie aussi le RGPD.
- **Juriste / ANS** : obligatoire avant tout partenariat où un professionnel de santé ou une structure de soins utiliserait Charge Utile pour suivre des patients (kiné qui prescrit des séances dans l'appli, par exemple). À ce moment-là, soit hébergeur HDS, soit ne pas stocker ces données.

---

## 3. Position de la CNIL sur les applis sport, bien-être et objets connectés

### Réponse franche
**Il n'existe pas de « pack de conformité » CNIL dédié aux applis sportives** (les packs existants visent d'autres secteurs, par exemple la silver économie ; aucun pack sport trouvé). La doctrine applicable tient en quatre documents, dont deux anciens mais jamais remplacés. Tous convergent : **consentement exprès pour les données de santé, suppression à la fermeture ou à l'inactivité du compte, portabilité, sécurité dès la conception.** Certitude : élevée sur le contenu, moyenne sur l'exhaustivité (d'autres fiches ont pu m'échapper).

### Les documents
1. **« Applications mobiles en santé et protection des données personnelles : les questions à se poser »** ([cnil.fr](https://www.cnil.fr/fr/applications-mobiles-en-sante-et-protection-des-donnees-personnelles-les-questions-se-poser), 17/08/2018, lu). Pour une appli dite « bien-être », la CNIL demande que « l'accord exprès de la personne » soit recueilli pour la collecte de données de santé, et que les données ne soient pas conservées au-delà de la suppression ou de l'inactivité du compte. Elle rappelle le droit à la portabilité (récupérer ses données dans un format structuré et lisible par machine) et renvoie à l'HDS « selon les activités » de l'appli. C'est la fiche la plus directement applicable à Charge Utile.
2. **« Qu'est-ce qu'une donnée de santé ? »** (08/01/2018, voir section 1) : trois catégories, dont le croisement poids + activité.
3. **Questions-réponses sur le sport amateur** ([cnil.fr](https://www.cnil.fr/fr/sport-amateur-hors-contrat/questions-reponses), 04/08/2022, lu). Destinée aux clubs, mais transposable :
   - les statistiques de performance mesurées par objet connecté (distance, vitesse, contact au sol, FC, poids…) peuvent être sensibles ;
   - si l'objet collecte des données de santé, le consentement exprès est obligatoire, et il doit être « libre, spécifique, univoque et éclairé » ;
   - le consentement n'est pas valable s'il crée un **déséquilibre manifeste** entre le sportif et la structure (ex. refus = impossibilité de pratiquer). **Point important pour Charge Utile** : si un club impose l'appli à ses athlètes, le consentement de l'athlète devient fragile ; l'appli doit donc fonctionner (de façon dégradée) sans les données de douleur.
   - conservation des données d'adhérent : 3 ans maximum après la fin de l'adhésion (repère utile pour les comptes inactifs).
4. **Recommandation « applications mobiles »** (adoptée le 18/07/2024, publiée le 24/09/2024, version corrigée le 08/04/2025 ; [cnil.fr](https://www.cnil.fr/fr/recommandations-applications-mobiles), [version modifiée](https://www.cnil.fr/fr/recommandations-applications-mobiles-modifiee), lues). Vise éditeurs, développeurs, fournisseurs de SDK, OS et magasins d'applis : information claire au bon moment, permissions (caméra, micro, capteurs) liées à une finalité, refus aussi simple que l'acceptation, pas de SDK tiers inutile. La CNIL annonçait des **contrôles ciblés à partir du printemps 2025**. La page ne dit pas explicitement si une PWA est couverte ; l'esprit (permissions caméra pour la vidéo de série, capteurs de mouvement pour les tests de mobilité) s'applique de toute façon.

Document de contexte : le Cahier Innovation et prospective n° 2 du LINC (laboratoire de la CNIL) sur le « quantified self » et les capteurs corporels ([PDF](https://www.cnil.fr/sites/cnil/files/typo/document/CNIL_CAHIERS_IP2_WEB.pdf), vu via recherche web seulement, non relu).

### Traduction pour Charge Utile
| Exigence CNIL | Mise en œuvre concrète |
|---|---|
| Consentement exprès santé | Écran dédié avant la 1re saisie de douleur / poids / test, case non pré-cochée, retrait possible dans les réglages. |
| Suppression à la fermeture / inactivité | Suppression automatique après X mois sans connexion (ex. 24 mois), avec e-mail d'avertissement. |
| Portabilité | Bouton « Exporter mes données » (JSON ou CSV). |
| Permissions | Demander caméra et capteurs **au moment** du test ou de la vidéo, avec une phrase qui dit pourquoi ; rien stocké par défaut côté serveur pour les vidéos. |
| Pas de SDK tiers | Pas d'outil d'analytics publicitaire ; si mesure d'audience, un outil exempté de consentement (configuration CNIL). |
| Déséquilibre club / athlète | Les fonctions santé restent optionnelles. |

### Juriste ?
Pas nécessaire pour cette partie : les fiches CNIL sont directement applicables. Le service **CNIL « Besoin d'aide »** et les guides pour développeurs suffisent.

---

## 4. Dispositif médical : où est la ligne ?

### Réponse franche
**Charge Utile, tel qu'il est, n'est pas un dispositif médical : c'est une appli de fitness / préparation physique, catégorie explicitement exclue.** Mais la ligne se franchit **par les mots**, pas par le code : la qualification dépend de la **destination revendiquée** par le fabricant (site, fiche de magasin d'applis, CGU, messages dans l'appli, publicité, posts Instagram). La même fonction (« baisser la charge quand l'athlète signale une douleur au genou ») est hors DM si elle est présentée comme de la gestion d'entraînement, et devient un logiciel DM si elle est présentée comme soulageant ou soignant une pathologie du genou. Certitude : **élevée** sur le principe, **moyenne** sur certains cas limites (tests de mobilité, routines « genou »).

Enjeu : un logiciel DM doit être **marqué CE** (classe I au minimum, classe IIa dès qu'il fournit une information servant à une décision diagnostique ou thérapeutique, ce qui impose un organisme notifié). Hors de portée d'une micro-entreprise.

### Les textes
- **Règlement (UE) 2017/745 (MDR), art. 2.1** : est un dispositif médical tout logiciel destiné par le fabricant à être utilisé chez l'homme à des fins médicales, notamment le **diagnostic, la prévention, le contrôle, la prédiction, le pronostic, le traitement ou l'atténuation d'une maladie**, ou le **diagnostic, le contrôle, le traitement, l'atténuation ou la compensation d'une blessure ou d'un handicap**. Définition relue dans sa reprise intégrale par le guide MDCG (l'accès direct à EUR-Lex a été bloqué par un anti-robot le 01/10/2026). **Le mot « prévention » vise les maladies ; pour les blessures, ce sont diagnostic, contrôle, traitement, atténuation et compensation.** « Prévenir les blessures » n'est donc pas textuellement dans la définition, mais un régulateur peut le lire comme une finalité médicale : à éviter quand même.
- **Destination (art. 2.12 MDR)** : l'usage auquel le dispositif est destiné d'après les indications du fabricant sur l'étiquetage, la notice, **les documents ou indications promotionnels ou de vente**.
- **Règle 11 (annexe VIII MDR)**, reproduite dans le guide MDCG : logiciel destiné à fournir des informations utilisées pour des décisions diagnostiques ou thérapeutiques = **classe IIa** (IIb ou III selon la gravité) ; logiciel destiné à contrôler des processus physiologiques = IIa ; tout autre logiciel DM = classe I.

### Le guide MDCG 2019-11 rév. 1 (juin 2025)
[PDF officiel, health.ec.europa.eu](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=md_mdcg_2019_11_guidance_qualification_classification_software_en.pdf), lu intégralement (36 pages). Ce qui compte pour Charge Utile :
- Le logiciel doit avoir **une finalité médicale propre** pour être un DM ; la destination décrite par le fabricant est déterminante.
- Liste explicite des logiciels qui **ne sont pas** des DM : facturation, planning, messagerie… et « **wellness or fitness apps** » (section 3.1).
- Le risque de dommage pour l'utilisateur **n'est pas** un critère de qualification (une appli de muscu peut blesser sans être un DM).
- **Contre-exemple décisif** (section 3.2) : est un logiciel DM celui qui utilise les données d'un patient atteint d'une **pathologie musculosquelettique précise** (radios, **amplitude de mouvement, poids, âge**) et qui vise à **soulager la douleur** liée à cette pathologie en recommandant des **exercices de rééducation personnalisés**. C'est exactement ce que Charge Utile deviendrait avec un module « genou douloureux : ta routine de rééducation ».
- Autre exemple DM : appli qui propose exercices et vidéos choisis selon les réponses du patient pour réduire des symptômes (dépression). Le schéma « questionnaire → exercices personnalisés pour réduire un symptôme » est un marqueur DM.
- La révision 1 ajoute des exemples de logiciels « destinés à prévenir le risque de maladie » en analysant des paramètres physiologiques (ex. placement des vertèbres dorsales) : **classe IIa**. Un « score de risque de blessure » calculé à partir des tests de mobilité se rapprocherait dangereusement de cet exemple.

### Ce que dit l'ANSM
- Page « Le logiciel ou l'application santé que je vais mettre sur le marché relève-t-il du statut de DM ? » ([ansm.sante.fr](https://ansm.sante.fr/documents/reference/le-logiciel-ou-lapplication-sante-que-je-vais-mettre-sur-le-marche-releve-t-il-du-statut-de-dispositif-medical-dm-ou-de-dispositif-medical-de-diagnostic-in-vitro-dm-div), mise à jour du 06/01/2026, lue) : critères cumulatifs (finalité médicale, résultat propre à un patient, traitement des données qui crée une information médicale nouvelle) ; les applis de bien-être / fitness ne sont pas des DM ; la destination revendiquée dans la documentation et la publicité est déterminante.
- Page d'exemples ([ansm.sante.fr](https://ansm.sante.fr/documents/reference/exemples-de-logiciels-et-applications-mobiles-illustrant-le-positionnement-reglementaire), mise à jour 25/05/2021, lue) : une appli podomètre qui calcule les pas sur plusieurs jours et propose un **programme d'entraînement avec notifications personnalisées** est classée « **pas DM** ». C'est l'analogue le plus proche de Charge Utile.

### Application aux fonctions de Charge Utile

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

### Formulations à éviter (appli, site, fiches, réseaux sociaux, messages générés par Claude)
- « traiter », « soigner », « guérir », « soulager la douleur », « thérapeutique »
- « rééducation », « rééduquer », « réathlétisation après blessure » (sauf si c'est un kiné qui la mène hors de l'appli)
- « prévenir la blessure de… », « prévention des blessures », « réduire le risque de tendinite / de rupture du LCA »
- « diagnostic », « bilan », « dépister », « détecter une asymétrie à risque », « score de risque de blessure »
- « pour les douleurs au genou », « pour ton syndrome de l'essuie-glace », « après une entorse », tout nom de pathologie
- « protocole » associé à une pathologie, « prescription », « ordonnance d'exercices »
- « remplace une séance de kiné », « validé médicalement » (sans preuve)

### Formulations sûres
- « renforcement », « préparation physique », « gainage », « stabilité », « proprioception » (au sens sportif), « robustesse »
- « genoux et chevilles solides pour le VTT », « renforcer les zones sollicitées par le trail »
- « repère de progression », « amplitude de mouvement mesurée pour suivre ta progression » (pas « normale / anormale »)
- « si tu ressens une douleur, arrête l'exercice et parles-en à un professionnel de santé » (déjà dans l'appli, à garder)
- « récupération », « retour au calme », « bien-être »
- « charge ajustée à ton ressenti (RPE) »

### Ce que Nathan doit faire
- Ajouter dans les consignes données à Claude (qui rédige les séances) une **liste de mots interdits** reprenant la liste ci-dessus : c'est Claude qui écrit les `message` et `note` des séances, donc c'est là que le risque de dérapage est le plus fort.
- Rédiger une **destination** en une phrase et la reprendre partout : « Charge Utile est un outil de préparation physique pour sportifs en bonne santé. Il n'est pas un dispositif médical et ne remplace pas l'avis d'un professionnel de santé. »
- Relire la page de vente, la fiche de magasin d'applis et les posts avant publication.
- **Juriste ou consultant réglementaire DM** : seulement si Nathan veut un jour un module « retour de blessure » ou un partenariat avec des kinés qui prescrivent via l'appli. Sinon inutile.

