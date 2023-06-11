const fs = require('fs');
const url = require('url');
const path = require('path');
const cats = require('../data/cats.json');

let filePath = path.normalize(path.join(__dirname, "../views/home/index.html"));

module.exports = (req, res) => {

    const pathname = url.parse(req.url).pathname;

    if(pathname === '/' && req.method === 'GET'){

        fs.readFile(filePath, (err, data) => {

            if(err){
                console.log(err);
    
                res.writeHead(404, {
                    "Content-Type": "text/html"
                });
    
                res.write("404 Not Found!");
                res.end();
                return; 
            }

            let modifiedCats = cats.map((cat) => `<li>
                <img src="${path.join('./content/images/' + cat.image)}" alt="${cat.name}">
                <h3>${cat.name}</h3>
                <p><span>Breed: </span>${cat.breed}</p>
                <p><span>Description: </span>${cat.description}</p>
                <ul class="buttons">
                    <li class="btn edit"><a href="/cats-edit/${cat.id}">Change Info</a></li>
                    <li class="btn delete"><a href="/cats-find-new-home/${cat.id}">New Home</a></li>
                </ul>
            </li>`)
            let modifiedData = data.toString().replace('{{cats}}', modifiedCats);
    
            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            
            res.end(modifiedData);
        })
        
    } else {

        return true;
    }

    
}
