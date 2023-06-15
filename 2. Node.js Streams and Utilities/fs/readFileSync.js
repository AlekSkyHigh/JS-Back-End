const { log } = require('console');
const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf-8');

log(input);
log('end');
