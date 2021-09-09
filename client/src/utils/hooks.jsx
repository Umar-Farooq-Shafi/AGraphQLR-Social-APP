import {useState} from 'react'

export const useForm = (callback, initialState = {}) => {
    const [values, setValues] = useState(initialState);

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        callback();
    }

    return {
        values,
        handleChange,
        handleSubmit
    };
}
