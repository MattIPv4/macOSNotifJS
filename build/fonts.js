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
const Fontmin = require("fontmin");

const buildFonts = () => {
    return new Promise((resolve, reject) => {
        const fonts = new Fontmin()
            .src("src/fonts/src/*.otf")
            .use(Fontmin.otf2ttf())
            .use(Fontmin.ttf2eot())
            .use(Fontmin.ttf2woff({ deflate: true }))
            .dest("src/fonts/build");

        fonts.run((err, files) => {
            if (err) {
                console.error(chalk.red.bold("Failed to build fonts"));
                reject();
                throw err;
            }
            files.forEach(file => {
                console.info(chalk.cyan("\n" + file.history.slice(-1)[0]));
                console.log("\t" + file.history.slice(-1)[0].replace(/^.*[\\/]/, ""));
            });
            console.log(chalk.green("\nSuccessfully built " + files.length.toString() + " font files."));
            resolve();
        });
    });
};

// Run
buildFonts();
