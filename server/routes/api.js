const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const article = require('../models/article');
const category = require('../models/category');

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
				articles = articles.reverse();
				res.json(articles);
			}
		});
});

router.get('/articles/category/:category', function(req, res){
	var categoryP = req.params.category;
	console.log(categoryP);
	article.find({category: categoryP})
		.exec(function(err, articles) {
			if (err) {
				console.log('Error getting the articles');
			} else {
				articles = articles.reverse();
				res.json(articles);
			}
		});
});

router.get('/articles/author/:author', function(req, res){
	var authorP = req.params.author;
	article.find({author: authorP})
		.exec(function(err, articles) {
			if (err) {
				console.log('Error getting the articles');
			} else {
				articles = articles.reverse();
				res.json(articles);
			}
		});
});

router.get('/categories/all', function(req, res){
	category.find({})
		.exec(function(err, categories) {
			if (err) {
				console.log('Error getting the categories');
			} else {
				categories.sort(function(a,b){
					return a.name.localeCompare(b.name);
				});
				res.json(categories);
			}
		});
});

router.get('/categories/:name', function(req, res){
	console.log('requesting a specific category: ' + req.params.name);
	article.find({ category: req.params.name})
		.exec(function(err, articles) {
			if (err) {
				console.log('Error getting the category\'s articles');
			} else {
				res.json(articles);
			}
		});
});

router.get('/categories/info/:name', function(req, res){
	console.log('requesting a specific category to get the color: ' + req.params.name);
	category.findOne({ name: req.params.name})
		.exec(function(err, category) {
			if (err) {
				console.log('Error getting the category\'s info');
			} else {
				res.json(category);
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
	newArticle.category = req.body.category;

	newArticle.save(function(err, article) {
		if(err) {
			console.log('error creating an article');
		} else {
			res.json(article);
		}
	});
});

router.post('/categories', function (req, res) {
	console.log('Posting a category');
	var newCategory = new category();
	newCategory.name = req.body.name;
	newCategory.color = req.body.color;

	newCategory.save(function(err, category) {
		if(err) {
			console.log('error creating an category');
		} else {
			res.json(category);
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

		if(post.category != updateObject.category){
			post.category = updateObject.category;
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