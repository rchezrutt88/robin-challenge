import { Interval } from 'luxon'
import data from '../user_data-1.json'

interface Event {
  id: number;
  title: string;
  start: string;
  end: string;
}

interface User {
  user_id: number;
  time_zone: string;
  working_hours: {
    start: string;
    end: string;
  };
  events: Event[];
}

const toIntervalArray = (events: Event[]) => {
  return events.map(e => Interval.fromISO(`${e.start}/${e.end}`));
};

export const findUsers = (...ids: number[]): User[] => {
  return data.filter(u => {
    return ids.includes(u.user_id);
  });
};

interface MeetingTimeOptions {
  workingHours?: boolean;
}

const offHoursIntervals = (
  timeWindow: Interval,
  workingHours: { start: number[]; end: number[] }[]
): Interval[] => {
  const workingHoursArray = workingHours.map(i => {
    return Interval.fromDateTimes(
      timeWindow.start.set({ hour: i.start[0], minute: i.start[1] }),
      timeWindow.start.set({ hour: i.end[0], minute: i.end[1] })
    );
  });
  return Interval.fromDateTimes(
    timeWindow.start.startOf("day"),
    timeWindow.start.endOf("day")
  ).difference(...workingHoursArray);
};

const offHoursIntervalsOverTimeWindow = (
  timeWindow: Interval,
  offHoursIntervals: Interval[]
): Interval[] => {
  const offHourIntervalsOverTimeWindow: Interval[] = [];
  for (const interval of offHoursIntervals) {
    for (
      let start = interval.start, end = interval.end;
      end < timeWindow.end;
      start.plus({ days: 1 }), end.plus({ days: 1 })
    ) {
      offHourIntervalsOverTimeWindow.push(Interval.fromDateTimes(start, end));
    }
  }
  return offHourIntervalsOverTimeWindow;
};

const extractWorkingHours = (
  users: User[]
): { start: number[]; end: number[] }[] => {
  return users.map(u => {
    return {
      start: u.working_hours.start.split(":").map(e => parseInt(e)),
      end: u.working_hours.end.split(":").map(e => parseInt(e))
    };
  });
};

export const getMeetingTimes = (
  timeWindow: Interval,
  users: User[],
  options: MeetingTimeOptions = {}
): Interval[] => {
  const busy: Interval[] = Interval.merge(
    users.map(u => toIntervalArray(u.events)).flat()
  );
  if (options.workingHours) {
    return timeWindow.difference(
      ...busy,
      ...offHoursIntervalsOverTimeWindow(
        timeWindow,
        offHoursIntervals(timeWindow, extractWorkingHours(users))
      )
    );
  }
  return timeWindow.difference(...busy);
};

export const transformMeetingTimes = (intervals: Interval[]) => {
  return intervals.map(i => {
    return {
      start_time: i.start.toUTC().toString(),
      end_time: i.end.toUTC().toString()
    };
  });
};
