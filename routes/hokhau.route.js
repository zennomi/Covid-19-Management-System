const express = require('express');
const router = express.Router();

const controller = require('../controllers/hokhau.controller');

router.get('/', controller.index);

module.exports = router;