const animalController = require("../controllers/animalController");
const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const searchController = require("../controllers/searchController");

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/animal', animalController);
    app.use('/search', searchController);
    app.use('*', (req, res) => {
        res.render('404'), {
            title: 'Page Not Found'
        }
    })
};