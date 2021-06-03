const NhanKhau = require('../models/nhankhau.model');
const HoKhau = require('../models/hokhau.model');

module.exports = {
    index: async(req, res) => {
        let hoKhaus;
        try {
            hoKhaus = await HoKhau.find().populate('nhanKhau').populate('chuHoKhauId');
        } catch (err) {
            return res.render('error', { err })
        }
        res.render('hokhau/index', { hoKhaus });
    },
    create: async(req, res) => {
        res.render('hokhau/create');
    },
    update: async(req, res) => {
        let hoKhau;
        try {
            hoKhau = await HoKhau.findById(req.params.id).populate('nhanKhau').populate('chuHoKhauId');
            if (!hoKhau) throw "not found";
        } catch (err) {
            return res.render('error', { err });
        }
        res.render('hokhau/update', { hoKhau });
    },
    delete: async(req, res) => {
        let hoKhau;
        try {
            hoKhau = await HoKhau.findById(req.params.id);
            if (!hoKhau) throw ("Not found");
        } catch (err) {
            return res.render('error', { err });
        }
        res.render('hokhau/delete', { hoKhau });
    },
    postCreate: async(req, res) => {
        let newHoKhau;
        try {
            newHoKhau = await HoKhau.create(req.body);
        } catch (err) {
            return res.render('error', { err })
        }
        req.io.emit('ho-khau:change', 1);
        res.redirect('/ho-khau');
    },
    postUpdate: async(req, res) => {
        let hoKhau;
        try {
            hoKhau = await HoKhau.findByIdAndUpdate(req.params.id, req.body, { new: true });
            console.log(hoKhau);
        } catch (err) {
            return res.render('error', { err })
        }
        res.redirect('/ho-khau');
    },
    postDelete: async(req, res) => {
        let hoKhau;
        try {
            hoKhau = await HoKhau.findById(req.params.id).populate('nhanKhau');
            if (hoKhau.nhanKhau.length > 0) {
                throw "Hộ khẩu chứa nhân khẩu không thể xoá";
            } else {
                await HoKhau.findByIdAndDelete(req.params.id);
                req.io.emit('ho-khau:change', -1);
            }
        } catch (err) {
            return res.render('error', { err });
        }
        req.flash('alert', `Xoá một nhân khẩu thành công.`);
        res.redirect('/ho-khau/');
    }
}