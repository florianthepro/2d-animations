/* STRICHE — Die Sketche.
 *
 * Jeder Sketch ist ein eigenständiges SVG (viewBox 800x450, Boden bei y=380).
 * Animation-Prinzip: „on twos" = harte Pose-Wechsel über opacity + steps(1),
 * keine weichen Easing-Kurven. Bewegung wird durch das Umschalten sichtbarer
 * Pose-Gruppen erzeugt — ruckelig-charmant, genau wie im Konzept.
 *
 * Jeder Sketch: { id, titel, dauer (ms), svg }.
 */

/* ---- kleine SVG-Bausteine ---------------------------------------------- */

// Ein Standard-Strichmännchen als <g>. dir: 1 = schaut nach rechts, -1 nach links.
function stick(cls, cx, opts = {}) {
  const g = 380;                       // Bodenlinie
  const dir = opts.dir || 1;
  const eyes = opts.dead
    ? `<line x1="${cx - 8}" y1="${g - 124}" x2="${cx - 2}" y2="${g - 118}"/>
       <line x1="${cx - 8}" y1="${g - 118}" x2="${cx - 2}" y2="${g - 124}"/>
       <line x1="${cx + 2}" y1="${g - 124}" x2="${cx + 8}" y2="${g - 118}"/>
       <line x1="${cx + 2}" y1="${g - 118}" x2="${cx + 8}" y2="${g - 124}"/>`
    : `<circle class="dot" cx="${cx - 6}" cy="${g - 121}" r="2.4"/>
       <circle class="dot" cx="${cx + 6}" cy="${g - 121}" r="2.4"/>`;
  const mouth = opts.dead
    ? `<line x1="${cx - 6}" y1="${g - 108}" x2="${cx + 6}" y2="${g - 108}"/>`
    : `<line x1="${cx - 5}" y1="${g - 110}" x2="${cx + 5}" y2="${g - 110}"/>`;
  return `
    <g class="${cls}">
      <circle class="head" cx="${cx}" cy="${g - 120}" r="20"/>
      ${eyes}${mouth}
      <line class="body" x1="${cx}" y1="${g - 100}" x2="${cx}" y2="${g - 50}"/>
      ${opts.arms || `
        <line x1="${cx}" y1="${g - 90}" x2="${cx - 24}" y2="${g - 66}"/>
        <line x1="${cx}" y1="${g - 90}" x2="${cx + 24}" y2="${g - 66}"/>`}
      <line x1="${cx}" y1="${g - 50}" x2="${cx - 18}" y2="${g - 12}"/>
      <line x1="${cx}" y1="${g - 50}" x2="${cx + 18}" y2="${g - 12}"/>
    </g>`;
}

// Rote Blutspritzer: Sternspikes um (cx,cy).
function splat(cx, cy, r = 40, n = 11) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (i % 2) * 0.3;
    const len = r * (0.55 + ((i * 37) % 10) / 18);
    s += `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * len).toFixed(1)}" y2="${(cy + Math.sin(a) * len).toFixed(1)}"/>`;
  }
  // ein paar Tropfen
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.6;
    const d = r * 1.15;
    s += `<circle cx="${(cx + Math.cos(a) * d).toFixed(1)}" cy="${(cy + Math.sin(a) * d).toFixed(1)}" r="${3 + i}"/>`;
  }
  return `<g class="blood">${s}</g>`;
}

const GROUND = `<line class="ground" x1="40" y1="380" x2="760" y2="380"/>`;

/* ---- SKETCH 1: „Highfive" ---------------------------------------------- */
const s1 = {
  id: 's1', titel: 'Highfive', dauer: 5200,
  svg: `
  <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
    <style>
      #s1 .approach { animation: s1move 1.2s steps(3,end) forwards; }
      @keyframes s1move { to { transform: translateX(var(--dx)); } }
      #s1 .lft { --dx: 70px; } #s1 .rgt { --dx: -70px; }

      #s1 .stand { animation: s1stand 5.2s steps(1,end) both; }
      @keyframes s1stand { 0%,27%{opacity:1} 28%,100%{opacity:0} }
      #s1 .clap  { animation: s1clap 5.2s steps(1,end) both; }
      @keyframes s1clap { 0%,27%{opacity:0} 28%,33%{opacity:1} 34%,100%{opacity:0} }
      #s1 .boom  { animation: s1boom 5.2s steps(1,end) both; }
      @keyframes s1boom { 0%,33%{opacity:0} 34%,100%{opacity:1} }
      #s1 .blood { animation: s1blood 5.2s steps(1,end) both; }
      @keyframes s1blood { 0%,33%{opacity:0} 34%{opacity:1} 46%{opacity:1} 52%{opacity:0.35} 100%{opacity:0.35} }
      #s1 .punch { transform-origin:400px 210px; animation: s1punch 5.2s steps(1,end) both; }
      @keyframes s1punch { 0%,33%{opacity:0;transform:scale(0.2)} 34%{opacity:1;transform:scale(1)} 40%{opacity:1;transform:scale(1.25)} 42%{opacity:0} 100%{opacity:0} }
      #s1 .punchline { animation: s1line 5.2s steps(1,end) both; }
      @keyframes s1line { 0%,52%{opacity:0} 53%,100%{opacity:1} }
    </style>
    <g id="s1">
      ${GROUND}
      <!-- linker Kerl -->
      <g class="approach lft">
        <g class="stand">${stick('', 250, { arms:`
          <line x1="250" y1="290" x2="226" y2="314"/>
          <line x1="250" y1="290" x2="274" y2="300"/>` })}</g>
        <g class="clap">${stick('', 250, { arms:`
          <line x1="250" y1="290" x2="226" y2="314"/>
          <line x1="250" y1="290" x2="300" y2="232"/>` })}</g>
        <g class="boom">${stick('', 250, { arms:`
          <line x1="250" y1="290" x2="226" y2="314"/>` })}</g>
      </g>
      <!-- rechter Kerl -->
      <g class="approach rgt">
        <g class="stand">${stick('', 550, { arms:`
          <line x1="550" y1="290" x2="574" y2="314"/>
          <line x1="550" y1="290" x2="526" y2="300"/>` })}</g>
        <g class="clap">${stick('', 550, { arms:`
          <line x1="550" y1="290" x2="574" y2="314"/>
          <line x1="550" y1="290" x2="500" y2="232"/>` })}</g>
        <g class="boom">${stick('', 550, { arms:`
          <line x1="550" y1="290" x2="574" y2="314"/>` })}</g>
      </g>
      <g class="punch">${splat(400, 210, 60, 13)}</g>
      <g class="blood">${splat(400, 224, 34, 9)}</g>
      <text class="punchline" x="400" y="410" text-anchor="middle">…lohnt sich nie.</text>
    </g>
  </svg>`
};

/* ---- SKETCH 2: „Anleitung" --------------------------------------------- */
const s2 = {
  id: 's2', titel: 'Anleitung', dauer: 5400,
  svg: `
  <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
    <style>
      #s2 .read  { animation: s2read 5.4s steps(1,end) both; }
      @keyframes s2read { 0%,40%{opacity:1} 41%,100%{opacity:0} }
      #s2 .press { animation: s2press 5.4s steps(1,end) both; }
      @keyframes s2press { 0%,40%{opacity:0} 41%,52%{opacity:1} 53%,100%{opacity:0} }
      #s2 .gone  { animation: s2gone 5.4s steps(1,end) both; }
      @keyframes s2gone { 0%,54%{opacity:0} 55%,100%{opacity:1} }
      #s2 .btn   { animation: s2btn 5.4s steps(1,end) both; }
      @keyframes s2btn { 0%,52%{opacity:1} 55%,100%{opacity:0} }
      #s2 .redflash { animation: s2red 5.4s steps(1,end) both; }
      @keyframes s2red { 0%,52%{opacity:0} 53%{opacity:1} 54%{opacity:0} 100%{opacity:0} }
      #s2 .muffin { animation: s2muf 5.4s steps(1,end) both; }
      @keyframes s2muf { 0%,58%{opacity:0} 59%,100%{opacity:1} }
    </style>
    <g id="s2">
      ${GROUND}
      <!-- Schild -->
      <g class="sign">
        <rect class="board" x="90" y="150" width="200" height="70" rx="4"/>
        <line class="post" x1="190" y1="220" x2="190" y2="380"/>
        <text class="signtext" x="190" y="180" text-anchor="middle">NICHT DEN</text>
        <text class="signtext" x="190" y="205" text-anchor="middle">ROTEN KNOPF</text>
      </g>
      <!-- roter Knopf auf Sockel -->
      <g class="btn">
        <rect class="pedestal" x="600" y="300" width="70" height="80"/>
        <circle class="button" cx="635" cy="300" r="26"/>
      </g>
      <!-- Kerl liest -->
      <g class="read">${stick('', 430, { arms:`
        <line x1="430" y1="290" x2="406" y2="270"/>
        <line x1="430" y1="290" x2="454" y2="270"/>` })}</g>
      <!-- Kerl drückt (Arm ausgestreckt zum Knopf) -->
      <g class="press">${stick('', 520, { arms:`
        <line x1="520" y1="290" x2="500" y2="312"/>
        <line x1="520" y1="290" x2="606" y2="300"/>` })}</g>
      <!-- Kerl weg -->
      <g class="gone">${splat(520, 300, 30, 8)}</g>
      <rect class="redflash" x="0" y="0" width="800" height="450"/>
      <!-- Sprech-Muffin -->
      <g class="muffin">
        <path class="mtop" d="M340 250 q60 -46 120 0 z"/>
        <path class="mcup" d="M348 250 l14 70 h92 l14 -70 z"/>
        <line class="mcup" x1="356" y1="270" x2="452" y2="270"/>
        <circle class="dot" cx="384" cy="238" r="2.4"/>
        <circle class="dot" cx="416" cy="238" r="2.4"/>
        <path d="M388 246 q12 10 24 0"/>
        <text class="say" x="400" y="360" text-anchor="middle">„Hab's ihm gesagt."</text>
      </g>
    </g>
  </svg>`
};

/* ---- SKETCH 3: „Diät" (Kevin) ------------------------------------------ */
const s3 = {
  id: 's3', titel: 'Diät', dauer: 5600,
  svg: `
  <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
    <style>
      #s3 .kevin { animation: s3fall 5.6s steps(1,end) both; }
      @keyframes s3fall {
        0%,45%{opacity:1;transform:translateY(0)}
        46%{opacity:1;transform:translateY(20px)}
        50%{opacity:1;transform:translateY(90px)}
        54%{opacity:0;transform:translateY(200px)}
        100%{opacity:0}
      }
      #s3 .scalezero { animation: s3zero 5.6s steps(1,end) both; }
      @keyframes s3zero { 0%,28%{opacity:1} 30%,100%{opacity:0} }
      #s3 .display { animation: s3disp 5.6s steps(1,end) both; }
      @keyframes s3disp { 0%,28%{opacity:0} 30%,100%{opacity:1} }
      #s3 .hole { animation: s3hole 5.6s steps(1,end) both; }
      @keyframes s3hole { 0%,44%{opacity:0} 46%,100%{opacity:1} }
      #s3 .reaper { animation: s3reap 5.6s steps(2,end) both; }
      @keyframes s3reap { 0%,64%{opacity:0;transform:translateX(70px)} 66%{opacity:1;transform:translateX(0)} 100%{opacity:1;transform:translateX(0)} }
      #s3 .shrug { animation: s3shrug 5.6s steps(1,end) both; }
      @keyframes s3shrug { 0%,76%{opacity:0} 78%,100%{opacity:1} }
      #s3 .noshrug { animation: s3noshrug 5.6s steps(1,end) both; }
      @keyframes s3noshrug { 0%,76%{opacity:1} 78%,100%{opacity:0} }
    </style>
    <g id="s3">
      ${GROUND}
      <!-- Loch im Boden -->
      <g class="hole"><ellipse class="pit" cx="400" cy="380" rx="70" ry="14"/></g>
      <!-- Waage -->
      <g class="scale">
        <rect class="scalebody" x="330" y="350" width="140" height="30" rx="4"/>
        <rect class="scaledisp" x="360" y="322" width="80" height="26" rx="3"/>
        <text class="scalezero" x="400" y="341" text-anchor="middle">88.8</text>
        <text class="display nein" x="400" y="341" text-anchor="middle">NEIN</text>
      </g>
      <!-- Kevin steht drauf -->
      <g class="kevin">${stick('', 400)}</g>
      <!-- Sensenmann, zwei Frames zu spät -->
      <g class="reaper">
        <line class="scythe" x1="500" y1="150" x2="500" y2="380"/>
        <path class="blade" d="M500 150 q58 4 72 52"/>
        <g class="noshrug">${stick('', 440, { arms:`
          <line x1="440" y1="290" x2="416" y2="314"/>
          <line x1="440" y1="290" x2="498" y2="220"/>` })}</g>
        <g class="shrug">${stick('', 440, { arms:`
          <line x1="440" y1="290" x2="414" y2="276"/>
          <line x1="440" y1="290" x2="466" y2="276"/>` })}</g>
        <text class="shrug" x="415" y="205" text-anchor="middle">¯\\_( )_/¯</text>
      </g>
    </g>
  </svg>`
};

/* ---- SKETCH 4: „Umarmung" ---------------------------------------------- */
const s4 = {
  id: 's4', titel: 'Umarmung', dauer: 5200,
  svg: `
  <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
    <style>
      #s4 .apart { animation: s4apart 5.2s steps(1,end) both; }
      @keyframes s4apart { 0%,20%{opacity:1} 21%,100%{opacity:0} }
      #s4 .hug   { animation: s4hug 5.2s steps(1,end) both; }
      @keyframes s4hug { 0%,20%{opacity:0} 21%,44%{opacity:1} 45%,100%{opacity:0} }
      #s4 .knot  { animation: s4knot 5.2s steps(2,end) both; }
      @keyframes s4knot { 0%,44%{opacity:0} 45%,60%{opacity:1} 61%,100%{opacity:0} }
      #s4 .pile  { animation: s4pile 5.2s steps(1,end) both; }
      @keyframes s4pile { 0%,60%{opacity:0} 61%,100%{opacity:1} }
      #s4 .heart { transform-origin:400px 150px; animation: s4heart 5.2s steps(1,end) both; }
      @keyframes s4heart { 0%,62%{opacity:0;transform:scale(0.2)} 64%{opacity:1;transform:scale(1.2)} 68%{transform:scale(1)} 100%{opacity:1;transform:scale(1)} }
    </style>
    <g id="s4">
      ${GROUND}
      <g class="apart">
        ${stick('', 330)}
        ${stick('', 470)}
      </g>
      <!-- innige Umarmung -->
      <g class="hug">
        <circle class="head" cx="378" cy="260" r="20"/>
        <circle class="head" cx="422" cy="260" r="20"/>
        <line class="body" x1="378" y1="280" x2="386" y2="330"/>
        <line class="body" x1="422" y1="280" x2="414" y2="330"/>
        <line x1="378" y1="292" x2="430" y2="300"/>
        <line x1="422" y1="292" x2="370" y2="300"/>
        <line x1="386" y1="330" x2="368" y2="368"/>
        <line x1="386" y1="330" x2="402" y2="368"/>
        <line x1="414" y1="330" x2="432" y2="368"/>
        <line x1="414" y1="330" x2="398" y2="368"/>
      </g>
      <!-- verhedderter Knoten -->
      <g class="knot">
        <path d="M360 300 C 420 240, 380 360, 440 300 S 360 240, 400 320 S 460 300, 380 280" />
        <path d="M370 320 C 430 280, 390 360, 450 310" />
        <circle class="head" cx="384" cy="266" r="18"/>
        <circle class="head" cx="418" cy="272" r="18"/>
      </g>
      <!-- Strichhaufen -->
      <g class="pile">
        <line x1="345" y1="376" x2="405" y2="366"/>
        <line x1="360" y1="380" x2="440" y2="372"/>
        <line x1="352" y1="372" x2="430" y2="380"/>
        <line x1="378" y1="368" x2="418" y2="378"/>
        <line x1="366" y1="378" x2="446" y2="366"/>
        <circle class="head" cx="372" cy="360" r="16"/>
        <circle class="head" cx="424" cy="364" r="16"/>
      </g>
      <path class="heart" d="M400 176 C 384 150, 352 158, 360 186 C 366 208, 400 224, 400 224 C 400 224, 434 208, 440 186 C 448 158, 416 150, 400 176 Z"/>
    </g>
  </svg>`
};

/* ---- SKETCH 5: „Der Vernünftige" --------------------------------------- */
const s5 = {
  id: 's5', titel: 'Der Vernünftige', dauer: 6000,
  svg: `
  <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
    <style>
      #s5 .runners { animation: s5run 1.8s steps(6,end) forwards; }
      @keyframes s5run { to { transform: translateX(260px); } }
      #s5 .gone { animation: s5gone 6s steps(1,end) both; }
      @keyframes s5gone { 0%,33%{opacity:1} 34%,100%{opacity:0} }
      #s5 .nein { animation: s5nein 6s steps(1,end) both; }
      @keyframes s5nein { 0%,20%{opacity:0} 22%,60%{opacity:1} 61%,100%{opacity:0} }
      #s5 .piano { animation: s5piano 6s steps(1,end) both; }
      @keyframes s5piano {
        0%,52%{opacity:0;transform:translateY(-320px)}
        54%{opacity:1;transform:translateY(-260px)}
        58%{opacity:1;transform:translateY(-120px)}
        62%{opacity:1;transform:translateY(0)}
        100%{opacity:1;transform:translateY(0)}
      }
      #s5 .reasoner { animation: s5reason 6s steps(1,end) both; }
      @keyframes s5reason { 0%,62%{opacity:1} 63%,100%{opacity:0} }
      #s5 .splat { animation: s5splat 6s steps(1,end) both; }
      @keyframes s5splat { 0%,62%{opacity:0} 63%,100%{opacity:1} }
      #s5 .keys { animation: s5keys 6s steps(1,end) both; }
      @keyframes s5keys { 0%,62%{opacity:0} 64%,100%{opacity:1} }
    </style>
    <g id="s5">
      ${GROUND}
      <!-- Klippe rechts -->
      <line class="cliff" x1="640" y1="380" x2="640" y2="440"/>
      <line class="cliff" x1="640" y1="380" x2="760" y2="380"/>
      <!-- die Rennenden -->
      <g class="gone"><g class="runners">
        ${stick('', 180, { arms:`<line x1="180" y1="290" x2="158" y2="272"/><line x1="180" y1="290" x2="204" y2="308"/>` })}
        ${stick('', 250, { arms:`<line x1="250" y1="290" x2="228" y2="308"/><line x1="250" y1="290" x2="274" y2="272"/>` })}
        ${stick('', 320, { arms:`<line x1="320" y1="290" x2="298" y2="272"/><line x1="320" y1="290" x2="344" y2="308"/>` })}
      </g></g>
      <!-- der Vernünftige bleibt stehen -->
      <g class="reasoner">${stick('', 430)}</g>
      <text class="nein" x="430" y="238" text-anchor="middle">„Nein."</text>
      <!-- Blutspritzer, wenn das Klavier landet -->
      <g class="splat">${splat(430, 330, 46, 11)}</g>
      <!-- das Klavier -->
      <g class="piano">
        <rect class="pianobody" x="368" y="250" width="124" height="90" rx="4"/>
        <rect class="pianobody" x="368" y="250" width="124" height="30" rx="4"/>
        <g class="keys">
          <rect class="whitekey" x="376" y="312" width="108" height="22"/>
          <line x1="392" y1="312" x2="392" y2="334"/>
          <line x1="408" y1="312" x2="408" y2="334"/>
          <line x1="424" y1="312" x2="424" y2="334"/>
          <line x1="440" y1="312" x2="440" y2="334"/>
          <line x1="456" y1="312" x2="456" y2="334"/>
          <line x1="472" y1="312" x2="472" y2="334"/>
        </g>
      </g>
    </g>
  </svg>`
};

const SKETCHE = [s1, s2, s3, s4, s5];
