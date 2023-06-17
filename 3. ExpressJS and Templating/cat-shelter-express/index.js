const express = require('express');
const fs = require('fs');
const handlebars = require('express-handlebars');
const path = require('path');
const app = express();


// Add handlebars to express
app.engine('hbs', handlebars.engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');


// Add third party middlewares
const bodyparser = express.urlencoded({ extended: false });
app.use(bodyparser);

app.use(express.static('public'));

// Add middlewares
app.use((req, res, next) => {
    console.log(`HTTP Request ${req.method}: ${req.path}`);
    next();
})

// Express router / actions

// Home 
app.get('/', (req, res) => {
    const cats = require('./cats.json');
    res.render('home', { cats });
});


// Add Cat
app.get('/add-cat', (req, res) => {
    res.render('addCat', { breeds: require('./breeds.json') });
});

app.post('/add-cat', (req, res) => {
    const formidable = require('formidable');
    const cats = require('./cats.json');
    let form = new formidable.IncomingForm();

    form.parse(req, (err, body, files) => {
        if (err) {
            console.log(err);
            throw err;
        }
        let oldpath = files.upload.filepath;
        let newPath = path.normalize(path.join(__dirname, './public/images/' + files.upload.originalFilename));
        console.log(files.upload);
        console.log(newPath);
        fs.copyFile(oldpath, newPath, function (err) {
            if (err) {
                console.log(err, 'Error!');
            }
            console.log('Files was uploaded successfully!');
        });
        cats.push({
            "id": (cats.length + 1),
            "name": body.name,
            "description": body.description,
            "breed": body.breed,
            "image": files.upload.originalFilename,
            "price": body.price
        });
        fs.writeFile('./cats.json', JSON.stringify(cats), 'utf-8', (err) => {
            if (err) {
                console.log('Unsuccessful file save!');
                return;
            }
        })
    });
    res.redirect('/');
});

// Add Breed
app.get('/add-breed', (req, res) => {
    res.render('addBreed');
});

app.post('/add-breed', (req, res) => {
    const breeds = require('./breeds.json');
    breeds.push(req.body.breed);
    fs.writeFile('./breeds.json', JSON.stringify(breeds), 'utf-8', (err) => {
        if (err) {
            console.log('Unsuccessful file save!');
            return;
        }
    })
    res.redirect('/');
});


// Edit Cat
app.get('/:catId/edit', (req, res) => {
    const cats = require('./cats.json');
    const cat = cats.find(x => x.id == req.params.catId);
    res.render('editCat', cat);
});

app.post('/:catId/edit', (req, res) => {
    const formidable = require('formidable');
    const cats = require('./cats.json');
    const cat = cats.find(x => x.id == req.params.catId);
    let form = new formidable.IncomingForm();

    form.parse(req, (err, body, files) => {
        console.log(body);
        if (err) {
            console.log(err);
            throw err;
        }
        let oldpath = files.upload.filepath;
        let newPath = path.normalize(path.join(__dirname, './public/images/' + files.upload.originalFilename));

        fs.copyFile(oldpath, newPath, function (err) {
            if (err) {
                console.log(err, 'Error!');
            }
            console.log('Files was uploaded successfully!');
        });
        
        const updatedCAt = {
            "id": cat.id,
            "name": body.name,
            "description": body.description,
            "breed": body.breed,
            "image": files.upload.originalFilename,
            "price": body.price
        };

        console.log(`updated cat - ${updatedCAt}`);

        cats.splice(cat.id - 1, 1, updatedCAt);

        fs.writeFileSync('./cats.json', JSON.stringify(cats), 'utf-8', (err) => {
            if (err) {
                console.log('Unsuccessful file save!');
                return;
            }
        })
    });
    console.log('updated');
    res.redirect('/');
});


app.listen(5000, () => console.log('Server is listening on port 5000...'));
