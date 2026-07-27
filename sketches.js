/* STRICHE — Die Sketche.
 *
 * Jeder Sketch ist ein eigenständiges SVG (viewBox 800x450, Boden bei y=380).
 * Animation: flüssige Cartoon-Bewegung — Easing, Squash & Stretch,
 * Anticipation, Follow-through, Bounce. Kein Ruckeln.
 *
 * Bewegungstechnik:
 *   - Ganze Figur bewegen  -> transform: translate/scale auf <g>-Wrapper
 *   - Gliedmaßen drehen    -> transform-box:view-box + transform-origin am
 *                             Gelenk (px), rotate() mit Easing
 *   - Squash & Stretch     -> transform-box:fill-box, transform-origin:50% 100%
 *
 * Jeder Sketch: { id, titel, dauer (ms), svg }.
 */

/* Easing-Kurven (als Kommentar-Referenz):
 *   OUT   cubic-bezier(.16,1,.3,1)      – weiches Abbremsen
 *   IN    cubic-bezier(.55,0,.9,.2)     – Beschleunigen (Schwerkraft)
 *   BACK  cubic-bezier(.34,1.56,.64,1)  – Überschwingen / Pop
 */

/* ---- Bausteine --------------------------------------------------------- */

// Figur-Kern (Kopf, Gesicht, Körper, Beine) — Arme werden je Sketch ergänzt.
function core(x, o = {}) {
  const eyes = o.dead
    ? `<path class="xeye" d="M${x - 9} 254 l8 8 M${x - 1} 254 l-8 8"/>
       <path class="xeye" d="M${x + 1} 254 l8 8 M${x + 9} 254 l-8 8"/>`
    : `<circle class="dot" cx="${x - 6}" cy="259" r="2.6"/>
       <circle class="dot" cx="${x + 6}" cy="259" r="2.6"/>`;
  const mouth = o.mouth || `<line x1="${x - 5}" y1="271" x2="${x + 5}" y2="271"/>`;
  const legs = o.legs ||
    `<line x1="${x}" y1="330" x2="${x - 18}" y2="368"/>
     <line x1="${x}" y1="330" x2="${x + 18}" y2="368"/>`;
  return `
    <circle class="head" cx="${x}" cy="260" r="20"/>
    ${eyes}${mouth}
    <line class="body" x1="${x}" y1="280" x2="${x}" y2="330"/>
    ${legs}`;
}

// Rote Blutspritzer: Sternspikes + Tropfen um (cx,cy).
function splat(cx, cy, r = 40, n = 12) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (i % 2) * 0.35;
    const len = r * (0.55 + ((i * 37) % 10) / 16);
    s += `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * len).toFixed(1)}" y2="${(cy + Math.sin(a) * len).toFixed(1)}"/>`;
  }
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.6;
    const d = r * (1.05 + (i % 2) * 0.25);
    s += `<circle cx="${(cx + Math.cos(a) * d).toFixed(1)}" cy="${(cy + Math.sin(a) * d).toFixed(1)}" r="${3 + (i % 3)}"/>`;
  }
  return `<g class="blood">${s}</g>`;
}

const GROUND = `<line class="ground" x1="40" y1="380" x2="760" y2="380"/>`;

/* ---- SKETCH 1: „Highfive" ---------------------------------------------- */
const s1 = {
  id: 's1', titel: 'Highfive', dauer: 5000,
  svg: `
  <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
    <style>
      /* Einlauf mit weichem Abbremsen */
      #s1 .figL { animation: s1in-l 1.1s cubic-bezier(.16,1,.3,1) both; }
      #s1 .figR { animation: s1in-r 1.1s cubic-bezier(.16,1,.3,1) both; }
      @keyframes s1in-l { from { transform: translateX(-320px); } to { transform: translateX(0); } }
      @keyframes s1in-r { from { transform: translateX(320px); } to { transform: translateX(0); } }

      /* Innenarme: Anticipation (leicht runter) -> hoch zum Abklatschen */
      #s1 .armLi { transform-box: view-box; transform-origin: 330px 290px;
                   animation: s1raiseL 5s both; }
      #s1 .armRi { transform-box: view-box; transform-origin: 470px 290px;
                   animation: s1raiseR 5s both; }
      @keyframes s1raiseL {
        0%,22% { transform: rotate(60deg); }
        30%    { transform: rotate(74deg); }            /* ausholen */
        38%    { transform: rotate(0deg); }             /* KLATSCH */
        40%,100%{ transform: rotate(-14deg) translate(60px,-40px); opacity:0; } /* wegfliegen */
      }
      @keyframes s1raiseR {
        0%,22% { transform: rotate(-60deg); }
        30%    { transform: rotate(-74deg); }
        38%    { transform: rotate(0deg); }
        40%,100%{ transform: rotate(14deg) translate(-60px,-40px); opacity:0; }
      }
      #s1 .armLi { animation-timing-function: cubic-bezier(.5,0,.5,1); }
      #s1 .armRi { animation-timing-function: cubic-bezier(.5,0,.5,1); }

      /* Recoil-Squash beider Figuren beim Knall */
      #s1 .figL, #s1 .figR { transform-box: fill-box; }
      #s1 .squL { transform-box: fill-box; transform-origin: 50% 100%;
                  animation: s1recoil 5s cubic-bezier(.34,1.56,.64,1) both; }
      #s1 .squR { transform-box: fill-box; transform-origin: 50% 100%;
                  animation: s1recoil 5s cubic-bezier(.34,1.56,.64,1) both; }
      @keyframes s1recoil {
        0%,36% { transform: scale(1,1); }
        40%    { transform: scale(1.14,.86) translateX(var(--kick)); }
        58%    { transform: scale(1,1); }
        100%   { transform: scale(1,1); }
      }
      #s1 .squL { --kick: -10px; } #s1 .squR { --kick: 10px; }

      /* Explosion */
      #s1 .boom { transform-box: fill-box; transform-origin: 50% 50%;
                  animation: s1boom 5s cubic-bezier(.16,1,.3,1) both; }
      @keyframes s1boom {
        0%,37% { opacity:0; transform: scale(.1); }
        41%    { opacity:1; transform: scale(1.25); }
        50%    { opacity:1; transform: scale(1); }
        100%   { opacity:.4; transform: scale(1); }
      }

      /* Pointe */
      #s1 .punchline { animation: s1line .6s cubic-bezier(.16,1,.3,1) both; animation-delay: 2.6s; opacity:0; }
      @keyframes s1line { from { opacity:0; transform: translateY(14px);} to { opacity:1; transform: translateY(0);} }
    </style>
    <g id="s1">
      ${GROUND}
      <g class="figL"><g class="squL">
        ${core(330)}
        <line x1="330" y1="290" x2="306" y2="314"/>
        <line class="armLi" x1="330" y1="290" x2="388" y2="250"/>
      </g></g>
      <g class="figR"><g class="squR">
        ${core(470)}
        <line x1="470" y1="290" x2="494" y2="314"/>
        <line class="armRi" x1="470" y1="290" x2="412" y2="250"/>
      </g></g>
      <g class="boom">${splat(400, 250, 60, 14)}</g>
      <text class="punchline" x="400" y="418" text-anchor="middle">…lohnt sich nie.</text>
    </g>
  </svg>`
};

/* ---- SKETCH 2: „Anleitung" --------------------------------------------- */
const s2 = {
  id: 's2', titel: 'Anleitung', dauer: 5600,
  svg: `
  <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
    <style>
      /* Kerl geht zum Knopf, sanftes Auf-und-Ab beim Gehen */
      #s2 .walker { animation: s2walk 1.9s cubic-bezier(.4,0,.4,1) both; }
      @keyframes s2walk {
        0%   { transform: translateX(-150px); }
        100% { transform: translateX(80px); }
      }
      #s2 .bob { transform-box: fill-box; transform-origin: 50% 100%;
                 animation: s2bob .38s ease-in-out 5 both; }
      @keyframes s2bob { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-5px);} }

      /* stehen -> greifen (Arm dreht zum Knopf) */
      #s2 .reach { transform-box: view-box; transform-origin: 500px 290px;
                   animation: s2reach 5.6s both; }
      @keyframes s2reach {
        0%,34% { transform: rotate(38deg); }
        40%    { transform: rotate(-4deg); }   /* Anticipation zurück */
        46%    { transform: rotate(26deg); }   /* DRÜCKEN */
        52%,100%{ transform: rotate(26deg); }
      }
      #s2 .reach { animation-timing-function: cubic-bezier(.3,0,.3,1.4); }

      #s2 .walker { opacity:1; animation: s2walk 1.9s cubic-bezier(.4,0,.4,1) both, s2vanish 5.6s steps(1,end) both; }
      @keyframes s2vanish { 0%,49%{opacity:1} 50%,100%{opacity:0} }

      /* Knopf: gedrückt (staucht) dann weg */
      #s2 .button { transform-box: fill-box; transform-origin: 50% 100%;
                    animation: s2btn 5.6s both; }
      @keyframes s2btn { 0%,45%{ transform: scale(1);} 48%{ transform: scale(1.15,.7);} 52%{ transform: scale(1);} 100%{ transform: scale(1);} }

      /* Vollbild-Rotframe: einmal kurz aufblitzen und weich weg */
      #s2 .redflash { animation: s2red 5.6s ease-out both; }
      @keyframes s2red { 0%,47%{opacity:0} 49%{opacity:.92} 56%{opacity:0} 100%{opacity:0} }

      /* Splat, wo der Kerl war */
      #s2 .gone { transform-box: fill-box; transform-origin: 50% 50%;
                  animation: s2gone 5.6s cubic-bezier(.16,1,.3,1) both; }
      @keyframes s2gone { 0%,55%{opacity:0; transform: scale(.2);} 59%{opacity:1; transform: scale(1.1);} 64%{transform: scale(1);} 100%{opacity:.4; transform: scale(1);} }

      /* Sprech-Muffin ploppt elastisch */
      #s2 .muffin { transform-box: fill-box; transform-origin: 50% 100%;
                    animation: s2muf .7s cubic-bezier(.34,1.56,.64,1) both; animation-delay: 3.4s; opacity:0; }
      @keyframes s2muf { 0%{opacity:0; transform: scale(.2) translateY(20px);} 100%{opacity:1; transform: scale(1) translateY(0);} }
      #s2 .say { animation: s2say .5s ease-out both; animation-delay: 3.8s; opacity:0; }
      @keyframes s2say { from{opacity:0; transform: translateY(10px);} to{opacity:1; transform: translateY(0);} }
    </style>
    <g id="s2">
      ${GROUND}
      <g class="sign">
        <rect class="board" x="80" y="150" width="200" height="70" rx="6"/>
        <line class="post" x1="180" y1="220" x2="180" y2="380"/>
        <text class="signtext" x="180" y="180" text-anchor="middle">NICHT DEN</text>
        <text class="signtext" x="180" y="205" text-anchor="middle">ROTEN KNOPF</text>
      </g>
      <g class="btn">
        <rect class="pedestal" x="600" y="300" width="70" height="80"/>
        <circle class="button" cx="635" cy="300" r="26"/>
      </g>
      <g class="walker"><g class="bob">
        ${core(430)}
        <line x1="430" y1="290" x2="410" y2="314"/>
        <line class="reach" x1="430" y1="290" x2="470" y2="316"/>
      </g></g>
      <g class="gone">${splat(510, 300, 34, 10)}</g>
      <rect class="redflash" x="0" y="0" width="800" height="450"/>
      <g class="muffin">
        <path class="mtop" d="M338 250 q62 -50 124 0 z"/>
        <path class="mcup" d="M346 250 l14 74 h96 l14 -74 z"/>
        <line class="mcup" x1="356" y1="272" x2="454" y2="272"/>
        <circle class="dot" cx="384" cy="236" r="2.6"/>
        <circle class="dot" cx="416" cy="236" r="2.6"/>
        <path d="M386 244 q14 12 28 0"/>
      </g>
      <text class="say" x="400" y="360" text-anchor="middle">„Hab's ihm gesagt."</text>
    </g>
  </svg>`
};

/* ---- SKETCH 3: „Diät" (Kevin) ------------------------------------------ */
const s3 = {
  id: 's3', titel: 'Diät', dauer: 5800,
  svg: `
  <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
    <style>
      /* Kevin wippt nervös, dann fällt er mit Stretch durch den Boden */
      #s3 .kevin { transform-box: fill-box; transform-origin: 50% 100%;
                   animation: s3kev 5.8s both; }
      @keyframes s3kev {
        0%    { transform: translateY(0) scaleY(1); }
        30%   { transform: translateY(-4px) scaleY(1.03); }  /* Schreck */
        44%   { transform: translateY(6px) scaleY(.9); }     /* sackt ein */
        50%   { transform: translateY(30px) scaleY(1.25); }  /* Stretch beim Reinrutschen */
        62%   { transform: translateY(150px) scaleY(1.4); opacity:1; }
        70%,100%{ transform: translateY(240px) scaleY(1.4); opacity:0; }
      }
      #s3 .kevin { animation-timing-function: cubic-bezier(.5,0,.85,.3); }

      /* Anzeige: 0.0 -> NEIN (weicher Wechsel mit Pop) */
      #s3 .zero { animation: s3zero 5.8s ease both; }
      @keyframes s3zero { 0%,26%{opacity:1; transform: scale(1);} 30%{opacity:0; transform: scale(.6);} 100%{opacity:0;} }
      #s3 .disp { transform-box: fill-box; transform-origin: 50% 50%;
                  animation: s3disp 5.8s cubic-bezier(.34,1.56,.64,1) both; }
      @keyframes s3disp { 0%,28%{opacity:0; transform: scale(.4);} 34%{opacity:1; transform: scale(1.25);} 40%{transform: scale(1);} 100%{opacity:1; transform: scale(1);} }

      /* Loch öffnet sich weich */
      #s3 .hole { transform-box: fill-box; transform-origin: 50% 50%;
                  animation: s3hole 5.8s cubic-bezier(.16,1,.3,1) both; }
      @keyframes s3hole { 0%,40%{opacity:0; transform: scaleX(.1);} 50%{opacity:1; transform: scaleX(1);} 100%{opacity:1; transform: scaleX(1);} }

      /* Sensenmann gleitet (zu spät) herein, bremst weich ab */
      #s3 .reaper { animation: s3reap 1s cubic-bezier(.16,1,.3,1) both; animation-delay: 3.9s; opacity:0; }
      @keyframes s3reap { from { opacity:0; transform: translateX(90px);} to { opacity:1; transform: translateX(0);} }

      /* Schulterzucken: beide Arme heben sich weich */
      #s3 .rArmL { transform-box: view-box; transform-origin: 440px 290px;
                   animation: s3shrugL 5.8s cubic-bezier(.34,1.56,.64,1) both; }
      #s3 .rArmR { transform-box: view-box; transform-origin: 440px 290px;
                   animation: s3shrugR 5.8s cubic-bezier(.34,1.56,.64,1) both; }
      @keyframes s3shrugL { 0%,83%{transform: rotate(0);} 92%,100%{transform: rotate(48deg);} }
      @keyframes s3shrugR { 0%,83%{transform: rotate(0);} 92%,100%{transform: rotate(-48deg);} }
      #s3 .shrugText { animation: s3st .5s ease-out both; animation-delay: 5.1s; opacity:0; }
      @keyframes s3st { from{opacity:0; transform: translateY(8px);} to{opacity:1; transform: translateY(0);} }
    </style>
    <g id="s3">
      ${GROUND}
      <g class="hole"><ellipse class="pit" cx="400" cy="380" rx="72" ry="14"/></g>
      <g class="scale">
        <rect class="scalebody" x="330" y="350" width="140" height="30" rx="6"/>
        <rect class="scaledisp" x="360" y="322" width="80" height="26" rx="4"/>
        <text class="zero" x="400" y="341" text-anchor="middle">88.8</text>
        <text class="disp" x="400" y="341" text-anchor="middle">NEIN</text>
      </g>
      <g class="kevin">
        ${core(400, { mouth: `<path d="M392 272 q8 8 16 0"/>` })}
        <line x1="400" y1="290" x2="378" y2="312"/>
        <line x1="400" y1="290" x2="422" y2="312"/>
      </g>
      <g class="reaper">
        <line class="scythe" x1="500" y1="150" x2="500" y2="380"/>
        <path class="blade" d="M500 150 q58 4 72 52"/>
        ${core(440, { legs: `<line x1="440" y1="330" x2="424" y2="368"/><line x1="440" y1="330" x2="456" y2="368"/>` })}
        <line class="rArmL" x1="440" y1="290" x2="416" y2="314"/>
        <line class="rArmR" x1="440" y1="290" x2="464" y2="314"/>
        <text class="shrugText" x="440" y="210" text-anchor="middle">¯\\_( )_/¯</text>
      </g>
    </g>
  </svg>`
};

/* ---- SKETCH 4: „Umarmung" ---------------------------------------------- */
const s4 = {
  id: 's4', titel: 'Umarmung', dauer: 5400,
  svg: `
  <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
    <style>
      /* Zusammenlaufen, weich abbremsen */
      #s4 .fA { animation: s4inL 1.1s cubic-bezier(.16,1,.3,1) both; }
      #s4 .fB { animation: s4inR 1.1s cubic-bezier(.16,1,.3,1) both; }
      @keyframes s4inL { from{transform: translateX(-120px);} to{transform: translateX(0);} }
      @keyframes s4inR { from{transform: translateX(120px);} to{transform: translateX(0);} }
      /* nach dem Zusammentreffen ausblenden -> Umarmung erscheint */
      #s4 .apart { animation: s4apart 5.4s ease-in-out both; }
      @keyframes s4apart { 0%,22%{opacity:1;} 28%,100%{opacity:0;} }

      #s4 .hug { animation: s4hug 5.4s ease-in-out both; }
      @keyframes s4hug { 0%,24%{opacity:0;} 30%,48%{opacity:1;} 54%,100%{opacity:0;} }
      /* die Umarmung „drückt" kurz zu (Squash) */
      #s4 .hugsq { transform-box: fill-box; transform-origin: 50% 100%;
                   animation: s4hugsq 5.4s cubic-bezier(.34,1.56,.64,1) both; }
      @keyframes s4hugsq { 0%,30%{transform: scale(1);} 38%{transform: scale(1.08,.94);} 46%{transform: scale(1);} 100%{transform: scale(1);} }

      /* Knoten dreht sich langsam ein */
      #s4 .knot { transform-box: fill-box; transform-origin: 50% 60%;
                  animation: s4knot 5.4s ease-in-out both; }
      @keyframes s4knot { 0%,48%{opacity:0; transform: rotate(0) scale(.9);} 55%{opacity:1; transform: rotate(0) scale(1);} 66%{opacity:1; transform: rotate(200deg) scale(.7);} 72%,100%{opacity:0; transform: rotate(300deg) scale(.4);} }

      /* Strichhaufen fällt weich zusammen */
      #s4 .pile { animation: s4pile 5.4s cubic-bezier(.34,1.56,.64,1) both; }
      @keyframes s4pile { 0%,70%{opacity:0; transform: translateY(-20px) scaleY(.6);} 76%{opacity:1; transform: translateY(0) scaleY(1);} 100%{opacity:1; transform: translateY(0) scaleY(1);} }

      /* Herz ploppt elastisch und schwebt sanft */
      #s4 .heart { transform-box: fill-box; transform-origin: 50% 100%;
                   animation: s4heart 5.4s both; }
      @keyframes s4heart {
        0%,72%  { opacity:0; transform: scale(.1) translateY(0); }
        78%     { opacity:1; transform: scale(1.3) translateY(0); }
        84%     { opacity:1; transform: scale(1) translateY(0); }
        100%    { opacity:1; transform: scale(1) translateY(-18px); }
      }
      #s4 .heart { animation-timing-function: cubic-bezier(.34,1.56,.64,1); }
    </style>
    <g id="s4">
      ${GROUND}
      <g class="apart">
        <g class="fA">${core(330)}<line x1="330" y1="290" x2="306" y2="314"/><line x1="330" y1="290" x2="354" y2="314"/></g>
        <g class="fB">${core(470)}<line x1="470" y1="290" x2="446" y2="314"/><line x1="470" y1="290" x2="494" y2="314"/></g>
      </g>
      <g class="hug"><g class="hugsq">
        <circle class="head" cx="380" cy="258" r="20"/>
        <circle class="head" cx="420" cy="258" r="20"/>
        <line class="body" x1="380" y1="278" x2="388" y2="330"/>
        <line class="body" x1="420" y1="278" x2="412" y2="330"/>
        <line x1="380" y1="292" x2="430" y2="300"/>
        <line x1="420" y1="292" x2="370" y2="300"/>
        <line x1="388" y1="330" x2="368" y2="368"/>
        <line x1="388" y1="330" x2="404" y2="368"/>
        <line x1="412" y1="330" x2="432" y2="368"/>
        <line x1="412" y1="330" x2="396" y2="368"/>
      </g></g>
      <g class="knot">
        <path d="M360 300 C 420 240, 380 360, 440 300 S 360 240, 400 320 S 460 300, 380 280"/>
        <path d="M370 322 C 430 282, 388 360, 450 312"/>
        <circle class="head" cx="384" cy="266" r="18"/>
        <circle class="head" cx="418" cy="272" r="18"/>
      </g>
      <g class="pile">
        <line x1="345" y1="374" x2="405" y2="364"/>
        <line x1="360" y1="379" x2="440" y2="371"/>
        <line x1="352" y1="371" x2="430" y2="379"/>
        <line x1="378" y1="366" x2="418" y2="378"/>
        <line x1="366" y1="378" x2="446" y2="366"/>
        <circle class="head" cx="372" cy="360" r="16"/>
        <circle class="head" cx="424" cy="364" r="16"/>
      </g>
      <path class="heart" d="M400 172 C 384 146, 352 154, 360 182 C 366 204, 400 222, 400 222 C 400 222, 434 204, 440 182 C 448 154, 416 146, 400 172 Z"/>
    </g>
  </svg>`
};

/* ---- SKETCH 5: „Der Vernünftige" --------------------------------------- */
const s5 = {
  id: 's5', titel: 'Der Vernünftige', dauer: 6200,
  svg: `
  <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
    <style>
      /* Meute rennt flüssig nach rechts über die Klippe und verschwindet */
      #s5 .runners { animation: s5run 1.9s cubic-bezier(.3,0,.7,1) both; }
      @keyframes s5run { 0%{transform: translateX(-40px);} 100%{transform: translateX(340px);} }
      #s5 .rBob1 { transform-box: fill-box; transform-origin: 50% 100%; animation: s5hop .34s ease-in-out infinite both; }
      #s5 .rBob2 { transform-box: fill-box; transform-origin: 50% 100%; animation: s5hop .34s ease-in-out .11s infinite both; }
      #s5 .rBob3 { transform-box: fill-box; transform-origin: 50% 100%; animation: s5hop .34s ease-in-out .22s infinite both; }
      @keyframes s5hop { 0%,100%{transform: translateY(0);} 50%{transform: translateY(-9px);} }
      #s5 .runners { opacity:1; animation: s5run 1.9s cubic-bezier(.3,0,.7,1) both, s5gone 6.2s steps(1,end) both; }
      @keyframes s5gone { 0%,30%{opacity:1;} 31%,100%{opacity:0;} }

      /* „Nein." ploppt kurz */
      #s5 .nein { transform-box: fill-box; transform-origin: 50% 100%;
                  animation: s5nein 6.2s cubic-bezier(.34,1.56,.64,1) both; }
      @keyframes s5nein { 0%,14%{opacity:0; transform: scale(.5);} 20%{opacity:1; transform: scale(1.15);} 26%{transform: scale(1);} 60%,72%{opacity:1;} 78%,100%{opacity:0;} }

      /* der Vernünftige atmet leicht */
      #s5 .reasoner { transform-box: fill-box; transform-origin: 50% 100%;
                      animation: s5breathe 2.4s ease-in-out infinite both, s5squash 6.2s steps(1,end) both; }
      @keyframes s5breathe { 0%,100%{transform: scaleY(1);} 50%{transform: scaleY(1.015);} }
      @keyframes s5squash { 0%,63%{opacity:1;} 64%,100%{opacity:0;} }

      /* Klavier fällt mit Schwerkraft und landet mit Bounce */
      #s5 .piano { animation: s5piano 6.2s both; }
      @keyframes s5piano {
        0%,45% { opacity:0; transform: translateY(-360px); }
        46%    { opacity:1; transform: translateY(-360px); }
        63%    { opacity:1; transform: translateY(0); }         /* Aufprall */
        68%    { transform: translateY(-26px); }                 /* Abpraller */
        73%    { transform: translateY(0); }
        76%    { transform: translateY(-8px); }
        80%,100%{ transform: translateY(0); }
      }
      #s5 .piano { animation-timing-function: cubic-bezier(.5,0,.9,.4); }
      /* Klavier staucht beim Aufprall */
      #s5 .pianosq { transform-box: fill-box; transform-origin: 50% 100%;
                     animation: s5psq 6.2s both; }
      @keyframes s5psq { 0%,62%{transform: scale(1);} 64%{transform: scale(1.16,.82);} 70%{transform: scale(1);} 100%{transform: scale(1);} }

      /* Bildschirmwackler beim Einschlag */
      #s5 .shake { animation: s5shake .4s both; animation-delay: 3.9s; }
      @keyframes s5shake { 0%{transform: translate(0,0);} 20%{transform: translate(-6px,3px);} 40%{transform: translate(5px,-2px);} 60%{transform: translate(-3px,2px);} 80%{transform: translate(2px,-1px);} 100%{transform: translate(0,0);} }

      #s5 .splat { transform-box: fill-box; transform-origin: 50% 100%;
                   animation: s5splat 6.2s cubic-bezier(.16,1,.3,1) both; }
      @keyframes s5splat { 0%,63%{opacity:0; transform: scale(.2);} 67%{opacity:1; transform: scale(1.1);} 72%{transform: scale(1);} 100%{opacity:.5; transform: scale(1);} }
    </style>
    <g id="s5"><g class="shake">
      ${GROUND}
      <line class="cliff" x1="640" y1="380" x2="640" y2="440"/>
      <line class="cliff" x1="640" y1="380" x2="760" y2="380"/>
      <g class="runners">
        <g class="rBob1">${core(150)}<line x1="150" y1="290" x2="128" y2="272"/><line x1="150" y1="290" x2="174" y2="308"/></g>
        <g class="rBob2">${core(230)}<line x1="230" y1="290" x2="208" y2="308"/><line x1="230" y1="290" x2="254" y2="272"/></g>
        <g class="rBob3">${core(310)}<line x1="310" y1="290" x2="288" y2="272"/><line x1="310" y1="290" x2="334" y2="308"/></g>
      </g>
      <g class="reasoner">${core(430)}<line x1="430" y1="290" x2="406" y2="314"/><line x1="430" y1="290" x2="454" y2="314"/></g>
      <text class="nein" x="430" y="228" text-anchor="middle">„Nein."</text>
      <g class="splat">${splat(430, 340, 48, 12)}</g>
      <g class="piano"><g class="pianosq">
        <rect class="pianobody" x="366" y="250" width="128" height="92" rx="6"/>
        <rect class="pianolid" x="366" y="250" width="128" height="30" rx="6"/>
        <rect class="whitekey" x="374" y="312" width="112" height="24"/>
        <line x1="390" y1="312" x2="390" y2="336"/>
        <line x1="406" y1="312" x2="406" y2="336"/>
        <line x1="422" y1="312" x2="422" y2="336"/>
        <line x1="438" y1="312" x2="438" y2="336"/>
        <line x1="454" y1="312" x2="454" y2="336"/>
        <line x1="470" y1="312" x2="470" y2="336"/>
      </g></g>
    </g></g>
  </svg>`
};

const SKETCHE = [s1, s2, s3, s4, s5];
