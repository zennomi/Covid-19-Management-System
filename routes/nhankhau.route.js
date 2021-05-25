const express = require('express');
const router = express.Router();

const controller = require('../controllers/nhankhau.controller');

router.get('/', controller.index);
router.get('/them-moi', controller.create);
router.get('/:id/cap-nhat', controller.update);

router.post('/them-moi', controller.postCreate);
router.post('/:id/cap-nhat', controller.update);

module.exports = router;

