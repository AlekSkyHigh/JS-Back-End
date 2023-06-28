const { hasUser } = require('../middlewares/guards');
const { createPhoto, getAllAndPopulate, deleteById, getByIdAndPopulate, editById, addComment } = require('../services/photoService');
const { parseError } = require('../util/parser');

const photoController = require('express').Router();

photoController.get('/create', hasUser(), (req, res) => {

    res.render('create', {
        title: 'Add Photo',
    });
})

photoController.post('/create', hasUser(), async (req, res) => {

    const photo = {
        name: req.body.name,
        image: req.body.image,
        age: req.body.age,
        description: req.body.description,
        location: req.body.location,
        commentList: req.body.commentList,
        owner: req.user._id,
    }

    try {
        await createPhoto(photo);
        res.redirect('/photo/catalog')
    } catch (error) {
        res.render('create', {
            title: 'Add Photo',
            errors: parseError(error),
            body: photo,
        })
    }
})

photoController.get('/catalog', async (req, res) => {
    const photos = await getAllAndPopulate();
    
    res.render('catalog', {
        title: 'Catalog Page',
        photos,
        
    })
})

photoController.get('/:id', async (req, res) => {
    const photo = await getByIdAndPopulate(req.params.id);

    const isOwner = photo.owner._id == req.user?._id;

    res.render('details', {
        title: 'Photo Details',
        photo,
        isOwner
    });
})

photoController.get('/:id/delete', hasUser(), async (req, res) => {
    const photo = await getByIdAndPopulate(req.params.id);

    if (photo.owner._id.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login')
    }

    await deleteById(req.params.id);
    res.redirect('/photo/catalog')
})



photoController.get('/:id/edit', hasUser(), async (req, res) => {
    const photo = await getByIdAndPopulate(req.params.id);

    if (photo.owner._id.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login')
    }

    res.render('edit', {
        title: 'Edit Course',
        photo
    });
});

photoController.post('/:id/edit', hasUser(), async (req, res) => {
    const photo = await getByIdAndPopulate(req.params.id);

    if (photo.owner._id != req.user._id) {
        return res.redirect('/auth/login')
    }

    const edited = {
        name: req.body.name,
        image: req.body.image,
        age: Number(req.body.age),
        description: req.body.description,
        location: req.body.location,
    }

    try {
        if (Object.values(edited).some(v => !v)) {
            throw new Error('All fields are required')
        }

        await editById(req.params.id, edited);
        res.redirect(`/photo/${req.params.id}`);

    } catch (err) {
        res.render('edit', {
            title: 'Edit Photo',
            photo: Object.assign(edited, { _id: req.params.id }),
            errors: parseError(err)
        })
    }
});

photoController.post('/:id/comments', hasUser(), async (req, res) => {

    const photoId = req.params.id;
    const { comment } = req.body;
    const user = req.user._id;
    const photo = await getByIdAndPopulate(req.params.id);


    try {
        await addComment(photoId, { comment, user });

        res.render('details', {
            title: 'Photo details',
            photo,
        })
        
        res.redirect(`/photo/${photoId}`);
    } catch (err) {
        console.log(err);
    }
})

module.exports = photoController;