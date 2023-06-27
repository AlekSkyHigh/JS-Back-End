const Game = require("../models/Game");

async function createGame(game) {
    return Game.create(game);
}

async function getAll() {
    return Game.find({}).lean();
}

async function getById(id) {
    return Game.findById(id).lean();
}

async function deleteById(id) {
    return Game.findByIdAndDelete(id)
}

async function editById(id, data) {
    const existing = await Game.findById(id);

    existing.name = data.name;
    existing.image = data.image;
    existing.price = data.price;
    existing.description = data.description;
    existing.genre = data.genre;
    existing.platform = data.platform;

    return existing.save();
}

async function enrollUser(gameId, userId) {
    const existing = await Game.findById(gameId)
    existing.boughtBy.push(userId);

    return existing.save()
}

async function search(name, platform) {
    const games = (await Game.find().lean())
        .filter(game => game.name.toLowerCase().indexOf(name.toLowerCase()) != -1);

    if (platform) {
        return games.filter(game => game.platform === platform)
    }

    return games;
}

module.exports = {
    createGame,
    getAll,
    getById,
    deleteById,
    editById,
    enrollUser,
    search
}