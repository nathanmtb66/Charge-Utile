# MVP vendable : le plus petit produit qu'un autre coach paierait

*Phase 6. À ne construire **que si** les critères de `business/08` sont atteints (paiements réels). Spécification écrite le 1er octobre 2026 à partir de l'existant (PWA + relais Cloudflare) et des contraintes de `business/03` (OAuth intervals.icu) et `business/07` (données de santé, licences, hébergement).*

## En une phrase

**Un coach s'inscrit, dicte ou écrit une séance de force, la valide, l'envoie à un athlète par un lien ; l'athlète la fait guidé et hors-ligne ; le coach voit le résultat chez lui et dans intervals.icu.** Rien de plus.

## Ce que le MVP contient, et ce qu'il ne contient pas

| Dans le MVP | Hors MVP (plus tard, ou jamais) |
|---|---|
| Compte coach par lien magique (e-mail) | Mots de passe, connexion par réseau social |
| Athlètes ajoutés par lien d'invitation ; **pas de compte athlète** au sens classique : un lien personnel long, lié à un appareil | Messagerie, réseau social |
| Création de séance : dictée ou texte → IA → **aperçu → validation du coach** ; éditeur manuel ; séances modèles | Programmes automatiques sans coach |
| Lecteur de séance actuel (animations, tempo, minuteurs, ajustement, hors-ligne) | Appli native, Apple Watch |
| Sauvegarde serveur de l'historique athlète | Analyse vidéo par IA |
| Vue coach : séances faites, adhésion sur 4 et 8 semaines, gênes signalées, charges, tests | Tableaux de bord avancés, export PDF |
| intervals.icu par OAuth (athlète) ; clé personnelle possible pour le coach seul | Nolio, TrainingPeaks, Garmin |
| Paiement, CGU/CGV, consentement, suppression des données | Marketplace |
| Français | Anglais (juste après, si ça marche) |

## 1. Comptes et accès

### Coach
- **Connexion par lien magique** (e-mail, lien valable 15 minutes, session de 30 jours). Pas de mot de passe à stocker : moins de surface d'attaque, conforme à la recommandation de la CNIL (`business/07`).
- Un coach = un espace (« organisation »). Second coach dans le même espace : hors MVP.

### Athlète
- Le coach crée l'athlète (prénom ou pseudonyme, sport, date de naissance pour savoir s'il a moins de 15 ans) et obtient un **lien d'invitation**.
- Au premier lancement, l'appli échange ce lien contre un **jeton long et aléatoire (128 bits ou plus) stocké sur l'appareil**. Le lien d'invitation ne marche qu'une fois. L'athlète n'a rien à retenir : on garde l'esprit « sans compte ».
- Changement de téléphone : le coach renvoie un lien. Perte de téléphone : le coach révoque le jeton.
- **Moins de 15 ans** : consentement du titulaire de l'autorité parentale requis (art. 45 de la loi Informatique et Libertés, `science/F`). MVP : case « j'ai l'accord écrit des parents » côté coach, et document type fourni. **Les mineurs ne font pas partie du premier lancement.**
- **Consentement explicite** au traitement des données de santé (ressenti, gênes, tests, poids), séparé des CGU, au premier lancement. Refus possible : l'appli marche alors sans gêne ni tests.

## 2. Création de séance par la voix ou le texte

### Parcours
1. Le coach choisit un athlète, puis dicte (clavier du téléphone, dictée du système : gratuit) ou tape : « mardi, force jambes, squat 4 fois 5 à RPE 8, fentes bulgares 3 fois 8, gainage, 50 minutes ».
2. Le serveur envoie à Claude : le format de séance, l'index compact du catalogue, le **profil pseudonymisé** de l'athlète (code, sport, phase, derniers maxima, zones à éviter), et la dictée. **Jamais** le prénom, l'e-mail ni un texte libre de santé.
3. Claude renvoie un JSON. **Le serveur le valide** (voir garde-fous). En cas d'erreur, un second tour corrige.
4. Le coach voit un **aperçu lisible** (blocs, exercices, charges, durée estimée, alertes). Il modifie à la main, ou redicte une correction.
5. **Il valide.** Rien n'arrive chez l'athlète sans cette validation.

### Coût par séance
- Sonnet 5.5 : **0,03 € (cache chaud) à 0,06 € (cache froid)** pour 2 tours ; Haiku 4.5 : environ 0,015 € (`business/06`, `_outils/modele_eco.py`).
- Un coach de 12 athlètes qui dicte tout : au plus 6,50 € par mois d'API, pour 24 € facturés. **Les séances modèles et la duplication (« même séance que mardi dernier, +2,5 kg ») ne passent pas par l'IA** : c'est ce qui ramène le coût sous 2 € par coach.
- Plafond par coach : 300 générations par mois, puis message clair. Protège contre l'abus et contre un bug.

### Garde-fous contre les erreurs de l'IA (tous côté serveur, en code, pas en consigne)
1. **Schéma strict** : la sortie doit passer le même contrôle que `tools/check_sessions.py` (exercices existants, champs valides).
2. **Plafonds de charge** : aucune charge au-dessus de 110 % de la plus lourde déjà réussie par l'athlète sur cet exercice ; aucun saut de plus de 10 % par rapport à la dernière séance sans confirmation explicite (règle `plafond-progression-code`).
3. **Zones à éviter** : un exercice dont les `zones` croisent une gêne déclarée est refusé ou signalé.
4. **Volume plausible** : durée estimée affichée ; alerte au-delà de 90 minutes ou de 25 séries de jambes.
5. **Calendrier** : alertes des règles `interference-delai`, `course-veille`, `test-pas-avant-course` (`regles/regles.json`).
6. **Mots interdits** dans les `message` et `note` rédigés par l'IA : soigner, traiter, rééducation, prévenir la blessure, tendinite… (`business/07`). Filtre en sortie, pas seulement dans la consigne.
7. **Mention** dans le JSON et à l'écran : `"genere_par": "IA, validée par le coach"` (AI Act, article 50).
8. **Journal** : dictée, sortie brute, corrections, validation. Sert au support et à améliorer les consignes.
9. **Repli** : si l'API est indisponible, l'éditeur manuel et les séances modèles marchent.

## 3. Lien avec intervals.icu et TrainingPeaks

### intervals.icu
- **Légal** : les conditions de l'API autorisent l'usage commercial, modifiables avec 30 jours de préavis (`business/03`).
- **Technique** : une appli utilisée par plusieurs personnes doit passer par **OAuth** (demande, puis approbation manuelle par intervals.icu). **Un jeton OAuth ne donne accès qu'aux données de la personne qui autorise.** Donc :
  - **chaque athlète** autorise Charge Utile (portées : écrire des activités, écrire au calendrier ; lire les activités et le bien-être si le coach veut les alertes de calendrier) ;
  - le coach autorise aussi, pour lui-même.
- **Ce que le MVP écrit** : l'activité `WeightTraining` (durée, RPE de séance, charge sRPE, « kg soulevés », récapitulatif en texte) ; les séances à venir dans le calendrier, avec le lien.
- **Ce que le MVP lit** (optionnel) : les séances d'endurance prévues et leurs heures, pour les alertes de délai ; le TSB.
- **Athlètes synchronisés uniquement par Strava** : invisibles pour une appli tierce. Message clair à l'installation : « connecte ta montre directement à intervals.icu ».
- **Mode « clé personnelle »** conservé pour un coach seul qui l'accepte (c'est le montage actuel de Nathan), avec la clé chiffrée côté serveur. À présenter comme une option avancée, pas comme le parcours normal.
- **Sans intervals** : tout marche. L'intégration est un plus, pas une condition.

### TrainingPeaks
- **Non vérifié** : l'existence d'une API ouverte aux petits éditeurs. L'accès partenaire passe par une demande à TrainingPeaks (aujourd'hui Garmin). Un serveur MCP non officiel existe (`business/01`), ce n'est pas une base pour un produit vendu.
- **MVP : pas d'intégration.** Repli : export de la séance en texte à coller dans la description d'une séance TrainingPeaks. À ne construire que si 5 coachs TrainingPeaks le demandent en payant.

### Nolio
- API à vérifier (non étudiée). Même logique : après la preuve sur intervals.icu.

## 4. Sécurité et données

| Sujet | Décision MVP |
|---|---|
| Hébergement | Cloudflare Pages (site) + Workers (API) + D1 (base) ; région UE quand c'est possible. **Pas de GitHub Pages** (SaaS interdit) |
| HDS | Non requis pour ce cas (hors prise en charge sanitaire, `business/07`). À revoir si une structure avec service médical devient cliente |
| Données de santé | Consentement explicite ; registre des traitements ; analyse d'impact simple ; chiffrement au repos des champs sensibles (gênes, poids, tests) |
| Sous-traitants | Cloudflare, Anthropic, intervals.icu, prestataire de paiement, prestataire d'e-mail : listés dans la politique de confidentialité, avec les garanties de transfert |
| Ce qui part vers Claude | Profil pseudonymisé seulement ; pas de texte libre de santé |
| Fichiers de séance | Servis **après vérification du jeton de l'athlète**. Plus aucun fichier lisible par tous |
| Écritures vers intervals | Toujours authentifiées par le jeton de l'athlète |
| Limites d'essais | Sur le lien magique, les jetons et toute route d'écriture |
| Sauvegardes | Export quotidien chiffré de la base vers un second fournisseur ; test de restauration par trimestre |
| Suppression | Bouton « supprimer mes données » pour l'athlète et pour le coach ; délai de conservation écrit |
| Violation de données | Procédure d'une page : qui fait quoi dans les 72 heures |
| Licences | Squelette du mannequin refait (plus d'AGPL) ; fichier `LICENCES.md` ; dépôt du produit vendu en privé ou sous licence choisie |

## 5. Prix

- **Gratuit jusqu'à 3 athlètes**, sans limite de durée : le coach essaie avec de vrais athlètes.
- **2 € par athlète actif et par mois** au-delà (un athlète est actif s'il a fait une séance dans le mois), minimum 9 €/mois. Justification : `business/06` (un coach dépense 1 à 3 € par athlète pour tous ses outils).
- **Tarif fondateur** pour les coachs qui ont prépayé : prix bloqué 2 ans.
- Paiement mensuel par carte, résiliable en ligne en trois clics (obligation légale).
- Ce prix est une **hypothèse à tester** (fausse porte et Van Westendorp, `business/08`).

## 6. Onboarding en moins de 5 minutes

| Minute | Ce que fait le coach | Ce qui doit être prêt |
|---|---|---|
| 0 | Entre son e-mail, clique le lien reçu | E-mail en moins de 10 secondes |
| 1 | Répond à 3 questions : sport principal, nombre d'athlètes, plateforme d'endurance | Rien d'autre |
| 2 | Ouvre la **séance de démonstration** sur son propre téléphone et fait 2 exercices | Séance modèle « découverte » de 5 minutes |
| 3 | Dicte sa première séance, voit l'aperçu, valide | Modèles par sport et par phase (phase 4) |
| 4 | Crée son premier athlète, envoie le lien par WhatsApp | Lien + message tout prêt |
| 5 | (Optionnel) Connecte intervals.icu | Bouton OAuth, explication en 2 lignes |

**Côté athlète** : lien → écran « ajoute l'appli à ton écran d'accueil » (obligatoire sur iPhone pour garder les données et les notifications, `business/07`) → consentement → première séance **courte et facile**. Les deux premières semaines décident de l'abandon [@kidman2024].

## 7. Architecture technique, sans réécrire ce qui marche

**On garde** : le lecteur de séance (`docs/js/app.js`), le moteur 3D, les animations, le catalogue, le format JSON des séances, le service worker hors-ligne, la logique du relais.

**On ajoute, côté serveur (Cloudflare Workers + D1)** :

```
/api/auth/lien           envoie le lien magique au coach
/api/auth/session        échange le lien contre une session
/api/athletes            crée, liste, révoque (coach)
/api/invitation/:code    échange le lien d'invitation contre le jeton de l'athlète (une seule fois)
/api/seances             lit les séances de l'athlète (jeton athlète) ; crée, modifie (coach)
/api/generer             dictée ou texte → IA → validation serveur → aperçu (coach)
/api/resultats           reçoit la séance faite (jeton athlète) ; la range ; l'envoie à intervals
/api/intervals/oauth     flux OAuth (athlète ou coach)
/api/paiement/webhook    état de l'abonnement
/api/moi/supprimer       suppression des données
```

**Tables D1** : `coachs`, `athletes`, `jetons`, `seances` (JSON), `resultats` (JSON), `consentements`, `intervals_tokens` (chiffrés), `journal_ia`, `abonnements`.

**Ce qui change dans le lecteur** (peu) :
- il lit ses séances par `/api/seances` avec son jeton, au lieu d'un fichier public ; il les garde en cache pour le hors-ligne, comme aujourd'hui ;
- il envoie ses résultats à `/api/resultats`, avec la file d'attente hors-ligne qui existe déjà ;
- il sauvegarde l'historique côté serveur.

**Ce qui reste comme aujourd'hui pour Nathan** : `coach.py` et la publication par fichiers peuvent coexister pendant la transition (un « espace Nathan » qui lit les deux).

**Ordre de construction** (environ 150 à 200 heures pour un développeur seul aidé par l'IA ; estimation de ma part, à ±50 %) :
1. Base, comptes coach, jetons athlète, séances servies par l'API (remplace les fichiers publics). **Règle au passage les défauts de sécurité actuels.**
2. Résultats et sauvegarde serveur ; vue coach sur la base.
3. Génération par IA avec garde-fous ; éditeur manuel ; séances modèles.
4. OAuth intervals.icu.
5. Paiement, consentements, suppression, CGU/CGV.
6. Onboarding et séance de démonstration.

**Tests** : garder les scripts `qa/` (parcours, hors-ligne, relais) et ajouter des tests sur les garde-fous (plafonds de charge, mots interdits, zones à éviter) : ce sont eux qui protègent en cas de bug.

## 8. Ce qui peut faire échouer le MVP

- **L'OAuth par athlète** ajoute une étape là où le produit promettait « rien à faire ». Mesurer le taux d'athlètes qui la franchissent ; garder l'appli pleinement utile sans elle.
- **L'approbation de l'appli OAuth par intervals.icu** est manuelle : délai inconnu.
- **150 à 200 heures**, c'est 7 à 9 mois au rythme de 5 heures par semaine. D'où le calendrier de `business/09` (construction en juin-juillet 2027, après les examens).
- **Un seul développeur** : pas de garde, pas de support le week-end de course. Le dire dans les CGV (service fourni « en l'état », délai de réponse de 72 heures).

## Sources

[@kidman2024]. Le reste renvoie à `business/03`, `business/06`, `business/07`, `business/08` et `regles/regles.json`.
