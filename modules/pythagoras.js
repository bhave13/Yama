// ── 1. HEADER COMMENT ─────────────────────────────────────────────────
// Topic:        Pythagoras' Theorem
// NCEA Level:   N/A   Standard: N/A
// Year Group:   Year 10
// Generated:    2026-04-27
// Type Mix:     35% NUMERIC, 20% MCQ, 10% MATCH, 20% SPOT_ERROR, 15% EXPLANATION
// Levels 1–2:   MCQ + MATCH only (per Topic Analysis recommendation)
// Levels 3:     MCQ + MATCH only
// Levels 4–5:   NUMERIC + SPOT_ERROR/STEP
// Level 6:      NUMERIC + EXPLANATION
// Level 7:      NUMERIC + SPOT_ERROR/VALUE + EXPLANATION
// Level 8:      NUMERIC + EXPLANATION

// ── 2. UTILITY FUNCTIONS ──────────────────────────────────────────────

// rand(min, max) — random integer in [min, max] inclusive
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// randF(min, max, dp) — random float rounded to dp decimal places
const randF = (min, max, dp) => {
  const factor = Math.pow(10, dp);
  return Math.round((Math.random() * (max - min) + min) * factor) / factor;
};

// pickAndRemove(arr) — removes and returns a random element from arr
const pickAndRemove = (arr) => {
  const idx = Math.floor(Math.random() * arr.length);
  return arr.splice(idx, 1)[0];
};

// shuffle(arr) — Fisher-Yates shuffle, returns new array
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Global UID counter
let _uidCounter = 0;

// makeUID(type, level, diff) — returns uid string in standard format
const makeUID = (type, level, diff) => {
  _uidCounter++;
  const abbr = { NUMERIC: "num", MCQ: "mcq", MATCH: "mat", "SPOT_ERROR/STEP": "sep", "SPOT_ERROR/VALUE": "sev", EXPLANATION: "exp" };
  const n = String(_uidCounter).padStart(3, "0");
  return `${abbr[type] || "unk"}-${n}-lev${level}-d${diff}`;
};

// makeSVG — generate an inline SVG data URI for a right-angled triangle
// orientation: "standard" (right angle bottom-left), "rotated" (right angle top), "isosceles"
// labels: { a, b, c } side label strings; sides: { a, b, c } dimension strings
const makeSVG = (opts) => {
  const {
    orientation = "standard",
    sides = { a: "", b: "", c: "" },
    labels = { A: "A", B: "B", C: "C" },
    showRightAngle = true,
    extraLines = [],
    title = ""
  } = opts;

  const W = 220, H = 160;
  let pts, raCorner, sidePositions;

  if (orientation === "standard") {
    // Right angle at bottom-left: A(top-left), B(bottom-left, right angle), C(bottom-right)
    pts = { A: [30, 20], B: [30, 130], C: [180, 130] };
    raCorner = pts.B;
    sidePositions = {
      a: [(pts.B[0] + pts.C[0]) / 2, pts.B[1] + 18],   // bottom (side a = BC)
      b: [pts.A[0] - 22, (pts.A[1] + pts.B[1]) / 2],   // left   (side b = AB)
      c: [(pts.A[0] + pts.C[0]) / 2 + 8, (pts.A[1] + pts.C[1]) / 2 - 12] // hyp
    };
  } else if (orientation === "rotated") {
    // Right angle at bottom-right: A(top-right), B(bottom-left), C(bottom-right, right angle)
    pts = { A: [190, 20], B: [30, 130], C: [190, 130] };
    raCorner = pts.C;
    sidePositions = {
      a: [(pts.B[0] + pts.C[0]) / 2, pts.B[1] + 18],
      b: [pts.A[0] + 10, (pts.A[1] + pts.C[1]) / 2],
      c: [(pts.A[0] + pts.B[0]) / 2 - 20, (pts.A[1] + pts.B[1]) / 2 - 12]
    };
  } else if (orientation === "top") {
    // Right angle at top: A(top, right angle), B(bottom-left), C(bottom-right)
    pts = { A: [110, 20], B: [30, 130], C: [190, 130] };
    raCorner = pts.A;
    sidePositions = {
      a: [(pts.A[0] + pts.B[0]) / 2 - 22, (pts.A[1] + pts.B[1]) / 2],
      b: [(pts.A[0] + pts.C[0]) / 2 + 22, (pts.A[1] + pts.C[1]) / 2],
      c: [(pts.B[0] + pts.C[0]) / 2, pts.B[1] + 18]
    };
  } else if (orientation === "isosceles") {
    // Isosceles: apex A at top-centre, B bottom-left, C bottom-right, altitude shown
    pts = { A: [110, 15], B: [30, 140], C: [190, 140] };
    raCorner = null;
    sidePositions = {
      a: [(pts.A[0] + pts.B[0]) / 2 - 22, (pts.A[1] + pts.B[1]) / 2],
      b: [(pts.A[0] + pts.C[0]) / 2 + 22, (pts.A[1] + pts.C[1]) / 2],
      c: [(pts.B[0] + pts.C[0]) / 2, pts.B[1] + 18]
    };
  }

  const polyPoints = `${pts.A[0]},${pts.A[1]} ${pts.B[0]},${pts.B[1]} ${pts.C[0]},${pts.C[1]}`;

  // Right-angle marker (10px square)
  let raMarker = "";
  if (showRightAngle && raCorner) {
    const [rx, ry] = raCorner;
    const s = 10;
    if (orientation === "standard") {
      raMarker = `<polyline points="${rx},${ry - s} ${rx + s},${ry - s} ${rx + s},${ry}" fill="none" stroke="#333" stroke-width="1.5"/>`;
    } else if (orientation === "rotated") {
      raMarker = `<polyline points="${rx - s},${ry} ${rx - s},${ry - s} ${rx},${ry - s}" fill="none" stroke="#333" stroke-width="1.5"/>`;
    } else if (orientation === "top") {
      raMarker = `<polyline points="${rx - s},${ry} ${rx - s},${ry + s} ${rx + s},${ry + s} ${rx + s},${ry}" fill="none" stroke="#333" stroke-width="1.5"/>`;
    }
  }

  // Vertex labels
  const vertexOffset = {
    A: orientation === "standard" ? [-14, 0] : orientation === "rotated" ? [8, 0] : orientation === "top" ? [0, -10] : [0, -12],
    B: [-14, 10],
    C: orientation === "rotated" ? [8, 10] : [6, 10]
  };

  const vertexLabels = Object.entries(pts).map(([k, [x, y]]) => {
    const [dx, dy] = (vertexOffset[k] || [0, 0]);
    return `<text x="${x + dx}" y="${y + dy}" font-size="13" font-family="sans-serif" fill="#222" font-style="italic">${labels[k] || k}</text>`;
  }).join("\n    ");

  // Side dimension labels
  const sideLabelsSVG = [
    sides.a ? `<text x="${sidePositions.a[0]}" y="${sidePositions.a[1]}" font-size="12" font-family="sans-serif" fill="#1a56db" text-anchor="middle">${sides.a}</text>` : "",
    sides.b ? `<text x="${sidePositions.b[0]}" y="${sidePositions.b[1]}" font-size="12" font-family="sans-serif" fill="#1a56db" text-anchor="middle">${sides.b}</text>` : "",
    sides.c ? `<text x="${sidePositions.c[0]}" y="${sidePositions.c[1]}" font-size="12" font-family="sans-serif" fill="#c0392b" text-anchor="middle">${sides.c}</text>` : ""
  ].join("\n    ");

  // Extra lines (e.g. altitude for isosceles)
  const extraSVG = extraLines.map(l =>
    `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="#888" stroke-width="1" stroke-dasharray="4,3"/>`
  ).join("\n    ");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${title}">
  <polygon points="${polyPoints}" fill="#eef4ff" stroke="#333" stroke-width="2"/>
  ${raMarker}
  ${vertexLabels}
  ${sideLabelsSVG}
  ${extraSVG}
</svg>`;

  return "data:image/svg+xml," + encodeURIComponent(svg);
};

// ── 3. QUESTION GENERATORS ────────────────────────────────────────────

// Known Pythagorean triples (scaled) for clean-integer questions
const TRIPLES = [
  [3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],[9,12,15],[12,16,20],[5,12,13],
  [8,6,10],[9,40,41],[11,60,61],[12,35,37],[20,21,29],[28,45,53],[33,56,65]
];

// Context pools (NZ-relevant, for Level 8)
const _contextPool8Master = [
  { name: "ladder", template: "construction" },
  { name: "rugby field", template: "sports" },
  { name: "paddock fence", template: "farming" },
  { name: "TV screen", template: "technology" },
  { name: "rowing course", template: "sports" },
  { name: "roof rafter", template: "construction" },
  { name: "wharenui floor", template: "maori" },
  { name: "tukutuku panel", template: "maori" },
  { name: "navigation", template: "navigation" },
  { name: "baking tin", template: "cooking" }
];

// Level pools for context variety (reset when exhausted)
const _pools = {};
const getPool = (key, master) => {
  if (!_pools[key] || _pools[key].length === 0) {
    _pools[key] = master.slice();
  }
  return _pools[key];
};

// ─── LEVEL 1: Squares and Square Roots ────────────────────────────────
// Types: NUMERIC, MCQ
// Diff 1: integer perfect square; Diff 2: decimal; Diff 3: fraction; Diff 4: surd

const _genLevel1 = (diff) => {
  // Randomly choose square or square-root operation
  const op = Math.random() < 0.5 ? "square" : "sqrt";

  if (diff === 1) {
    const base = rand(2, 12);
    const answer = base * base;
    if (op === "square") {
      return { q: `Calculate the value of \\(${base}^2\\).`, a: String(answer), working: `\\(${base}^2 = ${base} \\times ${base} = ${answer}\\)` };
    } else {
      return { q: `Calculate \\(\\sqrt{${answer}}\\).`, a: String(base), working: `\\(\\sqrt{${answer}} = ${base}\\) (since \\(${base}^2 = ${answer}\\))` };
    }
  } else if (diff === 2) {
    const bases = [1.5, 2.5, 3.5, 4.5, 1.2, 2.4, 0.5, 1.1, 2.2, 3.5];
    const base = bases[rand(0, bases.length - 1)];
    const answer = Math.round(base * base * 100) / 100;
    if (op === "square") {
      return { q: `Calculate \\(${base}^2\\).`, a: String(answer), working: `\\(${base}^2 = ${base} \\times ${base} = ${answer}\\)` };
    } else {
      return { q: `Calculate \\(\\sqrt{${answer}}\\).`, a: String(base), working: `\\(\\sqrt{${answer}} = ${base}\\)` };
    }
  } else if (diff === 3) {
    const fracs = [
      { n: 1, d: 2, sq: "\\frac{1}{4}", sqrtOf: "\\frac{1}{4}", sqrtAns: "\\frac{1}{2}" },
      { n: 2, d: 3, sq: "\\frac{4}{9}", sqrtOf: "\\frac{4}{9}", sqrtAns: "\\frac{2}{3}" },
      { n: 3, d: 4, sq: "\\frac{9}{16}", sqrtOf: "\\frac{9}{16}", sqrtAns: "\\frac{3}{4}" },
      { n: 3, d: 5, sq: "\\frac{9}{25}", sqrtOf: "\\frac{9}{25}", sqrtAns: "\\frac{3}{5}" }
    ];
    const f = fracs[rand(0, fracs.length - 1)];
    if (op === "square") {
      return {
        q: `Calculate \\(\\left(\\frac{${f.n}}{${f.d}}\\right)^2\\).`,
        a: `${f.n * f.n}/${f.d * f.d}`,
        working: `\\(\\left(\\frac{${f.n}}{${f.d}}\\right)^2 = \\frac{${f.n}^2}{${f.d}^2} = \\frac{${f.n * f.n}}{${f.d * f.d}}\\)`
      };
    } else {
      return {
        q: `Calculate \\(\\sqrt{${f.sq}}\\).`,
        a: `${f.n}/${f.d}`,
        working: `\\(\\sqrt{${f.sqrtOf}} = \\frac{\\sqrt{${f.n * f.n}}}{\\sqrt{${f.d * f.d}}} = \\frac{${f.n}}{${f.d}}\\)`
      };
    }
  } else {
    // diff 4: surd
    const vals = [
      { n: 2, simp: "\\sqrt{2} \\approx 1.41" },
      { n: 3, simp: "\\sqrt{3} \\approx 1.73" },
      { n: 5, simp: "\\sqrt{5} \\approx 2.24" },
      { n: 6, simp: "\\sqrt{6} \\approx 2.45" },
      { n: 7, simp: "\\sqrt{7} \\approx 2.65" },
      { n: 8, simp: "2\\sqrt{2} \\approx 2.83" },
      { n: 10, simp: "\\sqrt{10} \\approx 3.16" },
      { n: 11, simp: "\\sqrt{11} \\approx 3.32" }
    ];
    const v = vals[rand(0, vals.length - 1)];
    const approx = Math.round(Math.sqrt(v.n) * 100) / 100;
    return {
      q: `Calculate \\(\\sqrt{${v.n}}\\). Leave your answer as a surd or give a decimal rounded to 2 decimal places.`,
      a: String(approx),
      working: `\\(\\sqrt{${v.n}} = ${v.simp}\\)`
    };
  }
};

const _genNumericL1 = (diff) => {
  const core = _genLevel1(diff);
  const uid = makeUID("NUMERIC", 1, diff);
  return {
    uid, level: 1, diff, type: "NUMERIC",
    q: core.q,
    a: core.a,
    units: [],
    tolerance: 0.05,
    working: `<p><strong>Answer: \\(${core.a}\\)</strong></p><p>${core.working}</p>`,
    img: "", imgAlt: "", hint: "",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" }
  };
};

const _genMCQL1 = (diff) => {
  const uid = makeUID("MCQ", 1, diff);
  const core = _genLevel1(diff);

  // Build 3 distractors based on misconceptions
  const correct = parseFloat(core.a) || core.a;
  let options, correctOption;

  if (diff <= 2) {
    const cv = parseFloat(core.a);
    // Misconceptions: doubling instead of squaring; halving instead of sqrt; off-by-one
    const d1 = String(Math.round(cv * 2 * 100) / 100);      // doubles the value (× 2 not ²)
    const d2 = String(Math.round((cv + 1) * 100) / 100);    // off-by-one
    const d3 = String(Math.round(cv / 2 * 100) / 100);      // halves instead of sqrt
    const rawOpts = [core.a, d1, d2, d3];
    // Deduplicate in case any distractors collide with the correct answer
    const seen = new Set();
    const dedup = [];
    for (const o of rawOpts) {
      if (!seen.has(o)) { seen.add(o); dedup.push(o); }
    }
    while (dedup.length < 4) dedup.push(String(Math.round((cv + dedup.length) * 100) / 100));
    const opts = shuffle(dedup);
    correctOption = opts.indexOf(core.a);
    options = opts;

  } else if (diff === 3) {
    // Fractions — distractors based on common fraction misconceptions
    // core.a is e.g. "1/4" (squaring) or "1/2" (square root)
    // We need to reconstruct the fraction components from core.a
    const isSquareOp = core.q.includes("^2");  // squaring question
    // Extract numerator and denominator from core.a
    const parts = core.a.split("/");
    const n = parseInt(parts[0]), d = parseInt(parts[1]);

    let d1, d2, d3;
    if (isSquareOp) {
      // Correct: (n/d)² = n²/d²
      // Misconception 1: student adds instead of squaring → 2n/2d = n/d (same fraction, wrong operation)
      d1 = `${2 * n}/${2 * d}`;           // doubles numerator and denominator (adds instead of squaring)
      d2 = `${n * n}/${d}`;               // squares numerator only, forgets to square denominator
      d3 = `${n}/${d * d}`;               // squares denominator only, forgets numerator
    } else {
      // Square root question: correct = n/d
      // Misconception 1: takes sqrt of numerator only
      d1 = `${n}/${d * d}`;               // applies sqrt to numerator only, leaves denominator squared
      d2 = `${n * n}/${d}`;               // leaves numerator squared, forgets denominator
      d3 = `${d}/${n}`;                   // inverts the fraction (common slip)
    }
    const opts = shuffle([core.a, d1, d2, d3]);
    correctOption = opts.indexOf(core.a);
    options = opts;

  } else {
    // diff 4 — surds: distractors represent typical surd misconceptions
    // core.a is the decimal approximation e.g. "1.41" for √2
    const cv = parseFloat(core.a);
    // Extract the radicand from the question text (the number inside √)
    const match = core.q.match(/\\sqrt\{(\d+)\}/);
    const radicand = match ? parseInt(match[1]) : 2;

    // Misconception 1: student halves the radicand instead of taking sqrt (√n = n/2)
    const d1 = String(Math.round(radicand / 2 * 100) / 100);
    // Misconception 2: student subtracts 1 from radicand (√n ≈ n − 1 for small n)
    const d2 = String(radicand - 1);
    // Misconception 3: student squares instead of square-rooting (gives n²)
    const d3 = String(radicand * radicand);

    // Deduplicate against correct answer
    const rawOpts = [core.a, d1, d2, d3];
    const seen = new Set();
    const dedup = [];
    for (const o of rawOpts) {
      if (!seen.has(o)) { seen.add(o); dedup.push(o); }
    }
    while (dedup.length < 4) dedup.push(String(Math.round((cv + dedup.length * 0.5) * 100) / 100));
    const opts = shuffle(dedup.slice(0, 4));
    correctOption = opts.indexOf(core.a);
    options = opts;
  }

  return {
    uid, level: 1, diff, type: "MCQ",
    q: core.q,
    options,
    correctOption,
    working: `<p><strong>Correct answer: ${core.a}</strong></p><p>${core.working}</p>`,
    img: "", imgAlt: "", hint: "",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" }
  };
};

// ─── LEVEL 2: Identify the Hypotenuse ─────────────────────────────────
// Types: MCQ, MATCH only

const _triLabels2 = [
  { verts: ["P","Q","R"], raAt: "R" },
  { verts: ["A","B","C"], raAt: "C" },
  { verts: ["X","Y","Z"], raAt: "Y" },
  { verts: ["D","E","F"], raAt: "F" },
  { verts: ["M","N","O"], raAt: "N" }
];

const _genMCQL2 = (diff) => {
  const uid = makeUID("MCQ", 2, diff);
  const pool = getPool("l2mcq", _triLabels2);
  const tri = pickAndRemove(pool);
  const [v0, v1, v2] = tri.verts;
  const ra = tri.raAt;

  // The hypotenuse is opposite the right angle
  // Find the two vertices that are NOT the right angle vertex → those two endpoints make the hyp
  const hypVerts = tri.verts.filter(v => v !== ra);
  const hyp = hypVerts[0] + hypVerts[1];

  // Other sides
  const allSides = [v0 + v1, v1 + v2, v0 + v2];
  const wrongSides = allSides.filter(s => s !== hyp && s !== hyp[1] + hyp[0]);

  // Distractors: the two non-hypotenuse sides + one reversed hyp label
  const d1 = allSides.find(s => s !== hyp);
  const d2 = allSides.find(s => s !== hyp && s !== d1) || (hyp[1] + hyp[0]);
  const d3 = ra + hypVerts[0];

  const rawOpts = [hyp, d1 || d3, d2 || d3, d3];
  // Deduplicate
  const seen = new Set();
  const dedupOpts = [];
  for (const o of rawOpts) {
    const key = [o, o[1] + o[0]].sort().join("");
    if (!seen.has(key)) { seen.add(key); dedupOpts.push(o); }
    if (dedupOpts.length === 4) break;
  }
  while (dedupOpts.length < 4) dedupOpts.push("None of these");

  const shuffled = shuffle(dedupOpts);
  const correctOption = shuffled.indexOf(hyp);

  let qText, orient;
  if (diff === 1) {
    orient = "standard";
    qText = `In triangle ${v0}${v1}${v2}, the right angle is at ${ra}. Which side is the hypotenuse?`;
  } else if (diff === 2) {
    orient = "rotated";
    qText = `Triangle ${v0}${v1}${v2} has its right angle at ${ra}. The triangle is drawn in a non-standard orientation. Which side is the hypotenuse?`;
  } else if (diff === 3) {
    qText = `In the formula \\(a^2 + b^2 = c^2\\), which variable represents the hypotenuse?`;
    const opts = shuffle(["c", "a", "b", "a or b"]);
    const co = opts.indexOf("c");
    return {
      uid, level: 2, diff, type: "MCQ",
      q: qText,
      options: opts, correctOption: co,
      working: `<p><strong>Answer: c</strong></p><p>In Pythagoras' Theorem \\(a^2 + b^2 = c^2\\), <em>c</em> is always the hypotenuse — the side opposite the right angle.</p>`,
      img: "", imgAlt: "", hint: "The hypotenuse is opposite the right angle.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };
  } else {
    qText = `A right-angled triangle has vertices ${v0}, ${v1}, and ${v2}, with a right angle at ${ra}. Another triangle shares vertex ${ra} but has sides ${ra + hypVerts[0]} and ${ra + hypVerts[1]} as its legs. What is the hypotenuse of the <strong>first</strong> triangle?`;
    orient = "standard";
  }

  // Map the triangle's three vertices to the SVG slot positions correctly.
  // "standard" orientation: slot B = bottom-left = right-angle corner.
  // "rotated" orientation:  slot C = bottom-right = right-angle corner.
  // We always place the right-angle vertex in the slot that carries the RA marker,
  // and spread the other two vertices across the remaining slots.
  const nonRaVerts = tri.verts.filter(v => v !== ra);  // exactly 2 vertices
  let svgLabels;
  if ((orient || "standard") === "standard") {
    // slot A = top-left, slot B = bottom-left (RA), slot C = bottom-right
    svgLabels = { A: nonRaVerts[0], B: ra, C: nonRaVerts[1] };
  } else {
    // "rotated": slot A = top-right, slot B = bottom-left, slot C = bottom-right (RA)
    svgLabels = { A: nonRaVerts[0], B: nonRaVerts[1], C: ra };
  }

  const img = makeSVG({
    orientation: orient || "standard",
    sides: { a: "", b: "", c: "" },
    labels: svgLabels,
    showRightAngle: true,
    title: `Triangle ${v0}${v1}${v2} with right angle at ${ra}`
  });

  return {
    uid, level: 2, diff, type: "MCQ",
    q: qText,
    options: shuffled, correctOption,
    working: `<p><strong>Answer: ${hyp}</strong></p><p>The hypotenuse is always opposite the right angle. Since the right angle is at ${ra}, the hypotenuse is the side connecting the other two vertices: <strong>${hyp}</strong>.</p>`,
    img, imgAlt: `Triangle ${v0}${v1}${v2} with right angle at ${ra}`,
    hint: "The hypotenuse is always opposite the right angle marker.",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" }
  };
};

const _matchPairsL2 = [
  { left: "Hypotenuse", right: "Side opposite the right angle" },
  { left: "Right angle", right: "The 90° angle in a right-angled triangle" },
  { left: "Legs (shorter sides)", right: "The two sides that form the right angle" },
  { left: "Longest side", right: "Always the hypotenuse in a right-angled triangle" },
  { left: "Side adjacent to right angle", right: "One of the two shorter sides" },
  { left: "c in a² + b² = c²", right: "Hypotenuse" },
  { left: "a and b in a² + b² = c²", right: "The two shorter sides" }
];

const _genMatchL2 = (diff) => {
  const uid = makeUID("MATCH", 2, diff);
  const pool = getPool("l2match", _matchPairsL2);
  const numPairs = Math.min(4, pool.length);
  const chosen = [];
  for (let i = 0; i < numPairs; i++) chosen.push(pickAndRemove(pool));

  const rights = shuffle(chosen.map(p => p.right));
  const pairs = chosen.map(p => ({ left: p.left, right: p.right }));
  // Re-shuffle the pairs array itself
  const shuffledPairs = shuffle(pairs);

  return {
    uid, level: 2, diff, type: "MATCH",
    q: "Match each term on the left with its correct description on the right.",
    pairs: shuffledPairs,
    working: `<p>${shuffledPairs.map(p => `<strong>${p.left}</strong> → ${p.right}`).join("<br>")}</p>`,
    img: "", imgAlt: "", hint: "",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" }
  };
};

// ─── LEVEL 3: Recall and State the Theorem ────────────────────────────
// Types: MCQ, MATCH only

const _genMCQL3 = (diff) => {
  const uid = makeUID("MCQ", 3, diff);

  if (diff === 1) {
    const opts = shuffle(["c", "a", "b", "any side"]);
    const co = opts.indexOf("c");
    return {
      uid, level: 3, diff, type: "MCQ",
      q: "In the formula \\(a^2 + b^2 = c^2\\), which variable always represents the hypotenuse?",
      options: opts, correctOption: co,
      working: `<p><strong>Answer: c</strong></p><p>By convention, <em>c</em> is always the hypotenuse in Pythagoras' Theorem. <em>a</em> and <em>b</em> are the two shorter sides.</p>`,
      img: "", imgAlt: "", hint: "Look at which variable is on its own on the right-hand side.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };
  } else if (diff === 2) {
    const correct = "a² + b² = c²";
    const opts = shuffle([correct, "a + b = c", "a² − b² = c²", "a² × b² = c²"]);
    const co = opts.indexOf(correct);
    return {
      uid, level: 3, diff, type: "MCQ",
      q: "Which of the following is the correct statement of Pythagoras' Theorem?",
      options: opts, correctOption: co,
      working: `<p><strong>Answer: a² + b² = c²</strong></p><p>\\(a + b = c\\) is incorrect — you must <em>square</em> each side before adding.<br>\\(a^2 - b^2 = c^2\\) is a rearrangement used only when <em>c</em> and <em>a</em> are known.<br>\\(a^2 \\times b^2 = c^2\\) is entirely incorrect — the operation is addition, not multiplication.</p>`,
      img: "", imgAlt: "", hint: "The theorem involves squaring and adding — not multiplying or subtracting.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };
  } else if (diff === 3) {
    const correct = "Right-angled triangles only";
    const opts = shuffle([correct, "All triangles", "Isosceles triangles only", "Equilateral triangles only"]);
    const co = opts.indexOf(correct);
    return {
      uid, level: 3, diff, type: "MCQ",
      q: "For which type of triangle does Pythagoras' Theorem apply?",
      options: opts, correctOption: co,
      working: `<p><strong>Answer: Right-angled triangles only</strong></p><p>Pythagoras' Theorem applies <em>only</em> to right-angled triangles. The right angle must be confirmed before applying the formula. Applying it to non-right-angled triangles gives an incorrect result.</p>`,
      img: "", imgAlt: "", hint: "The theorem requires a specific type of angle in the triangle.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };
  } else {
    // diff 4: spelling
    const correctSpelling = "Pythagoras";
    const opts = shuffle([correctSpelling, "Pythagoraus", "Pythagoris", "Pythagorean"]);
    const co = opts.indexOf(correctSpelling);
    return {
      uid, level: 3, diff, type: "MCQ",
      q: "Which of the following is the correct spelling of the mathematician's name?",
      options: opts, correctOption: co,
      working: `<p><strong>Answer: Pythagoras</strong></p><p>The correct spelling is <strong>Pythagoras</strong>. Common errors include adding extra letters (Pythagoraus) or changing the vowels (Pythagoris). "Pythagorean" is an adjective, not the name itself.</p>`,
      img: "", imgAlt: "", hint: "Sound it out: Pyth-ag-or-as.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };
  }
};

const _matchPairsL3 = [
  { left: "a² + b² = c²", right: "Pythagoras' Theorem" },
  { left: "c", right: "Hypotenuse in a² + b² = c²" },
  { left: "Right-angled triangle", right: "Required for Pythagoras' Theorem to apply" },
  { left: "b² = c² − a²", right: "Rearrangement to find a shorter side" },
  { left: "If a² + b² = c², the triangle is…", right: "Right-angled" },
  { left: "Hypotenuse", right: "Always the longest side" },
  { left: "Converse of Pythagoras", right: "Tests whether a triangle is right-angled" }
];

const _genMatchL3 = (diff) => {
  const uid = makeUID("MATCH", 3, diff);
  const pool = getPool("l3match", _matchPairsL3);
  const numPairs = Math.min(4, pool.length);
  const chosen = [];
  for (let i = 0; i < numPairs; i++) chosen.push(pickAndRemove(pool));
  const pairs = shuffle(chosen.map(p => ({ left: p.left, right: p.right })));
  return {
    uid, level: 3, diff, type: "MATCH",
    q: "Match each expression or term on the left with its correct meaning on the right.",
    pairs,
    working: `<p>${pairs.map(p => `<strong>${p.left}</strong> → ${p.right}`).join("<br>")}</p>`,
    img: "", imgAlt: "", hint: "",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" }
  };
};

// ─── LEVEL 4: Find the Hypotenuse ─────────────────────────────────────
// Types: NUMERIC, SPOT_ERROR/STEP

const _genNumericL4 = (diff) => {
  const uid = makeUID("NUMERIC", 4, diff);
  let a, b, c, qText, aStr, workStr, imgData, imgAlt, units;

  if (diff === 1) {
    // Pythagorean triple → clean integer hyp
    const triple = TRIPLES[rand(0, TRIPLES.length - 1)];
    const scale = rand(1, 3);
    a = triple[0] * scale; b = triple[1] * scale; c = triple[2] * scale;
    aStr = String(c);
    units = ["cm"];
    qText = `A right-angled triangle has shorter sides of ${a} cm and ${b} cm. Find the length of the hypotenuse.`;
    workStr = `<p><strong>Answer: \\(c = ${c}\\) cm</strong></p>
<p>\\(c^2 = a^2 + b^2\\)<br>
\\(c^2 = ${a}^2 + ${b}^2\\)<br>
\\(c^2 = ${a*a} + ${b*b}\\)<br>
\\(c^2 = ${a*a + b*b}\\)<br>
\\(c = \\sqrt{${a*a + b*b}} = ${c}\\) cm</p>`;
    // SVG "standard" orientation: slot b = left vertical leg (AB), slot a = bottom horizontal leg (BC)
    // Assign the larger value to the horizontal (longer-looking) leg for visual clarity
    const hLeg = Math.max(a, b), vLeg = Math.min(a, b);
    imgData = makeSVG({ orientation: "standard", sides: { b: `${vLeg} cm`, a: `${hLeg} cm`, c: "?" }, labels: { A: "A", B: "B", C: "C" }, title: `Right triangle with legs ${a} and ${b}` });
    imgAlt = `Right-angled triangle with legs ${a} cm and ${b} cm, hypotenuse unknown`;
  } else if (diff === 2) {
    // Integer inputs, decimal hyp, 1 d.p.
    a = rand(3, 12); b = rand(3, 12);
    c = Math.sqrt(a*a + b*b);
    aStr = c.toFixed(1);
    units = ["cm"];
    qText = `A right-angled triangle has shorter sides of ${a} cm and ${b} cm. Find the hypotenuse, giving your answer to 1 decimal place.`;
    workStr = `<p><strong>Answer: \\(c \\approx ${aStr}\\) cm</strong></p>
<p>\\(c^2 = ${a}^2 + ${b}^2\\)<br>
\\(c^2 = ${a*a} + ${b*b}\\)<br>
\\(c^2 = ${a*a + b*b}\\)<br>
\\(c = \\sqrt{${a*a + b*b}} \\approx ${aStr}\\) cm</p>`;
    const hLeg2 = Math.max(a, b), vLeg2 = Math.min(a, b);
    imgData = makeSVG({ orientation: "standard", sides: { b: `${vLeg2} cm`, a: `${hLeg2} cm`, c: "?" }, labels: { A: "A", B: "B", C: "C" }, title: `Right triangle legs ${a} ${b}` });
    imgAlt = `Right-angled triangle with legs ${a} cm and ${b} cm`;
  } else if (diff === 3) {
    // Decimal inputs, 2 d.p.
    a = randF(2, 8, 1); b = randF(2, 8, 1);
    c = Math.sqrt(a*a + b*b);
    aStr = c.toFixed(2);
    units = ["m"];
    qText = `A right-angled triangle has shorter sides of ${a} m and ${b} m. Calculate the length of the hypotenuse, giving your answer to 2 decimal places.`;
    workStr = `<p><strong>Answer: \\(c \\approx ${aStr}\\) m</strong></p>
<p>\\(c^2 = ${a}^2 + ${b}^2\\)<br>
\\(c^2 = ${a*a} + ${b*b}\\)<br>
\\(c^2 = ${Math.round((a*a + b*b)*100)/100}\\)<br>
\\(c = \\sqrt{${Math.round((a*a + b*b)*100)/100}} \\approx ${aStr}\\) m</p>`;
    const hLeg3 = Math.max(a, b), vLeg3 = Math.min(a, b);
    imgData = makeSVG({ orientation: "standard", sides: { b: `${vLeg3} m`, a: `${hLeg3} m`, c: "?" }, labels: { A: "A", B: "B", C: "C" }, title: `Right triangle decimal legs` });
    imgAlt = `Right-angled triangle with legs ${a} m and ${b} m`;
  } else {
    // diff 4: one input is a simple surd
    const surdPairs = [
      { sa: "\\sqrt{3}", sv: 3, sb: "\\sqrt{5}", bv: 5, c2: 8, cStr: "2\\sqrt{2}", cApprox: (2*Math.SQRT2).toFixed(2) },
      { sa: "\\sqrt{2}", sv: 2, sb: "\\sqrt{7}", bv: 7, c2: 9, cStr: "3", cApprox: "3" },
      { sa: "\\sqrt{5}", sv: 5, sb: "\\sqrt{11}", bv: 11, c2: 16, cStr: "4", cApprox: "4" },
      { sa: "\\sqrt{3}", sv: 3, sb: "\\sqrt{13}", bv: 13, c2: 16, cStr: "4", cApprox: "4" }
    ];
    const sp = surdPairs[rand(0, surdPairs.length - 1)];
    aStr = sp.cApprox;
    units = [];
    qText = `A right-angled triangle has shorter sides \\(${sp.sa}\\) and \\(${sp.sb}\\). Find the exact length of the hypotenuse in simplified surd form.`;
    workStr = `<p><strong>Answer: \\(${sp.cStr}\\)</strong></p>
<p>\\(c^2 = (${sp.sa})^2 + (${sp.sb})^2\\)<br>
\\(c^2 = ${sp.sv} + ${sp.bv}\\)<br>
\\(c^2 = ${sp.c2}\\)<br>
\\(c = \\sqrt{${sp.c2}} = ${sp.cStr}\\)</p>`;
    imgData = "";
    imgAlt = "";
  }

  return {
    uid, level: 4, diff, type: "NUMERIC",
    q: qText, a: aStr, units: units || [], tolerance: 0.05,
    working: workStr,
    img: imgData || "", imgAlt: imgAlt || "", hint: "Use \\(c^2 = a^2 + b^2\\), then take the square root.",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" }
  };
};

const _genSpotStepL4 = (diff) => {
  const uid = makeUID("SPOT_ERROR/STEP", 4, diff);
  // Generate a triangle and introduce exactly one error in the working
  const triple = TRIPLES[rand(0, TRIPLES.length - 1)];
  const a = triple[0], b = triple[1], c = triple[2];
  const a2 = a * a, b2 = b * b, c2 = a2 + b2;

  // Misconception 1: adds without squaring (a + b instead of a²+b²)
  // Misconception 2: squares and adds but forgets sqrt
  // Misconception 3: wrong arithmetic in squaring step
  const errType = rand(1, 3);
  let steps, errorExplanation;

  if (errType === 1) {
    // Error: adds sides without squaring
    const wrongC2 = a + b;
    steps = [
      { id: 1, text: `\\(c^2 = a^2 + b^2\\)`, isError: false },
      { id: 2, text: `\\(c^2 = ${a} + ${b}\\)`, isError: true },
      { id: 3, text: `\\(c^2 = ${wrongC2}\\)`, isError: false },
      { id: 4, text: `\\(c = \\sqrt{${wrongC2}} \\approx ${Math.sqrt(wrongC2).toFixed(1)}\\)`, isError: false }
    ];
    errorExplanation = `Step 2 is wrong. The theorem requires <em>squaring</em> each side: \\(${a}^2 = ${a2}\\) and \\(${b}^2 = ${b2}\\), not simply \\(${a} + ${b}\\).`;
  } else if (errType === 2) {
    // Error: omits square root at end
    steps = [
      { id: 1, text: `\\(c^2 = a^2 + b^2\\)`, isError: false },
      { id: 2, text: `\\(c^2 = ${a}^2 + ${b}^2\\)`, isError: false },
      { id: 3, text: `\\(c^2 = ${a2} + ${b2}\\)`, isError: false },
      { id: 4, text: `\\(c^2 = ${c2}\\)`, isError: false },
      { id: 5, text: `\\(c = ${c2}\\)`, isError: true }
    ];
    errorExplanation = `Step 5 is wrong. After finding \\(c^2 = ${c2}\\), the student must take the square root: \\(c = \\sqrt{${c2}} = ${c}\\).`;
  } else {
    // Error: wrong arithmetic in squaring step
    const wrongA2 = a * 2; // doubles instead of squares
    steps = [
      { id: 1, text: `\\(c^2 = a^2 + b^2\\)`, isError: false },
      { id: 2, text: `\\(c^2 = ${a}^2 + ${b}^2\\)`, isError: false },
      { id: 3, text: `\\(c^2 = ${wrongA2} + ${b2}\\)`, isError: true },
      { id: 4, text: `\\(c^2 = ${wrongA2 + b2}\\)`, isError: false },
      { id: 5, text: `\\(c = \\sqrt{${wrongA2 + b2}} \\approx ${Math.sqrt(wrongA2 + b2).toFixed(1)}\\)`, isError: false }
    ];
    errorExplanation = `Step 3 is wrong. \\(${a}^2 = ${a2}\\), not \\(${wrongA2}\\). The student has doubled ${a} instead of squaring it.`;
  }

  return {
    uid, level: 4, diff, type: "SPOT_ERROR", subtype: "STEP",
    q: `A student is finding the hypotenuse of a right-angled triangle with shorter sides ${a} cm and ${b} cm. Spot the error in their working.`,
    steps,
    working: `<p><strong>Error identified:</strong> ${errorExplanation}</p>
<p><strong>Correct working:</strong><br>
\\(c^2 = ${a}^2 + ${b}^2 = ${a2} + ${b2} = ${c2}\\)<br>
\\(c = \\sqrt{${c2}} = ${c}\\) cm</p>`,
    img: "", imgAlt: "", hint: "Check each step carefully — is the squaring correct? Is the final square root taken?",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" }
  };
};

// ─── LEVEL 5: Find a Shorter Side ─────────────────────────────────────
// Types: NUMERIC, SPOT_ERROR/STEP

const _genNumericL5 = (diff) => {
  const uid = makeUID("NUMERIC", 5, diff);
  let a, b, c, aStr, qText, workStr, imgData, imgAlt;

  if (diff === 1) {
    // Pythagorean triple → clean integer shorter side
    const triple = TRIPLES[rand(0, TRIPLES.length - 1)];
    const scale = rand(1, 2);
    a = triple[0] * scale; b = triple[1] * scale; c = triple[2] * scale;
    aStr = String(b);
    qText = `A right-angled triangle has a hypotenuse of ${c} cm and one shorter side of ${a} cm. Find the length of the missing shorter side.`;
    workStr = `<p><strong>Answer: \\(b = ${b}\\) cm</strong></p>
<p>\\(b^2 = c^2 - a^2\\)<br>
\\(b^2 = ${c}^2 - ${a}^2\\)<br>
\\(b^2 = ${c*c} - ${a*a}\\)<br>
\\(b^2 = ${b*b}\\)<br>
\\(b = \\sqrt{${b*b}} = ${b}\\) cm</p>`;
    // SVG: slot b = left vertical, slot a = bottom horizontal, slot c = hypotenuse
    // Place known leg on vertical (b slot), unknown on horizontal (a slot), hyp on c slot
    imgData = makeSVG({ orientation: "standard", sides: { b: `${a} cm`, a: "?", c: `${c} cm` }, labels: { A: "A", B: "B", C: "C" }, title: `Right triangle hyp ${c} leg ${a}` });
    imgAlt = `Right-angled triangle with hypotenuse ${c} cm, one leg ${a} cm, other leg unknown`;
  } else if (diff === 2) {
    // Integer inputs, decimal answer 1 d.p.
    c = rand(8, 20); a = rand(3, c - 2);
    b = Math.sqrt(c*c - a*a);
    aStr = b.toFixed(1);
    qText = `A right-angled triangle has a hypotenuse of ${c} cm and one shorter side of ${a} cm. Find the missing shorter side, to 1 decimal place.`;
    workStr = `<p><strong>Answer: \\(b \\approx ${aStr}\\) cm</strong></p>
<p>\\(b^2 = ${c}^2 - ${a}^2\\)<br>
\\(b^2 = ${c*c} - ${a*a}\\)<br>
\\(b^2 = ${c*c - a*a}\\)<br>
\\(b = \\sqrt{${c*c - a*a}} \\approx ${aStr}\\) cm</p>`;
    // "standard" orientation: slot b = left vertical (known leg), slot a = bottom horizontal (unknown), slot c = hyp
    imgData = makeSVG({ orientation: "standard", sides: { b: `${a} cm`, a: "?", c: `${c} cm` }, labels: { A: "A", B: "B", C: "C" }, title: `Right triangle hyp ${c}` });
    imgAlt = `Right-angled triangle with hypotenuse ${c} cm and one leg ${a} cm`;
  } else if (diff === 3) {
    // Decimal inputs, 2 d.p.
    c = randF(6, 15, 1); a = randF(2, c * 0.8, 1);
    b = Math.sqrt(c*c - a*a);
    aStr = b.toFixed(2);
    qText = `A right-angled triangle has a hypotenuse of ${c} m and one shorter side of ${a} m. Calculate the missing shorter side, to 2 decimal places.`;
    workStr = `<p><strong>Answer: \\(b \\approx ${aStr}\\) m</strong></p>
<p>\\(b^2 = ${c}^2 - ${a}^2\\)<br>
\\(b^2 = ${Math.round(c*c*100)/100} - ${Math.round(a*a*100)/100}\\)<br>
\\(b^2 = ${Math.round((c*c - a*a)*100)/100}\\)<br>
\\(b = \\sqrt{${Math.round((c*c - a*a)*100)/100}} \\approx ${aStr}\\) m</p>`;
    // slot b = left vertical (known leg), slot a = bottom horizontal (unknown), slot c = hyp
    imgData = makeSVG({ orientation: "standard", sides: { b: `${a} m`, a: "?", c: `${c} m` }, labels: { A: "A", B: "B", C: "C" }, title: `Right triangle decimal` });
    imgAlt = `Right-angled triangle with hypotenuse ${c} m and leg ${a} m`;
  } else {
    // diff 4: surd input
    const surdCases = [
      { cSurd: "\\sqrt{20}", cVal: Math.sqrt(20), aSurd: "2", aVal: 2, b2: 16, bStr: "4", bApprox: "4" },
      { cSurd: "\\sqrt{50}", cVal: Math.sqrt(50), aSurd: "5", aVal: 5, b2: 25, bStr: "5", bApprox: "5" },
      { cSurd: "\\sqrt{13}", cVal: Math.sqrt(13), aSurd: "2", aVal: 2, b2: 9, bStr: "3", bApprox: "3" },
      { cSurd: "\\sqrt{29}", cVal: Math.sqrt(29), aSurd: "\\sqrt{5}", aVal: Math.sqrt(5), b2: 24, bStr: "2\\sqrt{6}", bApprox: (2*Math.sqrt(6)).toFixed(2) }
    ];
    const sc = surdCases[rand(0, surdCases.length - 1)];
    aStr = sc.bApprox;
    qText = `A right-angled triangle has hypotenuse \\(${sc.cSurd}\\) and one shorter side \\(${sc.aSurd}\\). Find the exact length of the missing shorter side.`;
    workStr = `<p><strong>Answer: \\(b = ${sc.bStr}\\)</strong></p>
<p>\\(b^2 = c^2 - a^2\\)<br>
\\(b^2 = (${sc.cSurd})^2 - (${sc.aSurd})^2\\)<br>
\\(b^2 = ${sc.cVal * sc.cVal} - ${sc.aVal * sc.aVal}\\)<br>
\\(b^2 = ${sc.b2}\\)<br>
\\(b = \\sqrt{${sc.b2}} = ${sc.bStr}\\)</p>`;
    imgData = "";
    imgAlt = "";
  }

  return {
    uid, level: 5, diff, type: "NUMERIC",
    q: qText, a: aStr, units: diff <= 3 ? ["cm", "m"] : [], tolerance: 0.05,
    working: workStr,
    img: imgData || "", imgAlt: imgAlt || "",
    hint: "Use \\(b^2 = c^2 - a^2\\). Remember to subtract, not add.",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" }
  };
};

const _genSpotStepL5 = (diff) => {
  const uid = makeUID("SPOT_ERROR/STEP", 5, diff);
  const triple = TRIPLES[rand(0, TRIPLES.length - 1)];
  const c = triple[2], a = triple[0], b = triple[1];
  const c2 = c * c, a2 = a * a, b2 = b * b;

  // Misconceptions for Level 5:
  // 1. Adds instead of subtracts (b² = c² + a²)
  // 2. Subtracts correctly but forgets sqrt
  // 3. Misidentifies hypotenuse (uses a as hyp)
  const errType = rand(1, 3);
  let steps, errorExplanation;

  if (errType === 1) {
    const wrongB2 = c2 + a2;
    steps = [
      { id: 1, text: `\\(b^2 = c^2 - a^2\\)`, isError: false },
      { id: 2, text: `\\(b^2 = ${c}^2 - ${a}^2\\)`, isError: false },
      { id: 3, text: `\\(b^2 = ${c2} + ${a2}\\)`, isError: true },
      { id: 4, text: `\\(b^2 = ${wrongB2}\\)`, isError: false },
      { id: 5, text: `\\(b = \\sqrt{${wrongB2}} \\approx ${Math.sqrt(wrongB2).toFixed(1)}\\)`, isError: false }
    ];
    errorExplanation = `Step 3 is wrong. To find a shorter side, you must <em>subtract</em>: \\(b^2 = ${c2} - ${a2} = ${b2}\\), not add.`;
  } else if (errType === 2) {
    steps = [
      { id: 1, text: `\\(b^2 = c^2 - a^2\\)`, isError: false },
      { id: 2, text: `\\(b^2 = ${c}^2 - ${a}^2\\)`, isError: false },
      { id: 3, text: `\\(b^2 = ${c2} - ${a2}\\)`, isError: false },
      { id: 4, text: `\\(b^2 = ${b2}\\)`, isError: false },
      { id: 5, text: `\\(b = ${b2}\\)`, isError: true }
    ];
    errorExplanation = `Step 5 is wrong. Having found \\(b^2 = ${b2}\\), the student must take the square root: \\(b = \\sqrt{${b2}} = ${b}\\).`;
  } else {
    // Treats a shorter side as hypotenuse
    const wrongB2 = a2 - c2; // This will be negative, showing the error clearly
    steps = [
      { id: 1, text: `\\(b^2 = a^2 - c^2\\)`, isError: true },
      { id: 2, text: `\\(b^2 = ${a}^2 - ${c}^2\\)`, isError: false },
      { id: 3, text: `\\(b^2 = ${a2} - ${c2}\\)`, isError: false },
      { id: 4, text: `\\(b^2 = ${a2 - c2}\\)`, isError: false }
    ];
    errorExplanation = `Step 1 is wrong. The hypotenuse is ${c} cm (the longest side), so the formula should be \\(b^2 = c^2 - a^2 = ${c2} - ${a2} = ${b2}\\). The student has incorrectly used ${a} as the hypotenuse.`;
  }

  return {
    uid, level: 5, diff, type: "SPOT_ERROR", subtype: "STEP",
    q: `A student finds the missing shorter side of a right-angled triangle with hypotenuse ${c} cm and one side ${a} cm. Spot the error.`,
    steps,
    working: `<p><strong>Error:</strong> ${errorExplanation}</p>
<p><strong>Correct answer:</strong> \\(b = \\sqrt{${c2} - ${a2}} = \\sqrt{${b2}} = ${b}\\) cm</p>`,
    img: "", imgAlt: "", hint: "When finding a shorter side, remember to subtract — and check which side is the hypotenuse.",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" }
  };
};

// ─── LEVEL 6: Pythagoras in Non-Right Triangles ───────────────────────
// Types: NUMERIC, EXPLANATION

const _genNumericL6 = (diff) => {
  const uid = makeUID("NUMERIC", 6, diff);

  if (diff === 1) {
    // Equilateral triangle, integer side — find perpendicular height
    const s = [6, 8, 10, 12, 14][rand(0, 4)];
    const halfBase = s / 2;
    const h = Math.sqrt(s * s - halfBase * halfBase);
    const hStr = h.toFixed(2);
    const imgData = makeSVG({
      orientation: "isosceles",
      sides: { a: `${s} cm`, b: `${s} cm`, c: `${s} cm` },
      labels: { A: "A", B: "B", C: "C" },
      extraLines: [{ x1: 110, y1: 15, x2: 110, y2: 140 }],
      title: `Equilateral triangle side ${s}`
    });
    return {
      uid, level: 6, diff, type: "NUMERIC",
      q: `An equilateral triangle has side length ${s} cm. Calculate its perpendicular height. Give your answer to 2 decimal places.`,
      a: hStr, units: ["cm"], tolerance: 0.05,
      working: `<p><strong>Answer: \\(h \\approx ${hStr}\\) cm</strong></p>
<p>Draw the perpendicular height from the apex to the midpoint of the base. This creates two right-angled triangles.<br>
The base of each right triangle = \\(\\frac{${s}}{2} = ${halfBase}\\) cm<br>
Using Pythagoras: \\(h^2 = ${s}^2 - ${halfBase}^2\\)<br>
\\(h^2 = ${s*s} - ${halfBase*halfBase}\\)<br>
\\(h^2 = ${s*s - halfBase*halfBase}\\)<br>
\\(h = \\sqrt{${s*s - halfBase*halfBase}} \\approx ${hStr}\\) cm</p>`,
      img: imgData,
      imgAlt: `Equilateral triangle with side ${s} cm and altitude drawn`,
      hint: "Draw the altitude — it bisects the base and creates two right-angled triangles.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };
  } else if (diff === 2) {
    // Isosceles triangle, decimal sides — find altitude
    const eqSide = randF(6, 12, 1);
    const base = randF(4, eqSide * 1.5, 1);
    const halfBase = Math.round(base / 2 * 10) / 10;
    const h = Math.sqrt(eqSide * eqSide - halfBase * halfBase);
    const hStr = h.toFixed(2);
    return {
      uid, level: 6, diff, type: "NUMERIC",
      q: `An isosceles triangle has equal sides of ${eqSide} cm and a base of ${base} cm. Calculate the perpendicular height of the triangle. Give your answer to 2 decimal places.`,
      a: hStr, units: ["cm"], tolerance: 0.05,
      working: `<p><strong>Answer: \\(h \\approx ${hStr}\\) cm</strong></p>
<p>The altitude bisects the base: half-base = \\(\\frac{${base}}{2} = ${halfBase}\\) cm<br>
\\(h^2 = ${eqSide}^2 - ${halfBase}^2\\)<br>
\\(h^2 = ${Math.round(eqSide*eqSide*100)/100} - ${Math.round(halfBase*halfBase*100)/100}\\)<br>
\\(h^2 = ${Math.round((eqSide*eqSide - halfBase*halfBase)*100)/100}\\)<br>
\\(h \\approx ${hStr}\\) cm</p>`,
      img: "", imgAlt: "",
      hint: "The altitude of an isosceles triangle bisects the base. Use that half-base as one leg.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };
  } else if (diff === 3) {
    // Scalene: altitude splits base into known + unknown segments; find slant side
    const h = rand(6, 12);
    const seg1 = rand(3, 8);
    const slant1 = Math.round(Math.sqrt(h*h + seg1*seg1) * 10) / 10;
    const seg2 = rand(3, 8);
    const slant2 = Math.sqrt(h*h + seg2*seg2);
    const slant2Str = slant2.toFixed(1);
    return {
      uid, level: 6, diff, type: "NUMERIC",
      q: `A triangle has a perpendicular height of ${h} cm. The altitude divides the base into two segments of ${seg1} cm and ${seg2} cm. One slant side is ${slant1} cm. Find the length of the other slant side, to 1 decimal place.`,
      a: slant2Str, units: ["cm"], tolerance: 0.05,
      working: `<p><strong>Answer: \\(${slant2Str}\\) cm</strong></p>
<p>The altitude creates two right-angled triangles.<br>
For the second right triangle: base = ${seg2} cm, height = ${h} cm<br>
\\(\\text{slant}^2 = ${h}^2 + ${seg2}^2 = ${h*h} + ${seg2*seg2} = ${h*h + seg2*seg2}\\)<br>
\\(\\text{slant} = \\sqrt{${h*h + seg2*seg2}} \\approx ${slant2Str}\\) cm</p>`,
      img: "", imgAlt: "",
      hint: "The altitude creates two separate right-angled triangles. Use Pythagoras in the second one.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };
  } else {
    // diff 4: kite — use diagonals to find side
    const d1half = rand(3, 8), d2half = rand(3, 8);
    const side = Math.sqrt(d1half*d1half + d2half*d2half);
    const sideStr = side.toFixed(2);
    return {
      uid, level: 6, diff, type: "NUMERIC",
      q: `A kite has diagonals of length ${d1half * 2} cm and ${d2half * 2} cm. The diagonals bisect each other at right angles. Find the length of one side of the kite, to 2 decimal places.`,
      a: sideStr, units: ["cm"], tolerance: 0.05,
      working: `<p><strong>Answer: \\(${sideStr}\\) cm</strong></p>
<p>The diagonals bisect at right angles, creating right-angled triangles with legs ${d1half} cm and ${d2half} cm.<br>
\\(\\text{side}^2 = ${d1half}^2 + ${d2half}^2 = ${d1half*d1half} + ${d2half*d2half} = ${d1half*d1half + d2half*d2half}\\)<br>
\\(\\text{side} = \\sqrt{${d1half*d1half + d2half*d2half}} \\approx ${sideStr}\\) cm</p>`,
      img: "", imgAlt: "",
      hint: "The diagonals of a kite cross at right angles — look for the right-angled triangles formed.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };
  }
};

const _genExplanationL6 = (diff) => {
  const uid = makeUID("EXPLANATION", 6, diff);
  const questions = [
    {
      diff: 1,
      q: "Explain why you need to draw a perpendicular height before you can use Pythagoras' Theorem in an equilateral triangle.",
      modelAnswer: "Pythagoras' Theorem only applies to right-angled triangles. An equilateral triangle does not contain a right angle. By drawing the perpendicular height from one vertex to the opposite side, we create two right-angled triangles. We can then apply Pythagoras' Theorem to either of these right-angled triangles to find the height.",
      markingChecklist: [
        "States that Pythagoras' Theorem only applies to right-angled triangles",
        "Explains that the altitude creates two right-angled triangles",
        "Identifies the height as the unknown side to be found"
      ]
    },
    {
      diff: 2,
      q: "An isosceles triangle has equal sides of 10 cm and a base of 12 cm. Explain the steps you would use to find its perpendicular height, without performing the calculation.",
      modelAnswer: "First, draw the perpendicular height from the apex to the midpoint of the base. Because the triangle is isosceles, the altitude bisects the base into two equal halves of 6 cm each. This creates a right-angled triangle with hypotenuse 10 cm and one shorter side 6 cm. We can then use the rearrangement b² = c² − a² to find the height: h² = 10² − 6² = 100 − 36 = 64, so h = 8 cm.",
      markingChecklist: [
        "States that the altitude bisects the base (giving half-base = 6 cm)",
        "Identifies that a right-angled triangle is formed",
        "Correctly applies b² = c² − a² with the right values"
      ]
    },
    {
      diff: 3,
      q: "Explain why the converse of Pythagoras' Theorem can be used to check whether a triangle is right-angled. Give an example.",
      modelAnswer: "The converse of Pythagoras' Theorem states that if the square of the longest side equals the sum of the squares of the other two sides (i.e. a² + b² = c²), then the triangle must be right-angled. For example, for a triangle with sides 5, 12, and 13: 5² + 12² = 25 + 144 = 169 = 13². Since the equation holds, the triangle is right-angled.",
      markingChecklist: [
        "Correctly states the converse: if a² + b² = c² then the triangle is right-angled",
        "Identifies c as the longest side",
        "Provides a correct numerical example"
      ]
    }
  ];
  const q = questions.find(x => x.diff === diff) || questions[0];
  return {
    uid, level: 6, diff, type: "EXPLANATION",
    q: q.q,
    modelAnswer: q.modelAnswer,
    markingChecklist: q.markingChecklist,
    working: "",
    img: "", imgAlt: "", hint: "",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" }
  };
};

// ─── LEVEL 7: Multi-Step and Algebraic Problems ───────────────────────
// Types: NUMERIC, SPOT_ERROR/VALUE, EXPLANATION

const _genNumericL7 = (diff) => {
  const uid = makeUID("NUMERIC", 7, diff);

  if (diff === 1) {
    // Two-step: diagonal of rectangle, then use as side
    const w = rand(3, 8), h = rand(3, 8);
    const diag = Math.sqrt(w*w + h*h);
    const extra = rand(2, 6);
    const final = Math.sqrt(diag*diag + extra*extra);
    const finalStr = final.toFixed(2);
    return {
      uid, level: 7, diff, type: "NUMERIC",
      q: `A rectangle is ${w} m wide and ${h} m tall. A diagonal of the rectangle forms one leg of a second right-angled triangle whose other leg is ${extra} m. Find the hypotenuse of the second triangle, to 2 decimal places.`,
      a: finalStr, units: ["m"], tolerance: 0.05,
      working: `<p><strong>Answer: \\(${finalStr}\\) m</strong></p>
<p><strong>Step 1:</strong> Find the diagonal of the rectangle.<br>
\\(d^2 = ${w}^2 + ${h}^2 = ${w*w} + ${h*h} = ${w*w + h*h}\\)<br>
\\(d = \\sqrt{${w*w + h*h}} \\approx ${diag.toFixed(4)}\\) m<br>
<strong>Step 2:</strong> Use \\(d\\) as a leg in the second triangle.<br>
\\(c^2 = d^2 + ${extra}^2 = ${w*w + h*h} + ${extra*extra} = ${w*w + h*h + extra*extra}\\)<br>
\\(c = \\sqrt{${w*w + h*h + extra*extra}} \\approx ${finalStr}\\) m</p>`,
      img: "", imgAlt: "",
      hint: "Find the diagonal of the rectangle first, then use it as a side in the second triangle.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };
  } else if (diff === 2) {
    // Algebraic: sides x and x+k, hypotenuse given → solve quadratic
    // Use cases where the quadratic works out neatly
    const cases = [
      { k: 2, hyp: 10, x: 6 },   // x² + (x+2)² = 100 → 2x²+4x+4=100 → x²+2x-48=0 → (x+8)(x-6)=0 → x=6
      { k: 4, hyp: 20, x: 12 },  // x² + (x+4)² = 400 → approx: picks clean solution
      { k: 7, hyp: 13, x: 5 }    // 5² + 12² = 169 = 13²
    ];
    const c = cases[rand(0, cases.length - 1)];
    return {
      uid, level: 7, diff, type: "NUMERIC",
      q: `The two shorter sides of a right-angled triangle are \\(x\\) cm and \\((x + ${c.k})\\) cm. The hypotenuse is ${c.hyp} cm. Find the value of \\(x\\).`,
      a: String(c.x), units: [], tolerance: 0,
      working: `<p><strong>Answer: \\(x = ${c.x}\\)</strong></p>
<p>Using Pythagoras' Theorem:<br>
\\(x^2 + (x + ${c.k})^2 = ${c.hyp}^2\\)<br>
\\(x^2 + x^2 + ${2*c.k}x + ${c.k*c.k} = ${c.hyp*c.hyp}\\)<br>
\\(2x^2 + ${2*c.k}x + ${c.k*c.k - c.hyp*c.hyp} = 0\\)<br>
Solve: \\(x = ${c.x}\\) (reject the negative root — length must be positive)</p>`,
      img: "", imgAlt: "",
      hint: "Form a quadratic equation, expand, and solve. Reject any negative solution.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };
  } else if (diff === 3) {
    // Coordinate geometry: distance between two points
    const x1 = rand(1, 6), y1 = rand(1, 6), x2 = rand(7, 12), y2 = rand(7, 12);
    const dx = x2 - x1, dy = y2 - y1;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const distStr = dist.toFixed(2);
    return {
      uid, level: 7, diff, type: "NUMERIC",
      q: `Calculate the distance between points \\(A(${x1}, ${y1})\\) and \\(B(${x2}, ${y2})\\). Give your answer to 2 decimal places.`,
      a: distStr, units: ["units"], tolerance: 0.05,
      working: `<p><strong>Answer: \\(${distStr}\\) units</strong></p>
<p>\\(\\text{horizontal distance} = ${x2} - ${x1} = ${dx}\\)<br>
\\(\\text{vertical distance} = ${y2} - ${y1} = ${dy}\\)<br>
\\(AB^2 = ${dx}^2 + ${dy}^2 = ${dx*dx} + ${dy*dy} = ${dx*dx + dy*dy}\\)<br>
\\(AB = \\sqrt{${dx*dx + dy*dy}} \\approx ${distStr}\\) units</p>`,
      img: "", imgAlt: "",
      hint: "Find the horizontal and vertical distances between the two points, then apply Pythagoras.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };
  } else {
    // diff 4: two connected triangles sharing a common side
    const triple1 = TRIPLES[rand(0, TRIPLES.length - 1)];
    const shared = triple1[2]; // hyp of first = leg of second
    const extra = TRIPLES.find(t => t[0] === shared || t[1] === shared) || [shared, rand(3,8), 0];
    const legB = extra[extra[0] === shared ? 1 : 0];
    const finalHyp = Math.sqrt(shared*shared + legB*legB);
    const finalStr = finalHyp.toFixed(2);
    return {
      uid, level: 7, diff, type: "NUMERIC",
      q: `Two right-angled triangles share a common side. The first triangle has shorter sides ${triple1[0]} cm and ${triple1[1]} cm. Its hypotenuse is the shorter leg of the second triangle, which also has a leg of ${legB} cm. Find the hypotenuse of the second triangle, to 2 decimal places.`,
      a: finalStr, units: ["cm"], tolerance: 0.05,
      working: `<p><strong>Answer: \\(${finalStr}\\) cm</strong></p>
<p><strong>Step 1:</strong> Find the shared side (hypotenuse of triangle 1).<br>
\\(c_1^2 = ${triple1[0]}^2 + ${triple1[1]}^2 = ${triple1[0]*triple1[0]} + ${triple1[1]*triple1[1]} = ${triple1[0]*triple1[0]+triple1[1]*triple1[1]}\\)<br>
\\(c_1 = \\sqrt{${triple1[0]*triple1[0]+triple1[1]*triple1[1]}} = ${shared}\\) cm<br>
<strong>Step 2:</strong> Find the hypotenuse of triangle 2.<br>
\\(c_2^2 = ${shared}^2 + ${legB}^2 = ${shared*shared} + ${legB*legB} = ${shared*shared + legB*legB}\\)<br>
\\(c_2 = \\sqrt{${shared*shared + legB*legB}} \\approx ${finalStr}\\) cm</p>`,
      img: "", imgAlt: "",
      hint: "Find the first hypotenuse, then use it as a leg in the second triangle.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };
  }
};

const _genSpotValueL7 = (diff) => {
  const uid = makeUID("SPOT_ERROR/VALUE", 7, diff);
  const triple = TRIPLES[rand(0, TRIPLES.length - 1)];
  const a = triple[0], b = triple[1], c = triple[2];

  // Error types for VALUE: wrong squaring, wrong arithmetic, wrong final sqrt
  const errType = rand(1, 3);
  let expression, correctErrorId, errorExplanation;

  if (errType === 1) {
    // Error in squaring a (shows a×2 instead of a²)
    const wrongA2 = a * 2;
    expression = `c^2 = [${a}^2|1] + [${b}^2|2] = [${wrongA2}|3] + [${b*b}|4] = [${wrongA2 + b*b}|5]`;
    correctErrorId = 3;
    errorExplanation = `Token 3 is wrong: \\(${a}^2 = ${a*a}\\), not \\(${wrongA2}\\). The student has doubled ${a} instead of squaring it. The correct value is ${a*a}.`;
  } else if (errType === 2) {
    // Error in addition
    const wrongSum = a*a + b*b + rand(1, 5);
    expression = `c^2 = [${a}^2|1] + [${b}^2|2] = [${a*a}|3] + [${b*b}|4] = [${wrongSum}|5]`;
    correctErrorId = 5;
    errorExplanation = `Token 5 is wrong: \\(${a*a} + ${b*b} = ${a*a + b*b}\\), not \\(${wrongSum}\\). The student has made an arithmetic error in the addition.`;
  } else {
    // Error in final square root (shows c² value instead of c)
    expression = `c^2 = [${a}^2|1] + [${b}^2|2] = [${a*a}|3] + [${b*b}|4] = [${a*a + b*b}|5], so [c = ${a*a + b*b}|6]`;
    correctErrorId = 6;
    errorExplanation = `Token 6 is wrong: after finding \\(c^2 = ${a*a + b*b}\\), you must take the square root. The correct answer is \\(c = \\sqrt{${a*a + b*b}} = ${c}\\), not \\(${a*a + b*b}\\).`;
  }

  return {
    uid, level: 7, diff, type: "SPOT_ERROR", subtype: "VALUE",
    q: `A student writes the following working to find the hypotenuse of a right-angled triangle with sides ${a} cm and ${b} cm. Click on the token that contains the error.`,
    expression,
    correctErrorId,
    errorExplanation,
    working: `<p><strong>Error:</strong> ${errorExplanation}</p>
<p><strong>Correct answer:</strong> \\(c = \\sqrt{${a*a} + ${b*b}} = \\sqrt{${a*a + b*b}} = ${c}\\) cm</p>`,
    img: "", imgAlt: "", hint: "Check each value carefully — is each squaring correct? Is the addition right? Is the final square root taken?",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" }
  };
};

const _genExplanationL7 = (diff) => {
  const uid = makeUID("EXPLANATION", 7, diff);
  const questions = [
    {
      diff: 1,
      q: "A quadratic formed by Pythagoras' Theorem gives two solutions: x = 6 and x = −10. Explain why only one solution is valid and state which one.",
      modelAnswer: "Only x = 6 is valid. The variable x represents a length, and lengths cannot be negative. The solution x = −10 must be rejected because a negative side length has no meaning in this geometric context. Whenever a quadratic arises from Pythagoras' Theorem, any negative roots are rejected.",
      markingChecklist: [
        "States that x = 6 is the valid solution",
        "Explains that lengths cannot be negative",
        "States that x = −10 is rejected for this reason"
      ]
    },
    {
      diff: 2,
      q: "Explain how you can find the distance between two points on a coordinate grid using Pythagoras' Theorem.",
      modelAnswer: "To find the distance between two points A(x₁, y₁) and B(x₂, y₂), draw a right-angled triangle where AB is the hypotenuse. The horizontal leg has length |x₂ − x₁| and the vertical leg has length |y₂ − y₁|. Applying Pythagoras' Theorem: AB² = (x₂ − x₁)² + (y₂ − y₁)², so AB = √[(x₂ − x₁)² + (y₂ − y₁)²].",
      markingChecklist: [
        "Identifies the horizontal and vertical distances as the two shorter sides",
        "Correctly states the distance formula using Pythagoras' Theorem",
        "Explains that the straight-line distance is the hypotenuse"
      ]
    },
    {
      diff: 3,
      q: "Describe the strategy you would use to solve a problem where Pythagoras' Theorem must be applied twice in sequence.",
      modelAnswer: "In a two-step Pythagoras problem, first identify which right-angled triangle gives you an intermediate unknown length. Apply Pythagoras' Theorem to that triangle to find the intermediate value — keeping it exact (not rounded) if possible. Then use that intermediate value as a known side in the second right-angled triangle, and apply Pythagoras' Theorem again to find the final answer. Rounding too early introduces accumulated error, so it is best to carry forward the full decimal or surd value.",
      markingChecklist: [
        "Identifies two separate right-angled triangles in the problem",
        "States the importance of finding the intermediate length first",
        "Warns against rounding intermediate values before the final step"
      ]
    }
  ];
  const q = questions.find(x => x.diff === diff) || questions[0];
  return {
    uid, level: 7, diff, type: "EXPLANATION",
    q: q.q, modelAnswer: q.modelAnswer, markingChecklist: q.markingChecklist,
    working: "", img: "", imgAlt: "", hint: "",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" }
  };
};

// ─── LEVEL 8: Context Problems ────────────────────────────────────────
// Types: NUMERIC, EXPLANATION

const _genNumericL8 = (diff) => {
  const uid = makeUID("NUMERIC", 8, diff);
  const pool = getPool("l8numeric", _contextPool8Master.slice());
  const ctx = pickAndRemove(pool);

  if (diff === 1) {
    // Single-step integer, right angle explicit — ladder scenario
    const height = rand(3, 8), base = rand(2, 5);
    const ladder = Math.sqrt(height*height + base*base);
    // Use a clean triple if possible
    const tripleMatch = TRIPLES.find(t => t[0] === base && t[1] === height) ||
                        TRIPLES.find(t => t[0] === height && t[1] === base);
    const ladderLen = tripleMatch ? tripleMatch[2] : Math.round(ladder * 10) / 10;
    const aStr = String(ladderLen);
    return {
      uid, level: 8, diff, type: "NUMERIC",
      q: `A ladder leans against a vertical wall. The base of the ladder is ${base} m from the foot of the wall, and the ladder reaches ${height} m up the wall. The ground is horizontal and meets the wall at a right angle. Calculate the length of the ladder.`,
      a: aStr, units: ["m", "metres"], tolerance: 0.05,
      working: `<p><strong>Answer: \\(${aStr}\\) m</strong></p>
<p>The wall, ground, and ladder form a right-angled triangle.<br>
The shorter sides are ${base} m and ${height} m; the ladder is the hypotenuse.<br>
\\(c^2 = ${base}^2 + ${height}^2 = ${base*base} + ${height*height} = ${base*base + height*height}\\)<br>
\\(c = \\sqrt{${base*base + height*height}} = ${aStr}\\) m</p>`,
      img: "", imgAlt: "",
      hint: "The wall and ground form a right angle. The ladder is the hypotenuse.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };
  } else if (diff === 2) {
    // Single-step decimal — sports field diagonal
    const length = randF(50, 100, 0), width = randF(30, 60, 0);
    const diag = Math.sqrt(length*length + width*width);
    const diagStr = diag.toFixed(1);
    return {
      uid, level: 8, diff, type: "NUMERIC",
      q: `A rugby field is ${length} m long and ${width} m wide. Calculate the length of the diagonal of the field. Give your answer to 1 decimal place.`,
      a: diagStr, units: ["m", "metres"], tolerance: 0.05,
      working: `<p><strong>Answer: \\(${diagStr}\\) m</strong></p>
<p>The diagonal of a rectangle forms a right-angled triangle with the length and width.<br>
\\(d^2 = ${length}^2 + ${width}^2 = ${length*length} + ${width*width} = ${length*length + width*width}\\)<br>
\\(d = \\sqrt{${length*length + width*width}} \\approx ${diagStr}\\) m</p>`,
      img: "", imgAlt: "",
      hint: "The diagonal of a rectangle creates a right-angled triangle with the two sides.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };
  } else if (diff === 3) {
    // Two-step with decimals — path across paddock
    const north = randF(3, 9, 1), east = randF(3, 9, 1);
    const dist = Math.sqrt(north*north + east*east);
    const distStr = dist.toFixed(2);
    return {
      uid, level: 8, diff, type: "NUMERIC",
      q: `Tāne walks ${north} km due north along a fence line, then ${east} km due east along another fence. The two fence lines meet at a right angle. How far is Tāne from his starting point in a straight line? Give your answer to 2 decimal places.`,
      a: distStr, units: ["km"], tolerance: 0.05,
      working: `<p><strong>Answer: \\(${distStr}\\) km</strong></p>
<p>The north and east paths form the two shorter sides of a right-angled triangle. The straight-line return is the hypotenuse.<br>
\\(d^2 = ${north}^2 + ${east}^2 = ${Math.round(north*north*100)/100} + ${Math.round(east*east*100)/100} = ${Math.round((north*north + east*east)*100)/100}\\)<br>
\\(d = \\sqrt{${Math.round((north*north + east*east)*100)/100}} \\approx ${distStr}\\) km</p>`,
      img: "", imgAlt: "",
      hint: "North and east directions are at right angles — draw a sketch to identify the triangle.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };
  } else {
    // diff 4: multi-step, right angle implied — navigation return
    const leg1 = rand(5, 15), leg2 = rand(5, 15);
    const dist = Math.sqrt(leg1*leg1 + leg2*leg2);
    const distStr = dist.toFixed(1);
    return {
      uid, level: 8, diff, type: "NUMERIC",
      q: `A waka leaves the harbour and travels ${leg1} km north, then ${leg2} km east. The navigator needs to return directly to the harbour in a straight line. How long is the direct return journey? Give your answer to 1 decimal place. (Assume the harbour is at the origin and north and east are perpendicular.)`,
      a: distStr, units: ["km"], tolerance: 0.05,
      working: `<p><strong>Answer: \\(${distStr}\\) km</strong></p>
<p>The waka has travelled ${leg1} km north and ${leg2} km east — these are the two legs of a right-angled triangle. The direct return is the hypotenuse.<br>
\\(d^2 = ${leg1}^2 + ${leg2}^2 = ${leg1*leg1} + ${leg2*leg2} = ${leg1*leg1 + leg2*leg2}\\)<br>
\\(d = \\sqrt{${leg1*leg1 + leg2*leg2}} \\approx ${distStr}\\) km</p>`,
      img: "", imgAlt: "",
      hint: "Sketch a compass diagram. North and east are perpendicular — identify which side is the hypotenuse.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };
  }
};

const _genExplanationL8 = (diff) => {
  const uid = makeUID("EXPLANATION", 8, diff);
  const questions = [
    {
      diff: 1,
      q: "A builder says: 'I can use Pythagoras' Theorem to check that the corner of a building is a right angle.' Explain how the builder could do this using the 3-4-5 rule.",
      modelAnswer: "The builder measures 3 units along one wall from the corner and 4 units along the adjacent wall. If the diagonal distance between those two marks is exactly 5 units, then the corner is a right angle, because 3² + 4² = 9 + 16 = 25 = 5². This is an application of the converse of Pythagoras' Theorem: if a² + b² = c², the triangle must be right-angled.",
      markingChecklist: [
        "Describes measuring 3 and 4 units along the two walls",
        "States that the diagonal should be 5 units",
        "Explains this works because 3² + 4² = 5² (references Pythagoras' Theorem or its converse)"
      ]
    },
    {
      diff: 2,
      q: "A TV is advertised as '55 inches' — referring to its diagonal. The screen has a width-to-height ratio of 16:9. Describe how you would use Pythagoras' Theorem to find the actual width and height of the screen.",
      modelAnswer: "Since the ratio is 16:9, the width is 16k and the height is 9k for some value k. The diagonal is the hypotenuse of the right-angled triangle formed by the width and height. Using Pythagoras' Theorem: (16k)² + (9k)² = 55². This gives 256k² + 81k² = 3025, so 337k² = 3025, and k² = 3025 ÷ 337 ≈ 8.98, giving k ≈ 2.997. Width ≈ 16 × 2.997 ≈ 47.9 inches and height ≈ 9 × 2.997 ≈ 27.0 inches.",
      markingChecklist: [
        "Sets up width = 16k, height = 9k",
        "Applies Pythagoras: (16k)² + (9k)² = 55²",
        "Solves for k and uses it to find width and height"
      ]
    },
    {
      diff: 3,
      q: "Explain what information you need to correctly identify a right-angled triangle within a real-world problem, and describe one common mistake students make.",
      modelAnswer: "To identify a right-angled triangle in a real-world problem, you need to confirm that two of the measurements are perpendicular — meeting at exactly 90°. Common real-world indicators include: a vertical wall meeting a horizontal floor, a north–south path meeting an east–west path, or a height drawn perpendicular to a base. A common mistake is assuming the largest number given in the problem is the hypotenuse when in fact it might be a measurement in different units, or it might not be a side of the triangle at all. Students should always draw a diagram and label which side is opposite the right angle before applying the formula.",
      markingChecklist: [
        "States that two sides must be perpendicular (meet at 90°)",
        "Gives at least one valid real-world example of a right angle",
        "Describes a specific, plausible student misconception"
      ]
    }
  ];
  const q = questions.find(x => x.diff === diff) || questions[0];
  return {
    uid, level: 8, diff, type: "EXPLANATION",
    q: q.q, modelAnswer: q.modelAnswer, markingChecklist: q.markingChecklist,
    working: "", img: "", imgAlt: "", hint: "",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" }
  };
};

// ── 4. CONFIG OBJECT ──────────────────────────────────────────────────

const config = {
  id: "pythagoras",
  title: "Pythagoras' Theorem",
  levelNames: [
    "Squares and Square Roots",        // Level 1
    "Identify the Hypotenuse",         // Level 2
    "Recall the Theorem",              // Level 3
    "Find the Hypotenuse",             // Level 4
    "Find a Shorter Side",             // Level 5
    "Pythagoras in Other Triangles",   // Level 6
    "Multi-Step and Algebraic",        // Level 7
    "Real-World Problems"              // Level 8
  ],

  // ── Question pools (per level, reset when exhausted) ─────────────────
  _qPools: {},

  _buildPool(level) {
    const pool = [];

    if (level === 1) {
      // 10 questions: mix NUMERIC + MCQ across diffs 1-4
      // ~6 NUMERIC, ~4 MCQ; diffs spread 1,1,2,2,3,3,4,4,1,2
      const plan = [
        { type: "NUMERIC", diff: 1 }, { type: "MCQ", diff: 1 },
        { type: "NUMERIC", diff: 2 }, { type: "MCQ", diff: 2 },
        { type: "NUMERIC", diff: 3 }, { type: "MCQ", diff: 3 },
        { type: "NUMERIC", diff: 4 }, { type: "MCQ", diff: 4 },
        { type: "NUMERIC", diff: 1 }, { type: "NUMERIC", diff: 2 }
      ];
      for (const p of plan) {
        if (p.type === "NUMERIC") pool.push(_genNumericL1(p.diff));
        else pool.push(_genMCQL1(p.diff));
      }
    } else if (level === 2) {
      // 10 questions: MCQ + MATCH only; diffs 1-4
      const plan = [
        { type: "MCQ", diff: 1 }, { type: "MATCH", diff: 1 },
        { type: "MCQ", diff: 2 }, { type: "MATCH", diff: 2 },
        { type: "MCQ", diff: 3 }, { type: "MATCH", diff: 3 },
        { type: "MCQ", diff: 4 }, { type: "MATCH", diff: 4 },
        { type: "MCQ", diff: 1 }, { type: "MCQ", diff: 2 }
      ];
      for (const p of plan) {
        if (p.type === "MCQ") pool.push(_genMCQL2(p.diff));
        else pool.push(_genMatchL2(p.diff));
      }
    } else if (level === 3) {
      // 10 questions: MCQ + MATCH only
      const plan = [
        { type: "MCQ", diff: 1 }, { type: "MATCH", diff: 1 },
        { type: "MCQ", diff: 2 }, { type: "MATCH", diff: 2 },
        { type: "MCQ", diff: 3 }, { type: "MATCH", diff: 3 },
        { type: "MCQ", diff: 4 }, { type: "MATCH", diff: 4 },
        { type: "MCQ", diff: 1 }, { type: "MCQ", diff: 2 }
      ];
      for (const p of plan) {
        if (p.type === "MCQ") pool.push(_genMCQL3(p.diff));
        else pool.push(_genMatchL3(p.diff));
      }
    } else if (level === 4) {
      // 10 questions: ~7 NUMERIC, ~3 SPOT_ERROR/STEP; diffs spread
      const plan = [
        { type: "NUMERIC", diff: 1 }, { type: "NUMERIC", diff: 1 },
        { type: "NUMERIC", diff: 2 }, { type: "NUMERIC", diff: 2 },
        { type: "NUMERIC", diff: 3 }, { type: "NUMERIC", diff: 3 },
        { type: "NUMERIC", diff: 4 },
        { type: "SPOT", diff: 1 }, { type: "SPOT", diff: 2 }, { type: "SPOT", diff: 3 }
      ];
      for (const p of plan) {
        if (p.type === "NUMERIC") pool.push(_genNumericL4(p.diff));
        else pool.push(_genSpotStepL4(p.diff));
      }
    } else if (level === 5) {
      // 10 questions: ~7 NUMERIC, ~3 SPOT_ERROR/STEP
      const plan = [
        { type: "NUMERIC", diff: 1 }, { type: "NUMERIC", diff: 1 },
        { type: "NUMERIC", diff: 2 }, { type: "NUMERIC", diff: 2 },
        { type: "NUMERIC", diff: 3 }, { type: "NUMERIC", diff: 3 },
        { type: "NUMERIC", diff: 4 },
        { type: "SPOT", diff: 1 }, { type: "SPOT", diff: 2 }, { type: "SPOT", diff: 3 }
      ];
      for (const p of plan) {
        if (p.type === "NUMERIC") pool.push(_genNumericL5(p.diff));
        else pool.push(_genSpotStepL5(p.diff));
      }
    } else if (level === 6) {
      // 10 questions: ~7 NUMERIC, ~3 EXPLANATION
      const plan = [
        { type: "NUMERIC", diff: 1 }, { type: "NUMERIC", diff: 1 },
        { type: "NUMERIC", diff: 2 }, { type: "NUMERIC", diff: 2 },
        { type: "NUMERIC", diff: 3 }, { type: "NUMERIC", diff: 3 },
        { type: "NUMERIC", diff: 4 },
        { type: "EXP", diff: 1 }, { type: "EXP", diff: 2 }, { type: "EXP", diff: 3 }
      ];
      for (const p of plan) {
        if (p.type === "NUMERIC") pool.push(_genNumericL6(p.diff));
        else pool.push(_genExplanationL6(p.diff));
      }
    } else if (level === 7) {
      // 10 questions: ~5 NUMERIC, ~3 SPOT_ERROR/VALUE, ~2 EXPLANATION
      const plan = [
        { type: "NUMERIC", diff: 1 }, { type: "NUMERIC", diff: 2 },
        { type: "NUMERIC", diff: 3 }, { type: "NUMERIC", diff: 4 },
        { type: "NUMERIC", diff: 1 },
        { type: "SEV", diff: 1 }, { type: "SEV", diff: 2 }, { type: "SEV", diff: 3 },
        { type: "EXP", diff: 1 }, { type: "EXP", diff: 2 }
      ];
      for (const p of plan) {
        if (p.type === "NUMERIC") pool.push(_genNumericL7(p.diff));
        else if (p.type === "SEV") pool.push(_genSpotValueL7(p.diff));
        else pool.push(_genExplanationL7(p.diff));
      }
    } else if (level === 8) {
      // 10 questions: ~7 NUMERIC, ~3 EXPLANATION
      const plan = [
        { type: "NUMERIC", diff: 1 }, { type: "NUMERIC", diff: 1 },
        { type: "NUMERIC", diff: 2 }, { type: "NUMERIC", diff: 2 },
        { type: "NUMERIC", diff: 3 }, { type: "NUMERIC", diff: 3 },
        { type: "NUMERIC", diff: 4 },
        { type: "EXP", diff: 1 }, { type: "EXP", diff: 2 }, { type: "EXP", diff: 3 }
      ];
      for (const p of plan) {
        if (p.type === "NUMERIC") pool.push(_genNumericL8(p.diff));
        else pool.push(_genExplanationL8(p.diff));
      }
    }

    return shuffle(pool);
  },

  getQuestion(level, diff) {
    // Initialise or refill pool for this level
    if (!this._qPools[level] || this._qPools[level].length === 0) {
      this._qPools[level] = this._buildPool(level);
    }

    // If diff is specified, try to find a matching question from the pool
    if (diff !== undefined && diff !== null) {
      const idx = this._qPools[level].findIndex(q => q.diff === diff);
      if (idx !== -1) {
        return this._qPools[level].splice(idx, 1)[0];
      }
    }

    // Otherwise return next from pool
    return pickAndRemove(this._qPools[level]);
  },


  renderFront(q, el) {
    $(el).empty();

    if (q.img) {
      // Image + question text layout
      $(el).addClass("yama-has-image");
      const imgEl = $('<img>').attr('src', q.img).attr('alt', q.imgAlt || "").css({ display: "block", margin: "0 auto 12px auto", maxWidth: "100%" });
      const qEl = $('<div class="yama-question-text">').html(q.q);
      $(el).append(imgEl).append(qEl);
    } else {
      // Centred text layout
      $(el).addClass("yama-text-only");
      const qEl = $('<div class="yama-question-text yama-centered">').html(q.q);
      $(el).append(qEl);
    }

    if (q.hint) {
      const hintEl = $('<div class="yama-hint">').html("Hint: " + q.hint);
      $(el).append(hintEl);
    }
  },

  generateSolution(q) {
    if (q.type === "EXPLANATION") return "";

    if (q.type === "NUMERIC") {
      return q.working || "<p><strong>Answer: " + q.a + (q.units && q.units[0] ? " " + q.units[0] : "") + "</strong></p>";
    }

    if (q.type === "MCQ") {
      const correct = q.options[q.correctOption];
      return "<p><strong>Correct answer: " + correct + "</strong></p>" + (q.working || "");
    }

    if (q.type === "MATCH") {
      const rows = q.pairs.map(p => "<strong>" + p.left + "</strong> → " + p.right).join("<br>");
      return "<p>" + rows + "</p>";
    }

    if (q.type === "SPOT_ERROR" && q.subtype === "STEP") {
      const stepsHTML = q.steps.map(s => {
        if (s.isError) {
          return "<span style=\"color:red;font-weight:bold\">Step " + s.id + ": " + s.text + " ← ERROR</span>";
        }
        return "Step " + s.id + ": " + s.text;
      }).join("<br>");
      return "<p>" + stepsHTML + "</p>" + (q.working || "");
    }

    if (q.type === "SPOT_ERROR" && q.subtype === "VALUE") {
      return q.working || "<p><strong>Error: token " + q.correctErrorId + "</strong></p><p>" + q.errorExplanation + "</p>";
    }

    return q.working || "";
  },

  referenceItems: [
    {
      label: "Pyth",
      title: "Pythagoras Theorem",
      text: "For any right-angled triangle with hypotenuse c:",
      math: "a^2 + b^2 = c^2"
    },
    {
      label: "Hyp",
      title: "Finding the Hypotenuse",
      text: "Given the two shorter sides a and b:",
      math: "c = \\sqrt{a^2 + b^2}"
    },
    {
      label: "Leg",
      title: "Finding a Shorter Side",
      text: "Given hypotenuse c and one shorter side a:",
      math: "b = \\sqrt{c^2 - a^2}"
    },
    {
      label: "Conv",
      title: "Converse of Pythagoras",
      text: "If a squared + b squared = c squared, the triangle is right-angled:",
      math: "a^2 + b^2 = c^2 \\Rightarrow \\text{right-angled}"
    },
    {
      label: "Dist",
      title: "Distance Between Two Points",
      text: "Distance between points (x1,y1) and (x2,y2):",
      math: "d = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}"
    }
  ],

  referenceLabel: "Formulae"
};

// -- 5. BOOT LINE --------------------------------------------------
//QsetFW.init(config, document.getElementById("module-container"));
export default config;
