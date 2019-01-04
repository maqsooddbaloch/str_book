const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Load User Model
require('./models/User');
require('./models/Story');


// Passport Config
require('./config/passport')(passport);

// Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
//const stories = require('./routes/stories');

// Load Keys
const keys = require('./config/keys');


const {

  truncate,
  stripTags,
} = require('./helpers/hbs');

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect(keys.mongoURI, {
  useNewUrlParser:true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
// Handlebars Middleware

//methodoverride

app.use(methodOverride('_method'));
app.engine('handlebars', exphbs({
  helpers:{
    truncate:truncate,
    stripTags:stripTags
  },
  defaultLayout:'main2'
}));
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


//bodyparser middleware
// parse application/x-www-form-urlencoded


// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use Routes
app.use('/', index);
app.use('/auth', auth);
//app.use('/stories', stories);

const port = process.env.PORT || 6789;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});