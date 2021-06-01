const express = require('express');
const router = express.Router();

const TestCovid = require('../../models/testcovid.model');

router.get('/', async(req, res) => {
    let query = req.query || {};
    let testCovids;
    try {
        testCovids = await TestCovid.find(query);
    } catch (err) {
        return res.status(404).json({ msg: err });
    }
    res.json({ result: testCovids });
})

module.exports = router;