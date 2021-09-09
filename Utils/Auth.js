const { AuthenticationError } = require("apollo-server-errors");
const { verify } = require("jsonwebtoken");

module.exports = (authorization) => {
    if (authorization) {
        const [, token] = authorization.split(' ');
        if(token) {
            try {
                return verify(token, process.env.SECRET);
            } catch (error) {
                throw new AuthenticationError('Invalid/Expired token');
            }
        }else {
            throw new Error("You are not authorized...");
        }
    }else {
        throw new Error("Auth is required...");
    }
}
