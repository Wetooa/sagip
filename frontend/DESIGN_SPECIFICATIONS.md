# SAGIP AI Alert System - Design Specifications

## Design Source
- **Figma File**: SAGIP-AI Design System 2026
- **Component**: Sistema ng Alerto — Tumataas na Kagyatan (Node ID: 3:5133)
- **Design Version**: January 22, 2026

## Visual Design

### Alert Card Container
- **Layout**: Horizontal flex with icon + content
- **Height**: 192-224px (varies by type)
- **Border Radius**: 16px
- **Padding**: 32px (top/bottom), 32px (sides)
- **Gap Between Cards**: 16px
- **Shadow**: 
  - Normal alerts: `0px 25px 50px -12px rgba(0,0,0,0.25)`
  - Critical alert: Enhanced shadow

### Color Specifications

#### Warning State (Abiso sa Panahon)
```
Gradient: from-[#8b0000] to-[#7a0000]
Hex: #8B0000 → #7A0000
Icon Background: rgba(255, 255, 255, 0.2)
Title Color: White
Description Color: rgba(250, 235, 215, 0.9)
Meta Color: rgba(250, 235, 215, 0.9)
```

#### Alert State (Signal No. 2)
```
Gradient: from-[#fe9a00] to-[#ff6900]
Hex: #FE9A00 → #FF6900
Icon Background: rgba(255, 255, 255, 0.2)
Title Color: White
Description Color: #FFFBEB
Meta Color: #FEF3C6
```

#### Critical State (Signal No. 4)
```
Gradient: from-[#e7000b] to-[#c10007]
Hex: #E7000B → #C10007
Icon Background: rgba(255, 255, 255, 0.3)
Title Color: White
Description Color: #FEF2F2
Meta Color: #FEF2F2
Box Shadow: Enhanced (shadow-2xl equivalent)
```

#### Safe State (Ligtas Na)
```
Gradient: from-[#00c950] to-[#00a345]
Hex: #00C950 → #009345
Icon Background: rgba(255, 255, 255, 0.2)
Title Color: White
Description Color: #F0FDF4
Meta Color: #DCFCE7
```

### Typography

#### Title (Heading 4)
- **Font**: Roboto Bold
- **Size**: 24px
- **Line Height**: 32px
- **Letter Spacing**: Normal
- **Color**: White
- **Font Variation**: 'wdth' 100

#### Description (Paragraph)
- **Font**: Roboto Regular (Medium for critical)
- **Size**: 16px
- **Line Height**: 26px
- **Letter Spacing**: Normal
- **Color**: Semi-transparent white (varies by alert type)
- **Font Variation**: 'wdth' 100

#### Meta Information (Time & Source)
- **Font**: Roboto Regular
- **Size**: 14px
- **Line Height**: 20px
- **Letter Spacing**: Normal
- **Color**: Light text (alert-type dependent)

### Icon Specification

#### Icon Container
- **Size**: 56x56px
- **Border Radius**: 16px
- **Background**: Semi-transparent white (opacity 0.2 or 0.3)
- **Content Alignment**: Center (flex items-center justify-center)

#### Icon Size
- **Inner Icon**: 28x28px
- **Stroke Width**: 2px
- **Color**: White

#### Icon Types
1. **Warning/Alert**: Shield with exclamation mark
2. **Critical**: Alert triangle
3. **Safe**: Shield with checkmark

### Action Buttons

#### Primary Button (White)
- **Background**: White
- **Text Color**: Alert color (#E7000B for critical)
- **Border**: None
- **Border Radius**: 24px
- **Padding**: 12px 24px (12.4px top/bottom, 28px+ sides)
- **Height**: 51.2px (52px)
- **Font**: Roboto Bold, 16px
- **Hover State**: bg-gray-100

#### Secondary Button (Transparent Border)
- **Background**: rgba(255, 255, 255, 0.2)
- **Border**: 1.6px solid white
- **Text Color**: White
- **Border Radius**: 24px (14px in some specs)
- **Padding**: Similar to primary
- **Height**: 51.2px (52px)
- **Font**: Roboto Bold, 16px
- **Hover State**: bg-[rgba(255,255,255,0.3)]

### Spacing & Layout

#### Gaps
- **Between icon and content**: 24px
- **Between content sections**: 8px (title to description), 8px (description to meta)
- **Between alerts**: 16px (4px margin per side)
- **Between meta items**: 16px (around bullet point)

#### Padding
- **Alert container**: 32px (all sides)
- **Icon container inner**: Centered flex

#### Border Radius
- **Alert cards**: 16px
- **Icon containers**: 16px
- **Action buttons**: 14px-24px

## Animation & Interactions

### Hover States
- **Buttons**: Slight background opacity change
- **Alert Cards**: Subtle elevation increase (optional)

### Transitions
- **Button Hover**: 150-200ms ease-in-out
- **None required for initial render** (direct state)

## Responsive Behavior

### Desktop (1104px content width)
- **Full width**: 100% within container
- **Icon size**: Remains 56x56px
- **Font sizes**: As specified above
- **Button layout**: Horizontal flex

### Mobile (320px-640px)
- **Width**: 100% of screen minus padding
- **Icon size**: Remains 56x56px
- **Typography**: Slight adjustment needed (16px → 14px for description)
- **Button layout**: Can stack vertically if needed
- **Padding**: Reduce to 16px-20px

## Accessibility

### Color Contrast
- White text on dark backgrounds: WCAG AAA compliant
- Light text on colored backgrounds: WCAG AA compliant

### Text
- Clear, direct titles (e.g., "LUMIKAS KAAGAD")
- Descriptive alert content
- Meaningful action button labels

### Structure
- Semantic HTML (divs with role attributes where needed)
- Proper heading hierarchy
- Icon + text combinations

## Usage Context

### Alert System Header
- **Title**: "Sistema ng Alerto — Tumataas na Kagyatan"
- **Font**: Roboto Bold, 24px
- **Color**: #4A0E0E (Burgundy 900)
- **Margin Bottom**: 24px
- **Line Height**: 32px

### Complete System Flow
1. **Header** (Title)
2. **Alert Cards** (Warning → Alert → Critical → Safe)
3. **Each Card Contains**:
   - Icon container
   - Title
   - Description paragraph
   - Meta info (duration + source)
   - Action buttons (if critical/important)

## Code-to-Design Mapping

| Design Element | Tailwind Class | Value |
|---|---|---|
| Warning gradient | `from-[#8b0000] to-[#7a0000]` | Red gradient |
| Alert gradient | `from-[#fe9a00] to-[#ff6900]` | Orange gradient |
| Critical gradient | `from-[#e7000b] to-[#c10007]` | Bright red gradient |
| Safe gradient | `from-[#00c950] to-[#00a345]` | Green gradient |
| Title text | `text-white text-2xl font-bold` | 24px white bold |
| Description | `text-base leading-relaxed` | 16px, relaxed line height |
| Icon container | `rounded-2xl p-4` | 16px border radius, 16px padding |
| Alert card | `rounded-2xl shadow-lg` | 16px radius, shadow |
| Primary button | `bg-white text-[#e7000b] rounded-2xl` | White bg, alert color text |
| Secondary button | `bg-[rgba(255,255,255,0.2)] border-2 border-white rounded-2xl` | Transparent bg, white border |

## PAGASA Signal Mapping

| PAGASA Signal | Alert Type | Color | Use Case |
|---|---|---|---|
| Abiso (Advisory) | warning | Red | 48+ hours notice |
| Signal No. 1 | warning | Red | 48+ hours to impact |
| Signal No. 2 | alert | Orange | 24-48 hours to impact |
| Signal No. 3 | alert | Orange | 12-24 hours to impact |
| Signal No. 4 | critical | Bright Red | 0-12 hours to impact |
| All Clear | safe | Green | Post-event |

## Implementation Checklist

✅ Color gradients implemented
✅ Typography specifications met
✅ Spacing and layout correct
✅ Button styles and interactions
✅ Icon system integrated
✅ Responsive design
✅ Accessibility considerations
✅ TypeScript types defined
✅ Demo component created
✅ Documentation provided

## Design System References

This alert system is part of the larger SAGIP AI design system which includes:
- Branding guidelines
- Color palette (burgundy, red, orange, green, cream)
- Typography system (Roboto)
- Icon library (18+ icons)
- Component library
- Mobile responsive patterns
- Disaster timeline states
- Recovery resource patterns
