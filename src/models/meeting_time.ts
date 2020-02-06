import * as luxon from 'luxon'
import {Interval} from 'luxon'
import data from '../../user_data-1.json'

interface Event {
  id: number
  title: string
  start: string
  end: string
}

interface User {
  user_id: number
  time_zone: string
  working_hours: {
    start: string
    end: string
  }
  events: Event[]
}

const toIntervalArray = (events: Event[]) => {
  return events.map(e => luxon.Interval.fromISO(`${e.start}/${e.end}`))
};

export const findUsers = (...ids: number[]) => {
  return data.filter(u => {
    return ids.includes(u.user_id)
  })
};

export const getMeetingTimes = (start: string, end: string, users: User[]): Interval[] => {
  let timeWindow = luxon.Interval.fromISO(`${start}/${end}`);
  let busy: Interval[] = luxon.Interval.merge(users.map(u => toIntervalArray(u.events)).flat());
  return timeWindow.difference(...busy)
};
