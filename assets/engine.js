/* ============================================================
   KOBOLD & KOMET — Szenen-Engine + Router
   Reines Vanilla-JS, keine Abhängigkeiten.
   ============================================================ */
(function () {
  "use strict";

  /* -------- Episoden-Daten: Untertitel + Szenendauer (ms) -------- */
  const EPISODES = {
    "stage-1": {
      brightFrom: 5, // ab dieser Szene leuchtet Fizz hell
      scenes: [
        { t: "Der Flüsterwald schläft. Alles ist ganz still …", d: 5000 },
        { t: "Da — ein Licht stürzt vom Himmel herab!", d: 4400 },
        { t: "Pip erwacht. Neugierig folgt er dem Schein.", d: 5200 },
        { t: "Im Krater kauert ein kleiner, ängstlicher Komet.", d: 5200 },
        { t: "Pip reicht ihm die Hand … und Fizz beginnt zu leuchten!", d: 5800 },
        { t: "Von nun an sind die beiden unzertrennlich. ✦", d: 5200 },
      ],
    },
    "stage-2": {
      brightFrom: 3,
      litFrom: 4, // ab dieser Szene glühen die Glühwürmchen
      scenes: [
        { t: "Heute Nacht spielt das Glühwürmchen-Orchester.", d: 4800 },
        { t: "Doch ein grauer Nebel hat ihre Lichter verschluckt.", d: 5000 },
        { t: "Fizz hat eine Idee: Er teilt sein eigenes Leuchten.", d: 5200 },
        { t: "Ein Funke springt von Flügel zu Flügel …", d: 5200 },
        { t: "Der ganze Wald erstrahlt — das Konzert beginnt!", d: 5600 },
        { t: "Ein Lied aus Licht, nur für Pip und Fizz. ♪", d: 5200 },
      ],
    },
  };

  /* -------------------- kleine Ton-Engine (optional) -------------------- */
  const Sound = {
    ctx: null,
    on: false,
    ensure() {
      if (!this.ctx) {
        try {
          this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) { this.ctx = null; }
      }
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
      return this.ctx;
    },
    /* sanfte Glockentöne bei Szenenwechsel — pentatonisch */
    chime(step) {
      if (!this.on) return;
      const ctx = this.ensure();
      if (!ctx) return;
      const scale = [523.25, 587.33, 659.25, 783.99, 880.0]; // C D E G A
      const freq = scale[step % scale.length];
      const t = ctx.currentTime;
      [0, 1].forEach((i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = i === 0 ? "sine" : "triangle";
        o.frequency.value = freq * (i === 0 ? 1 : 2);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(i === 0 ? 0.12 : 0.05, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
        o.connect(g).connect(ctx.destination);
        o.start(t);
        o.stop(t + 1.7);
      });
    },
  };

  /* -------------------- Episode-Player -------------------- */
  function Player(stageId) {
    const stage = document.getElementById(stageId);
    if (!stage) return null;
    const data = EPISODES[stageId];
    const frame = stage.closest(".stage-frame");
    const root = frame.closest(".player");
    const hud = root.querySelector(".hud");
    const subtitleEl = stage.querySelector(".subtitle");
    const endEl = stage.querySelector(".ep-end");
    const barEl = hud.querySelector(".progress__bar");
    const countEl = hud.querySelector(".scene-count");
    const progressEl = hud.querySelector(".progress");

    const total = data.scenes.length;
    let scene = 0;        // 0 = noch nicht gestartet
    let elapsed = 0;      // ms in aktueller Szene
    let last = null;      // Zeitstempel rAF
    let playing = false;
    let raf = null;
    let ended = false;

    function applyGlow() {
      const fizz = stage.querySelector(".fizz");
      if (fizz) {
        fizz.classList.remove("dim", "bright");
        if (scene >= 1) fizz.classList.add(scene >= data.brightFrom ? "bright" : "dim");
      }
      if (data.litFrom != null) {
        stage.querySelectorAll(".ff").forEach((ff, i) => {
          if (scene >= data.litFrom) {
            // gestaffeltes Aufleuchten in Szene der Kettenreaktion
            const delay = scene === data.litFrom ? i * 380 : 0;
            setTimeout(() => { if (scene >= data.litFrom) ff.classList.add("lit"); }, delay);
          } else {
            ff.classList.remove("lit");
          }
        });
      }
    }

    function showScene(n) {
      scene = n;
      elapsed = 0;
      ended = false;
      endEl.classList.remove("show");
      stage.setAttribute("data-scene", String(n));
      const s = data.scenes[n - 1];
      subtitleEl.textContent = s ? s.t : "";
      subtitleEl.classList.toggle("show", !!s);
      countEl.textContent = "Szene " + n + " / " + total;
      applyGlow();
      Sound.chime(n - 1);
    }

    function finish() {
      pause();
      ended = true;
      stage.setAttribute("data-scene", String(total));
      subtitleEl.classList.remove("show");
      barEl.style.width = "100%";
      countEl.textContent = "Ende";
      endEl.classList.add("show");
    }

    function tick(now) {
      if (!playing) return;
      if (last == null) last = now;
      const dt = now - last;
      last = now;
      elapsed += dt;
      const dur = data.scenes[scene - 1].d;
      const frac = Math.min(1, elapsed / dur);
      const overall = ((scene - 1) + frac) / total;
      barEl.style.width = (overall * 100).toFixed(2) + "%";
      if (elapsed >= dur) {
        if (scene >= total) { finish(); return; }
        showScene(scene + 1);
      }
      raf = requestAnimationFrame(tick);
    }

    function play() {
      if (ended) { restart(); return; }
      if (scene === 0) showScene(1);
      playing = true;
      last = null;
      stage.classList.remove("is-paused");
      hud.classList.add("playing");
      Sound.ensure();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    }

    function pause() {
      playing = false;
      cancelAnimationFrame(raf);
      stage.classList.add("is-paused");
      hud.classList.remove("playing");
    }

    function toggle() { playing ? pause() : play(); }

    function restart() {
      cancelAnimationFrame(raf);
      barEl.style.width = "0%";
      showScene(1);
      playing = true;
      last = null;
      stage.classList.remove("is-paused");
      hud.classList.add("playing");
      raf = requestAnimationFrame(tick);
    }

    function goto(n) {
      n = Math.max(1, Math.min(total, n));
      cancelAnimationFrame(raf);
      showScene(n);
      barEl.style.width = (((n - 1) / total) * 100).toFixed(2) + "%";
      if (playing) { last = null; raf = requestAnimationFrame(tick); }
    }

    function next() { scene >= total ? finish() : goto(scene + 1); }
    function prev() { goto(Math.max(1, scene - 1)); }

    // Steuerungs-Buttons verdrahten
    hud.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const a = btn.dataset.action;
        if (a === "toggle") toggle();
        else if (a === "next") next();
        else if (a === "prev") prev();
        else if (a === "restart") restart();
      });
    });

    // Klick auf Fortschrittsleiste = springen
    progressEl.addEventListener("click", (e) => {
      const rect = progressEl.getBoundingClientRect();
      const frac = (e.clientX - rect.left) / rect.width;
      goto(Math.floor(frac * total) + 1);
    });

    // End-Overlay-Buttons
    endEl.querySelectorAll("[data-end]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const a = btn.dataset.end;
        if (a === "replay") restart();
        else if (a === "next-ep") location.hash = btn.dataset.target || "#/";
        else if (a === "home") location.hash = "#/";
      });
    });

    return {
      play, pause, restart,
      reset() { pause(); scene = 0; elapsed = 0; ended = false; barEl.style.width = "0%";
        stage.setAttribute("data-scene", "0"); subtitleEl.classList.remove("show");
        endEl.classList.remove("show"); countEl.textContent = "Szene 0 / " + total; applyGlow(); },
    };
  }

  /* -------------------- Router -------------------- */
  const players = {};
  const routes = {
    "": "home", "/": "home",
    "/folge-1": "folge-1",
    "/folge-2": "folge-2",
    "/figuren": "figuren",
    "/ueber": "ueber",
  };

  function setView(id) {
    document.querySelectorAll(".view").forEach((v) => v.classList.toggle("is-active", v.id === "view-" + id));
    document.querySelectorAll(".nav__link").forEach((l) => {
      l.classList.toggle("is-active", l.dataset.route === id);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function route() {
    const raw = (location.hash || "#/").replace(/^#/, "");
    const key = routes[raw] != null ? routes[raw] : "home";

    // alle Player pausieren/zurücksetzen
    Object.values(players).forEach((p) => p && p.pause());

    setView(key);

    if (key === "folge-1" && players["stage-1"]) {
      players["stage-1"].reset();
      setTimeout(() => players["stage-1"].play(), 350);
    } else if (key === "folge-2" && players["stage-2"]) {
      players["stage-2"].reset();
      setTimeout(() => players["stage-2"].play(), 350);
    }
  }

  /* -------------------- Init -------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    players["stage-1"] = Player("stage-1");
    players["stage-2"] = Player("stage-2");

    // Nav-Links / interne Links
    document.querySelectorAll("[data-goto]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        location.hash = el.dataset.goto;
      });
    });

    // Ton-Umschalter
    document.querySelectorAll("[data-sound-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Sound.on = !Sound.on;
        Sound.ensure();
        document.querySelectorAll("[data-sound-toggle]").forEach((b) => {
          b.classList.toggle("is-on", Sound.on);
          b.setAttribute("aria-pressed", String(Sound.on));
          const lbl = b.querySelector(".sound-label");
          if (lbl) lbl.textContent = Sound.on ? "Ton an" : "Ton aus";
        });
      });
    });

    window.addEventListener("hashchange", route);
    route();
  });
})();
