# Relais intervals.icu

Petit serveur Cloudflare (gratuit) qui garde **la clé API de coach de Nathan**. Les athlètes n'ont jamais de clé à donner : il suffit qu'ils aient accepté Nathan comme coach sur intervals.icu.

Ce qu'il fait :
- fin de séance dans l'appli → activité muscu dans l'intervals de l'athlète (RPE, durée, récap, lignes FICHE des tests). Si la montre a déjà enregistré une muscu à la même heure, il la complète au lieu d'en créer une 2e ;
- toutes les heures → pose les séances Charge Utile à venir (avec lien direct), les courses et les blocs de la saison dans les calendriers intervals ; retire une séance future que Nathan a supprimée ;
- `coach.html` (avec le PIN) → forme, charge par semaine, séances faites, derniers tests, pour les 4 athlètes.

## Mise en route (une seule fois, ~10 min)

1. Crée un compte gratuit sur dash.cloudflare.com.
2. **Workers & Pages → Create → Import a repository** → autorise GitHub → dépôt `nathanmtb66/Charge-Utile`.
   - Project name : `charge-utile-relais` · **Root directory : `relais`** · commande de build : vide · deploy : `npx wrangler deploy`.
3. Une fois déployé : le worker → **Settings → Variables and Secrets → Add** (type **Secret**) :
   - `ICU_KEY` = ta clé API intervals (intervals.icu → Settings → Developer Settings → API key) ;
   - `PIN` = un code à toi (4 à 8 chiffres), pour la vue coach.
4. Copie l'adresse du worker (`https://charge-utile-relais.<ton-compte>.workers.dev`) et donne-la à Claude : il la met dans `docs/data/config.json` et publie.
5. Contrôle : `https://…workers.dev/ping` doit répondre `{"ok":true,"cle":true,"pin":true}`.

Ensuite, chaque push sur `main` redéploie le relais tout seul.

## Tests

`node qa/relais.js` fait tourner ce worker contre un faux intervals.icu (création, montre, doublons, homonymes, PIN, synchro, refus de droits). `node qa/intervals.js` teste l'appli + la vue coach de bout en bout.
