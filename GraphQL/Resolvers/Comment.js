const { UserInputError, AuthenticationError } = require('apollo-server-errors');

const Post = require('../../Models/Post');
const Auth = require('../../Utils/Auth');

module.exports = {
    mutations: {
        // Create new comment
        async createComment(_, {id, body}, context) {
            var {username} = Auth(context.req.headers.authorization);
            
            if(body.trim() === '') {
                throw new UserInputError('Empty comment', {
                    error: {
                        body: "Comment is required"
                    }
                });
            }

            try {
                var post = await Post.findById(id);
                if (!post) throw new Error("Post not found");
            } catch (error) {
                throw new Error(error);
            }

            post.comments.unshift({
                body,
                username,
                createdAt: new Date().toISOString()
            });

            try {
                return await post.save();
            } catch (error) {
                throw new Error('Internal server error');
            }
        },

        async deleteComment(_, {id, postID}, context) {
            var {username} = Auth(context.req.headers.authorization);

            try {
                var post = await Post.findById(postID);
                if(!post) throw new UserInputError("Post not found");
            } catch (error) {
                throw new Error('Internal server error');
            }

            const comIn = post.comments.findIndex(p => p.id === id);
            if (!post.comments[comIn].username === username) {
                throw new AuthenticationError("Not authenticated");
            }

            post.comments.splice(comIn, 1);

            try {
                return await post.save();
            } catch (error) {
                throw new Error('Internal server error');
            }
        }
    }
}

