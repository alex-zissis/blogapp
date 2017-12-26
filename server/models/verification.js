const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const verificationSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	token: {
		type: String,
		required: true,
		unique: true
    },
    createdAt: {
        type: Date,
        required: true
    },
	expiresAt: {
		type: Date,
		required: true
	}
});

module.exports = mongoose.model('verification', verificationSchema);