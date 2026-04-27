# YAMA Topic Analysis

## Topic: Area of Shapes
## Year Group: Year 10
## Curriculum Strand: Measurement and Geometry
## Achievement Objective: Use appropriate scales, devices, and metric units for length and area; find areas of rectangles, triangles, parallelograms, circles, and composite shapes (NZ Curriculum, AO: GM4-3, GM5-2)

---

## 1. Prerequisites

Prerequisites are skills the student must have consolidated before beginning this topic.
Each row is a single, independently learnable skill, ordered from most fundamental.

| # | Prerequisite Skill | Why It Is Needed |
|---|---|---|
| 1 | Multiply two integers fluently (including multi-digit multiplication) | Every area formula requires multiplication as the core operation |
| 2 | Multiply a decimal by an integer or by another decimal | Area calculations frequently produce or use decimal values |
| 3 | Substitute a known value into a simple formula (e.g. evaluate 3x when x = 4) | All area formulas require substitution of given dimensions |
| 4 | Apply the order of operations correctly (BEDMAS) | Formulas such as A = ½ × b × h require correct sequencing |
| 5 | Convert between metric units of length (mm, cm, m, km) | Dimensions are often given in mixed units; area units depend on length units used |
| 6 | Identify and name standard 2D shapes (rectangle, triangle, parallelogram, circle) | Students must recognise the shape before selecting the correct formula |
| 7 | Identify the base and perpendicular height of a triangle and parallelogram | The height in area formulas is always the perpendicular height, not the slant side |
| 8 | Identify the radius and diameter of a circle and state the relationship d = 2r | Many problems give diameter; students must halve it before using A = πr² |
| 9 | Use a calculator to evaluate expressions involving π to a specified number of decimal places | Circle area calculations require working with π accurately |
| 10 | Recognise that area is measured in square units (mm², cm², m², km²) | Without this, students cannot label answers correctly or interpret context problems |

---

## 2. Facts and Formulas

Facts and formulas the student must be able to recall and apply without derivation.
Include correct mathematical notation. Use LaTeX notation where appropriate.

| # | Fact / Formula | Example / Notes |
|---|---|---|
| 1 | Area of a rectangle: `A = l × w` | l = length, w = width. Both must be in the same unit before multiplying. |
| 2 | Area of a square: `A = s²` | Special case of the rectangle formula where l = w = s |
| 3 | Area of a triangle: `A = ½ × b × h` | h is the **perpendicular** height — the vertical distance between the base and the opposite vertex, not the slant side |
| 4 | Area of a parallelogram: `A = b × h` | Again h is the **perpendicular** height. The slant side is irrelevant to area. |
| 5 | Area of a circle: `A = πr²` | r is the radius. If diameter d is given, use r = d ÷ 2 first. |
| 6 | π ≈ 3.14 (2 d.p.) or use the π key on a calculator | Students should know both the approximation and how to use the calculator value |
| 7 | Area units are always square units: mm², cm², m², km², hectares (ha) | 1 ha = 10 000 m². Forgetting the square on the unit is one of the most common errors. |
| 8 | Area of a compound shape = sum of the areas of its component shapes | The shape must first be partitioned into non-overlapping standard shapes |
| 9 | Area of a complex (cutout) shape = area of the whole − area of the part removed | The removed region must be completely enclosed within the outer shape |
| 10 | Area of a sector: `A = (θ/360) × πr²` | θ is the angle at the centre in degrees. Extension level only. |

---

## 3. Skill Levels

ATOMISATION RULE: Each level tests exactly ONE new, independently assessable skill.
Level count is determined by the topic — use as many as needed.

---

### Level 1: Identify and Name Area Units

**Tier:** Pre-req Check
**Single Skill Tested:** Given a shape with labelled dimensions in a specified unit, the student selects or writes the correct square unit for the area answer.
**Recommended Question Types:** MCQ, MATCH, TEXT (typed answer)

**Difficulty Guidance:**

| Diff | Description for This Skill | Concrete Example |
|---|---|---|
| 1 | Choose the correct unit when dimensions are in whole-number metres | "A rectangle has dimensions in metres. What unit is used for its area?" → m² |
| 2 | Choose the correct unit when dimensions are in centimetres or millimetres | "Dimensions are given in cm. What is the area unit?" → cm² |
| 3 | Convert a given area in cm² to mm² or vice versa (1 cm² = 100 mm²) | "A shape has area 4.5 cm². Express this in mm²." → 450 mm² |
| 4 | Choose the correct unit and convert when dimensions involve mixed units (e.g. m and cm) | "Length is 2 m, width is 50 cm. Before calculating, convert to the same unit. What unit should the area be in?" |

**Example Question Stem (Difficulty 1):** "A garden is measured in metres. What unit should you use to record its area?"

**Common Misconceptions:**
- **Writing the unit without the squared symbol** — students write "cm" instead of "cm²". This is extremely persistent and suggests the student has not yet connected the idea that area is two-dimensional and therefore the unit is multiplied by itself.
- **Confusing perimeter units with area units** — after computing a numeric answer, students attach a length unit (e.g. m) rather than a square unit (m²), especially when the question does not explicitly prompt for a unit.
- **Believing 1 m² = 100 cm²** — students incorrectly scale the unit conversion by the same factor as the length conversion (×100) rather than squaring it (×10 000). This misconception is rarely surfaced unless explicitly tested.

---

### Level 2: Area of a Rectangle (and Square)

**Tier:** Simple Skill
**Single Skill Tested:** Apply the formula A = l × w to find the area of a rectangle or square given both dimensions.
**Recommended Question Types:** NUMERIC, MCQ, SPOT_ERROR/VALUE

**Difficulty Guidance:**

| Diff | Description for This Skill | Concrete Example |
|---|---|---|
| 1 | Both dimensions are positive integers; answer is a whole number | l = 8 m, w = 5 m → A = 40 m² |
| 2 | One or both dimensions are decimals to 1–2 d.p. | l = 6.4 m, w = 3.5 m → A = 22.4 m² |
| 3 | One or both dimensions are fractions | l = ¾ m, w = ⅔ m → A = ½ m² |
| 4 | Dimensions are given in different units requiring conversion before use, or a dimension must be inferred (e.g. perimeter and one side are given) | P = 26 cm, w = 5 cm → find l, then find A |

**Example Question Stem (Difficulty 1):** "A classroom floor is 9 m long and 6 m wide. Calculate the area of the floor."

**Common Misconceptions:**
- **Adding instead of multiplying** — students compute l + w rather than l × w, likely from confusing the area formula with the perimeter formula. This is especially common in students who have recently been doing perimeter work.
- **Forgetting to square the side when working with a square** — students write A = s rather than A = s², computing a length rather than an area.
- **Using the wrong pair of dimensions** — when a diagram includes extra labelled lengths (e.g. a diagonal or a height given for context), some students multiply the wrong pair of numbers.
- **Not converting units before multiplying** — when dimensions are given in different units (e.g. 2 m and 30 cm), students multiply 2 × 30 = 60 and assign incorrect or inconsistent units.

---

### Level 3: Area of a Parallelogram

**Tier:** Simple Skill
**Single Skill Tested:** Apply the formula A = b × h to find the area of a parallelogram, using only the perpendicular height (not the slant side).
**Recommended Question Types:** NUMERIC, MCQ, SPOT_ERROR/VALUE, SPOT_ERROR/STEP

**Difficulty Guidance:**

| Diff | Description for This Skill | Concrete Example |
|---|---|---|
| 1 | Integer base and integer perpendicular height; slant side also labelled as a distractor | b = 10 cm, h = 6 cm (slant = 7 cm shown) → A = 60 cm² |
| 2 | Decimal base and/or height; slant side labelled | b = 8.5 m, h = 4.2 m → A = 35.7 m² |
| 3 | Fractional base and height | b = 5/2 m, h = 4/3 m → A = 10/3 m² |
| 4 | The height is not directly labelled and must be inferred from context, or the shape is presented in a non-standard orientation | Parallelogram tilted 90°; student must correctly identify which measurement is the perpendicular height |

**Example Question Stem (Difficulty 1):** "A parallelogram has a base of 12 cm, a perpendicular height of 5 cm, and a slant side of 7 cm. What is its area?"

**Common Misconceptions:**
- **Using the slant side instead of the perpendicular height** — this is the dominant error for parallelograms. When a diagram shows both the slant side and the perpendicular height, a significant proportion of students multiply base × slant side. This suggests they have not internalised why height must be perpendicular (it is the same logic as for triangles, but even less intuitive here because the slant side looks more "natural").
- **Confusing the parallelogram formula with the triangle formula and halving** — students apply A = ½ × b × h, possibly because they learned the triangle formula most recently or associate "non-rectangular quadrilateral" with halving.
- **Treating the parallelogram as a rectangle** — students mentally "straighten" the shape and use l × w with the slant side as the "length". This compounds with the first misconception above.

---

### Level 4: Area of a Triangle

**Tier:** Simple Skill
**Single Skill Tested:** Apply the formula A = ½ × b × h to find the area of a triangle, using the perpendicular height.
**Recommended Question Types:** NUMERIC, MCQ, SPOT_ERROR/VALUE, SPOT_ERROR/STEP

**Difficulty Guidance:**

| Diff | Description for This Skill | Concrete Example |
|---|---|---|
| 1 | Integer base and height; right-angled triangle or height clearly labelled inside the shape | b = 10 cm, h = 6 cm → A = 30 cm² |
| 2 | Decimal base and/or height | b = 7.4 m, h = 3.2 m → A = 11.84 m² |
| 3 | Fractional dimensions | b = ¾ m, h = 8/3 m → A = 1 m² |
| 4 | Obtuse triangle where the height falls outside the base (external height); or a scalene triangle where three side lengths are labelled and the student must identify which measurement is the perpendicular height | Height shown as a dashed external line; student must use this, not a labelled side |

**Example Question Stem (Difficulty 1):** "A triangle has a base of 8 cm and a perpendicular height of 5 cm. What is its area?"

**Common Misconceptions:**
- **Forgetting to halve** — students compute b × h rather than ½ × b × h. This is very common and suggests the student has memorised that area involves multiplying two dimensions but has dropped the ½ factor.
- **Using a slant side as the height** — especially in non-right-angled triangles, students use a labelled side length rather than the perpendicular height. For obtuse triangles where the height falls outside the triangle, this error rate increases sharply.
- **Halving the base instead of the product** — students compute (b ÷ 2) × h rather than ½ × (b × h). This gives the same answer and so the misconception is hidden unless explicitly probed (e.g. by asking for an intermediate step).
- **Confusing triangle area with parallelogram area** — after learning both formulas, some students drop the ½ from triangles or add it to parallelograms. SPOT_ERROR questions presenting a "worked solution" with this error are very effective at surfacing this.

---

### Level 5: Area of a Circle

**Tier:** Simple Skill
**Single Skill Tested:** Apply the formula A = πr² to find the area of a circle, given either the radius or the diameter.
**Recommended Question Types:** NUMERIC, MCQ, SPOT_ERROR/VALUE, SPOT_ERROR/STEP

**Difficulty Guidance:**

| Diff | Description for This Skill | Concrete Example |
|---|---|---|
| 1 | Radius is a positive integer; answer expressed to 2 d.p. or left in terms of π | r = 5 cm → A = 25π cm² ≈ 78.54 cm² |
| 2 | Diameter is given (integer); student must halve before applying formula | d = 14 m → r = 7 m → A ≈ 153.94 m² |
| 3 | Radius or diameter is a decimal or fraction | r = 3.5 cm → A ≈ 38.48 cm² |
| 4 | Area is given; student must rearrange to find radius or diameter | A = 50.27 cm² → r = √(50.27/π) ≈ 4 cm |

**Example Question Stem (Difficulty 1):** "A circular pond has a radius of 3 m. Calculate its area. Give your answer to 2 decimal places."

**Common Misconceptions:**
- **Using diameter instead of radius without halving** — when a problem states "diameter = 10 cm", students substitute 10 into the formula and compute π × 10² = 314.16 cm² instead of the correct π × 5² = 78.54 cm². This is a very high-frequency error. Diagrams that label the full diameter line visually reinforce this error.
- **Squaring π instead of r** — students compute (πr)² or π² × r rather than π × r². This may arise from ambiguous mental parsing of "πr²" — students read the squaring as applying to the whole of "πr".
- **Confusing the formula for circumference (C = 2πr or πd) with area (A = πr²)** — students retrieve the wrong formula, especially if both formulas were introduced in quick succession.
- **Not squaring r at all** — students compute π × r, treating the formula as A = πr (linear). This produces an answer with the right units only if π is ignored, which further masks the error.
- **Rounding π prematurely** — students use π ≈ 3 or π ≈ 3.1 rather than the full calculator value, leading to answers that differ from the expected value by enough to be marked wrong.

---

### Level 6: Select and Apply the Correct Area Formula

**Tier:** Simple Skill
**Single Skill Tested:** Given a labelled 2D shape (with no context), identify its type and apply the correct area formula without being told which formula to use.
**Recommended Question Types:** NUMERIC, MCQ, SPOT_ERROR/VALUE

**Difficulty Guidance:**

| Diff | Description for This Skill | Concrete Example |
|---|---|---|
| 1 | Standard orientation shapes with integer dimensions; shape type is unambiguous | A clearly drawn triangle with b = 6, h = 4 labelled → choose A = ½bh → A = 12 |
| 2 | Shapes with decimal dimensions; may include a distractor measurement | Parallelogram with b = 5.5, h = 3.2, slant = 4.1 → A = 17.6 |
| 3 | Shapes with fractional dimensions | Circle with r = ¾ cm → A = 9π/16 cm² |
| 4 | Non-standard orientation (e.g. triangle with vertex pointing left; parallelogram leaning sharply); student must correctly identify both shape type and perpendicular height | Obtuse triangle with external height dashed; student selects formula and identifies correct h |

**Example Question Stem (Difficulty 1):** "Find the area of the shape shown." [Diagram shows a parallelogram with b = 9 cm, h = 4 cm, slant = 5 cm labelled]

**Common Misconceptions:**
- **Formula substitution without shape identification** — students apply the most recently learned formula regardless of the shape shown. This is especially common when multiple shapes are tested in the same worksheet.
- **Treating all quadrilaterals as rectangles** — students apply A = l × w to parallelograms or trapezoids without considering whether the formula is appropriate.

---

### Level 7: Area of a Compound Shape (Addition)

**Tier:** Complex Skill
**Single Skill Tested:** Partition a compound shape into non-overlapping standard shapes, calculate each area separately, and sum them to find the total area.
**Recommended Question Types:** NUMERIC, SPOT_ERROR/STEP, EXPLANATION

**Difficulty Guidance:**

| Diff | Description for This Skill | Concrete Example |
|---|---|---|
| 1 | Two non-overlapping rectangles joined together; all dimensions labelled; integer values | An L-shaped figure made of two rectangles; all six side lengths labelled as integers |
| 2 | Rectangle and triangle combined, or rectangle and semicircle; decimal dimensions | A house-shaped figure (rectangle base + triangle roof); dimensions to 1 d.p. |
| 3 | Three or more component shapes; some dimensions must be inferred from given information (e.g. total width minus partial width); fractional values | An irregular shape requiring the student to subtract a known partial length from a total to find a missing dimension |
| 4 | Compound shape where the partition is not visually obvious; student must decide how to decompose it; dimensions include surds or mixed types | A shape that could be split in multiple ways; student chooses the most efficient decomposition |

**Example Question Stem (Difficulty 1):** "The shape below is made from two rectangles. Find the total area." [L-shaped figure; all dimensions labelled as integers]

**Common Misconceptions:**
- **Overlapping the partitioned regions** — students split the shape but double-count a shared strip, arriving at an area larger than the actual shape. This is most common when the student draws the partition line through the middle of the figure and then includes the strip in both sub-shapes.
- **Using total outer dimensions for one of the sub-shapes** — when an L-shape has overall width 10 cm and a notch of width 4 cm, students sometimes use 10 cm as the width of the smaller rectangle rather than 10 − 6 = 4 cm. This requires the student to infer a missing dimension, which is its own sub-skill.
- **Forgetting to sum all component areas** — students calculate the first sub-area correctly but then forget to add the second, submitting a partial answer.
- **Not recognising that a curved edge implies a semicircle** — when a compound shape includes a semicircular end, students may treat it as a rectangular end, applying l × w across the curved section.
- **Incorrectly inferring missing dimensions** — when a dimension is not labelled and must be calculated from other given measurements, students frequently use the wrong subtraction (e.g. subtracting from the wrong total length).

---

### Level 8: Area of a Complex Shape (Subtraction / Cutout)

**Tier:** Complex Skill
**Single Skill Tested:** Calculate the area of a shape that contains a cutout or hole by subtracting the area of the removed region from the area of the outer shape.
**Recommended Question Types:** NUMERIC, SPOT_ERROR/STEP, EXPLANATION

**Difficulty Guidance:**

| Diff | Description for This Skill | Concrete Example |
|---|---|---|
| 1 | Rectangle with a rectangular hole; all dimensions labelled; integer values | A 10 × 8 cm rectangle with a 3 × 2 cm rectangular cutout → A = 80 − 6 = 74 cm² |
| 2 | Rectangle with a triangular or circular cutout; decimal dimensions | A 12.5 × 8 cm rectangle with a circular hole of radius 2 cm → A = 100 − 4π ≈ 87.43 cm² |
| 3 | Shape with fractional dimensions, or where the outer shape is itself non-rectangular (e.g. a parallelogram with a rectangular hole) | A parallelogram minus a triangular notch; fractional dimensions |
| 4 | Multiple cutouts; or the cutout shape's dimensions must be inferred; dimensions include surds or require multi-step inference | A frame shape (rectangle with centred rectangular hole) where only the frame width is given, not the hole dimensions directly |

**Example Question Stem (Difficulty 1):** "A rectangular piece of cardboard is 12 cm long and 8 cm wide. A rectangular hole 4 cm by 3 cm is cut from its centre. What is the remaining area?"

**Common Misconceptions:**
- **Adding instead of subtracting the cutout area** — students compute outer area + cutout area. This may reflect confusion about whether the cutout "adds" to the shape visually, or may be a pure formula-retrieval error (confusing this with the compound addition method).
- **Using the wrong shape formula for the cutout** — when the cutout is circular, students sometimes use circumference rather than area, or misidentify the cutout as a different shape.
- **Treating the full outer rectangle dimensions as available for the cutout** — when the cutout's dimensions must be inferred (e.g. from a labelled border width), students use the total outer dimensions as the cutout dimensions, resulting in a cutout area equal to or nearly equal to the outer area.
- **Forgetting to square the radius when the cutout is circular** — the same Level 5 misconception applies here: students compute π × r rather than π × r².
- **Not recognising the problem as a subtraction problem** — students see an irregular shape and try to partition it into additive components (compound method) rather than recognising the faster subtraction approach. While not always wrong, this creates significant complexity and error risk.

---

### Level 9: Area Problems in Context (Single Shape)

**Tier:** Context Problem
**Single Skill Tested:** Apply a single area formula within a real-world context, interpreting the problem to identify the relevant shape, dimensions, and required unit.
**Recommended Question Types:** NUMERIC, EXPLANATION

**Difficulty Guidance:**

| Diff | Description for This Skill | Concrete Example |
|---|---|---|
| 1 | Integer dimensions; context directly names the shape and gives all needed measurements | "A rectangular rugby field is 100 m long and 68 m wide. What is its area?" |
| 2 | Decimal dimensions; student must interpret which measurements are relevant | "A circular kiwifruit orchard has a diameter of 45.6 m. What is the area available for planting?" |
| 3 | Fractional dimensions or a rate applied to the area (e.g. cost per m²) | "Grass seed costs $4.50 per m². A triangular lawn has b = 12.5 m and h = 8.4 m. Find the cost to seed the lawn." |
| 4 | Multi-step problem: area must be found, then used in a further calculation (e.g. number of tiles, cost, litres of paint) | "Tiles are 30 cm × 30 cm. A rectangular floor is 4.5 m × 3.6 m. How many tiles are needed? Allow 10% extra for cuts." |

**Example Question Stem (Difficulty 1):** "A school basketball court is rectangular, 28 m long and 15 m wide. What is the area of the court?"

**Common Misconceptions:**
- **Selecting the wrong shape formula because the context description is ambiguous** — a "diamond" shape in a NZ sports context (e.g. a baseball field) might be interpreted as a square rather than a rotated square (rhombus). Students need practice translating real-world descriptions into geometric shapes.
- **Using perimeter instead of area** — when the problem mentions "fencing" or "edging", students may correctly compute the perimeter but when asked for the area, still reach for the perimeter method, especially if both concepts appear in the same task.
- **Not converting units before applying the formula in a rate problem** — when dimensions are in metres but the cost is per cm², students fail to convert, resulting in answers off by a factor of 10 000.
- **Rounding intermediate results and accumulating error** — students round the area to a whole number before multiplying by a rate, producing an inaccurate final answer.

---

### Level 10: Area Problems in Context (Compound or Complex Shapes)

**Tier:** Context Problem
**Single Skill Tested:** Solve a multi-shape real-world area problem by combining the compound (addition) or complex (subtraction) method with contextual interpretation of dimensions and units.
**Recommended Question Types:** NUMERIC, EXPLANATION

**Difficulty Guidance:**

| Diff | Description for This Skill | Concrete Example |
|---|---|---|
| 1 | Two-shape compound context with integer dimensions; all measurements given | "A garden is made of a rectangle and a semicircle. Find its total area." [All dims integer] |
| 2 | Cutout context with decimal dimensions; real-world reason for the hole (e.g. window in a wall) | "A rectangular wall is 5.4 m × 3.2 m. A rectangular window 1.2 m × 0.9 m is cut in it. Find the area to be painted." |
| 3 | Rate applied to a compound or complex area; dimensions include fractions or require conversion | "Carpet costs $38.50 per m². A room has an L-shaped floor. Find the cost to carpet it." |
| 4 | Missing dimensions must be inferred; multiple shapes; answer drives a further real-world decision | "A school wants to paint the walls of a hall (excluding windows and doors). Find the total area to be painted and estimate the number of 4-litre paint tins needed (1 litre covers 12 m²)." |

**Example Question Stem (Difficulty 1):** "A school logo is made of a rectangle 8 cm × 5 cm with a triangle on top (base 8 cm, height 3 cm). Find the total area of the logo."

**Common Misconceptions:**
- **All misconceptions from Levels 7 and 8 apply here**, now compounded by the need to interpret the context correctly.
- **Misidentifying which shape is the "outer" shape and which is the "cutout"** — in complex context problems (e.g. a frame, a window in a wall), students occasionally subtract the larger area from the smaller, producing a negative result which they then treat as positive.
- **Including irrelevant measurements from the context** — real-world problems often include numbers that are not needed for the area calculation (e.g. cost per unit, number of items). Students with weak reading comprehension may substitute these into the area formula.
- **Not converting units in a rate calculation** — as at Level 9, unit mismatch between area units and rate units is a high-frequency error in context problems.

---

### Level 11: Extension — Area of a Sector

**Tier:** Complex Skill (Extension)
**Single Skill Tested:** Apply the formula A = (θ/360) × πr² to find the area of a sector, given the radius and the central angle.
**Recommended Question Types:** NUMERIC, MCQ, SPOT_ERROR/VALUE, SPOT_ERROR/STEP

**Difficulty Guidance:**

| Diff | Description for This Skill | Concrete Example |
|---|---|---|
| 1 | Integer radius; common angle (90°, 180°, 270°); answer to 2 d.p. | r = 6 cm, θ = 90° → A = (90/360) × π × 36 = 9π ≈ 28.27 cm² |
| 2 | Integer radius; non-standard angle (e.g. 120°, 150°, 240°) | r = 10 m, θ = 120° → A = (120/360) × π × 100 ≈ 104.72 m² |
| 3 | Decimal radius; any angle | r = 4.5 cm, θ = 135° → A ≈ 23.76 cm² |
| 4 | Area or angle is given; student rearranges to find the missing value | A = 50 cm², r = 8 cm → find θ: θ = (A × 360) / (π × r²) ≈ 35.8° |

**Example Question Stem (Difficulty 1):** "A slice of pizza is a sector of a circle with radius 15 cm and a central angle of 45°. What is the area of the slice? Give your answer to 2 decimal places."

**Common Misconceptions:**
- **Using the full circle formula without applying the fraction** — students compute πr² and forget to multiply by (θ/360), as if the sector were a full circle.
- **Using degrees/360 inverted** — students compute (360/θ) × πr² rather than (θ/360) × πr², multiplying by a number greater than 1 and getting an area larger than the full circle.
- **Confusing sector area with arc length** — students apply the arc length formula L = (θ/360) × 2πr rather than the area formula, perhaps confusing the two because both involve the same θ/360 fraction.
- **Not squaring r** — the same error as in Level 5: computing π × r rather than π × r² inside the sector formula.

---

## 4. Context Themes

Real-world scenarios suitable for context problems at the higher skill levels.
NZ-relevant scenarios preferred. Each theme should suggest a genuine application of the topic.

| Theme | Example Scenario |
|---|---|
| Rugby and sports fields | Calculating the area of a rectangular rugby field, a circular centre circle, or a triangular in-goal zone; comparing field sizes across sports |
| Kiwifruit and horticulture | Finding the planting area of a rectangular or circular orchard block; calculating how many trees fit in a given area at a specified spacing |
| Building and construction | Calculating the wall area of a room (rectangle minus window and door cutouts) to find how much paint or cladding is needed; flooring area for tiling |
| Māori design patterns (kōwhaiwhai) | Area of repeating geometric panels (triangles and parallelograms) used in kōwhaiwhai border design on meeting house walls or ceilings |
| Coastal and marine navigation | Estimating the area of a marine reserve (circular or compound shape) from a map; calculating the area of a triangular sail |
| Gardening and landscaping | Finding the area of an L-shaped garden bed; subtracting a circular pond from a rectangular lawn to find the grassed area remaining |
| School and community spaces | Calculating the area of a school mural (compound shape), a playground (rectangle minus equipment footprint), or a community garden plot |
| Online shopping and packaging | Finding the surface area of a flat cardboard blank before folding; calculating how much wrapping paper is needed for a rectangular gift |
| Pizza and food | A sector of pizza; comparing the area of different pizza sizes to determine best value per cm² |
| Solar panels and energy | Finding the area of a rectangular or trapezoidal roof section available for solar panels; calculating how many panels fit in the available area |

---

## 5. Curriculum / NCEA Alignment

**Strand:** Measurement and Geometry
**Achievement Objective:** Students will: use appropriate scales, devices, and metric units for length and area; find areas of rectangles, triangles, parallelograms, circles, and composite shapes (NZ Curriculum, Geometry and Measurement, AO: GM4-3 and GM5-2)

*This topic is assessed at Year 10 level as part of the NZ Curriculum and does not correspond to a specific NCEA Achievement Standard. NCEA grade criteria are not applicable.*

---

## 6. Generation Parameters

These values are passed directly to Prompt 2B.
Review and edit this section before passing to the code generator.

```
topic:                 Area of Shapes
year_group:            Year 10
ncea_level:            N/A
standard:              N/A
achievement_objective: Find areas of rectangles, triangles, parallelograms, circles, and composite shapes (GM4-3, GM5-2)
levels:                11
questions_per_level:   10
question_type_mix:     25% NUMERIC, 20% MCQ, 15% MATCH, 20% SPOT_ERROR, 15% EXPLANATION, 5% TEXT
include_reference:     Yes
include_svg:           Yes
```
