// ── 1. HEADER COMMENT ─────────────────────────────────────────────────
// Topic:        Pythagoras' Theorem — Trainer
// NCEA Level:   N/A   Standard: N/A
// Year Group:   Year 9–10
// Generated:    2026-05-01
// Type Mix:     NUMERIC, MCQ, TRI_ID, SPOT_ERROR/VALUE, EXPLANATION
// Level a:      TEXT recall + NUMERIC (vocabulary & prerequisites)
// Level b:      TRI_ID (SVG) + MCQ (identify hypotenuse) + TRI_LABEL
// Levels c1/c2: NUMERIC find hypotenuse (on-diagram / offset)
// Levels d1/d2: NUMERIC find shorter side (on-diagram / offset)
// Level e:      Mixed c + d
// Level f:      NUMERIC other triangles (equilateral, isosceles, scalene, kite) — SVG
// Level g:      NUMERIC word problems with diagram
// Level h:      NUMERIC context problems (draw your own diagram)
// Level spot:   SPOT_ERROR/VALUE (click the wrong token)
// Level explain:EXPLANATION (open-ended, marking checklist)

// ── 2. UTILITY FUNCTIONS ──────────────────────────────────────────────

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randF = (min, max, dp) => {
  const factor = Math.pow(10, dp);
  return Math.round((Math.random() * (max - min) + min) * factor) / factor;
};

const r1 = v => Math.round(v * 10) / 10;
const r2 = v => Math.round(v * 100) / 100;

const pickAndRemove = (arr) => {
  const idx = Math.floor(Math.random() * arr.length);
  return arr.splice(idx, 1)[0];
};

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

let _uidCounter = 0;
const makeUID = (type, level, diff) => {
  _uidCounter++;
  const abbr = {
    NUMERIC: "num", MCQ: "mcq", TEXT: "txt", TRI_ID: "tri",
    TRI_LABEL: "lbl", SPOT_ERROR: "sev", EXPLANATION: "exp", WP: "wp", CTX: "ctx"
  };
  const n = String(_uidCounter).padStart(3, "0");
  return `${abbr[type] || "unk"}-${n}-lev${level}-d${diff}`;
};

// ── 3. SVG HELPERS ────────────────────────────────────────────────────

const _NS = "http://www.w3.org/2000/svg";
const _FILLS = ["#e3f2fd","#e8f5e9","#fff8e1","#fce4ec","#ede7f6","#e0f7fa"];
const _pickFill = () => _FILLS[rand(0, _FILLS.length - 1)];

/**
 * _textSVG — return an SVG <text> string with white stroke halo
 */
const _textSVG = (x, y, txt, fill, sz, W, H) => {
  x = Math.min(W - (sz * txt.length * 0.4), Math.max(sz * 0.5, x));
  y = Math.min(H - sz * 0.5, Math.max(sz * 0.6, y));
  return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" ` +
    `font-size="${sz}" font-weight="700" font-family="Segoe UI,Arial,sans-serif" ` +
    `stroke="white" stroke-width="3" paint-order="stroke" fill="${fill}">${txt}</text>`;
};

/**
 * _boxSVG — return an SVG right-angle box at vertex vi of pts[]
 */
const _boxSVG = (pts, vi, style = {}) => {
  const a = pts[vi], b = pts[(vi + 1) % 3], c = pts[(vi + 2) % 3];
  const lab = Math.hypot(b.x - a.x, b.y - a.y);
  const lac = Math.hypot(c.x - a.x, c.y - a.y);
  if (lab < 1 || lac < 1) return "";
  const S = style.s || 10;
  const ux = (b.x - a.x) / lab * S, uy = (b.y - a.y) / lab * S;
  const vx = (c.x - a.x) / lac * S, vy = (c.y - a.y) / lac * S;
  const p1 = { x: a.x + ux, y: a.y + uy };
  const p2 = { x: a.x + ux + vx, y: a.y + uy + vy };
  const p3 = { x: a.x + vx, y: a.y + vy };
  return `<path d="M${a.x} ${a.y}L${p1.x} ${p1.y}L${p2.x} ${p2.y}L${p3.x} ${p3.y}Z" ` +
    `fill="${style.fill || "none"}" stroke="${style.stroke || "#1a237e"}" ` +
    `stroke-width="${style.sw || 1.5}" stroke-linejoin="miter"/>`;
};

/**
 * _computeAngles — return angles (degrees) at each vertex of a 3-point polygon
 */
const _computeAngles = (pts) => pts.map((_, i) => {
  const a = pts[i], b = pts[(i + 1) % 3], c = pts[(i + 2) % 3];
  const bax = b.x - a.x, bay = b.y - a.y, cax = c.x - a.x, cay = c.y - a.y;
  const dot = bax * cax + bay * cay;
  const mag = Math.hypot(bax, bay) * Math.hypot(cax, cay);
  return Math.acos(Math.min(1, Math.max(-1, dot / (mag || 1)))) * 180 / Math.PI;
});

const _rotatePts = (pts, ang) => {
  const cx = pts.reduce((s, p) => s + p.x, 0) / 3;
  const cy = pts.reduce((s, p) => s + p.y, 0) / 3;
  return pts.map(({ x, y }) => {
    const dx = x - cx, dy = y - cy;
    return { x: cx + dx * Math.cos(ang) - dy * Math.sin(ang), y: cy + dx * Math.sin(ang) + dy * Math.cos(ang) };
  });
};

const _centrePts = (pts, W, H, m = 0.76) => {
  const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const y0 = Math.min(...ys), y1 = Math.max(...ys);
  const sc = Math.min((W * m) / (x1 - x0 || 1), (H * m) / (y1 - y0 || 1));
  const ox = (W - (x1 - x0) * sc) / 2 - x0 * sc;
  const oy = (H - (y1 - y0) * sc) / 2 - y0 * sc;
  return pts.map(p => ({ x: p.x * sc + ox, y: p.y * sc + oy }));
};

/**
 * _makeRightTri — generate a random right triangle, centred and rotated
 * Returns { pts, isRight, rightIdx, angles }
 */
const _makeRightTri = (W = 220, H = 150) => {
  const ri = rand(0, 2);
  const a = 30 + Math.random() * 50, b = 30 + Math.random() * 50;
  let raw;
  if (ri === 0)      raw = [{ x: 0, y: 0 }, { x: a, y: 0 }, { x: 0, y: b }];
  else if (ri === 1) raw = [{ x: a, y: 0 }, { x: 0, y: 0 }, { x: 0, y: b }];
  else               raw = [{ x: 0, y: b }, { x: a, y: b }, { x: a, y: 0 }];
  const pts = _centrePts(_rotatePts(raw, Math.random() * 2 * Math.PI), W, H);
  const ra = _computeAngles(pts);
  const tri = ra.reduce((b, v, i) => Math.abs(v - 90) < Math.abs(ra[b] - 90) ? i : b, 0);
  const i1 = (tri + 1) % 3, i2 = (tri + 2) % 3, sum = ra[i1] + ra[i2];
  const ang = [0, 0, 0];
  ang[tri] = 90; ang[i1] = Math.round(ra[i1] / sum * 90); ang[i2] = 90 - ang[i1];
  return { pts, isRight: true, rightIdx: tri, angles: ang };
};

const _makeNonRightTri = (W = 220, H = 150) => {
  for (let t = 0; t < 300; t++) {
    const raw = [
      { x: 10 + Math.random() * 70, y: 10 + Math.random() * 60 },
      { x: 90 + Math.random() * 90, y: 10 + Math.random() * 60 },
      { x: 30 + Math.random() * 130, y: 75 + Math.random() * 65 }
    ];
    const a = _computeAngles(raw);
    if (a.every(v => Math.abs(v - 90) > 12)) {
      const pts = _centrePts(raw, W, H);
      const ra = _computeAngles(pts).map(v => Math.round(v));
      ra[0] += 180 - ra.reduce((s, v) => s + v, 0);
      return { pts, isRight: false, rightIdx: -1, angles: ra };
    }
  }
  const pts = _centrePts([{ x: 30, y: 30 }, { x: 170, y: 30 }, { x: 55, y: 125 }], W, H);
  return { pts, isRight: false, rightIdx: -1, angles: [60, 80, 40] };
};

/**
 * _triSVG — render triangle data to an SVG string (not a data URI)
 * data: { pts, isRight, angles, showMode, labelSides, sideVals, highlight }
 */
const _triSVG = (data, W, H) => {
  const { pts, isRight, angles, showMode, labelSides, sideVals, highlight } = data;
  const fill = highlight ? "#fff9c4" : _pickFill();
  const stroke = highlight ? "#c62828" : "#1a237e";
  const poly = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  let inner = `<polygon points="${poly}" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>`;

  if (showMode === "box" && isRight) {
    const ang = _computeAngles(pts);
    const bi = ang.reduce((b, v, i) => Math.abs(v - 90) < Math.abs(ang[b] - 90) ? i : b, 0);
    inner += _boxSVG(pts, bi, highlight ? { stroke: "#c62828", fill: "#ef9a9a" } : {});
  }

  if (showMode === "angles" && angles) {
    const cx = pts.reduce((s, p) => s + p.x, 0) / 3;
    const cy = pts.reduce((s, p) => s + p.y, 0) / 3;
    pts.forEach((v, i) => {
      const dx = v.x - cx, dy = v.y - cy, len = Math.hypot(dx, dy) || 1;
      const tx = v.x + (dx / len) * 15, ty = v.y + (dy / len) * 15;
      inner += _textSVG(tx, ty, `${angles[i]}°`, "#1a237e", 10, W, H);
    });
  }

  if (labelSides || sideVals) {
    const cx = pts.reduce((s, p) => s + p.x, 0) / 3;
    const cy = pts.reduce((s, p) => s + p.y, 0) / 3;
    for (let i = 0; i < 3; i++) {
      const p1 = pts[i], p2 = pts[(i + 1) % 3];
      const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
      const dx = mx - cx, dy = my - cy, len = Math.hypot(dx, dy) || 1;
      const off = sideVals ? 13 : 12;
      const tx = mx + (dx / len) * off, ty = my + (dy / len) * off;
      const lbl = sideVals ? (sideVals[i] || "") : (labelSides[i] || "");
      if (lbl) inner += _textSVG(tx, ty, lbl, "#880000", 9, W, H);
    }
  }

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="${_NS}">${inner}</svg>`;
};

/**
 * _svgDataURI — wrap an SVG string in a data URI (matches makeSVG() output format)
 */
const _svgDataURI = (svg) => "data:image/svg+xml," + encodeURIComponent(svg);

// ── 4. PYTHAGOREAN TRIPLES ────────────────────────────────────────────

const TRIPLES = [
  [3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],
  [9,12,15],[20,21,29],[8,6,10],[5,12,13],[9,40,41]
];

// ── 5. WORKING-STEP HELPERS ───────────────────────────────────────────

const _wHyp = (a, b, c) => {
  const cStr = Number.isInteger(c) ? `${c}` : `\\approx ${c}`;
  return `<p>\\(c^2 = a^2 + b^2\\)<br>` +
    `\\(c^2 = ${a}^2 + ${b}^2 = ${a*a} + ${b*b} = ${a*a+b*b}\\)<br>` +
    `\\(c = \\sqrt{${a*a+b*b}} ${cStr}\\)</p>`;
};

const _wLeg = (c, known, unknown, lbl, klbl) => {
  const u2 = r2(c*c - known*known);
  const uStr = Number.isInteger(unknown) ? `${unknown}` : `\\approx ${unknown}`;
  return `<p>\\(c^2 = a^2 + b^2\\)<br>` +
    `\\(${lbl}^2 = c^2 - ${klbl}^2\\)<br>` +
    `\\(${lbl}^2 = ${c}^2 - ${known}^2 = ${r2(c*c)} - ${r2(known*known)} = ${u2}\\)<br>` +
    `\\(${lbl} = \\sqrt{${u2}} ${uStr}\\)</p>`;
};

// ── 6. DIAGRAM SVG GENERATORS ────────────────────────────────────────
// Each returns a raw SVG string for embedding in img (via _svgDataURI) or innerHTML

const _diagEquilateral = (W, H, side) => {
  const h = r2(Math.sqrt(3) / 2 * side);
  const bx1 = W*0.1, bx2 = W*0.9, by = H*0.88, apexX = W*0.5, apexY = H*0.1;
  const footX = W*0.5;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="${_NS}">` +
    `<polygon points="${bx1},${by} ${bx2},${by} ${apexX},${apexY}" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2"/>` +
    `<line x1="${footX}" y1="${by}" x2="${apexX}" y2="${apexY}" stroke="#e65100" stroke-width="1.8" stroke-dasharray="5,3"/>` +
    `<path d="M${footX} ${by} l7 0 0 -7" fill="none" stroke="#1a237e" stroke-width="1.5"/>` +
    _textSVG((bx1+bx2)/2, by+13, `${side} cm`, "#2e7d32", 9, W, H) +
    _textSVG(footX+20, (by+apexY)/2, "h=?", "#e65100", 10, W, H) +
    `</svg>`;
};

const _diagIsosceles = (W, H, eqSide, base) => {
  const halfBase = r2(base / 2);
  const bx1 = W*0.1, bx2 = W*0.9, by = H*0.88, apexX = W*0.5, apexY = H*0.1;
  const footX = W*0.5;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="${_NS}">` +
    `<polygon points="${bx1},${by} ${bx2},${by} ${apexX},${apexY}" fill="#e3f2fd" stroke="#1565c0" stroke-width="2"/>` +
    `<line x1="${footX}" y1="${by}" x2="${apexX}" y2="${apexY}" stroke="#e65100" stroke-width="1.8" stroke-dasharray="5,3"/>` +
    `<path d="M${footX} ${by} l7 0 0 -7" fill="none" stroke="#1a237e" stroke-width="1.5"/>` +
    _textSVG((bx1+footX)/2, by+13, `${halfBase} cm`, "#1565c0", 8, W, H) +
    _textSVG((footX+bx2)/2, by+13, `${halfBase} cm`, "#1565c0", 8, W, H) +
    _textSVG(bx1-16, (by+apexY)/2, `${eqSide} cm`, "#1565c0", 8, W, H) +
    _textSVG(footX+20, (by+apexY)/2, "h=?", "#e65100", 10, W, H) +
    `</svg>`;
};

const _diagScaleneAlt = (W, H, h, seg1, seg2, slant1) => {
  const bx1 = W*0.07, bx2 = W*0.93, by = H*0.85;
  const footX = bx1 + (bx2 - bx1) * (seg1 / (seg1 + seg2));
  const apexX = footX, apexY = H*0.1;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="${_NS}">` +
    `<polygon points="${bx1},${by} ${bx2},${by} ${apexX},${apexY}" fill="#fff8e1" stroke="#e65100" stroke-width="2"/>` +
    `<line x1="${footX}" y1="${by}" x2="${apexX}" y2="${apexY}" stroke="#7b1fa2" stroke-width="1.8" stroke-dasharray="5,3"/>` +
    `<path d="M${footX} ${by} l7 0 0 -7" fill="none" stroke="#1a237e" stroke-width="1.5"/>` +
    _textSVG((bx1+footX)/2, by+12, `${seg1} cm`, "#888", 8, W, H) +
    _textSVG((footX+bx2)/2, by+12, `${seg2} cm`, "#888", 8, W, H) +
    _textSVG(footX+18, (by+apexY)/2, `${h} cm`, "#7b1fa2", 8, W, H) +
    _textSVG((bx1+apexX)/2-14, (by+apexY)/2, `${slant1} cm`, "#555", 8, W, H) +
    _textSVG((bx2+apexX)/2+14, (by+apexY)/2, "s=?", "#e65100", 10, W, H) +
    `</svg>`;
};

const _diagKite = (W, H, d1half, d2half) => {
  const cx = W/2, cy = H/2;
  const top = { x: cx, y: cy - H*0.4 }, bot = { x: cx, y: cy + H*0.4 };
  const left = { x: cx - W*0.38, y: cy }, right = { x: cx + W*0.38, y: cy };
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="${_NS}">` +
    `<polygon points="${top.x},${top.y} ${right.x},${right.y} ${bot.x},${bot.y} ${left.x},${left.y}" fill="#ede7f6" stroke="#7b1fa2" stroke-width="2"/>` +
    `<line x1="${top.x}" y1="${top.y}" x2="${bot.x}" y2="${bot.y}" stroke="#1565c0" stroke-width="1.5" stroke-dasharray="4,3"/>` +
    `<line x1="${left.x}" y1="${left.y}" x2="${right.x}" y2="${right.y}" stroke="#1565c0" stroke-width="1.5" stroke-dasharray="4,3"/>` +
    `<path d="M${cx} ${cy} l8 0 0 -8" fill="none" stroke="#1a237e" stroke-width="1.5"/>` +
    _textSVG(cx+16, (top.y+cy)/2, `${d1half} cm`, "#1565c0", 8, W, H) +
    _textSVG((cx+right.x)/2, cy-12, `${d2half} cm`, "#1565c0", 8, W, H) +
    _textSVG((cx+right.x)/2+4, (top.y+cy)/2+14, "side=?", "#e65100", 9, W, H) +
    `</svg>`;
};

const _diagLadder = (W, H, hyp, base) => {
  const wx = W*0.22, by_ = H*0.83, lx = W*0.72, wy = H*0.15;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="${_NS}">` +
    `<line x1="${wx}" y1="${by_}" x2="${wx}" y2="${H*0.05}" stroke="#555" stroke-width="3"/>` +
    `<line x1="${wx}" y1="${by_}" x2="${W*0.82}" y2="${by_}" stroke="#555" stroke-width="3"/>` +
    `<line x1="${lx}" y1="${by_}" x2="${wx}" y2="${wy}" stroke="#e65100" stroke-width="2.5"/>` +
    `<path d="M${wx} ${by_} l8 0 0 -8" fill="none" stroke="#1a237e" stroke-width="1.5"/>` +
    _textSVG((wx+lx)/2+6, (by_+wy)/2-5, `${hyp} m`, "#e65100", 9, W, H) +
    _textSVG((wx+lx)/2, by_+11, `${base} m`, "#444", 9, W, H) +
    _textSVG(wx-20, (by_+wy)/2, "h=?", "#2e7d32", 9, W, H) +
    `</svg>`;
};

const _diagShip = (W, H, north, east) => {
  const sx = W*0.2, sy = H*0.8, ny = H*0.15, ex = W*0.78, ey = H*0.8;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="${_NS}">` +
    `<line x1="${sx}" y1="${sy}" x2="${sx}" y2="${ny}" stroke="#1565c0" stroke-width="2.5"/>` +
    `<line x1="${sx}" y1="${ny}" x2="${ex}" y2="${ey}" stroke="#1565c0" stroke-width="2.5"/>` +
    `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="#e65100" stroke-width="2" stroke-dasharray="5,3"/>` +
    `<path d="M${sx} ${ny} l9 0 0 9" fill="none" stroke="#1a237e" stroke-width="1.5"/>` +
    _textSVG(sx-20, (sy+ny)/2, `${north} km N`, "#1565c0", 8, W, H) +
    _textSVG((sx+ex)/2, ey+11, `${east} km E`, "#1565c0", 8, W, H) +
    _textSVG((sx+ex)/2+10, (sy+ny)/2-8, "d=?", "#e65100", 9, W, H) +
    `</svg>`;
};

const _diagRect = (W, H, w, h) => {
  const x1 = W*0.1, y1 = H*0.1, x2 = W*0.88, y2 = H*0.88;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="${_NS}">` +
    `<rect x="${x1}" y="${y1}" width="${x2-x1}" height="${y2-y1}" fill="#e3f2fd" stroke="#1565c0" stroke-width="2"/>` +
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e65100" stroke-width="2" stroke-dasharray="5,3"/>` +
    _textSVG((x1+x2)/2, y2+11, `${w} m`, "#1565c0", 8, W, H) +
    _textSVG(x1-15, (y1+y2)/2, `${h} m`, "#1565c0", 8, W, H) +
    _textSVG((x1+x2)/2+12, (y1+y2)/2-8, "diag=?", "#e65100", 8, W, H) +
    `</svg>`;
};

const _diagLighthouse = (W, H, dist, height) => {
  const tx = W*0.68, ty = H*0.13, by_ = H*0.82, boat = W*0.14;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="${_NS}">` +
    `<line x1="${tx}" y1="${by_}" x2="${tx}" y2="${ty}" stroke="#555" stroke-width="3"/>` +
    `<line x1="${boat}" y1="${by_}" x2="${tx}" y2="${by_}" stroke="#888" stroke-width="2"/>` +
    `<line x1="${boat}" y1="${by_}" x2="${tx}" y2="${ty}" stroke="#e65100" stroke-width="2" stroke-dasharray="4,3"/>` +
    `<path d="M${tx} ${by_} l-9 0 0 -9" fill="none" stroke="#1a237e" stroke-width="1.5"/>` +
    _textSVG(tx+16, (ty+by_)/2, `${height} m`, "#444", 8, W, H) +
    _textSVG((boat+tx)/2, by_+11, `${dist} m`, "#444", 8, W, H) +
    _textSVG((boat+tx)/2-12, (by_+ty)/2, "d=?", "#e65100", 9, W, H) +
    `</svg>`;
};

const _diagRamp = (W, H, run, rise) => {
  const x1 = W*0.1, y1 = H*0.82, x2 = W*0.88, y2 = H*0.82, x3 = W*0.1, y3 = H*0.18;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="${_NS}">` +
    `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2"/>` +
    `<path d="M${x1} ${y1} l9 0 0 -9" fill="none" stroke="#1a237e" stroke-width="1.5"/>` +
    _textSVG((x1+x2)/2, y2+11, `${run} m`, "#444", 8, W, H) +
    _textSVG(x3-18, (y1+y3)/2, `${rise} m`, "#444", 8, W, H) +
    _textSVG((x1+x2)/2+8, (y1+y3)/2-8, "ramp=?", "#e65100", 8, W, H) +
    `</svg>`;
};

const _diagTV = (W, H, w, h) => {
  const x1 = W*0.07, y1 = H*0.1, x2 = W*0.93, y2 = H*0.84;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="${_NS}">` +
    `<rect x="${x1}" y="${y1}" width="${x2-x1}" height="${y2-y1}" fill="#212121" stroke="#555" stroke-width="3" rx="4"/>` +
    `<rect x="${x1+4}" y="${y1+4}" width="${x2-x1-8}" height="${y2-y1-8}" fill="#1a237e"/>` +
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffeb3b" stroke-width="2" stroke-dasharray="4,3"/>` +
    _textSVG((x1+x2)/2, y2+11, `${w} cm`, "#444", 8, W, H) +
    _textSVG(x2+14, (y1+y2)/2, `${h} cm`, "#444", 8, W, H) +
    _textSVG((x1+x2)/2+10, (y1+y2)/2-8, "diag=?", "#ffb300", 8, W, H) +
    `</svg>`;
};

// ── 7. QUESTION GENERATORS ────────────────────────────────────────────

// ─── LEVEL a: Vocabulary & Prerequisites ──────────────────────────────

const _VOCAB = [
  { q: "What is the Pythagorean Theorem?", a: "c² = a² + b² (hypotenuse² = sum of squares of the two legs)" },
  { q: "What is the hypotenuse?", a: "The longest side of a right-angle triangle — always opposite the right angle." },
  { q: "What do a and b stand for in c² = a² + b²?", a: "The two shorter sides (legs) that form the right angle." },
  { q: "What does c stand for in c² = a² + b²?", a: "The hypotenuse — the longest side, opposite the right angle." },
  { q: "What is a right angle?", a: "An angle of exactly 90°. Shown by a small square at the vertex." },
  { q: "What are the legs of a right triangle?", a: "The two shorter sides (a and b) that meet at the right angle." },
  { q: "What shape does a right-angle marker make in a diagram?", a: "A small square drawn at the 90° vertex." },
  { q: "How do you spell HYPOTENUSE?", a: "H – Y – P – O – T – E – N – U – S – E (10 letters)" },
  { q: "How do you spell PYTHAGORAS?", a: "P – Y – T – H – A – G – O – R – A – S (10 letters)" },
  { q: "How do you say 'hypotenuse'?", a: "Hy-POT-en-yoos" },
  { q: "\\(\\sqrt{9} = ?\\)", a: "3", working: "<p>\\(3 \\times 3 = 9\\)</p>" },
  { q: "\\(\\sqrt{16} = ?\\)", a: "4", working: "<p>\\(4 \\times 4 = 16\\)</p>" },
  { q: "\\(\\sqrt{25} = ?\\)", a: "5", working: "<p>\\(5 \\times 5 = 25\\)</p>" },
  { q: "\\(\\sqrt{49} = ?\\)", a: "7", working: "<p>\\(7 \\times 7 = 49\\)</p>" },
  { q: "\\(\\sqrt{100} = ?\\)", a: "10", working: "<p>\\(10 \\times 10 = 100\\)</p>" },
  { q: "\\(\\sqrt{144} = ?\\)", a: "12", working: "<p>\\(12 \\times 12 = 144\\)</p>" },
  { q: "\\(\\sqrt{169} = ?\\)", a: "13", working: "<p>\\(13 \\times 13 = 169\\)</p>" },
  { q: "\\(7^2 = ?\\)", a: "49", working: "<p>\\(7 \\times 7 = 49\\)</p>" },
  { q: "\\(12^2 = ?\\)", a: "144", working: "<p>\\(12 \\times 12 = 144\\)</p>" },
  { q: "\\(13^2 = ?\\)", a: "169", working: "<p>\\(13 \\times 13 = 169\\)</p>" },
  { q: "What is a Pythagorean triple?", a: "Three whole numbers a, b, c where a² + b² = c². E.g. 3, 4, 5 → 9 + 16 = 25." },
  { q: "Is 3, 4, 5 a Pythagorean triple?", a: "YES — \\(3^2 + 4^2 = 9 + 16 = 25 = 5^2\\)" },
  { q: "Is 5, 12, 13 a Pythagorean triple?", a: "YES — \\(5^2 + 12^2 = 25 + 144 = 169 = 13^2\\)" },
];

const _genVocabA = (diff) => {
  const uid = makeUID("TEXT", "a", diff);
  const v = _VOCAB[rand(0, _VOCAB.length - 1)];
  return {
    uid, level: "a", diff, type: "TEXT",
    q: v.q, a: v.a,
    working: v.working || `<p><strong>${v.a}</strong></p>`,
    img: "", imgAlt: "",
    hint: "Think, then flip ▶",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" },
    units: [], tolerance: 0
  };
};

// ─── LEVEL b: Pythagoras Basics ───────────────────────────────────────

const _genTriIdB = (diff) => {
  const uid = makeUID("TRI_ID", "b", diff);
  const W = 220, H = 150;
  const useRight = Math.random() < 0.5;
  const showAngles = diff >= 2;
  const tri = useRight ? _makeRightTri(W, H) : _makeNonRightTri(W, H);
  const showMode = showAngles ? "angles" : "box";
  const svg = _triSVG({ ...tri, showMode }, W, H);
  const ans = useRight ? "YES — Right-angle triangle" : "NO — Not a right-angle triangle";
  const expl = useRight
    ? (showMode === "box" ? "The small square marks the 90° angle." : "One angle is exactly 90°.")
    : (showMode === "angles" ? `Angles: ${tri.angles.join("°, ")}° — none equal 90°.` : "No right-angle square is shown.");
  return {
    uid, level: "b", diff, type: "TRI_ID",
    q: "Is this a right-angle triangle?",
    a: ans,
    working: `<p>${expl}</p>`,
    img: _svgDataURI(svg), imgAlt: "Triangle diagram",
    hint: "",
    triData: { ...tri, showMode },
    triDataAns: { ...tri, showMode, highlight: true },
    ncea: { standard: "N/A", ao: "NZC-L5-GM" },
    units: [], tolerance: 0
  };
};

const _genHypMCQB = (diff) => {
  const uid = makeUID("MCQ", "b", diff);
  const W = 220, H = 150;
  const tri = _makeRightTri(W, H);
  const ri = tri.rightIdx, hs = (ri + 1) % 3;
  const labels = ["A", "B", "C"];
  const correctLabel = labels[hs];
  const options = shuffle(labels);
  const correctOption = options.indexOf(correctLabel);
  const labelSides = ["A", "B", "C"];
  const svg = _triSVG({ ...tri, showMode: "box", labelSides }, W, H);
  return {
    uid, level: "b", diff, type: "MCQ",
    q: "Which side is the hypotenuse?",
    a: `Side ${correctLabel}`,
    options, correctOption,
    working: `<p><strong>Answer: Side ${correctLabel}</strong></p><p>Side ${correctLabel} is opposite the right angle — it is the longest side, which is the hypotenuse.</p>`,
    img: _svgDataURI(svg), imgAlt: "Triangle with labelled sides",
    hint: "The hypotenuse is always opposite the right angle.",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" },
    units: [], tolerance: 0
  };
};

const _genLabelB = (diff) => {
  const uid = makeUID("TRI_LABEL", "b", diff);
  const W = 220, H = 150;
  const tri = _makeRightTri(W, H);
  const ri = tri.rightIdx, hs = (ri + 1) % 3;
  const ls = [(hs + 1) % 3, (hs + 2) % 3];
  const lbl = ["", "", ""]; lbl[hs] = "c"; lbl[ls[0]] = "a"; lbl[ls[1]] = "b";
  const svgFront = _triSVG({ ...tri, showMode: "box" }, W, H);
  const svgAns = _triSVG({ ...tri, showMode: "box", labelSides: lbl }, W, H);
  return {
    uid, level: "b", diff, type: "TRI_LABEL",
    q: "Label the sides: which is c (hypotenuse)? Which are a and b?",
    a: "c = hypotenuse (opposite the right angle); a & b = the two legs",
    working: `<p><strong>c</strong> = hypotenuse — always the longest side, always opposite the right-angle vertex.<br><strong>a</strong> and <strong>b</strong> = the two shorter legs that meet at the right angle.</p>`,
    img: _svgDataURI(svgFront), imgAlt: "Unlabelled right triangle",
    imgAns: _svgDataURI(svgAns), imgAnsAlt: "Labelled right triangle",
    hint: "c is always opposite the right angle.",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" },
    units: [], tolerance: 0
  };
};

// ─── LEVELS c1/c2: Find Hypotenuse ───────────────────────────────────

const _genHypC = (diff, offset) => {
  const uid = makeUID("NUMERIC", offset ? "c2" : "c1", diff);
  const W = 220, H = 150;
  let a, b, c;
  if (diff <= 2) {
    const t = TRIPLES[rand(0, TRIPLES.length - 1)];
    const sc = rand(1, 3); a = t[0]*sc; b = t[1]*sc; c = t[2]*sc;
  } else {
    a = randF(2, 15, 1); b = randF(2, 15, 1); c = r2(Math.sqrt(a*a + b*b));
  }
  const tri = _makeRightTri(W, H);
  const ri = tri.rightIdx, hs = (ri + 1) % 3, ls = [(hs+1)%3, (hs+2)%3];
  const sv = ["", "", ""];
  sv[ls[0]] = `${a}`; sv[ls[1]] = `${b}`;
  if (!offset) sv[hs] = "c=?";
  const triData = { ...tri, showMode: "box", sideVals: offset ? null : sv };
  const svg = _triSVG(triData, W, H);
  const isInt = Number.isInteger(c);
  return {
    uid, level: offset ? "c2" : "c1", diff, type: "NUMERIC",
    q: offset ? `\\(a = ${a}\\), \\(b = ${b}\\) — Find \\(c\\) (the hypotenuse).` : "Find \\(c\\) (the hypotenuse).",
    a: isInt ? `c = ${c}` : `c \\approx ${c}`,
    working: _wHyp(a, b, c),
    img: _svgDataURI(svg), imgAlt: `Right triangle with legs ${a} and ${b}`,
    hint: offset ? `Values: \\(a = ${a}\\), \\(b = ${b}\\)` : "Values are labelled on the triangle.",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" },
    units: ["cm"], tolerance: 0.05, requireUnits: true
  };
};

// ─── LEVELS d1/d2: Find Shorter Side ─────────────────────────────────

const _genLegD = (diff, offset) => {
  const uid = makeUID("NUMERIC", offset ? "d2" : "d1", diff);
  const W = 220, H = 150;
  let a, b, c;
  if (diff <= 2) {
    const t = TRIPLES[rand(0, TRIPLES.length - 1)];
    const sc = rand(1, 3); a = t[0]*sc; b = t[1]*sc; c = t[2]*sc;
  } else {
    do { a = randF(2, 14, 1); c = randF(a+1, 20, 1); b = r2(Math.sqrt(c*c - a*a)); }
    while (isNaN(b) || b <= 0);
  }
  const findA = Math.random() < 0.5;
  const unknown = findA ? a : b, known = findA ? b : a;
  const lbl = findA ? "a" : "b", klbl = findA ? "b" : "a";
  const tri = _makeRightTri(W, H);
  const ri = tri.rightIdx, hs = (ri+1)%3, ls = [(hs+1)%3, (hs+2)%3];
  const sv = ["", "", ""];
  sv[hs] = `${c}`; sv[ls[0]] = findA ? "a=?" : `${known}`; sv[ls[1]] = findA ? `${known}` : "b=?";
  const triData = { ...tri, showMode: "box", sideVals: offset ? null : sv };
  const svg = _triSVG(triData, W, H);
  const isInt = Number.isInteger(unknown);
  return {
    uid, level: offset ? "d2" : "d1", diff, type: "NUMERIC",
    q: offset ? `\\(c = ${c}\\), \\(${klbl} = ${known}\\) — Find \\(${lbl}\\).` : `Find the missing leg (\\(${lbl}\\)).`,
    a: isInt ? `${lbl} = ${unknown}` : `${lbl} \\approx ${unknown}`,
    working: _wLeg(c, known, unknown, lbl, klbl),
    img: _svgDataURI(svg), imgAlt: `Right triangle, find leg ${lbl}`,
    hint: offset ? `\\(c = ${c}\\), \\(${klbl} = ${known}\\)` : "Values are labelled on the triangle.",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" },
    units: ["cm"], tolerance: 0.05, requireUnits: true
  };
};

// ─── LEVEL f: Other Triangles (with SVG) ─────────────────────────────

const _genOtherF = (diff) => {
  const uid = makeUID("NUMERIC", "f", diff);
  const W = 220, H = 150;

  if (diff === 1) {
    // Equilateral — find height
    const side = rand(6, 16);
    const half = r2(side / 2);
    const h = r2(Math.sqrt(3) / 2 * side);
    const svg = _diagEquilateral(W, H, side);
    return {
      uid, level: "f", diff, type: "NUMERIC",
      q: `An equilateral triangle has sides of ${side} cm. Find the perpendicular height to 2 decimal places.`,
      a: `h \\approx ${h}`, units: ["cm"], tolerance: 0.05, requireUnits: true,
      working: `<p><strong>Answer: \\(h \\approx ${h}\\) cm</strong></p>` +
        `<p>Altitude bisects the base: half-side \\(= \\frac{${side}}{2} = ${half}\\) cm<br>` +
        `\\(h^2 = ${side}^2 - ${half}^2 = ${side*side} - ${r2(half*half)} = ${r2(side*side - half*half)}\\)<br>` +
        `\\(h = \\sqrt{${r2(side*side - half*half)}} \\approx ${h}\\) cm</p>`,
      img: _svgDataURI(svg), imgAlt: `Equilateral triangle, side ${side} cm, height unknown`,
      hint: "The altitude of an equilateral triangle bisects the base, creating two right-angled triangles.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };

  } else if (diff === 2) {
    // Isosceles — find height
    const eqSide = rand(6, 14);
    const base = rand(4, Math.floor(eqSide * 1.4));
    const halfBase = r2(base / 2);
    const h = r2(Math.sqrt(eqSide*eqSide - halfBase*halfBase));
    if (isNaN(h) || h <= 0) return _genOtherF(diff);
    const svg = _diagIsosceles(W, H, eqSide, base);
    return {
      uid, level: "f", diff, type: "NUMERIC",
      q: `An isosceles triangle has equal sides of ${eqSide} cm and a base of ${base} cm. Find the perpendicular height to 2 decimal places.`,
      a: `h \\approx ${h}`, units: ["cm"], tolerance: 0.05, requireUnits: true,
      working: `<p><strong>Answer: \\(h \\approx ${h}\\) cm</strong></p>` +
        `<p>Altitude bisects the base: half-base \\(= \\frac{${base}}{2} = ${halfBase}\\) cm<br>` +
        `\\(h^2 = ${eqSide}^2 - ${halfBase}^2 = ${eqSide*eqSide} - ${r2(halfBase*halfBase)} = ${r2(eqSide*eqSide - halfBase*halfBase)}\\)<br>` +
        `\\(h \\approx ${h}\\) cm</p>`,
      img: _svgDataURI(svg), imgAlt: `Isosceles triangle, equal sides ${eqSide} cm, base ${base} cm`,
      hint: "The altitude of an isosceles triangle bisects the base.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };

  } else if (diff === 3) {
    // Scalene with altitude — find one slant side
    const h = rand(5, 12), seg1 = rand(3, 8), seg2 = rand(3, 8);
    const slant1 = r2(Math.sqrt(h*h + seg1*seg1));
    const slant2 = r2(Math.sqrt(h*h + seg2*seg2));
    const svg = _diagScaleneAlt(W, H, h, seg1, seg2, slant1);
    return {
      uid, level: "f", diff, type: "NUMERIC",
      q: `A triangle has a perpendicular height of ${h} cm. The altitude divides the base into ${seg1} cm and ${seg2} cm. One slant side is ${slant1} cm. Find the other slant side to 2 decimal places.`,
      a: `s \\approx ${slant2}`, units: ["cm"], tolerance: 0.05, requireUnits: true,
      working: `<p><strong>Answer: \\(s \\approx ${slant2}\\) cm</strong></p>` +
        `<p>The altitude creates two right-angled triangles.<br>` +
        `Second right triangle: base \\(= ${seg2}\\) cm, height \\(= ${h}\\) cm<br>` +
        `\\(s^2 = ${h}^2 + ${seg2}^2 = ${h*h} + ${seg2*seg2} = ${h*h+seg2*seg2}\\)<br>` +
        `\\(s = \\sqrt{${h*h+seg2*seg2}} \\approx ${slant2}\\) cm</p>`,
      img: _svgDataURI(svg), imgAlt: `Scalene triangle with altitude ${h} cm`,
      hint: "The altitude creates two separate right-angled triangles. Use Pythagoras in the second one.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };

  } else {
    // Kite — find one side
    const d1half = rand(3, 8), d2half = rand(3, 8);
    const side = r2(Math.sqrt(d1half*d1half + d2half*d2half));
    const svg = _diagKite(W, H, d1half, d2half);
    return {
      uid, level: "f", diff, type: "NUMERIC",
      q: `A kite has diagonals of ${d1half*2} cm and ${d2half*2} cm. The diagonals cross at right angles and bisect each other. Find the length of one side to 2 decimal places.`,
      a: `\\text{side} \\approx ${side}`, units: ["cm"], tolerance: 0.05, requireUnits: true,
      working: `<p><strong>Answer: \\(${side}\\) cm</strong></p>` +
        `<p>Half-diagonals \\(${d1half}\\) cm and \\(${d2half}\\) cm are the legs.<br>` +
        `\\(\\text{side}^2 = ${d1half}^2 + ${d2half}^2 = ${d1half*d1half} + ${d2half*d2half} = ${d1half*d1half+d2half*d2half}\\)<br>` +
        `\\(\\text{side} = \\sqrt{${d1half*d1half+d2half*d2half}} \\approx ${side}\\) cm</p>`,
      img: _svgDataURI(svg), imgAlt: `Kite with diagonals ${d1half*2} cm and ${d2half*2} cm`,
      hint: "The diagonals cross at right angles — look for the right-angled triangles formed.",
      ncea: { standard: "N/A", ao: "NZC-L5-GM" }
    };
  }
};

// ─── LEVELS g/h: Word Problems ────────────────────────────────────────

const _WP_GENS = [
  () => {
    const hyp = rand(5, 13), base = rand(2, hyp - 2);
    const ht = r2(Math.sqrt(hyp*hyp - base*base));
    if (isNaN(ht) || ht <= 0) return null;
    const W = 220, H = 150;
    return {
      q: `A ladder ${hyp} m long leans against a wall. The foot is ${base} m from the wall. How high up the wall does it reach?`,
      a: `Height \\approx ${ht}`, units: ["m"], tolerance: 0.05, requireUnits: true,
      working: `<p>\\(h^2 = c^2 - d^2 = ${hyp}^2 - ${base}^2 = ${hyp*hyp} - ${base*base} = ${r2(hyp*hyp-base*base)}\\)<br>\\(h = \\sqrt{${r2(hyp*hyp-base*base)}} \\approx ${ht}\\) m</p>`,
      img: _svgDataURI(_diagLadder(W, H, hyp, base)),
      imgAlt: `Ladder diagram, length ${hyp} m, base ${base} m`
    };
  },
  () => {
    const a = rand(3, 10), b = rand(3, 10), c = r2(Math.sqrt(a*a + b*b));
    const W = 220, H = 150;
    return {
      q: `A ship sails ${a} km north, then ${b} km east. How far is it from the starting point?`,
      a: `Distance \\approx ${c}`, units: ["km"], tolerance: 0.05, requireUnits: true,
      working: `<p>\\(c^2 = ${a}^2 + ${b}^2 = ${a*a+b*b}\\)<br>\\(c = \\sqrt{${a*a+b*b}} \\approx ${c}\\) km</p>`,
      img: _svgDataURI(_diagShip(W, H, a, b)),
      imgAlt: `Ship route diagram, ${a} km N then ${b} km E`
    };
  },
  () => {
    const w = rand(4, 14), h = rand(4, 12), d = r2(Math.sqrt(w*w + h*h));
    const W = 220, H = 150;
    return {
      q: `A field is ${w} m wide and ${h} m long. How long is the diagonal path across it?`,
      a: `Diagonal \\approx ${d}`, units: ["m"], tolerance: 0.05, requireUnits: true,
      working: `<p>\\(c^2 = ${w}^2 + ${h}^2 = ${w*w+h*h}\\)<br>\\(c = \\sqrt{${w*w+h*h}} \\approx ${d}\\) m</p>`,
      img: _svgDataURI(_diagRect(W, H, w, h)),
      imgAlt: `Rectangle field ${w} m × ${h} m`
    };
  },
  () => {
    const dist = rand(4, 12), ht = rand(3, 10), hyp = r2(Math.sqrt(dist*dist + ht*ht));
    const W = 220, H = 150;
    return {
      q: `A lighthouse is ${ht} m tall. A boat is ${dist} m from the base. How far is the boat from the top of the lighthouse?`,
      a: `Distance \\approx ${hyp}`, units: ["m"], tolerance: 0.05, requireUnits: true,
      working: `<p>\\(c^2 = ${dist}^2 + ${ht}^2 = ${dist*dist+ht*ht}\\)<br>\\(c = \\sqrt{${dist*dist+ht*ht}} \\approx ${hyp}\\) m</p>`,
      img: _svgDataURI(_diagLighthouse(W, H, dist, ht)),
      imgAlt: `Lighthouse ${ht} m tall, boat ${dist} m away`
    };
  },
  () => {
    const run = rand(3, 10), rise = rand(2, 8), sl = r2(Math.sqrt(run*run + rise*rise));
    const W = 220, H = 150;
    return {
      q: `A ramp rises ${rise} m over a horizontal distance of ${run} m. What is the length of the ramp surface?`,
      a: `Ramp \\approx ${sl}`, units: ["m"], tolerance: 0.05, requireUnits: true,
      working: `<p>\\(c^2 = ${run}^2 + ${rise}^2 = ${run*run+rise*rise}\\)<br>\\(c = \\sqrt{${run*run+rise*rise}} \\approx ${sl}\\) m</p>`,
      img: _svgDataURI(_diagRamp(W, H, run, rise)),
      imgAlt: `Ramp diagram, run ${run} m, rise ${rise} m`
    };
  },
  () => {
    const w = rand(10, 26), h = rand(8, 20), d = r2(Math.sqrt(w*w + h*h));
    const W = 220, H = 150;
    return {
      q: `A TV screen is ${w} cm wide and ${h} cm tall. What is the diagonal screen size?`,
      a: `Diagonal \\approx ${d}`, units: ["cm"], tolerance: 0.05, requireUnits: true,
      working: `<p>\\(c^2 = ${w}^2 + ${h}^2 = ${w*w+h*h}\\)<br>\\(c = \\sqrt{${w*w+h*h}} \\approx ${d}\\) cm</p>`,
      img: _svgDataURI(_diagTV(W, H, w, h)),
      imgAlt: `TV screen ${w} cm × ${h} cm`
    };
  },
];

const _genWP = () => {
  let p = null;
  while (!p) { p = _WP_GENS[rand(0, _WP_GENS.length - 1)](); }
  return p;
};

const _genWordProblemG = (diff) => {
  const uid = makeUID("WP", "g", diff);
  const p = _genWP();
  return {
    uid, level: "g", diff, type: "NUMERIC",
    q: p.q, a: p.a, units: p.units, tolerance: p.tolerance, requireUnits: true,
    working: p.working,
    img: p.img, imgAlt: p.imgAlt,
    hint: "A diagram is shown — identify which sides are a, b, c, then apply \\(c^2 = a^2 + b^2\\).",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" }
  };
};

const _genContextH = (diff) => {
  const uid = makeUID("CTX", "h", diff);
  const p = _genWP();
  return {
    uid, level: "h", diff, type: "NUMERIC",
    q: p.q, a: p.a, units: p.units, tolerance: p.tolerance, requireUnits: true,
    working: p.working,
    img: "",          // no image on front — student draws their own
    imgAlt: "",
    imgAns: p.img,    // diagram revealed on solution flip
    imgAnsAlt: p.imgAlt,
    hint: "Draw a diagram, label the sides, then apply \\(c^2 = a^2 + b^2\\).",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" }
  };
};

// ─── SPOT_ERROR / VALUE ───────────────────────────────────────────────

const _genSpotError = (diff) => {
  const uid = makeUID("SPOT_ERROR", "spot", diff);
  const triple = TRIPLES[rand(0, TRIPLES.length - 1)];
  const [a, b, c] = triple;
  const errType = rand(1, 3);
  let tokens, correctErrorId, errorExplanation;

  if (errType === 1) {
    // Wrong squaring: a×2 instead of a²
    const wrongA2 = a * 2;
    tokens = [`\\(${a}^2\\)`, `\\(${b}^2\\)`, `\\(${wrongA2}\\)`, `\\(${b*b}\\)`, `\\(${wrongA2+b*b}\\)`, `\\(c=${Math.round(Math.sqrt(wrongA2+b*b)*100)/100}\\)`];
    correctErrorId = 2; // 0-indexed: token index 2
    errorExplanation = `Token 3 is wrong: \\(${a}^2 = ${a*a}\\), not \\(${wrongA2}\\). The student doubled instead of squaring.`;
  } else if (errType === 2) {
    // Arithmetic error in addition
    const wrongSum = a*a + b*b + rand(1, 5);
    tokens = [`\\(${a}^2\\)`, `\\(${b}^2\\)`, `\\(${a*a}\\)`, `\\(${b*b}\\)`, `\\(${wrongSum}\\)`, `\\(c=${c}\\)`];
    correctErrorId = 4;
    errorExplanation = `Token 5 is wrong: \\(${a*a} + ${b*b} = ${a*a+b*b}\\), not \\(${wrongSum}\\). Arithmetic error in the addition.`;
  } else {
    // Forgot to take square root
    tokens = [`\\(${a}^2\\)`, `\\(${b}^2\\)`, `\\(${a*a}\\)`, `\\(${b*b}\\)`, `\\(${a*a+b*b}\\)`, `\\(c=${a*a+b*b}\\)`];
    correctErrorId = 5;
    errorExplanation = `Token 6 is wrong: after finding \\(c^2 = ${a*a+b*b}\\), the student forgot to take the square root. \\(c = \\sqrt{${a*a+b*b}} = ${c}\\), not \\(${a*a+b*b}\\).`;
  }

  return {
    uid, level: "spot", diff, type: "SPOT_ERROR", subtype: "VALUE",
    q: `A student finds the hypotenuse of a triangle with legs ${a} cm and ${b} cm. Click the token that contains the error:`,
    tokens, correctErrorId, errorExplanation,
    a: `Error at token ${correctErrorId + 1}. Correct answer: \\(c = ${c}\\) cm`,
    working: `<p><strong>Error:</strong> ${errorExplanation}</p>` +
      `<p><strong>Correct working:</strong><br>\\(c^2 = ${a}^2 + ${b}^2 = ${a*a} + ${b*b} = ${a*a+b*b}\\)<br>` +
      `\\(c = \\sqrt{${a*a+b*b}} = ${c}\\) cm</p>`,
    img: "", imgAlt: "",
    hint: "Check each value: is the squaring correct? Is the addition right? Was the square root taken?",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" },
    units: [], tolerance: 0
  };
};

// ─── EXPLANATION ──────────────────────────────────────────────────────

const _EXPLANATIONS = [
  {
    diff: 1,
    q: "Explain why you need to draw a perpendicular height before you can use Pythagoras' Theorem in an equilateral triangle.",
    modelAnswer: "Pythagoras' Theorem only applies to right-angled triangles. An equilateral triangle has no right angle. By drawing the perpendicular height from one vertex to the opposite side, we create two right-angled triangles. We can then apply Pythagoras' Theorem to find the height.",
    markingChecklist: [
      "States that Pythagoras' Theorem only applies to right-angled triangles",
      "Explains that the altitude creates two right-angled triangles",
      "Identifies the height as the unknown side"
    ]
  },
  {
    diff: 2,
    q: "Explain how you use Pythagoras' Theorem to find the distance between two points on a coordinate grid.",
    modelAnswer: "Draw a right-angled triangle where the straight-line distance is the hypotenuse. The horizontal leg has length |x₂ − x₁| and the vertical leg has length |y₂ − y₁|. Apply: d = √[(x₂−x₁)² + (y₂−y₁)²].",
    markingChecklist: [
      "Identifies horizontal and vertical distances as the two shorter sides",
      "States the distance formula using Pythagoras' Theorem",
      "Explains the straight-line distance is the hypotenuse"
    ]
  },
  {
    diff: 3,
    q: "Explain why the converse of Pythagoras' Theorem can be used to check if a triangle is right-angled. Give an example.",
    modelAnswer: "The converse states: if a² + b² = c² (where c is the longest side), then the triangle is right-angled. Example: for sides 5, 12, 13: 5² + 12² = 25 + 144 = 169 = 13². ✓ Right-angled.",
    markingChecklist: [
      "Correctly states the converse: if a²+b²=c² then right-angled",
      "Identifies c as the longest side",
      "Gives a correct numerical example"
    ]
  },
  {
    diff: 1,
    q: "A quadratic gives solutions x = 6 and x = −10 when solving a Pythagoras problem. Explain which to use and why.",
    modelAnswer: "Only x = 6 is valid. The variable x represents a length, and lengths cannot be negative. The solution x = −10 must be rejected.",
    markingChecklist: [
      "States that x = 6 is the valid solution",
      "Explains that lengths cannot be negative",
      "States that x = −10 is rejected"
    ]
  },
  {
    diff: 2,
    q: "A builder says: 'I use the 3-4-5 rule to check that a corner is a right angle.' Explain how this works.",
    modelAnswer: "Measure 3 units along one wall, 4 units along the adjacent wall. If the distance between those two marks is exactly 5, then 3² + 4² = 5², confirming a right angle by the converse of Pythagoras' Theorem.",
    markingChecklist: [
      "Describes measuring 3 and 4 units along the walls",
      "States the diagonal should be 5 units",
      "References Pythagoras' Theorem or its converse"
    ]
  },
  {
    diff: 3,
    q: "Describe the strategy for solving a problem where Pythagoras must be applied twice in sequence.",
    modelAnswer: "First identify which right-angled triangle gives an intermediate unknown. Solve that triangle exactly (keeping the full decimal). Then use that intermediate value as a known side in the second triangle and apply Pythagoras again. Avoid rounding early — it accumulates error.",
    markingChecklist: [
      "Identifies two separate right-angled triangles in the problem",
      "States the importance of finding the intermediate length first",
      "Warns against rounding intermediate values before the final step"
    ]
  },
];

const _genExplanation = (diff) => {
  const uid = makeUID("EXPLANATION", "explain", diff);
  const matching = _EXPLANATIONS.filter(e => e.diff === diff);
  const e = matching.length ? matching[rand(0, matching.length - 1)] : _EXPLANATIONS[0];
  return {
    uid, level: "explain", diff, type: "EXPLANATION",
    q: e.q,
    modelAnswer: e.modelAnswer,
    markingChecklist: e.markingChecklist,
    a: e.modelAnswer,
    working: `<p><strong>Model answer:</strong> ${e.modelAnswer}</p>`,
    img: "", imgAlt: "",
    hint: "Think it through carefully, then flip for the model answer and marking checklist.",
    ncea: { standard: "N/A", ao: "NZC-L5-GM" },
    units: [], tolerance: 0
  };
};

// ── 8. CONFIG OBJECT ──────────────────────────────────────────────────

const config = {
  id: "pythagoras-trainer",
  title: "Pythagoras' Theorem — Trainer",
  levelNames: [
    "Vocabulary & Prerequisites",   // 1  (a)
    "Pythagoras Basics",             // 2  (b)
    "Find the Hypotenuse (on diagram)",   // 3  (c1)
    "Find the Hypotenuse (offset)",       // 4  (c2)
    "Find a Shorter Side (on diagram)",   // 5  (d1)
    "Find a Shorter Side (offset)",       // 6  (d2)
    "Mixed (c & d)",                 // 7  (e)
    "Other Triangles",               // 8  (f)
    "Word Problems (with diagram)",  // 9  (g)
    "Context Problems (draw your own)", // 10 (h)
    "Spot the Error",                // 11 (spot)
    "Explain It",                    // 12 (explain)
  ],

  // Maps qs_fwk numeric level integers to this module's string keys
  _levelMap: {
    1: "a", 2: "b", 3: "c1", 4: "c2", 5: "d1", 6: "d2", 
    7: "e", 8: "f", 9: "g", 10: "h", 11: "spot", 12: "explain"
  },

  _qPools: {},

  _buildPool(level) {
    const pool = [];

    if (level === "a") {
      // 12 vocab/prerequisite cards, diff spread 1–2
      for (let i = 0; i < 12; i++) pool.push(_genVocabA(i < 6 ? 1 : 2));
    } else if (level === "b") {
      // Mix: 5 TRI_ID, 4 MCQ, 3 TRI_LABEL
      for (let i = 0; i < 5; i++) pool.push(_genTriIdB(i < 3 ? 1 : 2));
      for (let i = 0; i < 4; i++) pool.push(_genHypMCQB(i < 2 ? 1 : 2));
      for (let i = 0; i < 3; i++) pool.push(_genLabelB(i < 2 ? 1 : 2));
    } else if (level === "c1") {
      // 12 cards: 6 integer triples (diff 1), 6 decimals (diff 2)
      for (let i = 0; i < 6; i++) pool.push(_genHypC(1, false));
      for (let i = 0; i < 6; i++) pool.push(_genHypC(2, false));
    } else if (level === "c2") {
      for (let i = 0; i < 6; i++) pool.push(_genHypC(1, true));
      for (let i = 0; i < 6; i++) pool.push(_genHypC(2, true));
    } else if (level === "d1") {
      for (let i = 0; i < 6; i++) pool.push(_genLegD(1, false));
      for (let i = 0; i < 6; i++) pool.push(_genLegD(2, false));
    } else if (level === "d2") {
      for (let i = 0; i < 6; i++) pool.push(_genLegD(1, true));
      for (let i = 0; i < 6; i++) pool.push(_genLegD(2, true));
    } else if (level === "e") {
      // Mixed: 3 from each c/d variant
      pool.push(...[false,true].flatMap(off => [
        ...Array.from({length:3}, () => _genHypC(rand(1,2), off)),
        ...Array.from({length:3}, () => _genLegD(rand(1,2), off)),
      ]));
    } else if (level === "f") {
      // 3 of each shape type (diffs 1–4)
      for (let d = 1; d <= 4; d++)
        for (let i = 0; i < 3; i++) pool.push(_genOtherF(d));
    } else if (level === "g") {
      for (let i = 0; i < 12; i++) pool.push(_genWordProblemG(rand(1, 3)));
    } else if (level === "h") {
      for (let i = 0; i < 12; i++) pool.push(_genContextH(rand(1, 3)));
    } else if (level === "spot") {
      for (let i = 0; i < 12; i++) pool.push(_genSpotError(rand(1, 3)));
    } else if (level === "explain") {
      for (let d = 1; d <= 3; d++)
        for (let i = 0; i < 4; i++) pool.push(_genExplanation(d));
    }

    return shuffle(pool);
  },

  getQuestion(levelNum, diff) {
    const level = this._levelMap[levelNum] || levelNum;
    if (!this._qPools[level] || this._qPools[level].length === 0) {
      this._qPools[level] = this._buildPool(level);
    }
    if (diff !== undefined && diff !== null) {
      const idx = this._qPools[level].findIndex(q => q.diff === diff);
      if (idx !== -1) return this._qPools[level].splice(idx, 1)[0];
    }
    const q = pickAndRemove(this._qPools[level]);
    if (q !== undefined) return q;
    // Pool exhausted mid-call — rebuild and try once more
    this._qPools[level] = this._buildPool(level);
    return pickAndRemove(this._qPools[level]);
  },

  generateSolution(q) {
    if (q.type === "EXPLANATION") {
      let html = `<p><strong>Model answer:</strong> ${q.modelAnswer}</p>`;
      if (q.markingChecklist && q.markingChecklist.length) {
        html += `<ul class="yama-checklist">` +
          q.markingChecklist.map(item => `<li>${item}</li>`).join("") +
          `</ul>`;
      }
      return html;
    }

    if (q.type === "SPOT_ERROR") {
      return q.working || `<p><strong>Error:</strong> ${q.errorExplanation}</p>`;
    }

    if (q.type === "MCQ") {
      const correct = q.options[q.correctOption];
      return `<p><strong>Correct answer: ${correct}</strong></p>` + (q.working || "");
    }

    // NUMERIC / TEXT / TRI_ID / TRI_LABEL / WP / CTX
    let html = "";
    // For CTX (context problems) reveal the diagram on the solution side
    if (q.imgAns) {
      html += `<img src="${q.imgAns}" alt="${q.imgAnsAlt || ""}" style="display:block;margin:0 auto 12px auto;max-width:100%"/>`;
    }
    html += q.working || `<p><strong>Answer: ${q.a}${q.units && q.units[0] ? " " + q.units[0] : ""}</strong></p>`;
    return html;
  },

  referenceItems: [
    { label: "Pyth",  title: "Pythagoras' Theorem",   text: "For any right-angled triangle with hypotenuse c:", math: "a^2 + b^2 = c^2" },
    { label: "Hyp",   title: "Finding the Hypotenuse", text: "Given the two shorter sides a and b:",             math: "c = \\sqrt{a^2 + b^2}" },
    { label: "Leg",   title: "Finding a Shorter Side",  text: "Given hypotenuse c and one shorter side a:",      math: "b = \\sqrt{c^2 - a^2}" },
    { label: "Conv",  title: "Converse of Pythagoras",  text: "If a²+b²=c², the triangle is right-angled:",      math: "a^2 + b^2 = c^2 \\Rightarrow \\text{right-angled}" },
    { label: "Dist",  title: "Distance Between Two Points", text: "Distance between (x₁,y₁) and (x₂,y₂):",    math: "d = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}" },
  ],

  referenceLabel: "Formulae"
};

export default config;
