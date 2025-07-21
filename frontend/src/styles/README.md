# Responsive Design System

This directory contains the responsive design system for the Teacher Attendance Frontend application. The system follows a mobile-first approach with breakpoints at:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## Files

- `responsive.css`: Contains the core responsive utilities including grid system, flexbox utilities, responsive spacing, and typography.
- `mobile.css`: Contains mobile-specific styles and components like drawer navigation, bottom navigation, and touch-friendly elements.

## Usage

### Responsive Grid

```jsx
<div className="grid">
  <div className="col-12 col-md-6 col-lg-4">Column 1</div>
  <div className="col-12 col-md-6 col-lg-4">Column 2</div>
  <div className="col-12 col-md-6 col-lg-4">Column 3</div>
</div>
```

### Responsive Display

```jsx
<div className="hidden-sm block-md">Only visible on tablet and desktop</div>
<div className="block hidden-md">Only visible on mobile</div>
```

### Responsive Components

```jsx
import { ResponsiveLayout, Mobile, Desktop } from '../components/layout';

// Using the component
<ResponsiveLayout
  mobile={<MobileView />}
  desktop={<DesktopView />}
/>

// Or using the render props
<Mobile>
  <MobileSpecificContent />
</Mobile>

<Desktop>
  <DesktopSpecificContent />
</Desktop>
```

### Responsive Tables

```jsx
import { ResponsiveTable } from '../components/common';

<ResponsiveTable
  columns={columns}
  data={data}
  variant="stack" // Options: responsive, stack, cards
/>
```

### Responsive Modals

```jsx
import { ResponsiveModal } from '../components/common';

<ResponsiveModal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  mobileVariant="fullscreen" // Options: fullscreen, bottom-sheet
>
  Modal content
</ResponsiveModal>
```

## Breakpoints

The system uses the following breakpoints:

```css
:root {
  --breakpoint-sm: 320px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

## Touch-Friendly Elements

For better mobile experience, the system includes touch-friendly elements:

```css
.touch-target {
  min-width: var(--touch-target-size);
  min-height: var(--touch-target-size);
}
```

## Accessibility

The system includes accessibility utilities:

```css
.sr-only {
  /* Screen reader only content */
}

.focus-visible:focus {
  /* Focus styles */
}

.skip-to-content {
  /* Skip to content link */
}
```