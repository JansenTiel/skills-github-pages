DEPLOY IN NETLIFY

Upload de INHOUD van deze map, niet een bovenliggende map.
Dus index.html moet direct op root van je Netlify deploy staan.

Bestanden op root:
- index.html
- login.html
- products.html
- scan.html
- stock.html
- outscans.html
- _redirects

SUPABASE
1. Open sql/supabase_setup.sql en run deze in Supabase SQL editor.
2. Voeg gebruikers toe via Supabase Authentication > Users.
3. Stel bij Authentication > URL Configuration in:
   Site URL: jouw Netlify URL
   Redirect URL: jouw Netlify URL/update-password.html

BELANGRIJK
- Geen open registratie in de site.
- Reset wachtwoord loopt via e-mail.
