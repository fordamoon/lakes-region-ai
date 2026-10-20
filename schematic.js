/* Lakes Region AI: graph-paper backdrop with a hand-drafted schematic for each section.
   Each <section data-schematic="id"> on the page picks the drawing shown while it's on screen.
   The drawing "drafts" itself in (strokes draw on), then fades when the next section takes over.
   Purely decorative: hidden from screen readers, no pointer events, still for reduced motion. */
(function () {
  "use strict";
  var sections = document.querySelectorAll("[data-schematic]");
  if (!sections.length || !document.createElementNS) return;

  /* ---------- tiny drawing kit (600 x 420 drawing units) ---------- */
  var n = 0;                                   /* draw order, for the staggered drafting */
  function d() { return ' style="--d:' + (n++ * 0.11).toFixed(2) + 's"'; }
  function ln(path, accent) { return '<path class="ln' + (accent ? " ac" : "") + '" pathLength="1" d="' + path + '"' + d() + "/>"; }
  function txt(x, y, s, anchor, cls) { return '<text class="lb' + (cls ? " " + cls : "") + '" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || "middle") + '"' + d() + ">" + s + "</text>"; }
  function rect(x, y, w, h, r, accent) {
    return ln("M" + (x + r) + " " + y + "H" + (x + w - r) + "Q" + (x + w) + " " + y + " " + (x + w) + " " + (y + r) + "V" + (y + h - r) + "Q" + (x + w) + " " + (y + h) + " " + (x + w - r) + " " + (y + h) + "H" + (x + r) + "Q" + x + " " + (y + h) + " " + x + " " + (y + h - r) + "V" + (y + r) + "Q" + x + " " + y + " " + (x + r) + " " + y + "Z", accent);
  }
  function circ(cx, cy, r, accent) { return ln("M" + (cx - r) + " " + cy + "a" + r + " " + r + " 0 1 0 " + 2 * r + " 0a" + r + " " + r + " 0 1 0 " + -2 * r + " 0", accent); }
  function arrow(x1, y1, x2, y2, accent) {
    var a = Math.atan2(y2 - y1, x2 - x1), h = 9;
    var p1 = (x2 - h * Math.cos(a - 0.45)).toFixed(1) + " " + (y2 - h * Math.sin(a - 0.45)).toFixed(1);
    var p2 = (x2 - h * Math.cos(a + 0.45)).toFixed(1) + " " + (y2 - h * Math.sin(a + 0.45)).toFixed(1);
    return ln("M" + x1 + " " + y1 + "L" + x2 + " " + y2 + "M" + p1 + "L" + x2 + " " + y2 + "L" + p2, accent);
  }
  function num(cx, cy, k) { return circ(cx, cy, 12) + txt(cx, cy + 5, k, "middle", "nm"); }
  function phone(x, y) { return rect(x, y, 56, 104, 10) + ln("M" + (x + 18) + " " + (y + 10) + "H" + (x + 38)) + circ(x + 28, y + 92, 4); }
  function bubble(x, y, w, h) { return ln("M" + (x + 10) + " " + y + "H" + (x + w - 10) + "Q" + (x + w) + " " + y + " " + (x + w) + " " + (y + 10) + "V" + (y + h - 10) + "Q" + (x + w) + " " + (y + h) + " " + (x + w - 10) + " " + (y + h) + "H" + (x + 22) + "L" + (x + 8) + " " + (y + h + 12) + "L" + (x + 10) + " " + (y + h) + "Q" + x + " " + (y + h) + " " + x + " " + (y + h - 10) + "V" + (y + 10) + "Q" + x + " " + y + " " + (x + 10) + " " + y); }
  function lead(x1, y1, x2, y2) { return '<path class="ln dash" pathLength="1" d="M' + x1 + " " + y1 + "Q" + ((x1 + x2) / 2) + " " + (y1 - 14) + " " + x2 + " " + y2 + '"' + d() + "/>"; }

  /* ---------- the drawings, one per offer ---------- */
  var FIGS = {
    textback: { title: "Missed-Call Text-Back", draw: function () {
      return phone(30, 150) + ln("M74 160l14-14m-9 0h9v9", true) + num(30, 128, 1) + lead(58, 290, 40, 318) + txt(20, 336, "missed call 12:04", "start") +
        arrow(98, 202, 196, 202) + rect(206, 162, 132, 80, 16) + txt(272, 208, "AI agent") + num(206, 140, 2) +
        lead(250, 262, 236, 300) + txt(206, 318, "text back in seconds", "start") +
        arrow(348, 202, 440, 202) + phone(452, 150) + bubble(462, 176, 36, 22) + num(452, 128, 3) +
        circ(480, 330, 26, true) + arrow(480, 262, 480, 298, true) + txt(480, 384, "lead to owner", "middle", "ac");
    }},
    estimates: { title: "Estimate Follow-Up", draw: function () {
      return rect(30, 140, 86, 112, 6) + ln("M46 168H100M46 186H100M46 204H84M46 228H72") + txt(73, 278, "quote sent") + num(30, 120, 1) +
        arrow(126, 196, 210, 196) + rect(220, 150, 96, 92, 8) + ln("M220 176H316") + txt(268, 222, "day 3") + num(220, 130, 2) +
        lead(268, 250, 262, 290) + txt(268, 312, "polite nudge") +
        ln("M326 196L404 150", true) + ln("M326 196L404 246") + circ(428, 146, 20, true) + ln("M418 146l7 7 13-14", true) +
        circ(428, 250, 20) + ln("M420 242l16 16M436 242l-16 16") + txt(470, 152, "yes", "start", "ac") + txt(470, 256, "no", "start") +
        txt(430, 324, "either way, you know", "middle");
    }},
    reviews: { title: "Review Booster", draw: function () {
      return circ(70, 196, 38) + ln("M52 196l12 12 26-26") + txt(70, 266, "job done") + num(32, 146, 1) +
        arrow(120, 196, 200, 196) + bubble(210, 160, 150, 60) + txt(285, 196, "how did we do?") + num(210, 138, 2) +
        lead(290, 250, 286, 286) + txt(286, 306, "you approve the words") +
        arrow(370, 190, 420, 190) +
        [0, 1, 2, 3, 4].map(function (i) { var cx = 440 + i * 30, cy = 190; return ln("M" + cx + " " + (cy - 12) + "l3.5 7.2 8 1.1-5.8 5.6 1.4 7.9-7.1-3.8-7.1 3.8 1.4-7.9-5.8-5.6 8-1.1z", true); }).join("") +
        txt(500, 236, "on Google", "middle", "ac");
    }},
    reminders: { title: "Appointment Reminders", draw: function () {
      var g = rect(30, 130, 170, 150, 8) + ln("M30 160H200") + ln("M30 190H200M30 220H200M30 250H200") + ln("M64 160V280M98 160V280M132 160V280M166 160V280");
      return g + circ(149, 205, 13, true) + txt(115, 304, "booked") + num(30, 110, 1) +
        arrow(212, 205, 292, 205) + bubble(302, 168, 140, 60) + txt(372, 204, "see you tomorrow?") + num(302, 146, 2) +
        lead(372, 256, 360, 300) + txt(330, 318, "the day before", "middle") +
        ln("M452 198L512 150", true) + ln("M452 212L512 262") + txt(522, 154, "confirm", "start", "ac") + txt(522, 268, "move it", "start");
    }},
    faq: { title: "Website FAQ Assistant", draw: function () {
      return rect(30, 120, 190, 150, 8) + ln("M30 146H220") + circ(46, 133, 4) + circ(60, 133, 4) +
        bubble(56, 176, 120, 44) + txt(116, 204, "open sunday?") + num(30, 100, 1) +
        arrow(230, 196, 300, 196) + ln("M310 156H378Q394 156 394 172V236H326Q310 236 310 220Z") + ln("M326 176H378M326 196H378M326 216H360") + txt(352, 266, "your info") + num(310, 134, 2) +
        arrow(404, 196, 464, 196, true) + bubble(474, 166, 104, 48) + txt(526, 196, "yes, 9 to 3", "middle", "ac") +
        '<path class="ln dash" pathLength="1" d="M352 276Q352 330 430 344"' + d() + "/>" + txt(440, 364, "tricky ones go to you", "start");
    }},
    package: { title: "AI Operations Package", draw: function () {
      return circ(300, 210, 46, true) + txt(300, 206, "one", "middle", "ac") + txt(300, 226, "system", "middle", "ac") +
        rect(40, 70, 110, 64, 10) + txt(95, 108, "phone") + ln("M150 112L258 184") +
        rect(450, 70, 110, 64, 10) + txt(505, 108, "quotes") + ln("M450 112L342 184") +
        rect(40, 290, 110, 64, 10) + txt(95, 328, "reviews") + ln("M150 312L258 236") +
        rect(450, 290, 110, 64, 10) + txt(505, 328, "booking") + ln("M450 312L342 236") +
        num(300, 128, 3) + txt(300, 400, "three connected, live in 30 days");
    }},
    lake: { title: "Where we work: New Hampshire", draw: function () {
      /* New Hampshire, traced from real border coordinates (north tip at top, seacoast on the right).
         The outline drafts in, a small star pops onto each place we work, then a big gold star
         rises out of Lake Winnipesaukee for the Lakes Region. */
      var nh = "M363.6 24.7L369.1 35.2L373.1 53.4L372.1 81.4L371.1 123.4L373.1 165.4L375.1 207.4L376.1 242.4L374.1 270.4L377.1 298.4L390.2 313.8L397.3 329.2L402.3 336.2L411.4 350.2L402.3 358.6L390.2 365.6L379.2 364.2L367.1 369.8L359 374L354 383.8L341.9 389.4L281.5 388L225.1 385.2L218 368.4L216 347.4L226.1 319.4L231.1 298.4L238.2 270.4L246.2 246.6L261.3 221.4L268.4 196.2L286.5 161.2L301.6 148.6L311.7 133.2L313.7 109.4L319.7 81.4L321.8 66L328.8 49.2L341.9 33.8Z";
      function starPath(cx, cy, R, r) {
        var pts = [];
        for (var i = 0; i < 10; i++) {
          var ang = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r : R;
          pts.push((cx + rad * Math.cos(ang)).toFixed(1) + " " + (cy + rad * Math.sin(ang)).toFixed(1));
        }
        return "M" + pts.join("L") + "Z";
      }
      var t = 1.4;                               /* seconds: when the first star pops, after the outline is drafted */
      function pop(cx, cy) {                     /* small star that pops onto a city */
        var el = '<path class="st" d="' + starPath(cx, cy, 9, 3.8) + '" style="--d:' + t.toFixed(2) + 's"/>';
        t += 0.45;
        return el;
      }
      function city(cx, cy, name, east) {        /* leader line + label, then the city's star pops on */
        var lead = east ? ln("M" + (cx + 13) + " " + cy + "H452") + txt(458, cy + 5, name, "start")
                        : ln("M" + (cx - 13) + " " + cy + "H196") + txt(190, cy + 5, name, "end");
        return lead + pop(cx, cy);
      }
      var lake = ln("M326 262C329 254 338 252 344 256C350 252 356 258 352 264C356 270 348 275 342 271C336 276 327 272 330 267C324 267 323 264 326 262Z", true);
      var cities = city(318, 318, "Concord") + city(326.4, 348.7, "Manchester") + city(325, 380.3, "Nashua") + city(390, 337, "Portsmouth", true);
      /* The big gold star: starts small inside the lake and rises to its spot, once every city is on the map */
      var rise = t + 0.3;
      var big = '<path class="ln dash" pathLength="1" d="M346 258Q390 232 438 204" style="--d:' + rise.toFixed(2) + 's"/>' +
        '<path class="rise" d="' + starPath(468, 178, 44, 18) + '" style="--d:' + (rise + 0.15).toFixed(2) + 's;--fx:-128px;--fy:84px"/>' +
        '<text class="lb gold" x="520" y="238" style="--d:' + (rise + 0.9).toFixed(2) + 's">Lakes Region</text>' +
        '<text class="lb gold" x="520" y="258" style="--d:' + (rise + 1).toFixed(2) + 's">home base</text>';
      return ln(nh) + lake + txt(346, 296, "Lake Winnipesaukee", "middle") + cities + big +
        ln("M548 40V90M548 40l-8 16M548 40l8 16") + txt(548, 108, "N") +
        ln("M40 404H160M40 398V410M100 400V408M160 398V410") + txt(100, 428, "we come to you");
    }}
  };

  /* ---------- build the layer ---------- */
  var layer = document.createElement("div");
  layer.className = "blueprint";
  layer.setAttribute("aria-hidden", "true");
  var stage = document.createElement("div");
  stage.className = "bp-stage";
  layer.appendChild(stage);
  var figs = {}, order = 0;
  Object.keys(FIGS).forEach(function (id) {
    n = 0;
    var f = FIGS[id], wrap = document.createElement("div");
    wrap.className = "bp-fig";
    wrap.innerHTML = '<svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid meet">' + f.draw() + "</svg>" +
      '<p class="bp-title">FIG. ' + (++order) + " · " + f.title + "</p>";
    stage.appendChild(wrap);
    figs[id] = wrap;
  });
  document.body.insertBefore(layer, document.body.firstChild);
  document.documentElement.classList.add("has-blueprint");

  /* ---------- swap drawings as sections scroll into view ---------- */
  var current = null;
  function show(id) {
    if (!figs[id] || id === current) return;
    if (current) figs[current].classList.remove("on");
    void figs[id].offsetWidth;                 /* restart the drafting animation */
    figs[id].classList.add("on");
    current = id;
  }
  show(sections[0].getAttribute("data-schematic"));
  if (!("IntersectionObserver" in window)) return;
  /* a section "owns" the backdrop when it crosses the middle band of the screen */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) show(e.target.getAttribute("data-schematic")); });
  }, { rootMargin: "-45% 0px -45% 0px" });
  sections.forEach(function (s) { io.observe(s); });
})();
