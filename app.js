const createError = require('http-errors');

const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const MySQLSetting = require('./middleware/secure-configure.json').MySQL;

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.locals.basedir = path.join(__dirname);


app.use(logger('dev'));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'GAONGill_By_TROST',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(MySQLSetting)
}));

app.locals.pretty = true;

// Middlewares
const passport = require('./middleware/passport')(app);

// APIs
app.use('/api', require('./routes/api/kookbangIlbo'));
app.use('/api', require('./routes/api/policyProgressCount'));

// Views
app.use('/', require('./routes/index'));
app.use('/about', require('./routes/about'));
app.use('/general', require('./routes/general'));
app.use('/privacy-policy', require('./routes/privacy-policy'));
app.use('/auth', require('./routes/auth')(passport));
app.use('/policy', require('./routes/policy'));
app.use('/budget', require('./routes/budget'));
app.use('/commit', require('./routes/commit'));
app.use('/news', require('./routes/news'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
