"""Modèle économique de Charge Utile : coûts unitaires et projections (06-modele-economique.md).
Toutes les hypothèses sont en tête de fichier ; changer une valeur et relancer :
    python3 recherche/_outils/modele_eco.py
Prix et taux vérifiés le 30/09-01/10/2026 (voir sources dans 06) ; le reste = hypothèses."""
EUR = 0.86          # 1 $ en € (ordre de grandeur, hypothèse)
# --- coûts techniques vérifiés ---
API_IN, API_OUT, CACHE_R, CACHE_W = 2.0, 10.0, 0.20, 2.50   # $/M tokens, Sonnet 5.5 (claude.com/pricing)
STRIPE_PCT, STRIPE_FIX = 0.015, 0.25                         # carte standard EEE
CF_WORKERS = 5 * EUR                                        # €/mois, Workers Paid
# --- fiscalité micro-entreprise 2026 (service-public.fr) ---
COTIS_BIC, COTIS_BNC = 0.212, 0.256
# --- hypothèses de taille d'une séance (mesurées dans le dépôt) ---
TOK_CTX_CACHE, TOK_CTX_FRESH, TOK_OUT, TOURS = 7500, 2500, 1100, 2  # 2 tours = écriture + correction

def cout_seance(cache_chaud=True, prix=(API_IN, API_OUT, CACHE_R, CACHE_W)):
    i, o, cr, cw = prix
    ctx = TOK_CTX_CACHE * (cr if cache_chaud else cw) + TOK_CTX_FRESH * i
    return TOURS * (ctx + TOK_OUT * o) / 1e6 * EUR

SEANCES_MOIS = 9    # ≈ 2 séances/sem par athlète

def ligne(nom, prix, cotis, var, fixe_part=0.0):
    stripe = prix * STRIPE_PCT + STRIPE_FIX if prix > 0 else 0
    marge = prix - prix * cotis - stripe - var - fixe_part
    return nom, prix, prix * cotis, stripe, var + fixe_part, marge

if __name__ == '__main__':
    s_hot, s_cold = cout_seance(True), cout_seance(False)
    haiku = cout_seance(True, (1.0, 5.0, 0.10, 1.25)); opus = cout_seance(True, (4.0, 20.0, 0.20, 5.0))
    print(f'Coût API par séance dictée : Sonnet 5.5 {s_hot:.3f} € (cache chaud) / {s_cold:.3f} € (cache froid) ; Haiku 4.5 {haiku:.3f} € ; Opus 5.5 {opus:.3f} €')
    api_ath = SEANCES_MOIS * s_cold
    print(f'Coût API par athlète et par mois (9 séances, pire cas cache froid) : {api_ath:.2f} €')
    print()
    print('| Modèle | Prix unitaire (€/mois) | Cotisations | Stripe | Coûts variables | **Marge nette avant temps de Nathan** |')
    print('|---|---|---|---|---|---|')
    rows = [
      ligne('M1 SaaS coach — coach de 12 athlètes à 2 €/athlète', 24, COTIS_BIC, 12*api_ath, CF_WORKERS/20),
      ligne('M2 Freemium athlète — premium 3,99 €', 3.99, COTIS_BIC, api_ath*0.3, 0.02),
      ligne('M3 Licence structure — 600 €/an (30 athlètes), par mois', 50, COTIS_BIC, 30*api_ath*0.5, CF_WORKERS/20),
      ligne('M4 Marketplace — programme 39 € vendu (commission 25 %)', 39*0.25, COTIS_BIC, 0.1, 0),
      ligne('M5 Service Nathan — prépa physique individuelle 49 €', 49, COTIS_BNC, api_ath, CF_WORKERS/20),
      ligne('M5 Service Nathan — groupe club 8 athlètes × 25 €', 200, COTIS_BNC, 8*api_ath, CF_WORKERS/20),
    ]
    for r in rows: print(f'| {r[0]} | {r[1]:.2f} | {r[2]:.2f} | {r[3]:.2f} | {r[4]:.2f} | **{r[5]:.2f}** |')
    print()
    # projections : (clients payants à M12, M36), prix, marge/u
    scen = {
     'M1 SaaS coach (coachs payants, 12 ath. moyens)': ([1,4,10],[5,25,80], 24, rows[0][5]),
     'M2 Freemium athlète (abonnés premium)':          ([5,25,80],[20,150,600], 3.99, rows[1][5]),
     'M3 Licence structure (structures)':              ([0,1,2],[1,3,8], 50, rows[2][5]),
     'M4 Marketplace (programmes vendus / mois)':      ([1,3,8],[3,10,30], 39*0.25, rows[3][5]),
     'M5 Service Nathan (athlètes payants)':            ([3,8,15],[5,20,40], 49, rows[4][5]),
    }
    print('| Modèle | Pessimiste M12 | Réaliste M12 | Optimiste M12 | Pessimiste M36 | Réaliste M36 | Optimiste M36 |')
    print('|---|---|---|---|---|---|---|')
    for k,(m12,m36,p,mg) in scen.items():
        f = lambda n: f'{n} → CA {n*p*12:,.0f} €/an, marge {n*mg*12:,.0f} €'.replace(',', ' ')
        print(f'| {k} | ' + ' | '.join(f(n) for n in m12+m36) + ' |')
