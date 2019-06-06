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
        console.info("\n" + file.history.join("\n"));
        console.log("\t" + file.history.slice(-1)[0].replace(/^.*[\\/]/, ""));
    });
    console.log("\nSuccessfully build " + files.length.toString(10) + " font files.");
});
