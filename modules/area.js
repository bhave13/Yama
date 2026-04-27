// ── 1. HEADER COMMENT ─────────────────────────────────────────────────
// Topic:        Area of Shapes
// NCEA Level:   N/A (Year 10 NZ Curriculum)   Standard: GM5-2 / GM4-3
// Year Group:   Year 10
// Generated:    2026-04-27
// Type Mix:     25% NUMERIC, 20% MCQ, 15% MATCH, 20% SPOT_ERROR, 15% EXPLANATION, 5% NUMERIC(text)

// ── 2. UTILITY FUNCTIONS ──────────────────────────────────────────────

let _uidCounter = 0;

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randF(min, max, dp) {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(dp));
}

function pickAndRemove(arr) {
  if (arr.length === 0) return null;
  const idx = rand(0, arr.length - 1);
  return arr.splice(idx, 1)[0];
}

function makeUID(type, level, diff) {
  _uidCounter++;
  const abbr = { NUMERIC: "num", MCQ: "mcq", MATCH: "mat",
    "SPOT_ERROR/STEP": "sep", "SPOT_ERROR/VALUE": "sev", EXPLANATION: "exp" };
  const a = abbr[type] || "num";
  const n = String(_uidCounter).padStart(3, "0");
  return `${a}-${n}-lev${level}-d${diff}`;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function roundTo(val, dp) {
  return parseFloat(val.toFixed(dp));
}

// ── SVG HELPERS ────────────────────────────────────────────────────────

function makeSVGRect(l, w, unit, slant) {
  // Returns a data URI SVG of a labelled rectangle
  const W = 220, H = 140, px = 30, py = 25;
  const rw = W - 2 * px, rh = H - 2 * py;
  let extra = slant ? `<text x="${px + rw + 8}" y="${py + rh / 2}" font-size="12" fill="#c0392b" dominant-baseline="middle">${slant} ${unit}</text>` : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect x="${px}" y="${py}" width="${rw}" height="${rh}" fill="#d6eaf8" stroke="#2471a3" stroke-width="2"/>
    <text x="${px + rw / 2}" y="${py - 6}" text-anchor="middle" font-size="12" fill="#1a5276">${l} ${unit}</text>
    <text x="${px + rw + 6}" y="${py + rh / 2}" font-size="12" fill="#1a5276" dominant-baseline="middle">${w} ${unit}</text>
    ${extra}
  </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

function makeSVGParallelogram(b, h, slant, unit) {
  const W = 240, H = 160;
  const offset = 35, px = 20, py = 30, bw = 160, bh = 80;
  const pts = `${px + offset},${py} ${px + offset + bw},${py} ${px + bw},${py + bh} ${px},${py + bh}`;
  // perpendicular height line
  const hx = px + offset + bw * 0.7;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <polygon points="${pts}" fill="#d5f5e3" stroke="#1e8449" stroke-width="2"/>
    <line x1="${hx}" y1="${py}" x2="${hx}" y2="${py + bh}" stroke="#c0392b" stroke-width="1.5" stroke-dasharray="4,3"/>
    <text x="${hx + 5}" y="${py + bh / 2}" font-size="11" fill="#c0392b" dominant-baseline="middle">h=${h} ${unit}</text>
    <text x="${px + offset + bw / 2}" y="${py + bh + 16}" text-anchor="middle" font-size="12" fill="#1e8449">b=${b} ${unit}</text>
    <text x="${px - 5}" y="${py + bh / 2}" font-size="11" fill="#7f8c8d" dominant-baseline="middle" text-anchor="end">${slant} ${unit}</text>
  </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

function makeSVGTriangle(b, h, unit, type) {
  // type: "right" or "acute"
  const W = 220, H = 160, px = 20, py = 15;
  const bw = 170, bh = 110;
  let pts, apexX;
  if (type === "right") {
    pts = `${px},${py + bh} ${px + bw},${py + bh} ${px},${py}`;
    apexX = px;
  } else {
    apexX = px + bw * 0.4;
    pts = `${px},${py + bh} ${px + bw},${py + bh} ${apexX},${py}`;
  }
  const hx = apexX;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <polygon points="${pts}" fill="#fef9e7" stroke="#b7950b" stroke-width="2"/>
    <line x1="${hx}" y1="${py}" x2="${hx}" y2="${py + bh}" stroke="#c0392b" stroke-width="1.5" stroke-dasharray="4,3"/>
    <text x="${hx + 5}" y="${py + bh / 2}" font-size="11" fill="#c0392b" dominant-baseline="middle">h=${h} ${unit}</text>
    <text x="${px + bw / 2}" y="${py + bh + 15}" text-anchor="middle" font-size="12" fill="#7d6608">b=${b} ${unit}</text>
  </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

function makeSVGCircle(r, unit, labelType) {
  // labelType: "radius" or "diameter"
  const W = 200, H = 200, cx = 100, cy = 100, cr = 70;
  let lineX2 = labelType === "diameter" ? cx + cr : cx + cr;
  let lineX1 = labelType === "diameter" ? cx - cr : cx;
  let labelVal = labelType === "diameter" ? r * 2 : r;
  let labelText = labelType === "diameter" ? `d=${labelVal} ${unit}` : `r=${labelVal} ${unit}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <circle cx="${cx}" cy="${cy}" r="${cr}" fill="#f5eef8" stroke="#8e44ad" stroke-width="2"/>
    <line x1="${lineX1}" y1="${cy}" x2="${lineX2}" y2="${cy}" stroke="#8e44ad" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy}" r="3" fill="#8e44ad"/>
    <text x="${(lineX1 + lineX2) / 2}" y="${cy - 8}" text-anchor="middle" font-size="12" fill="#6c3483">${labelText}</text>
  </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

function makeSVGLShape(totalW, totalH, cutW, cutH, unit) {
  // L-shape: full rect minus top-right rectangle
  const scale = 160 / Math.max(totalW, totalH);
  const W = 220, H = 180, ox = 20, oy = 15;
  const fw = totalW * scale, fh = totalH * scale;
  const cw = cutW * scale, ch = cutH * scale;
  // L-shape polygon: bottom-left going clockwise
  const pts = [
    [ox, oy + fh],         // bottom-left
    [ox + fw, oy + fh],    // bottom-right
    [ox + fw, oy + ch],    // step inner bottom-right
    [ox + cw, oy + ch],    // step inner corner
    [ox + cw, oy],         // step inner top
    [ox, oy]               // top-left
  ].map(p => p.join(",")).join(" ");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <polygon points="${pts}" fill="#fdebd0" stroke="#ca6f1e" stroke-width="2"/>
    <text x="${ox + fw / 2}" y="${oy + fh + 14}" text-anchor="middle" font-size="11" fill="#784212">${totalW} ${unit}</text>
    <text x="${ox - 5}" y="${oy + fh / 2}" text-anchor="end" font-size="11" fill="#784212" dominant-baseline="middle">${totalH} ${unit}</text>
    <text x="${ox + cw / 2}" y="${oy - 5}" text-anchor="middle" font-size="10" fill="#7f8c8d">${cutW} ${unit}</text>
    <text x="${ox + fw + 5}" y="${oy + ch / 2}" font-size="10" fill="#7f8c8d" dominant-baseline="middle">${cutH} ${unit}</text>
  </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

function makeSVGRectWithHole(outerL, outerW, holeL, holeW, unit) {
  const scale = 150 / Math.max(outerL, outerW);
  const W = 220, H = 170, ox = 25, oy = 20;
  const fw = outerL * scale, fh = outerW * scale;
  const hw = holeL * scale, hh = holeW * scale;
  const hx = ox + (fw - hw) / 2, hy = oy + (fh - hh) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect x="${ox}" y="${oy}" width="${fw}" height="${fh}" fill="#d6eaf8" stroke="#2471a3" stroke-width="2"/>
    <rect x="${hx}" y="${hy}" width="${hw}" height="${hh}" fill="white" stroke="#c0392b" stroke-width="1.5" stroke-dasharray="4,3"/>
    <text x="${ox + fw / 2}" y="${oy + fh + 14}" text-anchor="middle" font-size="11" fill="#1a5276">${outerL} ${unit}</text>
    <text x="${ox - 5}" y="${oy + fh / 2}" text-anchor="end" font-size="11" fill="#1a5276" dominant-baseline="middle">${outerW} ${unit}</text>
    <text x="${hx + hw / 2}" y="${hy + hh + 12}" text-anchor="middle" font-size="10" fill="#c0392b">${holeL} ${unit}</text>
    <text x="${hx + hw + 4}" y="${hy + hh / 2}" font-size="10" fill="#c0392b" dominant-baseline="middle">${holeW} ${unit}</text>
  </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

function makeSVGSector(r, theta, unit) {
  const W = 200, H = 200, cx = 100, cy = 110, cr = 75;
  const rad = (theta * Math.PI) / 180;
  const x1 = cx + cr * Math.cos(-Math.PI / 2);
  const y1 = cy + cr * Math.sin(-Math.PI / 2);
  const x2 = cx + cr * Math.cos(-Math.PI / 2 + rad);
  const y2 = cy + cr * Math.sin(-Math.PI / 2 + rad);
  const largeArc = theta > 180 ? 1 : 0;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <path d="M${cx},${cy} L${x1},${y1} A${cr},${cr} 0 ${largeArc},1 ${x2},${y2} Z" fill="#fadbd8" stroke="#c0392b" stroke-width="2"/>
    <line x1="${cx}" y1="${cy}" x2="${(cx + x1) / 2}" y2="${(cy + y1) / 2}" stroke="transparent"/>
    <text x="${cx + 5}" y="${cy - 20}" font-size="11" fill="#922b21">r=${r} ${unit}</text>
    <text x="${cx - 30}" y="${cy + 20}" font-size="11" fill="#922b21">θ=${theta}°</text>
  </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

// ── 3. QUESTION GENERATORS ────────────────────────────────────────────

// ── LEVEL 1: Identify and Name Area Units ─────────────────────────────

const _l1Pool = [
  "garden", "basketball court", "classroom floor", "rugby field",
  "solar panel", "kiwifruit orchard block", "school mural", "playground",
  "swimming pool base", "carpark"
];
let _l1PoolCurrent = _l1Pool.slice();

function _genL1MCQ(diff) {
  if (_l1PoolCurrent.length === 0) _l1PoolCurrent = _l1Pool.slice();
  const context = pickAndRemove(_l1PoolCurrent);

  if (diff === 1) {
    const q = `A ${context} is measured in metres. What unit should be used to record its area?`;
    const correct = "m²";
    const options = shuffle(["m²", "m", "cm²", "km²"]);
    const correctOption = options.indexOf(correct);
    const working = `<p><strong>Answer: m²</strong></p><p>Area is two-dimensional. When lengths are in metres, the area unit is metres × metres = m².</p>`;
    return {
      uid: makeUID("MCQ", 1, 1), level: 1, diff: 1, type: "MCQ",
      q, working, img: "", imgAlt: "", hint: "Area = length × length, so the unit is length-unit squared.",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      options, correctOption
    };
  }

  if (diff === 2) {
    const unitPair = rand(0, 1) === 0 ? ["centimetres", "cm²"] : ["millimetres", "mm²"];
    const q = `A ${context} has its dimensions measured in ${unitPair[0]}. What unit should be used for its area?`;
    const correct = unitPair[1];
    const wrongs = unitPair[0] === "centimetres"
      ? ["cm", "m²", "mm²"]
      : ["mm", "cm²", "m²"];
    const options = shuffle([correct, ...wrongs]);
    const correctOption = options.indexOf(correct);
    return {
      uid: makeUID("MCQ", 1, 2), level: 1, diff: 2, type: "MCQ",
      q, working: `<p><strong>Answer: ${correct}</strong></p><p>Dimensions in ${unitPair[0]} → area in ${correct} (the unit is squared).</p>`,
      img: "", imgAlt: "", hint: "Square the unit of length to get the area unit.",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      options, correctOption
    };
  }

  if (diff === 3) {
    // Convert cm² to mm²
    const cm2 = randF(1, 9, 1);
    const mm2 = roundTo(cm2 * 100, 1);
    const q = `A shape has an area of ${cm2} cm². Express this area in mm².`;
    const correct = String(mm2);
    const opts = shuffle([String(mm2), String(cm2 * 10), String(cm2 / 100), String(cm2 * 1000)]);
    const correctOption = opts.indexOf(correct);
    return {
      uid: makeUID("MCQ", 1, 3), level: 1, diff: 3, type: "MCQ",
      q, working: `<p><strong>Answer: ${mm2} mm²</strong></p><p>1 cm = 10 mm, so 1 cm² = 10 × 10 = 100 mm².</p><p>${cm2} × 100 = ${mm2} mm²</p>`,
      img: "", imgAlt: "", hint: "1 cm² = 100 mm² (not 10 — you square the conversion factor).",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      options: opts, correctOption
    };
  }

  // diff 4 — mixed units
  const lM = rand(1, 5);
  const wCm = rand(10, 90);
  const wM = roundTo(wCm / 100, 2);
  const area = roundTo(lM * wM, 4);
  const q = `A ${context} is ${lM} m long and ${wCm} cm wide. Before calculating its area, both dimensions must be in the same unit. What is the area in m²?`;
  const correct = String(roundTo(lM * wM, 4));
  const opts = shuffle([
    String(roundTo(lM * wM, 4)),
    String(lM * wCm),
    String(roundTo(lM * wCm / 10, 2)),
    String(roundTo(lM * wCm / 1000, 4))
  ]);
  const correctOption = opts.indexOf(correct);
  return {
    uid: makeUID("MCQ", 1, 4), level: 1, diff: 4, type: "MCQ",
    q,
    working: `<p><strong>Answer: ${correct} m²</strong></p><p>Convert: ${wCm} cm = ${wM} m</p><p>Area = ${lM} × ${wM} = ${correct} m²</p>`,
    img: "", imgAlt: "", hint: "Convert both measurements to metres first, then multiply.",
    ncea: { standard: "GM5-2", ao: "GM4-3" },
    options: opts, correctOption
  };
}

function _genL1Match(diff) {
  const pairs = [
    { left: "Length in metres", right: "Area in m²" },
    { left: "Length in centimetres", right: "Area in cm²" },
    { left: "Length in millimetres", right: "Area in mm²" },
    { left: "Length in kilometres", right: "Area in km²" },
  ];
  const leftCol = shuffle(pairs.map(p => p.left));
  const rightCol = shuffle(pairs.map(p => p.right));
  const shuffledPairs = leftCol.map(l => {
    const match = pairs.find(p => p.left === l);
    return { left: l, right: match.right };
  });
  return {
    uid: makeUID("MATCH", 1, diff), level: 1, diff, type: "MATCH",
    q: "Match each unit of length to the correct unit of area.",
    working: `<p>Length unit → Area unit (square the unit):</p><p>m → m² &nbsp; cm → cm² &nbsp; mm → mm² &nbsp; km → km²</p>`,
    img: "", imgAlt: "", hint: "Area = length × length, so the unit is always the length unit squared.",
    ncea: { standard: "GM5-2", ao: "GM4-3" },
    pairs: shuffledPairs
  };
}

function _genLevel1(diff) {
  const types = ["MCQ", "MCQ", "MATCH"];
  const t = types[rand(0, types.length - 1)];
  if (t === "MATCH") return _genL1Match(diff);
  return _genL1MCQ(diff);
}

// ── LEVEL 2: Area of Rectangle / Square ──────────────────────────────

const _l2Contexts = [
  { name: "classroom floor", unit: "m" },
  { name: "basketball court", unit: "m" },
  { name: "solar panel", unit: "m" },
  { name: "kiwifruit orchard row", unit: "m" },
  { name: "piece of cardboard", unit: "cm" },
  { name: "school notice board", unit: "cm" },
  { name: "community garden plot", unit: "m" },
  { name: "rugby in-goal zone", unit: "m" },
  { name: "window pane", unit: "cm" },
  { name: "wall tile", unit: "cm" },
];
let _l2Pool = _l2Contexts.slice();

function _genLevel2(diff) {
  if (_l2Pool.length === 0) _l2Pool = _l2Contexts.slice();
  const ctx = pickAndRemove(_l2Pool);
  const unit = ctx.unit;

  const typeRoll = rand(1, 4);

  if (diff === 1) {
    const l = rand(4, 15), w = rand(3, 10);
    const a = l * w;
    const img = makeSVGRect(l, w, unit, null);
    if (typeRoll <= 2) {
      // NUMERIC
      return {
        uid: makeUID("NUMERIC", 2, 1), level: 2, diff: 1, type: "NUMERIC",
        q: `A ${ctx.name} is ${l} ${unit} long and ${w} ${unit} wide. Calculate its area.`,
        working: `<p><strong>Answer: ${a} ${unit}²</strong></p><p>\\(A = l \\times w\\)</p><p>\\(A = ${l} \\times ${w} = ${a}\\) ${unit}²</p>`,
        img, imgAlt: `Rectangle labelled ${l} ${unit} by ${w} ${unit}`, hint: `Use A = l × w`,
        ncea: { standard: "GM5-2", ao: "GM4-3" },
        a: String(a), units: [`${unit}²`, `square ${unit}s`], tolerance: 0.01
      };
    }
    // MCQ
    const correct = a;
    const opts = shuffle([correct, l + w, 2 * (l + w), l * l].map(String));
    return {
      uid: makeUID("MCQ", 2, 1), level: 2, diff: 1, type: "MCQ",
      q: `A ${ctx.name} measures ${l} ${unit} by ${w} ${unit}. What is its area?`,
      working: `<p><strong>Answer: ${a} ${unit}²</strong></p><p>\\(A = ${l} \\times ${w} = ${a}\\) ${unit}²</p>`,
      img, imgAlt: `Rectangle ${l} ${unit} × ${w} ${unit}`,
      hint: "Multiply length by width.", ncea: { standard: "GM5-2", ao: "GM4-3" },
      options: opts.map(o => `${o} ${unit}²`),
      correctOption: opts.indexOf(String(correct))
    };
  }

  if (diff === 2) {
    const l = randF(2, 12, 1), w = randF(1.5, 8, 1);
    const a = roundTo(l * w, 2);
    const img = makeSVGRect(l, w, unit, null);
    return {
      uid: makeUID("NUMERIC", 2, 2), level: 2, diff: 2, type: "NUMERIC",
      q: `A ${ctx.name} is ${l} ${unit} long and ${w} ${unit} wide. Find its area.`,
      working: `<p><strong>Answer: ${a} ${unit}²</strong></p><p>\\(A = l \\times w = ${l} \\times ${w} = ${a}\\) ${unit}²</p>`,
      img, imgAlt: `Rectangle ${l} ${unit} × ${w} ${unit}`, hint: "Multiply the two decimal dimensions.",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: String(a), units: [`${unit}²`], tolerance: 0.01
    };
  }

  if (diff === 3) {
    // Fractional — use simple fractions that multiply cleanly
    const fracs = [[3,4],[2,3],[5,6],[3,5],[4,5]];
    const [n1,d1] = fracs[rand(0,fracs.length-1)];
    const [n2,d2] = fracs[rand(0,fracs.length-1)];
    const aN = n1 * n2, aD = d1 * d2;
    // simplify
    function gcd(a,b){return b===0?a:gcd(b,a%b);}
    const g = gcd(aN, aD);
    const aSimN = aN/g, aSimD = aD/g;
    const aDecimal = roundTo(aN/aD, 4);
    const aStr = aSimD === 1 ? String(aSimN) : `${aSimN}/${aSimD}`;
    return {
      uid: makeUID("NUMERIC", 2, 3), level: 2, diff: 3, type: "NUMERIC",
      q: `A rectangular piece of fabric is \\(\\frac{${n1}}{${d1}}\\) ${unit} long and \\(\\frac{${n2}}{${d2}}\\) ${unit} wide. Find its area. Give your answer as a fraction in lowest terms.`,
      working: `<p><strong>Answer: \\(\\frac{${aSimN}}{${aSimD}}\\) ${unit}²</strong></p><p>\\(A = \\frac{${n1}}{${d1}} \\times \\frac{${n2}}{${d2}} = \\frac{${aN}}{${aD}} = \\frac{${aSimN}}{${aSimD}}\\) ${unit}²</p>`,
      img: "", imgAlt: "", hint: "Multiply the numerators together and the denominators together, then simplify.",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: String(aDecimal), units: [`${unit}²`], tolerance: 0.01
    };
  }

  // diff 4 — infer length from perimeter
  const w = rand(3, 10), P = 2 * (rand(w + 2, w + 12) + w);
  const l = P / 2 - w;
  const a = l * w;
  return {
    uid: makeUID("NUMERIC", 2, 4), level: 2, diff: 4, type: "NUMERIC",
    q: `A rectangular ${ctx.name} has a perimeter of ${P} ${unit} and a width of ${w} ${unit}. Find its area.`,
    working: `<p><strong>Answer: ${a} ${unit}²</strong></p><p>Perimeter = 2(l + w), so l + w = ${P}/2 = ${P/2}</p><p>l = ${P/2} − ${w} = ${l} ${unit}</p><p>\\(A = ${l} \\times ${w} = ${a}\\) ${unit}²</p>`,
    img: "", imgAlt: "", hint: "Use P = 2(l + w) to find l first.",
    ncea: { standard: "GM5-2", ao: "GM4-3" },
    a: String(a), units: [`${unit}²`], tolerance: 0.01
  };
}

// ── LEVEL 3: Area of Parallelogram ───────────────────────────────────

const _l3Contexts = [
  "paving slab", "kōwhaiwhai panel", "solar cell face", "field section",
  "tile", "banner", "shade sail section", "sign board"
];
let _l3Pool = _l3Contexts.slice();

function _genLevel3(diff) {
  if (_l3Pool.length === 0) _l3Pool = _l3Contexts.slice();
  const ctx = pickAndRemove(_l3Pool);
  const unit = "cm";
  const typeRoll = rand(1, 5);

  if (diff === 1) {
    const b = rand(6, 20), h = rand(4, 12), slant = rand(h + 1, h + 5);
    const a = b * h;
    const img = makeSVGParallelogram(b, h, slant, unit);
    if (typeRoll <= 2) {
      return {
        uid: makeUID("NUMERIC", 3, 1), level: 3, diff: 1, type: "NUMERIC",
        q: `A ${ctx} is shaped like a parallelogram with a base of ${b} ${unit}, a perpendicular height of ${h} ${unit}, and a slant side of ${slant} ${unit}. Find its area.`,
        working: `<p><strong>Answer: ${a} ${unit}²</strong></p><p>\\(A = b \\times h\\) (use perpendicular height only)</p><p>\\(A = ${b} \\times ${h} = ${a}\\) ${unit}²</p><p>The slant side (${slant} ${unit}) is not used.</p>`,
        img, imgAlt: `Parallelogram: base ${b} ${unit}, height ${h} ${unit}, slant ${slant} ${unit}`,
        hint: "Use the perpendicular height — not the slant side.",
        ncea: { standard: "GM5-2", ao: "GM4-3" },
        a: String(a), units: [`${unit}²`], tolerance: 0.01
      };
    }
    if (typeRoll === 3) {
      // MCQ — distractors: b×slant, ½×b×h, b+h+slant
      const correct = a;
      const d1 = b * slant;
      const d2 = Math.round(0.5 * b * h);
      const d3 = b + 2 * h;
      const rawOpts = [correct, d1, d2, d3];
      const opts = shuffle(rawOpts.map(o => `${o} ${unit}²`));
      const correctOption = opts.indexOf(`${correct} ${unit}²`);
      return {
        uid: makeUID("MCQ", 3, 1), level: 3, diff: 1, type: "MCQ",
        q: `A parallelogram has base ${b} ${unit}, perpendicular height ${h} ${unit}, and slant side ${slant} ${unit}. What is its area?`,
        working: `<p><strong>Answer: ${a} ${unit}²</strong></p><p>\\(A = b \\times h = ${b} \\times ${h} = ${a}\\) ${unit}²</p><p>The slant side is not needed.</p>`,
        img, imgAlt: `Parallelogram base ${b}, height ${h}, slant ${slant}`,
        hint: "A = base × perpendicular height.",
        ncea: { standard: "GM5-2", ao: "GM4-3" },
        options: opts, correctOption
      };
    }
    // SPOT_ERROR/VALUE
    const wrongAns = b * slant; // using slant instead of h
    return {
      uid: makeUID("SPOT_ERROR/VALUE", 3, 1), level: 3, diff: 1, type: "SPOT_ERROR",
      subtype: "VALUE",
      q: `A student calculated the area of a parallelogram with base ${b} ${unit}, perpendicular height ${h} ${unit}, and slant side ${slant} ${unit}. Click the token that contains the error.`,
      working: `<p><strong>The error is in the value used for height.</strong></p><p>The student used the slant side (${slant} ${unit}) instead of the perpendicular height (${h} ${unit}).</p><p>Correct: \\(A = ${b} \\times ${h} = ${a}\\) ${unit}²</p>`,
      img, imgAlt: `Parallelogram with base ${b}, slant ${slant}, perpendicular height ${h}`,
      hint: "Check which measurement was substituted as height.",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      expression: `A = [b|1] × [h|2] = [${b}|3] × [${slant}|4] = [${wrongAns}|5] ${unit}²`,
      correctErrorId: 4,
      errorExplanation: `The height used should be the perpendicular height (${h} ${unit}), not the slant side (${slant} ${unit}). The correct area is ${b} × ${h} = ${a} ${unit}².`
    };
  }

  if (diff === 2) {
    const b = randF(4, 15, 1), h = randF(3, 10, 1), slant = roundTo(h + randF(1, 3, 1), 1);
    const a = roundTo(b * h, 2);
    const img = makeSVGParallelogram(b, h, slant, unit);
    return {
      uid: makeUID("NUMERIC", 3, 2), level: 3, diff: 2, type: "NUMERIC",
      q: `A ${ctx} is a parallelogram with base ${b} ${unit}, perpendicular height ${h} ${unit}, and slant side ${slant} ${unit}. Calculate its area.`,
      working: `<p><strong>Answer: ${a} ${unit}²</strong></p><p>\\(A = b \\times h = ${b} \\times ${h} = ${a}\\) ${unit}²</p>`,
      img, imgAlt: `Parallelogram: base ${b}, height ${h}, slant ${slant}, unit ${unit}`,
      hint: "Use only b and h (perpendicular height).",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: String(a), units: [`${unit}²`], tolerance: 0.05
    };
  }

  if (diff === 3) {
    // Fractional
    function gcd(a,b){return b===0?a:gcd(b,a%b);}
    const bn = rand(3,7), bd = rand(2,4);
    const hn = rand(2,5), hd = rand(2,4);
    const aN = bn * hn, aD = bd * hd;
    const g = gcd(aN, aD);
    const sN = aN/g, sD = aD/g;
    return {
      uid: makeUID("NUMERIC", 3, 3), level: 3, diff: 3, type: "NUMERIC",
      q: `A parallelogram has base \\(\\frac{${bn}}{${bd}}\\) m and perpendicular height \\(\\frac{${hn}}{${hd}}\\) m. Find its area as a fraction in lowest terms.`,
      working: `<p><strong>Answer: \\(\\frac{${sN}}{${sD}}\\) m²</strong></p><p>\\(A = \\frac{${bn}}{${bd}} \\times \\frac{${hn}}{${hd}} = \\frac{${aN}}{${aD}} = \\frac{${sN}}{${sD}}\\) m²</p>`,
      img: "", imgAlt: "", hint: "Multiply numerators and denominators, then simplify.",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: String(roundTo(aN/aD, 6)), units: ["m²"], tolerance: 0.01
    };
  }

  // diff 4 — SPOT_ERROR/STEP
  const b = rand(8, 18), h = rand(5, 12), slant = rand(h + 1, h + 6);
  const wrongA = Math.round(0.5 * b * h);
  const correctA = b * h;
  return {
    uid: makeUID("SPOT_ERROR/STEP", 3, 4), level: 3, diff: 4, type: "SPOT_ERROR",
    subtype: "STEP",
    q: `A student found the area of a parallelogram with base ${b} cm and perpendicular height ${h} cm. Find the error in their working.`,
    working: `<p><strong>The error is in Step 2.</strong></p><p>The student applied the triangle formula (½ × b × h) instead of the parallelogram formula (b × h).</p><p>Correct: \\(A = ${b} \\times ${h} = ${correctA}\\) cm²</p>`,
    img: makeSVGParallelogram(b, h, slant, "cm"),
    imgAlt: `Parallelogram base ${b} cm height ${h} cm`,
    hint: "Check which formula was used.",
    ncea: { standard: "GM5-2", ao: "GM4-3" },
    steps: [
      { id: 1, text: `\\(A = b \\times h\\)`, isError: false },
      { id: 2, text: `\\(A = \\frac{1}{2} \\times ${b} \\times ${h}\\)`, isError: true },
      { id: 3, text: `\\(A = ${wrongA}\\) cm²`, isError: false }
    ]
  };
}

// ── LEVEL 4: Area of Triangle ─────────────────────────────────────────

const _l4Contexts = [
  "triangular kōwhaiwhai panel", "triangular sail", "in-goal zone end section",
  "triangular garden bed", "triangular mural section", "triangular solar shade",
  "triangular plot of land", "triangular sign"
];
let _l4Pool = _l4Contexts.slice();

function _genLevel4(diff) {
  if (_l4Pool.length === 0) _l4Pool = _l4Contexts.slice();
  const ctx = pickAndRemove(_l4Pool);

  if (diff === 1) {
    const b = rand(6, 20), h = rand(4, 14);
    const a = 0.5 * b * h;
    const ttype = rand(0,1) === 0 ? "right" : "acute";
    const img = makeSVGTriangle(b, h, "cm", ttype);
    const typeRoll = rand(1, 3);
    if (typeRoll <= 2) {
      return {
        uid: makeUID("NUMERIC", 4, 1), level: 4, diff: 1, type: "NUMERIC",
        q: `A ${ctx} has a base of ${b} cm and a perpendicular height of ${h} cm. Find its area.`,
        working: `<p><strong>Answer: ${a} cm²</strong></p><p>\\(A = \\frac{1}{2} \\times b \\times h\\)</p><p>\\(A = \\frac{1}{2} \\times ${b} \\times ${h} = ${a}\\) cm²</p>`,
        img, imgAlt: `Triangle base ${b} cm height ${h} cm`,
        hint: "Don't forget the ½ — the triangle is half a parallelogram.",
        ncea: { standard: "GM5-2", ao: "GM4-3" },
        a: String(a), units: ["cm²"], tolerance: 0.01
      };
    }
    // MCQ
    const correct = a;
    const opts = shuffle([correct, b * h, b + h, 0.5 * b * b].map(v => `${v} cm²`));
    return {
      uid: makeUID("MCQ", 4, 1), level: 4, diff: 1, type: "MCQ",
      q: `A triangle has base ${b} cm and perpendicular height ${h} cm. What is its area?`,
      working: `<p><strong>Answer: ${a} cm²</strong></p><p>\\(A = \\frac{1}{2} \\times ${b} \\times ${h} = ${a}\\) cm²</p>`,
      img, imgAlt: `Triangle base ${b} cm height ${h} cm`,
      hint: "A = ½ × b × h",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      options: opts, correctOption: opts.indexOf(`${correct} cm²`)
    };
  }

  if (diff === 2) {
    const b = randF(4, 16, 1), h = randF(3, 10, 1);
    const a = roundTo(0.5 * b * h, 2);
    return {
      uid: makeUID("NUMERIC", 4, 2), level: 4, diff: 2, type: "NUMERIC",
      q: `A ${ctx} has a base of ${b} m and a perpendicular height of ${h} m. Calculate its area.`,
      working: `<p><strong>Answer: ${a} m²</strong></p><p>\\(A = \\frac{1}{2} \\times ${b} \\times ${h} = ${a}\\) m²</p>`,
      img: makeSVGTriangle(b, h, "m", "acute"), imgAlt: `Triangle base ${b} m height ${h} m`,
      hint: "A = ½ × b × h — remember the half!",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: String(a), units: ["m²"], tolerance: 0.05
    };
  }

  if (diff === 3) {
    function gcd(a,b){return b===0?a:gcd(b,a%b);}
    const bn = rand(3,7)*2, bd = rand(2,4);  // ensure clean halving
    const hn = rand(4,8), hd = rand(2,3);
    const aN = bn * hn, aD = 2 * bd * hd;
    const g = gcd(aN, aD);
    const sN = aN/g, sD = aD/g;
    return {
      uid: makeUID("NUMERIC", 4, 3), level: 4, diff: 3, type: "NUMERIC",
      q: `A triangle has base \\(\\frac{${bn}}{${bd}}\\) m and perpendicular height \\(\\frac{${hn}}{${hd}}\\) m. Find its area as a fraction in lowest terms.`,
      working: `<p><strong>Answer: \\(\\frac{${sN}}{${sD}}\\) m²</strong></p><p>\\(A = \\frac{1}{2} \\times \\frac{${bn}}{${bd}} \\times \\frac{${hn}}{${hd}} = \\frac{${bn * hn}}{${2 * bd * hd}} = \\frac{${sN}}{${sD}}\\) m²</p>`,
      img: "", imgAlt: "", hint: "Multiply all three numerators and all three denominators, then simplify.",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: String(roundTo(aN/aD, 6)), units: ["m²"], tolerance: 0.01
    };
  }

  // diff 4 — SPOT_ERROR/STEP: forgot the half
  const b = rand(8, 18), h = rand(5, 14);
  const wrongA = b * h;
  const correctA = 0.5 * b * h;
  return {
    uid: makeUID("SPOT_ERROR/STEP", 4, 4), level: 4, diff: 4, type: "SPOT_ERROR",
    subtype: "STEP",
    q: `A student calculated the area of a triangle with base ${b} cm and height ${h} cm. Find the step that contains the error.`,
    working: `<p><strong>The error is in Step 2.</strong></p><p>The student omitted the ½ factor, using A = b × h instead of A = ½ × b × h.</p><p>Correct: \\(A = \\frac{1}{2} \\times ${b} \\times ${h} = ${correctA}\\) cm²</p>`,
    img: makeSVGTriangle(b, h, "cm", "acute"), imgAlt: `Triangle base ${b} cm height ${h} cm`,
    hint: "Check whether the ½ was applied correctly.",
    ncea: { standard: "GM5-2", ao: "GM4-3" },
    steps: [
      { id: 1, text: `\\(A = b \\times h\\)`, isError: true },
      { id: 2, text: `\\(A = ${b} \\times ${h}\\)`, isError: false },
      { id: 3, text: `\\(A = ${wrongA}\\) cm²`, isError: false }
    ]
  };
}

// ── LEVEL 5: Area of Circle ───────────────────────────────────────────

const _l5Contexts = [
  { name: "circular kiwifruit orchard", unit: "m" },
  { name: "circular pond", unit: "m" },
  { name: "circular rugby centre circle", unit: "m" },
  { name: "circular pizza", unit: "cm" },
  { name: "circular solar collector", unit: "m" },
  { name: "circular garden bed", unit: "m" },
  { name: "circular manhole cover", unit: "cm" },
  { name: "circular school clock face", unit: "cm" },
];
let _l5Pool = _l5Contexts.slice();

function _genLevel5(diff) {
  if (_l5Pool.length === 0) _l5Pool = _l5Contexts.slice();
  const ctx = pickAndRemove(_l5Pool);
  const unit = ctx.unit;

  if (diff === 1) {
    // Radius given as integer
    const r = rand(3, 10);
    const a = roundTo(Math.PI * r * r, 2);
    const img = makeSVGCircle(r, unit, "radius");
    const typeRoll = rand(1, 3);
    if (typeRoll <= 2) {
      return {
        uid: makeUID("NUMERIC", 5, 1), level: 5, diff: 1, type: "NUMERIC",
        q: `A ${ctx.name} has a radius of ${r} ${unit}. Calculate its area. Give your answer to 2 decimal places.`,
        working: `<p><strong>Answer: ${a} ${unit}²</strong></p><p>\\(A = \\pi r^2\\)</p><p>\\(A = \\pi \\times ${r}^2 = \\pi \\times ${r*r} \\approx ${a}\\) ${unit}²</p>`,
        img, imgAlt: `Circle with radius ${r} ${unit}`,
        hint: `Use A = πr². Square the radius first, then multiply by π.`,
        ncea: { standard: "GM5-2", ao: "GM4-3" },
        a: String(a), units: [`${unit}²`], tolerance: 0.05
      };
    }
    // MCQ — distractors: using d instead of r, πr not squared, C formula
    const d = r * 2;
    const wrong1 = roundTo(Math.PI * d * d, 2);  // used diameter
    const wrong2 = roundTo(Math.PI * r, 2);       // forgot to square
    const wrong3 = roundTo(2 * Math.PI * r, 2);   // circumference formula
    const opts = shuffle([a, wrong1, wrong2, wrong3].map(v => `${v} ${unit}²`));
    return {
      uid: makeUID("MCQ", 5, 1), level: 5, diff: 1, type: "MCQ",
      q: `A circle has radius ${r} ${unit}. What is its area? Give your answer to 2 d.p.`,
      working: `<p><strong>Answer: ${a} ${unit}²</strong></p><p>\\(A = \\pi \\times ${r}^2 = \\pi \\times ${r*r} \\approx ${a}\\) ${unit}²</p>`,
      img, imgAlt: `Circle radius ${r} ${unit}`,
      hint: "A = πr² — square r first.", ncea: { standard: "GM5-2", ao: "GM4-3" },
      options: opts, correctOption: opts.indexOf(`${a} ${unit}²`)
    };
  }

  if (diff === 2) {
    // Diameter given
    const d = rand(6, 20) * 2;
    const r = d / 2;
    const a = roundTo(Math.PI * r * r, 2);
    const img = makeSVGCircle(r, unit, "diameter");
    return {
      uid: makeUID("NUMERIC", 5, 2), level: 5, diff: 2, type: "NUMERIC",
      q: `A ${ctx.name} has a diameter of ${d} ${unit}. Find its area. Give your answer to 2 decimal places.`,
      working: `<p><strong>Answer: ${a} ${unit}²</strong></p><p>Radius = ${d} ÷ 2 = ${r} ${unit}</p><p>\\(A = \\pi \\times ${r}^2 = \\pi \\times ${r*r} \\approx ${a}\\) ${unit}²</p>`,
      img, imgAlt: `Circle with diameter ${d} ${unit}`,
      hint: "Halve the diameter to get the radius, then use A = πr².",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: String(a), units: [`${unit}²`], tolerance: 0.05
    };
  }

  if (diff === 3) {
    const r = randF(2, 8, 1);
    const a = roundTo(Math.PI * r * r, 2);
    return {
      uid: makeUID("NUMERIC", 5, 3), level: 5, diff: 3, type: "NUMERIC",
      q: `A ${ctx.name} has a radius of ${r} ${unit}. Calculate its area to 2 decimal places.`,
      working: `<p><strong>Answer: ${a} ${unit}²</strong></p><p>\\(A = \\pi \\times ${r}^2 = \\pi \\times ${roundTo(r*r,2)} \\approx ${a}\\) ${unit}²</p>`,
      img: makeSVGCircle(r, unit, "radius"), imgAlt: `Circle radius ${r} ${unit}`,
      hint: "Square the decimal radius carefully before multiplying by π.",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: String(a), units: [`${unit}²`], tolerance: 0.05
    };
  }

  // diff 4 — reverse: find radius from area
  const r = rand(3, 9);
  const aGiven = roundTo(Math.PI * r * r, 2);
  const aCalc = roundTo(Math.sqrt(aGiven / Math.PI), 1);
  return {
    uid: makeUID("NUMERIC", 5, 4), level: 5, diff: 4, type: "NUMERIC",
    q: `A ${ctx.name} has an area of ${aGiven} ${unit}². Find its radius. Give your answer to 1 decimal place.`,
    working: `<p><strong>Answer: ${aCalc} ${unit}</strong></p><p>\\(A = \\pi r^2\\)</p><p>\\(r^2 = \\frac{A}{\\pi} = \\frac{${aGiven}}{\\pi} \\approx ${roundTo(aGiven/Math.PI,4)}\\)</p><p>\\(r = \\sqrt{${roundTo(aGiven/Math.PI,4)}} \\approx ${aCalc}\\) ${unit}</p>`,
    img: "", imgAlt: "", hint: "Rearrange: r² = A ÷ π, then square root.",
    ncea: { standard: "GM5-2", ao: "GM4-3" },
    a: String(aCalc), units: [unit], tolerance: 0.1
  };
}

// ── LEVEL 6: Select and Apply Correct Formula ──────────────────────────

const _l6Shapes = ["rectangle", "triangle", "parallelogram", "circle", "square"];

function _genLevel6(diff) {
  const shape = _l6Shapes[rand(0, _l6Shapes.length - 1)];

  if (diff === 1 || diff === 2) {
    const useDecimal = diff === 2;
    let b, h, r, a, qText, imgSVG, imgAlt, working, opts;
    const unit = "cm";

    if (shape === "rectangle") {
      b = useDecimal ? randF(4,14,1) : rand(4,14);
      h = useDecimal ? randF(3,10,1) : rand(3,10);
      a = roundTo(b * h, 2);
      imgSVG = makeSVGRect(b, h, unit, null);
      imgAlt = `Rectangle ${b} × ${h} ${unit}`;
      qText = `Find the area of the rectangle shown.`;
      working = `<p><strong>Answer: ${a} ${unit}²</strong></p><p>\\(A = l \\times w = ${b} \\times ${h} = ${a}\\) ${unit}²</p>`;
      const d1 = roundTo(b + h, 2), d2 = roundTo(2*(b+h),2), d3 = roundTo(b*b,2);
      opts = shuffle([a, d1, d2, d3].map(v => `${v} ${unit}²`));
    } else if (shape === "triangle") {
      b = useDecimal ? randF(6,18,1) : rand(6,18);
      h = useDecimal ? randF(4,12,1) : rand(4,12);
      const slant = useDecimal ? roundTo(h + randF(1,3,1),1) : h + rand(1,4);
      a = roundTo(0.5 * b * h, 2);
      imgSVG = makeSVGTriangle(b, h, unit, "acute");
      imgAlt = `Triangle base ${b} height ${h} ${unit}`;
      qText = `Find the area of the triangle shown.`;
      working = `<p><strong>Answer: ${a} ${unit}²</strong></p><p>\\(A = \\frac{1}{2} \\times ${b} \\times ${h} = ${a}\\) ${unit}²</p>`;
      const d1 = roundTo(b*h,2), d2 = roundTo(b+h,2), d3 = roundTo(0.5*b*slant,2);
      opts = shuffle([a, d1, d2, d3].map(v => `${v} ${unit}²`));
    } else if (shape === "parallelogram") {
      b = useDecimal ? randF(5,15,1) : rand(5,15);
      h = useDecimal ? randF(3,10,1) : rand(3,10);
      const slant = useDecimal ? roundTo(h+randF(1,3,1),1) : h+rand(1,4);
      a = roundTo(b * h, 2);
      imgSVG = makeSVGParallelogram(b, h, slant, unit);
      imgAlt = `Parallelogram base ${b} height ${h} slant ${slant} ${unit}`;
      qText = `Find the area of the parallelogram shown.`;
      working = `<p><strong>Answer: ${a} ${unit}²</strong></p><p>\\(A = b \\times h = ${b} \\times ${h} = ${a}\\) ${unit}²</p><p>The slant side is not used.</p>`;
      const d1 = roundTo(b*slant,2), d2 = roundTo(0.5*b*h,2), d3 = roundTo(b+h,2);
      opts = shuffle([a, d1, d2, d3].map(v => `${v} ${unit}²`));
    } else if (shape === "circle") {
      r = useDecimal ? randF(3,8,1) : rand(3,8);
      a = roundTo(Math.PI * r * r, 2);
      imgSVG = makeSVGCircle(r, unit, "radius");
      imgAlt = `Circle radius ${r} ${unit}`;
      qText = `Find the area of the circle shown. Give your answer to 2 d.p.`;
      working = `<p><strong>Answer: ${a} ${unit}²</strong></p><p>\\(A = \\pi r^2 = \\pi \\times ${r}^2 \\approx ${a}\\) ${unit}²</p>`;
      const d1 = roundTo(Math.PI*(2*r)*(2*r),2), d2 = roundTo(Math.PI*r,2), d3 = roundTo(2*Math.PI*r,2);
      opts = shuffle([a, d1, d2, d3].map(v => `${v} ${unit}²`));
    } else { // square
      b = useDecimal ? randF(4,12,1) : rand(4,12);
      a = roundTo(b * b, 2);
      imgSVG = makeSVGRect(b, b, unit, null);
      imgAlt = `Square side ${b} ${unit}`;
      qText = `Find the area of the square shown.`;
      working = `<p><strong>Answer: ${a} ${unit}²</strong></p><p>\\(A = s^2 = ${b}^2 = ${a}\\) ${unit}²</p>`;
      const d1 = roundTo(4*b,2), d2 = roundTo(b*b*2,2), d3 = roundTo(b+b,2);
      opts = shuffle([a, d1, d2, d3].map(v => `${v} ${unit}²`));
    }

    const typeRoll = rand(1, 2);
    if (typeRoll === 1) {
      return {
        uid: makeUID("NUMERIC", 6, diff), level: 6, diff, type: "NUMERIC",
        q: qText, working, img: imgSVG, imgAlt,
        hint: "Identify the shape first, then choose the matching formula.",
        ncea: { standard: "GM5-2", ao: "GM4-3" },
        a: String(a), units: [`${unit}²`], tolerance: 0.05
      };
    }
    const correctOption = opts.indexOf(opts.find(o => o.startsWith(String(a))));
    return {
      uid: makeUID("MCQ", 6, diff), level: 6, diff, type: "MCQ",
      q: qText, working, img: imgSVG, imgAlt,
      hint: "Choose the right formula for the shape shown.",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      options: opts, correctOption: correctOption >= 0 ? correctOption : 0
    };
  }

  // diff 3 — fractional circle
  if (diff === 3) {
    const rn = rand(2,5), rd = rand(2,4);
    const rDec = roundTo(rn/rd, 4);
    const a = roundTo(Math.PI * rDec * rDec, 4);
    return {
      uid: makeUID("NUMERIC", 6, 3), level: 6, diff: 3, type: "NUMERIC",
      q: `A circle has radius \\(\\frac{${rn}}{${rd}}\\) cm. Find its area to 4 decimal places.`,
      working: `<p><strong>Answer: ${a} cm²</strong></p><p>\\(r = \\frac{${rn}}{${rd}} \\approx ${rDec}\\) cm</p><p>\\(A = \\pi \\times ${rDec}^2 \\approx ${a}\\) cm²</p>`,
      img: makeSVGCircle(rDec, "cm", "radius"), imgAlt: `Circle radius ${rn}/${rd} cm`,
      hint: "Convert the fraction to a decimal first, then apply A = πr².",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: String(a), units: ["cm²"], tolerance: 0.05
    };
  }

  // diff 4 — non-standard orientation (described in text)
  const b = rand(8, 18), h = rand(5, 12), slant = rand(h+2, h+7);
  const a = roundTo(0.5 * b * h, 2);
  return {
    uid: makeUID("NUMERIC", 6, 4), level: 6, diff: 4, type: "NUMERIC",
    q: `The diagram shows a triangle with a vertex pointing to the left. The base is ${b} cm (horizontal), the perpendicular height is ${h} cm, and a slant side of ${slant} cm is also labelled. Find the area.`,
    working: `<p><strong>Answer: ${a} cm²</strong></p><p>Shape: triangle. Formula: \\(A = \\frac{1}{2} \\times b \\times h\\)</p><p>\\(A = \\frac{1}{2} \\times ${b} \\times ${h} = ${a}\\) cm²</p><p>The slant side (${slant} cm) is not used.</p>`,
    img: makeSVGTriangle(b, h, "cm", "acute"), imgAlt: `Non-standard triangle base ${b} height ${h}`,
    hint: "Identify which measurement is the perpendicular height — it is always at right angles to the base.",
    ncea: { standard: "GM5-2", ao: "GM4-3" },
    a: String(a), units: ["cm²"], tolerance: 0.05
  };
}

// ── LEVEL 7: Compound Shape (Addition) ───────────────────────────────

const _l7Contexts = [
  { name: "school logo", unit: "cm" },
  { name: "garden bed", unit: "m" },
  { name: "playground", unit: "m" },
  { name: "community mural", unit: "cm" },
  { name: "kōwhaiwhai panel", unit: "cm" },
  { name: "house-shaped block of land", unit: "m" },
  { name: "sports field section", unit: "m" },
  { name: "decorative tile", unit: "cm" },
];
let _l7Pool = _l7Contexts.slice();

function _genLevel7(diff) {
  if (_l7Pool.length === 0) _l7Pool = _l7Contexts.slice();
  const ctx = pickAndRemove(_l7Pool);
  const unit = ctx.unit;

  if (diff === 1) {
    // Two rectangles — L shape
    const totalW = rand(8, 16), totalH = rand(8, 14);
    const cutW = rand(3, Math.floor(totalW/2)), cutH = rand(3, Math.floor(totalH/2));
    const aTotal = totalW * totalH;
    const aCut = cutW * cutH;
    const aL = aTotal - aCut; // subtraction method = same result as addition
    // Addition method: big rect + small rect
    const bigW = totalW, bigH = totalH - cutH;
    const smallW = totalW - cutW, smallH = cutH;
    const a1 = bigW * bigH, a2 = smallW * smallH;
    const aFinal = a1 + a2;
    const img = makeSVGLShape(totalW, totalH, cutW, cutH, unit);
    return {
      uid: makeUID("NUMERIC", 7, 1), level: 7, diff: 1, type: "NUMERIC",
      q: `The shape below is an L-shape made from two rectangles representing a ${ctx.name}. Find its total area.`,
      working: `<p><strong>Answer: ${aFinal} ${unit}²</strong></p>
        <p>Split into two rectangles:</p>
        <p>Rectangle 1: \\(${bigW} \\times ${bigH} = ${a1}\\) ${unit}²</p>
        <p>Rectangle 2: \\(${smallW} \\times ${smallH} = ${a2}\\) ${unit}²</p>
        <p>Total: \\(${a1} + ${a2} = ${aFinal}\\) ${unit}²</p>`,
      img, imgAlt: `L-shaped figure total ${totalW} × ${totalH} ${unit}, notch ${cutW} × ${cutH} ${unit}`,
      hint: "Split the L into two rectangles. Calculate each area separately, then add.",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: String(aFinal), units: [`${unit}²`], tolerance: 0.01
    };
  }

  if (diff === 2) {
    // Rectangle + semicircle
    const l = randF(5, 12, 1), w = randF(3, 8, 1);
    const r = roundTo(w / 2, 2);
    const aRect = roundTo(l * w, 2);
    const aSemi = roundTo(0.5 * Math.PI * r * r, 2);
    const aTotal = roundTo(aRect + aSemi, 2);
    return {
      uid: makeUID("NUMERIC", 7, 2), level: 7, diff: 2, type: "NUMERIC",
      q: `A ${ctx.name} consists of a rectangle ${l} ${unit} × ${w} ${unit} with a semicircle on one of the shorter ends (diameter = ${w} ${unit}). Find the total area to 2 d.p.`,
      working: `<p><strong>Answer: ${aTotal} ${unit}²</strong></p>
        <p>Rectangle: \\(${l} \\times ${w} = ${aRect}\\) ${unit}²</p>
        <p>Semicircle: radius = ${w} ÷ 2 = ${r} ${unit}</p>
        <p>\\(A_{\\text{semi}} = \\frac{1}{2} \\pi r^2 = \\frac{1}{2} \\times \\pi \\times ${r}^2 \\approx ${aSemi}\\) ${unit}²</p>
        <p>Total: \\(${aRect} + ${aSemi} = ${aTotal}\\) ${unit}²</p>`,
      img: "", imgAlt: "",
      hint: "Find the area of the rectangle and the semicircle separately, then add. The semicircle's radius = half the width.",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: String(aTotal), units: [`${unit}²`], tolerance: 0.1
    };
  }

  if (diff === 3) {
    // Rectangle + triangle (like a house shape), infer a missing dim
    const totalW = randF(6, 14, 1), rectH = randF(4, 9, 1);
    const triH = randF(2, 5, 1);
    const aRect = roundTo(totalW * rectH, 2);
    const aTri = roundTo(0.5 * totalW * triH, 2);
    const aTotal = roundTo(aRect + aTri, 2);
    const knownPartW = randF(2, totalW * 0.4, 1);
    const inferredW = roundTo(totalW - knownPartW, 1);
    return {
      uid: makeUID("NUMERIC", 7, 3), level: 7, diff: 3, type: "NUMERIC",
      q: `A ${ctx.name} is house-shaped: a rectangle (total width ${totalW} ${unit}, height ${rectH} ${unit}) with a triangle on top (height ${triH} ${unit}). One side of the base is labelled ${knownPartW} ${unit} and the other portion is unlabelled. Find the total area.`,
      working: `<p><strong>Answer: ${aTotal} ${unit}²</strong></p>
        <p>Missing base portion: ${totalW} − ${knownPartW} = ${inferredW} ${unit} (confirms total width = ${totalW} ${unit})</p>
        <p>Rectangle: \\(${totalW} \\times ${rectH} = ${aRect}\\) ${unit}²</p>
        <p>Triangle: \\(\\frac{1}{2} \\times ${totalW} \\times ${triH} = ${aTri}\\) ${unit}²</p>
        <p>Total: \\(${aRect} + ${aTri} = ${aTotal}\\) ${unit}²</p>`,
      img: "", imgAlt: "",
      hint: "Infer the full width first, then calculate rectangle and triangle areas separately.",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: String(aTotal), units: [`${unit}²`], tolerance: 0.1
    };
  }

  // diff 4 — EXPLANATION
  return {
    uid: makeUID("EXPLANATION", 7, 4), level: 7, diff: 4, type: "EXPLANATION",
    q: `Explain the steps you would take to find the area of a compound shape made up of two or more standard shapes. Why is it important to avoid counting any region twice?`,
    working: "",
    img: "", imgAlt: "", hint: "",
    ncea: { standard: "GM5-2", ao: "GM4-3" },
    modelAnswer: `To find the area of a compound shape, first identify how the shape can be partitioned into non-overlapping standard shapes (such as rectangles, triangles, or semicircles). Calculate the area of each component using the appropriate formula. Finally, add all the component areas together. It is essential that the partitioned regions do not overlap, because including any area more than once would give a total larger than the actual shape.`,
    markingChecklist: [
      "States that the shape must be split into non-overlapping standard shapes",
      "Identifies that each component area is calculated using the correct formula",
      "States that the component areas are added together",
      "Explains that overlapping regions would cause the area to be overcounted"
    ]
  };
}

// ── LEVEL 8: Complex Shape (Subtraction / Cutout) ─────────────────────

const _l8Contexts = [
  { name: "rectangular wall with a window", unit: "m" },
  { name: "metal plate with a hole", unit: "cm" },
  { name: "lawn with a circular pond", unit: "m" },
  { name: "cardboard sheet with a cutout", unit: "cm" },
  { name: "timber panel with a rectangular opening", unit: "cm" },
  { name: "rectangular field with a circular watering zone removed", unit: "m" },
];
let _l8Pool = _l8Contexts.slice();

function _genLevel8(diff) {
  if (_l8Pool.length === 0) _l8Pool = _l8Contexts.slice();
  const ctx = pickAndRemove(_l8Pool);
  const unit = ctx.unit;

  if (diff === 1) {
    // Rect with rect cutout
    const oL = rand(10, 20), oW = rand(6, 12);
    const hL = rand(2, Math.floor(oL/3)), hW = rand(2, Math.floor(oW/3));
    const aOuter = oL * oW;
    const aHole = hL * hW;
    const aFinal = aOuter - aHole;
    const img = makeSVGRectWithHole(oL, oW, hL, hW, unit);
    return {
      uid: makeUID("NUMERIC", 8, 1), level: 8, diff: 1, type: "NUMERIC",
      q: `A ${ctx.name} is shown. The outer rectangle is ${oL} ${unit} × ${oW} ${unit}. A rectangular cutout ${hL} ${unit} × ${hW} ${unit} is removed from the centre. Find the remaining area.`,
      working: `<p><strong>Answer: ${aFinal} ${unit}²</strong></p>
        <p>Outer area: \\(${oL} \\times ${oW} = ${aOuter}\\) ${unit}²</p>
        <p>Cutout area: \\(${hL} \\times ${hW} = ${aHole}\\) ${unit}²</p>
        <p>Remaining: \\(${aOuter} - ${aHole} = ${aFinal}\\) ${unit}²</p>`,
      img, imgAlt: `Rectangle ${oL}×${oW} with rectangular hole ${hL}×${hW}`,
      hint: "Area remaining = outer area − cutout area.",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: String(aFinal), units: [`${unit}²`], tolerance: 0.01
    };
  }

  if (diff === 2) {
    // Rect with circular cutout
    const oL = randF(8, 18, 1), oW = randF(6, 12, 1);
    const r = randF(1, Math.min(oL, oW) / 4, 1);
    const aOuter = roundTo(oL * oW, 2);
    const aCirc = roundTo(Math.PI * r * r, 2);
    const aFinal = roundTo(aOuter - aCirc, 2);
    return {
      uid: makeUID("NUMERIC", 8, 2), level: 8, diff: 2, type: "NUMERIC",
      q: `A ${ctx.name} has outer dimensions ${oL} ${unit} × ${oW} ${unit}. A circular cutout of radius ${r} ${unit} is removed. Find the remaining area to 2 d.p.`,
      working: `<p><strong>Answer: ${aFinal} ${unit}²</strong></p>
        <p>Outer: \\(${oL} \\times ${oW} = ${aOuter}\\) ${unit}²</p>
        <p>Circle: \\(\\pi \\times ${r}^2 = \\pi \\times ${roundTo(r*r,4)} \\approx ${aCirc}\\) ${unit}²</p>
        <p>Remaining: \\(${aOuter} - ${aCirc} = ${aFinal}\\) ${unit}²</p>`,
      img: "", imgAlt: "",
      hint: "Calculate the full rectangle area, then subtract the circular hole area.",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: String(aFinal), units: [`${unit}²`], tolerance: 0.1
    };
  }

  if (diff === 3) {
    // SPOT_ERROR/STEP: student added instead of subtracted
    const oL = rand(10, 18), oW = rand(6, 12);
    const hL = rand(2, 4), hW = rand(2, 4);
    const aOuter = oL * oW;
    const aHole = hL * hW;
    const wrongAns = aOuter + aHole; // error: added
    const correctAns = aOuter - aHole;
    return {
      uid: makeUID("SPOT_ERROR/STEP", 8, 3), level: 8, diff: 3, type: "SPOT_ERROR",
      subtype: "STEP",
      q: `A student found the area remaining after a ${hL} ${unit} × ${hW} ${unit} rectangular hole was cut from a ${oL} ${unit} × ${oW} ${unit} rectangle. Find the error.`,
      working: `<p><strong>The error is in Step 3.</strong></p><p>The student added the hole area instead of subtracting it.</p><p>Correct: \\(${aOuter} - ${aHole} = ${correctAns}\\) ${unit}²</p>`,
      img: "", imgAlt: "",
      hint: "When a piece is removed, its area is subtracted — not added.",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      steps: [
        { id: 1, text: `Outer area: \\(${oL} \\times ${oW} = ${aOuter}\\) ${unit}²`, isError: false },
        { id: 2, text: `Hole area: \\(${hL} \\times ${hW} = ${aHole}\\) ${unit}²`, isError: false },
        { id: 3, text: `Remaining area: \\(${aOuter} + ${aHole} = ${wrongAns}\\) ${unit}²`, isError: true }
      ]
    };
  }

  // diff 4 — EXPLANATION
  return {
    uid: makeUID("EXPLANATION", 8, 4), level: 8, diff: 4, type: "EXPLANATION",
    q: `A rectangular piece of wood has a circular hole drilled through it. Explain how you would find the area of the remaining wood, and describe one common error students make when solving this type of problem.`,
    working: "", img: "", imgAlt: "", hint: "",
    ncea: { standard: "GM5-2", ao: "GM4-3" },
    modelAnswer: `To find the remaining area, first calculate the area of the full rectangle using A = l × w. Next, calculate the area of the circular hole using A = πr² (making sure to use the radius, not the diameter). Then subtract the circle's area from the rectangle's area. A common error is to add the two areas instead of subtracting, which would give an area larger than the original rectangle — an impossible result that should trigger a sense-check.`,
    markingChecklist: [
      "Calculates the rectangle area using A = l × w",
      "Calculates the circle area using A = πr²",
      "Subtracts the circle area from the rectangle area",
      "Identifies a valid common error (e.g. adding instead of subtracting, or using diameter instead of radius)"
    ]
  };
}

// ── LEVEL 9: Context Problems (Single Shape) ──────────────────────────

const _l9Scenarios = [
  { shape: "rectangle", name: "school basketball court", dims: () => { const l=rand(24,32),w=rand(12,18); return {l,w,unit:"m"}; }, area: (d) => d.l*d.w, q: (d) => `A school basketball court is ${d.l} m long and ${d.w} m wide. What is its area?`, formula: "A = l × w" },
  { shape: "circle", name: "circular kiwifruit orchard block", dims: () => { const r=rand(15,40); return {r,unit:"m"}; }, area: (d) => roundTo(Math.PI*d.r*d.r,2), q: (d) => `A circular kiwifruit orchard block has a radius of ${d.r} m. Find its area to 2 decimal places.`, formula: "A = πr²" },
  { shape: "triangle", name: "triangular coastal reserve", dims: () => { const b=rand(20,60),h=rand(10,30); return {b,h,unit:"m"}; }, area: (d) => roundTo(0.5*d.b*d.h,1), q: (d) => `A triangular coastal reserve has a base of ${d.b} m and a perpendicular height of ${d.h} m. Find its area.`, formula: "A = ½ × b × h" },
  { shape: "rectangle", name: "rugby field", dims: () => { const l=rand(95,105),w=rand(60,72); return {l,w,unit:"m"}; }, area: (d) => d.l*d.w, q: (d) => `A rugby field is ${d.l} m long and ${d.w} m wide. Find its area.`, formula: "A = l × w" },
];
let _l9Pool = _l9Scenarios.slice();

function _genLevel9(diff) {
  if (_l9Pool.length === 0) _l9Pool = _l9Scenarios.slice();
  const scen = pickAndRemove(_l9Pool);
  const dims = scen.dims();
  const a = scen.area(dims);
  const unit = dims.unit;

  if (diff === 1 || diff === 2) {
    return {
      uid: makeUID("NUMERIC", 9, diff), level: 9, diff, type: "NUMERIC",
      q: scen.q(dims),
      working: `<p><strong>Answer: ${a} ${unit}²</strong></p><p>Shape: ${scen.shape}. Formula: ${scen.formula}</p><p>\\(A = ${a}\\) ${unit}²</p>`,
      img: "", imgAlt: "",
      hint: `Identify the shape and apply the correct formula.`,
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: String(a), units: [`${unit}²`], tolerance: 0.5
    };
  }

  if (diff === 3) {
    // Rate problem
    const rate = rand(3, 12);
    const a2 = scen.area(dims);
    const cost = roundTo(a2 * rate, 2);
    return {
      uid: makeUID("NUMERIC", 9, 3), level: 9, diff: 3, type: "NUMERIC",
      q: `${scen.q(dims)} Grass seed costs $${rate}.00 per ${unit}². What is the total cost to seed the area?`,
      working: `<p><strong>Answer: $${cost}</strong></p><p>Area = ${a2} ${unit}²</p><p>Cost = ${a2} × $${rate} = $${cost}</p>`,
      img: "", imgAlt: "",
      hint: "Find the area first, then multiply by the cost per unit².",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: String(cost), units: ["$", "dollars"], tolerance: 1
    };
  }

  // diff 4 — tiles
  const l = rand(4, 8), w = rand(3, 6);
  const floorA = l * w;
  const tileSide = 0.3;
  const tileA = tileSide * tileSide;
  const tilesNeeded = Math.ceil(floorA / tileA * 1.1);
  return {
    uid: makeUID("NUMERIC", 9, 4), level: 9, diff: 4, type: "NUMERIC",
    q: `A rectangular floor is ${l} m × ${w} m. Square tiles have side length 30 cm. Allowing 10% extra for cuts, how many tiles are needed?`,
    working: `<p><strong>Answer: ${tilesNeeded} tiles</strong></p>
      <p>Floor area: \\(${l} \\times ${w} = ${floorA}\\) m²</p>
      <p>Tile area: \\(0.30 \\times 0.30 = 0.09\\) m²</p>
      <p>Tiles (exact): \\(${floorA} ÷ 0.09 \\approx ${roundTo(floorA/tileA,1)}\\)</p>
      <p>With 10% extra: \\(${roundTo(floorA/tileA,1)} \\times 1.1 = ${roundTo(floorA/tileA*1.1,1)}\\)</p>
      <p>Round up: ${tilesNeeded} tiles</p>`,
    img: "", imgAlt: "",
    hint: "Convert all lengths to the same unit. Add 10%, then round up.",
    ncea: { standard: "GM5-2", ao: "GM4-3" },
    a: String(tilesNeeded), units: ["tiles"], tolerance: 2
  };
}

// ── LEVEL 10: Context Problems (Compound / Complex) ───────────────────

const _l10Scenarios = [
  {
    name: "school logo (rectangle + triangle)",
    gen: () => {
      const rW=rand(6,12), rH=rand(4,8), tH=rand(2,5);
      const aR=rW*rH, aT=roundTo(0.5*rW*tH,1), aTotal=roundTo(aR+aT,1);
      return {
        q: `A school logo is made of a rectangle ${rW} cm × ${rH} cm with a triangle on top (base ${rW} cm, height ${tH} cm). Find the total area.`,
        working: `<p><strong>Answer: ${aTotal} cm²</strong></p><p>Rectangle: \\(${rW} \\times ${rH} = ${aR}\\) cm²</p><p>Triangle: \\(\\frac{1}{2} \\times ${rW} \\times ${tH} = ${aT}\\) cm²</p><p>Total: \\(${aR} + ${aT} = ${aTotal}\\) cm²</p>`,
        a: String(aTotal), units: ["cm²"], tolerance: 0.2
      };
    }
  },
  {
    name: "rectangular wall with window (subtraction)",
    gen: () => {
      const wL=randF(4,8,1), wH=randF(2.5,4,1);
      const winL=randF(1,2,1), winH=randF(0.8,1.5,1);
      const aWall=roundTo(wL*wH,2), aWin=roundTo(winL*winH,2), aFinal=roundTo(aWall-aWin,2);
      return {
        q: `A rectangular wall is ${wL} m × ${wH} m. A rectangular window ${winL} m × ${winH} m is cut into it. Find the area of wall to be painted.`,
        working: `<p><strong>Answer: ${aFinal} m²</strong></p><p>Wall: \\(${wL} \\times ${wH} = ${aWall}\\) m²</p><p>Window: \\(${winL} \\times ${winH} = ${aWin}\\) m²</p><p>To paint: \\(${aWall} - ${aWin} = ${aFinal}\\) m²</p>`,
        a: String(aFinal), units: ["m²"], tolerance: 0.1
      };
    }
  },
  {
    name: "L-shaped room with carpet cost",
    gen: () => {
      const tW=rand(8,14), tH=rand(6,10), cW=rand(2,4), cH=rand(2,4);
      const aFull=tW*tH, aCut=cW*cH, aRoom=aFull-aCut;
      const rate=rand(30,60);
      const cost=aRoom*rate;
      return {
        q: `An L-shaped room has overall dimensions ${tW} m × ${tH} m with a rectangular section ${cW} m × ${cH} m removed from one corner. Carpet costs $${rate} per m². Find the total carpeting cost.`,
        working: `<p><strong>Answer: $${cost}</strong></p><p>Full area: \\(${tW} \\times ${tH} = ${aFull}\\) m²</p><p>Cut-out: \\(${cW} \\times ${cH} = ${aCut}\\) m²</p><p>Room area: \\(${aFull} - ${aCut} = ${aRoom}\\) m²</p><p>Cost: \\(${aRoom} \\times $${rate} = $${cost}\\)</p>`,
        a: String(cost), units: ["$", "dollars"], tolerance: 10
      };
    }
  },
  {
    name: "garden bed (rectangle + semicircle)",
    gen: () => {
      const l=rand(6,14), w=rand(4,8);
      const r=roundTo(w/2,2);
      const aR=l*w, aSemi=roundTo(0.5*Math.PI*r*r,2), aTotal=roundTo(aR+aSemi,2);
      return {
        q: `A garden bed consists of a rectangle ${l} m × ${w} m with a semicircle on one end (diameter = ${w} m). Find the total area to 2 d.p.`,
        working: `<p><strong>Answer: ${aTotal} m²</strong></p><p>Rectangle: \\(${l} \\times ${w} = ${aR}\\) m²</p><p>Semicircle (r = ${r} m): \\(\\frac{1}{2} \\pi \\times ${r}^2 \\approx ${aSemi}\\) m²</p><p>Total: \\(${aR} + ${aSemi} = ${aTotal}\\) m²</p>`,
        a: String(aTotal), units: ["m²"], tolerance: 0.2
      };
    }
  }
];
let _l10Pool = _l10Scenarios.slice();

function _genLevel10(diff) {
  if (_l10Pool.length === 0) _l10Pool = _l10Scenarios.slice();
  const scen = pickAndRemove(_l10Pool);
  const data = scen.gen();

  if (diff <= 3) {
    return {
      uid: makeUID("NUMERIC", 10, diff), level: 10, diff, type: "NUMERIC",
      q: data.q, working: data.working, img: "", imgAlt: "",
      hint: "Identify whether this is an addition (compound) or subtraction (cutout) problem first.",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: data.a, units: data.units, tolerance: data.tolerance
    };
  }

  // diff 4 — paint tins
  const hallW = rand(8, 15), hallH = rand(4, 7), wallH = rand(2, 4);
  const doors = 2, doorW = 1, doorH = 2;
  const windows = rand(2, 4), winW = 1.2, winH = 1;
  const wallArea = roundTo(2 * (hallW + hallH) * wallH - doors * doorW * doorH - windows * winW * winH, 2);
  const litresPerTin = 4, coveragePerL = 12;
  const coveragePerTin = litresPerTin * coveragePerL;
  const tinsNeeded = Math.ceil(wallArea / coveragePerTin);
  return {
    uid: makeUID("NUMERIC", 10, 4), level: 10, diff: 4, type: "NUMERIC",
    q: `A school hall is ${hallW} m × ${hallH} m with walls ${wallH} m high. It has ${doors} doors (each ${doorW} m × ${doorH} m) and ${windows} windows (each ${winW} m × ${winH} m). Paint tins hold 4 litres and cover 12 m² per litre. How many tins are needed to paint the walls?`,
    working: `<p><strong>Answer: ${tinsNeeded} tins</strong></p>
      <p>Perimeter of hall: \\(2 \\times (${hallW} + ${hallH}) = ${2*(hallW+hallH)}\\) m</p>
      <p>Wall area (full): \\(${2*(hallW+hallH)} \\times ${wallH} = ${2*(hallW+hallH)*wallH}\\) m²</p>
      <p>Door area: \\(${doors} \\times ${doorW} \\times ${doorH} = ${doors*doorW*doorH}\\) m²</p>
      <p>Window area: \\(${windows} \\times ${winW} \\times ${winH} = ${windows*winW*winH}\\) m²</p>
      <p>Area to paint: \\(${2*(hallW+hallH)*wallH} - ${doors*doorW*doorH} - ${windows*winW*winH} = ${wallArea}\\) m²</p>
      <p>Coverage per tin: \\(4 \\times 12 = 48\\) m²</p>
      <p>Tins needed: \\(\\lceil ${wallArea} ÷ 48 \\rceil = ${tinsNeeded}\\)</p>`,
    img: "", imgAlt: "",
    hint: "Find wall area, subtract doors and windows, then divide by coverage per tin and round up.",
    ncea: { standard: "GM5-2", ao: "GM4-3" },
    a: String(tinsNeeded), units: ["tins"], tolerance: 1
  };
}

// ── LEVEL 11: Sector Area ─────────────────────────────────────────────

const _l11Contexts = [
  { name: "slice of pizza", unit: "cm" },
  { name: "sector of a dartboard", unit: "cm" },
  { name: "irrigation zone (sector)", unit: "m" },
  { name: "sector-shaped kōwhaiwhai motif", unit: "cm" },
  { name: "pie chart segment", unit: "cm" },
  { name: "clock hand sweep", unit: "cm" },
];
let _l11Pool = _l11Contexts.slice();

function _genLevel11(diff) {
  if (_l11Pool.length === 0) _l11Pool = _l11Contexts.slice();
  const ctx = pickAndRemove(_l11Pool);
  const unit = ctx.unit;

  if (diff === 1) {
    const commonAngles = [90, 180, 270, 45, 120];
    const theta = commonAngles[rand(0, commonAngles.length - 1)];
    const r = rand(4, 12);
    const a = roundTo((theta / 360) * Math.PI * r * r, 2);
    const img = makeSVGSector(r, theta, unit);
    const typeRoll = rand(1, 2);
    if (typeRoll === 1) {
      return {
        uid: makeUID("NUMERIC", 11, 1), level: 11, diff: 1, type: "NUMERIC",
        q: `A ${ctx.name} is a sector with radius ${r} ${unit} and central angle ${theta}°. Find its area to 2 d.p.`,
        working: `<p><strong>Answer: ${a} ${unit}²</strong></p><p>\\(A = \\frac{\\theta}{360} \\times \\pi r^2\\)</p><p>\\(A = \\frac{${theta}}{360} \\times \\pi \\times ${r}^2 = \\frac{${theta}}{360} \\times \\pi \\times ${r*r} \\approx ${a}\\) ${unit}²</p>`,
        img, imgAlt: `Sector radius ${r} ${unit} angle ${theta}°`,
        hint: "A = (θ/360) × πr². Don't forget to include the fraction.",
        ncea: { standard: "GM5-2", ao: "GM4-3" },
        a: String(a), units: [`${unit}²`], tolerance: 0.1
      };
    }
    // MCQ
    const fullCircle = roundTo(Math.PI * r * r, 2);
    const inverted = roundTo((360 / theta) * Math.PI * r * r, 2);
    const arcLen = roundTo((theta / 360) * 2 * Math.PI * r, 2);
    const notSquared = roundTo((theta / 360) * Math.PI * r, 2);
    const opts = shuffle([a, fullCircle, arcLen, notSquared].map(v => `${v} ${unit}²`));
    return {
      uid: makeUID("MCQ", 11, 1), level: 11, diff: 1, type: "MCQ",
      q: `A sector has radius ${r} ${unit} and central angle ${theta}°. What is its area?`,
      working: `<p><strong>Answer: ${a} ${unit}²</strong></p><p>\\(A = \\frac{${theta}}{360} \\times \\pi \\times ${r}^2 \\approx ${a}\\) ${unit}²</p>`,
      img, imgAlt: `Sector r=${r} θ=${theta}°`,
      hint: "A = (θ/360) × πr²", ncea: { standard: "GM5-2", ao: "GM4-3" },
      options: opts, correctOption: opts.indexOf(`${a} ${unit}²`)
    };
  }

  if (diff === 2) {
    const angles = [120, 150, 240, 100, 75];
    const theta = angles[rand(0, angles.length - 1)];
    const r = rand(6, 15);
    const a = roundTo((theta / 360) * Math.PI * r * r, 2);
    return {
      uid: makeUID("NUMERIC", 11, 2), level: 11, diff: 2, type: "NUMERIC",
      q: `A ${ctx.name} is a sector of a circle with radius ${r} ${unit} and central angle ${theta}°. Calculate its area to 2 decimal places.`,
      working: `<p><strong>Answer: ${a} ${unit}²</strong></p><p>\\(A = \\frac{${theta}}{360} \\times \\pi \\times ${r}^2 \\approx ${a}\\) ${unit}²</p>`,
      img: makeSVGSector(r, theta, unit), imgAlt: `Sector r=${r} θ=${theta}°`,
      hint: "A = (θ/360) × πr²",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: String(a), units: [`${unit}²`], tolerance: 0.1
    };
  }

  if (diff === 3) {
    const theta = rand(30, 300);
    const r = randF(3, 10, 1);
    const a = roundTo((theta / 360) * Math.PI * r * r, 2);
    return {
      uid: makeUID("NUMERIC", 11, 3), level: 11, diff: 3, type: "NUMERIC",
      q: `A ${ctx.name} has radius ${r} ${unit} and central angle ${theta}°. Find its area to 2 d.p.`,
      working: `<p><strong>Answer: ${a} ${unit}²</strong></p><p>\\(A = \\frac{${theta}}{360} \\times \\pi \\times ${r}^2 \\approx ${a}\\) ${unit}²</p>`,
      img: makeSVGSector(r, theta, unit), imgAlt: `Sector r=${r} θ=${theta}°`,
      hint: "A = (θ/360) × πr²",
      ncea: { standard: "GM5-2", ao: "GM4-3" },
      a: String(a), units: [`${unit}²`], tolerance: 0.1
    };
  }

  // diff 4 — reverse: find angle from area
  const r = rand(5, 12);
  const theta = rand(40, 300);
  const aGiven = roundTo((theta / 360) * Math.PI * r * r, 2);
  const thetaCalc = roundTo((aGiven * 360) / (Math.PI * r * r), 1);
  return {
    uid: makeUID("NUMERIC", 11, 4), level: 11, diff: 4, type: "NUMERIC",
    q: `A sector has radius ${r} ${unit} and area ${aGiven} ${unit}². Find the central angle to 1 decimal place.`,
    working: `<p><strong>Answer: ${thetaCalc}°</strong></p><p>\\(A = \\frac{\\theta}{360} \\times \\pi r^2\\)</p><p>\\(\\theta = \\frac{A \\times 360}{\\pi r^2} = \\frac{${aGiven} \\times 360}{\\pi \\times ${r*r}} \\approx ${thetaCalc}°\\)</p>`,
    img: "", imgAlt: "",
    hint: "Rearrange: θ = (A × 360) ÷ (π × r²).",
    ncea: { standard: "GM5-2", ao: "GM4-3" },
    a: String(thetaCalc), units: ["°", "degrees"], tolerance: 0.5
  };
}

// ── LEVEL-DISPATCH POOLS ───────────────────────────────────────────────

// Pool-and-remove question buffers per level
const _questionPools = {};
function _getPool(level) {
  if (!_questionPools[level]) _questionPools[level] = [];
  return _questionPools[level];
}

// Difficulty cycling per level: spread 1-4 across 10 questions
const _diffCycles = {
  1:[1,1,2,2,3,3,4,4,1,2], 2:[1,1,2,2,3,3,4,4,1,2],
  3:[1,1,2,2,3,3,4,4,1,2], 4:[1,1,2,2,3,3,4,4,1,2],
  5:[1,1,2,2,3,3,4,4,1,2], 6:[1,1,2,2,3,3,4,4,1,2],
  7:[1,1,2,2,3,3,4,1,1,2], 8:[1,1,2,2,3,3,4,1,1,2],
  9:[1,1,2,2,3,3,4,4,1,2], 10:[1,1,2,2,3,3,4,1,2,3],
  11:[1,1,2,2,3,3,4,4,1,2]
};
const _diffPointers = {};
function _nextDiff(level, requestedDiff) {
  if (requestedDiff && requestedDiff >= 1 && requestedDiff <= 4) return requestedDiff;
  if (!_diffPointers[level]) _diffPointers[level] = 0;
  const cycle = _diffCycles[level] || [1,2,3,4,1,2,3,4,1,2];
  const d = cycle[_diffPointers[level] % cycle.length];
  _diffPointers[level]++;
  return d;
}

function _buildQuestion(level, diff) {
  switch (level) {
    case 1:  return _genLevel1(diff);
    case 2:  return _genLevel2(diff);
    case 3:  return _genLevel3(diff);
    case 4:  return _genLevel4(diff);
    case 5:  return _genLevel5(diff);
    case 6:  return _genLevel6(diff);
    case 7:  return _genLevel7(diff);
    case 8:  return _genLevel8(diff);
    case 9:  return _genLevel9(diff);
    case 10: return _genLevel10(diff);
    case 11: return _genLevel11(diff);
    default: return _genLevel2(diff);
  }
}

// ── 4. CONFIG OBJECT ──────────────────────────────────────────────────

const config = {
  id: "area-of-shapes",
  title: "Area of Shapes",
  levelNames: [
    "Identify Area Units",
    "Area of Rectangle & Square",
    "Area of Parallelogram",
    "Area of Triangle",
    "Area of Circle",
    "Choose the Right Formula",
    "Compound Shapes (Addition)",
    "Complex Shapes (Subtraction)",
    "Context: Single Shape",
    "Context: Compound & Complex",
    "Extension: Sector Area"
  ],

  getQuestion(level, diff) {
    const d = _nextDiff(level, diff);
    return _buildQuestion(level, d);
  },

  renderFront(q, el) {
    let html = "";
    if (q.img && q.img !== "") {
      html += `<div class="yama-img-wrap"><img src="${q.img}" alt="${q.imgAlt || ""}" style="max-width:100%;height:auto;display:block;margin:0 auto 0.5em auto;"/></div>`;
      html += `<div class="yama-q-text">${q.q}</div>`;
    } else {
      el.classList.add("yama-centered");
      html += `<div class="yama-q-text yama-q-centered">${q.q}</div>`;
    }
    el.innerHTML = html;
  },

  generateSolution(q) {
    if (q.type === "EXPLANATION") return "";

    if (q.type === "SPOT_ERROR" && q.subtype === "STEP") {
      const stepsHtml = q.steps.map(s => {
        const style = s.isError
          ? `style="color:red;font-weight:bold;background:#fdecea;padding:2px 6px;border-radius:3px;"`
          : "";
        const label = s.isError ? " ← ERROR" : "";
        return `<p ${style}>Step ${s.id}: ${s.text}${label}</p>`;
      }).join("");
      return `<div>${stepsHtml}</div>${q.working}`;
    }

    if (q.type === "SPOT_ERROR" && q.subtype === "VALUE") {
      const tokens = q.expression.match(/\[([^\]|]+)\|(\d+)\]/g) || [];
      let rendered = q.expression;
      tokens.forEach(tok => {
        const m = tok.match(/\[([^\]|]+)\|(\d+)\]/);
        const display = m[1], id = parseInt(m[2]);
        const isError = id === q.correctErrorId;
        const style = isError
          ? `style="color:red;font-weight:bold;background:#fdecea;padding:1px 5px;border-radius:3px;"`
          : `style="background:#eaf4fb;padding:1px 5px;border-radius:3px;"`;
        rendered = rendered.replace(tok, `<span ${style}>${display}</span>`);
      });
      return `<p><strong>Expression with error highlighted:</strong></p><p>${rendered}</p><p>${q.errorExplanation}</p>${q.working}`;
    }

    if (q.type === "MATCH") {
      const pairsHtml = q.pairs.map(p =>
        `<p><strong>${p.left}</strong> → ${p.right}</p>`
      ).join("");
      return `<p><strong>Correct pairs:</strong></p>${pairsHtml}`;
    }

    if (q.type === "MCQ") {
      const correctLabel = q.options[q.correctOption];
      return `<p><strong>Correct answer: ${correctLabel}</strong></p>${q.working}`;
    }

    // NUMERIC (includes TEXT-mapped questions)
    return `<p><strong>Answer: ${q.a} ${(q.units && q.units[0]) || ""}</strong></p>${q.working}`;
  },

  referenceItems: [
    {
      label: "Rect",
      title: "Area of Rectangle",
      text: "Multiply length by width:",
      math: "A = l \\times w"
    },
    {
      label: "Sq",
      title: "Area of Square",
      text: "Square the side length:",
      math: "A = s^2"
    },
    {
      label: "Tri",
      title: "Area of Triangle",
      text: "Half the base times the perpendicular height:",
      math: "A = \\frac{1}{2} \\times b \\times h"
    },
    {
      label: "Para",
      title: "Area of Parallelogram",
      text: "Base times perpendicular height (not slant side):",
      math: "A = b \\times h"
    },
    {
      label: "Circle",
      title: "Area of Circle",
      text: "Pi times the radius squared:",
      math: "A = \\pi r^2"
    },
    {
      label: "Sector",
      title: "Area of Sector",
      text: "Fraction of full circle times pi r squared:",
      math: "A = \\frac{\\theta}{360} \\times \\pi r^2"
    },
    {
      label: "Units",
      title: "Area Units",
      text: "Area is always in square units. Conversions:",
      math: "1\\text{ cm}^2 = 100\\text{ mm}^2 \\quad 1\\text{ m}^2 = 10{,}000\\text{ cm}^2"
    }
  ],
  referenceLabel: "Formulae"
};

//QsetFW.init(config, document.getElementById("module-container"));
export default config;
