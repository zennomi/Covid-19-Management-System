const express = require('express');
const router = express.Router();

const KhaiBao = require('../../models/khaibao.model');

router.get('/', async(req, res) => {
    let khaiBaos;
    try {
        khaiBaos = await KhaiBao.find();
    } catch (err) {
        return res.status(404).json({ msg: err });
    }
    res.json({ result: khaiBaos });
})

module.exports = router;