const mongoose = require('mongoose');
const User = require("./User");

// Connectiong Mongoose to the DataBase:
mongoose.connect("mongodb://localhost:27017/testDB");

// Method 1 to create a user:
// const user = new User({name: "Aleksandar", age: 29});
// user.save().then(() => console.log("User Saved"));


// Method 2 to create a user:
// async function run() {
//     const user = new User({ name: "Aleksandar", age: 29 });
//     await user.save();
//     console.log(user);
// }
// run()


// Method 3 to create a user:
async function run() {
    try {
        const user = await User.create({
            name: "Aleksandar",
            age: 29,
            email: "test@test.bg",
            hobbies: ["Weight Lifting", "Video Games"],
            address: { street: "Main Str" },
        });
        console.log(user);
    } catch (error) {
        console.log(error);
    }
}
run()