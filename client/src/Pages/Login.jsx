import { useMutation, gql } from '@apollo/client';
import React, { useContext } from 'react'
import { Button, Form } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import { useForm } from '../utils/hooks';

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ) {
        login(
            username: $username
            password: $password
        ) {
            id email username createdAt token
        }
    }
`;

export default function Login(props) {
    const context = useContext(AuthContext);
    const [errors, setErrors] = React.useState({});

    const { handleChange, handleSubmit, values } = useForm(() => {
        loginUser();
    }, {
        username: '',
        password: ''
    });

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, {data: {login: data}}) {
            context.login(data);
            props.history.push('/');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: values
    });

    return (
        <div className="form-container">
            <Form onSubmit={handleSubmit} noValidate className={loading && 'loading'}>
                <h1>Login</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username.."
                    name="username"
                    type="text"
                    value={values.username}
                    error={errors.username && 'Please enter your username'}
                    onChange={handleChange}
                />
                <Form.Input
                    label="Password"
                    placeholder="Password.."
                    name="password"
                    type="password"
                    value={values.password}
                    error={errors.password && 'Please enter your password'}
                    onChange={handleChange}
                />
                <Button type="submit" primary>
                    Login
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map((value) => (
                            <li key={value}>
                                <pre>{value}</pre>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
