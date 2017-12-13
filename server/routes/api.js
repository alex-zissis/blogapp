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
				console.log(articles);
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

module.exports = router;