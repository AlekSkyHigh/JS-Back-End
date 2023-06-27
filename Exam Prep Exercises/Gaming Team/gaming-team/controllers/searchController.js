const { search } = require("../services/gameService");
const { platforms } = require('../config/options');

const searchController = require('express').Router();

searchController.get('/', async (req, res) => {

    const availableGames = await search('', '');

    res.render('search', {
        title: 'Search Page',
        user: req.user,
        options: platforms,
        availableGames
    });
})

searchController.post('/', async (req, res) => {
    
    const { name, platform } = req.body;
    const games = await search(name, platform);

    res.render('search', {
        title: 'Search Page',
        user: req.user,
        games,
        options: platforms
    });
})

module.exports = searchController;