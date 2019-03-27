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
          item.authorFisrtName = item.author.split(' ')[0];
          item.authorLastName = item.author.split(' ')[1];
          db.collection('products').updateOne({ "_id": item._id }, {
            $set: { 
              updatedPrice: item.price *1.05,
              authorFisrtName: item.authorFisrtName,
              authorLastName: item.authorLastName
            },
            $unset: {
              la: "",
              lastFielddsfd: "",
              lass: "",
              lasse: "",
              lastField: "",
              dfs32: "",
              dfs: "",
              newField: "",
              author: ""
            }
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