const express = require('express');
const router = express.Router();
const { getPublicPassport, getPassportQR } = require('../controllers/publicController');

router.get('/passport/:studentId', getPublicPassport);
router.get('/qr/:studentId', getPassportQR);

module.exports = router;
