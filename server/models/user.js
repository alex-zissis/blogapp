const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	fname: {
		type: String,
		required: true
	},
	lname: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	verified: {
		type: Boolean,
		required: true
	}
},{
	timestamps: true
});

module.exports = mongoose.model('user', userSchema);