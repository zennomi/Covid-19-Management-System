const express = require('express');
const router = express.Router();

const HoKhau = require('../../models/hokhau.model');

router.get('/', async(req, res) => {
    HoKhau.find({}, (err, hoKhaus) => {
        if (err) return res.json({ err });
        res.json({ result: hoKhaus });
    })
})

module.exports = router;