var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.next('error');
  console.log(err);
});

/**
 * Setup socket.io
 */
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('mix', (soundParams) => {
    socket.broadcast.emit('mix', soundParams);
  })

  socket.on('start', () => {
    socket.broadcast.emit('start');
  })

  socket.on('stop', () => {
    socket.broadcast.emit('stop');
  })

  socket.on('disconnect', () => {
    console.log('disconnected');
  })
})

// module.exports = app;
