import * as React from 'react';
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiGlobalLine,
  RiMapPin2Fill,
} from '@remixicon/react';
import {
  addDays,
  addHours,
  differenceInMinutes,
  endOfHour,
  format,
  getDay,
  isSameDay,
  isSameHour,
  setHours,
  setMinutes,
  setSeconds,
  startOfHour,
  subDays,
} from 'date-fns';

import { cn, cnExt, type ClassValue } from './utils/cn';

// Avatar component types
export type AvatarColor =
  | 'blue'
  | 'green'
  | 'yellow'
  | 'red'
  | 'purple'
  | 'pink'
  | 'orange'
  | 'teal'
  | 'cyan'
  | 'indigo'
  | 'gray';

export type AvatarRootProps = {
  color?: AvatarColor;
  children: React.ReactNode;
  className?: string;
};

export type AvatarImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export type AvatarComponent = {
  Root: React.ComponentType<AvatarRootProps>;
  Image: React.ComponentType<AvatarImageProps>;
};

export type AvatarGroupComponent = {
  Root: React.ComponentType<{
    size?: string;
    children: React.ReactNode;
    className?: string;
  }>;
};

const getHourRange = (
  calendarData: CalendarData[],
): { earliestHour: number; latestHour: number } => {
  const startTimes = calendarData.map((event) => startOfHour(event.startDate));
  const endTimes = calendarData.map((event) => endOfHour(event.endDate));
  const earliestHour = Math.min(...startTimes.map((date) => date.getHours()));
  const latestHour = Math.max(...endTimes.map((date) => date.getHours()));

  return { earliestHour, latestHour };
};

const generateHours = (startHour: number, endHour: number): string[] => {
  const hours = [];
  for (let i = startHour; i <= endHour; i++) {
    const date = setSeconds(setMinutes(setHours(new Date(), i), 0), 0);
    hours.push(date.toISOString());
  }
  return hours;
};

const ensureMinimumHours = (
  hours: string[],
  minHours: number = 6,
): string[] => {
  if (hours.length >= minHours) {
    return hours;
  }

  const firstHour = new Date(hours[0]);
  const lastHour = new Date(hours[hours.length - 1]);

  while (hours.length < minHours) {
    firstHour.setHours(firstHour.getHours() - 1);
    hours.unshift(firstHour.toISOString());

    lastHour.setHours(lastHour.getHours() + 1);
    hours.push(lastHour.toISOString());
  }

  return hours;
};

// Day name mapping (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// Convert day name to lowercase for matching
const normalizeDayName = (dayName: string): string => {
  return dayName.toLowerCase();
};

// Parse time string "HH:mm" to hour number
const parseTimeToHour = (timeStr: string): number => {
  const [hours] = timeStr.split(':').map(Number);
  return hours;
};

// Get all working hours for a specific day
const getWorkingHoursForDay = (
  date: Date,
  workingHours?: WorkingHoursConfig,
): number[] => {
  if (!workingHours || !Array.isArray(workingHours)) return [];

  const dayIndex = getDay(date);
  const dayName = DAY_NAMES[dayIndex];
  const normalizedDayName = normalizeDayName(dayName);

  // Find all working hours items for this day
  const dayWorkingHours = workingHours.filter(
    (item) => normalizeDayName(item.day) === normalizedDayName,
  );

  if (dayWorkingHours.length === 0) return [];

  // Collect all hours from all time ranges for this day
  const validHours = new Set<number>();
  dayWorkingHours.forEach((item) => {
    const startHour = parseTimeToHour(item.start_time);
    const endHour = parseTimeToHour(item.end_time);
    // endHour is exclusive (e.g., "10:00" - "12:00" means 10 and 11, not 12)
    // This allows for breaks between time ranges (e.g., 12:00-13:00 lunch break)
    for (let hour = startHour; hour < endHour; hour++) {
      validHours.add(hour);
    }
  });

  return Array.from(validHours).sort((a, b) => a - b);
};

// Check if a specific hour is within working hours for a specific day
const isWorkingHour = (
  date: Date,
  hour: number,
  workingHours?: WorkingHoursConfig,
): boolean => {
  if (!workingHours || !Array.isArray(workingHours)) return true; // If no working hours, all hours are valid

  const dayWorkingHours = getWorkingHoursForDay(date, workingHours);
  return dayWorkingHours.includes(hour);
};

const filterHoursByWorkingHours = (
  hours: string[],
  showingDays: Date[],
  workingHours?: WorkingHoursConfig,
): string[] => {
  if (!workingHours) return hours;

  const validHours = new Set<number>();
  showingDays.forEach((day) => {
    const dayWorkingHours = getWorkingHoursForDay(day, workingHours);
    dayWorkingHours.forEach((hour) => validHours.add(hour));
  });

  if (validHours.size === 0) return hours;

  return hours.filter((hourStr) => {
    const hour = new Date(hourStr).getHours();
    return validHours.has(hour);
  });
};

type GroupedCalendarData = {
  groupDateStart: Date;
  groupDateEnd: Date;
  events: CalendarData[];
}[];

/**
 * Groups calendar events by hour. Events that start within the same hour
 * or overlap within an hour are grouped together.
 *
 * @param {CalendarData[]} events - Array of calendar events to be grouped.
 * @returns {GroupedCalendarData} - Array of grouped events with group start and end times.
 *
 * @example
 * // 9 AM - 9:30 AM and 9:30 AM - 10 AM will be grouped together.
 * // 9 AM - 9:15 AM and 9:15 AM - 9:45 AM will be grouped together.
 * // 10 AM - 10:30 AM and 10:15 AM - 10:45 AM will be grouped together.
 * // 11 AM - 11:30 AM and 11:45 AM - 12 PM will be grouped together.
 * // 1 PM - 1:30 PM and 1:15 PM - 1:45 PM will be grouped together.
 * // 2 PM - 2:30 PM and 2:45 PM - 3:15 PM will NOT be grouped together.
 */
const groupEventsByHour = (events: CalendarData[]): GroupedCalendarData => {
  const sortedEvents = events
    .slice()
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const groupedEvents: GroupedCalendarData = [];

  for (const event of sortedEvents) {
    // Find if there is already a group for this hour
    const existingGroup = groupedEvents.find(
      ({ groupDateStart, groupDateEnd }) =>
        isSameHour(event.startDate, groupDateStart) &&
        (isSameHour(event.endDate, groupDateEnd) ||
          event.endDate < groupDateEnd),
    );

    if (existingGroup) {
      // If there is an existing group, add the event to that group
      existingGroup.events.push(event);
      // Update groupDateEnd to the latest endDate in the group
      if (event.endDate > existingGroup.groupDateEnd) {
        existingGroup.groupDateEnd = event.endDate;
      }
    } else {
      // Create a new group for this hour
      groupedEvents.push({
        groupDateStart: event.startDate,
        groupDateEnd: event.endDate,
        events: [event],
      });
    }
  }

  return groupedEvents;
};

export type CalendarData = {
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

// Working Hours Configuration Types
export type WorkingHoursItem = {
  day: string; // "monday", "tuesday", etc.
  start_time: string; // "HH:mm" format
  end_time: string; // "HH:mm" format
};

export type WorkingHoursConfig = WorkingHoursItem[];

// Shift Data Type
export type ShiftData = {
  startDate: Date;
  endDate: Date;
  type?: 'working' | 'break' | 'unavailable';
};

// Default Avatar components (minimal implementation)
const DefaultAvatarRoot: React.FC<AvatarRootProps> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('relative flex shrink-0 items-center justify-center rounded-full', className)} {...props}>
    {children}
  </div>
);

const DefaultAvatarImage: React.FC<AvatarImageProps> = ({
  src,
  alt,
  className,
  ...props
}) => (
  <img src={src} alt={alt} className={cn('size-full rounded-full object-cover', className)} {...props} />
);

const DefaultAvatarGroupRoot: React.FC<{
  size?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ children, className, ...props }) => (
  <div className={cn('flex *:ring-2 *:ring-stroke-white-0 -space-x-1', className)} {...props}>
    {children}
  </div>
);

type CalendarEventItemProps = CalendarData & {
  isTiny?: boolean;
  onClick?: (event: CalendarData, date: Date) => void;
  timeFormat?: '12h' | '24h';
  avatarComponent?: AvatarComponent;
  avatarGroupComponent?: AvatarGroupComponent;
};

const bgColors: Partial<Record<NonNullable<CalendarData['type']>, string>> = {
  meeting: 'bg-information-lighter',
  event: 'bg-warning-lighter',
  default: 'bg-away-lighter',
};

function CalendarEventItem({
  startDate,
  endDate,
  id,
  type = 'default',
  completed,
  title,
  link,
  location,
  people,
  platform,
  isTiny,
  onClick,
  timeFormat = '12h',
  avatarComponent,
  avatarGroupComponent,
}: CalendarEventItemProps) {
  const Avatar = avatarComponent || {
    Root: DefaultAvatarRoot,
    Image: DefaultAvatarImage,
  };
  const AvatarGroup = avatarGroupComponent || {
    Root: DefaultAvatarGroupRoot,
  };
  const handleClick = () => {
    if (onClick) {
      const eventData: CalendarData = {
        id,
        startDate,
        endDate,
        type,
        completed,
        title,
        link,
        location,
        people,
        platform,
      };
      onClick(eventData, startDate);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cnExt(
        'flex min-h-0 w-full min-w-0 flex-col gap-2 overflow-hidden rounded-lg px-3 py-2',
        'backdrop-blur-xl',
        bgColors[type],
        {
          'bg-bg-weak-50': completed,
          'cursor-pointer': onClick,
        },
      )}
    >
      <div className='space-y-1'>
        <div
          className={cn('text-label-xs', {
            truncate: isTiny,
            'text-text-strong-950': !completed,
            'text-text-sub-600': completed,
          })}
        >
          {title}
        </div>
        <div className='text-subheading-2xs text-text-sub-600'>
          {timeFormat === '24h'
            ? `${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}`
            : `${format(startDate, 'h:mm')} - ${format(endDate, 'h:mm aa')}`}
        </div>
      </div>
      {(location || link || people || platform) && !isTiny && (
        <div className='mt-auto space-y-1'>
          {location && (
            <div className='flex items-center gap-1.5'>
              <RiMapPin2Fill className='size-4 shrink-0 text-warning-base' />
              <div className='truncate text-paragraph-xs'>{location}</div>
            </div>
          )}
          {link && (
            <div className='flex items-center gap-1.5'>
              <RiGlobalLine className='size-4 shrink-0 text-warning-base' />
              <div className='truncate text-paragraph-xs'>{link}</div>
            </div>
          )}
          {(people || platform) && (
            <div className='flex items-center justify-between'>
              {people && (
                <div className='flex items-center gap-1.5'>
                  <AvatarGroup.Root size='20'>
                    {people.slice(0, 3).map(({ image, alt, color }, i) => (
                      <Avatar.Root key={i} color={color}>
                        <Avatar.Image src={image} alt={alt} />
                      </Avatar.Root>
                    ))}
                  </AvatarGroup.Root>
                  {people.length > 3 && (
                    <div className='text-paragraph-xs text-text-sub-600'>
                      +{people.length - 3}
                    </div>
                  )}
                </div>
              )}
              {platform && (
                <div className='text-paragraph-xs text-text-sub-600'>
                  {platform}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CalendarDisabledHourItem({}: Pick<
  CalendarData,
  'startDate' | 'endDate'
>) {
  return <div className='calendar-disabled-hour -m-2 min-w-0' />;
}

const shiftBgColors: Partial<
  Record<NonNullable<ShiftData['type']>, string>
> = {
  working: 'bg-success-lighter/30',
  break: 'bg-warning-lighter/30',
  unavailable: 'bg-error-lighter/30',
};

function ShiftItem({
  startDate,
  endDate,
  type = 'working',
}: ShiftData) {
  return (
    <div
      className={cnExt(
        'absolute inset-0 -m-1 rounded-md border-2 border-dashed',
        shiftBgColors[type] || 'bg-bg-weak-50/30',
        {
          'border-success-base': type === 'working',
          'border-warning-base': type === 'break',
          'border-error-base': type === 'unavailable',
        },
      )}
    />
  );
}

export type SlotClickData = {
  date: string; // YYYY/MM/dd format
  time: string; // HH:mm (24h) or h:mm aa (12h) format based on timeFormat
};

type BigCalendarProps = {
  defaultStartDate: Date;
  totalShowingDays?: number;
  className?: ClassValue;
  events: CalendarData[];
  showAllHours?: boolean;
  timeFormat?: '12h' | '24h';
  onSlotClick?: (data: SlotClickData) => void;
  onEventClick?: (event: CalendarData, date: Date) => void;
  workingHours?: WorkingHoursConfig;
  shifts?: ShiftData[];
  avatarComponent?: AvatarComponent;
  avatarGroupComponent?: AvatarGroupComponent;
};

export function BigCalendar({
  defaultStartDate,
  totalShowingDays = 6,
  events,
  showAllHours,
  className,
  timeFormat = '12h',
  onSlotClick,
  onEventClick,
  workingHours,
  shifts,
  avatarComponent,
  avatarGroupComponent,
}: BigCalendarProps) {
  const [currentStartDate, setCurrentStartDate] =
    React.useState(defaultStartDate);

  const showingDays = Array.from({ length: totalShowingDays }, (_, i) =>
    addDays(currentStartDate, i),
  );

  let showingHours: string[] = [];

  // If working hours are provided, start from the earliest working hour across all days
  if (workingHours && workingHours.length > 0) {
    const validHours = new Set<number>();
    showingDays.forEach((day) => {
      const dayWorkingHours = getWorkingHoursForDay(day, workingHours);
      dayWorkingHours.forEach((hour) => validHours.add(hour));
    });

    if (validHours.size > 0) {
      const minWorkingHour = Math.min(...Array.from(validHours));
      const maxWorkingHour = Math.max(...Array.from(validHours));
      
      // Also consider events for the range
      let eventMinHour = minWorkingHour;
      let eventMaxHour = maxWorkingHour;
      if (events.length > 0 && !showAllHours) {
        const { earliestHour, latestHour } = getHourRange(events);
        eventMinHour = Math.min(minWorkingHour, earliestHour);
        eventMaxHour = Math.max(maxWorkingHour, latestHour);
      }
      
      // Start from the earliest working hour (don't show hours before this)
      const startHour = showAllHours ? 0 : minWorkingHour;
      const endHour = showAllHours ? 23 : Math.max(maxWorkingHour, eventMaxHour);
      showingHours = generateHours(startHour, endHour);
    } else {
      // Fallback if no working hours match
      if (showAllHours || events.length === 0) {
        showingHours = generateHours(0, 23);
      } else {
        const { earliestHour, latestHour } = getHourRange(events);
        showingHours = generateHours(earliestHour, latestHour);
        showingHours = ensureMinimumHours(showingHours);
      }
    }
  } else {
    // No working hours, use event-based or all hours
    if (showAllHours || events.length === 0) {
      showingHours = generateHours(0, 23);
    } else {
      const { earliestHour, latestHour } = getHourRange(events);
      showingHours = generateHours(earliestHour, latestHour);
      showingHours = ensureMinimumHours(showingHours);
    }
  }

  const groupedEvents = groupEventsByHour(events);

  const handlePrevDay = () => {
    setCurrentStartDate(subDays(currentStartDate, 1));
  };

  const handleNextDay = () => {
    setCurrentStartDate(addDays(currentStartDate, 1));
  };

  const getRowNumber = (startDate: Date): number => {
    let hours: number;
    if (showAllHours) {
      hours = startDate.getHours();
    } else {
      hours = startDate.getHours() - startOfHour(showingHours[0]).getHours();
    }
    const minutes = startDate.getMinutes();
    return hours * 4 + Math.floor(minutes / 15) + 1 + 1; // +1 for how grid works, +1 for the first empty row
  };

  return (
    <div className='relative z-20 -mx-4 overflow-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0'>
      <div className={cnExt('w-fit bg-bg-white-0 lg:w-full', className)}>
        <div className='flex overflow-clip rounded-xl border border-stroke-soft-200 lg:overflow-auto'>
          <div className='sticky -left-4 z-30 -ml-px w-[104px] shrink-0 overflow-hidden border-x border-stroke-soft-200 bg-bg-white-0 lg:left-0 lg:border-l-0'>
            <div className='grid h-8 w-full shrink-0 grid-cols-2 divide-x divide-stroke-soft-200 border-b border-stroke-soft-200'>
              <button
                type='button'
                onClick={() => handlePrevDay()}
                className='flex items-center justify-center bg-bg-white-0'
              >
                <RiArrowLeftSLine className='size-5 text-text-sub-600' />
              </button>
              <button
                type='button'
                onClick={() => handleNextDay()}
                className='flex items-center justify-center bg-bg-white-0'
              >
                <RiArrowRightSLine className='size-5 text-text-sub-600' />
              </button>
            </div>
            {showingHours.map((hour, i, arr) => (
              <React.Fragment key={i}>
                {i === 0 && <div className='h-10' />}
                <div className='row-span-4 flex h-[120px] items-start justify-center'>
                  <div className='-translate-y-1/2 text-center text-label-sm text-text-sub-600'>
                    {timeFormat === '24h'
                      ? format(hour, 'HH:mm')
                      : format(hour, 'h:mm aa')}
                  </div>
                </div>
                {i === arr.length - 1 && (
                  <div className='flex h-10 items-start justify-center'>
                    <div className='-translate-y-1/2 text-center text-label-sm text-text-sub-600'>
                      {timeFormat === '24h'
                        ? format(
                            addHours(showingHours[showingHours.length - 1], 1),
                            'HH:mm',
                          )
                        : format(
                            addHours(showingHours[showingHours.length - 1], 1),
                            'h:mm aa',
                          )}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div>
            <div className='sticky top-0 z-20 overflow-hidden rounded-tr-xl bg-bg-white-0'>
              <header className='flex divide-x divide-stroke-soft-200'>
                <div className='grid w-full auto-cols-[200px] grid-flow-col divide-x divide-stroke-soft-200'>
                  {showingDays.map((day, index) => (
                    <div
                      key={index}
                      className='flex h-8 items-center justify-center border-b border-stroke-soft-200 bg-bg-weak-50 text-center text-label-xs text-text-soft-400'
                    >
                      {format(day, 'dd EEE').toUpperCase()}
                    </div>
                  ))}
                </div>
              </header>
            </div>
            <div className='grid w-full content-start items-start'>
              <div className='grid w-full auto-cols-[200px] grid-flow-col divide-x divide-stroke-soft-200 [grid-area:1/1]'>
                {showingDays.map((day, index) => (
                  <div
                    key={index}
                    className='grid divide-y divide-stroke-soft-200'
                  >
                    {showingHours.map((hour, i, arr) => {
                      const hourDate = new Date(hour);
                      const hourNumber = hourDate.getHours();
                      const slotDate = new Date(day);
                      slotDate.setHours(hourNumber, 0, 0, 0);
                      const isWorking = isWorkingHour(
                        slotDate,
                        hourNumber,
                        workingHours,
                      );

                      return (
                        <React.Fragment key={i}>
                          {i === 0 && <div className='h-10' />}
                          <div
                            className={cn('row-span-4 h-[120px]', {
                              'cursor-pointer hover:bg-bg-weak-50 transition-colors':
                                onSlotClick && isWorking,
                              'calendar-disabled-hour cursor-not-allowed': !isWorking,
                            })}
                            onClick={() => {
                              if (onSlotClick && isWorking) {
                                onSlotClick({
                                  date: format(slotDate, 'yyyy/MM/dd'),
                                  time:
                                    timeFormat === '24h'
                                      ? format(slotDate, 'HH:mm')
                                      : format(slotDate, 'h:mm aa'),
                                });
                              }
                            }}
                          ></div>
                          {i === arr.length - 1 && <div className='h-10' />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div
                className='pointer-events-none grid w-full auto-cols-[200px] grid-flow-col gap-y-px [grid-area:1/1]'
                style={{
                  gridTemplateRows: `40px repeat(${showingHours.length * 4}, 29px) 39px`,
                }}
              >
                {showingDays.map((day, dayColIndex) =>
                  groupedEvents.map(
                    ({ groupDateStart, groupDateEnd, events }, groupIndex) => {
                      const rowStart = getRowNumber(groupDateStart);
                      const rowEnd =
                        events.length === 1
                          ? Math.max(
                              getRowNumber(groupDateEnd),
                              getRowNumber(groupDateStart) + 2, // take space of 30min for <30min events
                            )
                          : Math.max(
                              getRowNumber(groupDateEnd),
                              getRowNumber(groupDateStart) + 4, // if there are multiple events in the same group, take at least 1 hour span
                            );

                      return (
                        isSameDay(day, groupDateStart) && (
                          <div
                            key={`${day}-${groupIndex}`}
                            className={cn('pointer-events-auto col-span-1 grid gap-2 px-2 py-1', {
                              'pt-2': rowStart % 4 === 2,
                              'pb-2': rowEnd % 4 === 2,
                            })}
                            style={{
                              gridRowStart: `${rowStart}`,
                              gridRowEnd: `${rowEnd}`,
                              gridColumnStart: dayColIndex + 1,
                            }}
                          >
                            {events.map(({ disabled, ...props }) => {
                              const isTiny =
                                differenceInMinutes(
                                  props.endDate,
                                  props.startDate,
                                ) < 45;

                              return disabled ? (
                                <CalendarDisabledHourItem
                                  key={props.startDate.toString()}
                                  startDate={props.startDate}
                                  endDate={props.endDate}
                                />
                              ) : (
                                <CalendarEventItem
                                  key={props.startDate.toString()}
                                  {...props}
                                  isTiny={isTiny}
                                  onClick={onEventClick}
                                  timeFormat={timeFormat}
                                  avatarComponent={avatarComponent}
                                  avatarGroupComponent={avatarGroupComponent}
                                />
                              );
                            })}
                          </div>
                        )
                      );
                    },
                  ),
                )}
                {shifts &&
                  showingDays.map((day, dayColIndex) =>
                    shifts
                      .filter((shift) => isSameDay(shift.startDate, day))
                      .map((shift, shiftIndex) => {
                        const rowStart = getRowNumber(shift.startDate);
                        const rowEnd = getRowNumber(shift.endDate);

                        return (
                          <div
                            key={`shift-${day}-${shiftIndex}`}
                            className='pointer-events-none relative col-span-1'
                            style={{
                              gridRowStart: `${rowStart}`,
                              gridRowEnd: `${rowEnd}`,
                              gridColumnStart: dayColIndex + 1,
                            }}
                          >
                            <ShiftItem {...shift} />
                          </div>
                        );
                      }),
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
