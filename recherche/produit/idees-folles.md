# Idées folles : ce qui est faisable en 2026, et ce qui est un mirage

*Phase 6. Pour chaque idée : faisabilité réelle en 2026, preuve scientifique, coût, verdict franc. Les preuves viennent de `science/` (surtout D, G, H). Écrit le 1er octobre 2026.*

## Le tableau

| # | Idée | Faisable en 2026 ? | Preuve qu'elle sert à quelque chose | Coût | Verdict |
|---|---|---|---|---|---|
| 1 | La séance de force qui se place toute seule autour de l'endurance | Oui | Principes B-C, seuils D | Moyen | **À faire, version simple** |
| 2 | Séance ajustée à la forme du matin (5 questions) | Oui | Non validée | Moyen | **À tester à la main d'abord** |
| 3 | Séance ajustée à la VFC du matin | Oui (via intervals) | Effet faible, non significatif | Faible | **Option discrète, pas un argument** |
| 4 | L'IA compte les répétitions par la caméra | Oui, avec un bon cadrage | Comptage fiable ; utilité faible | Moyen à élevé | **Plus tard, peut-être jamais** |
| 5 | L'IA juge la technique sur la vidéo d'une série | Non pour un jugement fiable | Non validé sous charge | Élevé + risque | **À ne pas faire** |
| 6 | L'IA aide le coach à commenter la vidéo | Oui | Indirecte | Faible | **Plus tard : bon compromis** |
| 7 | Mesure de la vitesse de barre au téléphone | Oui pour la vitesse, non pour le 1RM | Mitigée | Élevé | **À ne pas faire** |
| 8 | Coach vocal pendant la séance | Oui (voix de synthèse sur le téléphone) | Encouragement : preuve C | Faible | **Version simple : oui. Conversation : non** |
| 9 | Assistant conversationnel pour l'athlète | Oui | Aucune ; risques | Moyen + juridique | **À ne pas faire** |
| 10 | Plan de saison généré par IA | Oui | Aucune ; le coach est l'avantage | Moyen | **Brouillon pour le coach seulement** |
| 11 | Lien automatique avec la charge vélo | En partie fait | sRPE non validé en muscu | Faible | **À faire, honnêtement** |
| 12 | Détection du surmenage ou du REDs | Non | Aucun marqueur n'existe | — | **À ne pas faire** |
| 13 | Saut vertical mesuré par la caméra au ralenti | Oui | Bien validé | Moyen | **Bonne idée, plus tard** |
| 14 | Bibliothèque de vraies vidéos tournées par Nathan | Oui | Indirecte (clarté, confiance) | Temps de tournage | **À faire : la moins folle, la plus utile** |
| 15 | Apple Watch, Garmin : la séance sur la montre | Difficile | Aucune | Très élevé | **À ne pas faire** |
| 16 | Micro-séances « os » pour les cyclistes | Oui | C (un essai) | Très faible | **À faire** |
| 17 | Comparaison anonyme avec d'autres athlètes | Oui | Mitigée, parfois négative | Moyen | **À ne pas faire par défaut** |

## 1. La séance de force qui se place toute seule autour de l'endurance

- **L'idée** : l'appli lit le calendrier d'intervals.icu (séances clés, courses, charge) et propose au coach le meilleur jour, la bonne version (complète, courte, maintien, affûtage), et signale les conflits.
- **Faisabilité** : bonne. L'API d'intervals donne le calendrier et la charge ; les règles existent (`regles/regles.json` : `interference-*`, `course-*`, `saison-maintien`).
- **Preuve** : les principes sont de niveau B à C, **les seuils sont de niveau C à D**. Le délai de 6 h vient d'un seul essai chez des rugbymen [@robineau2016] ; le maintien à une séance par semaine, d'un essai de 6 cyclistes [@ronnestad2010b]. Aucune étude ne teste un placement automatique.
- **Coût** : moyen (lecture du calendrier, quelques règles, une interface d'alerte).
- **Verdict** : **à faire en version simple** : des **informations** au coach, des seuils réglables, jamais de déplacement automatique. C'est la seule idée de cette liste qui répond à la douleur n° 1 (`business/04`). **C'est le « révolutionnaire crédible »** du produit, à condition de dire que ce sont des repères.

## 2. Séance ajustée à la forme du matin

- **Faisabilité** : bonne (5 taps, un calcul, 3 couleurs ; pseudo-code dans `science/D`).
- **Preuve** : les questionnaires suivent mieux la charge que les mesures objectives [@saw2016]. Mais **aucun essai ne montre qu'un score composite améliore la performance ou réduit les blessures**. Études faites en sports collectifs.
- **Risques** : un athlète qui veut s'entraîner répond « tout va bien » ; un « rouge » peut faire se sentir mal ; une question de plus chaque matin fait chuter le remplissage [@saw2015b].
- **Verdict** : **tester à la main pendant 6 semaines** (un message le matin, Nathan décide) avant d'écrire une ligne de code. Si Nathan ne change jamais une séance à cause des réponses, la fonction est un gadget.

## 3. Séance ajustée à la VFC du matin

- **Faisabilité** : bonne, si l'athlète mesure et que la valeur arrive dans intervals. Le téléphone ou la montre suffit pour la mesure de repos [@dobbs2019].
- **Preuve** : la VFC guidée **n'améliore pas nettement la performance** (effet g 0,08, non significatif) [@duking2021] [@manresarocamora2021]. Elle évite surtout des séances dures mal placées. Chez les très entraînés, elle peut baisser en bonne forme.
- **Verdict** : **option discrète** (un signal parmi d'autres, 15 % du score au plus). Ne pas en faire un argument de vente : WHOOP et Garmin le font avec leurs capteurs, et la science ne suit pas le marketing.

## 4. L'IA compte les répétitions par la caméra

- **Faisabilité** : le comptage est fiable avec un cadrage correct (corps entier, téléphone fixe, vue de trois quarts) [@oliosi2026]. Tout tourne sur le téléphone (modèles d'estimation de pose gratuits).
- **Utilité** : faible. L'athlète sait compter. Il faut poser le téléphone, cadrer, et la salle doit le permettre. Aujourd'hui, un tap sur l'écran suffit.
- **Coût** : moyen à élevé (intégration, tests sur beaucoup d'exercices et de téléphones, batterie).
- **Verdict** : **plus tard, peut-être jamais**. Le seul cas où cela vaut le coup : mesurer le **tempo réel** d'une série filmée pour le coach.

## 5. L'IA juge la technique sur la vidéo d'une série

- **Faisabilité** : non, pour un jugement fiable. Les angles dans le plan de profil sont estimés à 4-5° près dans de bonnes conditions ; **le valgus du genou sous charge n'est pas validé** [@ogura2026] [@ortiz2016] [@yoma2025].
- **Risques** : un faux « c'est bon » sur un squat lourd engage la responsabilité de l'éditeur (`business/07`). Un faux « attention au genou » inquiète pour rien et frôle le diagnostic.
- **Verdict** : **à ne pas faire**. C'est l'idée la plus séduisante et la plus dangereuse de la liste. Un coach qui regarde 20 secondes de vidéo fait mieux, et c'est l'avantage du produit.

## 6. L'IA aide le coach à commenter la vidéo

- **L'idée** : l'athlète filme une série ; l'appli extrait 3 images clés (bas du mouvement, milieu, haut) et propose au coach un commentaire en 2 lignes, qu'il corrige et envoie.
- **Faisabilité** : bonne. L'IA ne juge pas, elle prépare. Le coach valide.
- **Preuve** : le retour du coach est le levier d'adhésion le mieux étayé [@saw2015b] ; une ou deux consignes précises, et une question à l'athlète, font mieux qu'un long discours [@souissi2021].
- **Coût** : faible (quelques centimes par vidéo si un modèle multimodal décrit les images ; zéro si on extrait seulement les images).
- **Verdict** : **plus tard, et c'est un bon compromis**. Commencer sans IA : les 3 images clés et un champ de réponse.

## 7. Mesure de la vitesse de barre au téléphone

- **Faisabilité** : la vitesse se mesure correctement sur un mouvement vertical, à charge moyenne. **L'estimation du 1RM par la vitesse est fausse d'environ 10 %**, pas mieux que les formules par répétitions [@greig2023] [@lemense2024].
- **Utilité pour l'endurant** : le RPE et le RIR font aussi bien pour doser (`science/A`).
- **Verdict** : **à ne pas faire**. Metric et Qwik le font déjà très bien (`business/01`). Ce n'est pas le métier de Charge Utile.

## 8. Coach vocal pendant la séance

- **Version simple** : la voix du téléphone lit la consigne, annonce la charge, compte le tempo, dit « dernière série ». Gratuit (synthèse vocale du système), hors-ligne.
  - **Preuve** : l'encouragement améliore l'effort, surtout chez les moins assidus (preuve C) [@weakley2020]. Ladder a bâti son succès sur le guidage à l'oreille (`business/01`).
  - **Verdict** : **oui**, comme option. Les bips de tempo existent déjà.
- **Version conversationnelle** (« dis-moi comment tu te sens ») : voir l'idée 9. **Non.**

## 9. Assistant conversationnel pour l'athlète

- **Faisabilité** : technique, oui.
- **Problèmes** : obligations de l'AI Act dès que l'athlète parle à une IA ; données de santé envoyées à un modèle ; risque de conseil médical sans relecture ; coût par conversation ; et surtout, **cela retire le coach de la boucle**, alors que c'est lui l'avantage (`business/05`).
- **Verdict** : **à ne pas faire.** Si un athlète a une question, elle va au coach.

## 10. Plan de saison généré par IA

- **Faisabilité** : bonne. L'IA peut proposer des blocs à partir des dates de course.
- **Preuve** : aucune étude ne montre qu'un modèle de périodisation l'emporte nettement sur un autre ; les semaines types sont des constructions d'expert (`science/I`).
- **Verdict** : **un brouillon pour le coach, jamais un plan automatique.** Les séances modèles par phase (`modeles/`) font déjà l'essentiel sans IA.

## 11. Lien automatique avec la charge vélo

- **Ce qui existe** : le relais écrit la séance faite dans intervals.
- **Ce qui manque** : une charge crédible. Le sRPE (RPE × minutes) est validé en endurance et en sports collectifs [@foster2001], **pas en musculation**, où les temps de repos gonflent les minutes (`science/D`). L'unité n'est pas celle du TSS. Par défaut, intervals compte la musculation à 0 % pour la forme.
- **Verdict** : **à faire, honnêtement** : une charge nommée « sRPE », envoyée en option, avec une phrase d'explication. Ne pas inventer un « TSS de la force ».

## 12. Détection du surmenage ou du déficit énergétique

- **Preuve** : aucun marqueur ne détecte le surentraînement [@meeusen2013] ; le dépistage du déficit énergétique est un travail de médecin [@mountjoy2023].
- **Verdict** : **à ne pas faire.** L'appli peut poser 4 questions de veille et répondre « parles-en à un médecin ». Rien de plus (règle `alerte-veille-energie`).

## 13. Saut vertical mesuré par la caméra au ralenti

- **Faisabilité** : bonne. C'est la mesure de puissance la mieux validée au téléphone [@gencoglu2023].
- **Utilité** : un test simple, répétable, parlant pour l'athlète, lié à la force explosive.
- **Coût** : moyen (repérer le décollage et la réception dans la vidéo ; au début, l'athlète peut les pointer à la main).
- **Verdict** : **bonne idée, plus tard.** Voir `exercices/tests-proposes.md`.

## 14. Bibliothèque de vraies vidéos tournées par Nathan

- **Faisabilité** : totale. Nathan est vidéaste, il a les athlètes et les lieux.
- **Ce que ça règle** : le point faible des animations faites main (`business/05`), le risque juridique des liens externes (`business/07`), le besoin de contenu pour se faire connaître (`business/08`).
- **Coût** : du temps. 30 exercices × 15 minutes de tournage et de montage, soit une dizaine d'heures.
- **Verdict** : **à faire. C'est l'idée la moins folle et la plus rentable de la liste.**

## 15. La séance sur la montre

- **Problèmes** : Garmin retire déjà les noms d'exercices des fichiers transmis par son API ; intervals n'envoie pas d'étapes en répétitions (`business/03`) ; une appli de montre est un produit à part entière ; la fréquence cardiaque au poignet est fausse en musculation [@zhang2020].
- **Verdict** : **à ne pas faire.** Garmin possède TrainHeroic : c'est son terrain.

## 16. Micro-séances « os » pour les cyclistes

- **Preuve** : la densité osseuse lombaire basse est fréquente chez les cyclistes sur route ; un essai ouvert montre un intérêt de courtes séances de sauts (preuve C) [@hilkens2024]. Moins établi pour le vététiste (`science/B`).
- **Coût** : une séance modèle de 5 minutes et un rappel.
- **Verdict** : **à faire**, proposée par défaut aux cyclistes purs, sans jamais parler de fragilité osseuse, et pas en cas de fracture de fatigue passée (avis médical d'abord).

## 17. Comparaison anonyme avec d'autres athlètes

- **Preuve** : la comparaison sociale motive certains et fait décrocher d'autres [@tong2018].
- **Verdict** : **pas par défaut.** À la rigueur, sur volontariat, et sur l'assiduité seulement.

## Ce qu'il faut retenir

- **Les idées qui valent le coup remettent le coach au centre** (1, 6, 11, 14) ou coûtent presque rien (8 simple, 16).
- **Les idées qui font rêver sont celles où l'IA remplace un jugement humain** (5, 9, 12). Ce sont aussi celles où la science ne suit pas et où le risque juridique est le plus fort.
- **Aucune de ces idées ne répare un produit que les athlètes n'utilisent pas.** L'expérience 1 de `experiences.md` passe avant.

## Sources

[@robineau2016] [@ronnestad2010b] [@saw2016] [@saw2015b] [@dobbs2019] [@duking2021] [@manresarocamora2021] [@oliosi2026] [@ogura2026] [@ortiz2016] [@yoma2025] [@souissi2021] [@greig2023] [@lemense2024] [@weakley2020] [@foster2001] [@meeusen2013] [@mountjoy2023] [@gencoglu2023] [@zhang2020] [@hilkens2024] [@tong2018].
