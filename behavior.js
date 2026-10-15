/* Lakes Region AI: page behavior. Reads everything from catalog.js. */
(function () {
  "use strict";
  var D = window.LRAI;
  if (!D) return;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function photo(name) { return D.photos[name] || {}; }

  /* Booking links all come from the catalog */
  document.querySelectorAll("[data-book]").forEach(function (a) {
    a.href = D.booking;
    a.textContent = D.bookingLabel;
  });
  document.querySelectorAll("[data-book-short]").forEach(function (a) { a.href = D.booking; });

  /* ---------- Photo slots ---------- */
  /* Empty slots show a "PHOTO SLOT" label only when previewing locally, never on the live site. */
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) document.documentElement.classList.add("dev");
  document.querySelectorAll(".slot[data-slot]").forEach(function (slot) {
    var p = photo(slot.getAttribute("data-slot"));
    var decorative = slot.getAttribute("role") === "img";
    if (!p.file) {                                   /* no photo yet: nothing for screen readers to announce */
      slot.removeAttribute("role"); slot.setAttribute("aria-hidden", "true");
      return;
    }
    if (decorative) slot.setAttribute("aria-label", p.alt || "");
    var img = new Image();
    img.alt = decorative ? "" : (p.alt || "");
    img.decoding = "async";
    img.onload = function () { slot.classList.add("has-photo"); };
    img.onerror = function () { img.remove(); };
    img.src = p.file;
    slot.appendChild(img);
  });

  /* ---------- Promo ---------- */
  var pr = D.promo;
  function promoLive() {
    if (!pr || !pr.on) return false;
    var asOf = new URLSearchParams(location.search).get("asof");
    return (asOf ? new Date(asOf) : new Date()) <= new Date(pr.ends);
  }
  var live = promoLive();
  var box = document.getElementById("promo");
  if (box && live) {
    var hex = el("div", "owl-hex");
    hex.setAttribute("aria-hidden", "true");
    var face = el("div", "face");
    var owl = photo(pr.photo);
    if (owl.file) { var oi = new Image(); oi.src = owl.file; oi.alt = ""; face.appendChild(oi); }
    hex.appendChild(el("div", "edge")); hex.appendChild(face);
    var words = el("div");
    words.appendChild(el("p", "tag", pr.tag));
    words.appendChild(el("p", null, pr.line));
    words.appendChild(el("p", "go", pr.note + " \u2192"));
    box.appendChild(hex); box.appendChild(words);
    if (pr.link) box.href = pr.link;
    box.setAttribute("aria-label", pr.tag + ": " + pr.line + " " + pr.note);
    box.hidden = false;
  }

  /* ---------- See it work: the call animation ----------
     Plays on hover (on phones: when it scrolls into view). Pauses when the pointer leaves.
     Browsers only allow sound after a click, so voices are opt-in with the Sound button. */
  var player = document.getElementById("player");
  if (player && D.demoCall) (function () {
    var lines = D.demoCall;
    var $ = function (id) { return document.getElementById(id); };
    var state = $("call-state"), clock = $("call-timer"), wave = $("wave"), speaker = $("speaker"),
        caption = $("caption"), list = $("transcript"), owner = $("owner"), lockTime = $("lock-time"),
        playBtn = $("play"), soundBtn = $("sound"), bar = $("bar"), live = $("live-text");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var canSpeak = "speechSynthesis" in window;
    var step = -1, playing = false, timer = null, tick = null, secs = 0, soundOn = false, done = false;
    var STEPS = lines.length + 3; /* ring, lines..., hang up, text arrives, text opens */

    function toSecs(t) { var p = t.split(":"); return (+p[0]) * 60 + (+p[1]); }
    function fmt(n) { return Math.floor(n / 60) + ":" + ("0" + (n % 60)).slice(-2); }
    function showClock(n) { clock.textContent = fmt(n); live.textContent = "Your AI agent is on a call · " + fmt(n); }
    function progress() { bar.style.width = Math.max(0, Math.min(100, ((step + 1) / STEPS) * 100)) + "%"; }

    function voices() {
      var v = canSpeak ? speechSynthesis.getVoices().filter(function (x) { return /^en(-|_)US/i.test(x.lang); }) : [];
      var pick = function (re, not) { return v.filter(function (x) { return re.test(x.name) && x !== not; })[0]; };
      var agent = pick(/Samantha|Ava|Allison|Google US English|Zira|Jenny|Aria/i) || v[0];
      var caller = pick(/Karen|Moira|Tessa|Susan|Victoria|Nicky|Female|Michelle/i, agent) || v.filter(function (x) { return x !== agent; })[0] || agent;
      return { agent: agent, caller: caller };
    }

    function reset() {
      clearTimeout(timer); clearInterval(tick);
      if (canSpeak) speechSynthesis.cancel();
      step = -1; secs = 0; done = false;
      list.innerHTML = ""; caption.textContent = "Hover to play the call."; speaker.innerHTML = "&nbsp;";
      state.textContent = "Ready"; showClock(0); lockTime.textContent = "12:04";
      player.classList.remove("ringing", "oncall", "ended", "pinged", "opened", "agent", "caller");
      progress();
    }

    function addLine(l) {
      var li = el("li", l.who);
      li.appendChild(el("span", "mono", (l.who === "agent" ? "AI agent" : "Caller") + " · " + l.t));
      li.appendChild(el("span", null, l.text));
      list.appendChild(li);
      list.scrollTop = list.scrollHeight;
    }

    function run() {
      if (!playing) return;
      step++; progress();
      var n = step;
      if (n === 0) {                                   /* the phone rings, nobody picks up */
        player.classList.add("ringing");
        state.textContent = "Ringing · no answer";
        caption.textContent = "Dave can't get to the phone.";
        return wait(1800);
      }
      if (n <= lines.length) {                         /* the AI agent takes the call */
        var l = lines[n - 1];
        if (n === 1) {
          player.classList.remove("ringing"); player.classList.add("oncall");
          state.textContent = "Answered by AI agent";
          clearInterval(tick);
          tick = setInterval(function () { if (playing) showClock(++secs); }, 1000);
        }
        secs = Math.max(secs, toSecs(l.t)); showClock(secs);
        player.classList.toggle("agent", l.who === "agent");
        player.classList.toggle("caller", l.who === "caller");
        speaker.textContent = l.who === "agent" ? "AI agent speaking" : "Caller speaking";
        caption.textContent = l.text;
        addLine(l);
        if (soundOn && canSpeak) return say(l);
        return wait(Math.max(2200, l.text.length * 52));
      }
      if (n === lines.length + 1) {                    /* hang up */
        clearInterval(tick);
        player.classList.remove("oncall", "agent", "caller"); player.classList.add("ended");
        state.textContent = "Call ended · 0:52";
        live.textContent = "Call handled · writing up your lead";
        speaker.innerHTML = "&nbsp;";
        caption.textContent = "The agent texts Dave the lead.";
        return wait(1200);
      }
      if (n === lines.length + 2) {                    /* the text lands on the owner's lock screen */
        lockTime.textContent = "12:05";
        player.classList.add("pinged");
        return wait(2200);
      }
      player.classList.add("opened");                  /* the owner opens it */
      done = true; playing = false;
      playBtn.textContent = "Replay"; playBtn.setAttribute("aria-label", "Replay");
    }

    function wait(ms) { clearTimeout(timer); timer = setTimeout(run, ms); }
    function say(l) {
      var v = voices(), u = new SpeechSynthesisUtterance(l.text);
      u.voice = l.who === "agent" ? v.agent : v.caller;
      u.rate = 1.04; u.pitch = l.who === "agent" ? 1 : 1.15;
      u.onend = function () { if (playing) wait(250); };
      speechSynthesis.speak(u);
    }

    function play() {
      if (playing) return;
      if (done) reset();
      playing = true;
      playBtn.textContent = "Pause"; playBtn.setAttribute("aria-label", "Pause");
      if (step >= 0) step--;                           /* on resume, replay the current step */
      run();
    }
    function pause() {
      if (!playing) return;
      playing = false; clearTimeout(timer);
      if (canSpeak) speechSynthesis.cancel();
      if (step > 0 && step <= lines.length) list.removeChild(list.lastChild); /* the line replays on resume */
      playBtn.textContent = "Play"; playBtn.setAttribute("aria-label", "Play");
    }

    playBtn.addEventListener("click", function () { playing ? pause() : play(); });
    if (!canSpeak) soundBtn.hidden = true;
    soundBtn.addEventListener("click", function () {
      soundOn = !soundOn;
      soundBtn.setAttribute("aria-pressed", soundOn);
      soundBtn.textContent = soundOn ? "Sound on" : "Sound off · click for voices";
      if (!soundOn && canSpeak) speechSynthesis.cancel();
      if (soundOn && !playing) play();
    });
    if (canSpeak) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = function () {}; }

    reset();
    if (reduce) {                                      /* no motion: show the finished story */
      lines.forEach(addLine);
      state.textContent = "Call ended · 0:52"; clock.textContent = "0:52"; lockTime.textContent = "12:05";
      player.classList.add("ended", "pinged", "opened");
      caption.textContent = "The agent texted Dave the lead.";
      done = true; playBtn.textContent = "Replay"; bar.style.width = "100%";
      return;
    }
    var hover = window.matchMedia("(hover: hover)").matches;
    if (hover) {
      player.addEventListener("mouseenter", function () { if (!done) play(); });
      player.addEventListener("mouseleave", function () { if (!soundOn) pause(); });
    } else if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { if (!done) play(); } else if (!soundOn) pause(); });
      }, { threshold: 0.4 }).observe(player);
    }
  })();

  /* ---------- Forms (apply.html, contact.html) ---------- */
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    var cfg = (D.forms || {})[form.getAttribute("data-form")] || {};
    var err = form.querySelector(".form-error"), doneBox = form.querySelector(".form-done");
    function finish() {
      Array.prototype.forEach.call(form.children, function (c) { if (c !== doneBox) c.hidden = true; });
      doneBox.hidden = false; doneBox.focus();
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      err.hidden = true;
      var data = new FormData(form);
      if (data.get("company_website")) { finish(); return; }   /* spam trap: real people never fill this */
      var bad = Array.prototype.filter.call(form.elements, function (f) { return f.willValidate && !f.checkValidity(); });
      if (bad.length) {
        var lbl = form.querySelector('label[for="' + bad[0].id + '"]');
        var what = lbl ? lbl.textContent.replace(/\s*\(optional\)/, "") : "the missing field";
        err.textContent = bad[0].type === "email" && bad[0].value ? "Please check the email address." : "Please fill in: " + what + ".";
        err.hidden = false; bad[0].focus();
        return;
      }
      data.delete("company_website");
      var subject = (cfg.subject || "Website message").replace(/\{(\w+)\}/g, function (_, k) { return data.get(k) || ""; });
      if (cfg.formAction) {                            /* a form service is set up: send it there */
        data.append("_subject", subject);
        fetch(cfg.formAction, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (r) { if (!r.ok) throw r; finish(); })
          .catch(function () { err.textContent = "That didn't go through. Please try again, or email " + cfg.emailTo + "."; err.hidden = false; });
        return;
      }
      var lines = [];                                  /* no form service yet: open a ready-to-send email */
      data.forEach(function (v, k) { if (v) lines.push(k.charAt(0).toUpperCase() + k.slice(1) + ": " + v); });
      location.href = "mailto:" + cfg.emailTo + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
      finish();
    });
  });

  function priceBlock(o) {                           /* big price, then the small setup/usage line */
    var box = el("span", "price-box");
    box.appendChild(el("span", "price", o.price));
    if (o.sub) box.appendChild(el("span", "price-sub", o.sub));
    return box;
  }

  /* ---------- What we set up ---------- */
  var ICONS = {
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    doc: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M8 13h8M8 17h5"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4M8.5 14.5l2 2 4-4"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
    build: '<path d="M14.5 6.5a4 4 0 0 0-5 5L4 17l3 3 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z"/>'
  };
  var wins = document.getElementById("wins");
  if (wins) D.wins.forEach(function (w) {
    var card = el("article", "win" + (w.featured ? " featured" : ""));
    var icon = el("div", "win-icon");
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[w.icon] || "") + "</svg>";
    card.appendChild(icon);
    card.appendChild(el("h3", null, w.title));
    var flow = el("ol", "flow");
    flow.setAttribute("aria-label", "How it works");
    w.flow.forEach(function (s) { flow.appendChild(el("li", null, s)); });
    card.appendChild(flow);
    card.appendChild(el("p", null, w.body));
    var foot = el("div", "win-foot");
    foot.appendChild(el("span", "win-name", w.name));
    foot.appendChild(priceBlock(w));
    card.appendChild(foot);
    wins.appendChild(card);
  });

  /* ---------- Price ladder ---------- */
  var ladder = document.getElementById("ladder");
  if (ladder) D.ladder.forEach(function (r, i) {
    var li = el("li", "rung" + (i === 0 ? " first" : ""));
    li.appendChild(el("div", "ladder-step", r.step));
    var items = el("div", "rung-items" + (r.items.length > 2 ? " three" : ""));
    r.items.forEach(function (o) {
      var card = el("div", "offer");
      if (o.promoFlag && live) card.appendChild(el("span", "offer-flag", pr.flag));
      var head = el("div", "offer-head");
      head.appendChild(el("h3", null, o.name));
      head.appendChild(priceBlock(o));
      card.appendChild(head);
      card.appendChild(el("p", null, o.line));
      items.appendChild(card);
    });
    li.appendChild(items);
    if (r.note) {
      var note = el("p", "rung-note", r.note + " ");
      if (r.noteLink) { var a = el("a", "textlink", "Read the pricing terms"); a.href = r.noteLink; note.appendChild(a); }
      li.appendChild(note);
    }
    ladder.appendChild(li);
  });
})();
