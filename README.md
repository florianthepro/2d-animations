# STRICHE

> *„Ein Strich, ein Gag, ein Grab."*

Kurze, absurde Sketch-Animationen mit Strichmännchen auf weißem Grund — die
Web-Umsetzung des Konzepts in [`KONZEPT.md`](KONZEPT.md). Ein Gag, ein Twist,
meistens ein Todesfall. Dann Cut. **FSK 18** (absurde Cartoon-Gewalt).

## Starten

Reines HTML/CSS/JS — kein Build, keine Abhängigkeiten. Einfach `index.html`
im Browser öffnen (oder einen kleinen Server nutzen):

```bash
python3 -m http.server 8000   # danach http://localhost:8000
```

Beim Start erscheint das **FSK-18-Gate**. Mit „Weiter ›" geht es in die Bühne.

## Steuerung

- `‹ zurück` · `abspielen` / `pause` · `weiter ›`
- Tastatur: ← / → blättern, `Leertaste` startet/pausiert.

## Die Sketche

| # | Titel | Pointe |
|---|-------|--------|
| 1 | **Highfive** | Abklatschen → beide Arme explodieren. *„…lohnt sich nie."* |
| 2 | **Anleitung** | „Nicht den roten Knopf." Er drückt ihn. Muffin: *„Hab's ihm gesagt."* |
| 3 | **Diät** | Kevin auf der Waage. Sie zeigt „NEIN". Der Boden verschluckt ihn. |
| 4 | **Umarmung** | Zwei Striche verheddern sich zum Knoten, lösen sich auf. Herz. |
| 5 | **Der Vernünftige** | Er sagt „Nein.", bleibt stehen — Klavier fällt nur auf ihn. |

## Sketch-Editor & Player (`.2dsk`)

Ein visueller Editor zum Bauen eigener flüssiger Strichmännchen-Sketche —
mit Keyframe-Timeline, artikulierten Figuren (Arme/Beine als Gelenkwinkel),
Squash & Stretch und Easing pro Keyframe.

- **`editor.html`** — Sketch-Editor. Objekte/Presets hinzufügen (Strichmann,
  Klavier, Waage, Muffin, Herz …), auf der Bühne ziehen, Keyframes setzen
  (Auto-Key), Timeline scrubben, als `.2dsk` exportieren.
- **`player.html`** — lädt eine `.2dsk` (Upload oder Drag & Drop) und spielt
  sie flüssig ab.
- **`sketch-engine.js`** — gemeinsame Laufzeit (Datenmodell, Easing-Interpolation,
  SVG-Rendering), die Editor und Player teilen — so sieht die Vorschau im Editor
  exakt aus wie im Player.
- **`sketches/highfive.2dsk`** — Beispiel: der „Highfive"-Sketch, im Editor
  gebaut. Im Player laden und ansehen.

Das **`.2dsk`-Format** ist reines JSON: eine Szene aus Objekten (`stickman`,
`line`, `circle`, `rect`, `path`, `text`, `splat`, `group`), die über
Keyframe-Spuren (`x, y, rot, sx, sy, op` und bei Figuren `armL/armR/legL/legR`)
animiert werden. Jeder Keyframe hat eine eigene Easing-Kurve
(`smooth`, `gravity`, `back`, `bounce`, `elastic`, …).

## Aufbau

| Datei | Inhalt |
|-------|--------|
| `index.html` | Seite, FSK-Gate, Bühne, Steuerung |
| `styles.css` | „Simple Lines"-Stil: Schwarz auf Weiß, ein roter Akzent |
| `sketches.js` | Die 5 Sketche als eigenständige SVG-Szenen |
| `app.js` | Player: Ablauf, Weißblenden, Steuerung |
| `editor.html` | Visueller Sketch-Editor mit Keyframe-Timeline |
| `player.html` | Player für hochgeladene `.2dsk`-Dateien |
| `sketch-engine.js` | Gemeinsame `.2dsk`-Laufzeit (Editor + Player) |
| `sketches/*.2dsk` | Beispiel-Sketche |

## Technik

- **Reines SVG:** Figuren = ein paar `<line>`/`<circle>`-Elemente.
- **Flüssige Cartoon-Animation:** weiche Easing-Kurven, Squash & Stretch,
  Anticipation, Follow-through und Bounce.
  - Ganze Figur bewegen → `transform: translate/scale` auf `<g>`-Wrapper.
  - Gliedmaßen drehen → `transform-box: view-box` + `transform-origin` am
    Gelenk, `rotate()` mit Easing.
  - Squash & Stretch → `transform-box: fill-box`, `transform-origin: 50% 100%`.
- **Farbe = Pointe:** alles Schwarz-Weiß, einzige Ausnahme Rot (Blut).
- **Weißblenden** zwischen den Gags über kurze `opacity`-Cuts.

Kein Build, keine Abhängigkeiten — alles läuft über CSS-Keyframes im Browser.
