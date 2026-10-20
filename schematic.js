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
      /* Lake Winnipesaukee: traced from the owner's outline (shoreline + the biggest islands),
         fitted to the lake's true spot on the map and drawn at 2x so the bays and islands read */
      var lake = ln("M327.0 226.0L328.6 226.5L328.6 228.7L329.8 227.7L330.9 228.3L330.9 230.3L332.6 229.8L334.2 230.7L333.4 232.1L336.4 233.8L337.7 237.1L340.8 238.8L342.2 238.7L343.0 239.6L345.2 239.0L346.7 239.9L347.0 241.4L346.1 242.8L346.6 244.8L347.4 245.4L348.6 245.1L349.1 246.3L347.4 247.0L349.6 249.3L350.8 249.6L348.8 251.5L346.0 251.1L347.5 256.3L346.9 258.5L348.8 260.3L347.4 261.0L348.3 264.0L349.1 265.0L352.1 264.5L352.8 260.7L351.0 259.4L350.4 258.4L351.0 258.0L351.7 259.0L352.3 258.8L355.2 260.7L353.6 263.8L357.9 268.4L357.0 269.2L354.6 268.6L354.1 267.6L351.5 266.7L352.6 269.3L354.6 269.4L357.8 271.6L357.8 269.5L358.5 269.0L360.0 271.2L361.3 271.6L360.9 269.7L363.6 268.1L364.5 268.9L364.0 271.4L364.8 272.3L367.5 272.0L370.1 274.0L369.8 274.7L368.8 274.2L368.1 275.6L367.0 273.7L366.7 274.6L367.5 275.5L366.3 275.9L365.7 278.0L364.1 278.5L362.8 277.8L362.2 278.6L360.6 278.2L360.9 280.7L363.5 283.7L360.5 282.8L359.8 284.6L358.4 284.8L357.6 283.2L356.5 282.8L356.3 283.9L355.0 285.0L356.3 289.1L355.7 290.8L357.2 291.3L357.6 293.9L359.6 297.1L359.3 300.0L357.8 296.5L355.3 294.2L355.4 293.0L354.5 292.7L352.2 286.4L352.8 284.7L352.3 283.0L353.5 282.8L353.2 281.6L351.4 280.9L351.1 279.8L350.0 279.7L349.5 280.8L349.1 279.8L347.4 279.3L346.4 280.0L346.5 278.2L344.5 277.6L344.9 276.0L343.8 276.8L343.1 275.8L341.8 276.2L340.1 275.2L339.4 274.7L339.0 272.9L337.2 271.7L336.8 270.7L335.7 270.3L334.0 271.2L330.5 267.7L328.1 267.5L327.4 268.9L326.3 268.2L325.1 268.8L324.8 269.7L324.1 269.5L323.0 268.5L323.4 266.3L321.9 265.0L319.8 265.3L319.5 263.5L316.9 261.1L315.1 261.6L312.7 265.4L312.8 267.0L314.3 268.1L314.9 271.9L315.6 272.7L313.8 277.1L312.7 277.8L312.4 273.2L311.6 271.7L312.0 269.3L311.0 268.2L311.1 265.9L309.8 264.2L311.5 264.6L311.8 263.7L312.9 264.0L314.0 262.3L312.4 260.6L311.6 258.0L308.5 253.2L308.4 251.4L305.8 249.3L305.5 247.9L308.9 247.4L310.7 249.2L311.2 253.2L313.7 254.5L313.6 255.3L314.6 256.2L315.4 256.1L314.7 254.0L316.8 252.3L317.5 252.7L318.0 256.1L319.4 257.1L318.9 254.9L317.7 254.1L318.6 253.2L317.6 251.9L318.1 251.0L320.3 252.6L319.7 254.3L320.6 255.9L322.8 255.0L322.8 254.1L321.5 253.3L322.0 252.7L321.3 250.6L319.1 248.9L319.7 247.8L318.6 245.6L318.1 245.2L317.2 246.2L316.3 243.5L315.1 242.8L314.3 239.2L315.4 237.9L314.3 236.9L314.7 236.1L313.2 234.8L313.3 233.4L314.6 233.0L317.2 235.5L317.5 234.7L316.2 233.5L316.2 232.7L317.1 232.6L318.5 234.6L318.2 237.8L320.0 237.9L321.0 238.8L321.6 236.8L320.3 236.0L320.3 234.9L321.0 235.6L322.5 235.3L321.1 233.9L322.0 233.1L323.9 235.8L323.9 237.0L325.0 237.4L323.7 238.4L325.9 241.2L325.9 242.2L325.0 242.8L326.4 244.0L328.7 244.1L328.7 240.9L330.3 241.3L330.9 240.6L332.0 241.7L330.9 243.2L333.7 244.9L335.9 244.7L338.4 246.0L339.1 245.2L341.9 246.7L344.0 246.0L341.9 243.4L339.7 242.7L338.8 241.6L337.9 243.4L334.8 243.5L335.3 241.9L333.5 238.7L334.7 237.9L334.7 237.0L333.3 235.8L335.1 235.1L332.5 232.5L331.1 232.5L327.0 229.2L325.4 231.4L324.7 230.8L323.8 232.0L322.6 231.3L322.8 229.2L323.8 229.4L325.2 227.4L326.5 227.4L327.3 228.5L328.0 227.9Z", true) +
        ln("M312.3 264.4L312.9 264.5L312.3 265.5L312.4 267.0L314.1 268.8L314.5 271.7L315.3 272.7L313.2 277.3L312.8 273.2L311.9 271.5L312.4 269.4L311.2 267.9L311.5 265.4L310.8 265.5L310.2 264.7L311.8 264.9Z", true) + ln("M335.5 246.5L337.2 246.9L340.3 250.4L337.8 251.9L338.2 255.3L337.0 255.3L336.4 253.3L334.4 251.5L335.2 250.0L334.7 247.9Z", true) + ln("M345.1 271.2L349.2 273.0L351.1 274.6L350.5 274.7L348.7 273.6L348.0 273.8L345.1 271.9Z", true) + ln("M318.2 259.2L320.3 259.6L323.2 262.7L322.2 263.1L319.5 262.2L318.0 260.0Z", true) + ln("M325.2 251.3L327.0 251.8L328.3 254.5L328.1 256.2L327.3 254.3L324.7 254.3L323.8 253.3Z", true) + ln("M341.9 253.9L344.2 254.3L344.8 255.9L346.2 256.5L345.8 257.0L343.6 256.7L343.6 257.4L344.8 258.0L344.7 258.5L343.8 258.8L342.3 258.1L342.1 256.6L343.5 255.9L341.8 254.6Z", true) + ln("M322.0 247.4L324.6 248.4L325.6 250.0L325.0 251.0L323.7 250.5L324.6 249.7Z", true) + ln("M329.9 228.1L330.7 228.6L330.0 230.9L327.7 229.6L327.3 228.9L328.0 228.5L328.5 229.1Z", true) + ln("M326.0 259.0L327.2 259.8L326.8 262.0L326.0 261.5L326.5 260.9L325.7 260.0Z", true);
      var cities = city(318, 318, "Concord") + city(326.4, 348.7, "Manchester") + city(325, 380.3, "Nashua") + city(390, 337, "Portsmouth", true);
      /* The big gold star: starts small inside the lake and rises to its spot, once every city is on the map */
      var rise = t + 0.3;
      var big = '<path class="ln dash" pathLength="1" d="M347 240Q398 220 438 204" style="--d:' + rise.toFixed(2) + 's"/>' +
        '<path class="rise" d="' + starPath(468, 178, 44, 18) + '" style="--d:' + (rise + 0.15).toFixed(2) + 's;--fx:-130px;--fy:85px"/>' +
        '<text class="lb gold" x="520" y="238" style="--d:' + (rise + 0.9).toFixed(2) + 's">Lakes Region</text>' +
        '<text class="lb gold" x="520" y="258" style="--d:' + (rise + 1).toFixed(2) + 's">home base</text>';
      return ln(nh) + lake + txt(298, 262, "Lake Winnipesaukee", "end") + cities + big +
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
