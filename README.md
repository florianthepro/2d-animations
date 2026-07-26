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

## Aufbau

| Datei | Inhalt |
|-------|--------|
| `index.html` | Seite, FSK-Gate, Bühne, Steuerung |
| `styles.css` | „Simple Lines"-Stil: Schwarz auf Weiß, ein roter Akzent |
| `sketches.js` | Die 5 Sketche als eigenständige SVG-Szenen |
| `app.js` | Player: Ablauf, Weißblenden, Steuerung |

## Technik

- **Reines SVG:** Figuren = ein paar `<line>`/`<circle>`-Elemente.
- **On-twos-Ruckeln:** harte Pose-Wechsel über `opacity` + `steps()` statt
  weicher Easing-Kurven — ruckelig-charmant.
- **Farbe = Pointe:** alles Schwarz-Weiß, einzige Ausnahme Rot (Blut).
- **Harte Weißblenden** zwischen den Gags über kurze `opacity`-Cuts.
