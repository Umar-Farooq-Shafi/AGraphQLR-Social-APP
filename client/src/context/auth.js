import { createContext, useReducer } from "react";
import jwt from 'jwt-decode'

const initialState = {
    user: null
}

export const AuthContext = createContext({
    ...initialState,
    login: (data) => { },
    logout: () => { }
});

if (localStorage.token) {
    const decode = jwt(localStorage.token);
    if(decode.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
    }else {
        initialState.user = decode;
    }
}

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }

        case 'LOGOUT':
            return {
                ...state,
                user: null
            };

        default:
            return state;
    }
}

export const AuthProvider = (props) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const login = (data) => {
        localStorage.setItem("token", data.token);
        dispatch({
            type: 'LOGIN',
            payload: data
        });
    }

    const logout = () => {
        localStorage.removeItem("token");
        dispatch({ type: 'LOGOUT' });
    }

    return (
        <AuthContext.Provider value={{
            user: state.user,
            login,
            logout
        }} {...props} />
    )
}
