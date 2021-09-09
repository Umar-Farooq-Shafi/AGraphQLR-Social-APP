import React, { useContext } from 'react';

import gql from 'graphql-tag'
import { useMutation, useQuery } from '@apollo/client';

import { Button, Card, Dimmer, Form, Grid, Icon, Image, Label, Loader } from 'semantic-ui-react';
import moment from 'moment';

import LikeButton from '../components/LikeButton';
import MyPopup from '../utils/MyPopup';
import DeleteButton from '../components/DeleteButton';
import { AuthContext } from '../context/auth';
import { LIKE_POST } from '../utils/graphql';

const GET_POST = gql`
    query($id: ID!) {
        post(id: $id) {
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

export default function Post({ match, history }) {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = React.useState('');
  const commentInputRef = React.useRef();
  const id = match.params.id;

  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id }
  });

  const [likePost] = useMutation(LIKE_POST, {
    variables: { id }
  });

  const [submitComment] = useMutation(gql`
    mutation($id: ID!, $body: String!) {
    createComment(id: $id, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
  `, {
    variables: {
      id,
      body: comment
    },
    update() {
      setComment('');
      commentInputRef.current.blur();
    }
  })

  if (loading) {
    return (
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    );
  }
  if (error) {
    setTimeout(() => {
      history.push('/');
    }, 1000);

    return (
      <div>
        <strong>Not found</strong>
        <p>Redirecting....</p>
      </div>
    );
  }

  const {
    id: postID,
    username,
    likeCount,
    createdAt,
    commentCount,
    body,
    likes,
    comments
  } = data?.post;

  return (
    <div>
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated='right'
              size='small'
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} id={postID} likeCount={likeCount} likes={likes} likePostHandler={likePost} />
                <MyPopup content="Comment on post">
                  <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => console.log('Comment on post')}
                  >
                    <Button basic color="blue">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={() => {
                    history.push('/');
                  }} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ''}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}
