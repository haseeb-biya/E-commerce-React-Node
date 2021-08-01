import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import morgan from 'morgan'
import connectDB from './config/db.js'
import bodyparser from 'body-parser';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import flash from 'connect-flash'
import session from 'express-session'
import exphbs from 'express-handlebars';
import methodOverride from 'method-override'
import passport from 'passport';
import passportLocal from 'passport-local'
import Passport from './config/passport.js'

const app = express()
const __dirname = path.resolve(path.dirname(''));
app.use(express.static(path.resolve('./public')));
if (process.env.NODE_ENV === 'Development') {
  app.use(morgan('dev'))
}
//register custom handlers
app.engine('handlebars', exphbs({
    helpers: {
    trimString: function (passedString) {
        var string = passedString.substring(0, 100);
        var appended = string + "...";
        return appended;  
    },
    prettifyDate: function (timestamp) {
      function addZero(i) {
                if (i < 10) {
                  i = "0" + i;
                }
                return i;
      }
      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday','Friday','Saturday']
            var day = timestamp.getDay();
            var curr_date = timestamp.getDate();
            var curr_month = timestamp.getMonth();
            curr_month++;
            var curr_year = timestamp.getFullYear();

      var result = days[day] + " " + addZero(curr_date) + "/" + addZero(curr_month) + "/" + addZero(curr_year);
            return result;
    },
    math: function (lvalue, operator, rvalue, options) {
      lvalue = parseFloat(lvalue);
      rvalue = parseFloat(rvalue);

      switch (operator) {
        case '+':
          return lvalue + rvalue
        case '-':
          return lvalue - rvalue
        case '*':
          return lvalue * rvalue
        case '/':
          return lvalue/rvalue
      }
    },
    ifCond: function (v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
      }
    },
    },
defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(methodOverride('_method'));


app.use(bodyparser.urlencoded({ extended: false }))

app.use(session({
  secret: 'where is the cat',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Global Variable
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.errors = req.flash('error')
  res.locals.user = req.user || null
  next()
})


dotenv.config({ path: path.resolve(__dirname + '/backend/.env') });
dotenv.config()
connectDB();

Passport(passport);
app.use('/', adminRoutes)
app.get('/login', (req, res) => {
  res.render('login');
})
app.post('/login', (req, res,next) => {
  passport.authenticate('local', function (err, user, info) {
    if (info) {
      req.flash('error_msg', info.message);
      res.redirect('/login');
   }
    req.login(user, loginErr => {
      if (loginErr) {
        req.flash("error_msg","Login Failed")
        return next(loginErr);
      }
      res.redirect('/');
    });      
  })(req,res,next);
})
app.use(express.json())
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/category', categoryRoutes);
app.use(notFound);
app.use(errorHandler);



const PORT = process.env.PORT || 3002
app.listen(PORT, console.log(`App running on port ${PORT}`));