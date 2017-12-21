const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const article = require('../models/article');

const db = "mongodb://articles-admin:qb4u.2d8@localhost:27017/blogapp";

mongoose.Promise = global.Promise;

mongoose.connect(db, function(err) {
	if(err) {
		console.log('Error connecting');
	}
});

router.get('/all', function(req, res){
	article.find({})
		.exec(function(err, articles) {
			if (err) {
				console.log('Error getting the articles');
			} else {
				res.json(articles);
			}
		});
});

router.get('/articles/:id', function(req, res){
	console.log('requesting a specific article: ' + req.params.id);
	article.findById(req.params.id)
		.exec(function(err, article) {
			if (err) {
				console.log('Error getting the article');
			} else {
				res.json(article);
			}
		});
});

router.post('/create', function (req, res) {
	console.log('Posting an article');
	var newArticle = new article();
	newArticle.title = req.body.title;
	newArticle.content = req.body.content;
	newArticle.author = req.body.author;

	newArticle.save(function(err, article) {
		if(err) {
			console.log('error creating an article');
		} else {
			res.json(article);
		}
	});
});

router.patch('/articles/update/:id', function (req, res) {
    var updateObject = req.body; // {last_name : "smith", age: 44}
    var id = req.params.id;

	article.findById(id, function (err, post) {
		if (err) return console.log(err);
		
		var altered = false;

		if(post.title != updateObject.title){
			post.title = updateObject.title;
			altered = true;
		}

		if(post.content != updateObject.content){
			post.content = updateObject.content;
			altered = true;
		}

		if(altered){
			post.updatedAt = Date.now();
		}

		post.save(function (err, updPost) {
		  if (err) return console.log(err);
		  res.send(updPost);
		});
	  });
});

module.exports = router;
