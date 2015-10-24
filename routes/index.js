var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET index page. */
router.get('/index', function(req, res, next) {
  res.render('connection');
});

module.exports = router;
