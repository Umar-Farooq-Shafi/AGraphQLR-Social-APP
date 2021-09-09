import React, { useContext } from 'react'
import { useQuery } from '@apollo/client';

import { Dimmer, Grid, Loader, Transition } from 'semantic-ui-react';

import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';

import { AuthContext } from '../context/auth';
import { FETCH_POSTS } from '../utils/graphql';

export default function Home() {
    const { user } = useContext(AuthContext);
    const { loading, error, data } = useQuery(FETCH_POSTS);

    if (loading) return (
        <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
        </Dimmer>
    );
    if (error) return <p>Error :(</p>;

    return (
        <Grid columns={3}>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    {user && (
                        <PostForm />
                    )}
                </Grid.Column>
                <Transition.Group>
                    {data && data?.posts.map(post => (
                        <Grid.Column key={post.id} style={{
                            marginBottom: 20
                        }}>
                            <PostCard post={post} />
                        </Grid.Column>
                    ))}
                </Transition.Group>
            </Grid.Row>
        </Grid>
    );
}
