# KOBOLD & KOMET — Serienkonzept

> Eine 2D-Animationsserie über eine kleine Waldkreatur und einen verirrten
> Kometen, die in einer leuchtenden Nacht Freunde fürs Leben werden.

---

## 1. Logline

Im **Flüsterwald**, wo die Bäume Geheimnisse tuscheln und der Mond nie ganz
schlafen geht, lebt der kleine Kobold **Pip**. Als eines Nachts der schüchterne
Komet **Fizz** vom Himmel fällt, beginnt eine Freundschaft, die den ganzen Wald
zum Leuchten bringt.

## 2. Ton & Stil

- **Genre:** Warmherzige Gute-Nacht-Serie, fast wortlos, für alle Altersgruppen.
- **Look:** Flaches 2D-Vektordesign, tiefes Nachtblau, warme Glüh-Akzente,
  weiche Formen. Alles bewegt sich sanft — nichts ist hektisch.
- **Erzählweise:** Kurze, ruhige Episoden (~30 Sekunden), getragen von Licht,
  Bewegung und knappen poetischen Untertiteln statt Dialog.
- **Leitmotiv:** *„Geteiltes Licht wird nie weniger."*

## 3. Figuren

| Figur | Beschreibung |
|-------|--------------|
| **Pip** | Ein handgroßer Waldkobold mit Blattmütze. Neugierig, mutig, herzlich. Leuchtet selbst nur schwach — sein Herz aber umso heller. |
| **Fizz** | Ein kleiner Komet mit funkelndem Schweif. Anfangs ängstlich, weil er seinen Glanz verloren glaubt. Verspielt, sobald er sich sicher fühlt. |
| **Uhu Ottokar** | Der weise alte Waldwächter mit Brille. Beobachtet, schmunzelt, greift selten ein. |
| **Die Glühwürmchen** | Ein ganzer Schwarm kleiner Lichter — das Orchester des Waldes. |

## 4. Welt — Der Flüsterwald

Ein ewiger Wald in der blauen Stunde zwischen Abend und Nacht. Pilzhäuser,
uralte Bäume, ein wacher Mond. Licht ist hier eine Währung der Zuneigung:
Wer teilt, leuchtet heller.

## 5. Staffel 1 — Episodenübersicht

1. **Der Sternenfall** — Fizz stürzt in den Wald; Pip findet ihn und schenkt
   ihm zurück, woran er nicht mehr glaubte: sein Leuchten. *(fertig)*
2. **Das Glühwürmchen-Konzert** — Ein grauer Nebel hat den Lichtern des Waldes
   den Glanz gestohlen. Pip und Fizz entfachen sie neu — Funke für Funke. *(fertig)*
3. *Der Mondfischer* — geplant
4. *Wohin die Sterne gehen* — geplant

## 6. Technik

Die Serie läuft vollständig im Browser — **ohne Framework, ohne Build, ohne
externe Dateien**:

- **`index.html`** ist die Serie: Start-Hub *und* Abspieler für beide Folgen.
- **SVG-Figuren** als wiederverwendbare Symbole.
- **CSS-Keyframes** pro Szene, gesteuert über ein `data-scene`-Attribut.
- **`assets/engine.js`** — eine kleine Szenen-Engine (Timeline, Untertitel,
  Play/Pause, Szenensprung, Fortschritt) und ein Hash-Router.
- Respektiert `prefers-reduced-motion` und passt sich Hell-/Dunkelmodus an.

Einfach `index.html` im Browser öffnen — fertig.
