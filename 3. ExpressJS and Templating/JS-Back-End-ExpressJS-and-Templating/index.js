const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const app = express();

const { addCat, getCats } = require('./cats');

// Add handlebars to express
app.engine('hbs', handlebars.engine({
     extname: 'hbs'
}));
app.set('view engine', 'hbs');

// Add third party middleware
const bodyParser = express.urlencoded({ extended: false });
app.use(bodyParser);

app.use(express.static('public'));

// Add middlewares
app.use((req, res, next) => {
    console.log(`HTTP Request ${req.method}: ${req.path}`);
    next();
});

app.use((req, res, next) => {
    console.log('MIddleware1')
    next();
});

// Partial route middleware
app.use('/cats', (req, res, next) => {
    console.log('Cats middleware');

    next();
});

// Route specific middleware
const specificMiddleware = (req, res, next) => {
    console.log('Specific middleware only for this route');
    next();
};

app.get('/specific', specificMiddleware, (req, res) => {
    res.send('Some specific route with middleware');
});

// Express Router / Actions
app.get('/', (req, res) => {
    // res.status(200).send('Hello from express!');
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

// Don't do this at home!
// app.get('/css/style.css', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'public/css/style.css'));
// });

app.get('/cats', (req, res) => {
    const cats = getCats();

    res.render('cats', { cats });
});

app.post('/cats', (req, res) => {
    addCat(req.body.name, Number(req.body.age));

    res.redirect('/cats');
});

app.get('/cats/:catId', (req, res) => {
    const catId = Number(req.params.catId);
    if (!catId) {
        return res.status(404).send('Cannot find a cat');
    }

    console.log(req.params);
    res.send(`Request with parameter - ${req.params.catId}`);
});

app.get('/download', (req, res) => {
    res.download('./manual.pdf');
    // res.attachment('./manual.pdf');
    // res.end();
    // res.sendFile(path.resolve(__dirname, 'manual.pdf'));
});

app.get('/old-route', (req, res) => {
    res.redirect('/cats');
});

app.get('*', (req, res) => {
    res.status(404).send('Not Found');
});
// End of express router


app.listen(5000, () => console.log('Server is listening on port 5000...'));
