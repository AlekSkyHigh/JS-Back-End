const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const photoController = require("../controllers/photoController");
const profileController = require("../controllers/profileController");

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/photo', photoController);
    app.use('/profile', profileController);
    app.use('*', (req, res) => {
        res.render('404'), {
            title: 'Page Not Found'
        }
    })
};