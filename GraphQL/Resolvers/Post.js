const { AuthenticationError } = require('apollo-server-errors');
const {PubSub} = require('graphql-subscriptions');

const Post = require('../../Models/Post');
const Auth = require('../../Utils/Auth');

const pubsub = new PubSub();

module.exports = {
    quires: {
        // getting all posts
        posts: async () => {
            try {
                return await Post.find().sort({ createdAt: -1 });
            } catch (error) {
                throw new Error(error);
            }
        },

        // get single post
        post: async (_, {id}) => {
            try {
                const post = await Post.findById(id);
                if (!post) throw new Error('No post found');
                return post;
            } catch (error) {
                throw new Error(error);
            }
        }
    },

    mutations: {
        // create new post
        createPost: async (_, {body}, context) => {
            var user = Auth(context.req.headers.authorization);

            if (body.trim() === '') {
                throw new Error("Post body is required");
            }

            const post = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            try {
                await post.save();
                pubsub.publish('NEW_POST', {
                    postCreated: post
                });
                return post;
            } catch (error) {
                throw new Error(error);
            }
        },

        // delete the post
        deletePost: async (_, {id}, context) => {
            var user = Auth(context.req.headers.authorization);

            try {
                const post = (await Post.findById(id));
                if( post.username === user.username ) {
                    await post.delete();
                    return "Post deleted successfully";
                }
                else {
                    throw new AuthenticationError("Not authorized...");
                }
            } catch (error) {
                throw new Error(error);
            }
        },
    },

    Subscription: {
        postCreated: {
            subscribe: () => pubsub.asyncIterator('NEW_POST')
        }
    }
}