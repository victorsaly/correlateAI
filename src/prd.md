# Spurious Correlations Generator - Product Requirements Document

## Core Purpose & Success
- **Mission Statement**: Generate amusing fake correlations between real-world statistics to educate users about the difference between correlation and causation.
- **Success Indicators**: Users generate multiple correlations, save favorites, and share interesting findings while understanding the educational message.
- **Experience Qualities**: Educational, Entertaining, Insightful

## Project Classification & Approach
- **Complexity Level**: Light Application (multiple features with basic state management)
- **Primary User Activity**: Interacting - users actively generate, explore, and save correlations

## Thought Process for Feature Selection
- **Core Problem Analysis**: People often confuse correlation with causation. This tool demonstrates how unrelated variables can show statistical relationships.
- **User Context**: Users will engage during curiosity-driven browsing sessions, looking for interesting or humorous statistical relationships.
- **Critical Path**: Generate correlation → View chart and statistics → Understand the spurious nature → Save interesting ones
- **Key Moments**: 
  1. First correlation generation - the "aha" moment of seeing an amusing relationship
  2. Discovering themed categories - finding correlations in specific domains of interest
  3. Building a collection of favorites - creating personal value from the tool

## Essential Features

### Core Features
- **Correlation Generation**: Creates realistic-looking but spurious correlations between various datasets
  - Purpose: Main entertainment and educational value
  - Success criteria: Generates visually convincing charts with proper statistical measures

- **Themed Categories**: Organize datasets into categories (Food, Technology, Weather, Social, Health, Transportation, Economics)
  - Purpose: Allow users to explore specific domains and find more relevant correlations
  - Success criteria: Each category contains diverse, interesting datasets that generate meaningful correlations

- **Data Visualization**: Interactive line charts showing the relationship between two variables
  - Purpose: Make correlations visually compelling and easy to understand
  - Success criteria: Charts are clear, properly labeled, and show correlation strength

- **Favorites System**: Users can save correlations they find interesting or amusing
  - Purpose: Build personal value and allow users to return to interesting findings
  - Success criteria: Persistent storage across sessions, easy to add/remove favorites

- **Academic Citations**: Each correlation includes fake but realistic academic citations
  - Purpose: Parody real research while emphasizing the fictional nature
  - Success criteria: Citations look authentic but are clearly satirical

## Design Direction

### Visual Tone & Identity
- **Emotional Response**: Users should feel curious, amused, and slightly skeptical - understanding this is educational entertainment
- **Design Personality**: Professional yet playful - like a legitimate research tool with tongue-in-cheek humor
- **Visual Metaphors**: Academic research papers, statistical reports, data dashboards
- **Simplicity Spectrum**: Clean and minimal to focus attention on the data visualizations

### Color Strategy
- **Color Scheme Type**: Analogous with professional blue tones
- **Primary Color**: Deep blue (oklch(0.45 0.15 240)) - conveys trust and professionalism
- **Secondary Colors**: Light blues and grays for subtle backgrounds and supporting elements
- **Accent Color**: Warm orange (oklch(0.65 0.18 45)) for highlights and important actions
- **Color Psychology**: Blue suggests reliability and data analysis, while orange adds warmth and approachability
- **Color Accessibility**: All pairings exceed WCAG AA contrast ratios (4.5:1)
- **Foreground/Background Pairings**: 
  - Background: White (oklch(1 0 0)) with dark blue text (oklch(0.25 0.08 240))
  - Primary: Deep blue (oklch(0.45 0.15 240)) with white text
  - Card: Off-white (oklch(0.98 0.01 240)) with dark blue text
  - Accent: Orange (oklch(0.65 0.18 45)) with white text

### Typography System
- **Font Pairing Strategy**: Single font family (Inter) with varied weights for hierarchy
- **Typographic Hierarchy**: Clear distinction between headers, body text, and statistical labels
- **Font Personality**: Inter conveys modern professionalism and excellent readability for data
- **Readability Focus**: 1.5 line height for body text, generous spacing around statistical elements
- **Typography Consistency**: Consistent sizing scale using mathematical relationships
- **Which fonts**: Inter from Google Fonts - excellent for data-heavy interfaces
- **Legibility Check**: Inter is highly legible at all sizes and weights used

### Visual Hierarchy & Layout
- **Attention Direction**: Charts are the primary focus, with supporting information arranged around them
- **White Space Philosophy**: Generous spacing prevents cognitive overload when viewing statistical information
- **Grid System**: Card-based layout with consistent spacing using Tailwind's spacing scale
- **Responsive Approach**: Single-column on mobile, side-by-side controls on desktop
- **Content Density**: Balanced - enough information to be educational without overwhelming

### Animations
- **Purposeful Meaning**: Subtle animations reinforce the "data analysis" theme and provide feedback
- **Hierarchy of Movement**: Loading states during generation, smooth transitions between correlations
- **Contextual Appropriateness**: Professional, data-focused animations that don't distract from content

### UI Elements & Component Selection
- **Component Usage**: 
  - Cards for correlation display - creates clear boundaries around each dataset
  - Tabs for navigation between generator and favorites
  - Select dropdown for category filtering - allows precise control
  - Badges for statistical measures - highlights key numerical information
  - Buttons with clear action-oriented labels

- **Component Customization**: Standard shadcn styling with slight radius adjustments (0.625rem) for modern feel
- **Component States**: Clear hover and focus states for all interactive elements
- **Icon Selection**: Phosphor icons for consistency - trend icons for charts, heart for favorites, filter for categories
- **Component Hierarchy**: Primary actions (Generate) are prominent, secondary actions (Save, Copy) are subtle but accessible
- **Spacing System**: Consistent 4, 6, 8px spacing using Tailwind classes
- **Mobile Adaptation**: Stack controls vertically on small screens, maintain chart readability

### Visual Consistency Framework
- **Design System Approach**: Component-based using shadcn for consistency
- **Style Guide Elements**: Consistent color usage, typography scale, spacing system
- **Visual Rhythm**: Regular spacing patterns create predictable, scannable interfaces
- **Brand Alignment**: Professional data tool aesthetic with educational undertones

### Accessibility & Readability
- **Contrast Goal**: WCAG AA compliance (4.5:1 minimum) achieved across all text and interface elements
- **Interactive Elements**: Minimum 44px touch targets, clear focus indicators
- **Color Independence**: Information conveyed through text labels as well as colors
- **Screen Reader Support**: Proper semantic HTML structure, descriptive button labels

## Edge Cases & Problem Scenarios
- **Potential Obstacles**: Users might take correlations seriously despite disclaimers
- **Edge Case Handling**: Clear educational messaging throughout, obviously satirical journal names
- **Technical Constraints**: Chart rendering performance with multiple datasets

## Implementation Considerations
- **Scalability Needs**: Dataset expansion, additional correlation types, sharing features
- **Testing Focus**: Correlation algorithm accuracy, chart rendering, category filtering
- **Critical Questions**: Are correlations convincing but obviously fictional? Do users understand the educational purpose?

## Reflection
This approach uniquely combines entertainment with education, using humor and professional presentation to teach an important statistical concept. The themed categories make the tool more engaging while maintaining educational value. The solution is exceptional because it makes learning about statistical fallacies genuinely enjoyable.