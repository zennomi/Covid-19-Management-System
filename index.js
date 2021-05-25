require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const sha256 = require('sha256');

const port = process.env.PORT ? process.env.PORT : 3000;

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
  console.log('Connected to MongoDB Atlas.');
}).catch((err) => {
  console.log(err, 'Error occurred connecting to MongoDB Atlas');
});

const CachLy = require('./models/cachly.model');
const KhaiBao = require('./models/khaibao.model');
const NhanKhau = require('./models/nhankhau.model');
const TestCovid = require('./models/testcovid.model');
const User = require('./models/user.model');

const nhanKhauRoutes = require('./routes/nhankhau.route');

const app = express();


app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  key: 'sid',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

app.use(require('express-flash')());

app.use((req, res, next) => {
  console.log(req.cookies.isLogged);
  // redirect when not logged yet
  if (!req.cookies.isLogged && req.path != '/auth/login' && req.path != '/') {
    return res.redirect('/');
  }
  if (req.cookies.isLogged && req.path == '/') return res.redirect('/dashboard');
  next();
})

app.use('/nhan-khau', nhanKhauRoutes);

app.get('/', (req, res) => {
  res.render('login');
});

app.get('/dich-te', (req, res) => {
  res.render('dichte/index');
})

app.get('/cach-ly', (req, res) => {
  res.render('cachly/index');
})

app.get('/test-covid', (req, res) => {
  res.render('testcovid/index');
})

app.post('/auth/login', async (req, res) => {
  let { username, password } = req.body;
  // hash password
  password = sha256(password);
  let user;
  try {
    user = await User.findOne({
      username: username,
      password: password
    });
    console.log({ username, password });
  } catch (err) {
    if (err) return res.render(err);
  }
  if (!user) {
    req.flash('warning', 'Sai thông tin người dùng. Vui lòng nhập lại.');
    return res.render('login');
  }
  req.flash('alert', 'Đăng nhập thành công.');
  res.cookie('isLogged', true, { expires: new Date(Date.now() + 7 * 24 * 3600), httpOnly: true });
  res.redirect('/dashboard');
})

app.get('/auth/logout', (req, res) => {
  res.clearCookie('isLogged');
  res.redirect('/');
})

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
})

app.route('/nhankhau/:soCCCD')
  .get(async (req, res) => {
    let nhankhau;
    try {
      nhankhau = NhanKhau.findOne({ soCCCD: req.params.soCCCD })
      if (!nhankhau) throw new Error("Couldn't find any nhankhau matching soCCCD");
    } catch (err) {
      return res.status(404).json({ msg: err });
    }
    res.json(nhankhau);
  })

app.listen(3000, () => {
  console.log('server started');
});