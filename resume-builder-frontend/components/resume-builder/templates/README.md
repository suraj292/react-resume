# Resume Builder Templates

This directory contains 22 professional resume templates, each with a unique design style and layout.

## Template List

### Original Templates (4)
1. **AcademicTemplate** - Academic-focused template
2. **CreativeTemplate** - Creative and artistic design
3. **MinimalTemplate** - Clean and minimal layout
4. **ModernTemplate** - Modern professional design with social media links

### New Templates (18)

#### Executive & Professional
5. **ExecutiveTemplate** - Elegant sidebar layout with serif fonts, perfect for senior-level positions
6. **ProfessionalTemplate** - Clean professional template with accent bars and balanced layout
7. **ClassicTemplate** - Traditional template with serif fonts and formal styling

#### Modern & Tech
8. **TechTemplate** - Tech-focused with monospace fonts and code-like styling
9. **GradientTemplate** - Modern gradient header with rounded corners and vibrant colors
10. **InfographicTemplate** - Visual template with icons, cards, and timeline elements

#### Minimalist & Clean
11. **SwissTemplate** - Swiss-style minimalist with clean typography and grid layout
12. **ElegantTemplate** - Centered elegant template with decorative dividers
13. **VerticalTemplate** - Consistent left accent stripe for all sections

#### Structured & Organized
14. **TimelineTemplate** - Timeline-based with visual chronological flow
15. **SplitTemplate** - Two-column split with contact/skills/education on left
16. **ColumnarTemplate** - Three-column newspaper-style for maximum density
17. **BoxedTemplate** - Bordered sections with rounded corners and card layout

#### Bold & Colorful
18. **BoldTemplate** - Full-width colored header with strong typography
19. **ColorBlockTemplate** - Full-height colored sidebar with white content area
20. **StripedTemplate** - Alternating background colors with full-width headers
21. **BorderedTemplate** - Decorative frames with centered elements
22. **CompactTemplate** - Ultra-compact for maximum content density

## Template Features

All templates include:
- ✅ Editable content (contentEditable)
- ✅ Personal information section
- ✅ Professional summary
- ✅ Work experience
- ✅ Education
- ✅ Skills
- ✅ Social media links (where applicable)
- ✅ Customizable accent colors
- ✅ Print-friendly layouts
- ✅ Page break handling

## Design Styles

- **Executive/Professional**: ExecutiveTemplate, ProfessionalTemplate, ClassicTemplate
- **Tech/Developer**: TechTemplate, InfographicTemplate
- **Modern/Creative**: GradientTemplate, BoldTemplate, ColorBlockTemplate
- **Minimalist**: SwissTemplate, ElegantTemplate, MinimalTemplate, VerticalTemplate
- **Structured**: TimelineTemplate, SplitTemplate, ColumnarTemplate, BoxedTemplate
- **Compact**: CompactTemplate, ColumnarTemplate
- **Decorative**: BorderedTemplate, StripedTemplate, BoxedTemplate

## Usage

Each template exports a function component that accepts the following props:
- `personal`: PersonalInfo
- `social`: SocialMedia (optional)
- `summary`: string (optional)
- `experience`: Experience[]
- `education`: Education[]
- `skills`: string[]
- `accentColor`: string
- Event handlers for updating content

## Color Customization

All templates support dynamic accent color customization through the `accentColor` prop, which affects:
- Headers and titles
- Borders and dividers
- Skill tags and badges
- Section highlights
- Links and interactive elements
