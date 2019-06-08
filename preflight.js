/**
 *  macOSNotifJS: A simple Javascript plugin to create simulated macOS notifications on your website.
 *  <https://github.com/MattIPv4/macOSNotifJS/>
 *  Copyright (C) 2019 Matt Cowley (MattIPv4) (me@mattcowley.co.uk)
 *
 *  This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Affero General Public License as published
 *   by the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *  This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *  You should have received a copy of the GNU Affero General Public License
 *   along with this program. If not, please see
 *   <https://github.com/MattIPv4/macOSNotifJS/blob/master/LICENSE> or <http://www.gnu.org/licenses/>.
 */

const chalk = require("chalk");
const fs = require("fs");
const { fork } = require("child_process");

const runFonts = () => {
    return new Promise(resolve => {
        // Spawn new node process to call font build
        const fonts = fork("./fonts.js");
        fonts.on("close", code => {
            // Resolve the promise once script exited
            resolve(code);
        });
    });
};

const emptyDir = dirPath => {
    // Loop over every item in the directory
    const files = fs.readdirSync(dirPath);
    for (let i = 0; i < files.length; i++) {
        const filePath = dirPath + "/" + files[i];
        if (fs.statSync(filePath).isFile()) {
            // If it is an actual file, delete it
            fs.unlinkSync(filePath);
        } else {
            // If not, recurse as it is a directory
            emptyDir(filePath);
        }
    }
};

const preFlight = async () => {
    // Hello!
    console.info(chalk.cyan.bold("Hello! Beginning the pre-flight checks for the macOSNotifJS build process!"));

    // Validate fonts built
    if (fs.existsSync("src/fonts/build")) {
        console.log(chalk.green("\n(1/2) Fonts build directory present, assuming already built."));
        console.info(chalk.cyan("  Run ") + chalk.cyanBright.italic("`node fonts.js`") + chalk.cyan(" to re-build fonts."));
    } else {
        console.error(chalk.redBright("\nFonts build not found, building now..."));
        await runFonts();
    }

    // Remove previous plugin build
    try {
        emptyDir("dist");
    } catch (err) {
        console.error(chalk.red.bold("\n(2/2) Failed to empty dist directory"));
        throw err;
    }
    console.log(chalk.green("\n(2/2) Successfully emptied dist directory."));

    // Done!
    console.log(chalk.greenBright.bold("\nReady to begin webpack build!\n"));
};

// Run
preFlight();
