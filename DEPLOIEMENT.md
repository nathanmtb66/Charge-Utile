# Mettre l’appli en ligne (une seule fois, ≈ 5 minutes)

L’hébergement est gratuit (GitHub Pages). Le site est public mais sans nom d’athlète : chaque athlète a un code.

1. Sur github.com, connecté à ton compte : **New repository** → nom `charge-utile` → **Public** → **Create repository**.
2. Sur la page du dépôt vide : **uploading an existing file** → glisse **tout le contenu** du dossier `charge-utile` (les dossiers `docs`, `tools`, `qa` et les fichiers `README.md`, `DEPLOIEMENT.md`) → **Commit changes**.
3. **Settings** → **Pages** → *Source* : **Deploy from a branch** → *Branch* : `main`, dossier **`/docs`** → **Save**.
4. Attends 1 à 2 minutes. L’adresse s’affiche en haut de la page Pages : `https://<ton-compte>.github.io/charge-utile/`.
5. Ouvre `…/charge-utile/?a=demo` sur ton téléphone pour tester, puis donne ton nom de compte GitHub à Claude : il crée les codes de tes 4 athlètes et te donne les 4 liens à leur envoyer.

## Ensuite, pour chaque séance

Tu dictes la séance à Claude (skill « Charge Utile »). Claude écrit le fichier `docs/data/sessions/<code>.json`, le vérifie, puis :
- **si Claude a accès au dépôt** (GitHub connecté à Claude, ou dépôt cloné sur ton ordinateur relié à Claude) : il publie tout seul ;
- **sinon** : il te donne le fichier, tu le glisses dans `docs/data/sessions/` sur github.com (**Add file → Upload files**), 20 secondes.

L’athlète voit la séance à la prochaine ouverture de l’appli avec du réseau.
