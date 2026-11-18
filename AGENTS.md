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
