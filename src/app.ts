import express, {NextFunction, Request, Response,} from 'express'
import logger from 'morgan'
import createHttpError, {HttpError} from 'http-errors'
import path from 'path'
import cookieParser from 'cookie-parser'
import indexRouter from './routes'
import usersRouter from './routes/users'

import {findUsers, getMeetingTimes} from "./models/meeting_time";

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../src/views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

declare global {
  namespace Express {
    interface Request {
      body: {
        user_ids: number[]
        start: string
        end: string
      }
    }
  }
}
app.use('/available_times', (req: Request, res: Response) => {
  const meetingTimes = getMeetingTimes(req.body.start, req.body.end, findUsers(...req.body.user_ids));
  res.send(meetingTimes)
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createHttpError(404));
});

// error handler
app.use(function (err: HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000')
});
