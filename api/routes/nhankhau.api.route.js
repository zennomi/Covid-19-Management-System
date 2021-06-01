const express = require('express');
const router = express.Router();

const NhanKhau = require('../../models/nhankhau.model');

router.get('/', async(req, res) => {
    let nhanKhaus;
    try {
        nhanKhaus = await NhanKhau.find();
    } catch (err) {
        return res.status(404).json({ msg: err });
    }
    res.json({ result: nhanKhaus });
})

router.get('/:soCCCD', async(req, res) => {
    let nhanKhau;
    try {
        nhanKhau = await NhanKhau.findOne({ soCCCD: req.params.soCCCD });
        if (!nhanKhau) throw ("Couldn't find any nhanKhau matching soCCCD");
    } catch (err) {
        return res.status(404).json({ msg: err });
    }
    res.json({ nhanKhau });
})

module.exports = router;