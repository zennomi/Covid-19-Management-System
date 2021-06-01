const express = require('express');
const router = express.Router();

const CachLy = require('../../models/cachly.model');

router.get('/', async(req, res) => {
    let cachLys;
    try {
        cachLys = await CachLy.find();
    } catch (err) {
        return res.status(404).json({ msg: err });
    }
    res.json({ result: cachLys });
})

module.exports = router;