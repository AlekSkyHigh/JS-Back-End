const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        minLength: [3, 'Custom min length message'],
        maxLength: 20,
    },
    color: {
        type: String,
        require: false,
        enum: {
            values: ['white', 'black', 'yellow'],
            message: '{VALUE} is wrong color',
        }
    },
    age: Number,
    breed: String,
});

// Instance method
catSchema.methods.greet = function() {
    console.log(`Hello I\'m cat - my name is ${this.name}`);
};

// Virtual property
catSchema.virtual('info').get(function() {
    return `My name is ${this.name} and I'm ${this.age} years old`;
});

// Static model method
catSchema.static('giveMeCats', function() {
    return this.find();
});

const Cat = mongoose.model('Cat', catSchema);

module.exports = Cat;
