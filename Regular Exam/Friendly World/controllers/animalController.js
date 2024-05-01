// const { isGuest } = require('../middlewares/guards');
const { createAnimal, getAll, getById, deleteById, editById, donateUser } = require('../services/animalService');
const { parseError } = require('../util/parser');

const animalController = require('express').Router();

animalController.get('/create', (req, res) => {

    res.render('create', {
        title: 'Add animal',
    });
})

animalController.post('/create', async (req, res) => {

    const animal = {
        name: req.body.name,
        years: req.body.years,
        kind: req.body.kind,
        image: req.body.image,
        need: req.body.need,
        location: req.body.location,
        description: req.body.description,
        donations: req.body.donations,
        owner: req.user._id,
    }

    try {

        // if(typeof animal.years !== Number) {
        //     throw new Error ('The years input should be a number')
        // };

        await createAnimal(animal);
        res.redirect('/animal/catalog')
    } catch (error) {
        console.log(error);

        res.render('create', {
            title: 'Create Animal Offer',
            errors: parseError(error),
            body: animal,
        })
    }
})

animalController.get('/catalog', async (req, res) => {
    const animals = await getAll();
    
    res.render('catalog', {
        title: 'Dashboard Page',
        animals,
    })
})

animalController.get('/:id', async (req, res) => {
    const animal = await getById(req.params.id);

    const isOwner = animal.owner.toString() == req.user?._id.toString();
    const donated = animal.donations.map(b => b.toString()).includes(req.user?._id.toString());

    res.render('details', {
        title: 'Animal Details',
        animal,
        isOwner,
        donated
    });
})

animalController.get('/:id/delete', async (req, res) => {
    const animal = await getById(req.params.id);

    if (animal.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login')
    }

    await deleteById(req.params.id);
    res.redirect('/animal/catalog')
})


animalController.get('/:id/edit', async (req, res) => {
    const animal = await getById(req.params.id);

    if (animal.owner._id.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login')
    }

    res.render('edit', {
        title: 'Edit Animal',
        animal
    });
});

animalController.post('/:id/edit', async (req, res) => {
    const animal = await getById(req.params.id);

    if (animal.owner._id != req.user._id) {
        return res.redirect('/auth/login')
    }

    const edited = {
        name: req.body.name,
        years: req.body.years,
        kind: req.body.kind,
        image: req.body.image,
        need: req.body.need,
        location: req.body.location,
        description: req.body.description,
    }

    try {
        if (Object.values(edited).some(v => !v)) {
            throw new Error('All fields are required')
        }

        await editById(req.params.id, edited);
        res.redirect(`/animal/${req.params.id}`);

    } catch (err) {
        res.render('edit', {
            title: 'Edit Animal',
            animal: Object.assign(edited, { _id: req.params.id }),
            errors: parseError(err)
        })
    }
});

animalController.get('/:id/donate', async (req, res) => {
    const animal = await getById(req.params.id);

    if (animal.owner.toString() != req.user._id.toString()
        && animal.donations.map(x => x.toString()).includes(req.user._id.toString()) == false) {
        await donateUser(req.params.id, req.user._id);
    }
    
    res.redirect(`/animal/${req.params.id}`)
})

module.exports = animalController;
