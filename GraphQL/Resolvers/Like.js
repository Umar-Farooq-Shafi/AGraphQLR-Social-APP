const { UserInputError, AuthenticationError } = require('apollo-server-errors');

const Post = require('../../Models/Post');
const Auth = require('../../Utils/Auth');

module.exports = {
    mutations: {
        async likePost(_, {id}, context) {
            var {username} = Auth(context.req.headers.authorization);
            
            try {
                var post = await Post.findById(id);
                if (!post) throw new UserInputError("Post not found");
            } catch (error) {
                throw new Error(error);
            }

            if (post.likes.find(l => l.username === username)) {
                post.likes = post.likes.filter(l => l.username !== username);
            }else {
                post.likes.push({
                    username,
                    createdAt: new Date().toISOString()
                });
            }

            try {
                return await post.save();
            } catch (error) {
                throw new Error(error);
            }
        }
    }
}

