const authController = require("../controllers/authController");
const gameController = require("../controllers/gameController");
const homeController = require("../controllers/homeController");
const searchController = require("../controllers/searchController");

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/game', gameController);
    app.use('/search', searchController);
    app.use('*', (req, res) => {
        res.render('404'), {
            title: 'Page Not Found'
        }
    })
};