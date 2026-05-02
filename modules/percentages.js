// ── 1. HEADER COMMENT ─────────────────────────────────────────────────
// Topic:        Percentages Practice
// NCEA Level:   1 (NZ Curriculum)
// Year Group:   Year 9-10
// Generated:    28 April 2026
// Type Mix:     100% NUMERIC 
// Description:  Adapted from original HTML to thin-contract architecture.

// ── 2. CONSTANTS & UTILITIES ──────────────────────────────────────────

const CALC_TYPES = {
    PART: 'Part quantity', PERCENT: 'Percentage', TOTAL: 'Total quantity',
    NEW_INC: 'New quantity after increase', NEW_DEC: 'New quantity after decrease',
    PERC_INC: 'Percentage increase', PERC_DEC: 'Percentage decrease'
};

const FRACTIONS = [
    { p: 12.5, frac: '12.5', label: '12.5' }, { p: 33.3333, frac: '33\\frac{1}{3}', label: '33⅓' },
    { p: 66.6667, frac: '66\\frac{2}{3}', label: '66⅔' }, { p: 37.5, frac: '37.5', label: '37.5' },
    { p: 62.5, frac: '62.5', label: '62.5' }, { p: 87.5, frac: '87.5', label: '87.5' }
];

const CONTEXTS_INC = ['price', 'weekly wage', 'monthly rent', 'daily revenue', 'investment value'];
const CONTEXTS_DEC = ['price', 'car value', 'weekly budget', 'account balance', 'running cost'];

const REAL_CONTEXTS = [
    (q) => `A TV originally costing $${q.total} is discounted by \\(${q.pLabel}\\%\\). What is the new price?`,
    (q) => `A farm's daily milk yield of ${q.total} litres grows by \\(${q.pLabel}\\%\\). What is the new yield?`,
    (q) => `A recipe requires ${q.total}g of flour, but you want to make \\(${q.pLabel}\\%\\) of the recipe. How much flour do you need?`,
    (q) => `A hiker has completed ${q.part} km of a ${q.total} km trail. What percentage is this?`,
    (q) => `A jacket is on sale for $${q.part}, which is \\(${q.pLabel}\\%\\) of its original price. What was the original price?`,
    (q) => `A runner's weekly distance increased from ${q.total} km to ${q.newVal} km. What is the percentage increase?`,
    (q) => `A car's value dropped from $${q.total} to $${q.newVal}. What is the percentage decrease?`
];

const LEVEL_INFO = {
    1: { name: "Level 1: Find the Part", inst: "You are given the Total (100%) and a Percentage. Find the value of the Part." },
    2: { name: "Level 2: Find the Percentage", inst: "You are given the Part and the Total. Find what Percentage the part represents." },
    3: { name: "Level 3: Find the Total", inst: "You are given a Part and its corresponding Percentage. Find the Total (100%)." },
    4: { name: "Level 4: Percentage Change", inst: "Calculate the difference (change) first, then find what percentage that change is of the original amount." },
    5: { name: "Level 5: Find New Quantity", inst: "Find the multiplier (1 + %/100 for increase, 1 - %/100 for decrease), then multiply the original amount by it." },
    6: { name: "Level 6: Mixed Contexts", inst: "Read the real-world problem. First, identify what you need to calculate. Then solve it." }
};

let seed = 12345;
function random() { let x = Math.sin(seed++) * 10000; return x - Math.floor(x); }
function randInt(min, max) { return Math.floor(random() * (max - min + 1)) + min; }
function pickRandom(arr) { return arr[randInt(0, arr.length - 1)]; }

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

let _uidCounter = 0;
function makeUID(type, level, diff) {
    _uidCounter++;
    const n = String(_uidCounter).padStart(3, "0");
    return `num-${n}-lev${level}-d${diff}`;
}

function getNiceTotal(tier) {
    if (tier === 'int') return pickRandom([10, 20, 25, 40, 50, 80, 100, 150, 200, 250, 400, 500]);
    if (tier === 'dec') return pickRandom([12, 14, 18, 24, 32, 34, 42, 54, 68, 75, 84, 96, 110]);
    if (tier === 'frac') return pickRandom([24, 48, 72, 96, 120, 240, 360, 480, 600]);
}

function getNicePercent(tier) {
    if (tier === 'int') return pickRandom([5, 10, 15, 20, 25, 30, 40, 45, 50, 60, 70, 75, 80, 90]);
    if (tier === 'dec') return pickRandom([2, 4, 6, 8, 12, 14, 16, 18, 22, 26, 34, 46]);
    if (tier === 'frac') return pickRandom(FRACTIONS);
}

function generateTierData(count, tier) {
    const data = [];
    for (let i = 0; i < count; i++) {
        let t = getNiceTotal(tier);
        let pObj = getNicePercent(tier);
        let p = typeof pObj === 'object' ? pObj.p : pObj;
        let pLabel = typeof pObj === 'object' ? pObj.label : p.toString();
        let pFrac = typeof pObj === 'object' ? pObj.frac : p.toString();
        let part = t * (p / 100);
        if (tier === 'dec') part = Math.round(part * 100) / 100;
        if (tier === 'frac') part = Math.round(part); 
        let newValInc = Math.round((t + part) * 100) / 100;
        let newValDec = Math.round((t - part) * 100) / 100;
        data.push({ tier, total: t, p, pLabel, pFrac, part, newValInc, newValDec });
    }
    return data;
}

const makeNumberLineSVG = (q, showAnswer) => {
    let maxPercent = 100;
    if (q.type === CALC_TYPES.NEW_INC || q.type === CALC_TYPES.PERC_INC) {
        let p = q.type === CALC_TYPES.NEW_INC ? q.p : (Math.abs(q.newVal - q.total) / q.total) * 100;
        if (100 + p > 100) { 
            maxPercent = Math.ceil((100 + p) / 10) * 10; 
            if (maxPercent === 100 + p) maxPercent += 10; 
        }
    }

    const W = 800, H = 120, padX = 40, lineW = W - (padX * 2), yTop = 30, yBot = 90;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%">`;
    svg += `<style>
        .nl-line { stroke: #4b5563; stroke-width: 2; stroke-linecap: round; }
        .nl-tick { stroke: #4b5563; stroke-width: 1.5; }
        .nl-text { font-size: 13px; fill: #374151; font-family: sans-serif; text-anchor: middle; }
        .nl-text-bold { font-size: 13px; fill: #111827; font-weight: bold; font-family: sans-serif; text-anchor: middle; }
        .nl-marker-line { stroke-width: 2; stroke-dasharray: 4,4; stroke: #16a34a; }
        .nl-marker-dot { r: 5; fill: #16a34a; }
        .correct-text { fill: #16a34a; font-weight: bold; font-size: 15px; text-anchor: middle;}
        .base-dot { r: 4; fill: #374151; }
    </style>`;

    svg += `<line x1="${padX}" y1="${yTop}" x2="${W-padX}" y2="${yTop}" class="nl-line"/>`;
    svg += `<line x1="${padX}" y1="${yBot}" x2="${W-padX}" y2="${yBot}" class="nl-line"/>`;
    svg += `<text x="${padX/2}" y="${yTop+4}" class="nl-text-bold">%</text>`;
    svg += `<text x="${padX/2}" y="${yBot+4}" class="nl-text-bold">Val</text>`;

    for (let p = 0; p <= maxPercent; p += 10) {
        let x = padX + (p / maxPercent) * lineW;
        let v = (p / 100) * q.total;
        svg += `<line x1="${x}" y1="${yTop-5}" x2="${x}" y2="${yTop+5}" class="nl-tick"/>`;
        svg += `<text x="${x}" y="${yTop-12}" class="nl-text">${p}</text>`;
        svg += `<line x1="${x}" y1="${yBot-5}" x2="${x}" y2="${yBot+5}" class="nl-tick"/>`;
        
        let showBotVal = true;
        if (q.type === CALC_TYPES.TOTAL && !showAnswer && v > q.part) showBotVal = false;
        if (showBotVal) {
            svg += `<text x="${x}" y="${yBot+18}" class="nl-text">${Number.isInteger(v) ? v : v.toFixed(1)}</text>`;
        }
    }

    const addBaseDot = (p) => {
        let x = padX + (p / maxPercent) * lineW;
        svg += `<circle cx="${x}" cy="${yTop}" class="base-dot"/>`;
        svg += `<circle cx="${x}" cy="${yBot}" class="base-dot"/>`;
    };

    if (!showAnswer) {
        if ([CALC_TYPES.PART, CALC_TYPES.PERCENT, CALC_TYPES.PERC_INC, CALC_TYPES.PERC_DEC, CALC_TYPES.NEW_INC, CALC_TYPES.NEW_DEC].includes(q.type)) {
            addBaseDot(100);
        } else if (q.type === CALC_TYPES.TOTAL) {
            addBaseDot(q.p);
        }
    } else {
        let cP = 0, cV = 0;
        if ([CALC_TYPES.PART, CALC_TYPES.TOTAL, CALC_TYPES.PERCENT].includes(q.type)) {
            cP = q.p; cV = q.part; addBaseDot(100);
        } else {
            cP = (q.type === CALC_TYPES.NEW_INC || q.type === CALC_TYPES.PERC_INC) ? 100 + q.p : 100 - q.p;
            cV = q.newVal; addBaseDot(100);
        }
        
        let cx = padX + (cP / maxPercent) * lineW;
        svg += `<line x1="${cx}" y1="${yTop}" x2="${cx}" y2="${yBot}" class="nl-marker-line"/>`;
        svg += `<circle cx="${cx}" cy="${yTop}" class="nl-marker-dot"/>`;
        svg += `<circle cx="${cx}" cy="${yBot}" class="nl-marker-dot"/>`;
        
        svg += `<text x="${cx}" y="${yTop-18}" class="correct-text">${cP}%</text>`;
        svg += `<text x="${cx}" y="${yBot+24}" class="correct-text">${Number.isInteger(cV) ? cV : cV.toFixed(2)}</text>`;
    }

    svg += `</svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg.trim());
};

// ── 2b. GLOBAL SLIDER INJECTION LOGIC ─────────────────────────────────

if (typeof window !== 'undefined' && !window.initPercSlider) {
    window.initPercSlider = function(uid, level, total, part, pLabel, pVal, imgEl) {
        // Small delay ensures qs_fwk.js has finished mounting the input area
        setTimeout(() => {
            // Safety check: Only inject slider if this question is currently visible on the Study Card Front
            if (!imgEl || !imgEl.closest('#qset-front')) return;

            const inpArea = document.getElementById('qset-input-area');
            if (!inpArea || document.getElementById('perc-slider-wrap-' + uid)) return;

            const wrap = document.createElement('div');
            wrap.id = 'perc-slider-wrap-' + uid;
            wrap.style.cssText = 'margin-bottom: 1rem; padding: 1rem; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); text-align: left;';

            let min = 0, max = 100, step = 1, startVal = 50;
            let instruction = '';

            if (level === 1) { // Find Part
                max = 100; step = 1; startVal = 50;
                instruction = `<div style="font-size:0.9rem; font-weight:600; color:#334155; margin-bottom:8px;">Estimation Tool: Try sliding to estimate the part!</div>
                               <div style="font-size:0.95rem; color:#0f172a; margin-bottom:12px;">If the percentage were <strong id="val-${uid}" style="color:#2563eb;">50%</strong>, the part would be <strong id="res-${uid}" style="color:#16a34a;">...</strong></div>`;
            } else if (level === 2) { // Find Percentage
                max = total; step = total < 20 ? 0.5 : 1; startVal = Math.round(total / 2);
                instruction = `<div style="font-size:0.9rem; font-weight:600; color:#334155; margin-bottom:8px;">Estimation Tool: Try sliding to estimate the percentage!</div>
                               <div style="font-size:0.95rem; color:#0f172a; margin-bottom:12px;">If the part was <strong id="val-${uid}" style="color:#2563eb;">...</strong>, that would be <strong id="res-${uid}" style="color:#16a34a;">...</strong></div>`;
            } else if (level === 3) { // Find Total
                max = Math.ceil(total * 1.5);
                if (max % 10 !== 0) max += (10 - (max % 10)); // Round max nicely
                step = max <= 50 ? 0.5 : 1;
                startVal = Math.round(max / 2);
                instruction = `<div style="font-size:0.9rem; font-weight:600; color:#334155; margin-bottom:8px;">Estimation Tool: Estimate the total so the calculated part equals <span style="color:#dc2626; font-weight:800;">${part}</span>!</div>
                               <div style="font-size:0.95rem; color:#0f172a; margin-bottom:12px;">If the total was <strong id="val-${uid}" style="color:#2563eb;">...</strong>, then \\(${pLabel}\\%\\) would be <strong id="res-${uid}" style="color:#16a34a;">...</strong></div>`;
            }

            wrap.innerHTML = `
                ${instruction}
                <div style="position:relative; width:100%; height:24px; display:flex; align-items:center;">
                    <input type="range" id="slider-${uid}" min="${min}" max="${max}" step="${step}" value="${startVal}"
                        style="width:100%; -webkit-appearance:none; appearance:none; height:8px; border-radius:4px; background:#e2e8f0; outline:none; margin:0;">
                </div>
                <style>
                    #slider-${uid}::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:22px; height:22px; border-radius:50%; background:#2563eb; cursor:pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); border: 2px solid white; transition: transform 0.1s; }
                    #slider-${uid}::-webkit-slider-thumb:hover { transform: scale(1.15); }
                    #slider-${uid}::-moz-range-thumb { width:22px; height:22px; border-radius:50%; background:#2563eb; cursor:pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); border: 2px solid white; transition: transform 0.1s; }
                    #slider-${uid}::-moz-range-thumb:hover { transform: scale(1.15); }
                </style>
            `;

            // Prepend so the estimation tool sits above the text input field
            inpArea.insertBefore(wrap, inpArea.firstChild);

            // Re-render MathJax inside the injection (useful for fraction labels in Level 3)
            if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
                MathJax.typesetPromise([wrap]).catch(() => {});
            }

            const slider = document.getElementById('slider-' + uid);
            const valEl = document.getElementById('val-' + uid);
            const resEl = document.getElementById('res-' + uid);

            const formatNum = (n) => {
                const rounded = Math.round(n * 100) / 100;
                return Number.isInteger(rounded) ? rounded : rounded.toFixed(1);
            };

            const updateSlider = () => {
                const val = parseFloat(slider.value);
                const percent = ((val - min) / (max - min)) * 100;
                
                // Active track coloring
                slider.style.background = `linear-gradient(to right, #93c5fd 0%, #3b82f6 ${percent}%, #e2e8f0 ${percent}%, #e2e8f0 100%)`;

                if (level === 1) {
                    valEl.textContent = val + '%';
                    resEl.textContent = formatNum((val / 100) * total);
                } else if (level === 2) {
                    valEl.textContent = val;
                    resEl.textContent = formatNum((val / total) * 100) + '%';
                } else if (level === 3) {
                    valEl.textContent = val;
                    resEl.textContent = formatNum((pVal / 100) * val);
                }
            };

            slider.addEventListener('input', updateSlider);
            updateSlider(); // Initialize logic immediately

        }, 30);
    };
}


// ── 3. CONFIG OBJECT ──────────────────────────────────────────────────

const config = {
    id: "percentages",
    title: "Percentages Practice",
    levelNames: [
        LEVEL_INFO[1].name,
        LEVEL_INFO[2].name,
        LEVEL_INFO[3].name,
        LEVEL_INFO[4].name,
        LEVEL_INFO[5].name,
        LEVEL_INFO[6].name
    ],

    _qPools: {},

    _formatQuestion(q) {
        let ansStr = String(q.ans);
        let units = [];
        if ([CALC_TYPES.PERCENT, CALC_TYPES.PERC_INC, CALC_TYPES.PERC_DEC].includes(q.type)) {
            units = ['%'];
        }

        let worked = '';
        let ansTex = ansStr;
        if (units.includes('%')) ansTex += '\\%';
        
        switch(q.type) {
            case CALC_TYPES.PART:
                worked = `\\[ \\begin{aligned} \\frac{x}{${q.total}} &= \\frac{${q.pFrac}}{100} \\\\ x &= \\frac{${q.pFrac}}{100} \\times ${q.total} \\\\ x &= \\mathbf{${ansTex}} \\end{aligned} \\]`;
                break;
            case CALC_TYPES.PERCENT:
                worked = `\\[ \\begin{aligned} \\frac{${q.part}}{${q.total}} &= \\frac{x}{100} \\\\ x &= \\frac{${q.part}}{${q.total}} \\times 100 \\\\ x &= \\mathbf{${ansTex}} \\end{aligned} \\]`;
                break;
            case CALC_TYPES.TOTAL:
                worked = `\\[ \\begin{aligned} \\frac{\\text{total}}{${q.part}} &= \\frac{100}{${q.pFrac}} \\\\ \\text{total} &= \\frac{100}{${q.pFrac}} \\times ${q.part} \\\\ \\text{total} &= \\mathbf{${ansTex}} \\end{aligned} \\]`;
                break;
            case CALC_TYPES.PERC_INC:
            case CALC_TYPES.PERC_DEC:
                let diff = Math.round(Math.abs(q.newVal - q.total) * 100) / 100;
                worked = `\\[ \\begin{aligned} \\text{Change} &= |${q.newVal} - ${q.total}| = ${diff} \\\\ \\% \\text{ change} &= \\frac{${diff}}{${q.total}} \\times 100 \\\\ &= \\mathbf{${ansTex}} \\end{aligned} \\]`;
                break;
            case CALC_TYPES.NEW_INC:
            case CALC_TYPES.NEW_DEC:
                let multVal = q.type === CALC_TYPES.NEW_INC ? 1 + (q.p/100) : 1 - (q.p/100);
                let sign = q.type === CALC_TYPES.NEW_INC ? '+' : '-';
                worked = `\\[ \\begin{aligned} \\text{Multiplier} &= 1 ${sign} \\frac{${q.pFrac}}{100} = ${multVal} \\\\ \\text{New} &= ${q.total} \\times ${multVal} \\\\ &= \\mathbf{${ansTex}} \\end{aligned} \\]`;
                break;
        }
        
        let imgSvg = makeNumberLineSVG(q, false);
        let imgAnsSvg = makeNumberLineSVG(q, true);
        
        let questionText = q.text;
        const uid = makeUID('NUMERIC', q.level, q.diff);

        // -- SLIDER INJECTION HOOK FOR LEVELS 1, 2, AND 3 --
        if (q.level === 1 || q.level === 2 || q.level === 3) {
            // Encode the pLabel to ensure fractional LaTeX formatting doesn't break the string payload
            let encodedPLabel = encodeURIComponent(q.pLabel);
            let onloadTrigger = `<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" onload="if(window.initPercSlider) window.initPercSlider('${uid}', ${q.level}, ${q.total}, ${q.part}, decodeURIComponent('${encodedPLabel}'), ${q.p}, this)" style="display:none;" />`;
            questionText += onloadTrigger;
        }

        if (q.level === 6) {
            const typeOptionsHtml = Object.values(CALC_TYPES).map(type => `
                <label style="display:flex; align-items:center; gap:8px; padding:8px; border:1px solid #e2e8f0; border-radius:4px; margin-bottom:6px; cursor:pointer; background:white; font-size:0.9rem; transition:background 0.15s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='white'">
                    <input type="radio" name="qType_${uid}" value="${type}" onchange="window.yamaCheckType('${uid}', '${q.type}', this)">
                    <span>${type}</span>
                </label>
            `).join('');

            questionText = `
            <style>
                body:has(#qset-front #yama-type-selector-${uid}) #qset-input-area,
                body:has(#qset-front #yama-type-selector-${uid}) #qset-check,
                body:has(#qset-ch-qbox #yama-type-selector-${uid}) #qset-ch-ctrl {
                    display: none !important;
                }
                .qset-ws-face .yama-type-selector,
                .qset-spotlight .yama-type-selector {
                    display: none !important;
                }
                @media print {
                    .yama-type-selector { display: none !important; }
                }
            </style>
            <div style="width: 100%;">
                ${q.text}
            </div>
            <div id="yama-type-selector-${uid}" class="yama-type-selector" style="text-align:left; background:#f8fafc; padding:1rem; border:1px solid #cbd5e1; border-radius:6px; width:100%; box-sizing:border-box; margin-top:1rem; font-size:0.95rem;">
                <div style="font-weight:700; color:#1e293b; margin-bottom:10px;">What are you being asked to find?</div>
                <div style="display:flex; flex-direction:column;">
                    ${typeOptionsHtml}
                </div>
                <div id="yama-type-fb-${uid}" style="margin-top:8px; font-size:0.85rem; font-weight:700; color:#dc2626; display:none;"></div>
            </div>
            `;

            if (!window.yamaCheckType) {
                window.yamaCheckType = function(uid, correctType, radio) {
                    const fb = document.getElementById('yama-type-fb-' + uid);
                    if (radio.value === correctType) {
                        const selector = document.getElementById('yama-type-selector-' + uid);
                        if (selector) selector.remove();
                    } else {
                        fb.textContent = "Not quite. Reread the question carefully. What is missing?";
                        fb.style.display = "block";
                        setTimeout(() => { radio.checked = false; }, 600);
                    }
                };
            }
        }
        
        return {
            uid: uid,
            type: 'NUMERIC',
            calcType: q.type,
            level: q.level,
            diff: q.diff,
            q: questionText,
            a: ansStr,
            units: units,
            tolerance: 0.011,
            requireUnits: true,
            img: imgSvg,
            imgAlt: "Double number line",
            working: `<div style="text-align:center; margin-bottom: 1rem;"><img src="${imgAnsSvg}" style="max-width:100%; height:auto;" alt="Solved number line" /></div>` + worked,
            hint: LEVEL_INFO[q.level].inst
        };
    },

    _buildPool(level) {
        const pool = [];
        const tierToDiff = { 'int': 1, 'dec': 2, 'frac': 3 };

        if (level >= 1 && level <= 5) {
            const raw = [...generateTierData(15, 'int'), ...generateTierData(15, 'dec'), ...generateTierData(15, 'frac')];
            raw.forEach((d, i) => {
                let q = { ...d, id: i + 1, level: level, diff: tierToDiff[d.tier] };
                if (level === 1) {
                    q.text = `What is \\(${q.pLabel}\\%\\) of \\(${q.total}\\)?`; q.ans = q.part; q.type = CALC_TYPES.PART;
                } else if (level === 2) {
                    q.text = `\\(${q.part}\\) is what percentage of \\(${q.total}\\)?`; q.ans = q.p; q.type = CALC_TYPES.PERCENT;
                } else if (level === 3) {
                    q.text = `\\(${q.part}\\) is \\(${q.pLabel}\\%\\) of what total?`; q.ans = q.total; q.type = CALC_TYPES.TOTAL;
                } else if (level === 4) {
                    let isInc = i % 2 === 0; let ctx = isInc ? pickRandom(CONTEXTS_INC) : pickRandom(CONTEXTS_DEC);
                    let newV = isInc ? q.newValInc : q.newValDec;
                    q.text = `A ${ctx} ${isInc ? 'increased' : 'dropped'} from $${q.total} to $${newV}. What is the percentage ${isInc ? 'increase' : 'decrease'}?`;
                    q.ans = q.p; q.type = isInc ? CALC_TYPES.PERC_INC : CALC_TYPES.PERC_DEC; q.isInc = isInc; q.newVal = newV;
                } else if (level === 5) {
                    let isInc = i % 2 === 0; let ctx = isInc ? pickRandom(CONTEXTS_INC) : pickRandom(CONTEXTS_DEC);
                    q.text = `A $${q.total} ${ctx} ${isInc ? 'increases' : 'decreases'} by \\(${q.pLabel}\\%\\). What is the new ${ctx}?`;
                    q.ans = isInc ? q.newValInc : q.newValDec; q.type = isInc ? CALC_TYPES.NEW_INC : CALC_TYPES.NEW_DEC;
                    q.isInc = isInc; q.newVal = q.ans;
                }
                pool.push(this._formatQuestion(q));
            });
        } else if (level === 6) {
            const configs = [
                { type: CALC_TYPES.PART, sub: 'a', template: REAL_CONTEXTS[2] },
                { type: CALC_TYPES.PERCENT, sub: 'b', template: REAL_CONTEXTS[3] },
                { type: CALC_TYPES.TOTAL, sub: 'c', template: REAL_CONTEXTS[4] },
                { type: CALC_TYPES.NEW_INC, sub: 'd', template: REAL_CONTEXTS[1], isInc: true },
                { type: CALC_TYPES.NEW_DEC, sub: 'e', template: REAL_CONTEXTS[0], isInc: false },
                { type: CALC_TYPES.PERC_INC, sub: 'f', template: REAL_CONTEXTS[5], isInc: true },
                { type: CALC_TYPES.PERC_DEC, sub: 'g', template: REAL_CONTEXTS[6], isInc: false }
            ];
            configs.forEach(cfg => {
                let raw = [...generateTierData(5, 'int'), ...generateTierData(5, 'dec'), ...generateTierData(5, 'frac')];
                raw.forEach((d) => {
                    let q = { ...d, level: 6, diff: tierToDiff[d.tier], type: cfg.type, isInc: cfg.isInc };
                    q.newVal = q.isInc ? q.newValInc : (q.isInc === false ? q.newValDec : null);
                    q.text = cfg.template(q);
                    
                    if (cfg.type === CALC_TYPES.PART) q.ans = q.part; 
                    else if (cfg.type === CALC_TYPES.PERCENT) q.ans = q.p;
                    else if (cfg.type === CALC_TYPES.TOTAL) q.ans = q.total; 
                    else if (cfg.type === CALC_TYPES.NEW_INC || cfg.type === CALC_TYPES.NEW_DEC) q.ans = q.newVal;
                    else if (cfg.type === CALC_TYPES.PERC_INC || cfg.type === CALC_TYPES.PERC_DEC) q.ans = q.p;
                    
                    pool.push(this._formatQuestion(q));
                });
            });
        }
        return shuffle(pool);
    },

    getQuestion(level, diff) {
        if (!this._qPools[level] || this._qPools[level].length === 0) {
            this._qPools[level] = this._buildPool(level);
        }

        if (diff == null) {
            const avail = {
                1: [1, 2, 3],
                2: [1, 2, 3],
                3: [1, 2, 3],
                4: [1, 2, 3],
                5: [1, 2, 3],
                6: [1, 2, 3]
            };
            const choices = avail[level] || [1, 2, 3];
            diff = choices[Math.floor(Math.random() * choices.length)];
        }

        const idx = this._qPools[level].findIndex(q => q.diff === diff);
        if (idx !== -1) {
            return this._qPools[level].splice(idx, 1)[0];
        }

        return this._qPools[level].pop(); 
    },

    renderFront(q, el) {
        let html = "";
        if (q.img && q.img !== "") {
            html += `<img src="${q.img}" alt="${q.imgAlt || ""}" class="question-image" style="max-width:100%;max-height:160px;object-fit:contain;display:block;margin:0 auto 1em auto;"/>`;
            html += `<div class="question-text" style="text-align:center; font-size:1.1rem; font-weight:500;">${q.q}</div>`;
        } else {
            html += `<div class="question-text centered-text" style="text-align:center;">${q.q}</div>`;
        }
        el.innerHTML = html;
    },

    generateSolution(q) {
        return q.working || "";
    },

    referenceItems: [
        {
            label: "Part",
            title: "Finding the Part",
            text: "When you know the Total (100%) and a Percentage:",
            math: "\\text{Part} = \\frac{\\text{Percentage}}{100} \\times \\text{Total}"
        },
        {
            label: "Perc",
            title: "Finding the Percentage",
            text: "When you know the Part and the Total:",
            math: "\\text{Percentage} = \\frac{\\text{Part}}{\\text{Total}} \\times 100"
        },
        {
            label: "Tot",
            title: "Finding the Total",
            text: "When you know a Part and its corresponding Percentage:",
            math: "\\text{Total} = \\frac{100}{\\text{Percentage}} \\times \\text{Part}"
        },
        {
            label: "Change",
            title: "Percentage Change",
            text: "Calculate the difference, then divide by the original total:",
            math: "\\% \\text{ Change} = \\frac{\\text{Difference}}{\\text{Original}} \\times 100"
        }
    ],
    referenceLabel: "Formulae"
};

export default config;
