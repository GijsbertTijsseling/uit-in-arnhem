# Uit in Arnhem - Agenda Scraper Engine

Deze module verzorgt het periodiek (automatisch 2× per maand, uitbreidbaar naar dagelijks) scrapen, valideren en synchroniseren van culturele agenda's van podia in en rondom Arnhem (o.a. Musis & Stadstheater, Luxor Live, Posttheater en toekomstige locaties).

## Architectuur
- **Taal:** Python 3.11+
- **Host:** Google Cloud Run (Jobs)
- **Planning:** Google Cloud Scheduler (`0 3 1,15 *` in tijdzone `Europe/Amsterdam`)
- **Database:** Supabase (`public.events`, `public.agenda_sources`, `public.agenda_sync_logs`)

## Belangrijke Kenmerken
1. **Status Lifecycle:** `published` -> `missing` -> `cancelled`. Geen haastige harde deletes; een event moet in 2 opeenvolgende volledige scrapes ontbreken om geannuleerd te worden.
2. **Handmatige Overrides Beschermd:** Zodra een redacteur in de beheeromgeving een titel, beschrijving of afbeelding aanpast (`is_manually_edited = true`), worden die velden niet overschreven.
3. **Meerdere Speeldata Gegroepeerd:** Voorstellingen met meerdere data worden opgeslagen met `production_id` en `performances` JSONB, waardoor de agenda overzichtelijk blijft.
4. **Circuit Breaker:** Als een website opeens >40% minder events levert, wordt de verwijder-reconciliatie overgeslagen om data-verlies te voorkomen.

## Lokaal Uitvoeren

### 1. Virtual Environment & Dependencies
```bash
python3 -m venv scraper/.venv
scraper/.venv/bin/pip install -r scraper/requirements.txt
```

### 2. Testrun uitvoeren (Dry-Run)
Zonder database-writes:
```bash
# Alle actieve bronnen testen (beperkt tot 3 items per zaal):
scraper/.venv/bin/python scraper/main.py --dry-run --limit 3

# Specifieke zaal testen:
scraper/.venv/bin/python scraper/main.py --source musis --dry-run
scraper/.venv/bin/python scraper/main.py --source luxor --dry-run
scraper/.venv/bin/python scraper/main.py --source posttheater --dry-run
```

### 3. Live Synchronisatie naar Supabase
Zorg dat `SUPABASE_URL` en `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` staan:
```bash
scraper/.venv/bin/python scraper/main.py
```

## Deployment naar Google Cloud Run

Voer het deployment script uit:
```bash
export GCP_PROJECT_ID="jouw-gcp-project-id"
./scraper/deploy.sh
```

