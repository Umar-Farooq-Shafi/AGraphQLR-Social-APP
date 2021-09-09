const gql = require('graphql-tag');

module.exports = gql `
    type Post {
        id: ID!
        body: String!
        username: String!
        createdAt: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
    }

    type Like {
        id: ID!
        username: String!
        createdAt: String
    }

    type Comment {
        id: ID!
        body: String!,
        username: String!
        createdAt: String
    }

    type User {
        id: ID!
        username: String!,
        token: String!,
        email: String!,
        createdAt: String
    }

    input RegisterInput {
        username: String!,
        email: String!,
        password: String!,
        confirmPassword: String!
    }

    type Query {
        posts: [Post]
        post(id: ID!): Post! 
    }

    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!

        createPost(body: String!): Post!
        deletePost(id: ID!): String!

        createComment(id: ID!, body: String!): Post!
        deleteComment(id: ID!, postID: ID!): Post!

        likePost(id: ID!): Post!
    }

    type Subscription {
        postCreated: Post!
    }
`;