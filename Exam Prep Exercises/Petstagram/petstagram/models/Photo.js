const { Schema, model, Types } = require('mongoose');

const URL_PATTERN = /https?:\/\/./i;

const photoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name must be at least 2 characters long'],
        minlength: [2, 'THe name should be at least 2 characters long']
    },
    image: {
        type: String,
        required: [ true, 'Image is required'],
        validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Invalid URL'
        }
    },
    age: {
        type: Number,
        required: [ true, 'Age is required'],
        min: [1, 'The age should be a positive number'],
        max: [100, 'The age can not be over 100']
    },
    description: {
        type: String,
        required: [ true, 'Description is required'],
        minlength: [5, 'The description should be at least 5 characters long'],
        maxlength: [50, 'The description should be no longer than 50 characters'],

    },
    location: {
        type: String,
        required: [ true, 'Location is required' ],
        minlength: [5, 'The location should be at least 5 characters long'],
        maxlength: [50, 'The location should be no longer than 50 characters'],
    },
    commentList: [{
        user: {
            type: Types.ObjectId,
            required: true,
            ref: 'User'
        }, 
        comment: {
            type: String,
            required: [true, 'Comment is required']
        }
    }],
    owner: { type: Types.ObjectId, ref: 'User' },
})

const Photo = model('Photo', photoSchema);

module.exports = Photo;