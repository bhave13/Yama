// ── 1. HEADER COMMENT ─────────────────────────────────────────────────
// Topic:        Area and Perimeter (Polygons and Circles)
// NCEA Level:   N/A   Standard: N/A
// Year Group:   Year 10
// Generated:    2026-05-05
// Type Mix:     25% NUMERIC, 20% MCQ, 15% MATCH, 20% SPOT_ERROR/STEP, 10% SPOT_ERROR/VALUE, 10% EXPLANATION

// ── 2. UTILITY FUNCTIONS ──────────────────────────────────────────────

let _uidCounter = 0;

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randF(min, max, dp) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(dp));
}

function pickAndRemove(arr) {
  const i = Math.floor(Math.random() * arr.length);
  return arr.splice(i, 1)[0];
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeUID(type, level, diff) {
  const abbr = {
    NUMERIC: "num", MCQ: "mcq", MATCH: "mat",
    SPOT_ERROR_STEP: "sep", SPOT_ERROR_VALUE: "sev",
    EXPLANATION: "exp", TEXT: "txt"
  };
  return (abbr[type] || "xxx") + "-" + String(++_uidCounter).padStart(3, "0") + "-lev" + level + "-d" + diff;
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

// SVG helpers — return a data:image/svg+xml URI string
function _svgURI(svgContent) {
  return "data:image/svg+xml," + encodeURIComponent(svgContent);
}

function makeSVGRect(l, w, unitStr) {
  const scale = Math.min(180 / Math.max(l, 1), 100 / Math.max(w, 1));
  const pw = Math.round(l * scale), ph = Math.round(w * scale);
  const ox = (220 - pw) / 2, oy = (140 - ph) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 140" width="220" height="140">
  <rect x="${ox}" y="${oy}" width="${pw}" height="${ph}" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
  <text x="${ox + pw/2}" y="${oy - 6}" text-anchor="middle" font-size="13" fill="#1e3a8a">${l} ${unitStr}</text>
  <text x="${ox + pw + 6}" y="${oy + ph/2 + 5}" text-anchor="start" font-size="13" fill="#1e3a8a">${w} ${unitStr}</text>
</svg>`;
  return _svgURI(svg);
}

function makeSVGSquare(s, unitStr) {
  const side = 100;
  const ox = 60, oy = 20;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 140" width="220" height="140">
  <rect x="${ox}" y="${oy}" width="${side}" height="${side}" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
  <text x="${ox + side/2}" y="${oy - 6}" text-anchor="middle" font-size="13" fill="#1e3a8a">${s} ${unitStr}</text>
  <text x="${ox + side + 6}" y="${oy + side/2 + 5}" text-anchor="start" font-size="13" fill="#1e3a8a">${s} ${unitStr}</text>
</svg>`;
  return _svgURI(svg);
}

function makeSVGTriangle(b, h, unitStr) {
  const scale = Math.min(180 / Math.max(b, 1), 100 / Math.max(h, 1));
  const pw = Math.round(b * scale), ph = Math.round(h * scale);
  const ox = (220 - pw) / 2, oy = (130 - ph);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 140" width="220" height="140">
  <polygon points="${ox},${oy+ph} ${ox+pw},${oy+ph} ${ox+pw/2},${oy}" fill="#dcfce7" stroke="#166534" stroke-width="2"/>
  <text x="${ox + pw/2}" y="${oy + ph + 16}" text-anchor="middle" font-size="13" fill="#14532d">b = ${b} ${unitStr}</text>
  <line x1="${ox + pw/2 + 2}" y1="${oy}" x2="${ox + pw/2 + 2}" y2="${oy + ph}" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="${ox + pw/2 + 8}" y="${oy + ph/2 + 5}" text-anchor="start" font-size="12" fill="#14532d">h = ${h} ${unitStr}</text>
</svg>`;
  return _svgURI(svg);
}

function makeSVGCircle(r, unitStr) {
  const cr = Math.min(60, r * 8);
  const cx = 110, cy = 70;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 140" width="220" height="140">
  <circle cx="${cx}" cy="${cy}" r="${cr}" fill="#fef9c3" stroke="#a16207" stroke-width="2"/>
  <line x1="${cx}" y1="${cy}" x2="${cx + cr}" y2="${cy}" stroke="#92400e" stroke-width="2"/>
  <text x="${cx + cr/2}" y="${cy - 6}" text-anchor="middle" font-size="13" fill="#78350f">r = ${r} ${unitStr}</text>
  <circle cx="${cx}" cy="${cy}" r="3" fill="#92400e"/>
</svg>`;
  return _svgURI(svg);
}

function makeSVGCircleD(d, unitStr) {
  const cr = Math.min(60, d * 4);
  const cx = 110, cy = 70;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 140" width="220" height="140">
  <circle cx="${cx}" cy="${cy}" r="${cr}" fill="#fef9c3" stroke="#a16207" stroke-width="2"/>
  <line x1="${cx - cr}" y1="${cy}" x2="${cx + cr}" y2="${cy}" stroke="#92400e" stroke-width="2"/>
  <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="13" fill="#78350f">d = ${d} ${unitStr}</text>
  <circle cx="${cx}" cy="${cy}" r="3" fill="#92400e"/>
</svg>`;
  return _svgURI(svg);
}

function makeSVGParallelogram(b, h, slant, unitStr) {
  const scale = Math.min(160 / Math.max(b, 1), 80 / Math.max(h, 1));
  const pw = Math.round(b * scale), ph = Math.round(h * scale);
  const offset = Math.round(ph * 0.6);
  const ox = 20, oy = 25;
  const pts = `${ox + offset},${oy} ${ox + offset + pw},${oy} ${ox + pw},${oy + ph} ${ox},${oy + ph}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 140" width="220" height="140">
  <polygon points="${pts}" fill="#ede9fe" stroke="#6d28d9" stroke-width="2"/>
  <text x="${ox + offset + pw/2}" y="${oy - 6}" text-anchor="middle" font-size="13" fill="#4c1d95">b = ${b} ${unitStr}</text>
  <line x1="${ox + pw + 8}" y1="${oy}" x2="${ox + pw + 8}" y2="${oy + ph}" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="${ox + pw + 14}" y="${oy + ph/2 + 5}" text-anchor="start" font-size="12" fill="#4c1d95">h = ${h} ${unitStr}</text>
</svg>`;
  return _svgURI(svg);
}

function makeSVGTrapezoid(a, b, h, unitStr) {
  const scale = Math.min(160 / Math.max(b, 1), 80 / Math.max(h, 1));
  const pw = Math.round(b * scale), ph = Math.round(h * scale);
  const pw2 = Math.round(a * scale);
  const ox = 20, oy = 20;
  const leftX = ox + (pw - pw2) / 2;
  const pts = `${leftX},${oy} ${leftX + pw2},${oy} ${ox + pw},${oy + ph} ${ox},${oy + ph}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 140" width="220" height="140">
  <polygon points="${pts}" fill="#fee2e2" stroke="#b91c1c" stroke-width="2"/>
  <text x="${leftX + pw2/2}" y="${oy - 6}" text-anchor="middle" font-size="13" fill="#7f1d1d">a = ${a} ${unitStr}</text>
  <text x="${ox + pw/2}" y="${oy + ph + 16}" text-anchor="middle" font-size="13" fill="#7f1d1d">b = ${b} ${unitStr}</text>
  <line x1="${ox + pw + 8}" y1="${oy}" x2="${ox + pw + 8}" y2="${oy + ph}" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="${ox + pw + 14}" y="${oy + ph/2 + 5}" text-anchor="start" font-size="12" fill="#7f1d1d">h = ${h} ${unitStr}</text>
</svg>`;
  return _svgURI(svg);
}

function makeSVGLShape(W, H, notchW, notchH, unitStr) {
  const scale = Math.min(160 / Math.max(W, 1), 110 / Math.max(H, 1));
  const pw = Math.round(W * scale), ph = Math.round(H * scale);
  const nw = Math.round(notchW * scale), nh = Math.round(notchH * scale);
  const ox = 20, oy = 15;
  const pts = `${ox},${oy} ${ox + pw - nw},${oy} ${ox + pw - nw},${oy + nh} ${ox + pw},${oy + nh} ${ox + pw},${oy + ph} ${ox},${oy + ph}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 140" width="220" height="140">
  <polygon points="${pts}" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
  <text x="${ox + pw/2}" y="${oy + ph + 16}" text-anchor="middle" font-size="12" fill="#064e3b">${W} ${unitStr}</text>
  <text x="${ox - 4}" y="${oy + ph/2}" text-anchor="end" font-size="12" fill="#064e3b">${H} ${unitStr}</text>
</svg>`;
  return _svgURI(svg);
}

function makeSVGSemiCircle(r, unitStr) {
  const cr = Math.min(70, r * 9);
  const cx = 110, cy = 80;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 140" width="220" height="140">
  <path d="M ${cx - cr} ${cy} A ${cr} ${cr} 0 0 1 ${cx + cr} ${cy} Z" fill="#fce7f3" stroke="#9d174d" stroke-width="2"/>
  <line x1="${cx - cr}" y1="${cy}" x2="${cx + cr}" y2="${cy}" stroke="#9d174d" stroke-width="2"/>
  <line x1="${cx}" y1="${cy}" x2="${cx + cr}" y2="${cy}" stroke="#be185d" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="${cx + cr/2}" y="${cy - 8}" text-anchor="middle" font-size="13" fill="#831843">r = ${r} ${unitStr}</text>
  <circle cx="${cx}" cy="${cy}" r="3" fill="#9d174d"/>
</svg>`;
  return _svgURI(svg);
}

// ── 3. QUESTION GENERATORS ────────────────────────────────────────────

// ── Level 1 : Circle Parts Vocabulary ─────────────────────────────────

const _L1_parts = [
  { term: "Radius",        def: "A line segment from the centre to any point on the circle" },
  { term: "Diameter",      def: "A line segment that passes through the centre joining two points on the circle" },
  { term: "Circumference", def: "The total distance around the outside of the circle" },
  { term: "Chord",         def: "A line segment joining two points on the circle that does not pass through the centre" },
  { term: "Arc",           def: "A part of the circumference (a curved section of the circle's edge)" },
  { term: "Sector",        def: "A 'pie slice' region bounded by two radii and an arc" },
  { term: "Tangent",       def: "A straight line that touches the circle at exactly one point" }
];

let _L1_mcqPool = null, _L1_matchPool = null, _L1_textPool = null;

function _resetL1Pools() {
  _L1_mcqPool   = _L1_parts.slice();
  _L1_matchPool = _L1_parts.slice();
  _L1_textPool  = _L1_parts.slice();
}

function _genL1_MCQ(diff) {
  if (!_L1_mcqPool || _L1_mcqPool.length === 0) _resetL1Pools();
  const target = pickAndRemove(_L1_mcqPool);
  const others = _L1_parts.filter(p => p.term !== target.term);
  const wrong3 = shuffle(others).slice(0, 3).map(p => p.term);
  const opts = shuffle([target.term, ...wrong3]);
  const correctOption = opts.indexOf(target.term);
  return {
    uid: makeUID("MCQ", 1, diff),
    level: 1, diff: diff, type: "MCQ",
    q: diff <= 2
      ? `<p>${target.def}</p><p>What is the correct name for this part of a circle?</p>`
      : `<p>Which term correctly describes: <em>${target.def.toLowerCase()}</em>?</p>`,
    working: "",
    img: "", imgAlt: "",
    hint: "Think about what each circle part looks like.",
    ncea: { standard: "N/A", ao: "N/A" },
    options: opts,
    correctOption: correctOption
  };
}

function _genL1_MATCH(diff) {
  if (!_L1_matchPool || _L1_matchPool.length < 4) _resetL1Pools();
  const chosen = [];
  for (let i = 0; i < Math.min(4, _L1_matchPool.length); i++) {
    chosen.push(pickAndRemove(_L1_matchPool));
  }
  const lefts  = shuffle(chosen.map(p => p.term));
  const rights = shuffle(chosen.map(p => p.def));
  const pairs  = chosen.map(p => ({ left: p.term, right: p.def }));
  return {
    uid: makeUID("MATCH", 1, diff),
    level: 1, diff: diff, type: "MATCH",
    q: "<p>Match each circle part to its correct definition.</p>",
    working: "",
    img: "", imgAlt: "",
    hint: "Start with the parts you are most confident about.",
    ncea: { standard: "N/A", ao: "N/A" },
    pairs: shuffle(pairs)
  };
}

function _genL1_TEXT(diff) {
  if (!_L1_textPool || _L1_textPool.length === 0) _resetL1Pools();
  const target = pickAndRemove(_L1_textPool);
  return {
    uid: makeUID("TEXT", 1, diff),
    level: 1, diff: diff, type: "TEXT",
    q: `<p>Spell the name of this circle part correctly:</p><p><em>${target.def}</em></p>`,
    working: "",
    img: "", imgAlt: "",
    hint: "Say the word aloud as you spell it.",
    ncea: { standard: "N/A", ao: "N/A" },
    a: target.term
  };
}

function _genL1_EXPLANATION(diff) {
  return {
    uid: makeUID("EXPLANATION", 1, diff),
    level: 1, diff: 3, type: "EXPLANATION",
    q: "<p>Explain the difference between a <strong>chord</strong> and a <strong>diameter</strong>. Include what they have in common and how they differ.</p>",
    working: "",
    img: "", imgAlt: "",
    hint: "Think about whether each line passes through the centre.",
    ncea: { standard: "N/A", ao: "N/A" },
    modelAnswer: "A chord and a diameter are both line segments that join two points on the circumference of a circle. The difference is that a diameter must pass through the centre of the circle, making it the longest possible chord. A chord does not have to pass through the centre, so it is shorter than the diameter.",
    markingChecklist: [
      "States that both chord and diameter connect two points on the circumference",
      "States that a diameter passes through the centre but a chord does not",
      "Identifies that the diameter is the longest possible chord"
    ]
  };
}

// ── Level 2 : Perimeter of Rectangles and Squares ─────────────────────

const _L2_contexts = [
  ["garden bed","m"], ["classroom floor","m"], ["swimming pool","m"],
  ["rugby field","m"], ["book cover","cm"], ["tile","cm"],
  ["solar panel","m"], ["kiwifruit block","m"]
];
let _L2_ctxPool = null;
function _getL2Ctx() {
  if (!_L2_ctxPool || _L2_ctxPool.length === 0) _L2_ctxPool = _L2_contexts.slice();
  return pickAndRemove(_L2_ctxPool);
}

function _genL2_NUMERIC(diff) {
  let l, w, P, q, img, imgAlt, working;
  if (diff === 1) {
    l = rand(3, 14); w = rand(2, l - 1);
    P = 2 * l + 2 * w;
    const ctx = _getL2Ctx();
    q = `<p>A ${ctx[0]} is ${l} ${ctx[1]} long and ${w} ${ctx[1]} wide.</p><p>Calculate the perimeter.</p>`;
    img = makeSVGRect(l, w, ctx[1]); imgAlt = `Rectangle ${l} by ${w} ${ctx[1]}`;
    working = `<p><strong>P = ${P} ${ctx[1]}</strong></p><p>P = 2l + 2w</p><p>P = 2 &times; ${l} + 2 &times; ${w}</p><p>P = ${2*l} + ${2*w} = ${P} ${ctx[1]}</p>`;
  } else if (diff === 2) {
    l = randF(2.5, 9.5, 1); w = randF(1.5, l - 0.5, 1);
    P = parseFloat((2*l + 2*w).toFixed(1));
    const ctx = _getL2Ctx();
    q = `<p>A ${ctx[0]} is ${l} ${ctx[1]} long and ${w} ${ctx[1]} wide.</p><p>Calculate the perimeter.</p>`;
    img = makeSVGRect(l, w, ctx[1]); imgAlt = `Rectangle ${l} by ${w} ${ctx[1]}`;
    working = `<p><strong>P = ${P} ${ctx[1]}</strong></p><p>P = 2 &times; ${l} + 2 &times; ${w} = ${(2*l).toFixed(1)} + ${(2*w).toFixed(1)} = ${P} ${ctx[1]}</p>`;
  } else if (diff === 3) {
    // Square with fraction side
    const num = rand(3, 9), den = rand(2, 4);
    const s = num / den;
    P = parseFloat((4 * s).toFixed(3));
    const Pn = 4 * num, Pd = den;
    const g = gcd(Pn, Pd);
    const Pnr = Pn/g, Pdr = Pd/g;
    const pStr = Pdr === 1 ? String(Pnr) : `${Pnr}/${Pdr}`;
    q = `<p>A square tile has a side length of \\(\\frac{${num}}{${den}}\\) cm.</p><p>Find the perimeter of the tile.</p>`;
    img = makeSVGSquare(`${num}/${den}`, "cm"); imgAlt = `Square with side ${num}/${den} cm`;
    working = `<p><strong>P = \\(\\frac{${Pnr}}{${Pdr}}\\) cm = ${P} cm</strong></p><p>P = 4 &times; \\(\\frac{${num}}{${den}}\\) = \\(\\frac{${4*num}}{${den}}\\) = \\(\\frac{${Pnr}}{${Pdr}}\\) cm</p>`;
    return {
      uid: makeUID("NUMERIC", 2, diff), level: 2, diff: diff, type: "NUMERIC",
      q: q, working: working, img: img, imgAlt: imgAlt, hint: "Use P = 4s for a square.",
      ncea: { standard: "N/A", ao: "N/A" }, a: String(P), units: ["cm"], tolerance: 0.02
    };
  } else {
    // Mixed units: l in m, w in cm
    const lm = rand(2, 5), wcm = rand(40, 90);
    const wm = wcm / 100;
    P = parseFloat((2*lm + 2*wm).toFixed(2));
    q = `<p>A rectangular solar panel is ${lm} m long and ${wcm} cm wide.</p><p>Calculate the perimeter in metres.</p>`;
    img = makeSVGRect(lm, wm, "m"); imgAlt = `Rectangle ${lm} m by ${wm} m`;
    working = `<p><strong>P = ${P} m</strong></p><p>Convert: ${wcm} cm = ${wm} m</p><p>P = 2 &times; ${lm} + 2 &times; ${wm} = ${(2*lm).toFixed(2)} + ${(2*wm).toFixed(2)} = ${P} m</p>`;
    return {
      uid: makeUID("NUMERIC", 2, diff), level: 2, diff: diff, type: "NUMERIC",
      q: q, working: working, img: img, imgAlt: imgAlt, hint: "Convert all measurements to the same unit first.",
      ncea: { standard: "N/A", ao: "N/A" }, a: String(P), units: ["m"], tolerance: 0.02
    };
  }
  const u = diff <= 2 ? _L2_contexts[0][1] : "cm";
  const ctx2 = diff <= 2 ? _getL2Ctx() : ["", "cm"];
  return {
    uid: makeUID("NUMERIC", 2, diff), level: 2, diff: diff, type: "NUMERIC",
    q: q, working: working, img: img, imgAlt: imgAlt, hint: "Use P = 2l + 2w.",
    ncea: { standard: "N/A", ao: "N/A" }, a: String(P), units: [diff===1?_L2_contexts[0][1]:"cm"], tolerance: 0.02
  };
}

function _genL2_MCQ(diff) {
  const l = rand(3, 12), w = rand(2, l - 1);
  const correct = 2*l + 2*w;
  const d1 = l + w;           // forget to double (add two sides only)
  const d2 = l * w;           // area instead of perimeter
  const d3 = 2*l + w;         // only double length
  const opts = shuffle([String(correct), String(d1), String(d2), String(d3)]);
  return {
    uid: makeUID("MCQ", 2, diff), level: 2, diff: diff, type: "MCQ",
    q: `<p>A rectangle has length ${l} cm and width ${w} cm.</p><p>What is the perimeter?</p>`,
    working: `<p><strong>Answer: ${correct} cm</strong></p><p>P = 2 &times; ${l} + 2 &times; ${w} = ${2*l} + ${2*w} = ${correct} cm</p>`,
    img: makeSVGRect(l, w, "cm"), imgAlt: `Rectangle ${l} by ${w} cm`,
    hint: "Perimeter adds all four sides.", ncea: { standard: "N/A", ao: "N/A" },
    options: opts.map(v => v + " cm"),
    correctOption: opts.indexOf(String(correct))
  };
}

function _genL2_MATCH(diff) {
  const pairs = shuffle([
    { left: "Perimeter of a rectangle", right: "P = 2l + 2w" },
    { left: "Perimeter of a square",    right: "P = 4s" },
    { left: "Area of a rectangle",      right: "A = l \\(\\times\\) w" },
    { left: "Area of a square",         right: "A = s\\(^2\\)" }
  ]);
  return {
    uid: makeUID("MATCH", 2, diff), level: 2, diff: diff, type: "MATCH",
    q: "<p>Match each shape to its perimeter or area formula.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Think about which formula uses multiplication vs addition.", ncea: { standard: "N/A", ao: "N/A" },
    pairs: pairs
  };
}

function _genL2_SEP(diff) {
  const l = rand(4, 12), w = rand(2, l - 1);
  const correct = 2*l + 2*w;
  // Error: student only adds two sides P = l + w
  const errorVal = l + w;
  return {
    uid: makeUID("SPOT_ERROR_STEP", 2, diff), level: 2, diff: diff, type: "SPOT_ERROR",
    q: `<p>A student found the perimeter of a rectangle with length ${l} cm and width ${w} cm.</p><p>Find the error in their working.</p>`,
    working: `<p><strong>Error is in Step 3.</strong></p><p>Step 3 should read: P = 2 &times; ${l} + 2 &times; ${w} = ${correct} cm</p><p>The student forgot to multiply each dimension by 2; they added only two sides.</p>`,
    img: makeSVGRect(l, w, "cm"), imgAlt: `Rectangle ${l} by ${w} cm`,
    hint: "Check whether the formula P = 2l + 2w is applied correctly.", ncea: { standard: "N/A", ao: "N/A" },
    subtype: "STEP",
    steps: [
      { id: 1, text: `P = 2l + 2w`, isError: false },
      { id: 2, text: `l = ${l} cm, w = ${w} cm`, isError: false },
      { id: 3, text: `P = ${l} + ${w} = ${errorVal} cm`, isError: true },
      { id: 4, text: `Perimeter = ${errorVal} cm`, isError: false }
    ]
  };
}

function _genL2_SEV(diff) {
  const l = rand(4, 10), w = rand(2, l - 1);
  const correct = 2*l + 2*w;
  const wrong = l + w; // error: l+w instead of 2l+2w
  const expr = `P = 2 \\(\\times\\) [${l}|1] + 2 \\(\\times\\) [${w}|2] = [${wrong}|3] cm`;
  return {
    uid: makeUID("SPOT_ERROR_VALUE", 2, diff), level: 2, diff: diff, type: "SPOT_ERROR",
    q: `<p>A student calculated the perimeter of a rectangle (length ${l} cm, width ${w} cm).</p><p>Click the value that is wrong.</p>`,
    working: `<p><strong>The error is token 3.</strong></p><p>${l} + ${l} + ${w} + ${w} = ${correct} cm, not ${wrong} cm.</p>`,
    img: "", imgAlt: "",
    hint: "Add all four sides: two lengths and two widths.", ncea: { standard: "N/A", ao: "N/A" },
    subtype: "VALUE",
    expression: expr,
    correctErrorId: 3,
    errorExplanation: `The correct total is ${correct} cm. The student added only l + w = ${wrong} instead of 2l + 2w = ${correct}.`
  };
}

function _genL2_EXP(diff) {
  return {
    uid: makeUID("EXPLANATION", 2, diff), level: 2, diff: 2, type: "EXPLANATION",
    q: "<p>Explain why the perimeter of a rectangle cannot be found by simply adding the length and the width together.</p>",
    working: "", img: "", imgAlt: "",
    hint: "How many sides does a rectangle have?",
    ncea: { standard: "N/A", ao: "N/A" },
    modelAnswer: "A rectangle has four sides — two lengths and two widths. Adding only the length and width gives the sum of just two sides. To find the perimeter you must add all four sides, which is the same as 2l + 2w. Leaving out the doubling means you are calculating half the actual perimeter.",
    markingChecklist: [
      "States that a rectangle has four sides (two pairs of equal sides)",
      "Explains that the correct formula is P = 2l + 2w",
      "Identifies that omitting the factor of 2 gives only half the perimeter"
    ]
  };
}

// ── Level 3 : Perimeter of Triangles and Other Polygons ───────────────

function _genL3_NUMERIC(diff) {
  let q, img, imgAlt, working, P, unitStr = "cm";
  if (diff === 1) {
    const a = rand(4, 10), b = rand(4, 12), c = rand(4, 11);
    P = a + b + c;
    q = `<p>A triangle has sides ${a} cm, ${b} cm, and ${c} cm.</p><p>Find the perimeter.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>P = ${P} cm</strong></p><p>P = ${a} + ${b} + ${c} = ${P} cm</p>`;
  } else if (diff === 2) {
    const a = randF(3.5, 8.5, 1), b = randF(3.5, 8.5, 1), c = randF(3.5, 8.5, 1);
    P = parseFloat((a + b + c).toFixed(1));
    q = `<p>A triangle has sides ${a} cm, ${b} cm, and ${c} cm.</p><p>Find the perimeter.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>P = ${P} cm</strong></p><p>P = ${a} + ${b} + ${c} = ${P} cm</p>`;
  } else if (diff === 3) {
    // Regular hexagon
    const s = rand(3, 8);
    P = 6 * s;
    q = `<p>A regular hexagon has a side length of ${s} cm.</p><p>Find its perimeter.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>P = ${P} cm</strong></p><p>A regular hexagon has 6 equal sides.</p><p>P = 6 &times; ${s} = ${P} cm</p>`;
  } else {
    // Isosceles triangle: only one equal side and base given
    const equalSide = rand(5, 12), base = rand(3, 8);
    P = 2 * equalSide + base;
    q = `<p>An isosceles triangle has two equal sides of ${equalSide} cm and a base of ${base} cm.</p><p>Find the perimeter.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>P = ${P} cm</strong></p><p>P = ${equalSide} + ${equalSide} + ${base} = ${2*equalSide} + ${base} = ${P} cm</p>`;
  }
  return {
    uid: makeUID("NUMERIC", 3, diff), level: 3, diff: diff, type: "NUMERIC",
    q: q, working: working, img: img, imgAlt: imgAlt,
    hint: "Add all side lengths together.", ncea: { standard: "N/A", ao: "N/A" },
    a: String(P), units: [unitStr], tolerance: 0.02
  };
}

function _genL3_MCQ(diff) {
  const n = rand(4, 8);
  const s = rand(3, 9);
  const correct = n * s;
  const d1 = (n - 1) * s;        // missed one side
  const d2 = n + s;               // added instead of multiplied
  const d3 = n * s + s;           // added one extra
  const opts = shuffle([String(correct), String(d1), String(d2), String(d3)]);
  return {
    uid: makeUID("MCQ", 3, diff), level: 3, diff: diff, type: "MCQ",
    q: `<p>A regular polygon has ${n} sides, each of length ${s} cm.</p><p>What is the perimeter?</p>`,
    working: `<p><strong>Answer: ${correct} cm</strong></p><p>P = ${n} &times; ${s} = ${correct} cm</p>`,
    img: "", imgAlt: "",
    hint: "For a regular polygon: P = number of sides × side length.",
    ncea: { standard: "N/A", ao: "N/A" },
    options: opts.map(v => v + " cm"),
    correctOption: opts.indexOf(String(correct))
  };
}

function _genL3_MATCH(diff) {
  const pairs = shuffle([
    { left: "Equilateral triangle (side s)",  right: "P = 3s" },
    { left: "Regular pentagon (side s)",       right: "P = 5s" },
    { left: "Regular hexagon (side s)",        right: "P = 6s" },
    { left: "Regular octagon (side s)",        right: "P = 8s" }
  ]);
  return {
    uid: makeUID("MATCH", 3, diff), level: 3, diff: diff, type: "MATCH",
    q: "<p>Match each regular polygon to its perimeter formula.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Perimeter of a regular polygon = number of sides × side length.",
    ncea: { standard: "N/A", ao: "N/A" }, pairs: pairs
  };
}

function _genL3_SEP(diff) {
  const a = rand(5, 12), base = rand(3, 8);
  const correct = 2 * a + base;
  const errorVal = a + base; // student forgot to double the equal side
  return {
    uid: makeUID("SPOT_ERROR_STEP", 3, diff), level: 3, diff: diff, type: "SPOT_ERROR",
    subtype: "STEP",
    q: `<p>A student worked out the perimeter of an isosceles triangle with equal sides ${a} cm and base ${base} cm.</p><p>Find the error.</p>`,
    working: `<p><strong>Error is in Step 2.</strong></p><p>There are TWO equal sides of ${a} cm, so: P = ${a} + ${a} + ${base} = ${correct} cm.</p>`,
    img: "", imgAlt: "",
    hint: "How many equal sides does an isosceles triangle have?",
    ncea: { standard: "N/A", ao: "N/A" },
    steps: [
      { id: 1, text: `Isosceles triangle: two equal sides = ${a} cm, base = ${base} cm`, isError: false },
      { id: 2, text: `P = ${a} + ${base} = ${errorVal} cm`, isError: true },
      { id: 3, text: `Perimeter = ${errorVal} cm`, isError: false }
    ]
  };
}

function _genL3_SEV(diff) {
  const n = rand(5, 7), s = rand(3, 8);
  const correct = n * s;
  const wrong = (n - 1) * s; // missed one side
  return {
    uid: makeUID("SPOT_ERROR_VALUE", 3, diff), level: 3, diff: diff, type: "SPOT_ERROR",
    subtype: "VALUE",
    q: `<p>A student calculated the perimeter of a regular polygon with ${n} sides of ${s} cm.</p><p>Click the wrong value.</p>`,
    working: `<p><strong>The error is token 3.</strong></p><p>P = ${n} &times; ${s} = ${correct} cm, not ${wrong} cm.</p>`,
    img: "", imgAlt: "",
    hint: `How many sides does the polygon have?`,
    ncea: { standard: "N/A", ao: "N/A" },
    expression: `P = [${n}|1] \\(\\times\\) [${s}|2] = [${wrong}|3] cm`,
    correctErrorId: 3,
    errorExplanation: `The student used ${n - 1} sides instead of ${n}. The correct answer is ${n} × ${s} = ${correct} cm.`
  };
}

function _genL3_EXP(diff) {
  return {
    uid: makeUID("EXPLANATION", 3, diff), level: 3, diff: 3, type: "EXPLANATION",
    q: "<p>Explain why multiplying the side length by the number of sides gives the correct perimeter for a regular polygon. Why can't you simply add one side length to the number of sides?</p>",
    working: "", img: "", imgAlt: "",
    hint: "Think about what 'perimeter' means and what 'regular' means.",
    ncea: { standard: "N/A", ao: "N/A" },
    modelAnswer: "A regular polygon has all sides equal in length. The perimeter is the total distance around the outside, which means you must add together every side. Since all sides are the same length, adding the side length once for each side is the same as multiplying the side length by the number of sides. Adding the side length to the number of sides does not make mathematical sense because those quantities have different units — one is a length (e.g., cm) and the other is a pure count.",
    markingChecklist: [
      "States that a regular polygon has all sides equal",
      "Explains that perimeter requires adding all sides, which equals side × number of sides",
      "Identifies that adding a length to a count is dimensionally incorrect"
    ]
  };
}

// ── Level 4 : Area of Rectangles and Squares ───────────────────────────

const _L4_contexts = [
  ["floor","m²"],["garden","m²"],["wall panel","m²"],["netball court","m²"],
  ["rectangular field","m²"],["tile","cm²"],["window","cm²"],["whiteboard","cm²"]
];
let _L4_ctxPool = null;
function _getL4Ctx() {
  if (!_L4_ctxPool || _L4_ctxPool.length === 0) _L4_ctxPool = _L4_contexts.slice();
  return pickAndRemove(_L4_ctxPool);
}

function _genL4_NUMERIC(diff) {
  let l, w, A, q, img, imgAlt, working, unitStr;
  if (diff === 1) {
    l = rand(4, 14); w = rand(3, l);
    A = l * w; unitStr = "m";
    const ctx = _getL4Ctx();
    q = `<p>A rectangular ${ctx[0]} is ${l} ${unitStr} long and ${w} ${unitStr} wide.</p><p>Find the area.</p>`;
    img = makeSVGRect(l, w, unitStr); imgAlt = `Rectangle ${l} by ${w} ${unitStr}`;
    working = `<p><strong>A = ${A} ${unitStr}²</strong></p><p>A = l &times; w = ${l} &times; ${w} = ${A} ${unitStr}²</p>`;
  } else if (diff === 2) {
    l = randF(3.5, 9.5, 1); w = randF(2.5, l, 1);
    A = parseFloat((l * w).toFixed(2)); unitStr = "m";
    const ctx = _getL4Ctx();
    q = `<p>A rectangular ${ctx[0]} is ${l} m long and ${w} m wide.</p><p>Find the area.</p>`;
    img = makeSVGRect(l, w, unitStr); imgAlt = `Rectangle ${l} by ${w} m`;
    working = `<p><strong>A = ${A} m²</strong></p><p>A = ${l} &times; ${w} = ${A} m²</p>`;
  } else if (diff === 3) {
    // Square with fraction side
    const num = rand(3, 7), den = rand(2, 4);
    A = parseFloat(((num * num) / (den * den)).toFixed(4)); unitStr = "m";
    const An = num * num, Ad = den * den, g = gcd(An, Ad);
    const Anr = An / g, Adr = Ad / g;
    q = `<p>A square paving slab has a side length of \\(\\frac{${num}}{${den}}\\) m.</p><p>Find its area.</p>`;
    img = makeSVGSquare(`${num}/${den}`, "m"); imgAlt = `Square side ${num}/${den} m`;
    working = `<p><strong>A = \\(\\frac{${Anr}}{${Adr}}\\) m²</strong></p><p>A = s² = \\(\\left(\\frac{${num}}{${den}}\\right)^2\\) = \\(\\frac{${An}}{${Ad}}\\) = \\(\\frac{${Anr}}{${Adr}}\\) m²</p>`;
    return {
      uid: makeUID("NUMERIC", 4, diff), level: 4, diff: diff, type: "NUMERIC",
      q: q, working: working, img: img, imgAlt: imgAlt,
      hint: "Area of a square = s².", ncea: { standard: "N/A", ao: "N/A" },
      a: String(A), units: ["m²"], tolerance: 0.02
    };
  } else {
    // Mixed units
    const lm = rand(3, 8), wcm = rand(50, 150);
    const wm = wcm / 100;
    A = parseFloat((lm * wm).toFixed(4)); unitStr = "m";
    q = `<p>A rectangular wall panel is ${lm} m wide and ${wcm} cm tall.</p><p>Find the area in m².</p>`;
    img = makeSVGRect(lm, wm, "m"); imgAlt = `Rectangle ${lm} m by ${wm} m`;
    working = `<p><strong>A = ${A} m²</strong></p><p>Convert: ${wcm} cm = ${wm} m</p><p>A = ${lm} &times; ${wm} = ${A} m²</p>`;
  }
  return {
    uid: makeUID("NUMERIC", 4, diff), level: 4, diff: diff, type: "NUMERIC",
    q: q, working: working, img: img, imgAlt: imgAlt,
    hint: "Area = length × width. Remember to use square units.", ncea: { standard: "N/A", ao: "N/A" },
    a: String(A), units: ["m²", "cm²"], tolerance: 0.02
  };
}

function _genL4_MCQ(diff) {
  const l = rand(4, 12), w = rand(3, l);
  const correct = l * w;
  const d1 = 2*l + 2*w;   // perimeter instead
  const d2 = l + w;        // half perimeter
  const d3 = l * l;        // used l² instead of l×w
  const opts = shuffle([String(correct), String(d1), String(d2), String(d3)]);
  return {
    uid: makeUID("MCQ", 4, diff), level: 4, diff: diff, type: "MCQ",
    q: `<p>A rectangle is ${l} m long and ${w} m wide.</p><p>What is its area?</p>`,
    working: `<p><strong>Answer: ${correct} m²</strong></p><p>A = l &times; w = ${l} &times; ${w} = ${correct} m²</p>`,
    img: makeSVGRect(l, w, "m"), imgAlt: `Rectangle ${l} by ${w} m`,
    hint: "Area = l × w. Don't confuse with perimeter.",
    ncea: { standard: "N/A", ao: "N/A" },
    options: opts.map(v => v + " m²"),
    correctOption: opts.indexOf(String(correct))
  };
}

function _genL4_MATCH(diff) {
  const pairs = shuffle([
    { left: "Area of rectangle",   right: "l \\(\\times\\) w" },
    { left: "Area of square",      right: "s\\(^2\\)" },
    { left: "Perimeter of square", right: "4s" },
    { left: "Perimeter of rectangle", right: "2l + 2w" }
  ]);
  return {
    uid: makeUID("MATCH", 4, diff), level: 4, diff: diff, type: "MATCH",
    q: "<p>Match each shape measurement to its correct formula.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Area uses multiplication; perimeter uses addition.",
    ncea: { standard: "N/A", ao: "N/A" }, pairs: pairs
  };
}

function _genL4_SEP(diff) {
  const l = rand(5, 12), w = rand(3, l);
  const correct = l * w;
  const wrong = 2*l + 2*w; // student calculated perimeter
  return {
    uid: makeUID("SPOT_ERROR_STEP", 4, diff), level: 4, diff: diff, type: "SPOT_ERROR",
    subtype: "STEP",
    q: `<p>A student calculated the area of a rectangle with length ${l} m and width ${w} m.</p><p>Find the error.</p>`,
    working: `<p><strong>Error is in Step 2.</strong></p><p>Area uses multiplication: A = ${l} &times; ${w} = ${correct} m²</p>`,
    img: makeSVGRect(l, w, "m"), imgAlt: `Rectangle ${l} by ${w} m`,
    hint: "Which formula gives area — multiplication or addition?",
    ncea: { standard: "N/A", ao: "N/A" },
    steps: [
      { id: 1, text: `A = l \\(\\times\\) w`, isError: false },
      { id: 2, text: `A = 2 \\(\\times\\) ${l} + 2 \\(\\times\\) ${w} = ${wrong} m²`, isError: true },
      { id: 3, text: `Area = ${wrong} m²`, isError: false }
    ]
  };
}

function _genL4_SEV(diff) {
  const l = rand(5, 12), w = rand(3, l);
  const correct = l * w;
  const wrong = l * l; // used l² instead of l×w
  return {
    uid: makeUID("SPOT_ERROR_VALUE", 4, diff), level: 4, diff: diff, type: "SPOT_ERROR",
    subtype: "VALUE",
    q: `<p>A student found the area of a rectangle (${l} m × ${w} m). Click the wrong value.</p>`,
    working: `<p><strong>Error is token 3.</strong></p><p>A = ${l} &times; ${w} = ${correct} m², not ${wrong} m².</p>`,
    img: "", imgAlt: "",
    hint: "Check which value was squared incorrectly.",
    ncea: { standard: "N/A", ao: "N/A" },
    expression: `A = [${l}|1] \\(\\times\\) [${w}|2] = [${wrong}|3] m²`,
    correctErrorId: 3,
    errorExplanation: `The student used ${l} × ${l} = ${wrong} instead of ${l} × ${w} = ${correct}.`
  };
}

function _genL4_EXP(diff) {
  return {
    uid: makeUID("EXPLANATION", 4, diff), level: 4, diff: 2, type: "EXPLANATION",
    q: "<p>Explain the difference between area and perimeter. Give an example of a real-life situation where you would need each one.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Think about what each measurement actually tells you.",
    ncea: { standard: "N/A", ao: "N/A" },
    modelAnswer: "Perimeter measures the total distance around the outside of a shape, so it is used when you need to know how much border material is needed — for example, fencing around a field. Area measures the space enclosed inside a shape, so it is used when you need to know how much surface is covered — for example, carpet for a floor.",
    markingChecklist: [
      "Correctly defines perimeter as the total distance around the outside",
      "Correctly defines area as the space enclosed inside the shape",
      "Gives a valid real-life example for perimeter",
      "Gives a valid real-life example for area"
    ]
  };
}

// ── Level 5 : Area of Triangles ────────────────────────────────────────

function _genL5_NUMERIC(diff) {
  let b, h, A, q, img, imgAlt, working;
  if (diff === 1) {
    b = rand(4, 16) * 2; h = rand(3, 10); // even base so A is integer
    A = b * h / 2;
    q = `<p>A triangle has a base of ${b} cm and a perpendicular height of ${h} cm.</p><p>Calculate its area.</p>`;
    img = makeSVGTriangle(b, h, "cm"); imgAlt = `Triangle base ${b} cm height ${h} cm`;
    working = `<p><strong>A = ${A} cm²</strong></p><p>A = \\(\\frac{b \\times h}{2}\\) = \\(\\frac{${b} \\times ${h}}{2}\\) = \\(\\frac{${b*h}}{2}\\) = ${A} cm²</p>`;
  } else if (diff === 2) {
    b = randF(4.0, 12.0, 1); h = randF(3.0, 9.0, 1);
    A = parseFloat((b * h / 2).toFixed(2));
    q = `<p>A triangle has a base of ${b} m and a perpendicular height of ${h} m.</p><p>Calculate its area.</p>`;
    img = makeSVGTriangle(b, h, "m"); imgAlt = `Triangle base ${b} m height ${h} m`;
    working = `<p><strong>A = ${A} m²</strong></p><p>A = \\(\\frac{${b} \\times ${h}}{2}\\) = \\(\\frac{${parseFloat((b*h).toFixed(2))}}{2}\\) = ${A} m²</p>`;
  } else if (diff === 3) {
    const bNum = rand(3, 8), bDen = 2, hNum = rand(3, 6), hDen = 3;
    b = bNum / bDen; h = hNum / hDen;
    A = parseFloat((b * h / 2).toFixed(4));
    const An = bNum * hNum, Ad = bDen * hDen * 2, g = gcd(An, Ad);
    q = `<p>A triangle has a base of \\(\\frac{${bNum}}{${bDen}}\\) cm and a perpendicular height of \\(\\frac{${hNum}}{${hDen}}\\) cm.</p><p>Find its area.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>A = \\(\\frac{${An/g}}{${Ad/g}}\\) cm²</strong></p><p>A = \\(\\frac{1}{2} \\times \\frac{${bNum}}{${bDen}} \\times \\frac{${hNum}}{${hDen}}\\) = \\(\\frac{${An}}{${Ad}}\\) = \\(\\frac{${An/g}}{${Ad/g}}\\) cm²</p>`;
  } else {
    // Right-angled triangle: hypotenuse labelled, student must use legs
    const leg1 = rand(3,8)*1, leg2 = rand(3,8)*1;
    const hyp = parseFloat(Math.sqrt(leg1*leg1 + leg2*leg2).toFixed(2));
    A = parseFloat((leg1 * leg2 / 2).toFixed(2));
    q = `<p>A right-angled triangle has legs of ${leg1} m and ${leg2} m, and a hypotenuse of ${hyp} m.</p><p>Calculate the area using the correct height.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>A = ${A} m²</strong></p><p>Use the two legs as base and height (they are perpendicular).</p><p>A = \\(\\frac{${leg1} \\times ${leg2}}{2}\\) = \\(\\frac{${leg1*leg2}}{2}\\) = ${A} m²</p><p>Do NOT use the hypotenuse as the height.</p>`;
  }
  return {
    uid: makeUID("NUMERIC", 5, diff), level: 5, diff: diff, type: "NUMERIC",
    q: q, working: working, img: img, imgAlt: imgAlt,
    hint: "A = ½ × base × perpendicular height.", ncea: { standard: "N/A", ao: "N/A" },
    a: String(A), units: ["cm²","m²"], tolerance: 0.02
  };
}

function _genL5_MCQ(diff) {
  const b = rand(6, 16), h = rand(4, 10);
  const correct = b * h / 2;
  const d1 = b * h;           // forgot to divide by 2
  const d2 = b / 2 * h / 2;  // halved both base and height
  const d3 = (b + h) / 2;    // averaged instead of multiplying
  const opts = shuffle([String(correct), String(d1), String(d2), String(d3)]);
  return {
    uid: makeUID("MCQ", 5, diff), level: 5, diff: diff, type: "MCQ",
    q: `<p>A triangle has a base of ${b} cm and a perpendicular height of ${h} cm.</p><p>What is its area?</p>`,
    working: `<p><strong>Answer: ${correct} cm²</strong></p><p>A = \\(\\frac{${b} \\times ${h}}{2}\\) = ${correct} cm²</p>`,
    img: makeSVGTriangle(b, h, "cm"), imgAlt: `Triangle b=${b} h=${h}`,
    hint: "Don't forget to divide by 2.",
    ncea: { standard: "N/A", ao: "N/A" },
    options: opts.map(v => v + " cm²"),
    correctOption: opts.indexOf(String(correct))
  };
}

function _genL5_MATCH(diff) {
  const pairs = shuffle([
    { left: "Area of a triangle",       right: "\\(\\frac{1}{2} b h\\)" },
    { left: "Area of a rectangle",      right: "\\(l \\times w\\)" },
    { left: "Area of a parallelogram",  right: "\\(b \\times h\\)" },
    { left: "Area of a trapezoid",      right: "\\(\\frac{1}{2}(a+b)h\\)" }
  ]);
  return {
    uid: makeUID("MATCH", 5, diff), level: 5, diff: diff, type: "MATCH",
    q: "<p>Match each shape to its area formula.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Only the triangle formula divides by 2.",
    ncea: { standard: "N/A", ao: "N/A" }, pairs: pairs
  };
}

function _genL5_SEP(diff) {
  const b = rand(8, 16), h = rand(4, 10);
  const correct = b * h / 2;
  const wrong = b * h; // forgot ÷2
  return {
    uid: makeUID("SPOT_ERROR_STEP", 5, diff), level: 5, diff: diff, type: "SPOT_ERROR",
    subtype: "STEP",
    q: `<p>A student found the area of a triangle with base ${b} cm and perpendicular height ${h} cm. Find the error.</p>`,
    working: `<p><strong>Error is in Step 2.</strong></p><p>A = \\(\\frac{${b} \\times ${h}}{2}\\) = ${correct} cm²</p>`,
    img: makeSVGTriangle(b, h, "cm"), imgAlt: `Triangle b=${b} h=${h}`,
    hint: "The triangle formula has a ½ factor. Is it applied?",
    ncea: { standard: "N/A", ao: "N/A" },
    steps: [
      { id: 1, text: `A = \\(\\frac{b \\times h}{2}\\)`, isError: false },
      { id: 2, text: `A = ${b} \\(\\times\\) ${h} = ${wrong} cm²`, isError: true },
      { id: 3, text: `Area = ${wrong} cm²`, isError: false }
    ]
  };
}

function _genL5_SEV(diff) {
  const b = rand(8, 14), h = rand(4, 10);
  const correct = b * h / 2;
  const wrong = b * h; // forgot ÷2
  return {
    uid: makeUID("SPOT_ERROR_VALUE", 5, diff), level: 5, diff: diff, type: "SPOT_ERROR",
    subtype: "VALUE",
    q: `<p>A student calculated the area of a triangle (base ${b} cm, height ${h} cm). Click the wrong value.</p>`,
    working: `<p><strong>Error is token 3.</strong></p><p>A = \\(\\frac{1}{2} \\times ${b} \\times ${h}\\) = ${correct} cm², not ${wrong} cm².</p>`,
    img: "", imgAlt: "",
    hint: "The answer should be half of b × h.",
    ncea: { standard: "N/A", ao: "N/A" },
    expression: `A = \\(\\frac{1}{2}\\) \\(\\times\\) [${b}|1] \\(\\times\\) [${h}|2] = [${wrong}|3] cm²`,
    correctErrorId: 3,
    errorExplanation: `The student forgot to divide by 2. The correct answer is ${b} × ${h} ÷ 2 = ${correct} cm².`
  };
}

function _genL5_EXP(diff) {
  return {
    uid: makeUID("EXPLANATION", 5, diff), level: 5, diff: 2, type: "EXPLANATION",
    q: "<p>A student says: \"I find the area of a triangle by multiplying the base by the height.\" Explain what is wrong with this statement and give the correct method.</p>",
    working: "", img: "", imgAlt: "",
    hint: "What shape is made when you combine two identical triangles?",
    ncea: { standard: "N/A", ao: "N/A" },
    modelAnswer: "The student has forgotten to divide by 2. The formula for the area of a triangle is A = ½ × base × height. This is because a triangle is exactly half of a parallelogram with the same base and height. So multiplying base by height gives the area of the full parallelogram, and you must halve it to get the triangle's area.",
    markingChecklist: [
      "Identifies that the formula should include division by 2 (or multiply by ½)",
      "States the correct formula: A = ½ × base × perpendicular height",
      "Justifies why the ½ is needed (triangle is half a parallelogram)"
    ]
  };
}

// ── Level 6 : Area of Parallelograms ──────────────────────────────────

function _genL6_NUMERIC(diff) {
  let b, h, A, slant, q, img, imgAlt, working;
  if (diff === 1) {
    b = rand(5, 14); h = rand(3, 9);
    A = b * h;
    q = `<p>A parallelogram has a base of ${b} cm and a perpendicular height of ${h} cm.</p><p>Find its area.</p>`;
    img = makeSVGParallelogram(b, h, Math.round(h * 1.2), "cm"); imgAlt = `Parallelogram b=${b} h=${h}`;
    working = `<p><strong>A = ${A} cm²</strong></p><p>A = b &times; h = ${b} &times; ${h} = ${A} cm²</p>`;
  } else if (diff === 2) {
    b = randF(4.5, 12.5, 1); h = randF(3.5, 8.5, 1);
    A = parseFloat((b * h).toFixed(2));
    q = `<p>A parallelogram has a base of ${b} m and a perpendicular height of ${h} m.</p><p>Find its area.</p>`;
    img = makeSVGParallelogram(b, h, Math.round(h * 1.2), "m"); imgAlt = `Parallelogram b=${b} h=${h}`;
    working = `<p><strong>A = ${A} m²</strong></p><p>A = ${b} &times; ${h} = ${A} m²</p>`;
  } else if (diff === 3) {
    const bNum = rand(5, 9), bDen = 2, hNum = rand(4, 8), hDen = 3;
    b = bNum / bDen; h = hNum / hDen;
    A = parseFloat((b * h).toFixed(4));
    const An = bNum * hNum, Ad = bDen * hDen, g = gcd(An, Ad);
    q = `<p>A parallelogram has base \\(\\frac{${bNum}}{${bDen}}\\) cm and height \\(\\frac{${hNum}}{${hDen}}\\) cm.</p><p>Find its area.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>A = \\(\\frac{${An/g}}{${Ad/g}}\\) cm²</strong></p><p>A = \\(\\frac{${bNum}}{${bDen}} \\times \\frac{${hNum}}{${hDen}}\\) = \\(\\frac{${An}}{${Ad}}\\) = \\(\\frac{${An/g}}{${Ad/g}}\\) cm²</p>`;
  } else {
    // Slant side given — must use perpendicular height
    b = rand(8, 14); h = rand(4, 8); slant = parseFloat(Math.sqrt(h*h + (b*0.4)*(b*0.4)).toFixed(1));
    A = b * h;
    q = `<p>A parallelogram has a base of ${b} cm, a perpendicular height of ${h} cm, and a slant side of ${slant} cm.</p><p>Find the area. Use the correct height.</p>`;
    img = makeSVGParallelogram(b, h, slant, "cm"); imgAlt = `Parallelogram b=${b} h=${h} slant=${slant}`;
    working = `<p><strong>A = ${A} cm²</strong></p><p>Use the perpendicular height h = ${h} cm (not the slant side).</p><p>A = ${b} &times; ${h} = ${A} cm²</p>`;
  }
  return {
    uid: makeUID("NUMERIC", 6, diff), level: 6, diff: diff, type: "NUMERIC",
    q: q, working: working, img: img, imgAlt: imgAlt,
    hint: "A = base × perpendicular height (not the slant side).", ncea: { standard: "N/A", ao: "N/A" },
    a: String(A), units: ["cm²","m²"], tolerance: 0.02
  };
}

function _genL6_MCQ(diff) {
  const b = rand(6, 12), h = rand(3, 8), slant = Math.round(h * 1.3);
  const correct = b * h;
  const d1 = b * slant;      // used slant side as height
  const d2 = b * h / 2;      // applied triangle formula
  const d3 = 2*b + 2*slant;  // calculated perimeter instead
  const opts = shuffle([String(correct), String(d1), String(d2), String(d3)]);
  return {
    uid: makeUID("MCQ", 6, diff), level: 6, diff: diff, type: "MCQ",
    q: `<p>A parallelogram has base ${b} cm, perpendicular height ${h} cm, and slant side ${slant} cm.</p><p>What is the area?</p>`,
    working: `<p><strong>Answer: ${correct} cm²</strong></p><p>A = b &times; h = ${b} &times; ${h} = ${correct} cm²</p><p>Use the perpendicular height, not the slant side.</p>`,
    img: makeSVGParallelogram(b, h, slant, "cm"), imgAlt: `Parallelogram b=${b} h=${h} slant=${slant}`,
    hint: "Which measurement is the perpendicular height?",
    ncea: { standard: "N/A", ao: "N/A" },
    options: opts.map(v => v + " cm²"),
    correctOption: opts.indexOf(String(correct))
  };
}

function _genL6_MATCH(diff) {
  const pairs = shuffle([
    { left: "Area of parallelogram",  right: "b \\(\\times\\) h (perpendicular)" },
    { left: "Area of triangle",       right: "\\(\\frac{1}{2}\\) b \\(\\times\\) h" },
    { left: "Area of rectangle",      right: "l \\(\\times\\) w" },
    { left: "Area of trapezoid",      right: "\\(\\frac{1}{2}(a+b)h\\)" }
  ]);
  return {
    uid: makeUID("MATCH", 6, diff), level: 6, diff: diff, type: "MATCH",
    q: "<p>Match each shape to its area formula.</p>",
    working: "", img: "", imgAlt: "",
    hint: "The parallelogram formula does NOT divide by 2.",
    ncea: { standard: "N/A", ao: "N/A" }, pairs: pairs
  };
}

function _genL6_SEP(diff) {
  const b = rand(7, 14), h = rand(4, 9), slant = Math.round(h * 1.3);
  const correct = b * h;
  const wrong = b * slant; // used slant as height
  return {
    uid: makeUID("SPOT_ERROR_STEP", 6, diff), level: 6, diff: diff, type: "SPOT_ERROR",
    subtype: "STEP",
    q: `<p>A student found the area of a parallelogram with base ${b} cm, perpendicular height ${h} cm, and slant side ${slant} cm. Find the error.</p>`,
    working: `<p><strong>Error is in Step 2.</strong></p><p>A = b &times; h = ${b} &times; ${h} = ${correct} cm² (use perpendicular height)</p>`,
    img: makeSVGParallelogram(b, h, slant, "cm"), imgAlt: `Parallelogram`,
    hint: "Which measurement is the correct height?",
    ncea: { standard: "N/A", ao: "N/A" },
    steps: [
      { id: 1, text: `A = b \\(\\times\\) h`, isError: false },
      { id: 2, text: `A = ${b} \\(\\times\\) ${slant} = ${wrong} cm²`, isError: true },
      { id: 3, text: `Area = ${wrong} cm²`, isError: false }
    ]
  };
}

function _genL6_SEV(diff) {
  const b = rand(7, 14), h = rand(4, 9);
  const correct = b * h;
  const wrong = b * h / 2; // applied ÷2 (triangle error)
  return {
    uid: makeUID("SPOT_ERROR_VALUE", 6, diff), level: 6, diff: diff, type: "SPOT_ERROR",
    subtype: "VALUE",
    q: `<p>A student calculated the area of a parallelogram (base ${b} cm, height ${h} cm). Click the wrong value.</p>`,
    working: `<p><strong>Error is token 3.</strong></p><p>A = ${b} &times; ${h} = ${correct} cm², not ${wrong} cm².</p>`,
    img: "", imgAlt: "",
    hint: "The parallelogram formula does NOT have a ½.",
    ncea: { standard: "N/A", ao: "N/A" },
    expression: `A = [${b}|1] \\(\\times\\) [${h}|2] ÷ 2 = [${wrong}|3] cm²`,
    correctErrorId: 3,
    errorExplanation: `The student incorrectly divided by 2 (that is the triangle formula). A = ${b} × ${h} = ${correct} cm².`
  };
}

function _genL6_EXP(diff) {
  return {
    uid: makeUID("EXPLANATION", 6, diff), level: 6, diff: 2, type: "EXPLANATION",
    q: "<p>Explain why you must use the <strong>perpendicular height</strong> and not the slant side when finding the area of a parallelogram.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Think about what 'height' means geometrically.",
    ncea: { standard: "N/A", ao: "N/A" },
    modelAnswer: "Area measures the space enclosed inside a shape, which depends on how far apart the two parallel sides actually are — measured at right angles. The slant side is the diagonal distance along the edge, which is always longer than the perpendicular distance. Using the slant side would give an answer that is too large. The formula A = b × h only works when h is measured perpendicularly between the two parallel bases.",
    markingChecklist: [
      "States that height must be measured perpendicularly (at 90°) between the parallel sides",
      "Explains that the slant side is longer than the perpendicular height",
      "Concludes that using the slant side would overestimate the area"
    ]
  };
}

// ── Level 7 : Area of Trapezoids ──────────────────────────────────────

function _genL7_NUMERIC(diff) {
  let a, b, h, A, q, img, imgAlt, working;
  if (diff === 1) {
    a = rand(4, 8); b = rand(a+2, 14); h = rand(3, 8);
    A = 0.5 * (a + b) * h;
    q = `<p>A trapezoid has parallel sides of ${a} cm and ${b} cm, and a perpendicular height of ${h} cm.</p><p>Find the area.</p>`;
    img = makeSVGTrapezoid(a, b, h, "cm"); imgAlt = `Trapezoid a=${a} b=${b} h=${h}`;
    working = `<p><strong>A = ${A} cm²</strong></p><p>A = \\(\\frac{1}{2}(a+b) \\times h\\) = \\(\\frac{1}{2}(${a}+${b}) \\times ${h}\\) = \\(\\frac{1}{2} \\times ${a+b} \\times ${h}\\) = ${A} cm²</p>`;
  } else if (diff === 2) {
    a = randF(3.5, 7.5, 1); b = randF(a+1, 12.5, 1); h = randF(3.0, 7.0, 1);
    A = parseFloat((0.5 * (a + b) * h).toFixed(2));
    q = `<p>A trapezoid has parallel sides of ${a} m and ${b} m, and a perpendicular height of ${h} m.</p><p>Find the area.</p>`;
    img = makeSVGTrapezoid(a, b, h, "m"); imgAlt = `Trapezoid a=${a} b=${b} h=${h}`;
    working = `<p><strong>A = ${A} m²</strong></p><p>A = \\(\\frac{1}{2}(${a}+${b}) \\times ${h}\\) = \\(\\frac{1}{2} \\times ${parseFloat((a+b).toFixed(1))} \\times ${h}\\) = ${A} m²</p>`;
  } else if (diff === 3) {
    const aN=3,aD=2, bN=5,bD=2, hV=4;
    a=aN/aD; b=bN/bD; h=hV;
    A = parseFloat((0.5*(a+b)*h).toFixed(4));
    const sumN=aN*bD+bN*aD, sumD=aD*bD, g=gcd(sumN,sumD);
    q = `<p>A trapezoid has parallel sides \\(\\frac{${aN}}{${aD}}\\) m and \\(\\frac{${bN}}{${bD}}\\) m, height ${hV} m.</p><p>Find the area.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>A = ${A} m²</strong></p><p>a + b = \\(\\frac{${aN}}{${aD}} + \\frac{${bN}}{${bD}}\\) = \\(\\frac{${sumN}}{${sumD}}\\) = \\(\\frac{${sumN/g}}{${sumD/g}}\\)</p><p>A = \\(\\frac{1}{2} \\times \\frac{${sumN/g}}{${sumD/g}} \\times ${hV}\\) = ${A} m²</p>`;
  } else {
    // Complex diagram — legs and heights all labelled
    a = rand(5, 9); b = rand(a+3, 15); h = rand(4, 8);
    const leg1 = Math.round(Math.sqrt(h*h + ((b-a)/2)*((b-a)/2)));
    A = 0.5 * (a + b) * h;
    q = `<p>A trapezoid has parallel sides ${a} cm and ${b} cm, perpendicular height ${h} cm, and slant legs of ${leg1} cm. Find the area.</p>`;
    img = makeSVGTrapezoid(a, b, h, "cm"); imgAlt = `Trapezoid`;
    working = `<p><strong>A = ${A} cm²</strong></p><p>Use the two parallel sides and the perpendicular height only.</p><p>A = \\(\\frac{1}{2}(${a}+${b}) \\times ${h}\\) = ${A} cm²</p>`;
  }
  return {
    uid: makeUID("NUMERIC", 7, diff), level: 7, diff: diff, type: "NUMERIC",
    q: q, working: working, img: img, imgAlt: imgAlt,
    hint: "A = ½(a + b) × h. Add the two parallel sides first.", ncea: { standard: "N/A", ao: "N/A" },
    a: String(A), units: ["cm²","m²"], tolerance: 0.02
  };
}

function _genL7_MCQ(diff) {
  const a = rand(4, 8), b = rand(a+2, 14), h = rand(3, 8);
  const correct = 0.5 * (a + b) * h;
  const d1 = (a + b) * h;         // forgot ÷2
  const d2 = 0.5 * b * h;         // only used one parallel side
  const d3 = a + b + 2*h;         // perimeter-like calculation
  const opts = shuffle([String(correct), String(d1), String(d2), String(d3)]);
  return {
    uid: makeUID("MCQ", 7, diff), level: 7, diff: diff, type: "MCQ",
    q: `<p>A trapezoid has parallel sides ${a} cm and ${b} cm, and height ${h} cm.</p><p>What is the area?</p>`,
    working: `<p><strong>Answer: ${correct} cm²</strong></p><p>A = \\(\\frac{1}{2}(${a}+${b}) \\times ${h}\\) = \\(\\frac{1}{2} \\times ${a+b} \\times ${h}\\) = ${correct} cm²</p>`,
    img: makeSVGTrapezoid(a, b, h, "cm"), imgAlt: `Trapezoid a=${a} b=${b} h=${h}`,
    hint: "A = ½(a + b)h — remember BOTH parallel sides.",
    ncea: { standard: "N/A", ao: "N/A" },
    options: opts.map(v => v + " cm²"),
    correctOption: opts.indexOf(String(correct))
  };
}

function _genL7_MATCH(diff) {
  const pairs = shuffle([
    { left: "Two parallel sides",    right: "a and b in the trapezoid formula" },
    { left: "Perpendicular height",  right: "h in A = \\(\\frac{1}{2}(a+b)h\\)" },
    { left: "Slant (non-parallel) sides", right: "Not used in the area formula" },
    { left: "½ in the formula",       right: "Accounts for the trapezoid being between a rectangle and triangle" }
  ]);
  return {
    uid: makeUID("MATCH", 7, diff), level: 7, diff: diff, type: "MATCH",
    q: "<p>Match each term to its meaning in the trapezoid area formula.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Only the two parallel sides and the perpendicular height are used.",
    ncea: { standard: "N/A", ao: "N/A" }, pairs: pairs
  };
}

function _genL7_SEP(diff) {
  const a = rand(4, 8), b = rand(a+2, 14), h = rand(3, 8);
  const correct = 0.5 * (a + b) * h;
  const wrong = (a + b) * h; // forgot ÷2
  return {
    uid: makeUID("SPOT_ERROR_STEP", 7, diff), level: 7, diff: diff, type: "SPOT_ERROR",
    subtype: "STEP",
    q: `<p>A student found the area of a trapezoid (a=${a} cm, b=${b} cm, h=${h} cm). Find the error.</p>`,
    working: `<p><strong>Error is in Step 3.</strong></p><p>A = \\(\\frac{1}{2}\\) × ${a+b} × ${h} = ${correct} cm²</p>`,
    img: makeSVGTrapezoid(a, b, h, "cm"), imgAlt: `Trapezoid`,
    hint: "Where does the ½ belong?",
    ncea: { standard: "N/A", ao: "N/A" },
    steps: [
      { id: 1, text: `A = \\(\\frac{1}{2}(a + b) \\times h\\)`, isError: false },
      { id: 2, text: `a + b = ${a} + ${b} = ${a+b}`, isError: false },
      { id: 3, text: `A = ${a+b} \\(\\times\\) ${h} = ${wrong} cm²`, isError: true },
      { id: 4, text: `Area = ${wrong} cm²`, isError: false }
    ]
  };
}

function _genL7_SEV(diff) {
  const a = rand(4, 8), b = rand(a+2, 12), h = rand(3, 7);
  const correct = 0.5 * (a + b) * h;
  const wrong = 0.5 * b * h; // used only one parallel side
  return {
    uid: makeUID("SPOT_ERROR_VALUE", 7, diff), level: 7, diff: diff, type: "SPOT_ERROR",
    subtype: "VALUE",
    q: `<p>A student calculated the area of a trapezoid (a=${a} cm, b=${b} cm, h=${h} cm). Click the wrong value.</p>`,
    working: `<p><strong>Error is token 2.</strong></p><p>Both parallel sides must be added: (${a}+${b}) = ${a+b}. A = \\(\\frac{1}{2} \\times ${a+b} \\times ${h}\\) = ${correct} cm²</p>`,
    img: "", imgAlt: "",
    hint: "Check how many parallel sides are included.",
    ncea: { standard: "N/A", ao: "N/A" },
    expression: `A = \\(\\frac{1}{2}\\) \\(\\times\\) [${b}|2] \\(\\times\\) [${h}|3] = [${wrong}|4] cm²`,
    correctErrorId: 2,
    errorExplanation: `The student used only b = ${b} instead of (a + b) = ${a+b}. The correct answer is ½ × ${a+b} × ${h} = ${correct} cm².`
  };
}

function _genL7_EXP(diff) {
  return {
    uid: makeUID("EXPLANATION", 7, diff), level: 7, diff: 2, type: "EXPLANATION",
    q: "<p>Explain why the trapezoid area formula uses the average of the two parallel sides, and why using just one parallel side would give the wrong answer.</p>",
    working: "", img: "", imgAlt: "",
    hint: "What is the average of a and b?",
    ncea: { standard: "N/A", ao: "N/A" },
    modelAnswer: "A trapezoid has two parallel sides of different lengths. The ½(a + b) part of the formula calculates the average length of the two parallel sides. Multiplying this average by the perpendicular height gives the total area. If you only used one parallel side you would get the area of either a rectangle or a triangle, both of which would be the wrong shape and give an incorrect answer.",
    markingChecklist: [
      "Identifies that ½(a + b) finds the average of the two parallel sides",
      "Explains that the area depends on both parallel sides, not just one",
      "States that using only one side would give the area of a different shape"
    ]
  };
}

// ── Level 8 : Circumference of a Circle ───────────────────────────────

function _genL8_NUMERIC(diff) {
  let C, q, img, imgAlt, working;
  if (diff === 1) {
    const r = rand(3, 10);
    C = parseFloat((2 * Math.PI * r).toFixed(0));
    q = `<p>A circle has a radius of ${r} cm.</p><p>Calculate the circumference. Give your answer to the nearest whole number.</p>`;
    img = makeSVGCircle(r, "cm"); imgAlt = `Circle radius ${r} cm`;
    working = `<p><strong>C = ${C} cm</strong></p><p>C = 2\\(\\pi\\)r = 2 \\(\\times\\) \\(\\pi\\) \\(\\times\\) ${r} = ${parseFloat((2*Math.PI*r).toFixed(4))} ≈ ${C} cm</p>`;
  } else if (diff === 2) {
    const r = randF(3.0, 8.5, 1);
    C = parseFloat((2 * Math.PI * r).toFixed(2));
    q = `<p>A circle has a radius of ${r} m.</p><p>Calculate the circumference. Give your answer to 2 decimal places.</p>`;
    img = makeSVGCircle(r, "m"); imgAlt = `Circle radius ${r} m`;
    working = `<p><strong>C = ${C} m</strong></p><p>C = 2\\(\\pi\\)r = 2 \\(\\times\\) \\(\\pi\\) \\(\\times\\) ${r} = ${C} m</p>`;
  } else if (diff === 3) {
    const rNum = rand(3, 7), rDen = 2;
    const r = rNum / rDen;
    C = parseFloat((2 * Math.PI * r).toFixed(2));
    q = `<p>A circle has a radius of \\(\\frac{${rNum}}{${rDen}}\\) cm.</p><p>Calculate the circumference to 2 decimal places.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>C = ${C} cm</strong></p><p>C = 2\\(\\pi\\) \\(\\times\\) \\(\\frac{${rNum}}{${rDen}}\\) = \\(${rNum}\\pi\\) = ${C} cm</p>`;
  } else {
    // Given diameter — exact answer in terms of π
    const d = rand(6, 20) * 2;
    C = parseFloat((Math.PI * d).toFixed(2));
    q = `<p>A circle has a diameter of ${d} cm.</p><p>Calculate the circumference to 2 decimal places.</p>`;
    img = makeSVGCircleD(d, "cm"); imgAlt = `Circle diameter ${d} cm`;
    working = `<p><strong>C = ${C} cm</strong></p><p>C = \\(\\pi d\\) = \\(\\pi \\times ${d}\\) = ${C} cm</p>`;
  }
  return {
    uid: makeUID("NUMERIC", 8, diff), level: 8, diff: diff, type: "NUMERIC",
    q: q, working: working, img: img, imgAlt: imgAlt,
    hint: "C = 2πr (or C = πd if diameter given).", ncea: { standard: "N/A", ao: "N/A" },
    a: String(C), units: ["cm","m"], tolerance: 0.02
  };
}

function _genL8_MCQ(diff) {
  const r = rand(4, 9);
  const correct = parseFloat((2 * Math.PI * r).toFixed(1));
  const d1 = parseFloat((Math.PI * r * r).toFixed(1));    // area formula
  const d2 = parseFloat((2 * Math.PI * r * 2).toFixed(1)); // C = 2πd (doubled radius again)
  const d3 = parseFloat((Math.PI * r).toFixed(1));          // forgot ×2
  const opts = shuffle([String(correct), String(d1), String(d2), String(d3)]);
  return {
    uid: makeUID("MCQ", 8, diff), level: 8, diff: diff, type: "MCQ",
    q: `<p>A circle has radius ${r} cm. What is the circumference to 1 d.p.?</p>`,
    working: `<p><strong>Answer: ${correct} cm</strong></p><p>C = 2\\(\\pi\\)r = 2 \\(\\times\\) \\(\\pi\\) \\(\\times\\) ${r} = ${correct} cm</p>`,
    img: makeSVGCircle(r, "cm"), imgAlt: `Circle radius ${r} cm`,
    hint: "C = 2πr — not πr².",
    ncea: { standard: "N/A", ao: "N/A" },
    options: opts.map(v => v + " cm"),
    correctOption: opts.indexOf(String(correct))
  };
}

function _genL8_MATCH(diff) {
  const pairs = shuffle([
    { left: "Circumference (radius known)",   right: "C = 2\\(\\pi\\)r" },
    { left: "Circumference (diameter known)",  right: "C = \\(\\pi\\)d" },
    { left: "Area of a circle",                right: "A = \\(\\pi\\)r²" },
    { left: "Diameter from radius",            right: "d = 2r" }
  ]);
  return {
    uid: makeUID("MATCH", 8, diff), level: 8, diff: diff, type: "MATCH",
    q: "<p>Match each circle measurement to its formula.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Circumference uses r or d; area uses r².",
    ncea: { standard: "N/A", ao: "N/A" }, pairs: pairs
  };
}

function _genL8_SEP(diff) {
  const d = rand(6, 16);
  const r = d;              // student used d directly in 2πr (forgot to halve)
  const correct = parseFloat((Math.PI * d).toFixed(2));
  const wrong = parseFloat((2 * Math.PI * d).toFixed(2));
  return {
    uid: makeUID("SPOT_ERROR_STEP", 8, diff), level: 8, diff: diff, type: "SPOT_ERROR",
    subtype: "STEP",
    q: `<p>A circle has a diameter of ${d} cm. A student calculated the circumference. Find the error.</p>`,
    working: `<p><strong>Error is in Step 2.</strong></p><p>C = \\(\\pi\\)d = \\(\\pi \\times ${d}\\) = ${correct} cm</p><p>OR: r = d ÷ 2 = ${d/2} cm, C = 2\\(\\pi\\) × ${d/2} = ${correct} cm</p>`,
    img: makeSVGCircleD(d, "cm"), imgAlt: `Circle diameter ${d} cm`,
    hint: "Given the diameter, which formula should be used?",
    ncea: { standard: "N/A", ao: "N/A" },
    steps: [
      { id: 1, text: `Diameter = ${d} cm`, isError: false },
      { id: 2, text: `C = 2\\(\\pi\\) \\(\\times\\) ${d} = ${wrong} cm`, isError: true },
      { id: 3, text: `Circumference = ${wrong} cm`, isError: false }
    ]
  };
}

function _genL8_SEV(diff) {
  const r = rand(4, 9);
  const correct = parseFloat((2 * Math.PI * r).toFixed(1));
  const wrong = parseFloat((Math.PI * r * r).toFixed(1)); // used πr² instead of 2πr
  return {
    uid: makeUID("SPOT_ERROR_VALUE", 8, diff), level: 8, diff: diff, type: "SPOT_ERROR",
    subtype: "VALUE",
    q: `<p>A student calculated the circumference of a circle with radius ${r} cm. Click the wrong value.</p>`,
    working: `<p><strong>Error is token 3.</strong></p><p>C = 2\\(\\pi\\)r = 2 \\(\\times\\) \\(\\pi\\) \\(\\times\\) ${r} = ${correct} cm</p>`,
    img: "", imgAlt: "",
    hint: "Is the formula C = 2πr or A = πr²?",
    ncea: { standard: "N/A", ao: "N/A" },
    expression: `C = \\(\\pi\\) \\(\\times\\) [${r}|1]² = [${r*r}|2] \\(\\pi\\) = [${wrong}|3] cm`,
    correctErrorId: 3,
    errorExplanation: `The student used the area formula πr² instead of the circumference formula 2πr. The correct answer is 2 × π × ${r} = ${correct} cm.`
  };
}

function _genL8_EXP(diff) {
  return {
    uid: makeUID("EXPLANATION", 8, diff), level: 8, diff: 2, type: "EXPLANATION",
    q: "<p>Explain the difference between circumference and area of a circle. A student uses πr² to find how far it is around a circular running track. Explain why this is wrong.</p>",
    working: "", img: "", imgAlt: "",
    hint: "What does circumference measure? What does area measure?",
    ncea: { standard: "N/A", ao: "N/A" },
    modelAnswer: "Circumference is the distance around the outside of the circle (its perimeter), given by C = 2πr or C = πd. Area is the space enclosed inside the circle, given by A = πr². For a running track, you need the distance travelled around the edge, which is the circumference, not the area. Using πr² gives a measurement in square units (m²), which cannot represent a distance.",
    markingChecklist: [
      "States that circumference is the distance around the circle (its perimeter)",
      "States that area is the space enclosed inside the circle",
      "Identifies that a running track requires circumference, not area",
      "Notes that πr² gives square units, which cannot represent a distance"
    ]
  };
}

// ── Level 9 : Area of a Circle ─────────────────────────────────────────

function _genL9_NUMERIC(diff) {
  let A, q, img, imgAlt, working;
  if (diff === 1) {
    const r = rand(3, 9);
    A = parseFloat((Math.PI * r * r).toFixed(0));
    q = `<p>A circle has a radius of ${r} cm.</p><p>Find its area. Give your answer to the nearest whole number.</p>`;
    img = makeSVGCircle(r, "cm"); imgAlt = `Circle radius ${r} cm`;
    working = `<p><strong>A = ${A} cm²</strong></p><p>A = \\(\\pi\\)r² = \\(\\pi \\times ${r}^2\\) = \\(\\pi \\times ${r*r}\\) = ${parseFloat((Math.PI*r*r).toFixed(4))} ≈ ${A} cm²</p>`;
  } else if (diff === 2) {
    const r = randF(3.0, 8.5, 1);
    A = parseFloat((Math.PI * r * r).toFixed(1));
    q = `<p>A circle has a radius of ${r} cm.</p><p>Find its area to 1 decimal place.</p>`;
    img = makeSVGCircle(r, "cm"); imgAlt = `Circle radius ${r} cm`;
    working = `<p><strong>A = ${A} cm²</strong></p><p>A = \\(\\pi\\) \\(\\times\\) ${r}² = \\(\\pi \\times ${parseFloat((r*r).toFixed(2))}\\) = ${A} cm²</p>`;
  } else if (diff === 3) {
    const rNum = rand(3, 7), rDen = 2;
    const r = rNum / rDen;
    A = parseFloat((Math.PI * r * r).toFixed(2));
    const An = rNum * rNum, Ad = rDen * rDen;
    const g = gcd(An, Ad);
    q = `<p>A circle has a radius of \\(\\frac{${rNum}}{${rDen}}\\) m.</p><p>Find its area to 2 decimal places.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>A = ${A} m²</strong></p><p>A = \\(\\pi r^2\\) = \\(\\pi \\times \\left(\\frac{${rNum}}{${rDen}}\\right)^2\\) = \\(\\frac{${An}}{${Ad}}\\pi\\) = \\(\\frac{${An/g}}{${Ad/g}}\\pi\\) ≈ ${A} m²</p>`;
  } else {
    // Diameter given — student must halve
    const d = rand(6, 20);
    const r = d / 2;
    A = parseFloat((Math.PI * r * r).toFixed(2));
    q = `<p>A circle has a diameter of ${d} cm.</p><p>Find its area to 2 decimal places.</p>`;
    img = makeSVGCircleD(d, "cm"); imgAlt = `Circle diameter ${d} cm`;
    working = `<p><strong>A = ${A} cm²</strong></p><p>r = d ÷ 2 = ${d} ÷ 2 = ${r} cm</p><p>A = \\(\\pi\\) \\(\\times\\) ${r}² = \\(\\pi \\times ${r*r}\\) = ${A} cm²</p>`;
  }
  return {
    uid: makeUID("NUMERIC", 9, diff), level: 9, diff: diff, type: "NUMERIC",
    q: q, working: working, img: img, imgAlt: imgAlt,
    hint: "A = πr². If given diameter, halve it first.", ncea: { standard: "N/A", ao: "N/A" },
    a: String(A), units: ["cm²","m²"], tolerance: 0.02
  };
}

function _genL9_MCQ(diff) {
  const d = rand(8, 18);
  const r = d / 2;
  const correct = parseFloat((Math.PI * r * r).toFixed(1));
  const d1 = parseFloat((Math.PI * d * d).toFixed(1)); // used diameter not radius
  const d2 = parseFloat((2 * Math.PI * r).toFixed(1)); // circumference formula
  const d3 = parseFloat((Math.PI * r).toFixed(1));     // forgot to square r
  const opts = shuffle([String(correct), String(d1), String(d2), String(d3)]);
  return {
    uid: makeUID("MCQ", 9, diff), level: 9, diff: diff, type: "MCQ",
    q: `<p>A circle has a diameter of ${d} cm. What is its area to 1 d.p.?</p>`,
    working: `<p><strong>Answer: ${correct} cm²</strong></p><p>r = ${d} ÷ 2 = ${r} cm</p><p>A = \\(\\pi\\) \\(\\times\\) ${r}² = ${correct} cm²</p>`,
    img: makeSVGCircleD(d, "cm"), imgAlt: `Circle diameter ${d} cm`,
    hint: "Remember to halve the diameter to get the radius.",
    ncea: { standard: "N/A", ao: "N/A" },
    options: opts.map(v => v + " cm²"),
    correctOption: opts.indexOf(String(correct))
  };
}

function _genL9_MATCH(diff) {
  const pairs = shuffle([
    { left: "A = \\(\\pi\\)r²",    right: "Area of a circle" },
    { left: "C = 2\\(\\pi\\)r",    right: "Circumference of a circle" },
    { left: "d = 2r",               right: "Diameter from radius" },
    { left: "r = d ÷ 2",           right: "Radius from diameter" }
  ]);
  return {
    uid: makeUID("MATCH", 9, diff), level: 9, diff: diff, type: "MATCH",
    q: "<p>Match each circle formula to what it calculates.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Area uses r²; circumference uses r (not squared).",
    ncea: { standard: "N/A", ao: "N/A" }, pairs: pairs
  };
}

function _genL9_SEP(diff) {
  const d = rand(8, 18);
  const r = d / 2;
  const correct = parseFloat((Math.PI * r * r).toFixed(2));
  const wrong = parseFloat((Math.PI * d * d).toFixed(2)); // used diameter in formula
  return {
    uid: makeUID("SPOT_ERROR_STEP", 9, diff), level: 9, diff: diff, type: "SPOT_ERROR",
    subtype: "STEP",
    q: `<p>A circle has diameter ${d} cm. A student found the area. Find the error.</p>`,
    working: `<p><strong>Error is in Step 2.</strong></p><p>r = ${d} ÷ 2 = ${r} cm, then A = \\(\\pi\\) × ${r}² = ${correct} cm²</p>`,
    img: makeSVGCircleD(d, "cm"), imgAlt: `Circle diameter ${d} cm`,
    hint: "Did the student convert diameter to radius first?",
    ncea: { standard: "N/A", ao: "N/A" },
    steps: [
      { id: 1, text: `A = \\(\\pi\\)r²`, isError: false },
      { id: 2, text: `A = \\(\\pi\\) \\(\\times\\) ${d}² = \\(\\pi \\times ${d*d}\\) = ${wrong} cm²`, isError: true },
      { id: 3, text: `Area = ${wrong} cm²`, isError: false }
    ]
  };
}

function _genL9_SEV(diff) {
  const r = rand(4, 9);
  const correct = parseFloat((Math.PI * r * r).toFixed(1));
  const wrong = parseFloat((Math.PI * r).toFixed(1)); // forgot to square r
  return {
    uid: makeUID("SPOT_ERROR_VALUE", 9, diff), level: 9, diff: diff, type: "SPOT_ERROR",
    subtype: "VALUE",
    q: `<p>A student found the area of a circle (radius ${r} cm). Click the wrong value.</p>`,
    working: `<p><strong>Error is token 2.</strong></p><p>r² = ${r*r}, not ${r}. A = \\(\\pi \\times ${r*r}\\) = ${correct} cm²</p>`,
    img: "", imgAlt: "",
    hint: "Is r being squared?",
    ncea: { standard: "N/A", ao: "N/A" },
    expression: `A = \\(\\pi\\) \\(\\times\\) [${r}|2] = [${wrong}|3] cm²`,
    correctErrorId: 2,
    errorExplanation: `The student used r = ${r} instead of r² = ${r*r}. The correct answer is π × ${r*r} = ${correct} cm².`
  };
}

function _genL9_EXP(diff) {
  return {
    uid: makeUID("EXPLANATION", 9, diff), level: 9, diff: 2, type: "EXPLANATION",
    q: "<p>A student is given only the diameter of a circle and uses A = πd² to find the area. Explain the error and show the correct method.</p>",
    working: "", img: "", imgAlt: "",
    hint: "What is the relationship between radius and diameter?",
    ncea: { standard: "N/A", ao: "N/A" },
    modelAnswer: "The area formula is A = πr², where r is the radius. The student used the diameter d instead of the radius r. Since d = 2r, using d² gives π(2r)² = 4πr², which is four times too large. The correct approach is to first halve the diameter to find the radius, then substitute into A = πr².",
    markingChecklist: [
      "States that the formula requires the radius, not the diameter",
      "Shows that d = 2r, so using d gives a result 4 times too large",
      "States the correct method: r = d ÷ 2, then A = πr²"
    ]
  };
}

// ── Level 10 : Finding a Missing Side from Given Perimeter ─────────────

function _genL10_NUMERIC(diff) {
  let q, working, answer, hint;
  if (diff === 1) {
    const l = rand(5, 14), w = rand(3, l - 1);
    const P = 2*l + 2*w;
    answer = String(w);
    q = `<p>A rectangle has a perimeter of ${P} cm and a length of ${l} cm.</p><p>Find the width.</p>`;
    working = `<p><strong>Width = ${w} cm</strong></p><p>P = 2l + 2w → ${P} = 2 × ${l} + 2w → ${P} = ${2*l} + 2w → 2w = ${P - 2*l} → w = ${w} cm</p>`;
    hint = "Substitute into P = 2l + 2w and solve for the unknown.";
  } else if (diff === 2) {
    const s1 = randF(4.5, 9.5, 1), s2 = randF(3.5, 8.5, 1);
    const P = parseFloat((s1 + s2 + 4.0 + 5.0).toFixed(1));
    const missing = parseFloat((P - s1 - s2 - 4.0 - 5.0 + 4.0 + 5.0).toFixed(1));
    // simpler: triangle with two known sides
    const tP = parseFloat((s1 + s2 + 5.0).toFixed(1));
    const miss = parseFloat((tP - s1 - s2).toFixed(1));
    answer = String(miss);
    q = `<p>A triangle has a perimeter of ${tP} cm. Two sides are ${s1} cm and ${s2} cm.</p><p>Find the third side.</p>`;
    working = `<p><strong>Third side = ${miss} cm</strong></p><p>Missing side = ${tP} − ${s1} − ${s2} = ${miss} cm</p>`;
    hint = "Subtract the known sides from the perimeter.";
  } else if (diff === 3) {
    const equalSide = rand(8, 15), P = rand(3, 8) + 2 * equalSide;
    const base = P - 2 * equalSide;
    answer = String(base);
    q = `<p>An isosceles triangle has a perimeter of ${P} cm. Each equal side is ${equalSide} cm.</p><p>Find the base.</p>`;
    working = `<p><strong>Base = ${base} cm</strong></p><p>P = 2 × equal side + base → ${P} = 2 × ${equalSide} + base → base = ${P} − ${2*equalSide} = ${base} cm</p>`;
    hint = "An isosceles triangle has two equal sides.";
  } else {
    // Rectangle with sides as expressions: one side = w, other = w + k
    const k = rand(4, 12), P = rand(30, 60);
    // P = 2(w + w + k) = 4w + 2k → w = (P - 2k)/4
    const wVal = (P - 2*k) / 4;
    answer = String(parseFloat(wVal.toFixed(2)));
    q = `<p>A rectangle has sides w cm and (w + ${k}) cm. Its perimeter is ${P} cm.</p><p>Find the value of w.</p>`;
    working = `<p><strong>w = ${answer} cm</strong></p><p>P = 2w + 2(w + ${k}) = 4w + ${2*k}</p><p>${P} = 4w + ${2*k} → 4w = ${P - 2*k} → w = ${answer} cm</p>`;
    hint = "Set up the equation P = 2l + 2w using the expressions.";
  }
  return {
    uid: makeUID("NUMERIC", 10, diff), level: 10, diff: diff, type: "NUMERIC",
    q: q, working: working, img: "", imgAlt: "", hint: hint,
    ncea: { standard: "N/A", ao: "N/A" }, a: answer, units: ["cm","m"], tolerance: 0.02
  };
}

function _genL10_MCQ(diff) {
  const l = rand(6, 14), P = rand(l*2+6, 60);
  const w = parseFloat(((P - 2*l) / 2).toFixed(1));
  const d1 = parseFloat((P - 2*l).toFixed(1));          // forgot to divide by 2
  const d2 = parseFloat(((P - l) / 2).toFixed(1));      // subtracted only one l
  const d3 = parseFloat((P / 2 - l).toFixed(1));        // equivalent form; sometimes gets confused with d1
  const opts = shuffle([String(w), String(d1), String(d2), String(d3)]);
  return {
    uid: makeUID("MCQ", 10, diff), level: 10, diff: diff, type: "MCQ",
    q: `<p>A rectangle has length ${l} cm and perimeter ${P} cm.</p><p>What is the width?</p>`,
    working: `<p><strong>Answer: ${w} cm</strong></p><p>P = 2l + 2w → ${P} = ${2*l} + 2w → 2w = ${P - 2*l} → w = ${w} cm</p>`,
    img: "", imgAlt: "", hint: "Use P = 2l + 2w and solve for w.",
    ncea: { standard: "N/A", ao: "N/A" },
    options: opts.map(v => v + " cm"),
    correctOption: opts.indexOf(String(w))
  };
}

function _genL10_MATCH(diff) {
  const pairs = shuffle([
    { left: "Rectangle: find width",      right: "w = (P − 2l) ÷ 2" },
    { left: "Equilateral triangle: find side", right: "s = P ÷ 3" },
    { left: "Square: find side",           right: "s = P ÷ 4" },
    { left: "Isosceles triangle: find base", right: "base = P − 2 × equal side" }
  ]);
  return {
    uid: makeUID("MATCH", 10, diff), level: 10, diff: diff, type: "MATCH",
    q: "<p>Match each shape to the correct rearranged formula for finding a missing side.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Each formula is a rearrangement of P = sum of sides.",
    ncea: { standard: "N/A", ao: "N/A" }, pairs: pairs
  };
}

function _genL10_SEP(diff) {
  const l = rand(6, 12), w = rand(3, l-1);
  const P = 2*l + 2*w;
  const wrongStep = P - 2*l; // forgot to ÷2
  return {
    uid: makeUID("SPOT_ERROR_STEP", 10, diff), level: 10, diff: diff, type: "SPOT_ERROR",
    subtype: "STEP",
    q: `<p>A rectangle has perimeter ${P} cm and length ${l} cm. A student found the width. Find the error.</p>`,
    working: `<p><strong>Error is in Step 3.</strong></p><p>${P} − ${2*l} = ${P-2*l}, then ÷ 2 → w = ${w} cm</p>`,
    img: "", imgAlt: "",
    hint: "After subtracting the two lengths, how many widths are left?",
    ncea: { standard: "N/A", ao: "N/A" },
    steps: [
      { id: 1, text: `P = 2l + 2w`, isError: false },
      { id: 2, text: `${P} = 2 \\(\\times\\) ${l} + 2w = ${2*l} + 2w`, isError: false },
      { id: 3, text: `2w = ${P} − ${2*l} = ${P-2*l}`, isError: false },
      { id: 4, text: `w = ${P-2*l} cm`, isError: true }
    ]
  };
}

function _genL10_SEV(diff) {
  const l = rand(6, 12), w = rand(3, l-1);
  const P = 2*l + 2*w;
  const wrong = P - 2*l; // forgot ÷2
  return {
    uid: makeUID("SPOT_ERROR_VALUE", 10, diff), level: 10, diff: diff, type: "SPOT_ERROR",
    subtype: "VALUE",
    q: `<p>A student found the width of a rectangle (P=${P} cm, l=${l} cm). Click the wrong value.</p>`,
    working: `<p><strong>Error is token 3.</strong></p><p>2w = ${P-2*l}, so w = ${w} cm (not ${wrong}).</p>`,
    img: "", imgAlt: "",
    hint: "2w = P − 2l, so you must divide by 2.",
    ncea: { standard: "N/A", ao: "N/A" },
    expression: `w = ([${P}|1] − [${2*l}|2]) ÷ 2 = [${wrong}|3] cm`,
    correctErrorId: 3,
    errorExplanation: `The student forgot to divide by 2. (${P} − ${2*l}) ÷ 2 = ${w} cm.`
  };
}

function _genL10_EXP(diff) {
  return {
    uid: makeUID("EXPLANATION", 10, diff), level: 10, diff: 2, type: "EXPLANATION",
    q: "<p>A rectangle has a perimeter of 36 cm and a length of 10 cm. Explain step by step how to find the width, showing why you divide by 2 at the final step.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Start by writing out the perimeter formula.",
    ncea: { standard: "N/A", ao: "N/A" },
    modelAnswer: "Start with P = 2l + 2w. Substitute the known values: 36 = 2 × 10 + 2w = 20 + 2w. Subtract 20 from both sides: 2w = 16. Divide both sides by 2 to get w alone: w = 8 cm. The reason for dividing by 2 is that the equation 2w = 16 means two widths equal 16, so one width is half of that.",
    markingChecklist: [
      "Correctly substitutes into P = 2l + 2w",
      "Subtracts 2l from both sides to isolate 2w",
      "Divides both sides by 2 and obtains the correct answer w = 8 cm",
      "Explains why dividing by 2 is necessary"
    ]
  };
}

// ── Level 11 : Finding Radius from Circumference ───────────────────────

function _genL11_NUMERIC(diff) {
  let answer, q, working;
  if (diff === 1) {
    const r = rand(3, 12);
    const C = 2 * Math.PI * r;
    const Cpi = 2 * r; // C = (2r)π
    answer = String(r);
    q = `<p>A circle has a circumference of ${2*r}\\(\\pi\\) cm.</p><p>Find the radius.</p>`;
    working = `<p><strong>r = ${r} cm</strong></p><p>C = 2\\(\\pi\\)r → ${2*r}\\(\\pi\\) = 2\\(\\pi\\)r → r = ${2*r} ÷ 2 = ${r} cm</p>`;
  } else if (diff === 2) {
    const r = randF(3.0, 12.0, 1);
    const C = parseFloat((2 * Math.PI * r).toFixed(2));
    answer = String(parseFloat(r.toFixed(1)));
    q = `<p>A circle has a circumference of ${C} cm.</p><p>Find the radius to 1 decimal place.</p>`;
    working = `<p><strong>r = ${answer} cm</strong></p><p>r = C ÷ (2\\(\\pi\\)) = ${C} ÷ (2 \\(\\times\\) \\(\\pi\\)) = ${answer} cm</p>`;
  } else if (diff === 3) {
    const rNum = rand(5, 9), rDen = 4;
    const Cn = rNum, Cd = 2; // C = (rNum/rDen)×2π = rNum/(rDen/2)×π
    answer = String(rNum / rDen);
    const C = `\\(\\frac{${rNum}}{${rDen/2}}\\pi\\)`;
    q = `<p>A circle has a circumference of \\(\\frac{${rNum}}{${rDen/2}}\\pi\\) m.</p><p>Find the radius.</p>`;
    working = `<p><strong>r = \\(\\frac{${rNum}}{${rDen}}\\) m</strong></p><p>C = 2\\(\\pi\\)r → r = C ÷ (2\\(\\pi\\)) = \\(\\frac{${rNum}\\pi}{${rDen/2}}\\) ÷ 2\\(\\pi\\) = \\(\\frac{${rNum}}{${rDen}}\\) m</p>`;
  } else {
    // Given C, find r then area (two-step)
    const r = rand(5, 12);
    const C = parseFloat((2 * Math.PI * r).toFixed(2));
    const A = parseFloat((Math.PI * r * r).toFixed(2));
    answer = String(A);
    q = `<p>A circle has a circumference of ${C} m.</p><p>Find the area of the circle to 2 decimal places.</p>`;
    working = `<p><strong>A = ${A} m²</strong></p><p>Step 1: r = C ÷ (2\\(\\pi\\)) = ${C} ÷ (2\\(\\pi\\)) = ${r} m</p><p>Step 2: A = \\(\\pi r^2\\) = \\(\\pi \\times ${r}^2\\) = ${A} m²</p>`;
  }
  return {
    uid: makeUID("NUMERIC", 11, diff), level: 11, diff: diff, type: "NUMERIC",
    q: q, working: working, img: "", imgAlt: "",
    hint: "Rearrange C = 2πr to get r = C ÷ (2π).", ncea: { standard: "N/A", ao: "N/A" },
    a: answer, units: ["cm","m","cm²","m²"], tolerance: 0.02
  };
}

function _genL11_MCQ(diff) {
  const r = rand(4, 10);
  const C = parseFloat((2 * Math.PI * r).toFixed(2));
  const correct = r;
  const d1 = parseFloat((C / Math.PI).toFixed(2));            // divided by π only (got diameter)
  const d2 = parseFloat((C * Math.PI / 2).toFixed(2));        // multiplied instead of divided
  const d3 = parseFloat((C / (2 * Math.PI * 2)).toFixed(2));  // divided by 4π
  const opts = shuffle([String(correct), String(d1), String(d2), String(d3)]);
  return {
    uid: makeUID("MCQ", 11, diff), level: 11, diff: diff, type: "MCQ",
    q: `<p>A circle has a circumference of ${C} cm. What is the radius?</p>`,
    working: `<p><strong>Answer: ${correct} cm</strong></p><p>r = C ÷ (2\\(\\pi\\)) = ${C} ÷ ${parseFloat((2*Math.PI).toFixed(4))} = ${correct} cm</p>`,
    img: "", imgAlt: "", hint: "r = C ÷ (2π). Make sure you divide by BOTH 2 and π.",
    ncea: { standard: "N/A", ao: "N/A" },
    options: opts.map(v => v + " cm"),
    correctOption: opts.indexOf(String(correct))
  };
}

function _genL11_MATCH(diff) {
  const pairs = shuffle([
    { left: "Given C, find r",   right: "r = C ÷ (2\\(\\pi\\))" },
    { left: "Given C, find d",   right: "d = C ÷ \\(\\pi\\)" },
    { left: "Given r, find C",   right: "C = 2\\(\\pi\\)r" },
    { left: "Given d, find C",   right: "C = \\(\\pi\\)d" }
  ]);
  return {
    uid: makeUID("MATCH", 11, diff), level: 11, diff: diff, type: "MATCH",
    q: "<p>Match each circle problem type to its correct rearranged formula.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Each is a rearrangement of C = 2πr or C = πd.",
    ncea: { standard: "N/A", ao: "N/A" }, pairs: pairs
  };
}

function _genL11_SEP(diff) {
  const r = rand(4, 10);
  const C = parseFloat((2 * Math.PI * r).toFixed(2));
  const wrong = parseFloat((C / Math.PI).toFixed(2)); // got diameter
  return {
    uid: makeUID("SPOT_ERROR_STEP", 11, diff), level: 11, diff: diff, type: "SPOT_ERROR",
    subtype: "STEP",
    q: `<p>A circle has circumference ${C} cm. A student found the radius. Find the error.</p>`,
    working: `<p><strong>Error is in Step 2.</strong></p><p>r = C ÷ (2\\(\\pi\\)) = ${C} ÷ ${parseFloat((2*Math.PI).toFixed(4))} = ${r} cm</p>`,
    img: "", imgAlt: "",
    hint: "r = C ÷ (2π), not C ÷ π.",
    ncea: { standard: "N/A", ao: "N/A" },
    steps: [
      { id: 1, text: `C = 2\\(\\pi\\)r, so r = C ÷ (2\\(\\pi\\))`, isError: false },
      { id: 2, text: `r = ${C} ÷ \\(\\pi\\) = ${wrong} cm`, isError: true },
      { id: 3, text: `Radius = ${wrong} cm`, isError: false }
    ]
  };
}

function _genL11_SEV(diff) {
  const r = rand(4, 10);
  const C = parseFloat((2 * Math.PI * r).toFixed(2));
  const wrongDiv = parseFloat((C / Math.PI).toFixed(2)); // divided by π only
  return {
    uid: makeUID("SPOT_ERROR_VALUE", 11, diff), level: 11, diff: diff, type: "SPOT_ERROR",
    subtype: "VALUE",
    q: `<p>A student rearranged C = 2πr to find the radius of a circle with C = ${C} cm. Click the wrong value.</p>`,
    working: `<p><strong>Error is token 2.</strong></p><p>Denominator must be 2π = ${parseFloat((2*Math.PI).toFixed(4))}, not just π. r = ${C} ÷ ${parseFloat((2*Math.PI).toFixed(4))} = ${r} cm</p>`,
    img: "", imgAlt: "",
    hint: "The formula is r = C ÷ (2π).",
    ncea: { standard: "N/A", ao: "N/A" },
    expression: `r = [${C}|1] ÷ [\\(\\pi\\)|2] = [${wrongDiv}|3] cm`,
    correctErrorId: 2,
    errorExplanation: `The student divided by π only, which gives the diameter. They should divide by 2π to get the radius r = ${r} cm.`
  };
}

function _genL11_EXP(diff) {
  return {
    uid: makeUID("EXPLANATION", 11, diff), level: 11, diff: 2, type: "EXPLANATION",
    q: "<p>Explain why dividing the circumference by π alone does not give you the radius. What does it give you instead, and what extra step is needed?</p>",
    working: "", img: "", imgAlt: "",
    hint: "What is C ÷ π equal to?",
    ncea: { standard: "N/A", ao: "N/A" },
    modelAnswer: "Dividing the circumference by π gives C ÷ π = πd ÷ π = d, which is the diameter, not the radius. To find the radius you must divide by 2π (or equivalently, first find the diameter by C ÷ π, then halve it to get the radius).",
    markingChecklist: [
      "States that C ÷ π gives the diameter, not the radius",
      "Explains that the radius is half the diameter",
      "States the correct method: r = C ÷ (2π)"
    ]
  };
}

// ── Level 12 : Finding Radius from Area ───────────────────────────────

function _genL12_NUMERIC(diff) {
  let answer, q, working;
  if (diff === 1) {
    const r = rand(3, 10);
    const A = Math.PI * r * r;
    const Api = r * r; // A = (r²)π
    answer = String(r);
    q = `<p>A circle has an area of ${r*r}\\(\\pi\\) cm².</p><p>Find the radius.</p>`;
    working = `<p><strong>r = ${r} cm</strong></p><p>A = \\(\\pi\\)r² → ${r*r}\\(\\pi\\) = \\(\\pi\\)r² → r² = ${r*r} → r = \\(\\sqrt{${r*r}}\\) = ${r} cm</p>`;
  } else if (diff === 2) {
    const r = randF(3.0, 10.0, 1);
    const A = parseFloat((Math.PI * r * r).toFixed(1));
    answer = String(parseFloat(r.toFixed(1)));
    q = `<p>A circle has an area of ${A} cm².</p><p>Find the radius to 1 decimal place.</p>`;
    working = `<p><strong>r = ${answer} cm</strong></p><p>r² = A ÷ \\(\\pi\\) = ${A} ÷ \\(\\pi\\) = ${parseFloat((A/Math.PI).toFixed(4))}</p><p>r = \\(\\sqrt{${parseFloat((A/Math.PI).toFixed(4))}}\\) = ${answer} cm</p>`;
  } else if (diff === 3) {
    const rNum = 3, rDen = 2;
    const An = rNum*rNum, Ad = rDen*rDen, g = gcd(An, Ad);
    answer = String(rNum/rDen);
    q = `<p>A circle has an area of \\(\\frac{${An/g}}{${Ad/g}}\\pi\\) m².</p><p>Find the radius.</p>`;
    working = `<p><strong>r = \\(\\frac{${rNum}}{${rDen}}\\) m</strong></p><p>r² = A ÷ \\(\\pi\\) = \\(\\frac{${An/g}}{${Ad/g}}\\)</p><p>r = \\(\\sqrt{\\frac{${An/g}}{${Ad/g}}}\\) = \\(\\frac{${rNum}}{${rDen}}\\) m</p>`;
  } else {
    // Find r then circumference (two-step)
    const r = rand(4, 10);
    const A = parseFloat((Math.PI * r * r).toFixed(1));
    const C = parseFloat((2 * Math.PI * r).toFixed(2));
    answer = String(C);
    q = `<p>A circle has an area of ${A} m².</p><p>Find the circumference to 2 decimal places.</p>`;
    working = `<p><strong>C = ${C} m</strong></p><p>Step 1: r² = ${A} ÷ \\(\\pi\\) = ${parseFloat((A/Math.PI).toFixed(4))} → r = ${r} m</p><p>Step 2: C = 2\\(\\pi\\)r = 2\\(\\pi \\times ${r}\\) = ${C} m</p>`;
  }
  return {
    uid: makeUID("NUMERIC", 12, diff), level: 12, diff: diff, type: "NUMERIC",
    q: q, working: working, img: "", imgAlt: "",
    hint: "Rearrange A = πr²: divide by π then take the square root.", ncea: { standard: "N/A", ao: "N/A" },
    a: answer, units: ["cm","m","cm²","m²"], tolerance: 0.02
  };
}

function _genL12_MCQ(diff) {
  const r = rand(4, 9);
  const A = parseFloat((Math.PI * r * r).toFixed(1));
  const correct = r;
  const d1 = parseFloat((A / Math.PI).toFixed(1));              // forgot square root
  const d2 = parseFloat(Math.sqrt(A).toFixed(1));               // divided by 1 not π
  const d3 = parseFloat((A / (Math.PI * 2)).toFixed(1));        // divided by 2π
  const opts = shuffle([String(correct), String(d1), String(d2), String(d3)]);
  return {
    uid: makeUID("MCQ", 12, diff), level: 12, diff: diff, type: "MCQ",
    q: `<p>A circle has an area of ${A} cm². What is the radius?</p>`,
    working: `<p><strong>Answer: ${correct} cm</strong></p><p>r² = ${A} ÷ \\(\\pi\\) = ${r*r} → r = \\(\\sqrt{${r*r}}\\) = ${correct} cm</p>`,
    img: "", imgAlt: "", hint: "Divide by π first, then take the square root.",
    ncea: { standard: "N/A", ao: "N/A" },
    options: opts.map(v => v + " cm"),
    correctOption: opts.indexOf(String(correct))
  };
}

function _genL12_MATCH(diff) {
  const pairs = shuffle([
    { left: "Given A, find r",    right: "r = \\(\\sqrt{A \\div \\pi}\\)" },
    { left: "Given A, find d",    right: "d = 2\\(\\sqrt{A ÷ \\pi}\\)" },
    { left: "Given r, find A",    right: "A = \\(\\pi\\)r²" },
    { left: "Given C, find r",    right: "r = C ÷ (2\\(\\pi\\))" }
  ]);
  return {
    uid: makeUID("MATCH", 12, diff), level: 12, diff: diff, type: "MATCH",
    q: "<p>Match each circle problem to its correct formula.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Finding r from A requires a square root; finding r from C does not.",
    ncea: { standard: "N/A", ao: "N/A" }, pairs: pairs
  };
}

function _genL12_SEP(diff) {
  const r = rand(4, 10);
  const A = parseFloat((Math.PI * r * r).toFixed(1));
  const rSq = parseFloat((A / Math.PI).toFixed(2));
  const wrong = rSq; // student stopped at r² and forgot √
  return {
    uid: makeUID("SPOT_ERROR_STEP", 12, diff), level: 12, diff: diff, type: "SPOT_ERROR",
    subtype: "STEP",
    q: `<p>A circle has area ${A} cm². A student found the radius. Find the error.</p>`,
    working: `<p><strong>Error is in Step 3.</strong></p><p>r² = ${rSq}, so r = \\(\\sqrt{${rSq}}\\) = ${r} cm</p>`,
    img: "", imgAlt: "",
    hint: "After dividing by π, what operation remains?",
    ncea: { standard: "N/A", ao: "N/A" },
    steps: [
      { id: 1, text: `A = \\(\\pi\\)r² → r² = A ÷ \\(\\pi\\)`, isError: false },
      { id: 2, text: `r² = ${A} ÷ \\(\\pi\\) = ${rSq}`, isError: false },
      { id: 3, text: `r = ${wrong} cm`, isError: true }
    ]
  };
}

function _genL12_SEV(diff) {
  const r = rand(4, 9);
  const A = parseFloat((Math.PI * r * r).toFixed(1));
  const rSq = parseFloat((A / Math.PI).toFixed(2));
  return {
    uid: makeUID("SPOT_ERROR_VALUE", 12, diff), level: 12, diff: diff, type: "SPOT_ERROR",
    subtype: "VALUE",
    q: `<p>A student found the radius of a circle with A = ${A} cm². Click the wrong value.</p>`,
    working: `<p><strong>Error is token 3.</strong></p><p>r = \\(\\sqrt{${rSq}}\\) = ${r} cm, not ${rSq} cm.</p>`,
    img: "", imgAlt: "",
    hint: "Does r² equal r?",
    ncea: { standard: "N/A", ao: "N/A" },
    expression: `r² = [${A}|1] ÷ \\(\\pi\\) = [${rSq}|2], so r = [${rSq}|3] cm`,
    correctErrorId: 3,
    errorExplanation: `The student forgot the square root. r = \\(\\sqrt{${rSq}}\\) = ${r} cm, not ${rSq} cm.`
  };
}

function _genL12_EXP(diff) {
  return {
    uid: makeUID("EXPLANATION", 12, diff), level: 12, diff: 2, type: "EXPLANATION",
    q: "<p>Explain why you need to take a square root when finding the radius from the area of a circle. What happens if you forget this step?</p>",
    working: "", img: "", imgAlt: "",
    hint: "What does A = πr² tell you about r?",
    ncea: { standard: "N/A", ao: "N/A" },
    modelAnswer: "The area formula is A = πr², where r is squared. To find r, you first divide both sides by π to get r² = A ÷ π. But this gives you r squared, not r itself. To find r you must take the square root. If you skip the square root, you are reporting r² as if it were r, which gives a value that is far too large for any realistic circle.",
    markingChecklist: [
      "States that the formula A = πr² means r is squared",
      "Shows the step r² = A ÷ π",
      "States that a square root must be taken to find r from r²"
    ]
  };
}

// ── Level 13 : Perimeter of Composite Shapes (Polygons Only) ──────────

function _genL13_NUMERIC(diff) {
  let answer, q, img, imgAlt, working;
  if (diff === 1) {
    // L-shape: outer W×H, notch nW×nH
    const W = rand(8, 16), H = rand(8, 14);
    const nW = rand(2, Math.floor(W/2)), nH = rand(2, Math.floor(H/2));
    const P = 2*W + 2*H; // key insight: L-shape perimeter = outer rectangle perimeter
    answer = String(P);
    q = `<p>An L-shaped figure has outer dimensions ${W} cm wide and ${H} cm tall. A ${nW} cm × ${nH} cm rectangle is removed from one corner.</p><p>Find the perimeter of the L-shape.</p>`;
    img = makeSVGLShape(W, H, nW, nH, "cm"); imgAlt = `L-shape ${W}x${H} notch ${nW}x${nH}`;
    working = `<p><strong>P = ${P} cm</strong></p><p>The L-shape perimeter equals the full outer rectangle perimeter (the notch adds two new sides but removes two equal sides).</p><p>P = 2 × ${W} + 2 × ${H} = ${2*W} + ${2*H} = ${P} cm</p>`;
  } else if (diff === 2) {
    const W = randF(8.0, 14.0, 1), H = randF(7.0, 12.0, 1);
    const nW = randF(2.0, W/2.5, 1), nH = randF(2.0, H/2.5, 1);
    const P = parseFloat((2*W + 2*H).toFixed(1));
    answer = String(P);
    q = `<p>An L-shaped garden has outer dimensions ${W} m × ${H} m with a ${nW} m × ${nH} m notch removed from one corner.</p><p>Find the perimeter.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>P = ${P} m</strong></p><p>P = 2 × ${W} + 2 × ${H} = ${parseFloat((2*W).toFixed(1))} + ${parseFloat((2*H).toFixed(1))} = ${P} m</p>`;
  } else if (diff === 3) {
    // Rectangle + triangle on top: perimeter is 2 sides of rect + hypotenuse + hypotenuse + (base not included — covered by rect top)
    const rW = rand(6, 12), rH = rand(4, 8), tH = rand(3, 6);
    const hyp = parseFloat(Math.sqrt((rW/2)*(rW/2) + tH*tH).toFixed(2));
    const P = parseFloat((rW + rH + rH + 2*hyp).toFixed(2));
    answer = String(P);
    q = `<p>A shape is formed by placing an isosceles triangle (base = ${rW} cm, height = ${tH} cm) on top of a rectangle (${rW} cm × ${rH} cm).</p><p>Find the perimeter of the combined shape.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>P = ${P} cm</strong></p><p>Slant side of triangle = \\(\\sqrt{(${rW}/2)^2 + ${tH}^2}\\) = \\(\\sqrt{${(rW/2)*(rW/2)} + ${tH*tH}}\\) = ${hyp} cm</p><p>Perimeter = bottom + 2 × rect sides + 2 × slant sides = ${rW} + ${2*rH} + 2 × ${hyp} = ${P} cm</p>`;
  } else {
    // Complex rectilinear: 3 unlabelled sides
    const W = rand(12, 20), H = rand(10, 16);
    const s1 = rand(3, Math.floor(W/3)), s2 = rand(3, Math.floor(H/3));
    const s3 = rand(3, Math.floor(W/3));
    // Perimeter of L-shape variant = same as full rectangle perimeter
    const P = 2*W + 2*H;
    answer = String(P);
    q = `<p>A rectilinear shape has overall width ${W} cm and height ${H} cm. Three sides are unlabelled. The shape has only right angles.</p><p>Show that the perimeter is ${P} cm.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>P = ${P} cm</strong></p><p>For any rectilinear shape, the unlabelled horizontal sides sum to the total width, and the unlabelled vertical sides sum to the total height.</p><p>P = 2 × ${W} + 2 × ${H} = ${P} cm</p>`;
  }
  return {
    uid: makeUID("NUMERIC", 13, diff), level: 13, diff: diff, type: "NUMERIC",
    q: q, working: working, img: img, imgAlt: imgAlt,
    hint: "Trace around the outside edge carefully, adding every boundary side.", ncea: { standard: "N/A", ao: "N/A" },
    a: answer, units: ["cm","m"], tolerance: 0.02
  };
}

function _genL13_MCQ(diff) {
  const W = rand(8, 14), H = rand(7, 12);
  const nW = rand(2, Math.floor(W/3)), nH = rand(2, Math.floor(H/3));
  const correct = 2*W + 2*H;
  const d1 = 2*W + 2*H - 2*nW;   // forgot to include notch sides
  const d2 = W + H;               // added overall dims only
  const d3 = 2*W + 2*H + 2*nW;   // double-counted notch
  const opts = shuffle([String(correct), String(d1), String(d2), String(d3)]);
  return {
    uid: makeUID("MCQ", 13, diff), level: 13, diff: diff, type: "MCQ",
    q: `<p>An L-shape has outer dimensions ${W} cm × ${H} cm with a ${nW} × ${nH} cm notch removed.</p><p>What is the perimeter?</p>`,
    working: `<p><strong>Answer: ${correct} cm</strong></p><p>P = 2 × ${W} + 2 × ${H} = ${correct} cm (notch adds two new sides but removes two equal sides)</p>`,
    img: makeSVGLShape(W, H, nW, nH, "cm"), imgAlt: `L-shape`,
    hint: "The notch adds two sides but removes two equal sides — they cancel.",
    ncea: { standard: "N/A", ao: "N/A" },
    options: opts.map(v => v + " cm"),
    correctOption: opts.indexOf(String(correct))
  };
}

function _genL13_MATCH(diff) {
  const pairs = shuffle([
    { left: "Outer width of a rectilinear shape",    right: "Sum of all horizontal segments on that side" },
    { left: "Perimeter of an L-shape",               right: "Same as perimeter of its outer bounding rectangle" },
    { left: "Missing vertical side in a step shape", right: "Outer height minus shorter vertical piece" },
    { left: "Missing horizontal side in a step shape", right: "Outer width minus shorter horizontal piece" }
  ]);
  return {
    uid: makeUID("MATCH", 13, diff), level: 13, diff: diff, type: "MATCH",
    q: "<p>Match each composite-shape concept to its correct description.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Think about how unlabelled sides relate to the outer dimensions.",
    ncea: { standard: "N/A", ao: "N/A" }, pairs: pairs
  };
}

function _genL13_SEP(diff) {
  const W = rand(10, 16), H = rand(8, 13), nW = rand(3, Math.floor(W/3)), nH = rand(3, Math.floor(H/3));
  const correct = 2*W + 2*H;
  const wrong = W + H; // student added outer dims only
  return {
    uid: makeUID("SPOT_ERROR_STEP", 13, diff), level: 13, diff: diff, type: "SPOT_ERROR",
    subtype: "STEP",
    q: `<p>An L-shape has outer dimensions ${W} cm × ${H} cm (notch ${nW} cm × ${nH} cm). A student found the perimeter. Find the error.</p>`,
    working: `<p><strong>Error is in Step 2.</strong></p><p>P = 2 × ${W} + 2 × ${H} = ${correct} cm</p>`,
    img: makeSVGLShape(W, H, nW, nH, "cm"), imgAlt: `L-shape`,
    hint: "Does the shape have only two sides, or more?",
    ncea: { standard: "N/A", ao: "N/A" },
    steps: [
      { id: 1, text: `Identify outer dimensions: ${W} cm and ${H} cm`, isError: false },
      { id: 2, text: `P = ${W} + ${H} = ${wrong} cm`, isError: true },
      { id: 3, text: `Perimeter = ${wrong} cm`, isError: false }
    ]
  };
}

function _genL13_SEV(diff) {
  const W = rand(8, 14), H = rand(6, 12), nW = rand(2, Math.floor(W/3)), nH = rand(2, Math.floor(H/3));
  const correct = 2*W + 2*H;
  const wrong = W + H + nW + nH; // included notch dimensions incorrectly
  return {
    uid: makeUID("SPOT_ERROR_VALUE", 13, diff), level: 13, diff: diff, type: "SPOT_ERROR",
    subtype: "VALUE",
    q: `<p>A student found the perimeter of an L-shape (${W} × ${H} cm, notch ${nW} × ${nH} cm). Click the wrong value.</p>`,
    working: `<p><strong>Error is token 4.</strong></p><p>P = 2 × ${W} + 2 × ${H} = ${correct} cm</p>`,
    img: "", imgAlt: "",
    hint: "The notch sides cancel — they don't add extra length.",
    ncea: { standard: "N/A", ao: "N/A" },
    expression: `P = 2 \\(\\times\\) [${W}|1] + 2 \\(\\times\\) [${H}|2] + [${nW}|3] + [${nH}|4] = [${wrong}|5] cm`,
    correctErrorId: 3,
    errorExplanation: `The notch sides should not be added separately — they cancel. P = 2 × ${W} + 2 × ${H} = ${correct} cm.`
  };
}

function _genL13_EXP(diff) {
  return {
    uid: makeUID("EXPLANATION", 13, diff), level: 13, diff: 2, type: "EXPLANATION",
    q: "<p>Explain why the perimeter of an L-shaped figure (formed by removing a rectangular notch from one corner of a rectangle) is equal to the perimeter of the original uncut rectangle.</p>",
    working: "", img: "", imgAlt: "",
    hint: "What happens to the boundary when the notch is cut?",
    ncea: { standard: "N/A", ao: "N/A" },
    modelAnswer: "When a rectangular notch is cut from a corner, two sides of the original rectangle are removed from the boundary and two new sides of equal length are added in their place. Because the notch is rectangular, the two new sides are the same lengths as the two sides that were removed. So the total boundary length stays the same as the original rectangle's perimeter.",
    markingChecklist: [
      "States that cutting a notch removes two boundary sides",
      "States that two new sides of equal length are added",
      "Concludes that the perimeter is unchanged (equal to the bounding rectangle)"
    ]
  };
}

// ── Level 14 : Area of Composite Shapes (Polygons Only) ──────────────

function _genL14_NUMERIC(diff) {
  let answer, q, img, imgAlt, working;
  if (diff === 1) {
    // L-shape split into two rectangles
    const W = rand(8, 14), H = rand(8, 14);
    const nW = rand(3, Math.floor(W/2)), nH = rand(3, Math.floor(H/2));
    const A = W * H - nW * nH;
    answer = String(A);
    q = `<p>An L-shaped patio has outer dimensions ${W} m × ${H} m with a ${nW} m × ${nH} m corner removed.</p><p>Find the area.</p>`;
    img = makeSVGLShape(W, H, nW, nH, "m"); imgAlt = `L-shape ${W}x${H} notch ${nW}x${nH}`;
    working = `<p><strong>A = ${A} m²</strong></p><p>A = outer rectangle − notch = ${W} × ${H} − ${nW} × ${nH} = ${W*H} − ${nW*nH} = ${A} m²</p>`;
  } else if (diff === 2) {
    // Rectangle minus inner rectangle (frame)
    const outerL = randF(7.0, 12.0, 1), outerW = randF(5.0, 9.0, 1);
    const innerL = parseFloat((outerL - 2.0).toFixed(1)), innerW = parseFloat((outerW - 2.0).toFixed(1));
    const A = parseFloat((outerL * outerW - innerL * innerW).toFixed(2));
    answer = String(A);
    q = `<p>A rectangular picture frame has outer dimensions ${outerL} m × ${outerW} m and inner dimensions ${innerL} m × ${innerW} m.</p><p>Find the area of the frame border.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>A = ${A} m²</strong></p><p>A = outer − inner = ${outerL} × ${outerW} − ${innerL} × ${innerW} = ${parseFloat((outerL*outerW).toFixed(2))} − ${parseFloat((innerL*innerW).toFixed(2))} = ${A} m²</p>`;
  } else if (diff === 3) {
    // Rectangle + triangle on top
    const rW = rand(6, 12), rH = rand(4, 8), tH = rand(3, 7);
    const A = parseFloat((rW * rH + 0.5 * rW * tH).toFixed(2));
    answer = String(A);
    q = `<p>A shape consists of a rectangle (${rW} cm × ${rH} cm) with an isosceles triangle (base ${rW} cm, height ${tH} cm) on top.</p><p>Find the total area.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>A = ${A} cm²</strong></p><p>Rectangle: ${rW} × ${rH} = ${rW*rH} cm²</p><p>Triangle: ½ × ${rW} × ${tH} = ${0.5*rW*tH} cm²</p><p>Total = ${rW*rH} + ${0.5*rW*tH} = ${A} cm²</p>`;
  } else {
    // Trapezoid minus triangle (or two trapezoids)
    const a = rand(4, 8), b = rand(a+4, 14), h = rand(4, 9);
    const tBase = rand(2, Math.floor(b/3)), tH = rand(2, h-1);
    const trapA = 0.5 * (a + b) * h;
    const triA = 0.5 * tBase * tH;
    const A = parseFloat((trapA - triA).toFixed(2));
    answer = String(A);
    q = `<p>A trapezoid (a=${a} cm, b=${b} cm, h=${h} cm) has a triangular notch (base ${tBase} cm, height ${tH} cm) cut from it.</p><p>Find the remaining area.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>A = ${A} cm²</strong></p><p>Trapezoid: ½(${a}+${b})×${h} = ${trapA} cm²</p><p>Triangle: ½×${tBase}×${tH} = ${triA} cm²</p><p>Remaining = ${trapA} − ${triA} = ${A} cm²</p>`;
  }
  return {
    uid: makeUID("NUMERIC", 14, diff), level: 14, diff: diff, type: "NUMERIC",
    q: q, working: working, img: img, imgAlt: imgAlt,
    hint: "Split into simpler shapes, find each area, then add or subtract.", ncea: { standard: "N/A", ao: "N/A" },
    a: answer, units: ["cm²","m²"], tolerance: 0.02
  };
}

function _genL14_MCQ(diff) {
  const rW = rand(6, 12), rH = rand(4, 8), tH = rand(3, 6);
  const correct = parseFloat((rW * rH + 0.5 * rW * tH).toFixed(1));
  const d1 = parseFloat((rW * rH - 0.5 * rW * tH).toFixed(1));  // subtracted instead of added
  const d2 = parseFloat((rW * rH).toFixed(1));                    // forgot the triangle
  const d3 = parseFloat((rW * (rH + tH)).toFixed(1));             // treated as full rectangle
  const opts = shuffle([String(correct), String(d1), String(d2), String(d3)]);
  return {
    uid: makeUID("MCQ", 14, diff), level: 14, diff: diff, type: "MCQ",
    q: `<p>A shape has a rectangle (${rW} × ${rH} cm) with a triangle (base ${rW} cm, height ${tH} cm) added on top. What is the total area?</p>`,
    working: `<p><strong>Answer: ${correct} cm²</strong></p><p>Rectangle: ${rW*rH} cm², Triangle: ${0.5*rW*tH} cm², Total: ${correct} cm²</p>`,
    img: "", imgAlt: "", hint: "Add rectangle area and triangle area together.",
    ncea: { standard: "N/A", ao: "N/A" },
    options: opts.map(v => v + " cm²"),
    correctOption: opts.indexOf(String(correct))
  };
}

function _genL14_MATCH(diff) {
  const pairs = shuffle([
    { left: "Rectangle + triangle",          right: "A = lw + ½bh" },
    { left: "Rectangle minus inner rectangle", right: "A = L₁W₁ − L₂W₂" },
    { left: "Two rectangles (L-shape)",       right: "A = L₁W₁ + L₂W₂" },
    { left: "Rectangle minus semicircle",     right: "A = lw − ½\\(\\pi\\)r²" }
  ]);
  return {
    uid: makeUID("MATCH", 14, diff), level: 14, diff: diff, type: "MATCH",
    q: "<p>Match each composite shape to the correct area calculation strategy.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Decide whether you are adding or subtracting areas.",
    ncea: { standard: "N/A", ao: "N/A" }, pairs: pairs
  };
}

function _genL14_SEP(diff) {
  const W = rand(8, 14), H = rand(8, 12), nW = rand(3, Math.floor(W/3)), nH = rand(3, Math.floor(H/3));
  const correct = W * H - nW * nH;
  const wrong = W * H + nW * nH; // added instead of subtracted
  return {
    uid: makeUID("SPOT_ERROR_STEP", 14, diff), level: 14, diff: diff, type: "SPOT_ERROR",
    subtype: "STEP",
    q: `<p>An L-shape (${W} × ${H} cm, notch ${nW} × ${nH} cm). A student found the area. Find the error.</p>`,
    working: `<p><strong>Error is in Step 2.</strong></p><p>A = ${W*H} − ${nW*nH} = ${correct} cm²</p>`,
    img: makeSVGLShape(W, H, nW, nH, "cm"), imgAlt: `L-shape`,
    hint: "A notch is removed — should you add or subtract its area?",
    ncea: { standard: "N/A", ao: "N/A" },
    steps: [
      { id: 1, text: `Outer rectangle: ${W} × ${H} = ${W*H} cm²`, isError: false },
      { id: 2, text: `A = ${W*H} + ${nW} × ${nH} = ${W*H} + ${nW*nH} = ${wrong} cm²`, isError: true },
      { id: 3, text: `Area = ${wrong} cm²`, isError: false }
    ]
  };
}

function _genL14_SEV(diff) {
  const rW = rand(8, 14), rH = rand(5, 10), tH = rand(3, 6);
  const correct = parseFloat((rW * rH + 0.5 * rW * tH).toFixed(1));
  const wrong = parseFloat((rW * rH + rW * tH).toFixed(1)); // forgot ÷2 on triangle
  return {
    uid: makeUID("SPOT_ERROR_VALUE", 14, diff), level: 14, diff: diff, type: "SPOT_ERROR",
    subtype: "VALUE",
    q: `<p>A student found the area of a composite shape (rectangle ${rW}×${rH} cm + triangle base ${rW} cm height ${tH} cm). Click the wrong value.</p>`,
    working: `<p><strong>Error is token 3.</strong></p><p>Triangle area = ½ × ${rW} × ${tH} = ${0.5*rW*tH}, not ${rW*tH}. Total = ${correct} cm²</p>`,
    img: "", imgAlt: "",
    hint: "Did the student apply the ½ to the triangle area?",
    ncea: { standard: "N/A", ao: "N/A" },
    expression: `A = ${rW*rH} + [${rW}|1] \\(\\times\\) [${tH}|2] = [${wrong}|3] cm²`,
    correctErrorId: 3,
    errorExplanation: `The triangle area should be ½ × ${rW} × ${tH} = ${0.5*rW*tH} cm², not ${rW*tH}. Correct total = ${correct} cm².`
  };
}

function _genL14_EXP(diff) {
  return {
    uid: makeUID("EXPLANATION", 14, diff), level: 14, diff: 2, type: "EXPLANATION",
    q: "<p>Explain the two different strategies for finding the area of a composite shape. Describe when you would use each strategy and give an example of each.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Think about 'split and add' versus 'whole minus part'.",
    ncea: { standard: "N/A", ao: "N/A" },
    modelAnswer: "Strategy 1 (split and add): Divide the composite shape into simpler shapes, find the area of each, then add them together. Use this when the shape can be cleanly divided into non-overlapping pieces — for example, an L-shape split into two rectangles. Strategy 2 (whole minus part): Find the area of a larger containing shape, then subtract the area of the piece that was removed. Use this when something has been cut out — for example, a rectangular lawn with a circular pond removed.",
    markingChecklist: [
      "Describes the split-and-add strategy correctly",
      "Describes the whole-minus-part strategy correctly",
      "Gives an appropriate real example of each strategy"
    ]
  };
}

// ── Level 15 : Perimeter and Area of Shapes Involving Circles ─────────

function _genL15_NUMERIC(diff) {
  let answer, q, img, imgAlt, working;
  if (diff === 1) {
    // Semicircle perimeter = πr + 2r (arc + diameter)
    const r = rand(4, 10);
    const arc = parseFloat((Math.PI * r).toFixed(2));
    const P = parseFloat((Math.PI * r + 2 * r).toFixed(2));
    answer = String(P);
    q = `<p>A semicircle has a radius of ${r} cm.</p><p>Find the perimeter of the semicircle (arc + straight edge). Give your answer to 2 decimal places.</p>`;
    img = makeSVGSemiCircle(r, "cm"); imgAlt = `Semicircle radius ${r} cm`;
    working = `<p><strong>P = ${P} cm</strong></p><p>Arc = \\(\\pi\\)r = \\(\\pi \\times ${r}\\) = ${arc} cm</p><p>Diameter = 2 × ${r} = ${2*r} cm</p><p>P = ${arc} + ${2*r} = ${P} cm</p>`;
  } else if (diff === 2) {
    // Stadium shape: rectangle + semicircle on each end
    const rL = randF(4.0, 8.0, 1), rW = randF(2.5, rL-1, 1);
    const semR = rW / 2;
    // Area = rectangle + full circle (two semicircles)
    const A = parseFloat((rL * rW + Math.PI * semR * semR).toFixed(2));
    answer = String(A);
    q = `<p>A stadium shape consists of a rectangle ${rL} m × ${rW} m with a semicircle on each short end (radius = ${parseFloat(semR.toFixed(1))} m).</p><p>Find the total area to 2 decimal places.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>A = ${A} m²</strong></p><p>Rectangle: ${rL} × ${rW} = ${parseFloat((rL*rW).toFixed(2))} m²</p><p>Two semicircles = 1 full circle: \\(\\pi r^2\\) = \\(\\pi \\times ${parseFloat((semR*semR).toFixed(2))}\\) = ${parseFloat((Math.PI*semR*semR).toFixed(2))} m²</p><p>Total = ${A} m²</p>`;
  } else if (diff === 3) {
    // Annulus: π(R² - r²)
    const R_num = 5, R_den = 2, r_num = 3, r_den = 2;
    const R = R_num/R_den, rInner = r_num/r_den;
    const A = parseFloat((Math.PI * (R*R - rInner*rInner)).toFixed(2));
    const diffSq = R*R - rInner*rInner;
    answer = String(A);
    q = `<p>An annulus (ring) has outer radius \\(\\frac{${R_num}}{${R_den}}\\) m and inner radius \\(\\frac{${r_num}}{${r_den}}\\) m.</p><p>Find the area of the ring to 2 decimal places.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>A = ${A} m²</strong></p><p>A = \\(\\pi(R^2 - r^2)\\) = \\(\\pi\\left(\\left(\\frac{${R_num}}{${R_den}}\\right)^2 - \\left(\\frac{${r_num}}{${r_den}}\\right)^2\\right)\\)</p><p>= \\(\\pi\\left(\\frac{${R_num*R_num}}{${R_den*R_den}} - \\frac{${r_num*r_num}}{${r_den*r_den}}\\right)\\) = \\(\\pi \\times ${diffSq}\\) = ${A} m²</p>`;
  } else {
    // Square with circular hole
    const side = rand(12, 20), r = rand(2, Math.floor(side/4));
    const A = parseFloat((side * side - Math.PI * r * r).toFixed(2));
    answer = String(A);
    q = `<p>A square tile (side ${side} cm) has a circular hole (radius ${r} cm) cut from its centre.</p><p>Find the remaining area to 2 decimal places.</p>`;
    img = ""; imgAlt = "";
    working = `<p><strong>A = ${A} cm²</strong></p><p>Square: ${side}² = ${side*side} cm²</p><p>Circle: \\(\\pi \\times ${r}^2\\) = ${parseFloat((Math.PI*r*r).toFixed(2))} cm²</p><p>Remaining = ${side*side} − ${parseFloat((Math.PI*r*r).toFixed(2))} = ${A} cm²</p>`;
  }
  return {
    uid: makeUID("NUMERIC", 15, diff), level: 15, diff: diff, type: "NUMERIC",
    q: q, working: working, img: img, imgAlt: imgAlt,
    hint: "For semicircle perimeter: add the curved arc AND the straight diameter.", ncea: { standard: "N/A", ao: "N/A" },
    a: answer, units: ["cm","m","cm²","m²"], tolerance: 0.02
  };
}

function _genL15_MCQ(diff) {
  const r = rand(4, 9);
  const arc = parseFloat((Math.PI * r).toFixed(2));
  const correct = parseFloat((Math.PI * r + 2 * r).toFixed(2));
  const d1 = arc;                                        // forgot diameter
  const d2 = parseFloat((2 * Math.PI * r).toFixed(2));  // full circle circumference
  const d3 = parseFloat((0.5 * Math.PI * r * r).toFixed(2)); // semicircle area
  const opts = shuffle([String(correct), String(d1), String(d2), String(d3)]);
  return {
    uid: makeUID("MCQ", 15, diff), level: 15, diff: diff, type: "MCQ",
    q: `<p>A semicircle has radius ${r} cm. What is its perimeter to 2 d.p.?</p>`,
    working: `<p><strong>Answer: ${correct} cm</strong></p><p>P = \\(\\pi\\)r + 2r = ${arc} + ${2*r} = ${correct} cm</p>`,
    img: makeSVGSemiCircle(r, "cm"), imgAlt: `Semicircle r=${r}`,
    hint: "Don't forget to add the diameter across the flat side.",
    ncea: { standard: "N/A", ao: "N/A" },
    options: opts.map(v => v + " cm"),
    correctOption: opts.indexOf(String(correct))
  };
}

function _genL15_MATCH(diff) {
  const pairs = shuffle([
    { left: "Semicircle perimeter",  right: "\\(\\pi r + 2r\\)" },
    { left: "Semicircle area",       right: "\\(\\frac{1}{2}\\pi r^2\\)" },
    { left: "Annulus area",          right: "\\(\\pi(R^2 - r^2)\\)" },
    { left: "Quarter-circle area",   right: "\\(\\frac{1}{4}\\pi r^2\\)" }
  ]);
  return {
    uid: makeUID("MATCH", 15, diff), level: 15, diff: diff, type: "MATCH",
    q: "<p>Match each circle-based shape to its correct formula.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Semicircle perimeter includes the straight edge; area does not.",
    ncea: { standard: "N/A", ao: "N/A" }, pairs: pairs
  };
}

function _genL15_SEP(diff) {
  const r = rand(5, 10);
  const arc = parseFloat((Math.PI * r).toFixed(2));
  const correct = parseFloat((arc + 2 * r).toFixed(2));
  const wrong = arc; // forgot diameter
  return {
    uid: makeUID("SPOT_ERROR_STEP", 15, diff), level: 15, diff: diff, type: "SPOT_ERROR",
    subtype: "STEP",
    q: `<p>A semicircle has radius ${r} cm. A student found the perimeter. Find the error.</p>`,
    working: `<p><strong>Error is in Step 3.</strong></p><p>P = arc + diameter = ${arc} + ${2*r} = ${correct} cm</p>`,
    img: makeSVGSemiCircle(r, "cm"), imgAlt: `Semicircle r=${r}`,
    hint: "Does the perimeter include the straight edge across the diameter?",
    ncea: { standard: "N/A", ao: "N/A" },
    steps: [
      { id: 1, text: `Semicircle perimeter = curved arc + diameter`, isError: false },
      { id: 2, text: `Arc = \\(\\pi r\\) = \\(\\pi \\times ${r}\\) = ${arc} cm`, isError: false },
      { id: 3, text: `P = ${arc} cm`, isError: true }
    ]
  };
}

function _genL15_SEV(diff) {
  const R = rand(6, 10), rInner = rand(2, R - 2);
  const correct = parseFloat((Math.PI * (R*R - rInner*rInner)).toFixed(2));
  const wrong = parseFloat((Math.PI * (R - rInner) * (R - rInner)).toFixed(2)); // subtracted radii before squaring
  return {
    uid: makeUID("SPOT_ERROR_VALUE", 15, diff), level: 15, diff: diff, type: "SPOT_ERROR",
    subtype: "VALUE",
    q: `<p>A student found the area of an annulus (outer r=${R} cm, inner r=${rInner} cm). Click the wrong value.</p>`,
    working: `<p><strong>Error is token 2.</strong></p><p>A = \\(\\pi(${R}^2 - ${rInner}^2)\\) = \\(\\pi(${R*R} - ${rInner*rInner})\\) = \\(\\pi \\times ${R*R-rInner*rInner}\\) = ${correct} cm²</p>`,
    img: "", imgAlt: "",
    hint: "Do you subtract the radii first, or the areas?",
    ncea: { standard: "N/A", ao: "N/A" },
    expression: `A = \\(\\pi\\) \\(\\times\\) ([${R}|1] − [${rInner}|2])² = \\(\\pi \\times ${(R-rInner)*(R-rInner)}\\) = [${wrong}|3] cm²`,
    correctErrorId: 2,
    errorExplanation: `The student subtracted radii before squaring. Correct: A = π(R² − r²) = π(${R*R} − ${rInner*rInner}) = ${correct} cm².`
  };
}

function _genL15_EXP(diff) {
  return {
    uid: makeUID("EXPLANATION", 15, diff), level: 15, diff: 2, type: "EXPLANATION",
    q: "<p>A student calculates the area of an annulus by subtracting the inner radius from the outer radius, then squaring and multiplying by π. Explain why this gives the wrong answer and describe the correct method.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Does squaring happen before or after the subtraction?",
    ncea: { standard: "N/A", ao: "N/A" },
    modelAnswer: "The student's method computes π(R − r)², but the correct formula is π(R² − r²). The correct method is to square each radius separately, subtract the two squared values, then multiply by π. The error is subtracting the radii before squaring. Since (R − r)² ≠ R² − r², this produces an incorrect (smaller) result.",
    markingChecklist: [
      "States that the correct formula is π(R² − r²)",
      "Identifies the student's error: subtracting radii before squaring",
      "Explains the correct order: square each radius, then subtract"
    ]
  };
}

// ── Level 16 : Context Problems ───────────────────────────────────────

const _L16_contexts = [
  {name:"rugby field",    l:100, w:68,  unitL:"m", type:"rect", ask:"perimeter",  ctx:"The school wants to fence the entire field."},
  {name:"netball court",  l:30,  w:15,  unitL:"m", type:"rect", ask:"perimeter",  ctx:"How much boundary line is needed?"},
  {name:"kiwifruit block",l:null,w:null,unitL:"m", type:"rect", ask:"area",       ctx:"Find the area of the orchard block."},
  {name:"classrm floor",  l:null,w:null,unitL:"m", type:"rect", ask:"area",       ctx:"How much carpet is needed?"},
  {name:"circular garden",r:null,       unitL:"m", type:"circ", ask:"area",       ctx:"Find the area to determine how much compost to order."},
  {name:"circular pool",  r:null,       unitL:"m", type:"circ", ask:"circumference", ctx:"Find the circumference to determine the edging length."},
  {name:"tukutuku panel", l:null,w:null,unitL:"cm",type:"rect", ask:"area",       ctx:"Find the area of the decorative panel."},
  {name:"pizza comparison",r1:null,r2:null,unitL:"cm",type:"2circ",ask:"area",   ctx:"Which pizza gives more area?"}
];
let _L16_ctxPool = null;
function _getL16Ctx() {
  if (!_L16_ctxPool || _L16_ctxPool.length === 0) _L16_ctxPool = _L16_contexts.slice();
  return pickAndRemove(_L16_ctxPool);
}

function _genL16_NUMERIC(diff) {
  let q, working, answer, unitStr;
  if (diff === 1) {
    const l = rand(60, 120), w = rand(30, 80);
    const P = 2*l + 2*w;
    answer = String(P);
    q = `<p>A rectangular sports field is ${l} m long and ${w} m wide.</p><p>The school wants to put a fence all the way around it. How many metres of fencing are needed?</p>`;
    working = `<p><strong>${P} m of fencing</strong></p><p>P = 2l + 2w = 2 × ${l} + 2 × ${w} = ${2*l} + ${2*w} = ${P} m</p>`;
    unitStr = "m";
  } else if (diff === 2) {
    const l = randF(20.0, 50.0, 1), w = randF(15.0, 30.0, 1);
    const costPerM = randF(8.0, 20.0, 2);
    const P = parseFloat((2*l + 2*w).toFixed(1));
    const cost = parseFloat((P * costPerM).toFixed(2));
    answer = String(cost);
    q = `<p>A kiwifruit orchard is ${l} m long and ${w} m wide.</p><p>Fencing costs $${costPerM} per metre. Find the total cost of fencing the orchard.</p>`;
    working = `<p><strong>Cost = $${cost}</strong></p><p>P = 2 × ${l} + 2 × ${w} = ${P} m</p><p>Cost = ${P} × $${costPerM} = $${cost}</p>`;
    unitStr = "$";
  } else if (diff === 3) {
    // Circular garden: area given, find circumference for edging cost
    const A = parseFloat((rand(30, 80) + rand(0, 9) * 0.1).toFixed(1));
    const r = parseFloat(Math.sqrt(A / Math.PI).toFixed(2));
    const C = parseFloat((2 * Math.PI * r).toFixed(2));
    const costPerM = randF(5.0, 10.0, 2);
    const cost = parseFloat((C * costPerM).toFixed(2));
    answer = String(cost);
    q = `<p>A circular garden bed has an area of ${A} m².</p><p>Garden edging costs $${costPerM} per metre. Find the total cost of edging around the garden.</p>`;
    working = `<p><strong>Cost = $${cost}</strong></p><p>Step 1: r = \\(\\sqrt{A \\div \\pi}\\) = \\(\\sqrt{${A} \\div \\pi}\\) = ${r} m</p><p>Step 2: C = 2\\(\\pi\\)r = 2\\(\\pi \\times ${r}\\) = ${C} m</p><p>Step 3: Cost = ${C} × $${costPerM} = $${cost}</p>`;
    unitStr = "$";
  } else {
    // Lawn minus circular pool
    const l = rand(12, 20), w = rand(8, 14), r = rand(2, 3);
    const A = parseFloat((l * w - Math.PI * r * r).toFixed(2));
    answer = String(A);
    q = `<p>A rectangular lawn is ${l} m × ${w} m. A circular garden bed with radius ${r} m is planted in one corner.</p><p>Find the remaining grassed area to 2 decimal places.</p>`;
    working = `<p><strong>Grassed area = ${A} m²</strong></p><p>Lawn: ${l} × ${w} = ${l*w} m²</p><p>Garden: \\(\\pi \\times ${r}^2\\) = ${parseFloat((Math.PI*r*r).toFixed(2))} m²</p><p>Remaining = ${l*w} − ${parseFloat((Math.PI*r*r).toFixed(2))} = ${A} m²</p>`;
    unitStr = "m²";
  }
  return {
    uid: makeUID("NUMERIC", 16, diff), level: 16, diff: diff, type: "NUMERIC",
    q: q, working: working, img: "", imgAlt: "",
    hint: "Identify what the problem is asking: area or perimeter?", ncea: { standard: "N/A", ao: "N/A" },
    a: answer, units: [unitStr, unitStr.replace("$","")], tolerance: 0.02
  };
}

function _genL16_MCQ(diff) {
  const l = rand(15, 40), w = rand(10, l - 3);
  const A = l * w;
  const P = 2*l + 2*w;
  const isArea = rand(0,1) === 0;
  const correct = isArea ? A : P;
  const wrong1 = isArea ? P : A;
  const wrong2 = isArea ? l + w : l * w;
  const wrong3 = isArea ? 2*l*w : l + w;
  const opts = shuffle([String(correct), String(wrong1), String(wrong2), String(wrong3)]);
  const unit = isArea ? "m²" : "m";
  const q = isArea
    ? `<p>A rectangular ${l} m × ${w} m classroom floor needs to be carpeted. How much carpet (in m²) is needed?</p>`
    : `<p>A rectangular field ${l} m × ${w} m is to be fenced. How many metres of fencing are needed?</p>`;
  return {
    uid: makeUID("MCQ", 16, diff), level: 16, diff: diff, type: "MCQ",
    q: q,
    working: `<p><strong>Answer: ${correct} ${unit}</strong></p><p>${isArea ? `A = ${l} × ${w} = ${A} m²` : `P = 2 × ${l} + 2 × ${w} = ${P} m`}</p>`,
    img: "", imgAlt: "", hint: isArea ? "Carpet covers a surface — use area." : "Fencing goes around the outside — use perimeter.",
    ncea: { standard: "N/A", ao: "N/A" },
    options: opts.map(v => v + " " + unit),
    correctOption: opts.indexOf(String(correct))
  };
}

function _genL16_MATCH(diff) {
  const pairs = shuffle([
    { left: "Carpet for a floor",          right: "Area (m²)" },
    { left: "Fencing around a field",       right: "Perimeter (m)" },
    { left: "Paint for a wall",             right: "Area (m²)" },
    { left: "Edging around a garden bed",   right: "Perimeter (m)" }
  ]);
  return {
    uid: makeUID("MATCH", 16, diff), level: 16, diff: diff, type: "MATCH",
    q: "<p>Match each real-life task to whether it requires area or perimeter.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Covering a surface → area. Going around an edge → perimeter.",
    ncea: { standard: "N/A", ao: "N/A" }, pairs: pairs
  };
}

function _genL16_SEP(diff) {
  const l = rand(15, 30), w = rand(10, 20);
  const A = l * w;
  const P = 2*l + 2*w;
  return {
    uid: makeUID("SPOT_ERROR_STEP", 16, diff), level: 16, diff: diff, type: "SPOT_ERROR",
    subtype: "STEP",
    q: `<p>A student was asked: "How many metres of fencing are needed for a ${l} m × ${w} m field?" Find the error in their working.</p>`,
    working: `<p><strong>Error is in Step 2.</strong></p><p>Fencing goes around the perimeter: P = 2 × ${l} + 2 × ${w} = ${P} m</p>`,
    img: "", imgAlt: "",
    hint: "Fencing goes around the outside — is that area or perimeter?",
    ncea: { standard: "N/A", ao: "N/A" },
    steps: [
      { id: 1, text: `Field: ${l} m × ${w} m`, isError: false },
      { id: 2, text: `Fencing = ${l} × ${w} = ${A} m`, isError: true },
      { id: 3, text: `${A} metres of fencing needed`, isError: false }
    ]
  };
}

function _genL16_SEV(diff) {
  const r = rand(4, 10);
  const correct = parseFloat((Math.PI * r * r).toFixed(2));
  const wrong = parseFloat((2 * Math.PI * r).toFixed(2)); // used circumference for area question
  return {
    uid: makeUID("SPOT_ERROR_VALUE", 16, diff), level: 16, diff: diff, type: "SPOT_ERROR",
    subtype: "VALUE",
    q: `<p>A student was asked "How much compost is needed for a circular garden (radius ${r} m)?" They calculated: click the wrong value.</p>`,
    working: `<p><strong>Error is token 3.</strong></p><p>Compost covers area: A = \\(\\pi r^2\\) = \\(\\pi \\times ${r*r}\\) = ${correct} m²</p>`,
    img: "", imgAlt: "",
    hint: "Compost covers the surface — which formula gives area?",
    ncea: { standard: "N/A", ao: "N/A" },
    expression: `Amount = [2|1]\\(\\pi\\) \\(\\times\\) [${r}|2] = [${wrong}|3] m²`,
    correctErrorId: 1,
    errorExplanation: `The student used the circumference formula 2πr instead of the area formula πr². Correct: A = π × ${r}² = ${correct} m².`
  };
}

function _genL16_EXP(diff) {
  return {
    uid: makeUID("EXPLANATION", 16, diff), level: 16, diff: 2, type: "EXPLANATION",
    q: "<p>Explain how you decide whether to use area or perimeter to answer a real-world question. Give two examples of real-world situations: one that requires area and one that requires perimeter.</p>",
    working: "", img: "", imgAlt: "",
    hint: "Ask: are you covering a surface, or going around an edge?",
    ncea: { standard: "N/A", ao: "N/A" },
    modelAnswer: "To decide: if the problem involves covering, filling, or tiling a flat surface, use area. If the problem involves going around the outside of a shape (fencing, edging, framing, or measuring a border), use perimeter. Example of area: calculating how much paint is needed for a wall. Example of perimeter: calculating how many metres of fencing are needed to enclose a paddock.",
    markingChecklist: [
      "States that area is used for covering or filling a surface",
      "States that perimeter is used for going around the outside of a shape",
      "Gives a valid real-world example requiring area",
      "Gives a valid real-world example requiring perimeter"
    ]
  };
}

// ── Master dispatcher functions ───────────────────────────────────────

// Per-level type queues (pool-and-remove; reset when exhausted)
const _typeQueues = {};

function _getTypeQueue(level) {
  if (!_typeQueues[level] || _typeQueues[level].length === 0) {
    if (level === 1) {
      _typeQueues[level] = shuffle(["MCQ","MCQ","MCQ","MCQ","MATCH","MATCH","MATCH","TEXT","TEXT","EXPLANATION"]);
    } else if (level === 16) {
      _typeQueues[level] = shuffle(["NUMERIC","NUMERIC","NUMERIC","NUMERIC","MCQ","MCQ","SPOT_ERROR_STEP","SPOT_ERROR_STEP","SPOT_ERROR_VALUE","EXPLANATION"]);
    } else {
      _typeQueues[level] = shuffle(["NUMERIC","NUMERIC","NUMERIC","MCQ","MCQ","MATCH","SPOT_ERROR_STEP","SPOT_ERROR_STEP","SPOT_ERROR_VALUE","EXPLANATION"]);
    }
  }
  return _typeQueues[level];
}

function _genNumeric(level, diff) {
  switch(level) {
    case 2:  return _genL2_NUMERIC(diff);
    case 3:  return _genL3_NUMERIC(diff);
    case 4:  return _genL4_NUMERIC(diff);
    case 5:  return _genL5_NUMERIC(diff);
    case 6:  return _genL6_NUMERIC(diff);
    case 7:  return _genL7_NUMERIC(diff);
    case 8:  return _genL8_NUMERIC(diff);
    case 9:  return _genL9_NUMERIC(diff);
    case 10: return _genL10_NUMERIC(diff);
    case 11: return _genL11_NUMERIC(diff);
    case 12: return _genL12_NUMERIC(diff);
    case 13: return _genL13_NUMERIC(diff);
    case 14: return _genL14_NUMERIC(diff);
    case 15: return _genL15_NUMERIC(diff);
    case 16: return _genL16_NUMERIC(diff);
    default: return _genL4_NUMERIC(diff);
  }
}

function _genMCQ(level, diff) {
  switch(level) {
    case 1:  return _genL1_MCQ(diff);
    case 2:  return _genL2_MCQ(diff);
    case 3:  return _genL3_MCQ(diff);
    case 4:  return _genL4_MCQ(diff);
    case 5:  return _genL5_MCQ(diff);
    case 6:  return _genL6_MCQ(diff);
    case 7:  return _genL7_MCQ(diff);
    case 8:  return _genL8_MCQ(diff);
    case 9:  return _genL9_MCQ(diff);
    case 10: return _genL10_MCQ(diff);
    case 11: return _genL11_MCQ(diff);
    case 12: return _genL12_MCQ(diff);
    case 13: return _genL13_MCQ(diff);
    case 14: return _genL14_MCQ(diff);
    case 15: return _genL15_MCQ(diff);
    case 16: return _genL16_MCQ(diff);
    default: return _genL4_MCQ(diff);
  }
}

function _genMatch(level, diff) {
  switch(level) {
    case 1:  return _genL1_MATCH(diff);
    case 2:  return _genL2_MATCH(diff);
    case 3:  return _genL3_MATCH(diff);
    case 4:  return _genL4_MATCH(diff);
    case 5:  return _genL5_MATCH(diff);
    case 6:  return _genL6_MATCH(diff);
    case 7:  return _genL7_MATCH(diff);
    case 8:  return _genL8_MATCH(diff);
    case 9:  return _genL9_MATCH(diff);
    case 10: return _genL10_MATCH(diff);
    case 11: return _genL11_MATCH(diff);
    case 12: return _genL12_MATCH(diff);
    case 13: return _genL13_MATCH(diff);
    case 14: return _genL14_MATCH(diff);
    case 15: return _genL15_MATCH(diff);
    case 16: return _genL16_MATCH(diff);
    default: return _genL4_MATCH(diff);
  }
}

function _genSpotErrorStep(level, diff) {
  switch(level) {
    case 2:  return _genL2_SEP(diff);
    case 3:  return _genL3_SEP(diff);
    case 4:  return _genL4_SEP(diff);
    case 5:  return _genL5_SEP(diff);
    case 6:  return _genL6_SEP(diff);
    case 7:  return _genL7_SEP(diff);
    case 8:  return _genL8_SEP(diff);
    case 9:  return _genL9_SEP(diff);
    case 10: return _genL10_SEP(diff);
    case 11: return _genL11_SEP(diff);
    case 12: return _genL12_SEP(diff);
    case 13: return _genL13_SEP(diff);
    case 14: return _genL14_SEP(diff);
    case 15: return _genL15_SEP(diff);
    case 16: return _genL16_SEP(diff);
    default: return _genL4_SEP(diff);
  }
}

function _genSpotErrorValue(level, diff) {
  switch(level) {
    case 2:  return _genL2_SEV(diff);
    case 3:  return _genL3_SEV(diff);
    case 4:  return _genL4_SEV(diff);
    case 5:  return _genL5_SEV(diff);
    case 6:  return _genL6_SEV(diff);
    case 7:  return _genL7_SEV(diff);
    case 8:  return _genL8_SEV(diff);
    case 9:  return _genL9_SEV(diff);
    case 10: return _genL10_SEV(diff);
    case 11: return _genL11_SEV(diff);
    case 12: return _genL12_SEV(diff);
    case 13: return _genL13_SEV(diff);
    case 14: return _genL14_SEV(diff);
    case 15: return _genL15_SEV(diff);
    case 16: return _genL16_SEV(diff);
    default: return _genL4_SEV(diff);
  }
}

function _genExplanation(level, diff) {
  switch(level) {
    case 1:  return _genL1_EXPLANATION(diff);
    case 2:  return _genL2_EXP(diff);
    case 3:  return _genL3_EXP(diff);
    case 4:  return _genL4_EXP(diff);
    case 5:  return _genL5_EXP(diff);
    case 6:  return _genL6_EXP(diff);
    case 7:  return _genL7_EXP(diff);
    case 8:  return _genL8_EXP(diff);
    case 9:  return _genL9_EXP(diff);
    case 10: return _genL10_EXP(diff);
    case 11: return _genL11_EXP(diff);
    case 12: return _genL12_EXP(diff);
    case 13: return _genL13_EXP(diff);
    case 14: return _genL14_EXP(diff);
    case 15: return _genL15_EXP(diff);
    case 16: return _genL16_EXP(diff);
    default: return _genL4_EXP(diff);
  }
}

// Difficulty cycling: spread 1-4 across questions per level
const _diffCounters = {};
function _nextDiff(level) {
  if (!_diffCounters[level]) _diffCounters[level] = 0;
  const d = (_diffCounters[level] % 4) + 1;
  _diffCounters[level]++;
  return d;
}

// ── 4. CONFIG OBJECT ──────────────────────────────────────────────────

const config = {
  id: "area-perimeter",
  title: "Area and Perimeter (Polygons and Circles)",

  levelNames: [
    "Circle Parts Vocabulary",
    "Perimeter of Rectangles and Squares",
    "Perimeter of Triangles and Polygons",
    "Area of Rectangles and Squares",
    "Area of Triangles",
    "Area of Parallelograms",
    "Area of Trapezoids",
    "Circumference of a Circle",
    "Area of a Circle",
    "Missing Side from Perimeter",
    "Radius from Circumference",
    "Radius from Area",
    "Perimeter of Composite Shapes",
    "Area of Composite Shapes",
    "Shapes Involving Circles",
    "Context Problems"
  ],

  getQuestion(level, diff) {
    const queue = _getTypeQueue(level);
    const type = pickAndRemove(queue);
    const d = (diff >= 1 && diff <= 4) ? diff : _nextDiff(level);
    switch(type) {
      case "NUMERIC":         return _genNumeric(level, d);
      case "MCQ":             return _genMCQ(level, d);
      case "MATCH":           return _genMatch(level, d);
      case "SPOT_ERROR_STEP": return _genSpotErrorStep(level, d);
      case "SPOT_ERROR_VALUE":return _genSpotErrorValue(level, d);
      case "EXPLANATION":     return _genExplanation(level, d);
      case "TEXT":            return _genL1_TEXT(d);
      default:                return _genNumeric(level, d);
    }
  },

  renderFront(q, el) {
    $(el).empty();
    if (q.img && q.img.length > 0) {
      $(el).addClass("has-image").removeClass("no-image");
      const $img = $("<img>").attr("src", q.img).attr("alt", q.imgAlt || "").css({
        "max-width": "100%", "display": "block", "margin": "0 auto 8px auto"
      });
      $(el).append($img);
      const $qText = $("<div>").addClass("question-text").html(q.q);
      $(el).append($qText);
    } else {
      $(el).addClass("no-image").removeClass("has-image");
      const $qText = $("<div>").addClass("question-text question-centered").html(q.q);
      $(el).append($qText);
    }
  },

  generateSolution(q) {
    if (q.type === "EXPLANATION") return "";

    if (q.type === "NUMERIC" || q.type === "TEXT") {
      return q.working || `<p><strong>Answer: ${q.a}${q.units && q.units[0] ? " " + q.units[0] : ""}</strong></p>`;
    }

    if (q.type === "MCQ") {
      const letter = ["A","B","C","D"][q.correctOption] || "A";
      const optText = q.options ? q.options[q.correctOption] : "";
      return (q.working || "") + `<p><strong>Correct answer: ${letter}) ${optText}</strong></p>`;
    }

    if (q.type === "MATCH") {
      let html = "<p><strong>Correct pairs:</strong></p><ul>";
      if (q.pairs) {
        q.pairs.forEach(function(p) { html += `<li>${p.left} &nbsp;↔&nbsp; ${p.right}</li>`; });
      }
      html += "</ul>";
      return html;
    }

    if (q.type === "SPOT_ERROR") {
      if (q.subtype === "STEP") {
        let html = "<p><strong>Worked solution — error highlighted:</strong></p>";
        if (q.steps) {
          q.steps.forEach(function(s) {
            if (s.isError) {
              html += `<p><span style="color:red;font-weight:bold;">✗ Step ${s.id}: ${s.text} ← ERROR</span></p>`;
            } else {
              html += `<p>Step ${s.id}: ${s.text}</p>`;
            }
          });
        }
        html += (q.working || "");
        return html;
      }
      if (q.subtype === "VALUE") {
        return (q.working || "") + (q.errorExplanation ? `<p>${q.errorExplanation}</p>` : "");
      }
    }

    return q.working || "";
  }

};

// Patch referenceItems into config after declaration
config.referenceItems = [
  {
    label: "Perim",
    title: "Perimeter Formulae",
    text:  "Rectangle: P = 2l + 2w | Square: P = 4s | Triangle: sum of all sides | Regular polygon: P = n × s",
    math:  "P = 2l + 2w"
  },
  {
    label: "Area",
    title: "Area Formulae",
    text:  "Rectangle: A = l × w | Square: A = s² | Triangle: A = ½bh | Parallelogram: A = bh | Trapezoid: A = ½(a+b)h",
    math:  "A = l \\times w, \\quad A = \\tfrac{1}{2}bh, \\quad A = \\tfrac{1}{2}(a+b)h"
  },
  {
    label: "Circle",
    title: "Circle Formulae",
    text:  "Circumference: C = πd = 2πr | Area: A = πr² | Diameter: d = 2r | Radius from C: r = C ÷ (2π) | Radius from A: r = √(A ÷ π)",
    math:  "C = \\pi d = 2\\pi r, \\quad A = \\pi r^2"
  }
];

config.referenceLabel = "Formulae";

// ── 5. BOOT LINE ──────────────────────────────────────────────────────
//QsetFW.init(config, document.getElementById('module-container'));
document.addEventListener('DOMContentLoaded', function () {
QsetFW.init(config, document.getElementById('module-container'));
});
export default config;
