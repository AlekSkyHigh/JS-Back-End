const { hasUser } = require('../middlewares/guards');
const { getAllAndPopulate } = require('../services/photoService');
const { getUserById } = require('../services/userService');
// const { getUserById } = require('../services/userService');


const profileController = require('express').Router();

profileController.get('/', hasUser(), async (req, res) => {
    // const wishedBooks = await getByUserWishingList(req.user._id);
    // const user = await getUserById(req.user._id);

    const photos = await getAllAndPopulate();
    const user = await getUserById(req.user._id)

    console.log(photos);

    res.render('profile', {
        title: 'Profile Page',
        photos: photos.filter(photo => photo.owner._id == req.user._id),
        user
    });
});

module.exports = profileController;