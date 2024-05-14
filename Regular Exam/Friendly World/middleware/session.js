const { verifyToken } = require("../services/userService");

module.exports = () => (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const userData = verifyToken(token);
            console.log('userData after succesfull vertifyToken:');
            console.log(userData);

            req.user = userData;
            console.log('Read successful, user', userData.email); //change according the assignment

            // req.locals.user = userData

            res.locals.isAuthenticated = true;
            console.log('isAuthenticated = true');

        } catch (error) {
            res.clearCookie('token');
            res.redirect('/auth/login');
            return;
        }
    }

    next()
};