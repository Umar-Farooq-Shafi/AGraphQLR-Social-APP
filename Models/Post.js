const {Schema, model} = require('mongoose');

const post = new Schema({
    body: String,
    username: String,
    createdAt: String,
    comments: [
        {
            body: String,
            username: String,
            createdAt: String
        },
    ],
    likes: [
        {
            username: String,
            createdAt: String
        }
    ],
    // Relationship MANY-TO-ONE to users collection
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = model('Post', post);
