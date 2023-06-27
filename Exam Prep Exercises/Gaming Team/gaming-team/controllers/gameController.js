const { createGame, getAll, getById, deleteById, editById, enrollUser } = require("../services/gameService");
const { parseError } = require("../util/parser");
const { platforms } = require("../config/options");
const { isGuest, hasUser } = require("../middlewares/guards");

const gameController = require('express').Router();

gameController.get('/create', hasUser(), (req, res) => {

    res.render('create', {
        title: 'Create Game Offer',
        options: platforms
    });
})

gameController.post('/create', hasUser(), async (req, res) => {

    const game = {
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        description: req.body.description,
        genre: req.body.genre,
        platform: req.body.platform,
        owner: req.user._id,
    }

    try {
        await createGame(game);
        res.redirect('/game/catalog')
    } catch (error) {
        res.render('create', {
            title: 'Create Game Offer',
            errors: parseError(error),
            body: game,
            options: platforms,
        })
    }
})

gameController.get('/catalog', async (req, res) => {
    const games = await getAll();

    res.render('catalog', {
        title: 'Catalog Page',
        games,
    })
})

gameController.get('/:id', async (req, res) => {
    const game = await getById(req.params.id);

    game.isOwner = game.owner.toString() == req.user?._id.toString();
    game.enrolled = game.boughtBy.map(b => b.toString()).includes(req.user?._id.toString());

    res.render('details', {
        title: 'Game Details',
        game,
    });
})

gameController.get('/:id/delete', async (req, res) => {
    const game = await getById(req.params.id);

    if (game.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login')
    }

    await deleteById(req.params.id);
    res.redirect('/game/catalog')
})

gameController.get('/:id/edit', hasUser(), async (req, res) => {
    const game = await getById(req.params.id);

    const mappedPlatforms = platforms.map(platform => ({name: platform, selected: platform == game.platform}))
    console.log(mappedPlatforms);

    if (game.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login')
    }

    res.render('edit', {
        title: 'Edit Course',
        options: mappedPlatforms,
        game
    });
});

gameController.post('/:id/edit', hasUser(), async (req, res) => {
    const game = await getById(req.params.id);

    if (game.owner != req.user._id) {
        return res.redirect('/auth/login')
    }

    const edited = {
        name: req.body.name,
        image: req.body.image,
        price: Number(req.body.price),
        description: req.body.description,
        genre: req.body.genre,
        platform: req.body.platform,
    }

    try {
        if (Object.values(edited).some(v => !v)) {
            throw new Error('All fields are required')
        }

        await editById(req.params.id, edited);
        res.redirect(`/book/${req.params.id}`);

    } catch (err) {
        res.render('edit', {
            title: 'Edit Book',
            book: Object.assign(edited, { _id: req.params.id }),
            errors: parseError(err)
        })
    }
});

gameController.get('/:id/enroll', hasUser(), async (req, res) => {
    const game = await getById(req.params.id);

    if (game.owner.toString() != req.user._id.toString()
        && game.boughtBy.map(x => x.toString()).includes(req.user._id.toString()) == false) {
        await enrollUser(req.params.id, req.user._id);
    }
    
    res.redirect(`/game/${req.params.id}`)
})

module.exports = gameController;