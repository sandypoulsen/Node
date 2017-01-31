var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// todo model
var todoSchema = new Schema({
    content: String,
    completed: { type: Boolean, default: false },
    updated_at: { type: Date, default: Date.now }
});

mongoose.model('Todo', todoSchema);

// require('./config/models/Todo');
mongoose.connect('mongodb://localhost/express-todo', function(){
    console.log('connected to database!')
});

var main = require('./routes/main');
var todo = require('./routes/todo');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var todoRouter = express.Router();
app.use('/todos', todoRouter);

app.get('/', main.index);
todoRouter.get('/', todo.all);
todoRouter.get('/:id', todo.viewOne);
todoRouter.post('/create', todo.create);
todoRouter.post('/destroy/:id', todo.destroy);
todoRouter.post('/edit/:id', todo.edit);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
