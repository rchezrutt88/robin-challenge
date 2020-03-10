import logger from "morgan";
import path from "path";
import cookieParser from "cookie-parser";

import {
  findUsers,
  getMeetingTimes,
  transformMeetingTimes
} from "./lib/meeting_time";
import { Interval } from "luxon";
import express, { NextFunction, Request, Response } from "express";
import util from "util";
import createHttpError, { HttpError } from "http-errors";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/available_times", (req, res, next) => {
  if (!req.body.user_ids || !req.body.start || !req.body.end) {
    const template = {
      user_ids: "[...ids]",
      start: "ISO 8601 datetime",
      end: "ISO 8601 datetime"
    };
    return next(
      createHttpError(
        400,
        `Request should be of the form ${JSON.stringify(template)}`
      )
    );
  }
  next();
});

app.get("/available_times", (req, res, next) => {
  const users = findUsers(...req.body.user_ids);
  if (users.length < 1) {
    next(createHttpError(404, "No users found"));
  }
  const timeWindow = Interval.fromISO(`${req.body.start}/${req.body.end}`);
  const meetingTimes = getMeetingTimes(timeWindow, users);
  const responseBody = transformMeetingTimes(meetingTimes);
  res.send({ responseBody });
});

// error handler
app.use(function(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(err.status || 500);
  res.send({ error: err });
});

export default app;
