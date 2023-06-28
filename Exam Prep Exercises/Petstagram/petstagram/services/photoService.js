const Photo = require("../models/Photo");


async function createPhoto(photo){
    return Photo.create(photo);
}

async function getAllAndPopulate(){
    return Photo.find({}).populate('owner').lean();
}

async function getByIdAndPopulate(id) {
    return Photo.findById(id).populate('owner').populate('commentList.user').lean();
}

async function deleteById(id) {
    return Photo.findByIdAndDelete(id);
}

async function editById(id, data) {
    const existing = await Photo.findById(id);

    existing.name = data.name;
    existing.image = data.image;
    existing.age = data.age;
    existing.description = data.description;
    existing.location = data.location;

    return existing.save();
}

async function addComment(id, commentData){
    const photo = await Photo.findById(id);

    photo.commentList.push(commentData)

    return await photo.save()
}

module.exports = {
    createPhoto,
    getAllAndPopulate,
    getByIdAndPopulate,
    deleteById,
    editById,
    addComment
}