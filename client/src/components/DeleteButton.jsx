import React, { useState } from 'react';
import gql from 'graphql-tag';

import { Button, Confirm, Icon } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';

import MyPopup from '../utils/MyPopup';
import {FETCH_POSTS} from '../utils/graphql'


function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT : DELETE_POST;

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS
        });
        
        proxy.writeQuery({ 
            query: FETCH_POSTS, 
            data: {
                posts: data.posts.filter((p) => p.id !== postId)
            }
        });
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId
    }
  });
  return (
    <>
      <MyPopup content={commentId ? 'Delete comment' : 'Delete post'}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  );
}

const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(id: $postId)
  }
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($commentId: ID!, $postId: ID!) {
    deleteComment(id: $commentId, postId: $postId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;