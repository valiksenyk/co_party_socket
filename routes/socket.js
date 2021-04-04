const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/socket', function(req, res, next) {
    io.on('connected', (socket) => {
        console.log('connected', socket);
    })
});

module.exports = router;
