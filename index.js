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
const khaiBaoRoutes = require('./routes/khaibao.route');
const cachLyRoutes = require('./routes/cachly.route');
const testCovidRoutes = require('./routes/testcovid.route');
const hoKhauRoutes = require('./routes/hokhau.route');

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


app.get('/api/nhan-khau/', async (req, res) => {
  let nhanKhaus;
  try {
    nhanKhaus = await NhanKhau.find();
  } catch (err) {
    return res.status(404).json({ msg: err });
  }
  res.json({ result: nhanKhaus });
})

app.get('/api/khai-bao/', async (req, res) => {
  let khaiBaos;
  try {
    khaiBaos = await KhaiBao.find();
  } catch (err) {
    return res.status(404).json({ msg: err });
  }
  res.json({ result: khaiBaos });
})

app.get('/api/test-covid/', async (req, res) => {
  let query = req.query || {};
  let testCovids;
  try {
    testCovids = await TestCovid.find(query);
  } catch (err) {
    return res.status(404).json({ msg: err });
  }
  res.json({ result: testCovids });
})

app.get('/api/cach-ly/', async (req, res) => {
  let cachLys;
  try {
    cachLys = await CachLy.find();
  } catch (err) {
    return res.status(404).json({ msg: err });
  }
  res.json({ result: cachLys });
})

app.get('/api/ho-khau', async (req, res) => {
  NhanKhau.aggregate([
      {
          $group: {
              _id: "$maHoKhau",
              count: { $sum: 1 },
              hoVaTen: {
                  $push: {
                      $cond: {
                          if: { $eq: ["$chuHo", true] },
                          then: "$hoVaTen",
                          else: null
                      }
                  }
              }
          }
      },
      {
          $unwind: "$hoVaTen"
      },
      {
          $match: {
              hoVaTen: {
                  $ne: null
              }
          }
      }
  ], (err, hoKhaus) => {
      if (err) return res.render('error', { err });
      res.json({ result: hoKhaus });
  })
})

app.route('/api/nhan-khau/:soCCCD')
  .get(async (req, res) => {
    let nhanKhau;
    try {
      nhanKhau = await NhanKhau.findOne({ soCCCD: req.params.soCCCD });
      if (!nhanKhau) throw new Error("Couldn't find any nhanKhau matching soCCCD");
    } catch (err) {
      return res.status(404).json({ msg: err });
    }
    res.json({ nhanKhau });
  })

app.use((req, res, next) => {
  // redirect when not logged yet
  res.locals.mainPath = req.path.split("/")[1];
  if (!req.cookies.isLogged && req.path != '/auth/login' && req.path != '/') {
    return res.redirect('/');
  }
  if (req.cookies.isLogged && req.path == '/') return res.redirect('/dashboard');
  next();
})

app.use('/nhan-khau', nhanKhauRoutes);
app.use('/khai-bao', khaiBaoRoutes);
app.use('/cach-ly', cachLyRoutes);
app.use('/test-covid', testCovidRoutes);
app.use('/ho-khau', hoKhauRoutes);

app.get('/', (req, res) => {
  res.render('login');
});

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
  } catch (err) {
    if (err) return res.render(err);
  }
  if (!user) {
    req.flash('warning', 'Sai thông tin người dùng. Vui lòng nhập lại.');
    return res.render('login');
  }
  req.flash('alert', 'Đăng nhập thành công.');
  res.cookie('isLogged', true, { expires: new Date(Date.now() + 7 * 24 * 3600 * 1000), httpOnly: true });
  res.redirect('/dashboard');
})

app.get('/auth/logout', (req, res) => {
  res.clearCookie('isLogged');
  res.redirect('/');
})

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
})

app.get('/thong-ke', (req, res) => {
  res.render('thongke');
})

app.listen(port, () => {
  console.log('server started at port ' + port);
});