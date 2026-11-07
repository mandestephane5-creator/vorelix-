/* ===================================================================
   VORELIX : script commun à toutes les pages
   Coordonnées (config.js), menu, mode clair/sombre, apparitions,
   trajet de la page d'accueil, tarifs, questions fréquentes, formulaire.
=================================================================== */
(function () {
  "use strict";

  const C = window.VORELIX_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const txt = (s) => String(s || "").trim();
  const digits = (s) => String(s || "").replace(/\D/g, "");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  /* ---------- 1. Message en bas de l'écran ---------- */
  let toastT;
  function toast(msg) {
    const t = $("#toast");
    if (!t) return;
    $("span", t).textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("is-on"), 3200);
  }

  /* ---------- 2. Coordonnées depuis config.js ---------- */
  const wa = digits(C.whatsapp);
  const mail = txt(C.email);
  const tel = txt(C.telephone);
  const pretty = (d) => (d.startsWith("226") && d.length === 11 ? "+226 " + d.slice(3).replace(/(\d{2})(?=\d)/g, "$1 ") : "+" + d);
  const waLink = (msg) => "https://wa.me/" + wa + (msg ? "?text=" + encodeURIComponent(msg) : "");
  const contacts = {
    telephone: tel ? { t: tel, href: "tel:" + tel.replace(/[^\d+]/g, "") } : null,
    whatsapp: wa ? { t: pretty(wa), href: waLink() } : null,
    email: mail ? { t: mail, href: "mailto:" + mail } : null,
  };

  $$("[data-contact]").forEach((el) => {
    const c = contacts[el.dataset.contact];
    if (!c) return el.remove();
    el.textContent = (el.dataset.libelle || "") + c.t;
    el.href = c.href;
    if (el.dataset.contact === "whatsapp") { el.target = "_blank"; el.rel = "noopener"; }
  });
  $$("[data-contact-icon]").forEach((el) => {
    const c = contacts[el.dataset.contactIcon];
    if (!c) return el.remove();
    el.href = c.href;
  });
  $$(".socials").forEach((s) => { if (!s.children.length) s.remove(); });
  $$("[data-ligne-contact]").forEach((el) => {
    const k = el.dataset.ligneContact;
    if (k === "horaires") { if (!txt(C.horaires)) el.remove(); return; }
    const c = contacts[k];
    if (!c) return el.remove();
    if (el.tagName === "A") el.href = c.href;
    const b = $("[data-contact-texte]", el);
    if (b) b.textContent = c.t;
  });
  $$("[data-texte]").forEach((el) => { const v = txt(C[el.dataset.texte]); if (v) el.textContent = v; });
  $$('[data-lien="connexion"]').forEach((el) => { const u = txt(C.connexion); if (u) el.href = u; else el.remove(); });
  $$("[data-wa]").forEach((el) => { if (wa) el.href = waLink(el.dataset.waMsg || "Bonjour Vorelix, je souhaite en savoir plus sur l'application."); else el.remove(); });
  $$("[data-sans-wa]").forEach((el) => { if (wa) el.remove(); });
  $$("[data-tb-mid]").forEach((el) => {
    if (!wa) return;
    el.href = waLink("Bonjour Vorelix, je souhaite une démonstration.");
    el.target = "_blank"; el.rel = "noopener";
    el.classList.add("is-wa");
    el.removeAttribute("aria-current");
    $(".ti", el).innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
    $(".tl", el).textContent = "WhatsApp";
  });
  $$(".mn-acts").forEach((m) => { if (!m.children.length) m.remove(); });
  $$("[data-year]").forEach((y) => (y.textContent = new Date().getFullYear()));

  /* ---------- 3. Menu sur téléphone ---------- */
  const burger = $("#burger"), mnav = $("#mnav"), mnavBg = $("#mnavBg");
  function setMenu(on) {
    if (!mnav || !burger) return;
    if (on && mnavBg) mnavBg.hidden = false;
    requestAnimationFrame(() => {
      mnav.classList.toggle("is-on", on);
      mnavBg && mnavBg.classList.toggle("is-on", on);
    });
    if (!on && mnavBg) setTimeout(() => { if (!mnav.classList.contains("is-on")) mnavBg.hidden = true; }, 350);
    burger.setAttribute("aria-expanded", on);
    burger.setAttribute("aria-label", on ? "Fermer le menu" : "Ouvrir le menu");
    $("i", burger).className = on ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    root.classList.toggle("no-scroll", on);
    $$(".mn-link, .mn-row, .mn-acts", mnav).forEach((a, i) => (a.style.transitionDelay = on ? 60 + i * 35 + "ms" : "0ms"));
  }
  mnavBg && mnavBg.addEventListener("click", () => setMenu(false));
  burger && burger.addEventListener("click", () => setMenu(!mnav.classList.contains("is-on")));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mnav && mnav.classList.contains("is-on")) { setMenu(false); burger.focus(); }
  });

  /* ---------- 4. Mode clair / mode sombre ---------- */
  const themeBtn = $("#themeToggle"), themeSw = $$("[data-theme-switch]");
  const theme = () => (root.getAttribute("data-theme") === "dark" ? "dark" : "light");
  function syncTheme() {
    const dark = theme() === "dark";
    if (themeBtn) {
      themeBtn.setAttribute("aria-pressed", dark);
      themeBtn.setAttribute("aria-label", dark ? "Activer le mode clair" : "Activer le mode sombre");
    }
    themeSw.forEach((c) => (c.checked = dark));
    const m = $('meta[name="theme-color"]');
    if (m) m.content = dark ? "#090C20" : "#FFFFFF";
  }
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("vorelix_theme", t); } catch (e) {}
    syncTheme();
  }
  // le nouveau mode s'ouvre en cercle depuis le bouton touché
  function switchTheme(from) {
    const next = theme() === "dark" ? "light" : "dark";
    if (!document.startViewTransition || reduce) return applyTheme(next);
    const r = from.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.classList.add("vt-theme");
    const vt = document.startViewTransition(() => applyTheme(next));
    vt.ready.then(() => root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
      { duration: 600, easing: "cubic-bezier(.22,.8,.24,1)", pseudoElement: "::view-transition-new(root)" })).catch(() => {});
    vt.finished.finally(() => root.classList.remove("vt-theme"));
  }
  themeBtn && themeBtn.addEventListener("click", () => switchTheme(themeBtn));
  themeSw.forEach((c) => c.addEventListener("change", () => switchTheme(c.closest(".sw") || c)));
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (ev) => {
    let saved = null;
    try { saved = localStorage.getItem("vorelix_theme"); } catch (e) {}
    if (!saved) { root.setAttribute("data-theme", ev.matches ? "dark" : "light"); syncTheme(); }
  });
  syncTheme();

  /* ---------- 5. Apparitions ---------- */
  $$("[data-hero]").forEach((el, i) => (el.style.animationDelay = i * 90 + "ms"));
  const els = $$(".rv"), stamps = $$("[data-hit]");
  if (!("IntersectionObserver" in window) || reduce) {
    els.forEach((el) => el.classList.add("is-in"));
    stamps.forEach((el) => el.classList.add("is-hit"));
  } else {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add(en.target.hasAttribute("data-hit") ? "is-hit" : "is-in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
    stamps.forEach((el) => io.observe(el));
  }

  /* ---------- 6. Accueil : l'avion en papier avance avec le défilement ---------- */
  const route = $("#route");
  if (route) {
    const go = $("#routeGo"), stops = $$(".st", route), wide = matchMedia("(min-width: 961px)");
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = innerHeight;
      if (wide.matches) {
        const r = route.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.5)));
        const t = p * (stops.length - 1);
        if (go) go.style.left = `calc(${t / stops.length} * 100% + 44px)`;
        stops.forEach((s, k) => s.classList.toggle("is-done", k <= t + 0.02));
      } else {
        stops.forEach((s) => s.classList.toggle("is-done", s.getBoundingClientRect().top < vh * 0.7));
      }
    };
    if (reduce) stops.forEach((s) => s.classList.add("is-done"));
    else {
      addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      addEventListener("resize", update);
      update();
    }
  }

  /* ---------- 7. Tarifs : par mois ou par an ---------- */
  const seg = $("[data-remise]");
  if (seg) {
    const remise = Number(seg.dataset.remise || 15) / 100;
    const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const btns = $$("[data-periode-choix]", seg);
    const apply = (p) => {
      btns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.periodeChoix === p)));
      $$(".montant").forEach((el) => {
        const m = Number(el.dataset.mensuel);
        el.textContent = fmt(p === "an" ? Math.round(m * 12 * (1 - remise)) : m);
      });
      $$("[data-periode]").forEach((el) => (el.textContent = p === "an" ? "FCFA par an" : "FCFA par mois"));
    };
    btns.forEach((b) => b.addEventListener("click", () => apply(b.dataset.periodeChoix)));
    apply("mois");
  }

  /* ---------- 8. Questions fréquentes : recherche et thèmes ---------- */
  const list = $("#faqList");
  if (list) {
    const qs = $$(".q", list), search = $("#faqSearch"), empty = $("#faqEmpty"), chips = $$("[data-filtre]");
    let filtre = "";
    const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const run = () => {
      const q = norm(txt(search && search.value));
      let n = 0;
      qs.forEach((d) => {
        const ok = (!filtre || d.dataset.theme === filtre) && (!q || norm(d.textContent).includes(q));
        d.hidden = !ok;
        if (ok) n++;
        if (q && ok) d.open = true;
      });
      empty.hidden = n > 0;
    };
    chips.forEach((b) => b.addEventListener("click", () => {
      filtre = b.dataset.filtre;
      chips.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      run();
    }));
    search && search.addEventListener("input", run);
    if (qs[0]) qs[0].open = true;
  }

  /* ---------- 9. Contact : formulaire envoyé par WhatsApp ou par e-mail ---------- */
  const form = $("#contactForm");
  if (form) {
    const SUJETS = {
      demo: { titre: "Demande de démonstration", etab: "Établissement", ex: "Lycée, collège ou école", msg: "Le nombre de classes, les jours qui vous arrangent…" },
      pilote: { titre: "Devenir école pilote", etab: "Établissement", ex: "Lycée, collège ou école", msg: "Le nombre d’élèves, la ville, la rentrée visée…" },
      parent: { titre: "Question d’un parent", etab: "École de votre enfant", ex: "Nom de l’école", msg: "Votre question sur l’application" },
      autre: { titre: "Autre demande", etab: "Organisation", ex: "Facultatif", msg: "Votre message" },
    };
    const f = form.elements;
    const radios = $$('input[name="sujet"]', form);
    const sujet = () => (radios.find((r) => r.checked) || radios[0]).value;
    const majSujet = () => {
      const s = SUJETS[sujet()];
      $("#parentNote").hidden = sujet() !== "parent";
      $("#lEtab").textContent = s.etab;
      f.etablissement.placeholder = s.ex;
      f.message.placeholder = s.msg;
    };
    radios.forEach((r) => r.addEventListener("change", majSujet));
    const demande = new URLSearchParams(location.search).get("sujet");
    if (demande && SUJETS[demande]) radios.forEach((r) => (r.checked = r.value === demande));
    majSujet();

    // bouton et phrase selon le canal configuré
    const btn = $("#sendBtn"), note = $("#sendNote"), delai = txt(C.delaiReponse);
    if (wa) { btn.className = "b b-wa"; btn.innerHTML = '<i class="fa-brands fa-whatsapp"></i>Envoyer sur WhatsApp'; }
    else if (mail) { btn.innerHTML = '<i class="fa-solid fa-envelope"></i>Envoyer par e-mail'; }
    note.textContent = [wa ? "Votre message s’ouvre dans WhatsApp, déjà rempli." : mail ? "Votre message s’ouvre dans votre messagerie." : "",
      delai ? "Nous répondons " + delai + "." : ""].join(" ").trim();
    if (!note.textContent) note.remove();

    const RULES = [
      [f.nom, (v) => txt(v).length > 1, "#eNom", f.nom],
      [f.telephone, (v) => digits(v).length >= 8, "#eTel", $("#wTel")],
      [f.email, (v) => !txt(v) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(txt(v)), "#eMail", f.email],
    ];
    const mark = (r, bad) => { $(r[2]).classList.toggle("is-on", bad); r[3].classList.toggle("is-bad", bad); r[0].setAttribute("aria-invalid", String(bad)); };
    RULES.forEach((r) => r[0].addEventListener("input", () => { if (r[0].getAttribute("aria-invalid") === "true" && r[1](r[0].value)) mark(r, false); }));
    const alertBox = $("#formAlert");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alertBox.hidden = true;
      let first = null;
      RULES.forEach((r) => { const bad = !r[1](r[0].value); mark(r, bad); if (bad && !first) first = r[0]; });
      if (first) { first.focus(); return; }
      const s = SUJETS[sujet()];
      const lignes = [
        "Bonjour Vorelix,", "",
        "Demande : " + s.titre,
        "Nom : " + txt(f.nom.value),
        txt(f.etablissement.value) ? s.etab + " : " + txt(f.etablissement.value) : "",
        "Téléphone : +226 " + txt(f.telephone.value),
        txt(f.email.value) ? "E-mail : " + txt(f.email.value) : "",
        txt(f.message.value) ? "\n" + txt(f.message.value) : "",
      ].filter((l, i) => i < 2 || l !== "");
      const corps = lignes.join("\n");
      if (wa) {
        window.open(waLink(corps), "_blank", "noopener");
        toast("WhatsApp s’ouvre avec votre message : il reste à l’envoyer.");
      } else if (mail) {
        location.href = "mailto:" + mail + "?subject=" + encodeURIComponent("Vorelix : " + s.titre) + "&body=" + encodeURIComponent(corps);
        toast("Votre messagerie s’ouvre avec votre message.");
      } else {
        alertBox.textContent = "Le formulaire n’est pas encore relié : ajoutez le numéro WhatsApp ou l’adresse e-mail de Vorelix dans le fichier assets/js/config.js.";
        alertBox.hidden = false;
      }
    });
  }
})();
