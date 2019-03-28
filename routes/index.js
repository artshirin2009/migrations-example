var express = require('express');
var router = express.Router();
var Product = require('../models/product')
var mongoose = require('mongoose');
var redis = require('redis'),
client = redis.createClient();


mongoose.connect('mongodb://localhost:27017/shopping', function (err) {
  if (err) throw err;
  console.log('Successfully connected');
});


var csrf = require('csurf');
var csrfProtection = csrf({
  cookie: true
});

//router.use(csrfProtection)




/* GET home page. */
router.get('/', csrfProtection, function (req, res, next) {
  res.render('shop/index', {
    title: 'Express'
  });
});
/**Regis cache added */
router.get('/shop', csrfProtection, function (req, res, next) {
  client.get('/shop', function(err, result){
    if(err){ throw err}
    if(result) {
      res.render('shop/index', {
        products: JSON.parse(result)
      })
    }
    else{
      setTimeout(() => {
        Product.find().then(
          function (doc) {
            client.set('/shop',JSON.stringify(doc))  
            res.render('shop/index', {
              products: doc
            })
          })
      }, 3000);
    }
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





/* GET home page. */
router.post('/', function (req, res, next) {
  let user = req.body
  client.set('user',JSON.stringify(user), function(err,ok){
    res.json(ok)
  })
});
router.get('/redisobject', function (req, res, next) {
  client.get('user', function(err,user){
    res.json(JSON.parse(user))
  })
});




module.exports = router;