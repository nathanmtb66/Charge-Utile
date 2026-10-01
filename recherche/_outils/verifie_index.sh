#!/bin/sh
# Lance verifie.py sur exactement ce qui est indexé (git add), sans les fichiers bruts en cours d'écriture.
# Usage : sh recherche/_outils/verifie_index.sh
D=$(mktemp -d) && git checkout-index -a --prefix="$D/" && (cd "$D" && python3 recherche/verifie.py); r=$?; rm -rf "$D"; exit $r
