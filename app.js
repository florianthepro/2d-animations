/* STRICHE — Player.
 * Spielt die Sketche der Reihe nach ab. Zwischen den Gags eine kurze
 * Weißblende. Steuerung über reine Textlinks: zurück · abspielen · weiter.
 */
(function () {
  const stage   = document.getElementById('stage');
  const flash   = document.getElementById('flash');
  const btnPrev = document.getElementById('prev');
  const btnPlay = document.getElementById('play');
  const btnNext = document.getElementById('next');

  let idx = 0;
  let autoTimer = null;
  let cutTimer = null;
  let playing = false;

  function paint() {
    const sk = SKETCHE[idx];
    // Neu-Einfügen des SVG startet die CSS-Animationen von vorn.
    stage.innerHTML = sk.svg;
    btnPlay.textContent = playing ? 'pause' : 'abspielen';
    if (playing) {
      autoTimer = setTimeout(() => render(idx + 1, true), sk.dauer);
    }
  }

  function render(i, withCut) {
    clearTimeout(autoTimer);
    clearTimeout(cutTimer);
    idx = (i + SKETCHE.length) % SKETCHE.length;
    if (withCut) {
      flash.classList.remove('cut');
      void flash.offsetWidth;          // reflow -> Animation neu triggern
      flash.classList.add('cut');
      cutTimer = setTimeout(paint, 230);
    } else {
      paint();
    }
  }

  function play()  { playing = true;  render(idx, false); }
  function pause() { playing = false; clearTimeout(autoTimer); btnPlay.textContent = 'abspielen'; }

  btnPlay.addEventListener('click', () => (playing ? pause() : play()));
  btnPrev.addEventListener('click', () => render(idx - 1, true));
  btnNext.addEventListener('click', () => render(idx + 1, true));

  const gate = document.getElementById('gate');
  document.addEventListener('keydown', (e) => {
    if (gate && !gate.classList.contains('hidden')) return;
    if (e.key === 'ArrowLeft')  render(idx - 1, true);
    if (e.key === 'ArrowRight') render(idx + 1, true);
    if (e.key === ' ') { e.preventDefault(); playing ? pause() : play(); }
  });

  // ---- FSK-18 Gate ----
  const page = document.getElementById('page');
  document.getElementById('enter').addEventListener('click', (e) => {
    e.preventDefault();
    gate.classList.add('hidden');
    page.classList.remove('hidden');
    play();
  });
  document.getElementById('leave').addEventListener('click', (e) => {
    e.preventDefault();
    document.body.innerHTML =
      '<div style="height:100vh;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:22px;">Zu jung. Gut so. 👋</div>';
  });

  // Erstbild vorbereiten (hinter dem Gate).
  render(0, false);
})();
