const NhanKhau = require("../models/nhankhau.model");
const TestCovid = require("../models/testcovid.model");

module.exports = {
    index: async(req, res) => {
        let testCovids;
        try {
            testCovids = await TestCovid.find({}).populate('nhanKhauId');
        } catch (err) {
            return res.render('error', { err });
        }
        res.render('testcovid/index', { testCovids });
    },
    create: (req, res) => {
        let query = req.query || {};
        res.render('testcovid/create', { query });
    },
    update: async(req, res) => {
        let testCovid;
        try {
            testCovid = await TestCovid.findById(req.params.id).populate('nhanKhauId');
            if (!testCovid) throw new Erorr("Not found");
        } catch (err) {
            return res.render('error', { err });
        }
        res.render('testcovid/update', { testCovid });
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
        let testCovid;
        try {
            testCovid = await TestCovid.findById(req.params.id);
            if (!testCovid) throw new Erorr("Not found");
        } catch (err) {
            return res.render('error', { err });
        }
        res.render('testcovid/delete', { testCovid });
    },
    postCreate: async(req, res) => {
        let reqBody = req.body;
        let matchedNK, newTC;
        try {
            matchedNK = await NhanKhau.findOne({ soCCCD: reqBody.soCCCD });
            if (!matchedNK) throw ("not found");
        } catch (err) {
            return res.status(404).render('error', { err });
        }
        newTC = new TestCovid({
            nhanKhauId: matchedNK._id,
            thoiDiemTest: reqBody.thoiDiemTest,
            hinhThucTest: reqBody.hinhThucTest,
            ketQua: reqBody.ketQua
        })
        try {
            await newTC.save();
        } catch (err) {
            return res.status(404).render('error', { err });
        }
        req.io.emit('test-covid:change', 1);
        if (req.body.ketQua == 'D????NG T??NH') {
            req.io.emit(encodeURI('test-covid?ketQua=D????NG+T??NH') + ':change', 1);
        }
        res.redirect('/test-covid');
    },
    postUpdate: async(req, res) => {
        let reqBody = req.body;
        let testCovid;
        try {
            testCovid = await TestCovid.findById(req.params.id);
            if (!testCovid) throw Error("Not Found");
        } catch (err) {
            return res.render('error', { err });
        }
        if (req.body.ketQua == 'D????NG T??NH' && testCovid.ketQua != 'D????NG T??NH') {
            req.io.emit(encodeURI('test-covid?ketQua=D????NG+T??NH') + ':change', 1);
        } else if (req.body.ketQua != 'D????NG T??NH' && testCovid.ketQua == 'D????NG T??NH') {
            req.io.emit(encodeURI('test-covid?ketQua=D????NG+T??NH') + ':change', -1);
        }
        testCovid.thoiDiemTest = reqBody.thoiDiemTest;
        testCovid.hinhThucTest = reqBody.hinhThucTest;
        testCovid.ketQua = reqBody.ketQua;
        try {
            await testCovid.save();
        } catch (err) {
            return res.render('error', { err });
        }
        res.redirect('/test-covid')
    },
    postDelete: async(req, res) => {
        TestCovid.findByIdAndDelete(req.params.id, (err, result) => {
            if (err) return res.render('error', { err });
            console.log(result);
            req.io.emit('test-covid:change', -1);
            if (result.ketQua == 'D????NG T??NH') {
                req.io.emit(encodeURI('test-covid?ketQua=D????NG+T??NH') + ':change', -1);
            }
            res.redirect('/test-covid');
        })
    }
}