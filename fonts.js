const Fontmin = require("fontmin");

const fonts = new Fontmin()
    .src("src/fonts/src/*.otf")
    .use(Fontmin.otf2ttf())
    .use(Fontmin.ttf2eot())
    .use(Fontmin.ttf2woff({ deflate: true }))
    .dest("src/fonts/build");

fonts.run((err, files) => {
    if (err) throw err;
    files.forEach(file => {
        console.info("\x1b[36m%s\x1b[0m", "\n" + file.history.slice(-1)[0]);
        console.log("\t" + file.history.slice(-1)[0].replace(/^.*[\\/]/, ""));
    });
    console.log("\x1b[32m%s\x1b[0m", "\nSuccessfully built " + files.length.toString() + " font files.");
});
