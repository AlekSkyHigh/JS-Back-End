const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const readStream = fs.createReadStream('./input.txt', { highWaterMark: 10000 });
    
    // readStream.on('data', (chunk) => {
    //     res.write(chunk);
    // });

    // readStream.on('end', () => {
    //     res.end();
    // });

    readStream.pipe(res);
});

server.listen(5000, () => console.log('server is listening on port 5000...'));
