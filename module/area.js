/**
 * Area of Shapes - JS Module
 * Exports a loadModule function to be called from index.html
 */

// =====================================================================
// 1. AUDIO CONTEXT (For Timer Beep)
// =====================================================================
let audioCtx = null;
function playBeep() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.value = 800; // 800Hz beep
    gain.gain.setValueAtTime(1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
}

// =====================================================================
// 2. CSS INJECTION (Dynamic Loading)
// =====================================================================
function _loadCSS() {
    if (document.getElementById('qset-fw-styles-link')) return;
    const link = document.createElement('link');
    link.id = 'qset-fw-styles-link';
    link.rel = 'stylesheet';
    link.href = '../static/yama.css';
    document.head.appendChild(link);
}

// =====================================================================
// 3. UI GENERATION
// =====================================================================
function _buildHTML(cfg) {
    const opts = cfg.levelNames.map((n, i) => `<option value="${i + 1}">${n}</option>`).join('');
    const hasRef = cfg.referenceItems && cfg.referenceItems.length > 0;
    
    return `
    <div class="qset-mod">
      <div class="qset-tabs no-print">
        <button class="qset-tab active" data-mode="study">Self Study</button>
        <button class="qset-tab" data-mode="worksheet">Grid Mode (Worksheet)</button>
        <div class="qset-tab-div"></div>
        <select id="qset-level" class="qset-select">${opts}</select>
      </div>

      <!-- Formula / Reference Bar (Hidden at level 6+) -->
      ${hasRef ? `
      <div class="qset-ref-section no-print" id="qset-ref-section">
        <div class="qset-ref-label">${cfg.referenceLabel || 'Reference'}</div>
        <div class="qset-ref-scroll" id="qset-ref-row"></div>
      </div>` : ''}

      <!-- Study Mode -->
      <div class="qset-panel active" id="qset-panel-study">
        <div class="qset-study-layout">
          <div class="qset-card-wrap"><div class="qset-card" id="qset-card"><div class="qset-card-front" id="qset-card-content"></div><div class="qset-card-back" id="qset-card-back"><div id="qset-solution" style="width:100%;"></div></div></div></div>
          <div class="qset-answer-panel"><div id="qset-input-area"></div><div class="qset-btn-row"><button class="qset-btn qset-primary" id="qset-check">Check Answer</button><button class="qset-btn qset-secondary qset-hidden" id="qset-next">Next ➔</button></div></div>
        </div>
      </div>

      <!-- Grid/Worksheet Mode with Spotlight -->
      <div class="qset-panel" id="qset-panel-worksheet">
        <div class="qset-ws-header no-print"><div><h2>Grid Practice: <span id="qset-ws-title"></span></h2><p>Click a card to enter Spotlight Mode.</p></div><button class="qset-btn qset-primary" id="qset-ws-gen" style="flex:unset;">Generate New Set</button></div>
        <div class="qset-ws-grid" id="qset-ws-grid"></div>
        
        <div class="qset-spotlight" id="qset-spotlight">
          <div class="qset-backdrop" id="qset-backdrop"></div>
          <div class="qset-spotlight-wrap">
            <div class="qset-sp-timer-box" id="qset-sp-timer">00:30</div>
            <div class="qset-card-wrap">
              <div class="qset-card" id="qset-sp-card">
                <div class="qset-card-front" id="qset-sp-front"></div>
                <div class="qset-card-back" id="qset-sp-back"></div>
              </div>
            </div>
            <p class="qset-sp-hint">Click card to reveal answer &nbsp;·&nbsp; <kbd>Esc</kbd> to close</p>
          </div>
        </div>
      </div>

      <!-- Reference Modal -->
      ${hasRef ? `
      <div class="qset-modal-overlay" id="qset-modal">
        <div class="qset-modal-box">
            <div class="qset-modal-hdr">
                <h3><span class="qset-modal-badge" id="qset-modal-badge"></span><span id="qset-modal-ttl"></span></h3>
                <button class="qset-modal-close" id="qset-modal-close">&times;</button>
            </div>
            <div class="qset-modal-body">
                <p id="qset-modal-txt"></p>
                <div class="qset-modal-ex">
                    <span class="qset-modal-ex-lbl">Formula</span>
                    <div id="qset-modal-math" style="font-size: 1.5rem; text-align: center; margin-top: 0.5rem; font-weight: bold; color: #1e293b;"></div>
                </div>
            </div>
            <div class="qset-modal-foot">
                <button class="qset-btn qset-ghost" id="qset-modal-ok" style="flex:unset;min-width:8rem;">Got it ✓</button>
            </div>
        </div>
      </div>` : ''}

    </div>`;
}

// =====================================================================
// 4. DATA GENERATOR (Unique Scenarios, Random Numbers, Grid Rules)
// =====================================================================
const utils = {
    rand: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    pickAndRemove: (arr) => {
        if (arr.length === 0) return "generic object";
        const idx = Math.floor(Math.random() * arr.length);
        return arr.splice(idx, 1)[0];
    },
    makeSVG: (paths, texts, showGrid, angle = 0) => {
        let defs = '', bg = '';
        if (showGrid) {
            defs = `<pattern id="gp" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10 M 0 10 L 10 10" fill="none" stroke="#cbd5e1" stroke-width="0.5"/></pattern>`;
            bg = `<rect width="120" height="120" fill="url(#gp)"/>`;
        }
        const gTransform = `transform="rotate(${angle}, 60, 60)"`;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%"><defs>${defs}</defs>${bg}<g ${gTransform}>${paths}</g><g>${texts}</g></svg>`;
        return "data:image/svg+xml;utf8," + encodeURIComponent(svg.trim());
    },
    textEl: (x, y, txt, size=8) => `<text x="${x}" y="${y}" font-size="${size}" fill="#0f172a" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${txt}</text>`
};

const angles = [0, 90, 180, 270, 45, 135, 225, 315];
let lastAngle = 0;

const generateQuestion = (level, index = 0) => {
    let angle = 0;

    // Progress from easy to difficult: keep first 3 figures unrotated for levels 1-5
    if (level <= 5 && index < 3) {
        angle = 0;
        lastAngle = 0;
    } else {
        // Enforce different orientations
        angle = angles[utils.rand(0, angles.length - 1)];
        while (angle === lastAngle) angle = angles[utils.rand(0, angles.length - 1)];
        lastAngle = angle;
    }

    let qData = { level, type: 'NUMERIC', q: '', a: '', working: '', img: '' };
    
    let shapeLevel = level;
    if (level > 4) {
        shapeLevel = utils.rand(1, 4); 
    }

    if (shapeLevel === 1) {
        const isSquare = utils.rand(0, 1) === 0;
        const w = isSquare ? utils.rand(3, 10) : utils.rand(4, 11);
        const h = isSquare ? w : utils.rand(2, 8);
        if (!isSquare && w === h) return generateQuestion(level, index); 
        
        const scenarios = ["rug", "baking tray", "poster", "courtyard", "table top", "swimming pool section", "tablet screen", "door frame", "window pane"];
        const ctx = utils.pickAndRemove(scenarios);
        
        qData.q = `Find the area of the rectangular ${ctx} in units².`;
        qData.a = (w * h).toString();
        qData.working = `Area = length × width<br>A = ${w} × ${h} = ${w*h}`;
        
        const x = 60 - (w*10)/2, y = 60 - (h*10)/2;
        const paths = `<rect x="${x}" y="${y}" width="${w*10}" height="${h*10}" fill="rgba(186,230,253,0.7)" stroke="#0284c7" stroke-width="2"/>`;
        const texts = utils.textEl(60, y - 5, `${w}`) + utils.textEl(x - 5, 60, `${h}`);
        qData.img = utils.makeSVG(paths, texts, true, angle);

    } else if (shapeLevel === 2) {
        const b = utils.rand(4, 10), h = utils.rand(4, 10);
        const scenarios = ["sail", "warning sign", "garden bed", "pennant flag", "roof gable", "origami fold", "wedge of cheese"];
        const ctx = utils.pickAndRemove(scenarios);
        
        qData.q = `Find the area of the triangular ${ctx} in units².`;
        qData.a = (0.5 * b * h).toString();
        qData.working = `Area = ½ × base × height<br>A = 0.5 × ${b} × ${h} = ${0.5*b*h}`;
        
        const topX = utils.rand(1, b) * 10;
        const px = 60 - (b*10)/2, py = 60 + (h*10)/2; 
        
        const paths = `
            <polygon points="${px},${py} ${px + b*10},${py} ${px + topX},${py - h*10}" fill="rgba(167,243,208,0.7)" stroke="#059669" stroke-width="2"/>
            <line x1="${px + topX}" y1="${py}" x2="${px + topX}" y2="${py - h*10}" stroke="#059669" stroke-dasharray="2,2" stroke-width="1.5"/>`;
        const texts = utils.textEl(60, py + 8, `${b}`) + utils.textEl(px + topX + 8, 60, `${h}`);
        qData.img = utils.makeSVG(paths, texts, true, angle);

    } else if (shapeLevel === 3) {
        const b = utils.rand(4, 8), h = utils.rand(3, 7);
        const offset = utils.rand(2, 4);
        const scenarios = ["solar panel", "parking space", "tiled mosaic", "slanted window", "folded napkin", "eraser", "paving stone"];
        const ctx = utils.pickAndRemove(scenarios);
        
        qData.q = `Calculate the area of the parallelogram-shaped ${ctx}.`;
        qData.a = (b * h).toString();
        qData.working = `Area = base × perpendicular height<br>A = ${b} × ${h} = ${b*h}`;
        
        const px = 60 - ((b+offset)*10)/2, py = 60 + (h*10)/2;
        
        const paths = `
            <polygon points="${px},${py} ${px + b*10},${py} ${px + (b+offset)*10},${py - h*10} ${px + offset*10},${py - h*10}" fill="rgba(253,230,138,0.7)" stroke="#d97706" stroke-width="2"/>
            <line x1="${px + offset*10}" y1="${py}" x2="${px + offset*10}" y2="${py - h*10}" stroke="#d97706" stroke-dasharray="2,2" stroke-width="1.5"/>`;
        const texts = utils.textEl(px + (b*5), py + 8, `${b}`) + utils.textEl(px + offset*10 - 8, 60, `${h}`);
        qData.img = utils.makeSVG(paths, texts, true, angle);
        
    } else {
        const r = utils.rand(2, 12);
        const scenarios = ["pizza", "flowerbed", "circular track", "pond", "clock face", "target", "coaster"];
        const ctx = utils.pickAndRemove(scenarios);
        
        qData.q = `Find the area of the circular ${ctx} with a radius of ${r}m. (Use π = 3.14)`;
        qData.a = (3.14 * r * r).toFixed(2).replace(/\.00$/, '');
        qData.working = `Area = π × r²<br>A = 3.14 × ${r}²<br>A = 3.14 × ${r*r} = ${qData.a}`;
        
        const paths = `
            <circle cx="60" cy="60" r="40" fill="rgba(252,165,165,0.7)" stroke="#b91c1c" stroke-width="2"/>
            <line x1="60" y1="60" x2="100" y2="60" stroke="#b91c1c" stroke-width="1.5"/>
            <circle cx="60" cy="60" r="2" fill="#b91c1c"/>`;
        const texts = utils.textEl(80, 50, `${r}m`);
        qData.img = utils.makeSVG(paths, texts, false, 0); 
    }
    return qData;
};

const areaConfig = {
    levelNames: [
        'Level 1: Rectangles & Squares',
        'Level 2: Triangles',
        'Level 3: Parallelograms & Kites',
        'Level 4: Circles',
        'Level 5: Scaffolded Practice',
        'Level 6: Context Problems',
        'Level 7: Mixed Practice',
        'Level 8: Misconception Check',
        'Level 9: Compound Shapes',
        'Level 10: Extension & Challenge'
    ],
    
    referenceLabel: 'Formulas — Click to expand',
    referenceItems: [
        { label: 'Rect', title: 'Rectangle / Square', text: 'Length multiplied by width.', math: 'A = l × w' },
        { label: 'Tri', title: 'Triangle', text: 'Half the base multiplied by the perpendicular height.', math: 'A = ½ × b × h' },
        { label: 'Par', title: 'Parallelogram', text: 'Base multiplied by perpendicular height. Do NOT use the slant side.', math: 'A = b × h' },
        { label: 'Kite', title: 'Kite', text: 'Half the product of the two diagonals.', math: 'A = ½ × d₁ × d₂' },
        { label: 'Circ', title: 'Circle', text: 'Pi multiplied by the radius squared. (Use 3.14 for Pi unless otherwise stated).', math: 'A = π × r²' }
    ],

    getQuestionsForLevel: (level) => {
        let qs = [];
        for (let i=0; i<12; i++) qs.push(generateQuestion(level, i));
        return qs;
    },
    renderFront: (q, el) => {
        el.innerHTML = `<div class="area-front"><div class="area-front-q">${q.q}</div>${q.img ? `<div class="area-front-img"><img src="${q.img}" /></div>` : ''}</div>`;
    },
    generateSolution: (q) => `<div class="qset-sol-heading">Answer</div><div class="qset-sol-answer">${q.a}</div><div class="qset-sol-heading">Working</div><div class="qset-sol-workings">${q.working}</div>`,
    buildInputArea: (container, q, submitFn) => {
        container.innerHTML = `<input type="text" id="study-ans" class="mu-num-inp" placeholder="Enter answer..." autocomplete="off">`;
        container.querySelector('input').addEventListener('keypress', (e) => { if (e.key === 'Enter') submitFn(); });
    },
    validateInput: (q) => {
        const val = document.getElementById('study-ans').value.trim();
        return { isCorrect: val === q.a, expectedStr: q.a };
    }
};

// =====================================================================
// 5. INITIALIZATION & CONTROLLERS
// =====================================================================

/**
 * Initializes the Area of Shapes module inside a given container.
 * @param {HTMLElement|string} containerOrId - The DOM element or ID to mount the app to.
 */
export function loadModule(containerOrId) {
    const containerEl = typeof containerOrId === 'string' ? document.getElementById(containerOrId) : containerOrId;
    if (!containerEl) {
        console.error('QsetFW Module Loader: Target container not found.');
        return;
    }

    _loadCSS();
    containerEl.innerHTML = _buildHTML(areaConfig);
    const state = { mode: 'study', level: 1, queue: [], currentQ: null, spTimerInterval: null, spTimeLeft: 30 };
    const $ = id => document.getElementById(id);
    
    const D = { 
        tabs: containerEl.querySelectorAll('.qset-tab'), 
        panels: containerEl.querySelectorAll('.qset-panel'), 
        levelSel: $('qset-level'), 
        cardContent: $('qset-card-content'), 
        card: $('qset-card'), 
        solution: $('qset-solution'), 
        inputArea: $('qset-input-area'), 
        btnCheck: $('qset-check'), 
        btnNext: $('qset-next'), 
        wsGrid: $('qset-ws-grid'), 
        wsTitle: $('qset-ws-title'),
        spotlight: $('qset-spotlight'), 
        spCard: $('qset-sp-card'), 
        spFront: $('qset-sp-front'), 
        spBack: $('qset-sp-back'), 
        spTimer: $('qset-sp-timer'),
        refSection: $('qset-ref-section'),
        refRow: $('qset-ref-row'),
        modal: $('qset-modal'), 
        modalBadge: $('qset-modal-badge'), 
        modalTtl: $('qset-modal-ttl'), 
        modalTxt: $('qset-modal-txt'), 
        modalMath: $('qset-modal-math'), 
        modalClose: $('qset-modal-close'), 
        modalOk: $('qset-modal-ok')
    };

    function switchMode(mode) {
        state.mode = mode;
        D.tabs.forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
        D.panels.forEach(p => p.classList.toggle('active', p.id === `qset-panel-${mode}`));
        if (D.wsTitle) D.wsTitle.textContent = areaConfig.levelNames[state.level - 1];
        if (mode === 'study') _nextStudyQ();
        if (mode === 'worksheet') _generateWorksheet();
    }

    function switchLevel(lvl) {
        state.level = lvl;
        state.queue = areaConfig.getQuestionsForLevel(lvl);
        
        if (D.refSection) {
            if (lvl <= 5) {
                D.refSection.style.display = 'block';
            } else {
                D.refSection.style.display = 'none';
            }
        }
        
        switchMode(state.mode);
    }

    function _nextStudyQ() {
        if (state.queue.length === 0) state.queue = areaConfig.getQuestionsForLevel(state.level);
        D.card.classList.remove('flipped');
        D.btnCheck.classList.remove('qset-hidden'); D.btnNext.classList.add('qset-hidden');
        const q = state.queue.shift(); state.currentQ = q;
        areaConfig.renderFront(q, D.cardContent);
        areaConfig.buildInputArea(D.inputArea, q, _checkStudyAnswer);
    }

    function _checkStudyAnswer() {
        const res = areaConfig.validateInput(state.currentQ);
        D.solution.innerHTML = areaConfig.generateSolution(state.currentQ);
        setTimeout(() => D.card.classList.add('flipped'), 80);
        D.btnCheck.classList.add('qset-hidden'); D.btnNext.classList.remove('qset-hidden');
    }

    function _generateWorksheet() {
        D.wsGrid.innerHTML = '';
        _closeSpotlight();
        const qs = areaConfig.getQuestionsForLevel(state.level);
        qs.forEach(q => {
            const card = document.createElement('div'); card.className = 'qset-ws-card';
            const inner = document.createElement('div'); inner.className = 'qset-ws-card-inner';
            const front = document.createElement('div'); front.className = 'qset-ws-face front';
            areaConfig.renderFront(q, front);
            inner.appendChild(front); card.appendChild(inner);
            card.addEventListener('click', () => _openSpotlight(q));
            D.wsGrid.appendChild(card);
        });
    }

    // Spotlight Timer Logic
    function _openSpotlight(q) {
        D.spFront.innerHTML = ''; areaConfig.renderFront(q, D.spFront);
        D.spBack.innerHTML = areaConfig.generateSolution(q);
        D.spCard.classList.remove('flipped');
        D.spotlight.classList.add('visible');
        
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        clearInterval(state.spTimerInterval);
        state.spTimeLeft = 30;
        _updateSpTimerDisp();
        state.spTimerInterval = setInterval(() => {
            state.spTimeLeft--;
            _updateSpTimerDisp();
            if (state.spTimeLeft <= 0) {
                clearInterval(state.spTimerInterval);
                playBeep(); // Audio plays, NO auto-flip
            }
        }, 1000);
    }

    function _updateSpTimerDisp() {
        const t = state.spTimeLeft;
        D.spTimer.textContent = `00:${String(t).padStart(2, '0')}`;
        D.spTimer.classList.toggle('urgent', t <= 5 && t > 0);
    }

    function _closeSpotlight() {
        clearInterval(state.spTimerInterval);
        D.spotlight.classList.remove('visible');
        D.spCard.classList.remove('flipped');
    }

    // Reference Modal Logic
    function _showRefModal(item) { 
        if (!D.modal) return; 
        if (D.modalBadge) D.modalBadge.textContent = item.label; 
        if (D.modalTtl) D.modalTtl.textContent = item.title || item.label; 
        if (D.modalTxt) D.modalTxt.innerHTML = item.text; 
        if (D.modalMath) D.modalMath.innerHTML = item.math || ''; 
        D.modal.classList.add('visible'); 
    }
    function _hideRefModal() { if (D.modal) D.modal.classList.remove('visible'); }

    if (D.refRow && areaConfig.referenceItems) {
        areaConfig.referenceItems.forEach((item, i) => {
            const c = document.createElement('div');
            c.className = `qset-ref-card`;
            c.style.background = ['#fee2e2','#ffedd5','#fef9c3','#dcfce7','#dbeafe','#e0e7ff'][i % 6];
            c.style.color      = ['#991b1b','#9a3412','#854d0e','#166534','#1e40af','#3730a3'][i % 6];
            c.textContent = item.label;
            c.addEventListener('click', () => _showRefModal(item));
            D.refRow.appendChild(c);
        });
    }

    // Event Listeners
    D.tabs.forEach(t => t.addEventListener('click', () => switchMode(t.dataset.mode)));
    D.levelSel.addEventListener('change', e => switchLevel(parseInt(e.target.value)));
    D.btnCheck.addEventListener('click', _checkStudyAnswer);
    D.btnNext.addEventListener('click', _nextStudyQ);
    if ($('qset-ws-gen')) $('qset-ws-gen').addEventListener('click', _generateWorksheet);
    if ($('qset-backdrop')) $('qset-backdrop').addEventListener('click', _closeSpotlight);
    if (D.spCard) D.spCard.addEventListener('click', () => D.spCard.classList.toggle('flipped'));
    
    if (D.modalClose) D.modalClose.addEventListener('click', _hideRefModal);
    if (D.modalOk)    D.modalOk.addEventListener('click', _hideRefModal);
    if (D.modal)      D.modal.addEventListener('click', e => { if (e.target === D.modal) _hideRefModal(); });

    document.addEventListener('keydown', e => { 
        if (e.key === 'Escape') {
            if (D.spotlight && D.spotlight.classList.contains('visible')) _closeSpotlight();
            if (D.modal && D.modal.classList.contains('visible')) _hideRefModal();
        }
    });

    switchLevel(1);
}

export default loadModule;

