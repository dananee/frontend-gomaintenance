# 🎨 CMMS Design System - Typography & Style Guide

## Typography Scale

### Page Titles

```tsx
className = "text-3xl font-bold text-gray-900 dark:text-white";
```

**Usage:** Main page headings (Dashboard, Vehicles, etc.)

### Section Headers

```tsx
className = "text-xl font-semibold mb-4";
```

**Usage:** Section titles (Performance Metrics, Analytics, etc.)

### Card Titles

```tsx
className = "text-xl font-semibold";
```

**Usage:** Card header titles

### KPI Values

```tsx
className = "text-3xl font-bold";
```

**Usage:** Primary metric values in KPI cards

### Large Values

```tsx
className = "text-2xl font-bold";
```

**Usage:** Secondary metric values

### Labels

```tsx
className =
  "text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400";
```

**Usage:** Field labels, category tags

### Subtitles

```tsx
className = "text-sm text-gray-600 dark:text-gray-400";
```

**Usage:** Descriptive text below values

### Body Text

```tsx
className = "text-sm text-gray-700 dark:text-gray-300";
```

**Usage:** Regular content text

---

## Color System

### Gradient Schemes

#### Financial (Purple/Blue)

```tsx
bg-gradient-to-br from-purple-50 via-blue-50/30 to-purple-100/50
border-purple-200 dark:border-purple-800
text-purple-600 dark:text-purple-400
```

#### Performance (Green/Blue)

```tsx
bg-gradient-to-br from-green-50 via-blue-50/30 to-green-100/50
border-green-200 dark:border-green-800
text-green-600 dark:text-green-400
```

#### Risk (Orange/Red)

```tsx
bg-gradient-to-br from-orange-50 via-red-50/30 to-orange-100/50
border-orange-200 dark:border-orange-800
text-orange-600 dark:text-orange-400
```

#### Availability (Cyan/Blue)

```tsx
bg-gradient-to-br from-cyan-50 via-blue-50/30 to-cyan-100/50
border-cyan-200 dark:border-cyan-800
text-cyan-600 dark:text-cyan-400
```

---

## Spacing Standards

### Container Padding

```tsx
className = "p-6"; // Main containers
className = "p-4"; // Card content
className = "px-6 py-4"; // Headers
```

### Grid Gaps

```tsx
className = "gap-6"; // Primary grids
className = "gap-4"; // Secondary grids
className = "gap-3"; // Tight grids
className = "gap-2"; // Compact elements
```

### Margins

```tsx
className = "mb-4"; // Section spacing
className = "mb-2"; // Element spacing
className = "mt-1"; // Tight spacing
```

---

## Component Standards

### KPI Cards

```tsx
<Card className="min-h-[125px] shadow-md bg-gradient-to-br ${gradient}
                 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
```

### Tables

```tsx
// Header
<TableRow className="bg-gray-50 dark:bg-gray-800/50">
  <TableHead className="font-semibold">Column Name</TableHead>
</TableRow>

// Rows (with zebra striping)
<TableRow className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30">
  <TableCell className="font-medium">Data</TableCell>
</TableRow>
```

### Buttons

```tsx
// Primary
<Button className="gap-2">
  <Icon className="h-4 w-4" />
  Button Text
</Button>

// Ghost
<Button variant="ghost" size="sm">Action</Button>

// Outline
<Button variant="outline" size="sm">Secondary</Button>
```

### Icons

```tsx
// Small (table, inline)
<Icon className="h-4 w-4" />

// Medium (headers)
<Icon className="h-5 w-5" />

// Large (feature highlights)
<Icon className="h-6 w-6" />

// Extra large (KPI cards)
<Icon className="h-10 w-10" />
```

---

## Animation Standards

### Transitions

```tsx
// Standard
transition-all duration-300

// Quick
transition-colors duration-200

// Smooth
transition-all duration-500

// Charts
transition-all duration-1000
```

### Hover Effects

```tsx
// Cards
hover:shadow-lg hover:scale-[1.01]

// Tables
hover:bg-gray-50 dark:hover:bg-gray-800/30

// Buttons
hover:bg-gray-100 dark:hover:bg-gray-800

// Links
hover:underline
```

---

## Border Radius

```tsx
rounded - xl; // Cards, containers (12px)
rounded - lg; // Inner elements (8px)
rounded - md; // Inputs, buttons (6px)
rounded - full; // Pills, badges, avatars
```

---

## Shadow System

```tsx
shadow - sm; // Subtle depth
shadow - md; // Standard cards (default)
shadow - lg; // Hover state
shadow - xl; // Modal, popover
```

---

## Status Colors

### Success

```tsx
bg-green-50 dark:bg-green-900/20
text-green-600 dark:text-green-400
border-green-200 dark:border-green-700
```

### Warning

```tsx
bg-yellow-50 dark:bg-yellow-900/20
text-yellow-600 dark:text-yellow-400
border-yellow-200 dark:border-yellow-700
```

### Error

```tsx
bg-red-50 dark:bg-red-900/20
text-red-600 dark:text-red-400
border-red-200 dark:border-red-700
```

### Info

```tsx
bg-blue-50 dark:bg-blue-900/20
text-blue-600 dark:text-blue-400
border-blue-200 dark:border-blue-700
```

---

## Responsive Grid Patterns

### KPI Cards

```tsx
grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

### Dashboard KPIs

```tsx
grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5
```

### Charts

```tsx
grid gap-6 md:grid-cols-2 lg:grid-cols-3
```

### Stats Grid

```tsx
grid gap-6 md:grid-cols-2 lg:grid-cols-4
```

---

## Best Practices

### ✅ DO:

- Use semantic HTML elements
- Apply consistent spacing (p-6, gap-6)
- Use min-h-[125px] for KPI cards
- Add hover states to interactive elements
- Use gradients for category differentiation
- Include dark mode variants
- Add smooth transitions (200-300ms)
- Use proper icon sizes
- Apply zebra striping to tables
- Include loading states

### ❌ DON'T:

- Mix spacing values (stick to 2, 3, 4, 6)
- Use random colors (follow color system)
- Skip hover effects on clickable elements
- Forget dark mode classes
- Use inconsistent font sizes
- Skip accessibility attributes
- Use px values (use Tailwind scale)
- Mix gradient patterns
- Forget responsive breakpoints
- Skip transition animations

---

## Component Checklist

When creating new components, ensure:

- [ ] Typography follows scale (text-3xl, text-xl, text-sm)
- [ ] Colors match category (Financial=Purple, Performance=Green, etc.)
- [ ] Spacing is consistent (p-6, gap-6, mb-4)
- [ ] Dark mode is supported
- [ ] Hover states are present
- [ ] Transitions are smooth (200-300ms)
- [ ] Icons are properly sized
- [ ] Borders use rounded-xl
- [ ] Shadows use shadow-md
- [ ] Responsive design is applied

---

## Example: Perfect KPI Card

```tsx
<Card
  className="min-h-[125px] border border-blue-200 dark:border-blue-800 
                 bg-gradient-to-br from-blue-50 via-blue-50/50 to-transparent 
                 dark:from-blue-900/20 dark:via-blue-900/10 dark:to-transparent 
                 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
      KPI Title
    </CardTitle>
    <div
      className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2 
                    transition-colors group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50"
    >
      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
    </div>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
      $1,250
    </div>
    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
      Subtitle text
    </p>
  </CardContent>
</Card>
```

---

## Maintenance

This design system should be:

- Referenced when creating new components
- Updated when adding new patterns
- Reviewed quarterly for consistency
- Enforced through code reviews
- Used for onboarding new developers

---

**Version:** 1.0  
**Last Updated:** December 2025  
**Status:** Production-ready ✅
