const fs = require("fs"); // file reading
const { resolve } = require('path');
const { readdir } = require('fs').promises;

var args = process.argv.slice(2); // slice usefull args
const pathToFiles = './files/';

const getFiles = async (dir) => {
    // read directory
    const dirents = await readdir(dir, { withFileTypes: true });
    // wait for all files
    const files = await Promise.all(dirents.map((dirent) => {
        const res = resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
}

// call with path specified
getFiles(pathToFiles)
    .then((files) => {
        files.forEach((file) => {
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) console.log(err);
                if (data.includes(args)) {
                    console.log(`${args} found in ${file}.`);
                } else {
                    console.log(`${args} not found.`);
                }
            });
        });
    })
    .catch(e => console.error(e));