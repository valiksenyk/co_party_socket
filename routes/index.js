var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.statusCode = 101;
  // res.sendFile('../pages/index.html');
  res.send( { title: 'Express' });
});

module.exports = router;
