# Mobile-Optimized Components

This directory contains components optimized for mobile devices. These components follow the requirements for responsive design and mobile optimization.

## Mobile Navigation Patterns

### Drawer Navigation

The drawer navigation pattern is implemented in `ResponsiveNavigation.jsx`. It provides:

- Hamburger menu button on mobile
- Slide-in drawer with navigation items
- Overlay that dims the background
- Close button in the drawer header

```jsx
import { ResponsiveNavigation } from '../components/layout';

<ResponsiveNavigation
  logo="/logo.png"
  title="Teacher Attendance"
  items={[
    { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { label: 'Courses', path: '/courses', icon: <CourseIcon /> },
    // ...more items
  ]}
  user={currentUser}
  onLogout={handleLogout}
/>
```

### Bottom Navigation

The bottom navigation pattern is implemented in `MobileLayout.jsx`. It provides:

- Fixed navigation bar at the bottom of the screen
- Icon and label for each navigation item
- Active state for the current route
- Hide on scroll behavior (optional)

```jsx
import { MobileLayout } from '../components/layout';

<MobileLayout
  navItems={[
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Courses', path: '/courses', icon: <CourseIcon /> },
    { label: 'Profile', path: '/profile', icon: <ProfileIcon /> },
  ]}
  hideNavOnScroll={true}
>
  {/* Page content */}
</MobileLayout>
```

## Horizontal Scrolling Tables

The horizontal scrolling table pattern is implemented in `HorizontalScrollTable.jsx`. It provides:

- Horizontal scrolling for tables on mobile
- Scroll indicators on the sides
- Fixed first column option
- Card-based alternative for mobile

```jsx
import { HorizontalScrollTable, CardTable } from '../components/common';

// Horizontal scrolling table
<HorizontalScrollTable
  columns={columns}
  data={data}
  showScrollIndicators={true}
  fixedFirstColumn={true}
/>

// Card-based alternative for mobile
<CardTable
  columns={columns}
  data={data}
  onRowClick={handleRowClick}
/>
```

## Full-Screen Modals for Mobile

The full-screen modal pattern is implemented in `MobileModal.jsx`. It provides:

- Full-screen modals on mobile devices
- Bottom sheet modals that slide up from the bottom
- Centered modals for smaller content
- Fixed header and footer

```jsx
import { MobileModal, MobileBottomSheet, MobileFullScreen } from '../components/common';

// Full-screen modal
<MobileFullScreen
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
>
  {/* Modal content */}
</MobileFullScreen>

// Bottom sheet modal
<MobileBottomSheet
  isOpen={isOpen}
  onClose={handleClose}
  title="Bottom Sheet"
>
  {/* Modal content */}
</MobileBottomSheet>
```

## Mobile-Optimized Forms

The mobile-optimized form pattern is implemented in `MobileForm.jsx`. It provides:

- Stacked layout for form fields on mobile
- Full-width buttons
- Fixed form actions at the bottom
- Touch-friendly input sizes

```jsx
import { MobileForm, MobileFormActions } from '../components/common';

<MobileForm
  initialValues={initialValues}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
  fields={[
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    // ...more fields
  ]}
/>

// Fixed form actions at the bottom
<MobileFormActions
  submitText="Save"
  cancelText="Cancel"
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  loading={isSubmitting}
/>
```

## Mobile Layout Components

The mobile layout components are implemented in `MobileLayout.jsx`. They provide:

- Mobile-optimized page layout
- Section components for grouping content
- Card components optimized for touch
- Proper spacing and scroll behavior

```jsx
import { MobilePage, MobileSection, MobileCard } from '../components/layout';

<MobilePage
  title="Page Title"
  backButton={<BackButton />}
  actions={<ActionButtons />}
>
  <MobileSection
    title="Section Title"
    subtitle="Section description"
  >
    <MobileCard
      title="Card Title"
      subtitle="Card description"
      onClick={handleCardClick}
    >
      {/* Card content */}
    </MobileCard>
  </MobileSection>
</MobilePage>
```