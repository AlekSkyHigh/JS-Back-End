const fs = require('fs');
const url = require('url');
const path = require('path');

function getContentType(url) {
    if (url.endsWith('css')) {
        return 'text/css';
    } else if (url.endsWith('js')) {
        return 'application/javascript';
    } else if (url.endsWith('png')) {
        return 'image/png';
    } else if (url.endsWith('html')) {
        return 'text/html';
    } else if (url.endsWith('ico')) {
        return 'image/png';
    } else if (url.endsWith('jpg')) {
        return 'image/jpg';
    }
}

module.exports = (req, res) => {

    const pathname = url.parse(req.url).pathname;

    if (pathname.startsWith('/content') && req.method === 'GET') {

        if (pathname.endsWith('png') || pathname.endsWith('jpeg') || pathname.endsWith('jpg') && req.method === 'GET') {
            
            fs.readFile(`./resources/${pathname}`, (err, data) => {
                if (err) {
                    console.log(err);

                    res.writeHead(404, {
                        'Content-Type': 'text/plain'
                    });

                    res.write('Error was found');
                    res.end();
                    return;
                }

                console.log(pathname);
                res.writeHead(200, {
                    'Content-Type': getContentType(pathname)
                });

                res.write(data);
                res.end();
            });


        } else {

            fs.readFile(`./resources/${pathname}`, 'utf-8', (err, data) => {

                if (err) {
                    console.log(err);

                    res.writeHead(404, {
                        "Content-Type": "text/html"
                    });

                    res.write("404 Not Found!");
                    res.end();
                    return;
                }

                res.writeHead(200, {
                    "Content-Type": getContentType(pathname)
                });

                res.write(data)
                res.end();
            })

        }

    } else {
        return true;
    }
}
