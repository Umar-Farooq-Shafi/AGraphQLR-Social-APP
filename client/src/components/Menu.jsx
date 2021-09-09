import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';

export default function MenuBar() {
    const { user, logout } = useContext(AuthContext);
    const [activeItem, setActiveItem] = React.useState('home');

    const handleItemClick = (e, { name }) => setActiveItem(name);

    React.useEffect(() => {
        setActiveItem(
            window.location.pathname === "/" ? "home" : window.location.pathname.substr(1)
        );
    }, []);

    if (user) {
        return (
            <Menu pointing secondary size="massive" color="blue">
                <Menu.Item
                    name={user.username}
                    active
                    as={Link}
                    to="/"
                />
                <Menu.Menu position='right'>
                    <Menu.Item
                        name='logout'
                        onClick={logout}
                    />
                </Menu.Menu>
            </Menu>
        )
    } else {
        return (
            <Menu pointing secondary size="massive" color="blue">
                <Menu.Item
                    name='home'
                    active={activeItem === 'home'}
                    onClick={handleItemClick}
                    as={Link}
                    to="/"
                />
                <Menu.Menu position='right'>
                    <Menu.Item
                        name='login'
                        active={activeItem === 'login'}
                        onClick={handleItemClick}
                        as={Link}
                        to="/login"
                    />
                    <Menu.Item
                        name='register'
                        active={activeItem === 'register'}
                        onClick={handleItemClick}
                        as={Link}
                        to="/register"
                    />
                </Menu.Menu>
            </Menu>
        )
    }
}
