const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const indexRouter = require('./routes/index');
const roomsRouter = require('./routes/rooms');

const initListeners = require('./listeners');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * CORS set up
 */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});
app.use('/', indexRouter);
app.use('/rooms', roomsRouter);

/**
 * DB connection
 */
mongoose.connect(
    'mongodb+srv://coparty_valik:pLnhQZR!L-YJ95v@cluster0.mjvxw.mongodb.net/coparty_db?retryWrites=true&w=majority',
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false
    }, (err) => {
      if (err) {
        return console.log('DB connection error', err)
      }

        mongoose.Promise = global.Promise;

      /**
       * Server init
       */
      http.listen(3000, () => {
        console.log('listening on *:3000');
      });

    });

/**
 * Socket init
 */
initListeners(io);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  console.log(err);
});
