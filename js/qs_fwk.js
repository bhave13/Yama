/**
 * qs_fwk.js — Updated Qset Framework
 * Flashcard-style Grid Mode with 50% larger answers and auto-scrolling overflow.
 * Self-Study mode handles all question types: NUMERIC, MCQ, MATCH, SPOT_ERROR, EXPLANATION.
 * Challenge mode features an adjustable timer, skipped-question handling, and a color-coded details scoreboard.
 */
(function (global) {
    'use strict';

    let _cssInjected = false;
    let audioCtx = null;

    function playBeep() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.value = 800;
        gain.gain.setValueAtTime(1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    }

    function setupAudioUnlock(container) {
        const unlock = () => {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            container.removeEventListener('click', unlock);
        };
        container.addEventListener('click', unlock);
    }

    function sanitize(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[&<>'"]/g, match => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        })[match]);
    }

    function safeEval(str) {
        const clean = str.replace(/\s/g, '');
        if (!/^[-+*/().\deE]+$/.test(clean)) return NaN;
        try { return new Function('return ' + clean)(); } catch(e) { return NaN; }
    }

    function mjax(el) {
        if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
            MathJax.typesetPromise([el]).catch(err => console.warn('MathJax:', err));
        }
    }

    function a11yClick(el, handler) {
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.addEventListener('click', handler);
        el.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handler(e);
            }
        });
    }

    function _injectCSS() {
        if (_cssInjected) return;
        _cssInjected = true;
        const s = document.createElement('style');
        s.id = 'qset-fw-styles';
        s.textContent = `
        .qset-mod { font-family: 'DM Sans', sans-serif; color: #1e293b; width: 100%; }
        .qset-tabs { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 2px solid #e2e8f0; flex-wrap: wrap; }
        .qset-tab { padding: 0.6rem 1.4rem; font-size: 0.88rem; font-weight: 700; border: 1px solid #e2e8f0; border-bottom: none; border-radius: 6px 6px 0 0; background: #f8fafc; cursor: pointer; transition: 0.15s; margin-bottom: -2px; }
        .qset-tab.active { background: white; color: #2563eb; border-bottom-color: white; }
        .qset-select { appearance: none; background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%232563eb' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 0.7rem center; border: 1.5px solid #2563eb; border-radius: 6px; padding: 0.4rem 2.2rem 0.4rem 0.75rem; font-weight: 700; cursor: pointer; min-width: 200px; }
        .qset-counter { margin-left: auto; font-size: 0.82rem; font-weight: 700; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 20px; padding: 0.25rem 0.9rem; }
        .qset-panel { display: none; }
        .qset-panel.active { display: block; animation: qset-fadein 0.25s ease; }
        @keyframes qset-fadein { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

        .qset-study-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; align-items: start; }
        @media (max-width: 768px) { .qset-study-layout { grid-template-columns: 1fr; } }

        .qset-card-wrap { perspective: 1200px; min-height: 300px; width: 100%; }
        .qset-card { position: relative; width: 100%; min-height: 300px; transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1); cursor: pointer; }
        .qset-card.flipped { transform: rotateY(180deg); }
        .qset-card-front, .qset-card-back { position: absolute; width: 100%; min-height: 300px; backface-visibility: hidden; border-radius: 10px; padding: 1.5rem; display: flex; flex-direction: column; text-align: center; box-sizing: border-box; overflow-y: auto; }

        .qset-card-back, .qset-ws-face.back { scrollbar-width: thin; scrollbar-color: #6ee7b7 #f0fdf4; }
        .qset-card-back::-webkit-scrollbar, .qset-ws-face.back::-webkit-scrollbar { width: 6px; }
        .qset-card-back::-webkit-scrollbar-thumb, .qset-ws-face.back::-webkit-scrollbar-thumb { background-color: #6ee7b7; border-radius: 10px; }

        .qset-card-front { background: #f0f9ff; border: 2px solid #bae6fd; align-items: center; justify-content: center; }
        .qset-card-back { background: #f0fdf4; border: 2px solid #6ee7b7; transform: rotateY(180deg); justify-content: flex-start; }

        .qset-q-text { font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem; width: 100%; line-height: 1.4; }
        .qset-q-img { max-width: 100%; max-height: 180px; object-fit: contain; }

        .qset-ws-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
        .qset-ws-card { perspective: 1000px; cursor: pointer; height: 180px; }
        .qset-ws-card-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.5s cubic-bezier(0.4, 0.2, 0.2, 1); }
        .qset-ws-card.flipped .qset-ws-card-inner { transform: rotateY(180deg); }

        .qset-ws-face { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 10px; border: 2px solid #e2e8f0; padding: 0.8rem; display: flex; flex-direction: column; align-items: center; justify-content: center; box-sizing: border-box; background: white; transition: border-color 0.2s; }
        .qset-ws-face.front:hover { border-color: #2563eb; }

        .qset-ws-face.back { background: #f0fdf4; border-color: #6ee7b7; transform: rotateY(180deg); font-weight: 800; color: #065f46; font-size: 2.1rem; text-align: center; word-break: break-word; line-height: 1.1; overflow-y: auto; }
        .qset-ws-face .qset-q-text { font-size: 0.85rem !important; margin-bottom: 0.4rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .qset-ws-face img { max-height: 80px; max-width: 100%; object-fit: contain; margin-top: 4px; }

        .qset-spotlight { display: none; position: fixed; inset: 0; z-index: 1500; align-items: flex-start; justify-content: center; padding-top: 5vh; }
        .qset-spotlight.visible { display: flex; animation: qset-fadein 0.2s ease; }
        .qset-backdrop { position: absolute; inset: 0; background: rgba(13,27,42,0.75); backdrop-filter: blur(4px); cursor: pointer; }
        .qset-spotlight-wrap { position: relative; z-index: 1; width: min(600px, 90vw); display: flex; flex-direction: column; align-items: center; gap: 1rem; }

        .qset-ss-timer, .qset-ch-timer, .qset-sp-timer-box { font-family: monospace; font-weight: 900; background: #1e293b; color: #4ade80; padding: 0.25rem 0.75rem; border-radius: 5px; }
        .urgent { color: #f87171 !important; }
        .qset-hidden { display: none !important; }

        .qset-mcq-opts { display: flex; flex-direction: column; gap: 6px; width: 100%; }
        .qset-mcq-opt { width: 100%; text-align: left; padding: 9px 12px; border: 2px solid #cbd5e1; border-radius: 6px; background: white; cursor: pointer; font-size: 0.92rem; transition: border-color 0.15s, background 0.15s; }
        .qset-mcq-opt:hover { border-color: #2563eb; background: #eff6ff; }
        .qset-mcq-opt.selected { border-color: #2563eb; background: #dbeafe; font-weight: 700; }
        .qset-mcq-opt.correct  { border-color: #16a34a; background: #dcfce7; font-weight: 700; }
        .qset-mcq-opt.wrong    { border-color: #dc2626; background: #fee2e2; }

        .qset-step-row { padding: 8px 12px; border: 2px solid #cbd5e1; border-radius: 6px; margin-bottom: 6px; cursor: pointer; font-size: 0.92rem; transition: border-color 0.15s, background 0.15s; }
        .qset-step-row:hover { border-color: #f59e0b; background: #fef9c3; }
        .qset-step-row.selected { border-color: #f59e0b; background: #fef3c7; font-weight: 700; }
        .qset-step-row.correct  { border-color: #16a34a; background: #dcfce7; font-weight: 700; }
        .qset-step-row.wrong    { border-color: #dc2626; background: #fee2e2; }

        .qset-val-token { display: inline-block; padding: 3px 10px; margin: 2px; border: 2px solid #cbd5e1; border-radius: 20px; cursor: pointer; font-size: 0.95rem; transition: border-color 0.15s, background 0.15s; }
        .qset-val-token:hover { border-color: #f59e0b; background: #fef9c3; }
        .qset-val-token.selected { border-color: #f59e0b; background: #fef3c7; font-weight: 700; }
        .qset-val-token.correct  { border-color: #16a34a; background: #dcfce7; font-weight: 700; }
        .qset-val-token.wrong    { border-color: #dc2626; background: #fee2e2; }

        .qset-expl-area { width: 100%; padding: 10px; font-size: 0.92rem; line-height: 1.5; border: 2px solid #cbd5e1; border-radius: 6px; resize: vertical; min-height: 120px; font-family: inherit; }
        .qset-expl-hint { font-size: 0.75rem; color: #64748b; margin-top: 4px; }
        .qset-checklist { list-style: none; padding: 0; margin: 8px 0 0; }
        .qset-checklist li { display: flex; align-items: flex-start; gap: 8px; font-size: 0.85rem; margin-bottom: 6px; }
        .qset-checklist li::before { content: '\\2610'; font-size: 1rem; flex-shrink: 0; }
        .qset-match-pair { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; margin-bottom: 6px; }
        .qset-match-pair .left { font-weight: 700; min-width: 120px; }
        .qset-match-pair .arrow { color: #6b7280; }
        .qset-match-pair .right { color: #065f46; }

        /* Challenge Result Table Styles */
        .qset-ch-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
        .qset-ch-table th, .qset-ch-table td { padding: 10px 12px; border: 1px solid #cbd5e1; vertical-align: middle; }
        .qset-ch-table th { background: #f8fafc; font-weight: bold; color: #1e293b; position: sticky; top: 0; box-shadow: 0 1px 0 #cbd5e1; }
        .row-correct { background: #dcfce7; }
        .row-wrong { background: #fee2e2; }
        `;
        document.head.appendChild(s);
    }

    function renderNativeFront(q, el, mode) {
        if (mode === undefined) mode = 'study';
        var html = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;width:100%;gap:4px;">';
        if (mode === 'study') html += '<div class="qset-diff-badge" style="font-size:0.7rem; background:#f1f5f9; border-radius:20px; padding:2px 8px; margin-bottom:8px;">Level ' + q.level + ' · Stage ' + q.diff + '</div>';

        var fontSize = mode === 'worksheet' ? '0.85rem' : '1.15rem';
        html += '<div class="qset-q-text" style="font-size:' + fontSize + '">' + q.q + '</div>';

        if (q.img && q.img.trim() !== '') {
            html += '<img src="' + sanitize(q.img) + '" class="qset-q-img" alt="' + sanitize(q.imgAlt) + '">';
        }

        if (mode === 'worksheet') {
            if (q.type === 'MCQ') html += '<div style="font-size:0.65rem; color:#64748b; font-weight:bold;">MCQ Task</div>';
            else if (q.type === 'MATCH') html += '<div style="font-size:0.65rem; color:#64748b; font-weight:bold;">Matching Task</div>';
        }

        html += '</div>';
        el.innerHTML = html;
    }

    function renderSolutionBack(q, result) {
        var html = '<div style="width:100%; text-align:left;">';

        if (result && !result.isSelfMark) {
            html += '<div class="qset-result-badge" style="background:' + (result.isCorrect ? '#d1fae5' : '#fee2e2') + '; padding:4px 12px; border-radius:20px; font-size:0.75rem; margin-bottom:8px;">' + (result.isCorrect ? '✓ Correct' : '✗ Incorrect') + '</div>';
        }

        if (q.type === 'NUMERIC') {
            html += '<div style="font-size:0.7rem; text-transform:uppercase; color:#059669; font-weight:bold; margin-bottom:4px;">Answer</div>';
            html += '<div style="font-size:2.25rem; font-weight:900; color:#065f46; margin-bottom:12px; word-break:break-word; line-height:1.1;">' + q.a + '</div>';
            if (q.working) html += '<div style="font-size:0.85rem; color:#374151; line-height:1.6;">' + q.working + '</div>';

        } else if (q.type === 'MCQ') {
            html += '<div style="font-size:0.7rem; text-transform:uppercase; color:#059669; font-weight:bold; margin-bottom:4px;">Correct Answer</div>';
            html += '<div style="font-size:1.5rem; font-weight:900; color:#065f46; margin-bottom:12px;">' + q.options[q.correctOption] + '</div>';
            if (q.working) html += '<div style="font-size:0.85rem; color:#374151; line-height:1.6;">' + q.working + '</div>';

        } else if (q.type === 'MATCH') {
            html += '<div style="font-size:0.7rem; text-transform:uppercase; color:#059669; font-weight:bold; margin-bottom:8px;">Correct Pairs</div>';
            q.pairs.forEach(function(p) {
                html += '<div class="qset-match-pair"><span class="left">' + p.left + '</span><span class="arrow">→</span><span class="right">' + p.right + '</span></div>';
            });

        } else if (q.type === 'SPOT_ERROR' && q.subtype === 'STEP') {
            html += '<div style="font-size:0.7rem; text-transform:uppercase; color:#059669; font-weight:bold; margin-bottom:8px;">Error Location</div>';
            var errStep = q.steps.find(function(s) { return s.isError; });
            if (errStep) html += '<div style="font-size:1rem; font-weight:700; color:#065f46; margin-bottom:8px;">Step ' + errStep.id + ': ' + errStep.text + '</div>';
            html += '<div style="font-size:0.85rem; color:#374151; line-height:1.6;">' + q.errorExplanation + '</div>';

        } else if (q.type === 'SPOT_ERROR' && q.subtype === 'VALUE') {
            html += '<div style="font-size:0.7rem; text-transform:uppercase; color:#059669; font-weight:bold; margin-bottom:8px;">Error Location</div>';
            var rendered = q.expression.replace(/\[([^\|]+)\|(\d+)\]/g, function(_, val, id) {
                var isErr = parseInt(id) === q.correctErrorId;
                var style = isErr
                    ? 'display:inline-block; background:#fee2e2; border:2px solid #dc2626; border-radius:4px; padding:1px 6px; font-weight:900; color:#991b1b;'
                    : 'display:inline-block;';
                return '\\) <span style="' + style + '">' + val + '</span> \\(';
            });
            rendered = rendered.replace(/\\\(\s*\\\)/g, '');
            html += '<div style="font-size:0.95rem; line-height:2.2; margin-bottom:8px;">' + rendered + '</div>';
            html += '<div style="font-size:0.85rem; color:#374151; line-height:1.6;">' + q.errorExplanation + '</div>';

        } else if (q.type === 'EXPLANATION') {
            html += '<div style="font-size:0.7rem; text-transform:uppercase; color:#059669; font-weight:bold; margin-bottom:6px;">Model Answer</div>';
            html += '<div style="font-size:0.9rem; color:#1e293b; line-height:1.65; margin-bottom:12px;">' + q.modelAnswer + '</div>';
            if (q.markingChecklist && q.markingChecklist.length) {
                html += '<div style="font-size:0.7rem; text-transform:uppercase; color:#6b7280; font-weight:bold; margin-bottom:4px;">Self-Mark Checklist</div>';
                html += '<ul class="qset-checklist">';
                q.markingChecklist.forEach(function(item) { html += '<li>' + item + '</li>'; });
                html += '</ul>';
            }
        }

        html += '</div>';
        return html;
    }

    function renderStudyInput(q, inpEl) {
        if (q.type === 'NUMERIC') {
            inpEl.innerHTML = '<input type="text" id="study-inp" style="width:100%; padding:12px; font-size:1.1rem; text-align:center; border:2px solid #cbd5e1; border-radius:6px;" placeholder="Answer...">';
            mjax(inpEl);
            return {
                getResult: function() {
                    var inp = document.getElementById('study-inp');
                    var raw = inp ? inp.value.trim() : '';
                    var isCorrect;
                    if (q.tolerance && q.tolerance > 0) {
                        var num = parseFloat(raw);
                        isCorrect = !isNaN(num) && Math.abs(num - parseFloat(q.a)) <= q.tolerance;
                    } else {
                        isCorrect = raw.toLowerCase() === String(q.a).toLowerCase();
                    }
                    return { isCorrect: isCorrect, isSelfMark: false };
                }
            };
        }

        if (q.type === 'MCQ') {
            var mcqHtml = '<div class="qset-mcq-opts">';
            q.options.forEach(function(opt, i) {
                mcqHtml += '<button class="qset-mcq-opt" data-idx="' + i + '">' + opt + '</button>';
            });
            mcqHtml += '</div>';
            inpEl.innerHTML = mcqHtml;
            mjax(inpEl);

            var selectedIdx = null;
            inpEl.addEventListener('click', function(e) {
                var btn = e.target.closest('.qset-mcq-opt');
                if (!btn) return;
                inpEl.querySelectorAll('.qset-mcq-opt').forEach(function(b) { b.classList.remove('selected'); });
                btn.classList.add('selected');
                selectedIdx = parseInt(btn.dataset.idx);
            });

            return {
                getResult: function() {
                    if (selectedIdx === null) return null;
                    var isCorrect = selectedIdx === q.correctOption;
                    inpEl.querySelectorAll('.qset-mcq-opt').forEach(function(btn) {
                        var idx = parseInt(btn.dataset.idx);
                        if (idx === q.correctOption) btn.classList.add('correct');
                        else if (idx === selectedIdx && !isCorrect) btn.classList.add('wrong');
                    });
                    return { isCorrect: isCorrect, isSelfMark: false };
                }
            };
        }

        if (q.type === 'MATCH') {
            var rights = q.pairs.map(function(p) { return p.right; });
            var shuffled = rights.slice().sort(function() { return Math.random() - 0.5; });
            var selections = q.pairs.map(function() { return null; });
            var activePairIdx = null;

            var matchHtml = '<div style="font-size:0.75rem; color:#64748b; margin-bottom:6px;">Click a term on the left, then click its match on the right.</div>';
            matchHtml += '<div style="display:flex; gap:8px; align-items:flex-start;">';
            matchHtml += '<div style="flex:1; display:flex; flex-direction:column; gap:5px;">';
            q.pairs.forEach(function(p, i) {
                matchHtml += '<div class="qset-match-left-row" data-idx="' + i + '" style="padding:6px 10px; border:2px solid #cbd5e1; border-radius:6px; cursor:pointer; font-size:0.88rem; min-height:36px; display:flex; align-items:center; justify-content:space-between; gap:4px;"><span>' + p.left + '</span><span class="match-chosen" data-idx="' + i + '" style="font-size:0.78rem; color:#2563eb;"></span></div>';
            });
            matchHtml += '</div><div style="flex:1; display:flex; flex-direction:column; gap:5px;">';
            shuffled.forEach(function(r) {
                matchHtml += '<div class="qset-match-right-chip" data-val="' + sanitize(r) + '" style="padding:6px 10px; border:2px solid #cbd5e1; border-radius:6px; cursor:pointer; font-size:0.88rem; min-height:36px; display:flex; align-items:center;">' + r + '</div>';
            });
            matchHtml += '</div></div>';
            inpEl.innerHTML = matchHtml;
            mjax(inpEl);

            inpEl.addEventListener('click', function(e) {
                var leftRow = e.target.closest('.qset-match-left-row');
                if (leftRow) {
                    activePairIdx = parseInt(leftRow.dataset.idx);
                    inpEl.querySelectorAll('.qset-match-left-row').forEach(function(r) {
                        r.style.borderColor = parseInt(r.dataset.idx) === activePairIdx ? '#2563eb' : '#cbd5e1';
                    });
                    return;
                }
                var chip = e.target.closest('.qset-match-right-chip');
                if (chip && activePairIdx !== null) {
                    selections[activePairIdx] = chip.dataset.val;
                    var chosenLabel = inpEl.querySelector('.match-chosen[data-idx="' + activePairIdx + '"]');
                    if (chosenLabel) chosenLabel.textContent = '✓';
                    inpEl.querySelectorAll('.qset-match-right-chip').forEach(function(c) { c.style.background = ''; });
                    chip.style.background = '#dbeafe';
                    activePairIdx = null;
                    inpEl.querySelectorAll('.qset-match-left-row').forEach(function(r) { r.style.borderColor = '#cbd5e1'; });
                }
            });

            return {
                getResult: function() {
                    var allAnswered = selections.every(function(s) { return s !== null; });
                    if (!allAnswered) return null;
                    var allCorrect = true;
                    selections.forEach(function(sel, i) {
                        var correct = sel === q.pairs[i].right;
                        if (!correct) allCorrect = false;
                        var row = inpEl.querySelector('.qset-match-left-row[data-idx="' + i + '"]');
                        if (row) row.style.borderColor = correct ? '#16a34a' : '#dc2626';
                    });
                    return { isCorrect: allCorrect, isSelfMark: false };
                }
            };
        }

        if (q.type === 'SPOT_ERROR' && q.subtype === 'STEP') {
            var stepHtml = '<div>';
            q.steps.forEach(function(step) {
                stepHtml += '<div class="qset-step-row" data-id="' + step.id + '">' + step.text + '</div>';
            });
            stepHtml += '</div>';
            inpEl.innerHTML = stepHtml;
            mjax(inpEl);

            var selectedStepId = null;
            inpEl.addEventListener('click', function(e) {
                var row = e.target.closest('.qset-step-row');
                if (!row) return;
                inpEl.querySelectorAll('.qset-step-row').forEach(function(r) { r.classList.remove('selected'); });
                row.classList.add('selected');
                selectedStepId = parseInt(row.dataset.id);
            });

            return {
                getResult: function() {
                    if (selectedStepId === null) return null;
                    var correctId = q.steps.find(function(s) { return s.isError; }).id;
                    var isCorrect = selectedStepId === correctId;
                    inpEl.querySelectorAll('.qset-step-row').forEach(function(row) {
                        var id = parseInt(row.dataset.id);
                        if (id === correctId) row.classList.add('correct');
                        else if (id === selectedStepId && !isCorrect) row.classList.add('wrong');
                    });
                    return { isCorrect: isCorrect, isSelfMark: false };
                }
            };
        }

        if (q.type === 'SPOT_ERROR' && q.subtype === 'VALUE') {
            var valHtml = '<div style="font-size:0.95rem; line-height:2.2; margin-bottom:4px;">';
            valHtml += q.expression.replace(/\[([^\|]+)\|(\d+)\]/g, function(_, val, id) {
                return '\\) <span class="qset-val-token" data-id="' + id + '" style="display:inline-block;">' + val + '</span> \\(';
            });
            valHtml = valHtml.replace(/\\\(\s*\\\)/g, '');
            valHtml += '</div><div style="font-size:0.75rem; color:#64748b; margin-top:4px;">Click the value you think is wrong.</div>';
            inpEl.innerHTML = valHtml;
            mjax(inpEl);

            var selectedValId = null;
            inpEl.addEventListener('click', function(e) {
                var tok = e.target.closest('.qset-val-token');
                if (!tok) return;
                inpEl.querySelectorAll('.qset-val-token').forEach(function(t) { t.classList.remove('selected'); });
                tok.classList.add('selected');
                selectedValId = parseInt(tok.dataset.id);
            });

            return {
                getResult: function() {
                    if (selectedValId === null) return null;
                    var isCorrect = selectedValId === q.correctErrorId;
                    inpEl.querySelectorAll('.qset-val-token').forEach(function(tok) {
                        var id = parseInt(tok.dataset.id);
                        if (id === q.correctErrorId) tok.classList.add('correct');
                        else if (id === selectedValId && !isCorrect) tok.classList.add('wrong');
                    });
                    return { isCorrect: isCorrect, isSelfMark: false };
                }
            };
        }

        if (q.type === 'EXPLANATION') {
            inpEl.innerHTML = '<textarea class="qset-expl-area" id="study-expl" placeholder="Write your explanation here..."></textarea><div class="qset-expl-hint">This is self-marked — write your best answer, then flip to compare with the model answer.</div>';
            return {
                getResult: function() {
                    return { isCorrect: false, isSelfMark: true };
                }
            };
        }

        inpEl.innerHTML = '<div style="color:#94a3b8; font-size:0.9rem;">No input available for this question type.</div>';
        return {
            getResult: function() { return { isCorrect: false, isSelfMark: true }; }
        };
    }

    function init(cfg, containerEl) {
        _injectCSS();
        setupAudioUnlock(containerEl);

        var opts = cfg.levelNames.map(function(n, i) { return '<option value="' + (i + 1) + '">' + n + '</option>'; }).join('');
        containerEl.innerHTML = '<div class="qset-mod">' +
          '<div class="qset-tabs">' +
          '<button class="qset-tab active" data-mode="study">Self Study</button>' +
          '<button class="qset-tab" data-mode="challenge">Challenge</button>' +
          '<button class="qset-tab" data-mode="worksheet">Grid Mode</button>' +
          '<div class="qset-tab-div"></div>' +
          '<select id="qset-level" class="qset-select">' + opts + '</select>' +
          '<span class="qset-counter"><span id="qset-correct" class="qc-ok">0</span> / <span id="qset-total">0</span></span>' +
          '</div>' +
          '<div class="qset-panel active" id="qset-panel-study">' +
          '<div class="qset-study-layout">' +
          '<div class="qset-card-wrap"><div class="qset-card" id="qset-card"><div class="qset-card-front" id="qset-front"></div><div class="qset-card-back" id="qset-back"></div></div></div>' +
          '<div style="background:#fafafa; border:2px solid #e2e8f0; border-radius:10px; padding:1.25rem; display:flex; flex-direction:column; gap:10px; justify-content:center; min-height:300px;">' +
          '<div id="qset-input-area"></div>' +
          '<div style="display:flex; gap:8px;">' +
          '<button class="qset-btn" style="background:#2563eb; color:#fff; padding:10px; border-radius:6px; flex:1; font-weight:bold; cursor:pointer; border:none;" id="qset-check">Check Answer</button>' +
          '<button class="qset-btn qset-hidden" style="background:#1e293b; color:#fff; padding:10px; border-radius:6px; flex:1; font-weight:bold; cursor:pointer; border:none;" id="qset-next">Next ➔</button>' +
          '</div></div></div></div>' +
          '<div class="qset-panel" id="qset-panel-challenge">' +
              '<div style="display:flex; justify-content:space-between; margin-bottom:1rem; border-bottom:2px solid #e2e8f0; padding-bottom:8px;"><div class="qset-ch-timer" id="qset-ch-timer">10:00</div><div style="font-weight:bold;">Score: <span id="qset-ch-score">0</span></div></div>' +
              '<div id="qset-ch-start" style="text-align:center; padding:2rem;">' +
                  '<div style="color:#dc2626; font-weight:800; font-size:1.1rem; margin-bottom:1rem;">Be prepared. Get a calculator, pen and paper before we start.</div>' +
                  '<div style="margin-bottom:1.5rem; font-weight:600; color:#1e293b;">Time: <input type="number" id="ch-time-input" value="10" min="1" max="60" style="width:60px; padding:6px; border:2px solid #cbd5e1; border-radius:6px; text-align:center; font-weight:bold;"> minutes</div>' +
                  '<button style="background:#2563eb; color:#fff; padding:12px 30px; border-radius:6px; font-weight:bold; cursor:pointer; border:none;" id="qset-ch-start-btn">START CHALLENGE</button>' +
              '</div>' +
              '<div id="qset-ch-play" class="qset-hidden">' +
                  '<div id="qset-ch-qbox" style="background:#fff; border:2px solid #e2e8f0; padding:20px; border-radius:8px; text-align:center; margin-bottom:15px; min-height:100px;"></div>' +
                  '<div id="qset-ch-ctrl" style="display:flex; justify-content:center; align-items:center; gap:10px;"></div>' +
                  '<div id="qset-ch-fb" style="text-align:center; font-weight:bold; margin-top:10px; height:24px;"></div>' +
              '</div>' +
              '<div id="qset-ch-end" class="qset-hidden" style="text-align:center; padding:2rem;">' +
                  '<h3 style="font-size:1.8rem; color:#1e293b; margin-bottom:10px;">Time\'s Up!</h3>' +
                  '<div style="font-size:1.3rem; margin-bottom:20px; font-weight:bold;">Final Score: <span id="qset-ch-final-score" style="color:#16a34a;">0</span> / <span id="qset-ch-final-total">0</span></div>' +
                  '<div style="display:flex; justify-content:center; gap:10px;">' +
                      '<button id="qset-ch-show-btn" style="background:#10b981; color:#fff; padding:10px 20px; border-radius:6px; font-weight:bold; cursor:pointer; border:none;">Show Details</button>' +
                      '<button id="qset-ch-restart-btn" style="background:#64748b; color:#fff; padding:10px 20px; border-radius:6px; font-weight:bold; cursor:pointer; border:none;">Restart</button>' +
                  '</div>' +
              '</div>' +
          '</div>' +
          '<div class="qset-panel" id="qset-panel-worksheet">' +
          '<div style="display:flex; justify-content:space-between; margin-bottom:15px;"><h2 id="qset-ws-title" style="font-size:1.1rem; font-weight:800;"></h2><button id="qset-ws-gen" style="background:#2563eb; color:#fff; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:bold;">Generate New</button></div>' +
          '<div class="qset-ws-grid" id="qset-ws-grid"></div>' +
          '<div class="qset-spotlight" id="qset-spotlight">' +
          '<div class="qset-backdrop" id="qset-backdrop"></div>' +
          '<div class="qset-spotlight-wrap"><div class="qset-sp-timer-box" id="qset-sp-timer">00:30</div><div class="qset-card-wrap"><div class="qset-card" id="qset-sp-card"><div class="qset-card-front" id="qset-sp-front"></div><div class="qset-card-back" id="qset-sp-back"></div></div></div><p style="color:rgba(255,255,255,0.7); font-size:0.8rem;">Click card to reveal answer · Esc to close</p></div>' +
          '</div></div>' +
          
          /* Challenge Results Modal Overlay */
          '<div class="qset-spotlight" id="qset-ch-modal">' +
              '<div class="qset-backdrop" id="qset-ch-bd"></div>' +
              '<div class="qset-spotlight-wrap" style="background:white; padding:20px; border-radius:8px; width:min(800px, 95vw); max-height:85vh; overflow-y:auto; color:#1e293b; display:block;">' +
                  '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">' +
                      '<h2 style="margin:0; font-size:1.4rem;">Challenge Results</h2>' +
                      '<button id="qset-ch-close" style="background:none; border:none; font-size:1.5rem; cursor:pointer; line-height:1; color:#64748b;">&times;</button>' +
                  '</div>' +
                  '<table class="qset-ch-table">' +
                      '<thead><tr><th style="width:40px; text-align:center;">#</th><th>Question</th><th style="text-align:center;">Your Answer</th><th style="text-align:center;">Correct Answer</th></tr></thead>' +
                      '<tbody id="qset-ch-results-body"></tbody>' +
                  '</table>' +
              '</div>' +
          '</div>' +
          '</div>';

        var state = {
            mode: 'study',
            level: 1,
            study: { q: null, count: 0, total: 0, inputHandler: null },
            ch: { score: 0, total: 0, time: 600, int: null, history: [], currentQ: null },
            spTimer: { int: null, left: 30 }
        };
        var $ = function(id) { return document.getElementById(id); };
        var D = {
            tabs: containerEl.querySelectorAll('.qset-tab'),
            panels: containerEl.querySelectorAll('.qset-panel'),
            lvl: $('qset-level'), ok: $('qset-correct'), tot: $('qset-total'),
            card: $('qset-card'), front: $('qset-front'), back: $('qset-back'),
            inp: $('qset-input-area'), check: $('qset-check'), next: $('qset-next'),
            
            // Challenge elements
            chS: $('qset-ch-start'), chP: $('qset-ch-play'), chE: $('qset-ch-end'),
            chQ: $('qset-ch-qbox'), chC: $('qset-ch-ctrl'), chF: $('qset-ch-fb'), 
            chSc: $('qset-ch-score'), chT: $('qset-ch-timer'), chBtn: $('qset-ch-start-btn'),
            chTimeInp: $('ch-time-input'), chFScore: $('qset-ch-final-score'), chFTotal: $('qset-ch-final-total'),
            chShowBtn: $('qset-ch-show-btn'), chRestartBtn: $('qset-ch-restart-btn'),
            chModal: $('qset-ch-modal'), chBd: $('qset-ch-bd'), chClose: $('qset-ch-close'), chTbody: $('qset-ch-results-body'),
            
            // Worksheet elements
            wsG: $('qset-ws-grid'), wsT: $('qset-ws-title'), wsGen: $('qset-ws-gen'),
            sp: $('qset-spotlight'), spC: $('qset-sp-card'), spF: $('qset-sp-front'),
            spB: $('qset-sp-back'), spT: $('qset-sp-timer'), bd: $('qset-backdrop')
        };

        function updCount() { D.ok.textContent = state.study.count; D.tot.textContent = state.study.total; }
        function fmt(t) { return String(Math.floor(t/60)).padStart(2,'0') + ':' + String(t%60).padStart(2,'0'); }

        function setMode(m) {
            state.mode = m; clearInterval(state.ch.int);
            D.tabs.forEach(function(t) { t.classList.toggle('active', t.dataset.mode === m); });
            D.panels.forEach(function(p) { p.classList.toggle('active', p.id === 'qset-panel-' + m); });
            if (m === 'study') nextStudy();
            if (m === 'challenge') resetCh();
            if (m === 'worksheet') genWs();
        }

        function nextStudy() {
            D.card.classList.remove('flipped');
            D.check.classList.remove('qset-hidden');
            D.next.classList.add('qset-hidden');
            var q = cfg.getQuestion(state.level, null);
            state.study.q = q;
            state.study.total++;
            updCount();
            renderNativeFront(q, D.front, 'study');
            mjax(D.front);
            state.study.inputHandler = renderStudyInput(q, D.inp);
        }

        D.check.onclick = function() {
            if (!state.study.inputHandler) return;
            var result = state.study.inputHandler.getResult();
            if (result === null) return;
            if (result.isCorrect && !result.isSelfMark) state.study.count++;
            D.back.innerHTML = renderSolutionBack(state.study.q, result);
            D.card.classList.add('flipped');
            D.check.classList.add('qset-hidden');
            D.next.classList.remove('qset-hidden');
            updCount();
            mjax(D.back);
        };

        D.next.onclick = nextStudy;

        /* ── CHALLENGE MODE LOGIC ── */
        function resetCh() {
            state.ch.score = 0; state.ch.total = 0; state.ch.history = []; state.ch.currentQ = null;
            var tVal = parseInt(D.chTimeInp.value);
            if (!tVal || tVal <= 0) tVal = 10;
            state.ch.time = tVal * 60;
            D.chSc.textContent = '0'; D.chT.textContent = fmt(state.ch.time);
            D.chS.classList.remove('qset-hidden'); 
            D.chP.classList.add('qset-hidden');
            D.chE.classList.add('qset-hidden');
            D.chF.textContent = '';
        }

        function endChallenge() {
            D.chP.classList.add('qset-hidden');
            D.chE.classList.remove('qset-hidden');
            D.chFScore.textContent = state.ch.score;
            D.chFTotal.textContent = state.ch.total;
        }

        D.chBtn.onclick = function() {
            var tVal = parseInt(D.chTimeInp.value);
            if (!tVal || tVal <= 0) tVal = 10;
            state.ch.time = tVal * 60;
            D.chT.textContent = fmt(state.ch.time);

            D.chS.classList.add('qset-hidden'); 
            D.chE.classList.add('qset-hidden');
            D.chP.classList.remove('qset-hidden');
            
            state.ch.int = setInterval(function() {
                state.ch.time--; D.chT.textContent = fmt(state.ch.time);
                if (state.ch.time <= 0) { 
                    clearInterval(state.ch.int); 
                    D.chQ.innerHTML = "<div style='font-size:1.5rem; color:#dc2626; font-weight:bold; margin:20px 0;'>Time's Up!</div>"; 
                    if($('ch-inp')) $('ch-inp').disabled = true;
                    if($('ch-next-btn')) $('ch-next-btn').disabled = true;
                    playBeep(); 
                    setTimeout(endChallenge, 1500);
                }
            }, 1000);
            nextCh();
        };

        function nextCh() {
            D.chF.textContent = '';
            var q = cfg.getQuestion(state.level, null);
            state.ch.currentQ = q;
            renderNativeFront(q, D.chQ, 'challenge');
            
            D.chC.innerHTML = 
                '<span style="font-weight:bold; color:#475569; font-size:1.05rem;">Answer:</span> ' +
                '<input type="text" id="ch-inp" style="width:120px; padding:8px; font-size:1.05rem; border:2px solid #cbd5e1; border-radius:6px; text-align:center; font-weight:bold;"> ' +
                '<button id="ch-next-btn" style="background:#3b82f6; color:#fff; padding:8px 16px; font-size:0.95rem; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Next question</button>';
            
            var inp = $('ch-inp');
            var nextBtn = $('ch-next-btn');
            inp.focus();
            inp.onkeypress = function(e) { if(e.key === 'Enter') checkCh(); };
            nextBtn.onclick = function() { checkCh(); };
            mjax(D.chQ);
        }

        function checkCh() {
            var q = state.ch.currentQ;
            if (!q) return;

            var raw = $('ch-inp').value;
            var ans = q.type === 'MCQ' ? q.options[q.correctOption] : (q.a || '');
            var isCorrect = false;

            if (q.type === 'NUMERIC' && q.tolerance && q.tolerance > 0 && raw.trim() !== '') {
                var num = safeEval(raw);
                if(isNaN(num)) num = parseFloat(raw);
                isCorrect = !isNaN(num) && Math.abs(num - parseFloat(q.a)) <= q.tolerance;
            } else {
                isCorrect = raw.toLowerCase().trim() === String(ans).toLowerCase().trim() && raw.trim() !== '';
            }

            state.ch.total++;
            if (isCorrect) {
                state.ch.score++; 
                D.chF.style.color = '#16a34a'; D.chF.textContent = '✓ Correct';
            } else {
                D.chF.style.color = '#dc2626'; D.chF.textContent = '✗ Answer: ' + ans;
            }
            D.chSc.textContent = state.ch.score;

            // Track for results table
            state.ch.history.push({
                qHTML: q.q,
                userAns: raw.trim() === '' ? '(No answer)' : raw.trim(),
                correctAns: ans,
                isCorrect: isCorrect
            });

            $('ch-inp').disabled = true;
            $('ch-next-btn').disabled = true;

            setTimeout(function() {
                if (state.ch.time > 0 && !D.chP.classList.contains('qset-hidden')) {
                    nextCh();
                }
            }, isCorrect ? 400 : 800);
        }

        D.chRestartBtn.onclick = resetCh;
        D.chShowBtn.onclick = function() {
            var tbody = '';
            state.ch.history.forEach(function(item, i) {
                var rowClass = item.isCorrect ? 'row-correct' : 'row-wrong';
                tbody += '<tr class="' + rowClass + '">' +
                    '<td style="text-align:center;">' + (i+1) + '</td>' +
                    '<td><div style="pointer-events:none; font-size:0.85rem; max-height:120px; overflow:hidden;">' + item.qHTML + '</div></td>' +
                    '<td style="font-weight:bold; text-align:center;">' + sanitize(item.userAns) + '</td>' +
                    '<td style="font-weight:bold; color:#065f46; text-align:center;">' + sanitize(item.correctAns) + '</td>' +
                    '</tr>';
            });
            D.chTbody.innerHTML = tbody;
            D.chModal.classList.add('visible');
            mjax(D.chTbody);
        };
        D.chClose.onclick = function() { D.chModal.classList.remove('visible'); };
        D.chBd.onclick = function() { D.chModal.classList.remove('visible'); };

        /* ── WORKSHEET MODE LOGIC ── */
        function genWs() {
            D.wsG.innerHTML = ''; D.wsT.textContent = cfg.levelNames[state.level - 1];
            for (var i = 0; i < 12; i++) {
                var q = cfg.getQuestion(state.level, null);
                var card = document.createElement('div'); card.className = 'qset-ws-card';
                var inner = document.createElement('div'); inner.className = 'qset-ws-card-inner';
                var f = document.createElement('div'); f.className = 'qset-ws-face front';
                var b = document.createElement('div'); b.className = 'qset-ws-face back';
                renderNativeFront(q, f, 'worksheet');
                var backLabel = q.type === 'MCQ' ? q.options[q.correctOption]
                    : q.type === 'MATCH' ? '(Match task)'
                    : q.type === 'SPOT_ERROR' ? '(Spot the error)'
                    : q.type === 'EXPLANATION' ? '(Explanation)'
                    : (q.a || '');
                b.innerHTML = '<div style="max-width:100%; word-wrap:break-word; font-size:' + (backLabel.length > 30 ? '1rem' : '2.1rem') + ';">' + backLabel + '</div>';
                inner.appendChild(f); inner.appendChild(b); card.appendChild(inner);
                (function(q) {
                    a11yClick(card, function() {
                        renderNativeFront(q, D.spF, 'study');
                        D.spB.innerHTML = renderSolutionBack(q, null);
                        D.spC.classList.remove('flipped'); D.sp.classList.add('visible');
                        mjax(D.spF); mjax(D.spB);
                        clearInterval(state.spTimer.int); state.spTimer.left = 30;
                        state.spTimer.int = setInterval(function() {
                            state.spTimer.left--; D.spT.textContent = fmt(state.spTimer.left);
                            if (state.spTimer.left <= 0) { clearInterval(state.spTimer.int); playBeep(); }
                        }, 1000);
                    });
                })(q);
                D.wsG.appendChild(card);
            }
            mjax(D.wsG);
        }

        D.wsGen.onclick = genWs;
        D.bd.onclick = function() { D.sp.classList.remove('visible'); clearInterval(state.spTimer.int); };
        D.spC.onclick = function() { D.spC.classList.toggle('flipped'); };
        D.tabs.forEach(function(t) { t.onclick = function() { setMode(t.dataset.mode); }; });
        D.lvl.onchange = function(e) { state.level = parseInt(e.target.value); setMode(state.mode); };
        
        document.addEventListener('keydown', function(e) { 
            if (e.key === 'Escape') {
                if (D.sp.classList.contains('visible')) D.bd.click();
                if (D.chModal.classList.contains('visible')) D.chBd.click();
            } 
        });

        setMode('study');
    }

    global.QsetFW = { init };
})(window);
