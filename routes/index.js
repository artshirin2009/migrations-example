var express = require('express');
var router = express.Router();
var Product = require('../models/product')
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping', function (err) {
  if (err) throw err;
  console.log('Successfully connected');
});


var csrf = require('csurf');
var csrfProtection = csrf({
  cookie: true
});

router.use(csrfProtection)




/* GET home page. */
router.get('/', csrfProtection, function (req, res, next) {
  res.render('shop/index', {
    title: 'Express'
  });
});

router.get('/shop', csrfProtection, function (req, res, next) {
  Product.find().then(
    function (doc) {
      res.render('shop/index', {
        products: doc
      })
    })

})

router.get('/user/signup', function (req, res) {
  // pass the csrfToken to the view
  res.render('user/signup', {
    csrfToken: req.csrfToken()
  })
})

router.post('/user/signup', function (req, res) {
  res.redirect('/shop')
})



module.exports = router;