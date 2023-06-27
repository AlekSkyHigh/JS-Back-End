const { Schema, model, Types } = require('mongoose');
const { platforms } = require('../config/options');

const URL_PATTERN = /https?:\/\/./i;

const gameSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name must be at least 4 characters long'],
        minlength: [4, 'THe name must be at least 4 characters long']
    },
    image: {
        type: String,
        required: [ true, 'Image is required'],
        validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Invalid URL'
        }
    },
    price: {
        type: Number,
        required: [ true, 'Price is required'],
        min: [1, 'The price should be a positive number'],
    },
    description: {
        type: String,
        required: [ true, 'Description is required'],
        minlength: [10, 'The description must be at least 10 characters long']
    },
    genre: {
        type: String,
        required: [ true, 'Genre is required' ],
        minlength: [2, 'The genre must be at least 2 characters long']
    },
    platform: {
        type: String,
        required: [true, 'Platform is required'],
        enum: platforms,
    },
    boughtBy: { type: [Types.ObjectId], ref: 'User', default: [] },
    owner: { type: Types.ObjectId, ref: 'User' },
})

const Game = model('Game', gameSchema);

module.exports = Game;