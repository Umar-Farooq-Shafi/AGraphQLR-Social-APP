import React from 'react';

import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { Button, Form } from 'semantic-ui-react';

import { FETCH_POSTS } from '../utils/graphql';
import { useForm } from '../utils/hooks';

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default function PostForm() {
    const { handleChange, handleSubmit, values } = useForm(async () => {
        try {
            await createPost();
        } catch (error) {
            console.error(error);            
        }
    }, {
        body: ''
    });

    const [createPost, { error, loading }] = useMutation(CREATE_POST, {
        update(proxy, result) {
            var data = proxy.readQuery({
                query: FETCH_POSTS
            });
            proxy.writeQuery({
                query: FETCH_POSTS,
                data: {
                    posts: [result.data.createPost, ...data.posts]
                }
            });
            values.body = "";
        },
        variables: values
    });

    return (
        <div>
            <Form onSubmit={handleSubmit} className={loading && 'loading'}>
                <h1>Create a new Post</h1>
                <Form.Field>
                    <Form.Input
                        placeholder="Say hi.."
                        name="body"
                        type="text"
                        value={values.body}
                        error={error && 'Post body required...'}
                        onChange={handleChange}
                    />
                    <Button type="submit" primary>
                        Post
                    </Button>
                </Form.Field>
            </Form>
            {error && (
                <div className="ui error message" style={{marginBottom: 20}}>
                    <ul className="list">
                        <li>
                            <pre>{error.graphQLErrors[0]?.message}</pre>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}
