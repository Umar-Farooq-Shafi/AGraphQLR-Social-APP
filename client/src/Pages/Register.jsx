import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useContext } from 'react'
import { Button, Form } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';

import { useForm } from '../utils/hooks';

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ) {
            id email username createdAt token
        }
    }
`;


export default function Register(props) {
    const context = useContext(AuthContext);
    const [error, setError] = React.useState({});

    const { handleChange, handleSubmit, values } = useForm(() => {
        addUser();
    }, {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, {data: {register:data}}) {
            context.login(data);
            props.history.push('/');
        },
        onError(err) {
            setError(err.graphQLErrors[0].extensions.errors);
        },
        variables: values
    });

    return (
        <div className="form-container">
            <Form onSubmit={handleSubmit} className={loading && 'loading'}>
                <h1>Register</h1>
                <Form.Input
                    error={error.username && 'Please enter your username'}
                    label='Username'
                    placeholder='Enter your Username...'
                    value={values.username}
                    onChange={handleChange}
                />
                <Form.Input
                    error={error.email && 'Please enter your email'}
                    type="email"
                    label='Email'
                    placeholder='Enter your Email...'
                    value={values.email}
                    onChange={handleChange}
                />
                <Form.Input
                    error={error.password && 'Please enter your password'}
                    type="password"
                    label='Password'
                    placeholder='Enter your password...'
                    value={values.password}
                    onChange={handleChange}
                />
                <Form.Input
                    error={error.confirmPassword && 'Please enter your confirm password'}
                    type="password"
                    label='Confirmation Password'
                    placeholder='Enter your confirmations password...'
                    value={values.confirmPassword}
                    onChange={handleChange}
                />
                <Button type="submit">Register</Button>
            </Form>
            {
                Object.keys(error).length > 0 && (
                    <div className="ui error message">
                        <ul className="list">
                            {Object.values(error).map((v, i) => (
                                <li key={i}>
                                    <pre>{v}</pre>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </div>
    )
}
