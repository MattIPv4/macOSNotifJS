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

const { name, version, description, browserslist } = require("../package.json");
const chalk = require("chalk");
const fs = require("fs");
const jsdoc = require("jsdoc-api");
const ejs = require("ejs");

const buildJSDoc = async position => {
    // Remove previous docs contents
    try {
        jsdoc.renderSync({
            files: [
                "src/macOSNotif.js",
                "src/themes.js",
                "src/interact.js",
            ],
            package: "package.json",
            destination: "docs",
        });
    } catch (err) {
        console.error(chalk.red.bold(`\n${position} Failed to build JSDoc.`));
        throw err;
    }

    // Done
    console.log(chalk.greenBright.bold(`\n${position} Successfully built new JSDoc documentation.`));
};

const injectDocsHome = async position => {
    // Create the template variables
    const dateOfBuild = new Date().toISOString().slice(0, 10);
    const projectName = "macOSNotifJS";
    const browsers = browserslist.map(x => {
        return [
            "https://browserl.ist/?q=" + encodeURIComponent(x),
            x,
        ];
    });

    // Render the template
    let html;
    try {
        const templateFile = "build/templates/docs-home.ejs";
        const template = fs.readFileSync(templateFile, "utf8");
        html = ejs.render(template, {
            filename: templateFile,

            name: projectName,
            version: version,
            dateOfBuild: dateOfBuild,
            description: description,
            browsers: browsers,
        });
    } catch (err) {
        console.error(chalk.red.bold(`\n${position} Failed to render custom homepage.`));
        throw err;
    }

    // Inject into jsdoc
    try {
        const filePath = `docs/${name}/${version}/index.html`;
        let file = fs.readFileSync(filePath, "utf8");
        file = file.replace(`<h3>${name} ${version}</h3>`, html);
        fs.writeFileSync(filePath, file);
    } catch (err) {
        console.error(chalk.red.bold(`\n${position} Failed to inject custom homepage.`));
        throw err;
    }

    // Done
    console.log(chalk.greenBright.bold(`\n${position} Custom JSDoc homepage successfully rendered & injected.`));
};

const processes = [
    buildJSDoc,
    injectDocsHome,
];

const postFlight = async () => {
    // Hello!
    console.info(chalk.cyan.bold("Hello! Beginning the post-flight processes for macOSNotifJS!"));

    // Run
    processes.forEach(async (item, i) => {
        await item("(" + (i + 1) + "/" + processes.length + ")");
    });

    // Done!
    console.log(chalk.green.bold("\nAll done!\n"));
};

// Run
postFlight();
