import { Interval } from "luxon";
import data from "../user_data-1.json";

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

const sliceWorkingHours = (
  timeWindow: Interval,
  workingHours: Interval[]
) => {};

export const getMeetingTimes = (
  timeWindow: Interval,
  users: User[],
  options?: MeetingTimeOptions = {}
): Interval[] => {
  const busy: Interval[] = Interval.merge(
    users.map(u => toIntervalArray(u.events)).flat()
  );
  if (options.workingHours) {
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
