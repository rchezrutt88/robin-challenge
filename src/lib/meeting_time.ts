import { Interval } from "luxon";
import * as moment from "moment";
const moment = require("moment");
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

const normalizeIntervals = (
  workingHours: { start: string; end: string }[]
): Interval => {
  const sameDay = workingHours.map(i => {
    const [startHour, startMinutes] = i.start.split(":");
    const [endtHour, endMinutes] = i.end.split(":");

    Interval.fromDateTimes(
      moment()
        .set("hour", startHour)
        .set("minute", startMinutes),
      moment()
        .set("hours", endtHour)
        .set("minute", endMinutes)
    );
  });
};

const sliceWorkingHours: Interval[] = (
  timeWindow: Interval,
  workingHours: Interval[]
) => {
  workingHours;
};

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
