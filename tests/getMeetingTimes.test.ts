import {
  findUsers,
  getMeetingTimes,
  transformMeetingTimes
} from "../src/lib/meeting_time";
import * as data from "../src/user_data-1.json";
import { Interval } from "luxon";
import supertest from "supertest";
import * as http from "http";
import app from "../src/app";
import arrayContaining = jasmine.arrayContaining;

const transformedData = Object.values(data);

const appTest = supertest(http.createServer(app));

describe("Meeting Time App", () => {
  describe("challenge two", () => {
    const interval = Interval.fromISO(
      "2019-01-01T00:00:00+0000/2019-01-01T23:59:59+0000"
    );
    const users = findUsers(1, 2, 3);
    const meetingIntervals = getMeetingTimes(interval, users);
    const meetingResponse = transformMeetingTimes(meetingIntervals, {workingHours: true});
    expect(meetingResponse).toEqual([
      {
        end_time: "2019-01-01T11:00:00.000Z",
        start_time: "2019-01-01T10:17:00.000Z"
      },
      {
        end_time: "2019-01-01T14:00:00.000Z",
        start_time: "2019-01-01T13:45:00.000Z"
      },
      {
        end_time: "2019-01-01T17:00:00.000Z",
        start_time: "2019-01-01T16:30:00.000Z"
      }
    ]);
  });
  describe("challenge one", () => {
    test("it reads user data", () => {
      expect(transformedData).toEqual(
        arrayContaining([
          {
            user_id: 1,
            time_zone: "UTC",
            working_hours: {
              start: "09:00",
              end: "17:00"
            },
            events: [
              {
                id: 2,
                title: "Meeting B",
                start: "2019-01-01T09:00:00+0000",
                end: "2019-01-01T10:00:00+0000"
              },
              {
                id: 4,
                title: "Meeting D",
                start: "2019-01-01T11:00:00+0000",
                end: "2019-01-01T12:00:00+0000"
              },
              {
                id: 6,
                title: "Meeting F",
                start: "2019-01-01T12:00:00+0000",
                end: "2019-01-01T12:45:00+0000"
              },
              {
                id: 8,
                title: "Meeting H",
                start: "2019-01-01T14:00:00+0000",
                end: "2019-01-01T15:30:00+0000"
              }
            ]
          },
          {
            user_id: 2,
            time_zone: "UTC",
            working_hours: {
              start: "09:00",
              end: "17:00"
            },
            events: [
              {
                id: 1,
                title: "Meeting A",
                start: "2019-01-01T09:00:00+00:00",
                end: "2019-01-01T09:45:00+00:00"
              },
              {
                id: 3,
                title: "Meeting C",
                start: "2019-01-01T10:00:00+00:00",
                end: "2019-01-01T10:17:00+00:00"
              },
              {
                id: 5,
                title: "Meeting E",
                start: "2019-01-01T11:00:00+00:00",
                end: "2019-01-01T13:45:00+00:00"
              },
              {
                id: 7,
                title: "Meeting G",
                start: "2019-01-01T14:00:00+00:00",
                end: "2019-01-01T14:30:00+00:00"
              }
            ]
          },
          {
            user_id: 3,
            time_zone: "UTC",
            working_hours: {
              start: "09:00",
              end: "17:00"
            },
            events: [
              {
                id: 0,
                title: "Meeting Z",
                start: "2019-01-01T09:00:00+00:00",
                end: "2019-01-01T09:45:00+00:00"
              },
              {
                id: 4,
                title: "Meeting D",
                start: "2019-01-01T11:00:00+0000",
                end: "2019-01-01T12:00:00+0000"
              },
              {
                id: 6,
                title: "Meeting F",
                start: "2019-01-01T12:00:00+0000",
                end: "2019-01-01T12:45:00+0000"
              },
              {
                id: 9,
                title: "Meeting I",
                start: "2019-01-01T15:30:00+00:00",
                end: "2019-01-01T16:30:00+00:00"
              }
            ]
          }
        ])
      );
    });

  test("it finds users by id", () => {
    const userIds = [1];
    const users = findUsers(...userIds);
    expect(users).toEqual([
      {
        user_id: 1,
        time_zone: "UTC",
        working_hours: {
          start: "09:00",
          end: "17:00"
        },
        events: [
          {
            id: 2,
            title: "Meeting B",
            start: "2019-01-01T09:00:00+0000",
            end: "2019-01-01T10:00:00+0000"
          },
          {
            id: 4,
            title: "Meeting D",
            start: "2019-01-01T11:00:00+0000",
            end: "2019-01-01T12:00:00+0000"
          },
          {
            id: 6,
            title: "Meeting F",
            start: "2019-01-01T12:00:00+0000",
            end: "2019-01-01T12:45:00+0000"
          },
          {
            id: 8,
            title: "Meeting H",
            start: "2019-01-01T14:00:00+0000",
            end: "2019-01-01T15:30:00+0000"
          }
        ]
      }
    ]);
  });

  test("getMeetingTimes accepts an array of ids with with a start and end time", () => {
    const interval = Interval.fromISO(
      "2019-01-01T00:00:00+0000/2019-01-01T23:59:59+0000"
    );
    const users = findUsers(1, 2, 3);
    const meetingIntervals = getMeetingTimes(interval, users);
    const meetingResponse = transformMeetingTimes(meetingIntervals);
    expect(meetingResponse).toEqual([
      {
        end_time: "2019-01-01T09:00:00.000Z",
        start_time: "2019-01-01T00:00:00.000Z"
      },
      {
        end_time: "2019-01-01T11:00:00.000Z",
        start_time: "2019-01-01T10:17:00.000Z"
      },
      {
        end_time: "2019-01-01T14:00:00.000Z",
        start_time: "2019-01-01T13:45:00.000Z"
      },
      {
        end_time: "2019-01-01T23:59:59.000Z",
        start_time: "2019-01-01T16:30:00.000Z"
      }
    ]);
  });

    test("empty request", async () => {
      await appTest.get("/available_times").expect(400);
    });

    test("unknown users", async () => {
      await appTest
        .get("/available_times")
        .send({
          user_ids: [99, 100, 101],
          start: "2019-01-01T00:00:00+0000",
          end: "2019-01-01T23:59:59+0000"
        })
        .expect(404, '{"error":"Cannot find users with ids 99,100,101"}');
    });

    test("valid request", async () => {
      await appTest
        .get("/available_times")
        .send({
          user_ids: [1, 2, 3],
          start: "2019-01-01T00:00:00+0000",
          end: "2019-01-01T23:59:59+0000"
        })
        .expect(200, {
          responseBody: [
            {
              end_time: "2019-01-01T09:00:00.000Z",
              start_time: "2019-01-01T00:00:00.000Z"
            },
            {
              end_time: "2019-01-01T11:00:00.000Z",
              start_time: "2019-01-01T10:17:00.000Z"
            },
            {
              end_time: "2019-01-01T14:00:00.000Z",
              start_time: "2019-01-01T13:45:00.000Z"
            },
            {
              end_time: "2019-01-01T23:59:59.000Z",
              start_time: "2019-01-01T16:30:00.000Z"
            }
          ]
<<<<<<< Updated upstream:tests/getMeetingTimes.test.ts
        }
      ])
    );
  });

  test("it finds users by id", () => {
    const userIds = [1];
    const users = findUsers(...userIds);
    expect(users).toEqual([
      {
        user_id: 1,
        time_zone: "UTC",
        working_hours: {
          start: "09:00",
          end: "17:00"
        },
        events: [
          {
            id: 2,
            title: "Meeting B",
            start: "2019-01-01T09:00:00+0000",
            end: "2019-01-01T10:00:00+0000"
          },
          {
            id: 4,
            title: "Meeting D",
            start: "2019-01-01T11:00:00+0000",
            end: "2019-01-01T12:00:00+0000"
          },
          {
            id: 6,
            title: "Meeting F",
            start: "2019-01-01T12:00:00+0000",
            end: "2019-01-01T12:45:00+0000"
          },
          {
            id: 8,
            title: "Meeting H",
            start: "2019-01-01T14:00:00+0000",
            end: "2019-01-01T15:30:00+0000"
          }
        ]
      }
    ]);
  });

  test("getMeetingTimes accepts an array of ids with with a start and end time", () => {
    const interval = Interval.fromISO(
      "2019-01-01T00:00:00+0000/2019-01-01T23:59:59+0000"
    );
    const users = findUsers(1, 2, 3);
    const meetingIntervals = getMeetingTimes(interval, users);
    const meetingResponse = transformMeetingTimes(meetingIntervals);
    expect(meetingResponse).toEqual([
      {
        end_time: "2019-01-01T09:00:00.000Z",
        start_time: "2019-01-01T00:00:00.000Z"
      },
      {
        end_time: "2019-01-01T11:00:00.000Z",
        start_time: "2019-01-01T10:17:00.000Z"
      },
      {
        end_time: "2019-01-01T14:00:00.000Z",
        start_time: "2019-01-01T13:45:00.000Z"
      },
      {
        end_time: "2019-01-01T23:59:59.000Z",
        start_time: "2019-01-01T16:30:00.000Z"
      }
    ]);
  });

  test("empty request", async () => {
    await appTest.get("/available_times").expect(400);
  });

  test("valid request", async () => {
    await appTest
      .get("/available_times")
      .send({
        user_ids: [1, 2, 3],
        start: "2019-01-01T00:00:00+0000",
        end: "2019-01-01T23:59:59+0000"
      })
      .expect(200, {
        responseBody: [
          {
            end_time: "2019-01-01T09:00:00.000Z",
            start_time: "2019-01-01T00:00:00.000Z"
          },
          {
            end_time: "2019-01-01T11:00:00.000Z",
            start_time: "2019-01-01T10:17:00.000Z"
          },
          {
            end_time: "2019-01-01T14:00:00.000Z",
            start_time: "2019-01-01T13:45:00.000Z"
          },
          {
            end_time: "2019-01-01T23:59:59.000Z",
            start_time: "2019-01-01T16:30:00.000Z"
          }
        ]
      });
  });
});
