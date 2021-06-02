const CachLy = require("../models/cachly.model");
const KhaiBao = require("../models/khaibao.model");
const NhanKhau = require("../models/nhankhau.model");
const HoKhau = require("../models/hokhau.model");
const TestCovid = require("../models/testcovid.model");

let io = require('../index').io;

module.exports = {
    index: async(req, res) => {
        let query = req.query || {};
        let nhanKhaus;
        try {
            nhanKhaus = await NhanKhau.find(query).populate('hoKhauId');
        } catch (err) {
            return res.render('error', { err });
        }
        res.render('nhankhau/index', { nhanKhaus, query });
    },
    create: (req, res) => {
        let query = req.query || {};
        res.render('nhankhau/create', { query });
    },
    update: async(req, res) => {
        let nhanKhau;
        try {
            nhanKhau = await NhanKhau.findById(req.params.id).populate('hoKhauId');
            if (!nhanKhau) throw new Erorr("Not found");
        } catch (err) {
            return res.render('error', { err });
        }
        res.render('nhankhau/update', { nhanKhau });
    },
    read: async(req, res) => {
        let nhanKhau, khaiBao, cachLy, testCovids;
        try {
            nhanKhau = await NhanKhau.findById(req.params.id).populate('hoKhauId');
            khaiBao = await KhaiBao.findOne({ nhanKhauId: req.params.id });
            cachLy = await CachLy.findOne({ nhanKhauId: req.params.id });
            testCovids = await TestCovid.find({ nhanKhauId: req.params.id });
            if (!nhanKhau) throw new Erorr("Not found");
        } catch (err) {
            return res.render('error', { err });
        }
        res.render('nhankhau/read', { nhanKhau, khaiBao, cachLy, testCovids });
    },
    delete: async(req, res) => {
        let nhanKhau;
        try {
            nhanKhau = await NhanKhau.findById(req.params.id);
            if (!nhanKhau) throw new Erorr("Not found");
        } catch (err) {
            return res.render('error', { err });
        }
        res.render('nhankhau/delete', { nhanKhau });
    },
    postCreate: async(req, res) => {
        let nhanKhau, hoKhau;
        try {
            hoKhau = await HoKhau.findOne({ maHoKhau: req.body.maHoKhau });
            if (!hoKhau) throw "Không tìm thấy hộ khẩu có mã " + req.body.maHoKhau;
            req.body.hoKhauId = hoKhau._id;
            nhanKhau = await NhanKhau.create(req.body);
            // if (nhanKhau.chuHo) {
            //   await NhanKhau.updateMany({ _id: { $ne: nhanKhau._id }, chuHo: true, maHoKhau: nhanKhau.maHoKhau }, { chuHo: false });
            // } else {
            //   let cungHoKhau = await NhanKhau.find({maHoKhau: nhanKhau.maHoKhau});
            //   if (cungHoKhau.length < 2) nhanKhau.chuHo = true;
            //   await nhanKhau.save();
            // }
        } catch (err) {
            return res.render('error', { err });
        }
        req.io.emit('nhan-khau:change', 1);
        req.flash('alert', `Thêm mới nhân khẩu ${nhanKhau.hoVaTen} hộ khẩu mã ${hoKhau.maHoKhau} thành công.`);
        res.redirect('/nhan-khau');
    },
    postUpdate: async(req, res) => {
        let nhanKhau, hoKhau;
        try {
            hoKhau = await HoKhau.findOne({ maHoKhau: req.body.maHoKhau }).populate('chuHoKhauId');
            if (!hoKhau) throw "Không tìm thấy hộ khẩu có mã " + req.body.maHoKhau;
            if (String(hoKhau.chuHoKhauId) == req.params.id) hoKhau.chuHoKhauId = undefined;
            await hoKhau.save();

            req.body.hoKhauId = hoKhau._id;
            nhanKhau = await NhanKhau.findByIdAndUpdate(req.params.id, req.body, { new: true });

            // if (nhanKhau.chuHo) {
            //   await NhanKhau.updateMany({ _id: { $ne: nhanKhau._id }, chuHo: true, maHoKhau: nhanKhau.maHoKhau }, { chuHo: false });
            // } else {
            //   let cungHoKhau = await NhanKhau.find({maHoKhau: nhanKhau.maHoKhau});
            //   if (cungHoKhau.length < 2) nhanKhau.chuHo = true;
            //   await nhanKhau.save();
            // }
        } catch (err) {
            return res.render('error', { err });
        }
        req.flash('alert', `Cập nhật nhân khẩu ${nhanKhau.hoVaTen} hộ khẩu mã ${hoKhau.maHoKhau} thành công.`);
        res.redirect('/nhan-khau/');
    },
    postDelete: async(req, res) => {
        try {
            await NhanKhau.findByIdAndDelete(req.params.id);
            await KhaiBao.deleteMany({ nhanKhauId: req.params.id });
            await CachLy.deleteMany({ nhanKhauId: req.params.id });
            await TestCovid.deleteMany({ nhanKhauId: req.params.id });
        } catch (err) {
            return res.render('error', { err });
        }
        req.io.emit('nhan-khau:change', -1);
        req.flash('alert', `Xoá một nhân khẩu thành công.`);
        res.redirect('/nhan-khau/');
    }
}