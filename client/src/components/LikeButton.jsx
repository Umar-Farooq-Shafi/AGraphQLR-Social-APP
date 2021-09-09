import React from 'react';
import {Link} from 'react-router-dom'
import { Button, Icon, Label } from 'semantic-ui-react'

export default function LikeButton({ user, likes, id, likeCount, likePostHandler }) {
    const [liked, setLiked] = React.useState(false);

    React.useEffect(() => {
        if (user && likes.find(l => l.username === user.username)) {
            setLiked(true);
        } else setLiked(false);
    }, [likes, user]);

    return (
        <Button as='div' labelPosition='right' onClick={likePostHandler}>
            {user ? (
                liked ? (
                    <Button color='blue'>
                        <Icon name='heart' />
                    </Button>
                ) : (
                    <Button color='blue' basic>
                        <Icon name='heart' />
                    </Button>
                )
            ) : (
                <Button as={Link} to="/login" color='blue'>
                    <Icon name='user x' />
                </Button>
            )}
            <Label basic color='blue' pointing='left'>
                {likeCount}
            </Label>
        </Button>
    )
}
