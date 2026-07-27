# STRICHE — Konzept (FSK 18)

> Kurze, absurde Sketch-Animationen mit Strichmännchen auf weißem Grund.
> Ein Gag, ein Twist, meistens ein Todesfall. Dann Cut.

---

## 1. Logline
Eine Welt aus dünnen schwarzen Linien, in der die Physik jederzeit kündigen darf. Jeder Sketch dauert 3–12 Sekunden, endet mit einer absurden Pointe — oft blutig, immer trocken. Kein roter Faden, keine Moral, nur Timing.

## 2. Ton & Zielgruppe
- **FSK 18** — Cartoon-Gewalt, Galgenhumor, morbide Absurdität. Comic-Blut (dünne rote Spritzer, nie realistisch), Fluchen, schwarze Ironie.
- **Regel:** Es ist nur lustig, weil es *nichts ernst nimmt*. Alles ist so simpel gezeichnet, dass die Gewalt sofort albern statt verstörend wirkt. Overkill als Pointe, nie als Schock.
- **Vorbilder im Geist:** asdfmovie (Timing/Format), Happy Tree Friends (Cartoon-Splatter-Absurdität), Cyanide & Happiness (trockener FSK-18-Humor).

## 3. Visueller Stil — „Simple Lines"
- **Figuren:** klassische Strichmännchen — Kreis-Kopf, ein Strich Körper, vier Striche Gliedmaßen. Schwarze Linie, ~4 px, konstante Strichbreite.
- **Hintergrund:** reines Weiß. Optional eine einzige graue Bodenlinie. Nichts sonst.
- **Farbe:** alles Schwarz-Weiß — **einzige Ausnahme:** Rot (Blut) und selten Gelb (Feuer). Der Farbtupfer *ist* die Pointe.
- **Mimik:** minimalistisch — zwei Punktaugen, ein Strichmund. Emotion kommt aus Pose und Timing, nicht aus Details.
- **Animation:** ruckelig-charmant, ~8–12 fps „on twos", harte Cuts statt weicher Übergänge. Bewegung übertrieben (Squash & Stretch bis zum Reißen).

## 4. Seitenlayout (falls Web-Umsetzung)
So simpel wie der Stil selbst:
- Weiße Seite, oben ein dünner schwarzer Trennstrich, darunter der Titel **STRICHE** in fetter Grotesk.
- Ein einzelner weißer Kasten mit schwarzem 4-px-Rahmen = die „Bühne".
- Darunter drei Textlinks in einer Reihe: `‹ zurück · abspielen · weiter ›` — reine Linien, keine Buttons, keine Schatten.
- Ein FSK-18-Badge (roter Kreis mit „18") oben rechts.
- Keine Farben außer Schwarz auf Weiß + der eine rote Akzent. Das Layout „ist" der Zeichenstil.

## 5. Format
- **Sketch-Serie:** jede „Folge" = eine Kette aus 6–10 Mini-Gags hintereinander, getrennt durch harte Weißblenden.
- **Länge:** Folge ~60–90 Sekunden.
- **Running Gags:** ein wiederkehrender Idiot („Kevin"), der jeden Sketch anders stirbt; ein Muffin, der spricht (Hommage/Persiflage); der „Nein."-Typ, der als einziger Vernunft hat und dafür bestraft wird.

## 6. Figuren (alles Striche)

| Figur | Rolle |
|-------|-------|
| **Kevin** | Der ewige Verlierer. Stirbt in jedem Sketch anders — Aufzug, Toaster, eigene Dummheit. Ist in der nächsten Szene wieder da, kommentarlos. |
| **Der Vernünftige** | Sagt trocken „Nein." Wird trotzdem überfahren. |
| **Sprech-Muffin** | Redet fröhlich, während alles um ihn herum eskaliert. |
| **Sensenmann-Strich** | Nur ein Strich mit Sense. Immer zwei Frames zu spät. |

## 7. Beispiel-Sketches (Ton der Pointen)
Alle Gewalt cartoonhaft, absurd, nie realistisch — der Witz ist das *Timing*, nicht das Blut.

1. **„Highfive"** — Zwei Striche wollen abklatschen. Beim Zusammenschlagen der Hände explodieren beide Arme. Sie schauen sich an. *„…lohnt sich nie."* Cut.
2. **„Anleitung"** — Ein Strich liest ein Schild: „Nicht den roten Knopf." Er drückt ihn. Der ganze Bildschirm wird für einen Frame rot. Weiß. Muffin: *„Hab's ihm gesagt."*
3. **„Diät"** — Kevin steht auf der Waage. Die Waage zeigt „NEIN". Der Boden verschluckt ihn. Sensenmann kommt einen Frame zu spät und zuckt mit den Schultern.
4. **„Umarmung"** — Zwei Striche umarmen sich innig. Sie verheddern ihre Linien zu einem Knoten und lösen sich in einen Strichhaufen auf. Herz-Symbol poppt auf. Cut.
5. **„Der Vernünftige"** — Alle rennen auf eine Klippe zu. Er sagt „Nein." — bleibt stehen. Ein Klavier fällt nur auf ihn.

## 8. Struktur einer Folge
`Titelblende (STRICHE, 1 Sek)` → `Gag 1` → *weiß* → `Gag 2` → *weiß* → … → `Endgag mit Kevin` → `schwarzer Cut + Herz/Blutspritzer als Logo`.

## 9. Technik (falls gebaut)
- Reines SVG: Figuren = ein paar `<line>`/`<circle>`-Elemente, per CSS-Keyframes bewegt.
- „Blut" = rote SVG-Spritzer, die für 2–3 Frames eingeblendet und weggecuttet werden.
- On-twos-Ruckeln über `steps()`-Timing statt weicher Easing-Kurven.
- Harte Weißblenden zwischen Gags über kurze `opacity`-Cuts.
- FSK-18-Gate: Startscreen mit „18+ — enthält absurde Cartoon-Gewalt · Weiter / Zurück".

---

**Leitmotiv:** *„Ein Strich, ein Gag, ein Grab."*
