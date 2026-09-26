export interface DaySchedule {
  dayName: string;
  openHour: number; // 24-hr format (12 for 12:00 PM)
  openMinute: number;
  closeHour: number; // 24 for 12:00 AM
  closeMinute: number;
  displayHours: string;
}

export const WEEKLY_SCHEDULE: Record<number, DaySchedule> = {
  0: { dayName: 'Sunday', openHour: 12, openMinute: 0, closeHour: 24, closeMinute: 0, displayHours: '12 PM–12 AM' },
  1: { dayName: 'Monday', openHour: 12, openMinute: 0, closeHour: 24, closeMinute: 0, displayHours: '12 PM–12 AM' },
  2: { dayName: 'Tuesday', openHour: 12, openMinute: 0, closeHour: 24, closeMinute: 0, displayHours: '12 PM–12 AM' },
  3: { dayName: 'Wednesday', openHour: 12, openMinute: 0, closeHour: 24, closeMinute: 0, displayHours: '12 PM–12 AM' },
  4: { dayName: 'Thursday', openHour: 12, openMinute: 0, closeHour: 24, closeMinute: 0, displayHours: '12 PM–12 AM' },
  5: { dayName: 'Friday', openHour: 12, openMinute: 0, closeHour: 24, closeMinute: 0, displayHours: '12 PM–12 AM' },
  6: { dayName: 'Saturday', openHour: 12, openMinute: 0, closeHour: 24, closeMinute: 0, displayHours: '12 PM–12 AM' },
};

export interface RestaurantHoursStatus {
  isOpen: boolean;
  statusLabel: string;
  detailText: string;
  todaySchedule: DaySchedule;
}

export function getRestaurantHoursStatus(now: Date = new Date()): RestaurantHoursStatus {
  const currentDay = now.getDay(); // 0 is Sunday, 6 is Saturday
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentDecimal = currentHours + currentMinutes / 60;

  // Check if we are in the spillover hours from previous day
  const prevDay = (currentDay + 6) % 7;
  const prevSchedule = WEEKLY_SCHEDULE[prevDay];
  const prevCloseTotal = prevSchedule.closeHour + prevSchedule.closeMinute / 60;
  if (prevCloseTotal > 24) {
    const spilloverCloseDecimal = prevCloseTotal - 24;
    if (currentDecimal < spilloverCloseDecimal) {
      return {
        isOpen: true,
        statusLabel: 'Open now',
        detailText: 'Open until 12:00 AM',
        todaySchedule: WEEKLY_SCHEDULE[currentDay],
      };
    }
  }

  const todaySchedule = WEEKLY_SCHEDULE[currentDay];
  const openDecimal = todaySchedule.openHour + todaySchedule.openMinute / 60;
  const closeDecimal = todaySchedule.closeHour + todaySchedule.closeMinute / 60;

  if (currentDecimal >= openDecimal && (closeDecimal > 24 || currentDecimal < closeDecimal)) {
    return {
      isOpen: true,
      statusLabel: 'Open now',
      detailText: 'Open until 12:00 AM',
      todaySchedule,
    };
  }

  // If closed before 12:00 PM today
  if (currentDecimal < openDecimal) {
    return {
      isOpen: false,
      statusLabel: 'Closed',
      detailText: 'Opens today at 12:00 PM',
      todaySchedule,
    };
  } else {
    const nextDay = (currentDay + 1) % 7;
    const nextSchedule = WEEKLY_SCHEDULE[nextDay];
    return {
      isOpen: false,
      statusLabel: 'Closed',
      detailText: `Opens tomorrow (${nextSchedule.dayName}) at 12:00 PM`,
      todaySchedule,
    };
  }
}

/**
 * Generate valid table reservation time slots for a chosen date
 * From 12:00 PM to 12:00 AM (matching 12 PM – 12 AM schedule)
 */
export function getReservationSlotsForDate(dateStr: string): string[] {
  if (!dateStr) return [];
  return [
    '12:00 PM',
    '12:30 PM',
    '1:00 PM',
    '1:30 PM',
    '2:00 PM',
    '2:30 PM',
    '3:00 PM',
    '3:30 PM',
    '4:00 PM',
    '4:30 PM',
    '5:00 PM',
    '5:30 PM',
    '6:00 PM',
    '6:30 PM',
    '7:00 PM',
    '7:30 PM',
    '8:00 PM',
    '8:30 PM',
    '9:00 PM',
    '9:30 PM',
    '10:00 PM',
    '10:30 PM',
    '11:00 PM',
    '11:30 PM',
    '12:00 AM',
  ];
}
