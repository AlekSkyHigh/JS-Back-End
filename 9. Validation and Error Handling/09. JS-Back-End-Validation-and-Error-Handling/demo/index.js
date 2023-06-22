const express = require('express');
const validator = require('validator');

const { isAgeValid } = require('./utils/validations');
const { validateName } = require('./middlewares/middlewares');
const { body, validationResult } = require('express-validator');

const app = express();

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send(`
        <form method="POST">
        <label for="name">Name</label>
        <input type="text" name="name" id="name">

        <label for="age">Age</label>
        <input type="number" name="age" id="age">

        <label for="password">Password</label>
        <input type="password" name="password" id="password">

        <label for="email">Email</label>
        <input type="email" name="email" id="email">

        <input type="submit" value="create" />
    </form>
    `);
});

const bodyPasswordValidator = body('password').isLength({ min: 3, max: 20 }).withMessage('Invalid password').trim();
const bodyEmailValidator = body('email').isEmail().normalizeEmail();

app.post('/',
    validateName,
    bodyPasswordValidator,
    bodyEmailValidator,
    (req, res) => {
        const { name, age, password, email } = req.body;

        if (!isAgeValid(age)) {
            return res.send('Invalid age');
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()){
            return res.status(400).send(errors.array()[0].msg);
        }

        // if (!validator.isStrongPassword(password)) {
        //     return res.send('Weak password');
        // }

        console.log(name, age);

        res.send('Successfull' + email);
    });

app.listen(5000, () => console.log('Server is listening on port 5000...'));
