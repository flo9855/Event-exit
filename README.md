# Event App (statisch)

- Mehrere Veranstaltungsorte (Venues) via Dropdown wählbar
- Suche über Titel/Ort/Adresse
- Läuft statisch auf GitHub Pages (keine Server-Abhängigkeiten)

## Struktur
```
/
  index.html
  main.js
  /data
    venues.json
    events.json
```

## Deployment auf GitHub Pages
1. Repo erstellen (öffentlich).
2. Diese Dateien ins Repo legen und committen.
3. GitHub → Settings → Pages → **Source: Deploy from a branch**, Branch `main`, Folder `/ (root)` → Save.
4. Die Seite ist unter `https://<user>.github.io/<repo-name>/` erreichbar.

**Hinweis:** Ressourcen werden relativ (`./data/...`) geladen, daher funktioniert auch der Subpfad.

## Daten anpassen
- `data/venues.json` → Orte ergänzen (eindeutige `id`).
- `data/events.json` → Events mit `venueId` referenzieren.
