import React, { useContext } from 'react'
import { Link } from 'react-router-dom';

import {useMutation, gql} from '@apollo/client';
import moment from 'moment'

import { Button, Card, Icon, Image, Label } from 'semantic-ui-react'

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import { LIKE_POST } from '../utils/graphql';


const CardExampleGroups = ({ post: { id, likes, createdAt, username, body, likeCount, commentCount } }) => {
    const {user} = useContext(AuthContext);
    
    const [likePost] = useMutation(LIKE_POST, {
        variables: { id }
    });

    return (
        <Card fluid>
            <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>
                    <strong>{body}</strong>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton likes={likes} user={user} id={id} likeCount={likeCount} likePostHandler={likePost} />
                <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                    <Button color='teal' basic>
                        <Icon name='comments' />
                    </Button>
                    <Label basic color='teal' pointing='left'>
                        {commentCount}
                    </Label>
                </Button>
                {user && user.username === username && (
                    <DeleteButton postId={id}  />
                )}
            </Card.Content>
        </Card>
    )
}

export default CardExampleGroups