# Spurious Correlations Chart Generator

A delightful web application that generates amusing fake correlations between real-world statistics, presented with academic-style citations to highlight how misleading statistics can be.

**Experience Qualities**: 
1. **Humorous** - Users should chuckle at the absurd connections between unrelated data points
2. **Educational** - Demonstrates how correlation doesn't imply causation through obvious examples
3. **Polished** - Professional presentation makes the joke more effective and memorable

**Complexity Level**: Light Application (multiple features with basic state)
- Generates random correlations, displays interactive charts, includes data persistence for favorites

## Essential Features

**Random Correlation Generator**
- Functionality: Combines two unrelated datasets to create a fake correlation with realistic-looking statistics
- Purpose: Entertainment and education about statistical misinterpretation
- Trigger: Page load and "Generate New Correlation" button
- Progression: Click button → Algorithm selects two random datasets → Chart renders with correlation coefficient → Citation appears below
- Success criteria: Users can generate multiple correlations and each feels plausibly ridiculous

**Interactive Chart Display**
- Functionality: Shows dual-axis line chart with correlation coefficient and R-squared value
- Purpose: Makes the fake correlation look scientifically credible
- Trigger: After correlation generation
- Progression: Data loads → Chart animates in → Hover shows data points → Correlation stats display
- Success criteria: Charts look professional and data points align convincingly

**Favorites System**
- Functionality: Users can save their favorite correlations to view later
- Purpose: Encourages exploration and sharing of the best combinations
- Trigger: Heart icon click on any correlation
- Progression: Click heart → Correlation saves to favorites list → Heart fills red → Access via favorites tab
- Success criteria: Favorites persist between sessions and can be removed

**Citation Generator**
- Functionality: Creates realistic academic-style citations for each correlation
- Purpose: Adds credibility humor and teaches about source verification
- Trigger: Automatically appears with each correlation
- Progression: Correlation generates → Citation appears → Includes fake journal names and years → Copy button available
- Success criteria: Citations look academic but are obviously fabricated upon inspection

## Edge Case Handling

- **No Favorites Yet**: Show encouraging empty state with "Generate correlations to save your favorites!"
- **Data Loading Errors**: Graceful fallback with pre-loaded dataset if generation fails
- **Mobile Responsiveness**: Charts resize appropriately and remain readable on small screens
- **Rapid Clicking**: Debounce generation button to prevent API overload or duplicate requests

## Design Direction

The design should feel academically credible at first glance but reveal its playful nature through subtle humor and polished interactions - balancing scientific legitimacy with obvious absurdity to maximize the educational impact.

## Color Selection

Complementary (opposite colors) - Using academic blue-orange pairing to suggest scientific credibility while maintaining warmth and approachability.

- **Primary Color**: Academic Blue (oklch(0.45 0.15 240)) - Communicates scientific authority and trustworthiness
- **Secondary Colors**: Neutral grays (oklch(0.95 0.02 240) backgrounds) for clean, academic presentation
- **Accent Color**: Warning Orange (oklch(0.65 0.18 45)) - Highlights interactive elements and favorite indicators
- **Foreground/Background Pairings**: 
  - Background White (oklch(1 0 0)): Dark Blue text (oklch(0.25 0.08 240)) - Ratio 8.2:1 ✓
  - Primary Blue (oklch(0.45 0.15 240)): White text (oklch(1 0 0)) - Ratio 4.8:1 ✓
  - Accent Orange (oklch(0.65 0.18 45)): White text (oklch(1 0 0)) - Ratio 4.1:1 ✓
  - Card Light Gray (oklch(0.98 0.01 240)): Dark Blue text (oklch(0.25 0.08 240)) - Ratio 7.9:1 ✓

## Font Selection

Clean, academic typography that suggests scientific papers while remaining highly readable - using Inter for its neutrality and excellent legibility at all sizes.

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter Bold/32px/tight letter spacing
  - H2 (Correlation Title): Inter Semibold/24px/normal spacing  
  - H3 (Chart Labels): Inter Medium/16px/wide letter spacing
  - Body (Citations): Inter Regular/14px/normal leading
  - Caption (Stats): Inter Regular/12px/loose leading

## Animations

Subtle, purposeful motion that reinforces the scientific theme while adding moments of delight during discovery - emphasizing data visualization conventions.

- **Purposeful Meaning**: Chart animations follow data visualization patterns users expect from scientific presentations
- **Hierarchy of Movement**: Chart data animates in first, followed by correlation statistics, then citation details

## Component Selection

- **Components**: Cards for correlation display, Tabs for favorites/generator sections, Button with loading states, Badge for correlation coefficients, Tooltip for chart data points
- **Customizations**: Custom chart component using Recharts with dual Y-axes and custom styling to match academic papers
- **States**: Generate button shows loading spinner, favorite hearts fill/empty with micro-animations, chart hover states highlight data points
- **Icon Selection**: Heart (favorites), RefreshCw (generate), Copy (citations), TrendingUp (correlations), BookOpen (academic theme)
- **Spacing**: Generous padding (p-6) on cards, consistent gap-4 between sections, tight spacing on statistical displays
- **Mobile**: Cards stack vertically, chart maintains aspect ratio, tabs become horizontal scroll on narrow screens with touch-friendly targets