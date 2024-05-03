const { lastAddedAnimals } = require('../services/animalService');

const homeController = require('express').Router(); 

//TODO replace with real controller by assignment
homeController.get('/', async (req, res) => {

    const recentAnimals = await lastAddedAnimals();

    res.render('home', {
        title: 'Home Page',
        user: req.user,
        recentAnimals,
    });
})

module.exports = homeController;