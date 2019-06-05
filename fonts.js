const Fontmin = require("fontmin");

const fonts = new Fontmin()
    .src("src/fonts/src/*.otf")
    .use(Fontmin.otf2ttf())
    .use(Fontmin.ttf2eot())
    .use(Fontmin.ttf2woff({deflate: true}))
    .dest("src/fonts/build");

fonts.run(function (err, files) {
    if (err) throw err;
    console.log(files.map(function (f) { return f.history.slice(-1)[0].replace(/^.*[\\\/]/, ''); }));
});
