# Consignes communes aux sous-agents de collecte

Date du jour : 30 septembre 2026. Dépôt : /Users/nathanrousselle/Documents/GitHub/Charge-Utile (dépôt PUBLIC).

## Le produit étudié : Charge Utile
PWA de musculation pour athlètes d'endurance (VTT XCO, route, trail court), créée par Nathan (Font-Romeu, 1800 m, près du CREPS ; étudiant L3 STAPS, compétiteur VTT, photographe-vidéaste). Il entraîne bénévolement 7 athlètes (18-25 ans, régional à national, 8-20 h d'endurance/sem, 1-3 séances de muscu).
- Le coach dicte une séance à Claude (IA), qui écrit un JSON publié sur GitHub Pages.
- L'athlète ouvre un lien personnel (pas de compte), suit la séance hors-ligne : mannequin 3D animé, bips de tempo, minuteurs. Après chaque série il donne son RPE/RIR et l'appli ajuste la charge.
- Proprio à 4 niveaux auto-ajustés, pliométrie, vidéo d'une série, tests guidés (max estimé, mobilité mesurée au capteur du téléphone), onglet Récup (routine générée, respiration guidée, conseils nutrition chiffrés), plan de saison (blocs, courses A/B/C).
- Relais intervals.icu (Cloudflare Worker, clé API du coach) : chaque séance faite part dans intervals.icu ; vue coach : forme, volume par sport, séances faites/ratées.
- 190 exercices, animations faites à la main. Gratuit aujourd'hui, pas encore vendu.

## Règles absolues
1. Tu n'écris QUE ton fichier de sortie dans `recherche/_brut/` (chemin donné dans ta mission). Tu ne touches à rien d'autre, tu ne fais aucune commande git.
2. **Zéro référence inventée.** Tu ne cites que des pages que tu as réellement ouvertes avec WebFetch (ou dont le contenu t'a été renvoyé par WebSearch avec l'URL exacte). Si une page ne s'ouvre pas, dis-le et ne cite pas ce que tu n'as pas lu. Mieux vaut un « non vérifié » honnête qu'un chiffre inventé.
3. Prix : toujours avec la date de vérification (30/09/2026 ou la date affichée) et l'URL de la page de prix. Si le prix n'est pas public, écris « sur devis » ou « non public ».
4. Droits d'auteur : résume avec tes mots. Citations directes ≤ 15 mots, entre guillemets, avec lien.
5. Vie privée : pas de nom de famille d'utilisateurs de forums (pseudo seulement si nécessaire, sinon « un coach sur r/Velo »).
6. Honnêteté : dis quand une info est faible, contradictoire, marketing ou introuvable.
7. Français pour tout ce que tu écris.
8. Budget : sois efficace. Préfère les pages officielles, les pages de prix, les avis App Store/Play/G2/Capterra, Reddit, forums.

## Format des sources (fin de ton fichier)
Termine ton fichier par une section `## Sources vérifiées` contenant un bloc ```json avec un tableau :
{"cle": "trainheroic-prix", "auteurs": "TrainHeroic", "annee": 2026, "titre": "Pricing", "revue": "site officiel", "doi": null, "url": "https://…", "type": "site", "niveau": "D", "verifie": true, "note": "ce que la page montre, en une phrase"}
Clés : minuscules, chiffres, tirets. Uniquement des pages ouvertes.

## Ce que tu renvoies à la fin (message final)
Un résumé de ≤ 250 mots : ce que tu as trouvé d'important, ce que tu n'as pas pu vérifier, le nombre de sources.
