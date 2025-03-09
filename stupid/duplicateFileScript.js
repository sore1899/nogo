const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function duplicateFile() {
    const sourcePath = path.join(__dirname, 'duplicate.html'); // Ensure this file exists
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    const storyFolder = path.join(__dirname, 'story');
    const destinationPath = path.join(storyFolder, `${randomNumber}.html`); // Keeps .html extension

    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
        console.error(`Error: Source file '${sourcePath}' not found!`);
        return;
    }

    // Ensure 'story' folder exists
    if (!fs.existsSync(storyFolder)) {
        fs.mkdirSync(storyFolder, { recursive: true });
    }

    // Copy the file
    fs.copyFile(sourcePath, destinationPath, (err) => {
        if (err) {
            console.error('Error duplicating file:', err);
            return;
        }
        console.log(`File duplicated to ${destinationPath}`);

        // Open the generated link in the default web browser
        const url = `https://shit.it.com/stupid/${randomNumber}`;
        console.log(`Opening: ${url}`);

        // Open the URL (cross-platform)
        openURL(url);
    });
}

function openURL(url) {
    // Determine the command based on the OS
    const platform = process.platform;
    if (platform === 'win32') {
        exec(`start ${url}`); // Windows
    } else if (platform === 'darwin') {
        exec(`open ${url}`); // macOS
    } else {
        exec(`xdg-open ${url}`); // Linux
    }
}

duplicateFile();
