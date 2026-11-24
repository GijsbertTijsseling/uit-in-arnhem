<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## UI/UX & Design Richtlijnen (Uit in Arnhem)

Volg onderstaande design- en stylingregels strikt voor alle pagina's en componenten:

1. **Geen pillen / badges boven titels**: Plaats géén capsules of decoratieve tags (zoals "✨ GRATIS VOOR IEDEREEN" of categorietags) boven paginakoppen (H1). Houd titels rustig, krachtig en redactioneel.
2. **Geen marketing trust badges of vinkjesrijen**: Vermijd 'marketing-clutter' zoals rijtjes met vinkjes onder koppen (bijv. "✓ 100% Gratis", "✓ Kwaliteitscontrole", "✓ Bereik duizenden bezoekers"). Dit leidt af en doet afbreuk aan het culturele/redactionele karakter.
3. **Geen emoticons in knoppen of formulierelementen**: Gebruik géén emoticons (zoals 🎉, 🎟️, ✍️, 👑, ✨) in formulierknoppen, statuslabels of toggle-opties. Gebruik uitsluitend duidelijke, zakelijke en strakke typografie.
4. **Uniforme kleuren bij toggle-opties**: Gebruik bij selectie- of toggleknoppen (zoals Gratis vs Betaald) géén verschillende felle kleuren (zoals groen vs oranje). Hanteer één consistente, professionele stijl: actieve selectie neutraal donker (`bg-zinc-900 text-white`) en inactief neutraal (`bg-zinc-50 border-zinc-200 text-zinc-700`).
5. **Eenduidige upload-flow (geen URL-dubbelingen)**: Bied bij media een directe, duidelijke uploadzone aan. Vraag niet dubbelop om een directe URL ("of vul hieronder een URL in:"). Toon bij een voltooide upload een nette preview met de optie om een andere foto te kiezen.
6. **Strikte baseline-uitlijning van invoervelden**: In meerkoloms formuliergrids moeten de inputvelden altijd op exact dezelfde horizontale hoogte starten. Vang labels die over meerdere regels breken op met een consistente hoogte (bijv. `h-9 flex items-end mb-2`) zodat velden naast elkaar niet verspringen.

## Kleurensysteem & Visuele Verfijning (Publieke Site)

Het publieke platform hanteert een subtiel warm, helder en redactioneel neutraal kleurensysteem (centraal gedefinieerd via semantische Tailwind v4 tokens in `src/app/globals.css`). Vermijd koele `zinc`/`gray`/`slate`-tinten op publieke pagina's én vermijd een uitgesproken beige of landelijke uitstraling.

### Semantische Kleurtokens (`@theme inline`)
- **Canvas (body background):** `bg-canvas` (`#FDFCFA`)
- **Surface (kaarten & navigatie):** `bg-surface` (`#FFFFFF`) — houd kaarten puur wit
- **Secondary background:** `bg-surface-subtle` (`#FAF9F6`) — selectief voor zachte sectiebanden
- **Muted background:** `bg-surface-muted` (`#F5F3F0`) — voor afwisselende banden (zoals pre-footer nieuwsbrief) en infoblokken
- **Accent background:** `bg-surface-accent` (`#EEEAE4`) — uitsluitend gedoseerd voor kleine accenten, hover-states of subtiele chips
- **Borders:** `border-border-warm` (`#E7E4DF`)
- **CTA-blok achtergrond (Uitagenda / promo):** `bg-cta-tint` (`#FFF0E7`) met subtiele rand `border-cta-border` (`#F5D7C6`)
- **Headings & donkere secties:** `text-ink` / `bg-ink` (`#121212`)
- **Body text:** `text-ink-body` (`#494744`)
- **Muted text:** `text-ink-muted` (`#6B6761` — WCAG AA > 4,5:1 op alle lichte oppervlakken)
- **Tekst op donkere secties (`#121212`):** `text-ink-dark-body` (`#D8D4CD`) en `text-ink-dark-muted` (`#A8A39B`)
- **Brand accent:** `#FF4F00` (hover `#E04500`, zachte tint `#FFF3ED`)

### Richtlijnen voor Shadows, Foto-overlays & Achtergronden
- **Zachte shadows:** Gebruik `shadow-card` (ruststand) en `hover:shadow-card-hover` (hover) in plaats van zware `shadow-xl`/`shadow-2xl` op reguliere kaarten. Plaats geen zware shadows op lichtoranje CTA-blokken (`bg-cta-tint`).
- **Heldere fotografie met sterk onderste tekstcontrast:** Dim grote fotokaarten, wijkkaarten, categoriekaarten en sfeerbeelden niet over het volledige vlak met `opacity-*`. Houd de bovenkant van de foto helder en gebruik een sterke onderste gradient achter de tekst (`inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/55 to-transparent`) voor voldoende contrast op zowel lichte als drukke foto's. Maak kleine tekstlinks op fotografie wit (`text-white`) met uitsluitend een oranje pijltje (`text-[#FF4F00]`).
- **Uitagenda CTA-blokken:** Gebruik voor grote CTA-blokken richting de Uitagenda geen zwarte vlakken, maar de subtiele lichtoranje tint `bg-cta-tint` (`#FFF0E7`) met `border-cta-border`, donkere titels (`text-ink`), donkere broodtekst (`text-ink-body`) en de bestaande oranje CTA-knop (`surface="light"`), zonder zware shadows. De donkere footer (`#121212`) blijft behouden.
- **Visueel ritme (zonder harde scheidingslijnen):** Gebruik het warme palet bewust om secties rustig van elkaar te onderscheiden zonder overmatige borders:
  - Navigatie: `bg-surface` (`#FFFFFF`)
  - Uitgelicht verhaal & Binnenkort in Arnhem: `bg-canvas` (`#FDFCFA`)
  - Nieuwste artikelen: `bg-surface-subtle` (`#FAF9F6`)
  - Interactieve wijkkaart: `bg-canvas` (`#FDFCFA`)
  - Arnhem door jouw ogen: `bg-surface-muted` (`#F5F3F0`)
  - Pre-footer nieuwsbrief: `bg-surface-subtle` (`#FAF9F6`)
  - Footer: `bg-ink` (`#121212`)
- **Open redactionele layouts:** Vermijd onnodige kaartcontainers, borders en shadows rondom uitgelichte verhalen en artikeloverzichten op de homepage; laat 100% heldere fotografie en typografie voor zichzelf spreken en haal speelsheid uit compositie en verhoudingen (bijv. 16:10 split-layout, asymmetrisch artikeloverzicht en subtiele verticale verspringing van 8–20px op desktop in de community-fotogalerij).
- **Uitzonderingen:** Bestaande agenda-items (`EventCard.tsx`, inclusief de groene Gratis-badge, shadows en hover-effecten) en het admin/CMS (`/admin/*`) blijven buiten deze publieke paletwijzigingen en behouden hun eigen styling.
