const mongoose = require('mongoose');

//TODO change database accroding to assignment:
const CONNECTION_STRING = 'mongodb://localhost:27017/booking-uni';

module.exports = async (app) => {
    try {
        await mongoose.connect(CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Database connected');
        
    } catch (arr){
        console.error(err.message);
        process.exit(1);
    }
}