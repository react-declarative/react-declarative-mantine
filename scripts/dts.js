const dts = require('dts-bundle');
const rimraf = require("rimraf");
const glob = require("glob");
const path = require("path");
const fs = require('fs');

const { createMinifier } = require("dts-minify");
const ts = require("typescript");

const minifier = createMinifier(ts);

dts.bundle({
    name: 'react-declarative-mantine',
    main: 'dist/index.d.ts',
});

const typedef = minifier.minify(fs.readFileSync('dist/index.d.ts').toString());
fs.writeFileSync('dist/index.d.ts', typedef);

fs.existsSync("demo") && fs.copyFileSync(
    'dist/index.d.ts',
    'demo/react-declarative-mantine.d.ts',
);

glob.sync("./dist/**/*.js.map").forEach((file) => {
    rimraf.sync(file);
});

glob.sync("./dist/**/*.d.ts").forEach((file) => {
    const fileName = path.basename(file);
    fileName !== "react-declarative-mantine.d.ts" && rimraf.sync(file);
});

glob.sync("./dist/*").forEach((file) => {
    fs.lstatSync(file).isDirectory() && rimraf.sync(file); 
});
