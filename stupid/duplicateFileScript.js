const fs = require('fs');
const path = require('path');

function duplicateFile() {
    const sourcePath = path.join(__dirname, 'duplicate');
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    const storyFolder = path.join(__dirname, 'story');
    const destinationPath = path.join(storyFolder, `${randomNumber}`);

    // Ensure the 'story' folder exists
    if (!fs.existsSync(storyFolder)) {
        fs.mkdirSync(storyFolder, { recursive: true });
    }

    fs.copyFile(sourcePath, destinationPath, (err) => {
        if (err) {
            console.error('Error duplicating file:', err);
            return;
        }
        console.log(`File duplicated to ${destinationPath}`);
    });
}

duplicateFile();