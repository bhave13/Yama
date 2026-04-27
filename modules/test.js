/**
 * test.js — Comprehensive Test Module
 * Contains Algebra and Geometry questions across all question types and subtypes.
 * Conforms strictly to the Thin Contract architecture.
 */

const rawQuestions = [
    // 1. NUMERIC (Geometry)
    { 
        type: 'NUMERIC', 
        level: 1, diff: 1,
        q: 'Find the area of a rectangle with length 5.5 cm and width 4 cm.', 
        a: '22', 
        tolerance: 0, 
        working: 'Area = \\( l \\times w \\) <br> A = 5.5 × 4 = 22', 
        img: '' 
    },
    // 2. NUMERIC (Algebra - Tests fraction evaluation)
    { 
        type: 'NUMERIC', 
        level: 1, diff: 2,
        q: 'Evaluate the expression: \\( \\frac{3}{4} + \\frac{1}{8} \\)', 
        a: '0.875', 
        tolerance: 0.01, 
        working: '\\( \\frac{3}{4} = \\frac{6}{8} \\) <br> \\( \\frac{6}{8} + \\frac{1}{8} = \\frac{7}{8} = 0.875 \\)', 
        img: '' 
    },
    // 3. MCQ (Geometry)
    { 
        type: 'MCQ', 
        level: 1, diff: 1,
        q: 'What is the sum of the interior angles of a pentagon?', 
        options: ['360°', '540°', '720°', '900°'], 
        correctOption: 1, 
        working: 'Sum = \\( (n-2) \\times 180^\\circ \\) <br> \\( (5-2) \\times 180^\\circ = 3 \\times 180^\\circ = 540^\\circ \\)', 
        img: '' 
    },
    // 4. MCQ (Algebra)
    { 
        type: 'MCQ', 
        level: 1, diff: 2,
        q: 'Which expression is equivalent to \\( 2(x + 4) - 3x \\)?', 
        options: ['\\( -x + 4 \\)', '\\( -x + 8 \\)', '\\( 5x + 8 \\)', '\\( -x - 8 \\)'], 
        correctOption: 1, 
        working: '\\( 2(x) + 2(4) - 3x \\) <br> \\( 2x + 8 - 3x \\) <br> \\( -x + 8 \\)', 
        img: '' 
    },
    // 5. MATCH (Mixed Mathjax)
    { 
        type: 'MATCH', 
        level: 1, diff: 3,
        q: 'Match the formula to its mathematical description.', 
        pairs: [ 
            {left: 'Area of a Circle', right: '\\( \\pi r^2 \\)'}, 
            {left: 'Pythagorean Theorem', right: '\\( a^2 + b^2 = c^2 \\)'}, 
            {left: 'Slope of a Line', right: '\\( \\frac{y_2 - y_1}{x_2 - x_1} \\)'},
            {left: 'Quadratic Formula', right: '\\( \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\)'}
        ], 
        img: '' 
    },
    // 6. SPOT_ERROR / STEP (Algebra)
    { 
        type: 'SPOT_ERROR', subtype: 'STEP', 
        level: 1, diff: 3,
        q: 'Identify the error in solving the equation \\( 4(x - 2) = 20 \\):', 
        steps: [ 
            {id: 1, text: '\\( 4x - 2 = 20 \\)', isError: true}, 
            {id: 2, text: '\\( 4x = 22 \\)', isError: false}, 
            {id: 3, text: '\\( x = 5.5 \\)', isError: false} 
        ], 
        errorExplanation: 'The 4 must be distributed to BOTH terms inside the parentheses: \\( 4(x) - 4(2) = 4x - 8 \\).', 
        img: '' 
    },
    // 7. SPOT_ERROR / VALUE (Geometry)
    { 
        type: 'SPOT_ERROR', subtype: 'VALUE', 
        level: 1, diff: 3,
        q: 'Identify the error in calculating the volume of a cylinder (radius = 3, height = 10):', 
        expression: 'V = \\( \\pi \\times [r^2|1] \\times h \\) = \\( 3.14 \\times [6|2] \\times [10|3] \\) = 188.4', 
        correctErrorId: 2, 
        errorExplanation: '\\( 3^2 \\) means \\( 3 \\times 3 = 9 \\). The student incorrectly multiplied by 2 instead of squaring it.', 
        img: '' 
    },
    // 8. EXPLANATION (Geometry)
    { 
        type: 'EXPLANATION', 
        level: 1, diff: 4,
        q: 'Explain why a square is always a rectangle, but a rectangle is not always a square.', 
        modelAnswer: 'A rectangle is defined as a quadrilateral with four right angles. Because a square has four right angles, it qualifies as a rectangle. However, a square also strictly requires all four sides to be equal, a property that a general rectangle lacks.', 
        markingChecklist: [
            'Mentioned that a rectangle has 4 right angles', 
            'Mentioned that a square has 4 equal sides', 
            'Concluded that a general rectangle lacks the equal sides requirement'
        ], 
        img: '' 
    },
    // 9. NUMERIC (Algebra)
    { 
        type: 'NUMERIC', 
        level: 1, diff: 2,
        q: 'Solve for \\( x \\): \\( 5x - 12 = 18 \\)', 
        a: '6', 
        working: '\\( 5x = 18 + 12 \\) <br> \\( 5x = 30 \\) <br> \\( x = 6 \\)', 
        img: '' 
    },
    // 10. MCQ (Geometry angles)
    { 
        type: 'MCQ', 
        level: 1, diff: 1,
        q: 'If two angles are complementary and one measures 35°, what is the measure of the other angle?', 
        options: ['45°', '55°', '145°', '155°'], 
        correctOption: 1, 
        working: 'Complementary angles add up to 90°. <br> \\( 90° - 35° = 55° \\)', 
        img: '' 
    },
    // 11. MATCH (Algebra Definitions)
    { 
        type: 'MATCH', 
        level: 1, diff: 1,
        q: 'Match the algebraic term to its definition.', 
        pairs: [ 
            {left: 'Coefficient', right: 'A number multiplying a variable'}, 
            {left: 'Constant', right: 'A fixed numerical value'}, 
            {left: 'Variable', right: 'A letter representing an unknown'} 
        ], 
        img: '' 
    },
    // 12. SPOT_ERROR / STEP (Geometry perimeter)
    { 
        type: 'SPOT_ERROR', subtype: 'STEP', 
        level: 1, diff: 2,
        q: 'Identify the error in finding the perimeter of a rectangle where L = 5 and W = 3:', 
        steps: [ 
            {id: 1, text: '\\( P = 2(L + W) \\)', isError: false}, 
            {id: 2, text: '\\( P = 2(5 + 3) \\)', isError: false}, 
            {id: 3, text: '\\( P = 10 + 3 \\)', isError: true}, 
            {id: 4, text: '\\( P = 13 \\)', isError: false} 
        ], 
        errorExplanation: 'The 2 must distribute to BOTH the 5 and the 3, or you must add inside the parentheses first (8) then multiply by 2 to get 16.', 
        img: '' 
    }
];

let globalQuestionIndex = 0;

export default {
    id: 'algebra_geometry_test',
    title: 'Algebra & Geometry (Full Feature Test)',
    levelNames: ['Level 1: Core Fundamentals'],
    
    referenceLabel: 'Math References — Click to expand',
    referenceItems: [
        { 
            label: 'PEMDAS', 
            title: 'Order of Operations', 
            text: 'Parentheses, Exponents, Multiplication/Division (left to right), Addition/Subtraction (left to right).', 
            math: '5 + (2 \\times 3) = 11' 
        },
        { 
            label: 'Poly', 
            title: 'Polygons & Angles', 
            text: 'Sum of interior angles = \\( (n-2) \\times 180 \\). Complementary angles sum to 90°, Supplementary to 180°.', 
            math: '' 
        }
    ],

    getQuestion(level, diff, mode) {
        let q;
        // Strict guard: Challenge mode excludes EXPLANATION types
        do {
            q = rawQuestions[globalQuestionIndex % rawQuestions.length];
            globalQuestionIndex++;
        } while (mode === 'challenge' && q.type === 'EXPLANATION');
        
        return q;
    }
};

