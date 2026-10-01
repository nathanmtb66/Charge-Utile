# Vision : quel problème, pour qui, pourquoi maintenant

*Phase 6. S'appuie sur les phases 1 à 5. Écrit le 1er octobre 2026.*

## Le problème précis

**Un athlète d'endurance sait qu'il devrait faire de la force. Il la fait mal, ou il ne la fait pas, parce qu'elle vit à côté de son entraînement.**

Trois faits l'établissent :

1. **La force lourde rend l'athlète d'endurance plus économe et plus résistant en fin d'effort**, sans prise de poids notable : environ 4 % d'économie de course en moins, 371 → 400 W sur 5 min après 3 h de vélo [@denadai2017] [@ronnestad2011] [@llanoslagos2026]. Ce n'est plus un débat.
2. **Les athlètes ont peur qu'elle abîme leur endurance, et ne savent pas la doser** : c'est la douleur la plus citée (68 citations sur 188, `business/04-douleurs.md`). La science donne pourtant des règles claires : séparer de 6 à 24 h, ne pas aller à l'échec, garder une séance par semaine en saison [@robineau2016] [@robinson2024] [@ronnestad2010b].
3. **Un programme n'agit que s'il est fait.** Sous environ 75 % de séances faites, l'effet d'un programme de prévention n'est plus démontré [@viiala2026]. Les cyclistes lâchent la force en saison, par fatigue et manque de temps [@vikestad2025]. Et la moitié des utilisateurs d'une appli de santé l'abandonne en quelques semaines : médiane de 70 % d'abandon en 100 jours [@pratap2020].

Le problème n'est donc pas « il manque un carnet de musculation ». Il est : **doser la force autour de l'endurance, la faire exécuter correctement par un athlète seul en salle, et savoir si elle est faite.**

## Pour qui

- **D'abord** : le coach ou préparateur d'athlètes d'endurance compétiteurs de 16 à 30 ans (VTT, route, trail, triathlon, nordique), qui suit 5 à 20 athlètes, sans préparateur physique dédié, sur intervals.icu, Nolio ou TrainingPeaks. Aujourd'hui : Nathan.
- **Ensuite** : ses athlètes, qui ne paient pas et ne créent pas de compte.
- **Pas pour** : le pratiquant de musculation, le grand public qui veut un programme automatique, les clubs professionnels équipés (Smartabase, Athlète 360).

## Le travail à faire (« job to be done »)

> **Coach** : « Quand je planifie la semaine d'un athlète, je veux y glisser une séance de force qui ne casse pas ses séances clés, qu'il fera correctement sans moi, et dont je verrai le résultat là où je regarde déjà son endurance, pour qu'il progresse sans que j'y passe une soirée. »

> **Athlète** : « Quand j'arrive en salle après une journée de cours, je veux ouvrir mon téléphone et qu'on me dise quoi faire, à quelle charge et à quel rythme, pour ne pas réfléchir et ne pas me blesser. »

Ce que le coach « embauche » aujourd'hui pour ce travail : un PDF, un message WhatsApp, un lien YouTube collé dans la description d'une séance intervals, un tableur, ou une deuxième appli (Hevy, TrainHeroic) dont il recopie les résultats (`business/03`, `business/04`). Le vrai concurrent, c'est **l'habitude**.

## Pourquoi maintenant

1. **L'IA rend le logiciel sur mesure presque gratuit.** Un seul développeur a construit en quelques mois ce qui demandait une équipe : 190 exercices animés, un relais, des tests au capteur. Une séance dictée coûte 3 à 6 centimes (`business/06`). **Mais cet avantage est partagé par tous** : écrire une séance par IA est devenu banal (`business/01`). L'IA baisse le coût, elle ne fait pas la différence.
2. **intervals.icu a ouvert la porte** : API complète, usage commercial permis, 160 000 athlètes « data », la France en 2e pays, et aucun module de force (`business/03`). Une dizaine d'applis s'y engouffrent depuis fin 2025 : la fenêtre est réelle et courte.
3. **Les grands se réorganisent** : Garmin a racheté TrainingPeaks et TrainHeroic (juillet 2026), Strava a racheté Runna et refait son journal de force (mai 2026). La force des endurants devient un sujet central. **Cela valide le besoin et réduit le temps disponible.**
4. **La science est mûre** : méta-analyses 2022-2026 sur l'interférence, l'économie, la durabilité, l'échec, la densité osseuse des cyclistes. On peut écrire des règles sourcées (`regles/`), ce qui était impossible il y a dix ans.

## Ce que Charge Utile est, en une phrase

**La boucle complète de la force pour l'athlète d'endurance : le coach prescrit en une minute, l'athlète exécute guidé et hors-ligne, l'appli ajuste chaque série, le résultat revient dans la plateforme d'endurance, et la séance suivante en tient compte.**

Chaque maillon existe ailleurs. Personne ne les relie pour ce public (`business/01`). C'est un avantage de **combinaison**, étroit et copiable. Il ne tient que par l'exécution et par le contenu expert.

## Ce que ça devient dans 3 ans, si ça marche

**Scénario honnête** (le plus probable si les critères de `business/08` sont atteints) :
- Nathan, diplômé, suit 10 à 12 athlètes en préparation physique à distance, avec l'appli comme outil de travail.
- 20 à 60 coachs d'endurance francophones utilisent le module, la plupart sur intervals.icu et Nolio, pour 2 € par athlète.
- 2 ou 3 structures (club, team, section) l'utilisent comme référence.
- Chiffre d'affaires : **10 000 à 25 000 € par an**. Un complément de revenu sérieux, pas une entreprise qui embauche (`business/06`).
- La base de connaissances et les 440 exercices font de l'appli une **référence francophone de la force pour l'endurance** : c'est l'actif qui dure.

**Scénario haut** (peu probable sans équipe ni financement) : une version anglaise, une appli OAuth officielle sur intervals.icu et TrainingPeaks, quelques centaines de coachs. Il demande une décision en 2028, données en main.

**Scénario où ça ne marche pas** : les coachs ne paient pas, Garmin ou Nolio comblent le manque. Charge Utile reste l'outil de Nathan, et un excellent projet de fin d'études. **Ce n'est pas un échec.**

## Ce que Charge Utile ne sera pas

- Un carnet de musculation de plus (Hevy et Strong sont gratuits et suffisent).
- Un coach automatique sans humain (Runna, WHOOP, Garmin le font avec des moyens sans commune mesure).
- Un outil médical ou de rééducation (ligne du dispositif médical, `business/07`).
- Une plateforme d'endurance (elle se branche sur les plateformes, elle ne les remplace pas).

## Sources

[@denadai2017] [@ronnestad2011] [@llanoslagos2026] [@robineau2016] [@robinson2024] [@ronnestad2010b] [@viiala2026] [@vikestad2025] [@pratap2020]. Le reste renvoie aux fichiers `business/` et `science/`.
