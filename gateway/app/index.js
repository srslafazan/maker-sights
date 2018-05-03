const express = require('express')
const http = require('http')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;

const app = express()

const mongo = mongoose.connect(`mongodb://mongo-${process.env.NODE_ENV || 'development'}/makersight`)

const PORT = process.env.PORT || 9011

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

const User = mongoose.model('User', {
  googleId: Number,
})

passport.use(new GoogleStrategy({
    consumerKey: '299025341016-gc80o6eegvppnm5h1eqiahlq1egm9tpk.apps.googleusercontent.com', // TODO - env variables
    consumerSecret: '3MvkRirgp-ER7J0SGJaHssLe', // TODO - env variables
    callbackURL: "http://localhost:4200/auth/google/callback",
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

app.get('/', function (req, res) {
  res.render('index.ejs', {
    title: 'Sanity',
    message: 'It\'s overrated. Seriously',
    environment: process.env.NODE_ENV,
  })
})

app.get('/hello', function(req, res, next) {
  res.send('Hello from your node server, mon!')
})

app.get('/health', function(req, res, next) {
  res.send({ healthy: true })
})

app.post('/hello', function(req, res, next) {
  const { data } = req.body
  console.log('Received data from post request: ', data)
  res.send(data)
})

app.get('/users/create', function(req, res, next) {
  const user = new User({ name: 'Zildjian' })
  user.save().then(() => {
    console.log('user: ', user)
    res.send(user)
  })
})

app.get('/auth/google',
  passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

// app.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found')
//   err.status = 404
//   next(err)
// })

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message
//   res.locals.error = req.app.get('env') === 'development' ? err : {}

//   // render the error page
//   res.status(err.status || 500)
//   res.render('error.html', {req, res})
// })

http.createServer(app).listen(PORT, function() {
  console.log('Listening on port ' + (PORT))
})