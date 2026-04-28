// ── 1. HEADER COMMENT ─────────────────────────────────────────────────
// Topic:        Numeracy PO3 Justifications (Measurement, Time & Data)
// NCEA Level:   1         Standard: US32406
// Year Group:   NCEA Level 1
// Generated:    28 April 2026
// Type Mix:     100% EXPLANATION
// Review Doc:   Approved 28 April 2026

// ── 2. UTILITY FUNCTIONS ──────────────────────────────────────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randF = (min, max, dp) => {
    const factor = Math.pow(10, dp);
    return Math.round((Math.random() * (max - min) + min) * factor) / factor;
};

const pickAndRemove = (arr) => {
    if (arr.length === 0) return null;
    const index = Math.floor(Math.random() * arr.length);
    return arr.splice(index, 1)[0];
};

let globalCounter = 1;
const makeUID = (type, level, diff) => {
    const typeAbbr = {
        'NUMERIC': 'num',
        'TEXT': 'txt',
        'MCQ': 'mcq',
        'MATCH': 'mat',
        'SPOT_ERROR/STEP': 'sep',
        'SPOT_ERROR/VALUE': 'sev',
        'EXPLANATION': 'exp'
    }[type] || 'unk';
    const num = String(globalCounter++).padStart(3, '0');
    return `${typeAbbr}-${num}-lev${level}-d${diff}`;
};

const makeSVG = (width, height, content) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">${content}</svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const formatCurrency = (num) => `\\$${num.toFixed(2)}`;

const formatTime = (totalMins) => {
    let h = Math.floor(totalMins / 60) % 24;
    let m = totalMins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

// Context Pools
const pools = {
    q1_items: ['fruit platter', 'sandwich tray', 'snack box'],
    q1_active: []
};

const getQ1Item = () => {
    if (pools.q1_active.length === 0) {
        pools.q1_active = [...pools.q1_items];
    }
    return pickAndRemove(pools.q1_active);
};

// ── 3. QUESTION GENERATORS ────────────────────────────────────────────

function _genExplanation(level, diff) {
    let qObj = {
        level: level,
        diff: diff,
        type: "EXPLANATION",
        working: "",
        ncea: { standard: "US32406", ao: "PO3" }
    };

    if (level === 1 && diff === 1) {
        // Q-001
        qObj.uid = makeUID("EXPLANATION", 1, 1);
        let item = getQ1Item();
        let costA, costB, costPerA, costPerB;
        do {
            costA = rand(20, 30);
            costB = rand(35, 50);
            costPerA = costA / 10;
            costPerB = costB / 20;
        } while (costPerB >= costPerA); 
        
        let diffPrice = costPerA - costPerB;
        qObj.a = "Supplier B offers better value.";
        qObj.q = `You are helping cater for a sports club. Supplier A offers a ${item} that serves 10 people for \\$${costA}. Supplier B offers a ${item} that serves 20 people for \\$${costB}. Which supplier offers the better value per serving? State your position and explain your choice using numbers from both options.`;
        qObj.hint = "Calculate the cost of one single serving for each supplier first, then compare them.";
        qObj.modelAnswer = `Supplier B offers the better value per serving. Evidence for this is that Supplier A costs ${formatCurrency(costPerA)} per serving (${formatCurrency(costA)} ÷ 10), whereas Supplier B costs ${formatCurrency(costPerB)} per serving (${formatCurrency(costB)} ÷ 20). This means Supplier B saves ${formatCurrency(diffPrice)} per serving, making it the better financial choice.`;
        qObj.markingChecklist = [
            "Correctly calculates the per-serving cost for Supplier A",
            "Correctly calculates the per-serving cost for Supplier B",
            "States a clear recommendation linked directly to the numerical comparison (PEEL structure)"
        ];
        qObj.imgAlt = "A simple split graphic showing Supplier A and Supplier B with platter icons and their costs and servings.";
        qObj.img = makeSVG(400, 150, `
            <rect x="10" y="10" width="180" height="130" rx="8" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>
            <text x="100" y="40" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#212529">Supplier A</text>
            <ellipse cx="100" cy="70" rx="40" ry="15" fill="#e9ecef" stroke="#adb5bd" stroke-width="2"/>
            <text x="100" y="105" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#495057">10 servings</text>
            <text x="100" y="125" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#198754">$${costA}</text>
            <rect x="210" y="10" width="180" height="130" rx="8" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>
            <text x="300" y="40" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#212529">Supplier B</text>
            <ellipse cx="300" cy="70" rx="40" ry="15" fill="#e9ecef" stroke="#adb5bd" stroke-width="2"/>
            <text x="300" y="105" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#495057">20 servings</text>
            <text x="300" y="125" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#198754">$${costB}</text>
        `);

    } else if (level === 1 && diff === 2) {
        // Q-002
        qObj.uid = makeUID("EXPLANATION", 1, 2);
        let volA = 2, volB = 3;
        let costA, costB, costPerA, costPerB;
        do {
            costA = randF(4.00, 5.00, 2);
            costB = randF(5.50, 7.00, 2);
            costPerA = costA / volA;
            costPerB = costB / volB;
        } while (costPerB >= costPerA || !Number.isFinite(costPerA) || !Number.isFinite(costPerB));
        
        qObj.a = "Supplier B gives the cheapest cost per litre.";
        qObj.q = `You are ordering juice for 50 students at a camp. Supplier A sells 2L bottles for ${formatCurrency(costA)} each. Supplier B sells 3L bottles for ${formatCurrency(costB)} each. Which supplier gives you the cheapest cost per litre? State your position and explain your choice using numbers from both options.`;
        qObj.hint = "Find out how much exactly one litre costs from each supplier by dividing the price by the volume.";
        qObj.modelAnswer = `Supplier B is the more cost-effective option per litre. With Supplier A, a 2L bottle costs ${formatCurrency(costA)}, which breaks down to ${formatCurrency(costPerA)} per litre (${formatCurrency(costA)} ÷ 2). With Supplier B, a 3L bottle costs ${formatCurrency(costB)}, which breaks down to ${formatCurrency(costPerB)} per litre (${formatCurrency(costB)} ÷ 3). Because ${formatCurrency(costPerB)} is cheaper than ${formatCurrency(costPerA)}, Supplier B is the best choice to save money.`;
        qObj.markingChecklist = [
            "Correctly calculates the cost per litre for Supplier A",
            "Correctly calculates the cost per litre for Supplier B",
            "Recommends the correct supplier with clear numerical justification"
        ];
        qObj.imgAlt = "Two illustrations of juice packaging. Supplier A: 2L bottle. Supplier B: 3L bottle.";
        qObj.img = makeSVG(300, 160, `
            <rect x="40" y="40" width="50" height="90" rx="5" fill="#ffd8a8" stroke="#f59f00" stroke-width="2"/>
            <rect x="55" y="20" width="20" height="20" fill="#ffd8a8" stroke="#f59f00" stroke-width="2"/>
            <text x="65" y="80" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#d9480f">Supp A</text>
            <text x="65" y="100" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#d9480f">2L</text>
            <text x="65" y="120" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#2b8a3e">$${costA.toFixed(2)}</text>
            
            <rect x="180" y="30" width="60" height="100" rx="5" fill="#ffd8a8" stroke="#f59f00" stroke-width="2"/>
            <rect x="200" y="15" width="20" height="15" fill="#ffd8a8" stroke="#f59f00" stroke-width="2"/>
            <text x="210" y="70" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#d9480f">Supp B</text>
            <text x="210" y="90" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#d9480f">3L</text>
            <text x="210" y="110" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#2b8a3e">$${costB.toFixed(2)}</text>
        `);

    } else if (level === 2 && diff === 1) {
        // Q-003
        qObj.uid = makeUID("EXPLANATION", 2, 1);
        let l1, w1, l2, w2, costPerM, areaA, areaB, totalA, totalB, diffPrice;
        do {
            l1 = rand(4, 6); w1 = rand(3, 5);
            l2 = rand(4, 7); w2 = rand(2, 4);
            areaA = l1 * w1; areaB = l2 * w2;
            costPerM = rand(25, 40);
            totalA = areaA * costPerM;
            totalB = areaB * costPerM;
        } while (areaA === areaB || totalB >= totalA); 
        diffPrice = totalA - totalB;
        
        qObj.a = `Option B is cheaper by \\$${diffPrice}.`;
        qObj.q = `You are building a rectangular deck. Option A has an area of \\(${l1}\\text{m} \\times ${w1}\\text{m}\\). Option B has an area of \\(${l2}\\text{m} \\times ${w2}\\text{m}\\). If decking timber costs \\$${costPerM} per square metre, which option is cheaper to build and by how much? Write a PEEL paragraph to justify your answer, referring to both options.`;
        qObj.hint = "Calculate the area for both options using \\(\\text{length} \\times \\text{width}\\), then multiply by the cost per square metre.";
        qObj.modelAnswer = `Option B is the cheaper deck to build. The area of Option A is \\(${areaA}\\text{m}^2\\) (\\(${l1} \\times ${w1}\\)), making the timber cost \\$${totalA} (\\(${areaA} \\times \\$${costPerM}\\)). The area of Option B is \\(${areaB}\\text{m}^2\\) (\\(${l2} \\times ${w2}\\)), making the timber cost \\$${totalB} (\\(${areaB} \\times \\$${costPerM}\\)). Comparing the two, Option B is \\$${diffPrice} cheaper than Option A (\\$${totalA} - \\$${totalB}), making it the most cost-effective choice.`;
        qObj.markingChecklist = [
            "Correctly calculates the area and cost for Option A",
            "Correctly calculates the area and cost for Option B",
            "States which design is cheaper and correctly identifies the price difference"
        ];
        qObj.imgAlt = "Top-down view of two rectangular decks attached to a simple house outline, labeled with their dimensions.";
        qObj.img = makeSVG(400, 160, `
            <rect x="20" y="20" width="100" height="40" fill="#ced4da" stroke="#868e96" stroke-width="2"/>
            <rect x="20" y="60" width="${l1*15}" height="${w1*15}" fill="#deb887" stroke="#8b4513" stroke-width="2"/>
            <text x="70" y="45" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#495057">House</text>
            <text x="${20 + (l1*15)/2}" y="${60 + (w1*15)/2 + 5}" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#495057">Opt A</text>
            <text x="${20 + (l1*15)/2}" y="55" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#212529">${l1}m</text>
            <text x="10" y="${60 + (w1*15)/2 + 3}" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#212529">${w1}m</text>

            <rect x="220" y="20" width="100" height="40" fill="#ced4da" stroke="#868e96" stroke-width="2"/>
            <rect x="220" y="60" width="${l2*15}" height="${w2*15}" fill="#deb887" stroke="#8b4513" stroke-width="2"/>
            <text x="270" y="45" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#495057">House</text>
            <text x="${220 + (l2*15)/2}" y="${60 + (w2*15)/2 + 5}" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#495057">Opt B</text>
            <text x="${220 + (l2*15)/2}" y="55" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#212529">${l2}m</text>
            <text x="210" y="${60 + (w2*15)/2 + 3}" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#212529">${w2}m</text>
        `);

    } else if (level === 2 && diff === 3) {
        // Q-004
        qObj.uid = makeUID("EXPLANATION", 2, 3);
        let lenA_mm, costA, lenB_m, costB, costPerA, costPerB, diffPrice;
        do {
            lenA_mm = rand(2000, 3000, 100);
            costA = rand(10, 15);
            lenB_m = randF(1.5, 2.5, 1);
            costB = rand(8, 12);
            costPerA = costA / (lenA_mm / 1000);
            costPerB = costB / lenB_m;
        } while (costPerB >= costPerA || !Number.isInteger(costPerA * 100) || !Number.isInteger(costPerB * 100));
        
        let lenA_m = lenA_mm / 1000;
        diffPrice = costPerA - costPerB;
        
        qObj.a = "Option B has the cheaper cost per metre.";
        qObj.q = `You need to buy timber boards for a fence. Option A is a board that is ${lenA_mm}mm long and costs \\$${costA}. Option B is a board that is ${lenB_m}m long and costs \\$${costB}. Which option has the cheaper cost per metre? Write a PEEL paragraph to justify your answer, referring to both options.`;
        qObj.hint = "Convert the measurement for Option A into metres before calculating the cost per metre (\\(1000\\text{mm} = 1\\text{m}\\)).";
        qObj.modelAnswer = `Option B has the cheaper cost per metre. Before comparing, Option A's length must be converted to metres (${lenA_mm} ÷ 1000 = ${lenA_m}m). The cost of Option A is ${formatCurrency(costPerA)} per metre (\\$${costA} ÷ ${lenA_m}). The cost of Option B is ${formatCurrency(costPerB)} per metre (\\$${costB} ÷ ${lenB_m}). This shows that Option B is cheaper by ${formatCurrency(diffPrice)} per metre, making it the better choice for the fence.`;
        qObj.markingChecklist = [
            "Correctly converts the millimetres in Option A into metres",
            "Calculates the cost per metre correctly for both options",
            "Accurately identifies the cheaper option and formats the final paragraph logically"
        ];
        qObj.imgAlt = "Two planks of wood shown horizontally. Option A is labeled with a length in millimetres. Option B is labeled with a length in metres.";
        qObj.img = makeSVG(400, 120, `
            <rect x="20" y="20" width="300" height="20" fill="#e6ca9c" stroke="#a67c52" stroke-width="2"/>
            <text x="330" y="35" font-family="sans-serif" font-size="14" font-weight="bold" fill="#212529">Opt A: $${costA}</text>
            <text x="170" y="15" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#495057">${lenA_mm}mm</text>

            <rect x="20" y="70" width="240" height="20" fill="#e6ca9c" stroke="#a67c52" stroke-width="2"/>
            <text x="270" y="85" font-family="sans-serif" font-size="14" font-weight="bold" fill="#212529">Opt B: $${costB}</text>
            <text x="140" y="65" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#495057">${lenB_m}m</text>
        `);

    } else if (level === 3 && diff === 2) {
        // Q-005
        qObj.uid = makeUID("EXPLANATION", 3, 2);
        let timeA_hrs, timeB_hrs, timeB_mins, startA_h, startB_h, startB_m;
        do {
            timeA_hrs = rand(2, 4);
            timeB_hrs = rand(1, 3);
            timeB_mins = 30;
            startA_h = 16 - timeA_hrs;
            startB_h = 15 - timeB_hrs;
            startB_m = 45 - timeB_mins; 
        } while (startA_h >= startB_h || (startA_h === startB_h && 0 >= startB_m)); 
        
        let timeB_str = `${timeB_hrs} hour${timeB_hrs>1?'s':''} and 30 minutes`;
        let diffMins = (startB_h * 60 + startB_m) - (startA_h * 60);
        
        qObj.a = "Software A started earlier.";
        qObj.q = `You are rendering an architectural video. Software A takes ${timeA_hrs} hours and finishes at 16:00. Software B takes ${timeB_str} and finishes at 15:45. Which software process started earlier? Justify your choice with numerical evidence.`;
        qObj.hint = "Work backwards from the finish time. Subtract the duration from the finish time to find the start time for each software.";
        qObj.modelAnswer = `Software A started earlier. Evidence for this is that Software A takes ${timeA_hrs} hours and finishes at 16:00, which means it must have started at exactly ${startA_h}:00. Software B takes ${timeB_str} and finishes at 15:45. Working backwards, Software B must have started at ${startB_h}:15. Because ${startA_h}:00 is ${diffMins} minutes before ${startB_h}:15, Software A was the one that started first.`;
        qObj.markingChecklist = [
            "Correctly calculates the start time for Software A",
            "Correctly calculates the start time for Software B",
            "Makes a clear statement identifying the earlier start time"
        ];
        qObj.imgAlt = "A Gantt-chart style timeline showing the hours from 12:00 to 17:00, with bars representing Software A and Software B.";
        let scaleX = (x) => 20 + ((x - 12*60) / (5*60)) * 360;
        let sAx = scaleX(startA_h * 60);
        let eAx = scaleX(16 * 60);
        let sBx = scaleX(startB_h * 60 + startB_m);
        let eBx = scaleX(15 * 60 + 45);
        qObj.img = makeSVG(400, 120, `
            <line x1="20" y1="90" x2="380" y2="90" stroke="#adb5bd" stroke-width="2"/>
            <text x="20" y="110" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#868e96">12:00</text>
            <text x="380" y="110" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#868e96">17:00</text>
            <rect x="${sAx}" y="20" width="${eAx - sAx}" height="20" rx="4" fill="#339af0"/>
            <text x="${sAx + 5}" y="35" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">A</text>
            <rect x="${sBx}" y="50" width="${eBx - sBx}" height="20" rx="4" fill="#ff922b"/>
            <text x="${sBx + 5}" y="65" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">B</text>
        `);

    } else if (level === 3 && diff === 4) {
        // Q-006
        qObj.uid = makeUID("EXPLANATION", 3, 4);
        let durA_mins, durB_hrs, durB_mins, fA_time, fB_time, fA_str, fB_str;
        let startA = 22 * 60 + 30; 
        let startB = 23 * 60;      
        let deadline = 25 * 60;    
        do {
            durA_mins = rand(130, 150);
            durB_hrs = 2;
            durB_mins = rand(10, 20);
            fA_time = startA + durA_mins;
            fB_time = startB + (durB_hrs * 60) + durB_mins;
        } while (fA_time >= deadline || fB_time <= deadline);

        fA_str = formatTime(fA_time);
        fB_str = formatTime(fB_time);
        
        let durA_h = Math.floor(durA_mins / 60);
        let durA_m = durA_mins % 60;
        let a_early = deadline - fA_time;
        let b_late = fB_time - deadline;

        qObj.a = "Server Backup A meets the deadline.";
        qObj.q = `Server Backup A takes ${durA_mins} minutes and must start at 22:30. Server Backup B takes ${durB_hrs} hours and ${durB_mins} minutes but starts at 23:00. The system needs to be back online by 01:00. Which backup option meets the deadline? Use a PEEL paragraph to explain your answer, showing the finish times for both options.`;
        qObj.hint = `Convert ${durA_mins} minutes into hours and minutes first (e.g., 120 mins = 2 hours). Then add the durations to the start times.`;
        qObj.modelAnswer = `Server Backup A is the only option that meets the deadline. Server Backup A takes ${durA_mins} minutes (${durA_h} hours and ${durA_m} minutes). Starting at 22:30, it will finish at ${fA_str}, which is ${a_early} minutes before the 01:00 deadline. Server Backup B takes ${durB_hrs} hours and ${durB_mins} minutes. Starting at 23:00, it will finish at ${fB_str}, which is ${b_late} minutes late. Therefore, Backup A must be chosen to ensure the system is online in time.`;
        qObj.markingChecklist = [
            "Correctly calculates the finish time for Server Backup A across the midnight boundary",
            "Correctly calculates the finish time for Server Backup B",
            "Makes a clear recommendation based on which finish time is successfully prior to the 01:00 deadline"
        ];
        qObj.imgAlt = "A visual timeline showing the hours from 22:00 to 02:00, with a bold red line marking the 01:00 deadline.";
        let scaleX = (x) => 20 + ((x - 22*60) / (4*60)) * 360;
        let dx = scaleX(25 * 60);
        qObj.img = makeSVG(400, 80, `
            <line x1="20" y1="40" x2="380" y2="40" stroke="#adb5bd" stroke-width="4"/>
            <text x="20" y="65" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#495057">22:00</text>
            <text x="380" y="65" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#495057">02:00</text>
            <line x1="${dx}" y1="20" x2="${dx}" y2="60" stroke="#fa5252" stroke-width="4"/>
            <text x="${dx}" y="15" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#fa5252">01:00 Deadline</text>
        `);

    } else if (level === 4 && diff === 2) {
        // Q-007
        qObj.uid = makeUID("EXPLANATION", 4, 2);
        let minA, maxA, minB, maxB, rangeA, rangeB;
        do {
            minA = rand(180, 220); maxA = rand(330, 370);
            minB = rand(240, 260); maxB = rand(290, 310);
            rangeA = maxA - minA;
            rangeB = maxB - minB;
        } while (rangeA <= rangeB);
        
        qObj.a = "Job B provides a more consistent income.";
        qObj.q = `You are comparing two part-time jobs over a 4-week period. Job A pays a weekly wage that ranges from a minimum of \\$${minA} to a maximum of \\$${maxA}. Job B pays a weekly wage that ranges from a minimum of \\$${minB} to a maximum of \\$${maxB}. Which job provides a more consistent income? Compare their ranges to justify your answer.`;
        qObj.hint = "Use the formula \\(\\text{Range} = \\text{Maximum} - \\text{Minimum}\\) to find out how much the wages vary for each job.";
        qObj.modelAnswer = `Job B provides the most consistent income. Evidence for this is found by calculating the range for both jobs. Job A has a wage range of \\$${rangeA} (\\$${maxA} - \\$${minA}). Job B has a much smaller wage range of \\$${rangeB} (\\$${maxB} - \\$${minB}). Because Job B has a smaller range, its weekly wages vary significantly less, making it the more reliable and consistent income source.`;
        qObj.markingChecklist = [
            "Correctly calculates the range for Job A",
            "Correctly calculates the range for Job B",
            "Associates a smaller range with better consistency to justify the recommendation"
        ];
        qObj.imgAlt = "Two simple bar charts shown side-by-side representing 4 weeks of wages. Job A's bars fluctuate significantly. Job B's bars are roughly even.";
        qObj.img = makeSVG(400, 160, `
            <text x="100" y="20" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#212529">Job A</text>
            <line x1="20" y1="130" x2="180" y2="130" stroke="#adb5bd" stroke-width="2"/>
            <rect x="40" y="70" width="20" height="60" fill="#4dabf7"/>
            <rect x="70" y="30" width="20" height="100" fill="#4dabf7"/>
            <rect x="100" y="90" width="20" height="40" fill="#4dabf7"/>
            <rect x="130" y="40" width="20" height="90" fill="#4dabf7"/>

            <text x="300" y="20" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#212529">Job B</text>
            <line x1="220" y1="130" x2="380" y2="130" stroke="#adb5bd" stroke-width="2"/>
            <rect x="240" y="40" width="20" height="90" fill="#69db7c"/>
            <rect x="270" y="50" width="20" height="80" fill="#69db7c"/>
            <rect x="300" y="45" width="20" height="85" fill="#69db7c"/>
            <rect x="330" y="35" width="20" height="95" fill="#69db7c"/>
        `);

    } else if (level === 4 && diff === 4) {
        // Q-008
        qObj.uid = makeUID("EXPLANATION", 4, 4);
        let minA, maxA, minB, maxB, rangeA, rangeB;
        do {
            maxA = rand(1400, 1600); minA = rand(400, 600);
            maxB = rand(1050, 1150); minB = rand(850, 950);
            rangeA = maxA - minA;
            rangeB = maxB - minB;
        } while (maxA <= maxB || rangeA <= rangeB * 2);
        
        qObj.a = "Shop B offers more reliable income.";
        qObj.q = `Look at the daily sales data for two shops over a week. Shop A has a maximum daily sale of \\$${maxA} and a minimum of \\$${minA}. Shop B has daily sales ranging strictly between \\$${minB} and \\$${maxB}. If you are looking to invest in a business with the most reliable, steady income, which shop would you choose? Support your decision with numbers from both datasets and compare their ranges.`;
        qObj.hint = "Consistency is shown by having a small range between the highest and lowest days. Calculate the range for both shops first.";
        qObj.modelAnswer = `I would choose Shop B for a reliable, steady income. While Shop A has a higher maximum sale of \\$${maxA}, its daily sales are highly unpredictable, shown by its massive range of \\$${rangeA} (\\$${maxA} - \\$${minA}). In contrast, Shop B's sales are much more stable. Shop B has a range of only \\$${rangeB} (\\$${maxB} - \\$${minB}). A smaller range proves that Shop B's income is consistently steady without large drops, making it the safer business to invest in.`;
        qObj.markingChecklist = [
            "Calculates the range for Shop A",
            "Calculates the range for Shop B",
            "Explicitly addresses why the alternative option (Shop A) was rejected despite having a higher maximum value"
        ];
        qObj.imgAlt = "Line graph showing two plotted lines over 7 days. Shop A shows wild spikes and crashes. Shop B shows a very tight, gently fluctuating line.";
        qObj.img = makeSVG(400, 180, `
            <line x1="40" y1="150" x2="380" y2="150" stroke="#adb5bd" stroke-width="2"/>
            <line x1="40" y1="10" x2="40" y2="150" stroke="#adb5bd" stroke-width="2"/>
            <polyline points="40,120 90,30 140,130 190,40 240,140 290,20 340,110" fill="none" stroke="#fa5252" stroke-width="3" stroke-linejoin="round"/>
            <polyline points="40,80 90,75 140,85 190,70 240,80 290,75 340,85" fill="none" stroke="#2b8a3e" stroke-width="3" stroke-linejoin="round"/>
            <text x="350" y="105" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fa5252">Shop A</text>
            <text x="350" y="75" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2b8a3e">Shop B</text>
        `);
    }

    return qObj;
}

// ── 4. CONFIG OBJECT ──────────────────────────────────────────────────
const config = {
    id: "numeracy_po3_justifications",
    title: "Numeracy PO3 Justifications (Measurement, Time & Data)",
    levelNames: [
        "Level 1: Hospitality",
        "Level 2: Woodwork",
        "Level 3: Digital Technology",
        "Level 4: Money Matters"
    ],
    getQuestion(level, diff) {
        // Fix: If diff is null/undefined (passed by qs_fwk), pick a valid diff.
        if (diff == null) {
            const availableDiffs = {
                1: [1, 2],
                2: [1, 3],
                3: [2, 4],
                4: [2, 4]
            };
            const choices = availableDiffs[level] || [1];
            diff = choices[Math.floor(Math.random() * choices.length)];
        }
        return _genExplanation(level, diff);
    },
    renderFront(q, el) {
        let html = "";
        if (q.img && q.img !== "") {
            html += `<img src="${q.img}" alt="${q.imgAlt || ""}" class="question-image" style="max-width:100%;height:auto;display:block;margin:0 auto 0.5em auto;"/>`;
            html += `<div class="question-text">${q.q}</div>`;
        } else {
            html += `<div class="question-text centered-text" style="text-align:center;">${q.q}</div>`;
        }
        el.innerHTML = html;
    },
    generateSolution(q) {
        return "";
    }
};

export default config;
