const posts = require('./Post');
const users = require('./User');
const comments = require('./Comment');
const likes = require('./Like');

module.exports = {
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length 
    },
    Query: {
        ...posts.quires
    },
    Mutation: {
        ...posts.mutations,
        ...users.mutations,
        ...comments.mutations,
        ...likes.mutations
    },
    Subscription: {
        ...posts.Subscription
    }
}