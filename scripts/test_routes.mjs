const routesToTest = [
  { path: '/', name: 'Home Page', expectedText: 'Uit in Arnhem' },
  { path: '/agenda', name: 'Agenda Overview', expectedText: 'Agenda' },
  { path: '/agenda/nieuwjaarsconcert-orkest-phion-in-musis', name: 'Agenda Detail', expectedText: 'Nieuwjaarsconcert' },
  { path: '/artikelen', name: 'Artikelen Overview', expectedText: 'Artikelen' },
  { path: '/artikelen/gratis-dingen-doen-arnhem', name: 'Article Detail (DB)', expectedText: 'Gratis dingen om te doen' },
  { path: '/login', name: 'Login Page', expectedText: 'Inloggen' },
  { path: '/register', name: 'Register Page', expectedText: 'Redactie Aanmelden' },
  { path: '/admin', name: 'Admin Dashboard', expectedText: 'Dashboard' },
  { path: '/admin/articles', name: 'Admin Articles', expectedText: 'Artikelen beheren' },
  { path: '/admin/articles/new', name: 'Admin New Article', expectedText: 'Nieuw artikel' },
  { path: '/admin/agenda', name: 'Admin Agenda', expectedText: 'Evenementen Beheren' },
  { path: '/admin/agenda/new', name: 'Admin New Agenda Item', expectedText: 'Nieuw agenda item' },
  { path: '/admin/users', name: 'Admin Users', expectedText: 'Gebruikers' },
  { path: '/over-ons', name: 'Over Ons', expectedText: 'Over Uit in Arnhem' },
  { path: '/locatie/koepelgevangenis', name: 'Locatie Koepelgevangenis', expectedText: 'Koepelgevangenis' },
  { path: '/locaties', name: 'Locaties Overzicht', expectedText: 'Locaties' },
  { path: '/admin/locaties', name: 'Admin Locaties', expectedText: 'Vaste Locaties' },
  { path: '/admin/locaties/new', name: 'Admin Nieuwe Locatie', expectedText: 'Nieuwe Vaste Locatie' },
  { path: '/wijken', name: 'Wijken Hub Page', expectedText: 'Wijken van' },
  { path: '/wijken/centrum', name: 'Wijk Centrum Detail', expectedText: 'Centrum &amp; Binnenstad' },
  { path: '/wijken/modekwartier', name: 'Wijk Modekwartier Detail', expectedText: 'Modekwartier &amp; Klarendal' },
];

async function verifyRoutes() {
  const baseUrl = 'http://localhost:3333';
  let failed = 0;
  let passed = 0;

  console.log(`Starting Route Verification against ${baseUrl}...\n`);

  for (const route of routesToTest) {
    try {
      const res = await fetch(`${baseUrl}${route.path}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        },
      });
      const text = await res.text();

      const hasViewport = text.includes('width=device-width');
      const hasText = text.toLowerCase().includes(route.expectedText.toLowerCase());

      if (res.status === 200 && hasViewport && hasText) {
        console.log(`✓ [200 OK] ${route.name.padEnd(24)} (${route.path}) - Responsive viewport verified`);
        passed++;
      } else {
        console.error(`✗ [FAIL] ${route.name} (${route.path}) - Status: ${res.status}, Viewport: ${hasViewport}, Expected text found: ${hasText}`);
        failed++;
      }
    } catch (err) {
      console.error(`✗ [ERROR] ${route.name} (${route.path}) - ${err.message}`);
      failed++;
    }
  }

  console.log(`\nVerification Summary: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

verifyRoutes();
