const NhanKhau = require("../models/nhankhau.model");
const CachLy = require("../models/cachly.model");

module.exports = {
    index: async(req, res) => {
        let cachLys;
        try {
            cachLys = await CachLy.find({}).populate('nhanKhauId');
        } catch (err) {
            return res.render('error', { err });
        }
        res.render('cachly/index', { cachLys });
    },
    create: (req, res) => {
        res.render('cachly/create');
    },
    update: async(req, res) => {
        let cachLy;
        try {
            cachLy = await CachLy.findById(req.params.id).populate('nhanKhauId');
            if (!cachLy) throw new Erorr("Not found");
        } catch (err) {
            return res.render('error', { msg: `Nhân khẩu ${matchedNK.hoVaTen} đã khai báo cách ly.`, err });
        }
        res.render('cachly/update', { cachLy });
    },
    read: async(req, res) => {
        let nhanKhau;
        try {
            nhanKhau = await NhanKhau.findById(req.params.id);
            if (!nhanKhau) throw new Erorr("Not found");
        } catch (err) {
            return res.render('error', { err });
        }
        res.render('nhankhau/read', { nhanKhau });
    },
    delete: async(req, res) => {
        let cachLy;
        try {
            cachLy = await CachLy.findById(req.params.id);
            if (!cachLy) throw new Erorr("Not found");
        } catch (err) {
            return res.render('error', { err });
        }
        res.render('cachly/delete', { cachLy });
    },
    postCreate: async(req, res) => {
        let reqBody = req.body;
        let matchedNK, newCL;
        try {
            matchedNK = await NhanKhau.findOne({ soCCCD: reqBody.soCCCD });
            if (!matchedNK) throw ("not found");
        } catch (err) {
            return res.status(404).render('error', { err });
        }
        newCL = new CachLy({
            nhanKhauId: matchedNK._id,
            noiCachLy: reqBody.noiCachLy,
            thoiGian: reqBody.thoiGian,
            mucDo: reqBody.mucDo
        })
        try {
            await newCL.save();
        } catch (err) {
            return res.status(404).render('error', { err });
        }
        req.io.emit('cach-ly:change', 1);
        res.redirect('/cach-ly');
    },
    postUpdate: async(req, res) => {
        let reqBody = req.body;
        let cachLy;
        try {
            cachLy = await CachLy.findById(req.params.id);
            if (!cachLy) throw Error("Not Found");
        } catch (err) {
            return res.render('error', { err });
        }
        cachLy.noiCachLy = reqBody.noiCachLy;
        cachLy.thoiGian = reqBody.thoiGian;
        cachLy.mucDo = reqBody.mucDo;
        try {
            await cachLy.save();
        } catch (err) {
            return res.render('error', { err });
        }
        res.redirect('/cach-ly')
    },
    postDelete: async(req, res) => {
        CachLy.findByIdAndDelete(req.params.id, (err, result) => {
            if (err) return res.render('error', { err });
            req.io.emit('cach-ly:change', -1);
            res.redirect('/cach-ly');
        })
    }
}