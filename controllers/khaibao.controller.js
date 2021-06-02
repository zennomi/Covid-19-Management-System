const NhanKhau = require("../models/nhankhau.model");
const KhaiBao = require("../models/khaibao.model");

module.exports = {
    index: async(req, res) => {
        let khaiBaos;
        try {
            khaiBaos = await KhaiBao.find({}).populate('nhanKhauId');
        } catch (err) {
            return res.render('error', { err });
        }
        res.render('khaibao/index', { khaiBaos });
    },
    create: (req, res) => {
        res.render('khaibao/create');
    },
    update: async(req, res) => {
        let khaiBao;
        try {
            khaiBao = await KhaiBao.findById(req.params.id).populate('nhanKhauId');
            if (!khaiBao) throw new Erorr("Not found");
        } catch (err) {
            return res.render('error', { err });
        }
        res.render('khaibao/update', { khaiBao });
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
        let khaiBao;
        try {
            khaiBao = await KhaiBao.findById(req.params.id);
            if (!khaiBao) throw new Erorr("Not found");
        } catch (err) {
            return res.render('error', { err });
        }
        res.render('khaibao/delete', { khaiBao });
    },
    postCreate: async(req, res) => {
        let reqBody = req.body;
        let matchedNK, newKB;
        try {
            matchedNK = await NhanKhau.findOne({ soCCCD: reqBody.soCCCD });
            if (!matchedNK) throw ("not found");
        } catch (err) {
            return res.status(404).render('error', { err });
        }
        newKB = new KhaiBao({
            nhanKhauId: matchedNK._id,
            vungDich: reqBody.vungDich ? reqBody.vungDich.split(";") : [],
            tiepXuc: reqBody.tiepXuc ? reqBody.tiepXuc.split(";") : [],
            ngayKhaiBao: reqBody.ngayKhaiBao,
            bieuHien: reqBody.bieuHien || [],
            benhNen: reqBody.benhNen || []
        })
        try {
            await newKB.save();
        } catch (err) {
            return res.status(404).render('error', { err });
        }
        req.io.emit('khai-bao:change', 1);
        res.redirect('/khai-bao');
    },
    postUpdate: async(req, res) => {
        let reqBody = req.body;
        let khaiBao;
        try {
            khaiBao = await KhaiBao.findById(req.params.id);
            if (!khaiBao) throw Error("Not Found");
        } catch (err) {
            return res.render('error', { msg: `Nhân khẩu ${matchedNK.hoVaTen} đã khai báo dịch tễ.`, err });
        }
        khaiBao.vungDich = reqBody.vungDich ? reqBody.vungDich.split(";") : [];
        khaiBao.tiepXuc = reqBody.tiepXuc ? reqBody.tiepXuc.split(";") : [];
        khaiBao.ngayKhaiBao = reqBody.ngayKhaiBao;
        khaiBao.bieuHien = reqBody.bieuHien || [];
        khaiBao.benhNen = reqBody.benhNen || []
        try {
            await khaiBao.save()
        } catch (err) {
            return res.render('error', { err });
        }
        req.io.emit('khai-bao:change', 0);
        res.redirect('/khai-bao')
    },
    postDelete: async(req, res) => {
        KhaiBao.findByIdAndDelete(req.params.id, (err, result) => {
            if (err) return res.render('error', { err });
            req.io.emit('khai-bao:change', -1);
            res.redirect('/khai-bao');
        })
    }
}