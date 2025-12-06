# react-tailwind-calendar

A flexible and customizable big calendar component for React built with Tailwind CSS.

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
- The following custom classes available (or you can customize them):
  - `calendar-disabled-hour` - for disabled time slots styling

## Usage

```tsx
import { BigCalendar, type CalendarData } from 'react-tailwind-calendar';

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

### BigCalendar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultStartDate` | `Date` | **required** | The initial start date for the calendar view |
| `events` | `CalendarData[]` | **required** | Array of calendar events to display |
| `totalShowingDays` | `number` | `6` | Number of days to show in the calendar |
| `showAllHours` | `boolean` | `false` | Whether to show all 24 hours or only hours with events |
| `timeFormat` | `'12h' \| '24h'` | `'12h'` | Time format for display |
| `onSlotClick` | `(data: SlotClickData) => void` | - | Callback when a time slot is clicked |
| `onEventClick` | `(event: CalendarData, date: Date) => void` | - | Callback when an event is clicked |
| `workingHours` | `WorkingHoursConfig` | - | Working hours configuration for each day |
| `shifts` | `ShiftData[]` | - | Shift data to display on the calendar |
| `avatarComponent` | `AvatarComponent` | - | Custom avatar component |
| `avatarGroupComponent` | `AvatarGroupComponent` | - | Custom avatar group component |
| `className` | `string` | - | Additional CSS classes |

### CalendarData

```typescript
type CalendarData = {
  id: string;
  startDate: Date;
  endDate: Date;
  title?: string;
  type?: 'meeting' | 'event' | 'default';
  location?: string;
  link?: string;
  platform?: string;
  people?: {
    image: string;
    alt: string;
    color?: AvatarColor;
  }[];
  completed?: boolean;
  disabled?: boolean;
};
```

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Watch mode for development
npm run dev
```

## Publishing

Before publishing to npm, make sure to:

1. Update the version in `package.json`
2. Build the package: `npm run build`
3. Update the repository URL in `package.json` if needed
4. Publish: `npm publish`

## License

MIT
