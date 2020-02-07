import logger from "morgan";
import path from "path";
import cookieParser from "cookie-parser";

import {findUsers, getMeetingTimes, transformMeetingTimes} from "./lib/meeting_time";
import {Interval} from "luxon";
import express, {NextFunction, Request, Response} from "express";
import util from "util";
import createHttpError, {HttpError} from "http-errors";

const app = express();

interface MeetingTimeRequests {
  user_ids: number[];
  start: string;
  end: string;
}

// view engine setup
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "jade");

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
    return res.status(400).send({
      error: `${util.inspect(
        req.body
      )} is not a valid request body. Request body should be of the form \n ${util.inspect(
        template
      )}\n`
    });
  }
  next();
});

app.get("/available_times", (req, res, next) => {
  const users = findUsers(...req.body.user_ids);
  const timeWindow = Interval.fromISO(`${req.body.start}/${req.body.end}`);
  const meetingTimes = getMeetingTimes(timeWindow, users);
  const responseBody = transformMeetingTimes(meetingTimes);
  res.send({ responseBody });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createHttpError(404));
});

// error handler
app.use(function(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  //
  // // render the error page
  console.log(err);
  res.status(err.status || 500);
  res.send({ err });
});

export default app;
