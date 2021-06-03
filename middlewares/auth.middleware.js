module.exports = {
    loggedRequire: (req, res, next) => {
        if (!req.cookies.isLogged && req.path != '/auth/login' && req.path != '/') {
            req.flash('warning', 'Bạn phải đăng nhập trước khi vào mục này.');
            return res.redirect('/#login');
        }
        if (req.cookies.isLogged && req.path == '/') return res.redirect('/dashboard');
        next();
    },
    loggedApiRequire: (req, res, next) => {
        if (!req.cookies.isLogged) {
            req.flash('warning', 'Bạn phải đăng nhập trước khi vào mục này.');
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    }
}