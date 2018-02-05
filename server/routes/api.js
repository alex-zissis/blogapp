const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');  
const Strategy = require('passport-local');
const server = require('../../server');
const authenticate = server.authenticate;
const article = require('../models/article');
const category = require('../models/category');
const User = require('../models/user');
const verification = require('../models/verification');
require('dotenv').config()

let errRes = {};

const db = process.env.DBPATH;
const secret = process.env.JWT_SECRET;

mongoose.Promise = global.Promise;

mongoose.connect(db, {useMongoClient: true})
	.catch(err => console.error(err));
	
passport.use(new Strategy(  
	function(username, password, done) {
		User.findOne({username: username}, function (err, user) {
			if(err) {return done(err);}

			if(!user){
				return done(null, false, {message: 'Incorrect username.'});
			}

			User.comparePassword(password, user.password, function (err,isMatch) {
				if(err) {return done(err)};
				if(isMatch){
					return done(null, user);
				}else{
					return done(null, false, {message: "Invalid password"});
				}
			});
		});
	}
));

//get all articles
router.get('/all', function(req, res){
	article.find({deleted: false})	//find all articles that have not been deleted
		.exec(function(err, articles) {
			if (err) {	//if theres been an error return it
				errRes.message = "Error getting all articles by category.";
				return res.status(500).json(errRes);
			} else {
				//reverse the array to get the correct order of articles by time and then return it
				articles = articles.reverse();
				res.json(articles);
			}
		});
});

//get all articles from a certain category
router.get('/articles/category/:category', function(req, res){
	var categoryP = req.params.category;

	//check if the category passed exists
	category.findOne({name: categoryP})
		.exec(function(err, category){
			if(err){
				errRes.message = "Error getting all articles by category '" + categoryP + "'.";
				return res.status(500).json(errRes);
			} else {
				if(category != null){//if the category exists
					article.find({category: categoryP, deleted: false})//find all articles that haven't been deleted and are of the same category
						.exec(function(err, articles) {
							if (err) {
								err.message = "Error getting all articles by category '" + categoryP + "'.";
								return res.status(500).json(err);
							} else {
								articles = articles.reverse();
								res.json(articles);
							}
						});
				} else { //return the category does not exist
					errRes.message = "The category '" + categoryP + "' does not exist.";
					return res.status(404).json(errRes);
				}
			}
		});
});

//get all articles by a certain author
router.get('/articles/author/:author', function(req, res){
	//update when user auth is implemented
	var authorP = req.params.author;
	article.find({author: authorP, deleted: false})
		.exec(function(err, articles) {
			if (err) {
				errRes.message = "Error getting all articles by author '" + authorP + "'.";
				return res.status(404).json(errRes);
			} else {
				articles = articles.reverse();
				res.json(articles);
			}
		});
});

//get info on all categories
router.get('/categories/all', function(req, res){
	category.find({})
		.exec(function(err, categories) {
			if (err) {
				errRes.message = "Error getting all categories.";
				return res.status(404).json(errRes);
			} else { //sort categories by name
				categories.sort(function(a,b){
					return a.name.localeCompare(b.name);
				});
				res.json(categories);
			}
		});
});

//get individual category
router.get('/categories/info/:name', function(req, res){
	var categoryP = req.params.name;
	
	//find the category passed
	category.findOne({ name: categoryP})
		.exec(function(err, category) {
			if (err) {
				errRes.message = "There has been an error retreiving the info for category '" + categoryP +"'.";
				return res.status(500).json(errRes);
			} else {
				if(category){ //if the category exists return it
					res.json(category);
				} else {
					errRes.message = "The category '" + categoryP + "' does not exist.";
					return res.status(404).json(errRes);
				}
			}
		});
});

//get specific article
router.get('/articles/:id', function(req, res){
	article.findOne({_id : req.params.id}) //query the db for the article
		.exec(function(err,article){
			if(err){
				errRes.message = "There has been an error retreiving the article '" + req.params.id +"', or it does not exist.";
				return res.status(500).json(errRes);
			} else {
				if(article){//if the article exists check if it has been deleted
					if(article.deleted){ //if it has been deleted, return a 404
						errRes.message = "The selected post is no longer available.";
						return res.status(404).json(errRes);
					}else{
						res.json(article);
					}
				} else { //if the article doesn't exists return a 404
					errRes.message = "The requested article does not exist.";
					return res.status(404).json(errRes);
				}
			}
		});
});

//create article
router.post('/create', authenticate, function (req, res) {
	//assign the new article from the request into the correct class
	User.findOne({ username : req.user.username })
		.exec(function(err, usr) {
			if(!usr.author){
				errRes.type = "notauthor"
				errRes.message = "You are not authorised to create new articles.";
				return res.status(401).json(errRes);
			}else {
				let newArticle = new article();
				newArticle.title = req.body.title;
				newArticle.content = req.body.content;
				newArticle.author = req.body.author;
				newArticle.category = req.body.category;
				newArticle.deleted = false;

				//save the new object to the db
				newArticle.save(function(err, article) {
					if(err) {
						errRes.message = "The article could not be created.";
						return res.status(500).json(errRes);
					} else {
						res.json(article);
					}
				});
			}
		});
});

//create category
router.post('/categories', authenticate, function (req, res) {
	//see create article
	var newCategory = new category();
	newCategory.name = req.body.name;
	newCategory.color = req.body.color;

	newCategory.save(function(err, category) {
		if(err) {
			errRes.message = "The article could not be created.";
			return res.status(500).json(errRes);
		} else {
			res.json(category);
		}
	});
});

//update article
router.patch('/articles/update/:id', authenticate, function (req, res) {
    var updateObject = req.body; // get the object passed by the request
    var id = req.params.id;

	article.findById(id, function (err, post) { //find the article in the db
		if (err) {
			errRes.message = "The article '" + id + "' could not be updated.";
			return res.status(500).json(errRes);
		} 

		if(post.deleted){ //if the post has been deleted return a 404
			errRes.message = "The selected post is no longer available.";
			return res.status(404).json(errRes);
		}
		
		var altered = false;

		//find which attributes have been changed
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

		//if attributes have been changed update the date modified
		if(altered){
			post.updatedAt = Date.now();
		}

		//save the updated article to the db
		post.save(function (err, updPost) {
		  if (err) {
			errRes.message = "The article '" + id + "' could not be updated.";
			return res.status(500).json(errRes);  
		  }
		  res.send(updPost);
		});
	  });
});

//delete article
router.patch('/articles/delete/:id', authenticate, function (req, res, next) {
	var id = req.params.id;

	//find the article in the db
	article.findById(id, function (err, post) {
		if (err) {
			errRes.message = "The article '" + id + "' could not be deleted.";
			return res.status(500).json(errRes);
		} 
		//if its already deleted throw a 404
		if(post.deleted){
			errRes.message = "The selected post is no longer available.";
			return res.status(404).json(errRes);
		}else{//otherwise set it to deleted and update the date modified
			post.deleted = true;
			post.updatedAt = Date.now();
		}

		//save the updated object
		post.save(function (err, updPost) {
		  if (err) {
			errRes.message = "The article '" + id + "' could not be deleted.";
			return res.status(500).json(errRes);
		  } 
		  res.send(updPost);
		});
	});
});


/*-------------------------------------- USERS --------------------------------------*/


router.post('/users/register', function(req, res) {
	//create a new instance of user and set all the variables to the form values
	var newUser = new User();
	newUser.username = req.body.username.toLowerCase();
	newUser.email = req.body.email;
	newUser.fname = req.body.fname;
	newUser.lname = req.body.lname;
	newUser.password = req.body.password;
	newUser.verified = false;
	newUser.author = false;
	
	//hash and salt the password for storage
	bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(newUser.password, salt, function(err, hash) {
			newUser.password = hash;
			//save the user in the db
			newUser.save(function(err, user) {
				if(err) {
					errRes.message = "The user could not be created.";
					return res.status(500).json(errRes);
				} else {
					res.json(user);
				}
			});
    	});
	});
});

router.post('/users/auth', passport.authenticate(  
	'local', {
	  session: false
}), serialize, generateToken, respond);

router.get('/users/check', authenticate, function(req,res){
	return res.status(200).send(true);
});

router.get('/users/me', authenticate, function(req,res){
	let jwttoken = readToken(req);
	if(jwttoken == null){
		errRes.type = "nojwt"
		errRes.message = "You are not logged in.";
		return res.status(401).json(errRes);
	} else {
		var decoded = jwt.verify(jwttoken, secret);
	}

	if(decoded.username == req.user.username){
		User.findOne({username : req.user.username})
			.exec(function(err,user){
			if(err || !user) {
				errRes.type = "autherror"
				errRes.message = "Authentication error.";
				return res.status(401).json(errRes);
			}

			var returnedUsr = {
				username: user.username,
				fname: user.fname,
				lname: user.lname,
				email: user.email,
				verified: user.verified,
				author: user.author
			}
			return res.status(200).json(returnedUsr);
		});
	} else {
		errRes.type = "wrongtoken"
		errRes.message = "Incorrect authentication detials, please login again.";
		return res.status(401).json(errRes);
	}
});

function serialize(req, res, next) {  
	User.findOne({ username : req.user.username })
	.exec(function(err, usr) {
		if(err) {return next(err);}
		
		req.user = {
			username: usr.username,
			author: usr.author
		  };
		next();
	});
}

function generateToken(req, res, next) {  
	req.token = jwt.sign({
	  username: req.user.username,
	}, secret , {
	  expiresIn: '1h'
	});
	next();
}

function respond(req, res) {  
	res.status(200).json({
	  username: req.user.username,
	  token: req.token
	});
}

function readToken(req){
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
}

module.exports = router;