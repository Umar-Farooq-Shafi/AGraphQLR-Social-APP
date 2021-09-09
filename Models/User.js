const {Schema, model} = require('mongoose');

const user = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String
});

module.exports = model('User', user);