# react-tailwind-calendar

A flexible and customizable big calendar component for React built with Tailwind CSS.

## 🌐 Demo

Check out the live demo: **[https://react-tailwind-calendar-nu.vercel.app/](https://react-tailwind-calendar-nu.vercel.app/)**

## Installation

```bash
npm install react-tailwind-calendar
# or
yarn add react-tailwind-calendar
# or
pnpm add react-tailwind-calendar
```

## Requirements

This package requires the following dependencies:

### Peer Dependencies

- `react` ^18.0.0
- `react-dom` ^18.0.0
- `date-fns` ^3.0.0
- `@remixicon/react` ^4.0.0

### Tailwind CSS

This component uses Tailwind CSS classes and requires Tailwind CSS to be configured in your project. Make sure you have:

- `tailwindcss` installed and configured
- Tailwind CSS classes available in your project

#### Required Tailwind Configuration

The component uses custom Tailwind colors and text sizes. You need to configure these in your `tailwind.config.js`:

**Custom Colors:**

- `bg-information-lighter`, `bg-warning-lighter`, `bg-away-lighter`, `bg-success-lighter`, `bg-error-lighter`
- `bg-bg-white-0`, `bg-bg-weak-50`
- `text-text-strong-950`, `text-text-sub-600`, `text-text-soft-400`
- `border-stroke-soft-200`

**Custom Text Sizes:**

- `text-label-xs`, `text-label-sm`
- `text-subheading-2xs`
- `text-paragraph-xs`

#### Custom CSS

The component automatically injects the required CSS styles when imported. The `.calendar-disabled-hour` class is used for styling disabled time slots and is automatically available - no manual import needed!

If you need to customize the disabled hour styling, you can override the CSS variable:

```css
:root {
  --stroke-soft-200: 220 13% 91%; /* Default gray color */
}
```

## Usage

```tsx
import {BigCalendar, type CalendarData} from 'react-tailwind-calendar';

const events: CalendarData[] = [
  {
    id: '1',
    startDate: new Date('2024-11-04T09:00:00'),
    endDate: new Date('2024-11-04T10:00:00'),
    title: 'Meeting',
    type: 'meeting',
  },
];

function App() {
  return (
    <BigCalendar
      defaultStartDate={new Date('2024-11-04T00:00:00')}
      events={events}
      onSlotClick={(data) => console.log('Slot clicked:', data)}
      onEventClick={(event, date) => console.log('Event clicked:', event, date)}
    />
  );
}
```

## Props

See the component's TypeScript definitions for all available props.
