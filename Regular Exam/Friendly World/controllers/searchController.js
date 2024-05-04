const { search, getAll } = require('../services/animalService');

const searchController = require('express').Router();

searchController.get('/', async (req, res) => {
    try {
        
        const animals = await getAll();

        res.render('search', {
            title: 'Search Page',
            animals,
        });

    } catch (error) {
        res.redirect('/');
    }
});

searchController.post('/', async (req, res) => {
   
    try {
        const { location } = req.body;

        const animals = await search(location);

        res.render('search', { 
            title: 'Search Page',
            animals
        });

    } catch (error) {
        res.redirect('/');
    }
});

module.exports = searchController;