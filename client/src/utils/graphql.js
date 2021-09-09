import gql from "graphql-tag";

export const FETCH_POSTS = gql `
    query {
  posts {
    id
    username
    likeCount
    createdAt
    commentCount
    body
    comments {
      id
      username
      createdAt
      body
    }
    likes {
      username
    }
  }
}
`;

export const LIKE_POST = gql `
mutation($id: ID!) {
    likePost(id: $id) {
        id
        likes {
            id
            username
        }
        likeCount
    }
}
`;