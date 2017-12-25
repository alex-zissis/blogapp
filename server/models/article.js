const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	deleted: {
		type: Boolean,
	}
},{
	timestamps: true
});

module.exports = mongoose.model('article', articleSchema);