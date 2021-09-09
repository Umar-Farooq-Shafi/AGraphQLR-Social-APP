const {
    hash,
    compare
} = require('bcryptjs');
const {
    sign
} = require('jsonwebtoken');
const {
    UserInputError
} = require('apollo-server');

const User = require('../../Models/User');
const {
    ValidateLogin,
    ValidateRegister
} = require('../../Utils/Validators');

const generateToken = (user) => sign({
    id: user._id,
    email: user.email,
    username: user.username
}, process.env.SECRET, {
    expiresIn: '1d'
});

module.exports = {
    // mutations object for [UPDATE, POST, PUT]
    mutations: {
        // Register a new user into db and send token with user
        register: async (_, {
            registerInput: {
                username,
                email,
                password,
                confirmPassword
            }
        }) => {
            // Validates input
            const {
                errors,
                valid
            } = ValidateRegister(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('[ERROR]', {
                    errors
                });
            }

            // Validate user
            try {
                var userExist = await User.findOne({
                    username
                });
            } catch (error) {
                throw new Error(error);
            }

            if (userExist) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                });
            }

            // hashing the password
            try {
                password = await hash(password, 12);
            } catch (error) {
                throw new Error(error);
            }

            // Creating a new user
            const user = new User({
                username,
                email,
                password,
                createdAt: new Date().toISOString()
            });

            // Save the user in DB
            try {
                var res = await user.save();
            } catch (error) {
                throw new Error(error);
            }

            // generating token 
            return {
                ...res._doc,
                id: res._id,
                token: generateToken(res)
            };
        },

        // Login user
        login: async (_, {
            username,
            password
        }) => {
            // Validate username and password
            const {
                errors,
                valid
            } = ValidateLogin(username, password);
            if (!valid) {
                throw new UserInputError('[ERROR]', {
                    errors
                });
            }

            // find user
            try {
                var user = await User.findOne({
                    username
                });
            } catch (error) {
                throw new Error(error);
            }

            if (!user) {
                errors.general = "User not found"
                throw new Error("Username/Password wrong...", {
                    errors
                });
            }

            // matching password
            try {
                var match = (await compare(password, user.password));
            } catch (error) {
                throw new Error(error);
            }

            if (!match) {
                errors.general = 'Username/Password wrong...';
                throw new UserInputError("Username/Password wrong...", {
                    errors
                });
            }

            // generating token 
            return {
                ...user._doc,
                id: user._id,
                token: generateToken(user)
            };
        }
    }
}