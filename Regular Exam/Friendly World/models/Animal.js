const { Schema, model, Types } = require('mongoose');

const URL_PATTERN = /https?:\/\/./i;

const animalSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name must be at least 4 characters long'],
        minlength: [2, 'THe name must be at least 2 characters long']
    },
    years: {
        type: Number,
        required: [true, 'Years is required'],
        min: [1, 'Years should be a positive number'],
        max: [100, 'Years should be a positive number'],
    },
    kind: {
        type: String,
        required: [true, 'Kind is required'],
        minlength: [3, 'The kind must be at least 3 characters long']
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Invalid URL'
        }
    },
    need: {
        type: String,
        required: [true, 'Need is required'],
        minlength: [3, 'The need must be at least 3 characters long'],
        maxength: [20, 'The need must be at least 20 characters long'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        minlength: [5, 'The location must be at least 5 characters long'],
        maxLength: [50, 'The location must be no longer than 50 characters'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [5, 'The description must be at least 5 characters long'],
        maxlength: [50, 'The description must be no longer than 50 characters'],

    },
    donations: { type: [Types.ObjectId], ref: 'User', default: [] },
    owner: { type: Types.ObjectId, ref: 'User' },
})

const Animal = model('Animal', animalSchema);

module.exports = Animal;