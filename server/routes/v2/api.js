const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const Strategy = require('passport-local');
const server = require('../../../server');
const authenticate = server.authenticate;
require('dotenv').config()

let errRes = {}

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DB,
    charset: 'utf8'
  }
});

const bookshelf = require('bookshelf')(knex);

const User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  idAttribute: 'username',
  hasTimestamps: ['createdat', 'updatedat'],
  allArticles: function() {
    return this.hasMany(articles, 'author' ,'username');
  }
});

const categories = bookshelf.Model.extend({
  tableName: 'categories',
  idAttribute: 'name',
  allArticles: function() {
    return this.hasMany(articles, 'category' ,'name');
  }
});

const articles = bookshelf.Model.extend({
  tableName: 'articles',
  idAttribute: '_id',
  hasTimestamps: true,
  hasTimestamps: ['createdat', 'updatedat']
});


//CALLS
router.get('/all', function(req, res){
	articles.fetchAll().then(function (articleList) {
    articleList = parseRes(articleList).reverse();
		res.json(articleList);
	}).catch(function(err) {
    errRes.message = 'Error retrieving articles.';
    return res.status(500).json(errRes);
  });
});

router.get('/articles/category/:category', function(req, res){
  const categoryParam = req.params.category;
  categories.where({'name': categoryParam}).fetch({withRelated: ['allArticles']}).then(function(categoryList) {
    categoryList = parseRes(categoryList.related('allArticles')).reverse();
    res.json(categoryList);
	}).catch(function(err) {
    errRes.message = 'Error retrieving all articles by category ' + categoryParam +'.';
    return res.status(500).json(errRes);
  });
});

router.get('/categories/info/:name', function(req, res){
	let categoryParam = req.params.name;

  new categories({'name': categoryParam})
    .fetch()
    .then(function(categoryObj) {
      res.json(categoryObj);
   }).catch(function(err) {
    errRes.message = 'Error retrieving information on all category ' + categoryParam +'.';
    return res.status(500).json(errRes);
   });
});

router.get('/articles/:id', function(req, res){
	let articleParam = req.params.id;

    new articles({'_id': articleParam})
      .fetch()
      .then(function(articleObj) {
        res.json(articleObj);
      }).catch(function(err) {
        errRes.message = 'Error retrieving article ' + articleParam +'.';
        return res.status(500).json(errRes);
     });
});

router.post('/create', authenticate, function (req, res) {
  //assign the new article from the request into the correct class
  if(req.body.title.length < 10 || req.body.title.length > 255) {
    errRes.type = "badtitlelength"
    errRes.message = "The title field was unprocessable. Ensure the length is greater than 10 characters or below 255.";
    return res.status(422).json(errRes);
  }

  if(req.body.content.length < 10) {
    errRes.type = "badcontentlength"
    errRes.message = "Ensure the content is greater than 10 characters.";
    return res.status(422).json(errRes);
  }

  let categExist = false;
  new categories({'name': req.body.category})
    .fetch()
    .then(function(cat){
      cat = parseRes(cat);
      if(cat) {
        new User({'username': req.user.username})
          .fetch()
          .then(function(usr) {
            usr = parseRes(usr);
            console.log(usr);
            if(!usr.author){
              errRes.type = "notauthor"
              errRes.message = "You are not authorised to create new articles.";
              return res.status(401).json(errRes);
            } else {
              let newArticle = new articles({
                _id: '123456789063321',
                title: req.body.title,
                content: req.body.content,
                author: req.user.username,
                category: req.body.category,
                deleted: false,
              })
                .save(null, {method: 'insert'})
                .then(function(model) {
                  res.json(model);
                });
            }
          }).catch(function(err) {
            errRes.message = 'Error posting article please try again.';
            return res.status(500).json(errRes);
          });
      } else {
        errRes.message = 'The article could not bee created as the category passed does not exist.';
        return res.status(422).json(errRes);
      }
    }).catch(function(err) {
      console.log(err);
      errRes.message = 'The article could not bee created as the category passed does not exist.';
      return res.status(422).json(errRes);
    });
});

/*articles.fetchAll().then(function (result) {
  res = parseRes(result);
})

User.where({'username': 'alex'}).fetch({withRelated: ['allArticles']}).then(function(user) {
  console.log(JSON.parse(JSON.stringify(user.related('allArticles')))[0]);
});*/

function parseRes(rawRes) {
  return JSON.parse(JSON.stringify(rawRes))
}

module.exports = router;
