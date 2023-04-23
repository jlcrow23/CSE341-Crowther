const express = require('express');
const router = express.Router();

router.use('/contacts', require('../../Personal/controllers/contacts'));

module.exports = router;