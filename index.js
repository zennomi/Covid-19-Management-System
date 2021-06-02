require('dotenv').config();

const http = require('http');
const { Server } = require("socket.io");

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

const User = require('./models/user.model');

const nhanKhauRoutes = require('./routes/nhankhau.route');
const khaiBaoRoutes = require('./routes/khaibao.route');
const cachLyRoutes = require('./routes/cachly.route');
const testCovidRoutes = require('./routes/testcovid.route');
const hoKhauRoutes = require('./routes/hokhau.route');

const nhanKhauApiRoutes = require('./api/routes/nhankhau.api.route');
const khaiBaoApiRoutes = require('./api/routes/khaibao.api.route');
const cachLyApiRoutes = require('./api/routes/cachly.api.route');
const testCovidApiRoutes = require('./api/routes/testcovid.api.route');
const hoKhauApiRoutes = require('./api/routes/hokhau.api.route');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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

app.use('/api/nhan-khau', nhanKhauApiRoutes);
app.use('/api/khai-bao', khaiBaoApiRoutes);
app.use('/api/cach-ly', cachLyApiRoutes);
app.use('/api/test-covid', testCovidApiRoutes);
app.use('/api/ho-khau', hoKhauApiRoutes);

app.use((req, res, next) => {
    // init io
    req.io = io;
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

app.post('/auth/login', async(req, res) => {
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
        req.flash('username', req.body.username);
        req.flash('password', req.body.password);
        return res.redirect('/auth/login/#login');
    }
    req.flash('alert', 'Đăng nhập thành công với tài khoản ' + username + '.');
    if (req.body.remember)
        res.cookie('isLogged', true, { expires: new Date(Date.now() + 7 * 24 * 3600 * 1000), httpOnly: true });
    else res.cookie('isLogged', true, { httpOnly: true });
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

server.listen(port, () => {
    console.log('server started at port ' + port);
});