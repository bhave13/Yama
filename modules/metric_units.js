// ── 1. HEADER COMMENT ─────────────────────────────────────────────────
// Topic:        Metric Unit Conversions
// NCEA Level:   N/A   Standard: N/A
// Year Group:   Year 9
// Generated:    2026-05-04
// Type Mix:     35% NUMERIC, 20% MCQ, 15% MATCH, 15% SPOT_ERROR/VALUE,
//               10% EXPLANATION, 5% TEXT
//               SPOT_ERROR/STEP included at Level 10 (Challenge)

// ── 2. UTILITY FUNCTIONS ──────────────────────────────────────────────

let _uidCounter = 0;

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randF(min, max, dp) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(dp));
}

function pickAndRemove(arr) {
  const i = rand(0, arr.length - 1);
  return arr.splice(i, 1)[0];
}

function makeUID(type, level, diff) {
  _uidCounter++;
  const abbr = {
    'NUMERIC':           'num',
    'MCQ':               'mcq',
    'MATCH':             'mat',
    'SPOT_ERROR/STEP':   'sep',
    'SPOT_ERROR/VALUE':  'sev',
    'EXPLANATION':       'exp',
    'TEXT':              'txt'
  };
  const n = String(_uidCounter).padStart(3, '0');
  return `${abbr[type] || 'unk'}-${n}-lev${level}-d${diff}`;
}

// ── makeSVG helpers ────────────────────────────────────────────────────

function makeSVGConvert(fromVal, fromUnit, op, factor, toUnit) {
  const opSym = op === 'times' ? '&times;' : '&divide;';
  const factorStr = factor >= 1000000 ? factor.toLocaleString() : String(factor);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 110" width="420" height="110">
  <rect x="8" y="22" width="108" height="66" rx="10" fill="#EBF5FB" stroke="#2980B9" stroke-width="2"/>
  <text x="62" y="52" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="bold" fill="#1A5276">${fromVal}</text>
  <text x="62" y="74" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#1A5276">${fromUnit}</text>
  <line x1="116" y1="55" x2="196" y2="55" stroke="#555" stroke-width="2"/>
  <polygon points="196,50 210,55 196,60" fill="#555"/>
  <rect x="128" y="36" width="68" height="28" rx="6" fill="#FEF9E7" stroke="#F39C12" stroke-width="1.5"/>
  <text x="162" y="55" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#784212">${opSym} ${factorStr}</text>
  <rect x="212" y="22" width="108" height="66" rx="10" fill="#EAFAF1" stroke="#27AE60" stroke-width="2"/>
  <text x="266" y="52" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="bold" fill="#1E8449">?</text>
  <text x="266" y="74" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#1E8449">${toUnit}</text>
  <rect x="334" y="22" width="80" height="66" rx="10" fill="#F5F5F5" stroke="#AAA" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="374" y="48" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#666">larger &#8594; smaller</text>
  <text x="374" y="63" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#666">multiply</text>
  <text x="374" y="78" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#666">smaller &#8594; larger</text>
  <text x="374" y="78" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#666">divide</text>
</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function makeSVGChain(units, op1, op2) {
  // 3-box chain: unit[0] → op1 → unit[1] → op2 → unit[2]
  const u0 = units[0], u1 = units[1], u2 = units[2];
  const s1 = op1.sym, f1 = op1.factor;
  const s2 = op2.sym, f2 = op2.factor;
  const fmt = f => f >= 1000 ? f.toLocaleString() : String(f);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 90" width="500" height="90">
  <rect x="5" y="15" width="80" height="60" rx="8" fill="#EBF5FB" stroke="#2980B9" stroke-width="2"/>
  <text x="45" y="43" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#1A5276">${u0}</text>
  <line x1="85" y1="45" x2="145" y2="45" stroke="#555" stroke-width="2"/>
  <polygon points="145,40 158,45 145,50" fill="#555"/>
  <rect x="93" y="28" width="52" height="24" rx="5" fill="#FEF9E7" stroke="#F39C12" stroke-width="1.5"/>
  <text x="119" y="44" text-anchor="middle" font-family="Arial" font-size="11" fill="#784212">${s1} ${fmt(f1)}</text>
  <rect x="160" y="15" width="80" height="60" rx="8" fill="#EAFAF1" stroke="#27AE60" stroke-width="2"/>
  <text x="200" y="43" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#1E8449">${u1}</text>
  <line x1="240" y1="45" x2="300" y2="45" stroke="#555" stroke-width="2"/>
  <polygon points="300,40 313,45 300,50" fill="#555"/>
  <rect x="248" y="28" width="52" height="24" rx="5" fill="#FEF9E7" stroke="#F39C12" stroke-width="1.5"/>
  <text x="274" y="44" text-anchor="middle" font-family="Arial" font-size="11" fill="#784212">${s2} ${fmt(f2)}</text>
  <rect x="315" y="15" width="80" height="60" rx="8" fill="#FDEDEC" stroke="#E74C3C" stroke-width="2"/>
  <text x="355" y="43" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#922B21">?</text>
  <text x="355" y="62" text-anchor="middle" font-family="Arial" font-size="11" fill="#922B21">${u2}</text>
</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function makeSVGTimeClock(label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <circle cx="80" cy="80" r="70" fill="#FFF9C4" stroke="#F9A825" stroke-width="3"/>
  <text x="80" y="58" text-anchor="middle" font-family="Arial" font-size="13" fill="#555">60 sec</text>
  <text x="80" y="76" text-anchor="middle" font-family="Arial" font-size="13" fill="#555">= 1 min</text>
  <text x="80" y="94" text-anchor="middle" font-family="Arial" font-size="13" fill="#555">60 min</text>
  <text x="80" y="112" text-anchor="middle" font-family="Arial" font-size="13" fill="#555">= 1 hr</text>
  <text x="80" y="132" text-anchor="middle" font-family="Arial" font-size="11" fill="#888">${label}</text>
</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// ── 3. CONTEXT POOLS ──────────────────────────────────────────────────

const _ctxSrc = {
  6: [
    'A length of timber', 'A piece of rope', 'A fence post', 'A garden path',
    'A water pipe', 'A steel cable', 'A school corridor', 'A building foundation',
    'A running track section', 'A roll of fabric', 'A bridge span', 'A hiking trail'
  ],
  7: [
    'A builder measures a wall', 'A farmer checks a fence line',
    'A student measures a desk', 'A plumber checks a pipe run',
    'An athlete checks a track', 'A chef weighs ingredients',
    'A scientist measures a sample', 'A courier weighs a parcel',
    'A swimmer checks a pool length', 'A gardener measures compost'
  ],
  9: [
    'a sprint race', 'a cooking timer', 'a download time', 'a bus journey',
    'a netball quarter', 'a school period', 'a lap time', 'a concert set'
  ],
  11: [
    { ctx: 'A kiwifruit orchard in Hawke\'s Bay', mass: true, volume: false },
    { ctx: 'A construction site in Auckland', mass: false, volume: false },
    { ctx: 'A farm water tank in Canterbury', mass: false, volume: true },
    { ctx: 'A 5 km road race in Wellington', mass: false, volume: false },
    { ctx: 'A school hāngī preparation', mass: true, volume: false },
    { ctx: 'A courier depot in Christchurch', mass: true, volume: false },
    { ctx: 'A swimming pool in Hamilton', mass: false, volume: true },
    { ctx: 'A dairy farm in Waikato', mass: false, volume: true },
    { ctx: 'A beach clean-up in Northland', mass: true, volume: false },
    { ctx: 'A school athletics day in Dunedin', mass: false, volume: false }
  ]
};

const _ctxPools = {};

function _getCtx(level) {
  if (!_ctxPools[level] || _ctxPools[level].length === 0) {
    _ctxPools[level] = _ctxSrc[level] ? [..._ctxSrc[level]] : ['A measurement'];
  }
  return pickAndRemove(_ctxPools[level]);
}

// ── LEVEL 1: Multiply and Divide by Powers of Ten ─────────────────────

function _l1Numeric(diff) {
  const factors = diff <= 3 ? [10, 100, 1000] : [10000, 1000000];
  const factor  = factors[rand(0, factors.length - 1)];
  const opMult  = rand(0, 1) === 0;
  let num, a, qText, wk;

  if (diff === 1) {
    if (opMult) {
      num = rand(2, 99);
      a   = num * factor;
      qText = `Calculate \\(${num} \\times ${factor.toLocaleString()}\\)`;
      wk    = `<p>\\(${num} \\times ${factor.toLocaleString()} = ${a.toLocaleString()}\\)</p>`;
    } else {
      a   = rand(2, 99);
      num = a * factor;
      qText = `Calculate \\(${num.toLocaleString()} \\div ${factor.toLocaleString()}\\)`;
      wk    = `<p>\\(${num.toLocaleString()} \\div ${factor.toLocaleString()} = ${a}\\)</p>`;
    }
  } else if (diff === 2) {
    const d1 = rand(1, 3);
    if (opMult) {
      num = randF(1, 50, d1);
      a   = parseFloat((num * factor).toFixed(Math.max(0, d1 - String(factor).length + 1)));
      qText = `Calculate \\(${num} \\times ${factor.toLocaleString()}\\)`;
      wk    = `<p>Move the decimal point ${String(factor).length - 1} place(s) to the right.</p><p>\\(${num} \\times ${factor.toLocaleString()} = ${a}\\)</p>`;
    } else {
      a   = randF(1, 50, d1);
      num = parseFloat((a * factor).toFixed(0));
      qText = `Calculate \\(${num.toLocaleString()} \\div ${factor.toLocaleString()}\\)`;
      wk    = `<p>Move the decimal point ${String(factor).length - 1} place(s) to the left.</p><p>\\(${num.toLocaleString()} \\div ${factor.toLocaleString()} = ${a}\\)</p>`;
    }
  } else if (diff === 3) {
    // fraction × power of 10
    const numer = rand(1, 9);
    const denoms = [2, 4, 5, 8, 10, 20];
    const denom  = denoms[rand(0, denoms.length - 1)];
    const f2     = [10, 100, 1000][rand(0, 2)];
    a = parseFloat(((numer / denom) * f2).toFixed(4));
    qText = `Calculate \\(\\dfrac{${numer}}{${denom}} \\times ${f2.toLocaleString()}\\)`;
    wk    = `<p>\\(\\dfrac{${numer}}{${denom}} \\times ${f2} = \\dfrac{${numer} \\times ${f2}}{${denom}} = \\dfrac{${numer * f2}}{${denom}} = ${a}\\)</p>`;
  } else {
    // diff 4: large factor or tiny decimal
    const bigFactors = [10000, 100000, 1000000];
    const bf = bigFactors[rand(0, bigFactors.length - 1)];
    if (opMult) {
      num = randF(0.001, 0.05, 4);
      a   = parseFloat((num * bf).toFixed(2));
      qText = `Calculate \\(${num} \\times ${bf.toLocaleString()}\\)`;
      wk    = `<p>\\(${num} \\times ${bf.toLocaleString()} = ${a}\\)</p>`;
    } else {
      a   = rand(2, 99);
      num = a * bf;
      qText = `Calculate \\(${num.toLocaleString()} \\div ${bf.toLocaleString()}\\)`;
      wk    = `<p>\\(${num.toLocaleString()} \\div ${bf.toLocaleString()} = ${a}\\)</p>`;
    }
  }

  return {
    uid: makeUID('NUMERIC', 1, diff), level: 1, diff, type: 'NUMERIC',
    q: qText, working: wk, img: '', imgAlt: '', hint: 'Count how many zeros the multiplier has — that tells you how many places to move the decimal point.',
    ncea: { standard: 'N/A', ao: 'N/A' },
    a: String(a), units: [], tolerance: 0.001
  };
}

function _l1MCQ(diff) {
  const factors = diff <= 3 ? [10, 100, 1000] : [10000, 1000000];
  const factor  = factors[rand(0, factors.length - 1)];
  const opMult  = rand(0, 1) === 0;
  let num, correct, qText;

  if (diff <= 2) {
    if (opMult) {
      num     = diff === 1 ? rand(2, 99) : randF(1.1, 20, 1);
      correct = parseFloat((num * factor).toFixed(6));
    } else {
      correct = diff === 1 ? rand(2, 99) : randF(1.1, 20, 1);
      num     = parseFloat((correct * factor).toFixed(0));
    }
    qText = opMult
      ? `What is \\(${num} \\times ${factor.toLocaleString()}\\)?`
      : `What is \\(${num.toLocaleString()} \\div ${factor.toLocaleString()}\\)?`;
  } else if (diff === 3) {
    const numer = rand(1, 9);
    const denoms = [2, 4, 5, 10];
    const denom  = denoms[rand(0, denoms.length - 1)];
    const f2     = [10, 100, 1000][rand(0, 2)];
    correct = parseFloat(((numer / denom) * f2).toFixed(4));
    num     = numer + '/' + denom;
    qText   = `What is \\(\\dfrac{${numer}}{${denom}} \\times ${f2.toLocaleString()}\\)?`;
  } else {
    const bf = [10000, 1000000][rand(0, 1)];
    num     = rand(2, 50);
    correct = num * bf; //ensures that the correct answer matches the question.
    qText   = `What is \\(${num} \\times ${bf.toLocaleString()}\\)?`;
  }

  // Distractors based on misconceptions:
  // 1. Correct answer
  // 2. Add zeros without adjusting decimal (e.g. 3.7 × 100 → 3.700 not 370)
  // 3. Move decimal wrong direction
  // 4. Off-by-one power of ten
  const wrongDir = opMult
    ? parseFloat((correct / (factor * factor)).toFixed(6))
    : parseFloat((correct * (factor * factor)).toFixed(6));
  const offPow = opMult
    ? parseFloat((correct / 10).toFixed(6))
    : parseFloat((correct * 10).toFixed(6));
  const addZeros = opMult
    ? parseFloat((String(correct) + '0').replace(/\.?0+$/, ''))
    : parseFloat((correct / factor * 10).toFixed(6));

  const distractorSet = [wrongDir, offPow, addZeros].filter(d => d !== correct && d > 0 && isFinite(d));
  while (distractorSet.length < 3) {
    const extra = parseFloat((correct * (rand(2, 5))).toFixed(4));
    if (!distractorSet.includes(extra) && extra !== correct) distractorSet.push(extra);
  }

  const opts  = [String(correct), String(distractorSet[0]), String(distractorSet[1]), String(distractorSet[2])];
  // shuffle
  for (let i = opts.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  const correctOption = opts.indexOf(String(correct));

  return {
    uid: makeUID('MCQ', 1, diff), level: 1, diff, type: 'MCQ',
    q: qText, working: `<p><strong>Correct answer: ${correct}</strong></p><p>Each zero in the multiplier moves the decimal point one place (right for ×, left for ÷).</p>`,
    img: '', imgAlt: '', hint: '',
    ncea: { standard: 'N/A', ao: 'N/A' },
    options: opts, correctOption
  };
}

// ── LEVEL 2: Length Conversion Facts ──────────────────────────────────

// All length facts: [from, to, factor, label]
const _lenFacts = [
  ['km', 'm',   1000,    '1 km = 1000 m'],
  ['m',  'cm',  100,     '1 m = 100 cm'],
  ['cm', 'mm',  10,      '1 cm = 10 mm'],
  ['m',  'mm',  1000,    '1 m = 1000 mm'],
  ['km', 'cm',  100000,  '1 km = 100 000 cm'],
  ['km', 'mm',  1000000, '1 km = 1 000 000 mm']
];

function _l2MCQ(diff) {
  // diff 1: km↔m or m↔cm  diff 2: cm↔mm  diff 3: unit fractions  diff 4: non-adjacent
  let fact, qText, opts, correct;
  if (diff === 1) {
    fact = _lenFacts[rand(0, 1)];
    qText = `How many <strong>${fact[1]}</strong> are in one <strong>${fact[0]}</strong>?`;
    correct = String(fact[2]);
    const wrong = [String(fact[2] * 10), String(fact[2] / 10), '100'].filter(x => x !== correct);
    opts = [correct, wrong[0], wrong[1], wrong[2]].slice(0, 4);
  } else if (diff === 2) {
    fact = _lenFacts[2]; // cm → mm
    qText = `How many <strong>millimetres</strong> are in one <strong>centimetre</strong>?`;
    correct = '10';
    opts = ['10', '100', '1000', '1'];
  } else if (diff === 3) {
    // Unit fraction going upward
    const pairs = [['mm', 'm', 1000], ['cm', 'm', 100], ['m', 'km', 1000], ['mm', 'km', 1000000]];
    const p = pairs[rand(0, pairs.length - 1)];
    qText = `Complete: \\(1 \\text{ ${p[0]}} = \\dfrac{1}{\\square} \\text{ ${p[1]}}\\)<br>What is the missing number?`;
    correct = String(p[2]);
    opts = [correct, String(p[2] * 10), String(p[2] / 10), '60'].filter((v, i, a) => a.indexOf(v) === i);
    while (opts.length < 4) opts.push(String(rand(2, 9) * 100));
    opts = opts.slice(0, 4);
  } else {
    fact = _lenFacts[rand(4, 5)];
    qText = `How many <strong>${fact[1]}</strong> are in one <strong>${fact[0]}</strong>?`;
    correct = String(fact[2]);
    opts = [correct, '1000', '100000', '10000000'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
  }
  // shuffle opts
  for (let i = opts.length - 1; i > 0; i--) {
    const j = rand(0, i); [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  const correctOption = opts.indexOf(correct);
  return {
    uid: makeUID('MCQ', 2, diff), level: 2, diff, type: 'MCQ',
    q: qText, working: `<p><strong>Answer: ${correct}</strong></p><p>${fact ? fact[3] : ''}</p>`,
    img: '', imgAlt: '', hint: 'The metric prefix kilo- means 1000, centi- means 1/100, milli- means 1/1000.',
    ncea: { standard: 'N/A', ao: 'N/A' },
    options: opts, correctOption
  };
}

function _l2Match(diff) {
  let pairs;
  if (diff === 1) {
    pairs = [
      { left: '1 km = ___ m',  right: '1000' },
      { left: '1 m = ___ cm',  right: '100'  },
      { left: '1 cm = ___ mm', right: '10'   },
      { left: '1 m = ___ mm',  right: '1000' }
    ];
  } else if (diff === 2) {
    pairs = [
      { left: 'kilometres → metres',   right: '× 1000' },
      { left: 'metres → centimetres',  right: '× 100'  },
      { left: 'centimetres → millimetres', right: '× 10' },
      { left: 'millimetres → centimetres', right: '÷ 10' }
    ];
  } else if (diff === 3) {
    pairs = [
      { left: '1 mm = \\(\\frac{1}{?}\\) m', right: '1000' },
      { left: '1 cm = \\(\\frac{1}{?}\\) m', right: '100'  },
      { left: '1 m = \\(\\frac{1}{?}\\) km', right: '1000' },
      { left: '1 mm = \\(\\frac{1}{?}\\) km', right: '1 000 000' }
    ];
  } else {
    pairs = [
      { left: '1 km = ___ cm',  right: '100 000'    },
      { left: '1 km = ___ mm',  right: '1 000 000'  },
      { left: '1 m = ___ mm',   right: '1000'       },
      { left: '1 km = ___ m',   right: '1000'       }
    ];
  }
  // shuffle
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = rand(0, i); [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  const pairsHtml = pairs.map(p => `<tr><td>${p.left}</td><td>${p.right}</td></tr>`).join('');
  return {
    uid: makeUID('MATCH', 2, diff), level: 2, diff, type: 'MATCH',
    q: 'Match each length conversion to its correct value.',
    working: `<p><strong>Correct pairs:</strong></p><table>${pairsHtml}</table>`,
    img: '', imgAlt: '', hint: '',
    ncea: { standard: 'N/A', ao: 'N/A' },
    pairs
  };
}

function _l2Text(diff) {
  const items = [
    { q: '1 km = ___ m',   a: '1000', hint: 'kilo- means 1000' },
    { q: '1 m = ___ cm',   a: '100',  hint: 'centi- means 1/100, so 100 centimetres in a metre' },
    { q: '1 cm = ___ mm',  a: '10',   hint: 'milli- means 1/1000 of a metre; 10 mm per cm' },
    { q: '1 m = ___ mm',   a: '1000', hint: '1 m = 100 cm, 1 cm = 10 mm, so 1 m = 1000 mm' }
  ];
  const item = items[rand(0, items.length - 1)];
  return {
    uid: makeUID('TEXT', 2, diff), level: 2, diff, type: 'TEXT',
    q: `Complete the conversion fact: <strong>${item.q}</strong>`,
    working: `<p><strong>Answer: ${item.a}</strong></p>`,
    img: '', imgAlt: '', hint: item.hint,
    ncea: { standard: 'N/A', ao: 'N/A' },
    a: item.a
  };
}

// ── LEVEL 3: Mass Conversion Facts ────────────────────────────────────

const _massFacts = [
  ['kg', 'g',   1000, '1 kg = 1000 g'],
  ['g',  'mg',  1000, '1 g = 1000 mg'],
  ['mg', 'µg',  1000, '1 mg = 1000 µg'],
  ['t',  'kg',  1000, '1 t = 1000 kg'],
  ['Mt', 't',   1000, '1 Mt = 1000 t']
];

function _l3MCQ(diff) {
  let fact, qText, opts, correct;
  if (diff === 1) {
    fact    = _massFacts[0];
    qText   = 'How many <strong>grams</strong> are in one <strong>kilogram</strong>?';
    correct = '1000';
    opts    = ['1000', '100', '10000', '500'];
  } else if (diff === 2) {
    fact    = _massFacts[rand(1, 2)];
    qText   = `How many <strong>${fact[1]}</strong> are in one <strong>${fact[0]}</strong>?`;
    correct = String(fact[2]);
    opts    = [correct, '100', '10000', '60'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
  } else if (diff === 3) {
    const pairs = [['g', 'kg', 1000], ['mg', 'g', 1000], ['kg', 't', 1000]];
    const p     = pairs[rand(0, pairs.length - 1)];
    qText   = `Complete: \\(1 \\text{ ${p[0]}} = \\dfrac{1}{\\square} \\text{ ${p[1]}}\\)`;
    correct = String(p[2]);
    opts    = [correct, '100', '10000', '10'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
  } else {
    qText   = 'Which unit is 1000 times bigger than a gram and 1000 times smaller than a tonne?';
    correct = 'kilogram (kg)';
    opts    = ['kilogram (kg)', 'milligram (mg)', 'Megatonne (Mt)', 'microgram (µg)'];
  }
  for (let i = opts.length - 1; i > 0; i--) {
    const j = rand(0, i); [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  const correctOption = opts.indexOf(correct);
  return {
    uid: makeUID('MCQ', 3, diff), level: 3, diff, type: 'MCQ',
    q: qText,
    working: `<p><strong>Answer: ${correct}</strong></p><p>${fact ? fact[3] : 'The mass unit chain is: µg → mg → g → kg → t → Mt, each step × 1000.'}</p>`,
    img: '', imgAlt: '', hint: 'Every step in the mass unit chain uses a factor of 1000 — not 100.',
    ncea: { standard: 'N/A', ao: 'N/A' },
    options: opts, correctOption
  };
}

function _l3Match(diff) {
  let pairs;
  if (diff === 1) {
    pairs = [
      { left: '1 kg = ___ g',  right: '1000' },
      { left: '1 g = ___ mg',  right: '1000' },
      { left: '1 t = ___ kg',  right: '1000' },
      { left: '1 mg = ___ µg', right: '1000' }
    ];
  } else if (diff === 2) {
    pairs = [
      { left: 'kilograms → grams',    right: '× 1000' },
      { left: 'grams → kilograms',    right: '÷ 1000' },
      { left: 'grams → milligrams',   right: '× 1000' },
      { left: 'milligrams → grams',   right: '÷ 1000' }
    ];
  } else if (diff === 3) {
    pairs = [
      { left: '1 g = \\(\\frac{1}{?}\\) kg',  right: '1000' },
      { left: '1 mg = \\(\\frac{1}{?}\\) g',  right: '1000' },
      { left: '1 kg = \\(\\frac{1}{?}\\) t',  right: '1000' },
      { left: '1 µg = \\(\\frac{1}{?}\\) mg', right: '1000' }
    ];
  } else {
    pairs = [
      { left: 'µg', right: 'microgram'  },
      { left: 'mg', right: 'milligram'  },
      { left: 'Mt', right: 'Megatonne'  },
      { left: 'µ',  right: 'one-millionth (10⁻⁶)' }
    ];
  }
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = rand(0, i); [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  const pairsHtml = pairs.map(p => `<tr><td>${p.left}</td><td>${p.right}</td></tr>`).join('');
  return {
    uid: makeUID('MATCH', 3, diff), level: 3, diff, type: 'MATCH',
    q: 'Match each mass conversion to its correct value or operation.',
    working: `<p><strong>Correct pairs:</strong></p><table>${pairsHtml}</table>`,
    img: '', imgAlt: '', hint: 'All mass unit steps use a factor of 1000.',
    ncea: { standard: 'N/A', ao: 'N/A' },
    pairs
  };
}

function _l3Text(diff) {
  const items = [
    { q: '1 kg = ___ g',   a: '1000', hint: '1 kilogram = 1000 grams'     },
    { q: '1 g = ___ mg',   a: '1000', hint: '1 gram = 1000 milligrams'     },
    { q: '1 t = ___ kg',   a: '1000', hint: '1 tonne = 1000 kilograms'     },
    { q: '1 mg = ___ µg',  a: '1000', hint: '1 milligram = 1000 micrograms' }
  ];
  const item = items[rand(0, items.length - 1)];
  return {
    uid: makeUID('TEXT', 3, diff), level: 3, diff, type: 'TEXT',
    q: `Complete the conversion fact: <strong>${item.q}</strong>`,
    working: `<p><strong>Answer: ${item.a}</strong></p>`,
    img: '', imgAlt: '', hint: item.hint,
    ncea: { standard: 'N/A', ao: 'N/A' },
    a: item.a
  };
}

// ── LEVEL 4: Volume and Capacity Conversion Facts ─────────────────────

function _l4MCQ(diff) {
  let qText, correct, opts;
  if (diff === 1) {
    qText = 'How many <strong>millilitres</strong> are in one <strong>litre</strong>?';
    correct = '1000'; opts = ['1000', '100', '10', '10000'];
  } else if (diff === 2) {
    qText = 'How many <strong>litres</strong> are in one <strong>kilolitre</strong>?';
    correct = '1000'; opts = ['1000', '100', '10000', '10'];
  } else if (diff === 3) {
    qText = 'One cubic centimetre (cm³) holds how many millilitres?';
    correct = '1'; opts = ['1', '10', '100', '1000'];
  } else {
    qText = 'How many litres are in one cubic metre (m³)?';
    correct = '1000'; opts = ['1000', '100', '10000', '1'];
  }
  for (let i = opts.length - 1; i > 0; i--) {
    const j = rand(0, i); [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return {
    uid: makeUID('MCQ', 4, diff), level: 4, diff, type: 'MCQ',
    q: qText,
    working: `<p><strong>Answer: ${correct}</strong></p>`,
    img: '', imgAlt: '', hint: '',
    ncea: { standard: 'N/A', ao: 'N/A' },
    options: opts, correctOption: opts.indexOf(correct)
  };
}

function _l4Match(diff) {
  let pairs;
  if (diff === 1) {
    pairs = [
      { left: '1 L = ___ mL',    right: '1000' },
      { left: '1 kL = ___ L',    right: '1000' },
      { left: '1 cm³ = ___ mL',  right: '1'    },
      { left: '1 m³ = ___ L',    right: '1000' }
    ];
  } else if (diff === 2) {
    pairs = [
      { left: 'litres → millilitres',  right: '× 1000' },
      { left: 'millilitres → litres',  right: '÷ 1000' },
      { left: 'kilolitres → litres',   right: '× 1000' },
      { left: 'litres → kilolitres',   right: '÷ 1000' }
    ];
  } else if (diff === 3) {
    pairs = [
      { left: '1 mL',   right: '1 cm³'  },
      { left: '1 L',    right: '1000 cm³' },
      { left: '1 kL',   right: '1 m³'   },
      { left: '1000 L', right: '1 m³'   }
    ];
  } else {
    pairs = [
      { left: 'mL',   right: 'millilitre'  },
      { left: 'kL',   right: 'kilolitre'   },
      { left: 'cm³',  right: 'cubic centimetre' },
      { left: 'm³',   right: 'cubic metre' }
    ];
  }
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = rand(0, i); [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  const pairsHtml = pairs.map(p => `<tr><td>${p.left}</td><td>${p.right}</td></tr>`).join('');
  return {
    uid: makeUID('MATCH', 4, diff), level: 4, diff, type: 'MATCH',
    q: 'Match each volume/capacity item to its correct pair.',
    working: `<p><strong>Correct pairs:</strong></p><table>${pairsHtml}</table>`,
    img: '', imgAlt: '', hint: '1 cm³ = 1 mL is an exact equivalence.',
    ncea: { standard: 'N/A', ao: 'N/A' },
    pairs
  };
}

function _l4Text(diff) {
  const items = [
    { q: '1 L = ___ mL',   a: '1000', hint: '1 litre = 1000 millilitres'          },
    { q: '1 kL = ___ L',   a: '1000', hint: '1 kilolitre = 1000 litres'            },
    { q: '1 cm³ = ___ mL', a: '1',    hint: 'Cubic centimetres and millilitres are the same volume.' },
    { q: '1 m³ = ___ L',   a: '1000', hint: 'A 1 m × 1 m × 1 m cube holds 1000 litres.' }
  ];
  const item = items[rand(0, items.length - 1)];
  return {
    uid: makeUID('TEXT', 4, diff), level: 4, diff, type: 'TEXT',
    q: `Complete the conversion fact: <strong>${item.q}</strong>`,
    working: `<p><strong>Answer: ${item.a}</strong></p>`,
    img: '', imgAlt: '', hint: item.hint,
    ncea: { standard: 'N/A', ao: 'N/A' },
    a: item.a
  };
}

// ── LEVEL 5: Time Conversion Facts ────────────────────────────────────

function _l5MCQ(diff) {
  let qText, correct, opts;
  if (diff === 1) {
    const choices = [
      { q: 'How many <strong>seconds</strong> are in one <strong>minute</strong>?', a: '60', opts: ['60', '100', '1000', '24'] },
      { q: 'How many <strong>minutes</strong> are in one <strong>hour</strong>?',   a: '60', opts: ['60', '100', '24', '1000'] }
    ];
    const c = choices[rand(0, 1)];
    qText = c.q; correct = c.a; opts = c.opts;
  } else if (diff === 2) {
    qText = 'How many <strong>hours</strong> are in one <strong>day</strong>?';
    correct = '24'; opts = ['24', '60', '12', '1000'];
  } else if (diff === 3) {
    qText = 'How many <strong>seconds</strong> are in one <strong>hour</strong>?';
    correct = '3600'; opts = ['3600', '1000', '600', '6000'];
  } else {
    qText = 'How many <strong>seconds</strong> are in one <strong>day</strong>?';
    correct = '86400'; opts = ['86400', '3600', '24000', '1440'];
  }
  for (let i = opts.length - 1; i > 0; i--) {
    const j = rand(0, i); [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return {
    uid: makeUID('MCQ', 5, diff), level: 5, diff, type: 'MCQ',
    q: qText,
    working: `<p><strong>Answer: ${correct}</strong></p><p>Time uses base-60 (not base-10): 60 seconds = 1 minute, 60 minutes = 1 hour, 24 hours = 1 day.</p>`,
    img: '', imgAlt: '', hint: 'Remember: time does NOT use the metric system — it uses base 60.',
    ncea: { standard: 'N/A', ao: 'N/A' },
    options: opts, correctOption: opts.indexOf(correct)
  };
}

function _l5Match(diff) {
  let pairs;
  if (diff === 1) {
    pairs = [
      { left: '1 minute = ___ seconds', right: '60'    },
      { left: '1 hour = ___ minutes',   right: '60'    },
      { left: '1 day = ___ hours',       right: '24'    },
      { left: '1 hour = ___ seconds',    right: '3600'  }
    ];
  } else if (diff === 2) {
    pairs = [
      { left: 'seconds → minutes', right: '÷ 60'   },
      { left: 'minutes → hours',   right: '÷ 60'   },
      { left: 'hours → days',      right: '÷ 24'   },
      { left: 'days → hours',      right: '× 24'   }
    ];
  } else if (diff === 3) {
    pairs = [
      { left: '1 min',   right: '60 s'    },
      { left: '1 hr',    right: '3600 s'  },
      { left: '1 day',   right: '1440 min' },
      { left: '1 day',   right: '86 400 s' }
    ];
  } else {
    pairs = [
      { left: '60 seconds',  right: '1 minute'  },
      { left: '60 minutes',  right: '1 hour'    },
      { left: '24 hours',    right: '1 day'     },
      { left: '3600 seconds',right: '1 hour'    }
    ];
  }
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = rand(0, i); [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  const pairsHtml = pairs.map(p => `<tr><td>${p.left}</td><td>${p.right}</td></tr>`).join('');
  return {
    uid: makeUID('MATCH', 5, diff), level: 5, diff, type: 'MATCH',
    q: 'Match each time conversion to its correct value.',
    working: `<p><strong>Correct pairs:</strong></p><table>${pairsHtml}</table>`,
    img: '', imgAlt: '', hint: 'Time uses 60 (not 1000) between adjacent units.',
    ncea: { standard: 'N/A', ao: 'N/A' },
    pairs
  };
}

// ── LEVEL 6: Convert Larger Unit → Smaller Unit (Single Step) ─────────

// Conversion specs: [fromUnit, toUnit, factor, domain]
const _l6Specs = [
  { from: 'km',  to: 'm',   factor: 1000,  domain: 'length'   },
  { from: 'm',   to: 'cm',  factor: 100,   domain: 'length'   },
  { from: 'cm',  to: 'mm',  factor: 10,    domain: 'length'   },
  { from: 'm',   to: 'mm',  factor: 1000,  domain: 'length'   },
  { from: 'kg',  to: 'g',   factor: 1000,  domain: 'mass'     },
  { from: 't',   to: 'kg',  factor: 1000,  domain: 'mass'     },
  { from: 'kL',  to: 'L',   factor: 1000,  domain: 'volume'   },
  { from: 'L',   to: 'mL',  factor: 1000,  domain: 'volume'   },
  { from: 'g',   to: 'mg',  factor: 1000,  domain: 'mass'     }
];

function _l6Numeric(diff) {
  const spec = _l6Specs[rand(0, _l6Specs.length - 1)];
  const { from, to, factor, domain } = spec;
  const ctx = _getCtx(6);
  let num, a, qText, wk, img = '', imgAlt = '';

  if (diff === 1) {
    num = rand(1, 20);
    a   = num * factor;
    qText = `${ctx} measures <strong>${num} ${from}</strong>. Convert this to <strong>${to}</strong>.`;
    wk    = `<p>To convert ${from} to ${to}, multiply by ${factor.toLocaleString()}.</p><p>\\(${num} \\times ${factor.toLocaleString()} = ${a.toLocaleString()}\\)</p><p><strong>Answer: ${a.toLocaleString()} ${to}</strong></p>`;
  } else if (diff === 2) {
    const ones = rand(1, 19);
    const dec  = rand(1, 9);
    num = parseFloat(`${ones}.${dec}`);
    a   = parseFloat((num * factor).toFixed(1));
    qText = `${ctx}: <strong>${num} ${from}</strong>. How many <strong>${to}</strong> is this?`;
    wk    = `<p>\\(${num} \\times ${factor.toLocaleString()} = ${a.toLocaleString()}\\)</p><p><strong>Answer: ${a} ${to}</strong></p>`;
  } else if (diff === 3) {
    // fractional input
    const numer = rand(1, 7);
    const denom = [2, 4, 5, 8][rand(0, 3)];
    num = numer + '/' + denom;
    a   = parseFloat(((numer / denom) * factor).toFixed(3));
    qText = `Convert \\(\\dfrac{${numer}}{${denom}}\\) ${from} to ${to}.`;
    wk    = `<p>\\(\\dfrac{${numer}}{${denom}} \\times ${factor} = \\dfrac{${numer} \\times ${factor}}{${denom}} = \\dfrac{${numer * factor}}{${denom}} = ${a}\\)</p><p><strong>Answer: ${a} ${to}</strong></p>`;
  } else {
    // diff 4: less common units
    const hardSpecs = [
      { from: 'Mt', to: 't',  factor: 1000,  domain: 'mass' },
      { from: 'g',  to: 'mg', factor: 1000,  domain: 'mass' }
    ];
    const hs = hardSpecs[rand(0, hardSpecs.length - 1)];
    const val = randF(0.001, 0.05, 3);
    a = parseFloat((val * hs.factor).toFixed(2));
    qText = `Convert <strong>${val} ${hs.from}</strong> to <strong>${hs.to}</strong>.`;
    wk    = `<p>\\(${val} \\times ${hs.factor.toLocaleString()} = ${a}\\)</p><p><strong>Answer: ${a} ${hs.to}</strong></p>`;
    return {
      uid: makeUID('NUMERIC', 6, diff), level: 6, diff, type: 'NUMERIC',
      q: qText, working: wk, img: '', imgAlt: '', hint: 'Larger unit → smaller unit: multiply.',
      ncea: { standard: 'N/A', ao: 'N/A' },
      a: String(a), units: [hs.to], tolerance: 0.01
    };
  }

  if (diff <= 2) {
    img    = makeSVGConvert(num, from, 'times', factor, to);
    imgAlt = `Conversion diagram: ${num} ${from} multiplied by ${factor} gives the result in ${to}`;
  }

  return {
    uid: makeUID('NUMERIC', 6, diff), level: 6, diff, type: 'NUMERIC',
    q: qText, working: wk, img, imgAlt, hint: 'Larger unit → smaller unit: multiply by the conversion factor.',
    ncea: { standard: 'N/A', ao: 'N/A' },
    a: String(a), units: [to], tolerance: 0.01
  };
}

function _l6SEV(diff) {
  // Show a conversion with exactly ONE error
  const specs = [
    { from: 'km', to: 'm',  factor: 1000, wrongFactor: 100  },
    { from: 'm',  to: 'cm', factor: 100,  wrongFactor: 1000 },
    { from: 'kg', to: 'g',  factor: 1000, wrongFactor: 100  },
    { from: 'L',  to: 'mL', factor: 1000, wrongFactor: 100  }
  ];
  const spec = specs[rand(0, specs.length - 1)];
  const { from, to, factor, wrongFactor } = spec;

  let num, expression, correctErrorId, errorExplanation;

  if (diff <= 2) {
    num = diff === 1 ? rand(2, 15) : randF(1.1, 9.9, 1);
    const correct = parseFloat((num * factor).toFixed(2));
    const wrong   = parseFloat((num * wrongFactor).toFixed(2)); // wrong factor error
    expression    = `${num} ${from} = ${num} \\times [${wrongFactor}|1] = [${wrong}|2] ${to}`;
    correctErrorId    = 1;
    errorExplanation  = `The conversion factor from ${from} to ${to} is ${factor.toLocaleString()}, not ${wrongFactor.toLocaleString()}. The correct calculation is ${num} × ${factor} = ${correct} ${to}.`;
  } else {
    // diff 3: arithmetic slip (wrong answer, correct factor shown)
    num = rand(2, 9);
    const correct = num * factor;
    // Introduce a decimal slip: e.g., 5000 written as 500
    const wrong   = correct / 10;
    expression    = `${num} ${from} = ${num} \\times ${factor.toLocaleString()} = [${wrong}|1] ${to}`;
    correctErrorId    = 1;
    errorExplanation  = `${num} × ${factor} = ${correct}, not ${wrong}. Check the decimal point position when multiplying by ${factor}.`;
  }

  return {
    uid: makeUID('SPOT_ERROR/VALUE', 6, diff), level: 6, diff, type: 'SPOT_ERROR/VALUE',
    q: 'One value in this conversion is wrong. Click the incorrect token.',
    working: '',
    img: '', imgAlt: '', hint: 'Check the conversion factor — is it the right one for these units?',
    ncea: { standard: 'N/A', ao: 'N/A' },
    subtype: 'VALUE',
    expression,
    correctErrorId,
    errorExplanation
  };
}

// ── LEVEL 7: Convert Smaller Unit → Larger Unit (Single Step) ─────────

const _l7Specs = [
  { from: 'm',   to: 'km',  factor: 1000,  domain: 'length' },
  { from: 'cm',  to: 'm',   factor: 100,   domain: 'length' },
  { from: 'mm',  to: 'cm',  factor: 10,    domain: 'length' },
  { from: 'mm',  to: 'm',   factor: 1000,  domain: 'length' },
  { from: 'g',   to: 'kg',  factor: 1000,  domain: 'mass'   },
  { from: 'kg',  to: 't',   factor: 1000,  domain: 'mass'   },
  { from: 'mL',  to: 'L',   factor: 1000,  domain: 'volume' },
  { from: 'L',   to: 'kL',  factor: 1000,  domain: 'volume' },
  { from: 'mg',  to: 'g',   factor: 1000,  domain: 'mass'   }
];

function _l7Numeric(diff) {
  const spec = _l7Specs[rand(0, _l7Specs.length - 1)];
  const { from, to, factor } = spec;
  let num, a, qText, wk, img = '', imgAlt = '';

  if (diff === 1) {
    a   = rand(1, 20);
    num = a * factor;
    qText = `Convert <strong>${num.toLocaleString()} ${from}</strong> to <strong>${to}</strong>.`;
    wk    = `<p>To convert ${from} to ${to}, divide by ${factor.toLocaleString()}.</p><p>\\(${num.toLocaleString()} \\div ${factor.toLocaleString()} = ${a}\\)</p><p><strong>Answer: ${a} ${to}</strong></p>`;
  } else if (diff === 2) {
    // division gives simple decimal
    const mult = rand(1, 9);
    num = mult * (factor / 4); // gives .25 or .5 or .75
    a   = parseFloat((num / factor).toFixed(4));
    qText = `Convert <strong>${num} ${from}</strong> to <strong>${to}</strong>.`;
    wk    = `<p>\\(${num} \\div ${factor.toLocaleString()} = ${a}\\)</p><p><strong>Answer: ${a} ${to}</strong></p>`;
  } else if (diff === 3) {
    // result expressed as fraction
    const numer = rand(1, 7);
    const denom = [2, 4, 5, 8][rand(0, 3)];
    a   = numer / denom; // e.g. 0.75
    num = parseFloat((a * factor).toFixed(2));
    qText = `Convert <strong>${num} ${from}</strong> to <strong>${to}</strong>. Express as a decimal.`;
    wk    = `<p>\\(${num} \\div ${factor} = \\dfrac{${numer}}{${denom}} = ${a}\\)</p><p><strong>Answer: ${a} ${to}</strong></p>`;
  } else {
    // very small values
    const val = rand(1, 9) * 100;
    num = val;
    a   = parseFloat((val / 1000000).toFixed(6));
    qText = `Convert <strong>${num} µg</strong> to <strong>mg</strong>. (1 mg = 1000 µg)`;
    const ans = parseFloat((num / 1000).toFixed(4));
    wk    = `<p>\\(${num} \\div 1000 = ${ans}\\)</p><p><strong>Answer: ${ans} mg</strong></p>`;
    return {
      uid: makeUID('NUMERIC', 7, diff), level: 7, diff, type: 'NUMERIC',
      q: qText, working: wk, img: '', imgAlt: '', hint: 'Smaller unit → larger unit: divide.',
      ncea: { standard: 'N/A', ao: 'N/A' },
      a: String(ans), units: ['mg'], tolerance: 0.01
    };
  }

  if (diff <= 2) {
    img    = makeSVGConvert(num, from, 'divide', factor, to);
    imgAlt = `Conversion diagram: ${num} ${from} divided by ${factor} gives ${a} ${to}`;
  }

  return {
    uid: makeUID('NUMERIC', 7, diff), level: 7, diff, type: 'NUMERIC',
    q: qText, working: wk, img, imgAlt, hint: 'Smaller unit → larger unit: divide by the conversion factor.',
    ncea: { standard: 'N/A', ao: 'N/A' },
    a: String(a), units: [to], tolerance: 0.01
  };
}

function _l7SEV(diff) {
  const specs = [
    { from: 'm',  to: 'km',  factor: 1000, wrongOp: 'times'  },
    { from: 'g',  to: 'kg',  factor: 1000, wrongOp: 'times'  },
    { from: 'mL', to: 'L',   factor: 1000, wrongOp: 'times'  },
    { from: 'cm', to: 'm',   factor: 100,  wrongOp: 'times'  }
  ];
  const spec = specs[rand(0, specs.length - 1)];
  const { from, to, factor } = spec;
  const num     = rand(2, 20) * (diff === 1 ? 1000 : 100);
  const correct = parseFloat((num / factor).toFixed(3));
  const wrong   = parseFloat((num * factor).toFixed(0)); // multiplied instead of divided

  const expression = `[${num.toLocaleString()}|1] ${from} = [${num.toLocaleString()}|2] \\times [${factor.toLocaleString()}|3] = [${wrong.toLocaleString()}|4] ${to}`;
  return {
    uid: makeUID('SPOT_ERROR/VALUE', 7, diff), level: 7, diff, type: 'SPOT_ERROR/VALUE',
    q: 'One value in this conversion is wrong. Click the incorrect token.',
    working: '',
    img: '', imgAlt: '', hint: 'Are you dividing or multiplying? Converting to a LARGER unit means dividing.',
    ncea: { standard: 'N/A', ao: 'N/A' },
    subtype: 'VALUE',
    expression,
    correctErrorId: 3,
    errorExplanation: `To convert ${from} to ${to} (smaller → larger), you DIVIDE by ${factor.toLocaleString()}, not multiply. The correct answer is ${num} ÷ ${factor} = ${correct} ${to}.`
  };
}

// ── LEVEL 8: Apply cm³ = mL Volume–Capacity Equivalence ──────────────

function _l8Numeric(diff) {
  let num, a, qText, wk;

  if (diff === 1) {
    num   = rand(1, 20) * 50;
    a     = num; // cm³ → mL is 1:1
    qText = `A container holds <strong>${num} cm³</strong> of water. How many <strong>millilitres</strong> is this?`;
    wk    = `<p>Since 1 cm³ = 1 mL exactly:</p><p>\\(${num} \\text{ cm}^3 = ${a} \\text{ mL}\\)</p><p><strong>Answer: ${a} mL</strong></p>`;
  } else if (diff === 2) {
    num   = rand(1, 5) * 500;
    a     = num / 1000; // cm³ → mL → L
    qText = `A fish tank holds <strong>${num} cm³</strong> of water. How many <strong>litres</strong> is this?`;
    wk    = `<p>Step 1: \\(${num} \\text{ cm}^3 = ${num} \\text{ mL}\\) &nbsp;(since 1 cm³ = 1 mL)</p><p>Step 2: \\(${num} \\text{ mL} \\div 1000 = ${a} \\text{ L}\\)</p><p><strong>Answer: ${a} L</strong></p>`;
  } else if (diff === 3) {
    a   = randF(0.1, 2.5, 2);
    num = parseFloat((a * 1000).toFixed(1));
    qText = `Convert <strong>${a} L</strong> to <strong>cm³</strong>.`;
    wk    = `<p>Step 1: \\(${a} \\text{ L} = ${num} \\text{ mL}\\)</p><p>Step 2: \\(${num} \\text{ mL} = ${num} \\text{ cm}^3\\) &nbsp;(since 1 mL = 1 cm³)</p><p><strong>Answer: ${num} cm³</strong></p>`;
    return {
      uid: makeUID('NUMERIC', 8, diff), level: 8, diff, type: 'NUMERIC',
      q: qText, working: wk, img: '', imgAlt: '', hint: '1 mL = 1 cm³ exactly.',
      ncea: { standard: 'N/A', ao: 'N/A' },
      a: String(num), units: ['cm³', 'cm3'], tolerance: 0.01
    };
  } else {
    // m³ ↔ kL or large chain
    const kL = rand(1, 10);
    a = kL * 1000000; // cm³ = kL × 1000 L × 1000 mL × 1 cm³
    qText = `A tank has a volume of <strong>${kL} kL</strong>. How many <strong>cm³</strong> is this?`;
    wk    = `<p>Step 1: \\(${kL} \\text{ kL} = ${(kL * 1000).toLocaleString()} \\text{ L}\\)</p><p>Step 2: \\(${(kL * 1000).toLocaleString()} \\text{ L} = ${(kL * 1000000).toLocaleString()} \\text{ mL}\\)</p><p>Step 3: \\(${a.toLocaleString()} \\text{ mL} = ${a.toLocaleString()} \\text{ cm}^3\\)</p><p><strong>Answer: ${a.toLocaleString()} cm³</strong></p>`;
  }

  return {
    uid: makeUID('NUMERIC', 8, diff), level: 8, diff, type: 'NUMERIC',
    q: qText, working: wk, img: '', imgAlt: '', hint: '1 cm³ = 1 mL is an exact equivalence.',
    ncea: { standard: 'N/A', ao: 'N/A' },
    a: String(a), units: ['mL', 'L', 'cm³', 'kL'], tolerance: 0.01
  };
}

function _l8MCQ(diff) {
  let qText, correct, opts;
  if (diff === 1) {
    const n    = rand(1, 20) * 50;
    correct    = String(n);
    qText      = `A syringe contains ${n} cm³ of saline solution. How many millilitres is this?`;
    opts       = [correct, String(n * 10), String(n * 1000), String(n / 3)];
  } else {
    const n    = rand(1, 4) * 500;
    correct    = String(n / 1000);
    qText      = `A bottle holds ${n} cm³ of juice. How many litres is this?`;
    opts       = [correct, String(n), String(n * 1000), String(n / 100)];
  }
  for (let i = opts.length - 1; i > 0; i--) {
    const j = rand(0, i); [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return {
    uid: makeUID('MCQ', 8, diff), level: 8, diff, type: 'MCQ',
    q: qText,
    working: `<p><strong>Answer: ${correct}</strong></p><p>1 cm³ = 1 mL exactly, so cm³ and mL are interchangeable.</p>`,
    img: '', imgAlt: '', hint: '1 cm³ and 1 mL are the same volume.',
    ncea: { standard: 'N/A', ao: 'N/A' },
    options: opts, correctOption: opts.indexOf(correct)
  };
}

function _l8Explanation(diff) {
  if (diff <= 2) {
    return {
      uid: makeUID('EXPLANATION', 8, diff), level: 8, diff, type: 'EXPLANATION',
      q: 'Explain why 1 cm³ = 1 mL. Use a clear mathematical or geometric argument.',
      working: '',
      img: '', imgAlt: '', hint: 'Think about what fits inside a 1 cm × 1 cm × 1 cm cube.',
      ncea: { standard: 'N/A', ao: 'N/A' },
      modelAnswer: 'One cubic centimetre is the volume of a cube with side length 1 cm. By definition, one millilitre is the volume of one one-thousandth of a litre, and one litre is defined as the volume of a 10 cm × 10 cm × 10 cm cube (1000 cm³). Since 1000 mL = 1 L = 1000 cm³, dividing both sides by 1000 gives 1 mL = 1 cm³ exactly.',
      markingChecklist: [
        'States that 1 cm³ is the volume of a 1 cm × 1 cm × 1 cm cube',
        'Links 1 L to 1000 cm³ (or 10 cm × 10 cm × 10 cm)',
        'Concludes that 1 mL = 1 cm³ by dividing 1000 mL = 1000 cm³ by 1000'
      ]
    };
  } else {
    return {
      uid: makeUID('EXPLANATION', 8, diff), level: 8, diff, type: 'EXPLANATION',
      q: 'A student says "1 m³ = 1000 mL because 1 m = 100 cm and 1 cm³ = 1 mL." Explain the error in the student\'s reasoning and give the correct conversion.',
      working: '',
      img: '', imgAlt: '', hint: 'Volume scales with the CUBE of the length factor.',
      ncea: { standard: 'N/A', ao: 'N/A' },
      modelAnswer: 'The student forgot that volume scales with the cube of the length conversion factor. Since 1 m = 100 cm, a 1 m cube has dimensions 100 cm × 100 cm × 100 cm = 1 000 000 cm³. Since 1 cm³ = 1 mL, this equals 1 000 000 mL = 1000 L = 1 kL.',
      markingChecklist: [
        'Identifies the error: volume uses the cube of the length factor',
        'Calculates 100 × 100 × 100 = 1 000 000 cm³',
        'States the correct conversion: 1 m³ = 1 000 000 cm³ = 1000 L = 1 kL'
      ]
    };
  }
}

// ── LEVEL 9: Convert Between Adjacent Time Units (Single Step) ─────────

function _l9Numeric(diff) {
  let qText, a, wk;
  const ctx = _getCtx(9);

  if (diff === 1) {
    const scenarios = [
      { num: rand(2, 12), from: 'hours', to: 'minutes', factor: 60 },
      { num: rand(2, 15), from: 'minutes', to: 'seconds', factor: 60 },
      { num: rand(1, 7),  from: 'days', to: 'hours', factor: 24 }
    ];
    const s = scenarios[rand(0, scenarios.length - 1)];
    a = s.num * s.factor;
    qText = `During ${ctx}, the time was <strong>${s.num} ${s.from}</strong>. Convert this to <strong>${s.to}</strong>.`;
    wk    = `<p>\\(${s.num} \\times ${s.factor} = ${a}\\)</p><p><strong>Answer: ${a} ${s.to}</strong></p>`;
  } else if (diff === 2) {
    const n   = rand(2, 5) * 30 + rand(1, 3) * 10; // e.g. 90, 150 minutes
    a = parseFloat((n / 60).toFixed(4));
    qText = `A video is <strong>${n} minutes</strong> long. How many <strong>hours</strong> is this? Give your answer as a decimal.`;
    wk    = `<p>\\(${n} \\div 60 = ${a}\\)</p><p><strong>Answer: ${a} hours</strong></p>`;
  } else if (diff === 3) {
    const hours = randF(1.5, 4.5, 1);
    const secs  = parseFloat((hours * 3600).toFixed(0));
    a = secs;
    qText = `A school trip lasts <strong>${hours} hours</strong>. How many <strong>seconds</strong> is this? (1 hour = 3600 seconds)`;
    wk    = `<p>\\(${hours} \\times 3600 = ${secs.toLocaleString()}\\)</p><p><strong>Answer: ${secs.toLocaleString()} seconds</strong></p>`;
  } else {
    const days = randF(1.5, 3.5, 1);
    a = parseFloat((days * 24 * 60).toFixed(0));
    qText = `A camping trip lasts <strong>${days} days</strong>. How many <strong>minutes</strong> is this? (1 day = 1440 minutes)`;
    wk    = `<p>\\(${days} \\times 1440 = ${a.toLocaleString()}\\)</p><p><strong>Answer: ${a.toLocaleString()} minutes</strong></p>`;
  }

  return {
    uid: makeUID('NUMERIC', 9, diff), level: 9, diff, type: 'NUMERIC',
    q: qText, working: wk, img: '', imgAlt: '', hint: 'Time uses ×60 or ×24, not ×1000.',
    ncea: { standard: 'N/A', ao: 'N/A' },
    a: String(a), units: [], tolerance: 0.01
  };
}

function _l9MCQ(diff) {
  let qText, correct, opts;
  if (diff === 1) {
    const n = rand(3, 10);
    correct = String(n * 60);
    qText   = `How many minutes are in <strong>${n} hours</strong>?`;
    opts    = [correct, String(n * 1000), String(n * 100), String(n * 24)];
  } else if (diff === 2) {
    const n = rand(2, 6) * 30;
    correct = String(n / 60);
    qText   = `A race takes <strong>${n} minutes</strong>. Express this in <strong>hours</strong>.`;
    opts    = [correct, String(n * 60), String(n / 100), String(n / 10)];
  } else {
    const n = rand(2, 8);
    correct = String(n * 3600);
    qText   = `How many seconds are in <strong>${n} hours</strong>?`;
    opts    = [correct, String(n * 60), String(n * 1000), String(n * 600)];
  }
  for (let i = opts.length - 1; i > 0; i--) {
    const j = rand(0, i); [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return {
    uid: makeUID('MCQ', 9, diff), level: 9, diff, type: 'MCQ',
    q: qText,
    working: `<p><strong>Answer: ${correct}</strong></p><p>Time conversions use 60 (seconds↔minutes, minutes↔hours) and 24 (hours↔days).</p>`,
    img: makeSVGTimeClock(''), imgAlt: 'Time conversion reference showing 60 s = 1 min and 60 min = 1 hr',
    hint: 'Time uses base 60 — not base 10 or base 1000.',
    ncea: { standard: 'N/A', ao: 'N/A' },
    options: opts, correctOption: opts.indexOf(correct)
  };
}

function _l9SEV(diff) {
  const n = rand(3, 9);
  let expression, correctErrorId, errorExplanation;
  if (diff === 1) {
    const correct = n * 60;
    const wrong   = n * 1000; // metric confusion
    expression    = `${n} hours = ${n} \\times [1000|1] = [${wrong}|2] minutes`;
    correctErrorId   = 1;
    errorExplanation = `There are 60 minutes in 1 hour, not 1000. The correct calculation is ${n} × 60 = ${correct} minutes.`;
  } else {
    const mins    = rand(2, 8) * 30;
    const correct = parseFloat((mins / 60).toFixed(2));
    const wrong   = mins * 60;
    expression    = `${mins} minutes = ${mins} \\times [60|1] = [${wrong}|2] hours`;
    correctErrorId   = 1;
    errorExplanation = `To convert minutes to hours you DIVIDE by 60, not multiply. ${mins} ÷ 60 = ${correct} hours.`;
  }
  return {
    uid: makeUID('SPOT_ERROR/VALUE', 9, diff), level: 9, diff, type: 'SPOT_ERROR/VALUE',
    q: 'One value in this time conversion is wrong. Click the incorrect token.',
    working: '',
    img: '', imgAlt: '', hint: 'Is the operation (× or ÷) correct for the direction of conversion?',
    ncea: { standard: 'N/A', ao: 'N/A' },
    subtype: 'VALUE',
    expression, correctErrorId, errorExplanation
  };
}

// ── LEVEL 10: Challenge — Mixed Multi-Step Conversions ─────────────────

function _l10Numeric(diff) {
  let qText, a, wk, img = '', imgAlt = '';

  if (diff === 1) {
    // 2-step length chain: km → m → cm
    const km = rand(2, 8);
    const m  = km * 1000;
    a = m * 100;
    qText = `A road is <strong>${km} km</strong> long. Express this distance in <strong>centimetres</strong>.`;
    wk    = `<p>Step 1 (km → m): \\(${km} \\times 1000 = ${m.toLocaleString()} \\text{ m}\\)</p><p>Step 2 (m → cm): \\(${m.toLocaleString()} \\times 100 = ${a.toLocaleString()} \\text{ cm}\\)</p><p><strong>Answer: ${a.toLocaleString()} cm</strong></p>`;
    img    = makeSVGChain(['km', 'm', 'cm'], { sym: '×', factor: 1000 }, { sym: '×', factor: 100 });
    imgAlt = 'Chain diagram: km to m (× 1000) to cm (× 100)';
  } else if (diff === 2) {
    // 2-step mass chain: t → kg → g
    const tonne = randF(0.5, 4.5, 1);
    const kg    = parseFloat((tonne * 1000).toFixed(1));
    a = parseFloat((kg * 1000).toFixed(0));
    qText = `A load of timber weighs <strong>${tonne} t</strong>. Express this mass in <strong>grams</strong>.`;
    wk    = `<p>Step 1 (t → kg): \\(${tonne} \\times 1000 = ${kg.toLocaleString()} \\text{ kg}\\)</p><p>Step 2 (kg → g): \\(${kg.toLocaleString()} \\times 1000 = ${a.toLocaleString()} \\text{ g}\\)</p><p><strong>Answer: ${a.toLocaleString()} g</strong></p>`;
    img    = makeSVGChain(['t', 'kg', 'g'], { sym: '×', factor: 1000 }, { sym: '×', factor: 1000 });
    imgAlt = 'Chain diagram: t to kg (× 1000) to g (× 1000)';
  } else {
    // 3-step: km → m → cm → mm
    const km = rand(1, 5);
    const m  = km * 1000;
    const cm = m * 100;
    a = cm * 10;
    qText = `Convert <strong>${km} km</strong> to <strong>millimetres</strong>.`;
    wk    = `<p>Step 1 (km → m): \\(${km} \\times 1000 = ${m.toLocaleString()} \\text{ m}\\)</p><p>Step 2 (m → cm): \\(${m.toLocaleString()} \\times 100 = ${cm.toLocaleString()} \\text{ cm}\\)</p><p>Step 3 (cm → mm): \\(${cm.toLocaleString()} \\times 10 = ${a.toLocaleString()} \\text{ mm}\\)</p><p><strong>Answer: ${a.toLocaleString()} mm</strong></p>`;
  }

  return {
    uid: makeUID('NUMERIC', 10, diff), level: 10, diff, type: 'NUMERIC',
    q: qText, working: wk, img, imgAlt, hint: 'Break it into individual steps — one conversion at a time.',
    ncea: { standard: 'N/A', ao: 'N/A' },
    a: String(a), units: ['cm', 'g', 'mm'], tolerance: 0.01
  };
}

function _l10MCQ(diff) {
  let qText, correct, opts;
  if (diff === 2) {
    // Mixed time: hours + minutes → minutes
    const h = rand(1, 5), m = rand(1, 9) * 5;
    correct = String(h * 60 + m);
    qText   = `Convert <strong>${h} hours ${m} minutes</strong> into <strong>minutes</strong>.`;
    opts    = [correct, String(h * 60), String(h * 1000 + m), String(h + m)];
  } else {
    // 2-step mass: g → t
    const g = rand(1, 9) * 1000000;
    correct = String(g / 1000000);
    qText   = `Convert <strong>${g.toLocaleString()} g</strong> to <strong>tonnes</strong>.`;
    opts    = [correct, String(g / 1000), String(g / 100000), String(g * 1000)];
  }
  for (let i = opts.length - 1; i > 0; i--) {
    const j = rand(0, i); [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return {
    uid: makeUID('MCQ', 10, diff), level: 10, diff, type: 'MCQ',
    q: qText,
    working: `<p><strong>Answer: ${correct}</strong></p><p>Work through each conversion step in order.</p>`,
    img: '', imgAlt: '', hint: 'Do one step at a time.',
    ncea: { standard: 'N/A', ao: 'N/A' },
    options: opts, correctOption: opts.indexOf(correct)
  };
}

function _l10SEP(diff) {
  // SPOT_ERROR/STEP — multi-step working with exactly one wrong step
  let steps, qText;
  if (diff === 2) {
    const km = rand(2, 6);
    const m  = km * 1000;
    const wrongCm = m * 10;  // ← error: × 10 instead of × 100
    const correctCm = m * 100;
    qText = `A student converts ${km} km to centimetres. Find the error in their working.`;
    steps = [
      { id: 1, text: `Start with ${km} km`, isError: false },
      { id: 2, text: `Step 1 (km → m): \\(${km} \\times 1000 = ${m.toLocaleString()}\\) m`, isError: false },
      { id: 3, text: `Step 2 (m → cm): \\(${m.toLocaleString()} \\times 10 = ${wrongCm.toLocaleString()}\\) cm`, isError: true },
      { id: 4, text: `Answer: ${wrongCm.toLocaleString()} cm`, isError: false }
    ];
  } else {
    const h = rand(2, 5), m = rand(1, 5) * 10;
    const totalMin = h * 60 + m;
    const wrongSec = totalMin * 100; // ← error: × 100 instead of × 60
    qText = `A student converts ${h} hours ${m} minutes to seconds. Find the error.`;
    steps = [
      { id: 1, text: `${h} hours ${m} minutes`, isError: false },
      { id: 2, text: `Step 1: \\(${h} \\times 60 + ${m} = ${totalMin}\\) minutes`, isError: false },
      { id: 3, text: `Step 2: \\(${totalMin} \\times 100 = ${wrongSec.toLocaleString()}\\) seconds`, isError: true },
      { id: 4, text: `Answer: ${wrongSec.toLocaleString()} seconds`, isError: false }
    ];
  }
  return {
    uid: makeUID('SPOT_ERROR/STEP', 10, diff), level: 10, diff, type: 'SPOT_ERROR/STEP',
    q: qText, working: '',
    img: '', imgAlt: '', hint: 'Check each conversion factor carefully.',
    ncea: { standard: 'N/A', ao: 'N/A' },
    subtype: 'STEP',
    steps
  };
}

function _l10SEV(diff) {
  if (diff === 1) {
    // 2-step chain with one wrong intermediate value
    const km = rand(2, 8);
    const correctM   = km * 1000;
    const wrongM     = km * 100;   // factor-of-10 error
    const expression = `[${km}|1] km \\xrightarrow{\\times 1000} [${wrongM}|2] m \\xrightarrow{\\times 100} [${wrongM * 100}|3] cm`;
    return {
      uid: makeUID('SPOT_ERROR/VALUE', 10, diff), level: 10, diff, type: 'SPOT_ERROR/VALUE',
      q: 'One value in this multi-step conversion is wrong. Click the incorrect token.',
      working: '',
      img: '', imgAlt: '', hint: 'Check the first step — km to m uses × 1000.',
      ncea: { standard: 'N/A', ao: 'N/A' },
      subtype: 'VALUE',
      expression,
      correctErrorId: 2,
      errorExplanation: `1 km = 1000 m, so ${km} km = ${km} × 1000 = ${correctM.toLocaleString()} m (not ${wrongM.toLocaleString()} m). The subsequent step also becomes incorrect as a result.`
    };
  } else {
    const h = rand(2, 5);
    const correctMin  = h * 60;
    const wrongMin    = h * 1000;
    const wrongSec    = wrongMin * 60;
    const expression  = `${h} hours = ${h} \\times [1000|1] = [${wrongMin.toLocaleString()}|2] min = [${wrongSec.toLocaleString()}|3] s`;
    return {
      uid: makeUID('SPOT_ERROR/VALUE', 10, diff), level: 10, diff, type: 'SPOT_ERROR/VALUE',
      q: 'One value in this time conversion is wrong. Click the incorrect token.',
      working: '',
      img: '', imgAlt: '', hint: 'There are 60 minutes in an hour — not 1000.',
      ncea: { standard: 'N/A', ao: 'N/A' },
      subtype: 'VALUE',
      expression,
      correctErrorId: 1,
      errorExplanation: `1 hour = 60 minutes, not 1000 minutes. The correct conversion is ${h} × 60 = ${correctMin} minutes = ${correctMin * 60} seconds.`
    };
  }
}

function _l10Explanation(diff) {
  return {
    uid: makeUID('EXPLANATION', 10, diff), level: 10, diff, type: 'EXPLANATION',
    q: 'A student needs to convert 3 km into millimetres. Explain the strategy they should use, showing each step clearly.',
    working: '',
    img: '', imgAlt: '', hint: 'Think: km → m → cm → mm. What factor is used at each step?',
    ncea: { standard: 'N/A', ao: 'N/A' },
    modelAnswer: 'To convert km to mm, chain three conversions: km → m (× 1000), then m → cm (× 100), then cm → mm (× 10). For 3 km: 3 × 1000 = 3000 m; 3000 × 100 = 300 000 cm; 300 000 × 10 = 3 000 000 mm. Alternatively, use the combined factor: 1 km = 1 000 000 mm, so 3 × 1 000 000 = 3 000 000 mm.',
    markingChecklist: [
      'Identifies the chain: km → m → cm → mm (or equivalent combined factor)',
      'Applies × 1000 correctly for km → m',
      'Applies × 100 for m → cm and × 10 for cm → mm (or × 1000000 overall)',
      'States the correct final answer: 3 000 000 mm'
    ]
  };
}

// ── LEVEL 11: Real-World Conversion Problems (NZ Context) ──────────────

function _l11Numeric(diff) {
  const scenarios = {
    1: [
      () => {
        const g = rand(60, 120) * 10;
        const n = rand(20, 50);
        const kg = parseFloat((g * n / 1000).toFixed(2));
        return {
          q: `A kiwifruit weighs ${g} g. A tray holds ${n} kiwifruit. What is the total mass of the tray in <strong>kilograms</strong>?`,
          a: String(kg),
          wk: `<p>Total grams: \\(${g} \\times ${n} = ${g * n}\\) g</p><p>Convert to kg: \\(${g * n} \\div 1000 = ${kg}\\) kg</p><p><strong>Answer: ${kg} kg</strong></p>`,
          units: ['kg']
        };
      },
      () => {
        const mL = rand(2, 8) * 100;
        const n  = rand(3, 10);
        const L  = parseFloat((mL * n / 1000).toFixed(2));
        return {
          q: `A sports drink bottle holds ${mL} mL. A crate holds ${n} bottles. What is the total volume in <strong>litres</strong>?`,
          a: String(L),
          wk: `<p>Total mL: \\(${mL} \\times ${n} = ${mL * n}\\) mL</p><p>Convert to L: \\(${mL * n} \\div 1000 = ${L}\\) L</p><p><strong>Answer: ${L} L</strong></p>`,
          units: ['L', 'litres']
        };
      }
    ],
    2: [
      () => {
        const m = randF(1.5, 8.5, 1);
        const cm = m * 100;
        return {
          q: `A builder needs ${m} m of timber. The hardware store measures in centimetres. How many <strong>centimetres</strong> does the builder need?`,
          a: String(cm),
          wk: `<p>\\(${m} \\times 100 = ${cm}\\) cm</p><p><strong>Answer: ${cm} cm</strong></p>`,
          units: ['cm']
        };
      },
      () => {
        const g = randF(1.2, 4.8, 1);
        const kg = g * 1000;
        return {
          q: `A package weighs ${g} kg. The courier charges by the gram. How many <strong>grams</strong> is this package?`,
          a: String(kg),
          wk: `<p>\\(${g} \\times 1000 = ${kg}\\) g</p><p><strong>Answer: ${kg} g</strong></p>`,
          units: ['g', 'grams']
        };
      }
    ],
    3: [
      () => {
        const kL = randF(2.5, 8.5, 1);
        const L  = kL * 1000;
        const trough = rand(100, 500);
        const fills  = Math.floor(L / trough);
        return {
          q: `A farm water tank holds ${kL} kL. A trough holds ${trough} L. How many <strong>full troughs</strong> can the tank fill?`,
          a: String(fills),
          wk: `<p>Convert tank to litres: \\(${kL} \\times 1000 = ${L.toLocaleString()}\\) L</p><p>Troughs: \\(${L.toLocaleString()} \\div ${trough} = ${fills}\\)</p><p><strong>Answer: ${fills} troughs</strong></p>`,
          units: []
        };
      },
      () => {
        const km = randF(2.5, 9.5, 1);
        const m  = km * 1000;
        const loops = rand(3, 8);
        const loopM = Math.round(m / loops);
        return {
          q: `An athletics track is ${loopM} m per lap. A race covers ${km} km. How many <strong>laps</strong> is the race?`,
          a: String(m / loopM),
          wk: `<p>Convert to metres: \\(${km} \\times 1000 = ${m.toLocaleString()}\\) m</p><p>Laps: \\(${m.toLocaleString()} \\div ${loopM} = ${m / loopM}\\)</p><p><strong>Answer: ${m / loopM} laps</strong></p>`,
          units: ['laps']
        };
      }
    ],
    4: [
      () => {
        const km = randF(3.0, 10.0, 1);
        const sec = rand(12, 25) * 60 + rand(0, 59);
        const mPerSec = parseFloat((km * 1000 / sec).toFixed(3));
        return {
          q: `A runner completes a ${km} km race in ${Math.floor(sec / 60)} minutes ${sec % 60} seconds. Express the time in seconds and calculate their average speed in <strong>m/s</strong> (to 2 d.p.).`,
          a: String(parseFloat(mPerSec.toFixed(2))),
          wk: `<p>Time in seconds: \\(${Math.floor(sec / 60)} \\times 60 + ${sec % 60} = ${sec}\\) s</p><p>Distance in metres: \\(${km} \\times 1000 = ${(km * 1000).toLocaleString()}\\) m</p><p>Speed: \\(${(km * 1000).toLocaleString()} \\div ${sec} = ${mPerSec.toFixed(2)}\\) m/s</p><p><strong>Answer: ${mPerSec.toFixed(2)} m/s</strong></p>`,
          units: ['m/s']
        };
      }
    ]
  };

  const pool = scenarios[diff] || scenarios[1];
  const gen  = pool[rand(0, pool.length - 1)];
  const s    = gen();

  return {
    uid: makeUID('NUMERIC', 11, diff), level: 11, diff, type: 'NUMERIC',
    q: s.q, working: s.wk, img: '', imgAlt: '',
    hint: 'First identify whether you need to multiply or divide, then apply the correct factor.',
    ncea: { standard: 'N/A', ao: 'N/A' },
    a: s.a, units: s.units, tolerance: 0.05
  };
}

function _l11Explanation(diff) {
  if (diff <= 2) {
    return {
      uid: makeUID('EXPLANATION', 11, diff), level: 11, diff, type: 'EXPLANATION',
      q: 'A student needs to compare a 2.5 kL water tank with a 2800 L tank to find which is larger. Explain the steps needed and state which tank is larger.',
      working: '',
      img: '', imgAlt: '', hint: 'Convert both to the same unit first.',
      ncea: { standard: 'N/A', ao: 'N/A' },
      modelAnswer: 'To compare two capacities they must be in the same unit. Convert 2.5 kL to litres: 2.5 × 1000 = 2500 L. Now compare: 2500 L vs 2800 L. Since 2800 > 2500, the 2800 L tank is larger.',
      markingChecklist: [
        'States the need to convert to a common unit',
        'Correctly converts 2.5 kL = 2500 L',
        'Compares 2500 L and 2800 L correctly',
        'States that the 2800 L tank is larger'
      ]
    };
  } else {
    return {
      uid: makeUID('EXPLANATION', 11, diff), level: 11, diff, type: 'EXPLANATION',
      q: 'A school athletics day timetable says the 4×100 m relay will start at 2:15 pm and each team\'s run takes about 48 seconds. Explain how you would calculate the finish time in minutes and seconds.',
      working: '',
      img: '', imgAlt: '', hint: 'Start with 48 seconds and express that in minutes and seconds.',
      ncea: { standard: 'N/A', ao: 'N/A' },
      modelAnswer: '48 seconds is less than 1 minute (60 s). Express as a fraction of a minute: 48 ÷ 60 = 0.8 minutes, or simply 48 seconds. Adding 48 seconds to 2:15:00 pm gives 2:15:48 pm. So the race finishes at 2 minutes and 48 seconds past 2:15 pm, i.e. at approximately 2:15:48 pm.',
      markingChecklist: [
        'Identifies that 48 seconds < 60 seconds (less than 1 minute)',
        'Adds 48 seconds to 2:15:00 pm correctly',
        'States the finish time as 2:15:48 pm or equivalent'
      ]
    };
  }
}

// ── 4. CONFIG OBJECT ──────────────────────────────────────────────────

// Per-level question lists: [type, diff] pairs defining the 10 questions per level
const _levelQueues = {
  1:  [['NUMERIC',1],['NUMERIC',1],['NUMERIC',2],['NUMERIC',2],['NUMERIC',3],['NUMERIC',4],['MCQ',1],['MCQ',2],['MCQ',3],['MCQ',4]],
  2:  [['MCQ',1],['MCQ',1],['MCQ',2],['MCQ',3],['MATCH',1],['MATCH',2],['MATCH',3],['MATCH',4],['TEXT',1],['TEXT',2]],
  3:  [['MCQ',1],['MCQ',1],['MCQ',2],['MCQ',3],['MATCH',1],['MATCH',2],['MATCH',3],['MATCH',4],['TEXT',1],['TEXT',2]],
  4:  [['MCQ',1],['MCQ',2],['MCQ',3],['MCQ',4],['MATCH',1],['MATCH',2],['MATCH',3],['MATCH',4],['TEXT',1],['TEXT',2]],
  5:  [['MCQ',1],['MCQ',2],['MCQ',3],['MCQ',4],['MCQ',1],['MATCH',1],['MATCH',2],['MATCH',3],['MATCH',4],['MATCH',1]],
  6:  [['NUMERIC',1],['NUMERIC',1],['NUMERIC',2],['NUMERIC',2],['NUMERIC',3],['NUMERIC',3],['NUMERIC',4],['SPOT_ERROR/VALUE',1],['SPOT_ERROR/VALUE',2],['SPOT_ERROR/VALUE',3]],
  7:  [['NUMERIC',1],['NUMERIC',1],['NUMERIC',2],['NUMERIC',2],['NUMERIC',3],['NUMERIC',3],['NUMERIC',4],['SPOT_ERROR/VALUE',1],['SPOT_ERROR/VALUE',2],['SPOT_ERROR/VALUE',2]],
  8:  [['NUMERIC',1],['NUMERIC',1],['NUMERIC',2],['NUMERIC',2],['NUMERIC',3],['NUMERIC',4],['MCQ',1],['MCQ',2],['EXPLANATION',1],['EXPLANATION',2]],
  9:  [['NUMERIC',1],['NUMERIC',2],['NUMERIC',3],['NUMERIC',4],['NUMERIC',2],['MCQ',1],['MCQ',2],['MCQ',3],['SPOT_ERROR/VALUE',1],['SPOT_ERROR/VALUE',2]],
  10: [['NUMERIC',1],['NUMERIC',2],['NUMERIC',3],['MCQ',2],['MCQ',3],['SPOT_ERROR/STEP',2],['SPOT_ERROR/STEP',3],['SPOT_ERROR/VALUE',1],['SPOT_ERROR/VALUE',2],['EXPLANATION',2]],
  11: [['NUMERIC',1],['NUMERIC',1],['NUMERIC',2],['NUMERIC',2],['NUMERIC',3],['NUMERIC',3],['NUMERIC',4],['NUMERIC',4],['EXPLANATION',2],['EXPLANATION',3]]
};

// Active pools per level (shuffled at start, refilled when empty)
const _activePools = {};

function _buildActivePool(level) {
  const queue = (_levelQueues[level] || []).map(([type, diff]) => ({ type, diff }));
  // shuffle
  for (let i = queue.length - 1; i > 0; i--) {
    const j = rand(0, i); [queue[i], queue[j]] = [queue[j], queue[i]];
  }
  return queue;
}

function _generateQ(level, diff, type) {
  switch (level) {
    case 1:
      return type === 'NUMERIC' ? _l1Numeric(diff) : _l1MCQ(diff);
    case 2:
      if (type === 'MCQ')   return _l2MCQ(diff);
      if (type === 'MATCH') return _l2Match(diff);
      return _l2Text(diff);
    case 3:
      if (type === 'MCQ')   return _l3MCQ(diff);
      if (type === 'MATCH') return _l3Match(diff);
      return _l3Text(diff);
    case 4:
      if (type === 'MCQ')   return _l4MCQ(diff);
      if (type === 'MATCH') return _l4Match(diff);
      return _l4Text(diff);
    case 5:
      return type === 'MCQ' ? _l5MCQ(diff) : _l5Match(diff);
    case 6:
      return type === 'SPOT_ERROR/VALUE' ? _l6SEV(diff) : _l6Numeric(diff);
    case 7:
      return type === 'SPOT_ERROR/VALUE' ? _l7SEV(diff) : _l7Numeric(diff);
    case 8:
      if (type === 'MCQ')         return _l8MCQ(diff);
      if (type === 'EXPLANATION') return _l8Explanation(diff);
      return _l8Numeric(diff);
    case 9:
      if (type === 'MCQ')              return _l9MCQ(diff);
      if (type === 'SPOT_ERROR/VALUE') return _l9SEV(diff);
      return _l9Numeric(diff);
    case 10:
      if (type === 'MCQ')              return _l10MCQ(diff);
      if (type === 'SPOT_ERROR/STEP')  return _l10SEP(diff);
      if (type === 'SPOT_ERROR/VALUE') return _l10SEV(diff);
      if (type === 'EXPLANATION')      return _l10Explanation(diff);
      return _l10Numeric(diff);
    case 11:
      return type === 'EXPLANATION' ? _l11Explanation(diff) : _l11Numeric(diff);
    default:
      return _l1Numeric(1);
  }
}

const config = {
  id:    'metric-unit-conversions',
  title: 'Metric Unit Conversions',
  levelNames: [
    'Multiply & Divide by Powers of Ten',
    'Length Conversion Facts',
    'Mass Conversion Facts',
    'Volume & Capacity Facts',
    'Time Conversion Facts',
    'Larger → Smaller Unit',
    'Smaller → Larger Unit',
    'Volume–Capacity (cm³ = mL)',
    'Time Conversions',
    'Challenge: Multi-Step',
    'Real-World NZ Problems'
  ],

  getQuestion(level, diff) {
    const key = `lv${level}`;
    if (!_activePools[key] || _activePools[key].length === 0) {
      _activePools[key] = _buildActivePool(level);
    }
    const { type, diff: d } = pickAndRemove(_activePools[key]);
    return _generateQ(level, d, type);
  },

  renderFront(q, el) {
    if (q.img) {
      el.classList.remove('text-only');
      el.innerHTML = `<div class="q-img"><img src="${q.img}" alt="${q.imgAlt}" style="max-width:100%;"></div><div class="q-text">${q.q}</div>`;
    } else {
      el.classList.add('text-only');
      el.innerHTML = `<div class="q-text q-text-centre">${q.q}</div>`;
    }
  },

  generateSolution(q) {
    if (q.type === 'EXPLANATION') return '';

    if (q.type === 'NUMERIC' || q.type === 'TEXT') {
      const ansDisplay = q.units && q.units.length > 0 ? `${q.a} ${q.units[0]}` : q.a;
      return `<p><strong style="font-size:1.25em;">Answer: ${ansDisplay}</strong></p>${q.working || ''}`;
    }

    if (q.type === 'MCQ') {
      const letter = ['A','B','C','D'][q.correctOption];
      return `<p><strong>Correct answer: ${letter}) ${q.options[q.correctOption]}</strong></p>${q.working || ''}`;
    }

    if (q.type === 'MATCH') {
      const rows = q.pairs.map(p => `<tr><td style="padding:4px 12px 4px 0">${p.left}</td><td>↔</td><td style="padding:4px 0 4px 12px">${p.right}</td></tr>`).join('');
      return `<p><strong>Correct pairs:</strong></p><table style="border-collapse:collapse">${rows}</table>`;
    }

    if (q.type === 'SPOT_ERROR/VALUE') {
      return `<p><strong>Incorrect token: #${q.correctErrorId}</strong></p><p>${q.errorExplanation}</p>`;
    }

    if (q.type === 'SPOT_ERROR/STEP') {
      const stepsHtml = q.steps.map(s => {
        const style = s.isError
          ? 'color:red;font-weight:bold;'
          : '';
        return `<p style="${style}">${s.isError ? '✗ ERROR: ' : '✓ '}${s.text}</p>`;
      }).join('');
      return `<p><strong>Step containing the error: Step ${q.steps.find(s => s.isError).id}</strong></p>${stepsHtml}`;
    }

    return q.working || '';
  },

  // ── 5. REFERENCE ITEMS ──────────────────────────────────────────────
  referenceItems: [
    {
      label: 'Len',
      title: 'Length Units',
      text:  'Metric length conversion chain:',
      math:  '\\text{km} \\xrightarrow{\\times 1000} \\text{m} \\xrightarrow{\\times 100} \\text{cm} \\xrightarrow{\\times 10} \\text{mm}'
    },
    {
      label: 'Mass',
      title: 'Mass Units',
      text:  'Metric mass conversion chain:',
      math:  '\\text{Mt} \\xrightarrow{\\times 1000} \\text{t} \\xrightarrow{\\times 1000} \\text{kg} \\xrightarrow{\\times 1000} \\text{g} \\xrightarrow{\\times 1000} \\text{mg} \\xrightarrow{\\times 1000} \\mu\\text{g}'
    },
    {
      label: 'Vol',
      title: 'Volume & Capacity',
      text:  'Volume and capacity conversions:',
      math:  '1\\text{ kL} = 1000\\text{ L} = 1{,}000{,}000\\text{ mL} \\quad 1\\text{ cm}^3 = 1\\text{ mL}'
    },
    {
      label: 'Time',
      title: 'Time Units',
      text:  'Time conversion facts (base 60):',
      math:  '60\\text{ s} = 1\\text{ min} \\quad 60\\text{ min} = 1\\text{ hr} \\quad 24\\text{ hr} = 1\\text{ day} \\quad 1\\text{ hr} = 3600\\text{ s}'
    },
    {
      label: 'Rule',
      title: 'Conversion Rule',
      text:  'Deciding whether to multiply or divide:',
      math:  '\\text{Larger unit} \\to \\text{Smaller unit: multiply} \\quad \\text{Smaller unit} \\to \\text{Larger unit: divide}'
    }
  ],
  referenceLabel: 'Metric Conversion Facts'
};

// ── 5. BOOT LINE ──────────────────────────────────────────────────────
//QsetFW.init(config, document.getElementById('module-container'));
document.addEventListener('DOMContentLoaded', function () {
QsetFW.init(config, document.getElementById('module-container'));
});
export default config;
