const fs = require('fs');
const path = require('path');

function duplicateFile() {
    const sourcePath = path.join(__dirname, 'duplicate');
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    const destinationPath = path.join(__dirname, 'story', `${randomNumber}`);

    fs.copyFile(sourcePath, destinationPath, (err) => {
        if (err) {
            console.error('Error duplicating file:', err);
            return;
        }
        console.log(`File duplicated to ${destinationPath}`);

        const url = `https://shit.it.com/stupid/draw/${randomNumber}`;
        require('open')(url);
    });
}

duplicateFile();
