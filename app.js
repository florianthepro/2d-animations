/* STRICHE — Player.
 * Spielt die Sketche der Reihe nach ab. Zwischen den Gags eine harte
 * Weißblende. Steuerung über reine Textlinks: zurück · abspielen · weiter.
 */
(function () {
  const stage   = document.getElementById('stage');
  const flash   = document.getElementById('flash');
  const label   = document.getElementById('label');
  const counter = document.getElementById('counter');
  const btnPrev = document.getElementById('prev');
  const btnPlay = document.getElementById('play');
  const btnNext = document.getElementById('next');

  let idx = 0;
  let autoTimer = null;
  let cutTimer = null;
  let playing = false;

  function render(i, withCut) {
    clearTimeout(autoTimer);
    clearTimeout(cutTimer);
    idx = (i + SKETCHE.length) % SKETCHE.length;
    const sk = SKETCHE[idx];

    const paint = () => {
      // Neu-Einfügen des SVG startet die CSS-Animationen von vorn.
      stage.innerHTML = sk.svg;
      label.textContent = sk.titel;
      counter.textContent = (idx + 1) + ' / ' + SKETCHE.length;
      btnPlay.textContent = playing ? 'pause' : 'abspielen';
      if (playing) {
        autoTimer = setTimeout(() => render(idx + 1, true), sk.dauer);
      }
    };

    if (withCut) {
      // harte Weißblende, dann nächster Gag
      flash.classList.remove('cut');
      void flash.offsetWidth;          // reflow -> Animation neu triggern
      flash.classList.add('cut');
      cutTimer = setTimeout(paint, 240);
    } else {
      paint();
    }
  }

  function play() {
    playing = true;
    render(idx, false);
  }
  function pause() {
    playing = false;
    clearTimeout(autoTimer);
    btnPlay.textContent = 'abspielen';
  }

  btnPlay.addEventListener('click', () => (playing ? pause() : play()));
  btnPrev.addEventListener('click', () => render(idx - 1, true));
  btnNext.addEventListener('click', () => render(idx + 1, true));

  document.addEventListener('keydown', (e) => {
    if (document.getElementById('gate') && !document.getElementById('gate').classList.contains('hidden')) return;
    if (e.key === 'ArrowLeft')  render(idx - 1, true);
    if (e.key === 'ArrowRight') render(idx + 1, true);
    if (e.key === ' ') { e.preventDefault(); playing ? pause() : play(); }
  });

  // ---- FSK-18 Gate ----
  const gate = document.getElementById('gate');
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

  // Erstbild ohne Autoplay vorbereiten (hinter dem Gate).
  render(0, false);
})();
