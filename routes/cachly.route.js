const express = require('express');
const router = express.Router();

const controller = require('../controllers/cachly.controller');

router.get('/', controller.index);
router.get('/them-moi', controller.create);
router.get('/:id/cap-nhat', controller.update);
router.get('/:id/xoa', controller.delete);

router.post('/them-moi', controller.postCreate);
router.post('/:id/cap-nhat', controller.postUpdate);
router.post('/:id/xoa', controller.postDelete);

module.exports = router;