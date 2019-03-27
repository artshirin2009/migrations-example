'use strict'
const Bluebird = require('bluebird')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const url = 'mongodb://localhost/shopping'
Bluebird.promisifyAll(MongoClient)

module.exports.up = next => {
  let mClient = null
  return MongoClient.connect(url, { useNewUrlParser: true })
    .then(client => {
      mClient = client
      return client.db();
    })
    //Update item values in collection using old values
    .then(db => {
      const Product = db.collection('products')
      return Product
        .find({})
        .toArray()
        .then(res => res.map(item => {
          db.collection('products').updateOne({ "_id": item._id }, {
            $set: { updatedPrice: item.price * 3 },
            $unset: { la: "",
                      lastFielddsfd: "",
                      lass: "",
                      lasse: "",
                      lastField: "",
                      dfs32: "",
                      dfs: "",
                      newField: "" },
          });
        }
        ));

    })
    .then(() => {
      mClient.close()
      return next()
    })
    .catch(err => next(err))
}