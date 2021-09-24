#! /usr/bin/env node

const pkjson = require('../package.json');
const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');
const { Command } = require('commander');

const extensions = [".txt"];

//path to current directory for dist folder
const dist = path.join(process.cwd(), "dist");
let outputPath = dist;

//stylesheet url
let stylesheetUrl = "";

const program = new Command();
program
    .version(pkjson.version, '-v, --version', 'output the current version')
    .requiredOption('-i, --input <file or directory', 'Designate an input file or directory')
    .option('-o, --output <directory>', 'Designate an ouput directory', dist)
    .option('-s, --stylesheet <stylesheet url>', 'Link to a stylesheet url', '')
    .showHelpAfterError();
program.parse(process.argv);

const options = program.opts();
if(options.output !== dist){
    if(fs.existsSync(options.output)){
        outputPath = options.output;
    }
    else{
        console.log(`Output directory "${options.output}" doesn't exist, outputting all files to ./dist`);
    }
}
if(options.stylesheet !== ''){
    stylesheetUrl = options.stylesheet;
}
if(options.input !== undefined){
    processInput(options.input);
}

//Checks validity of input file or directory
function processInput(filepath){
    if(!fs.existsSync(filepath)){
        console.log(`Input file or directory ${filepath} doesn't exist.`);
    }
    else
    {
        fs.access(filepath, fs.constants.R_OK, (err)=>{
            if(err)
                console.log(`Can't access file or directory ${filepath}`);
            else{
                //Remove old output directory
                fs.rmdir(outputPath, {recursive: true, force: true}, (err)=>{
                    if(err) throw err;

                    //Create new output directory
                    fs.mkdirSync(outputPath, {recursive: true});
                    
                    //Check if the input is a file or a directory
                    let fStats = fs.statSync(filepath);
                    //if the input is a file
                    if(fStats.isFile()){
                        extensions.forEach(extension =>{
                            if(filepath.endsWith(extension));
                            createFile(filepath, extension);
                        });
                    //if the file is a directory
                    } else if (fStats.isDirectory()){
                        let fileNames = [];
                        extensions.forEach(extension => {
                            fileNames = fileNames.concat(processFiles(filepath, extension));
                        });

                        // Creating index.js for files
                        let indexContent = htmlContent(fileNames, "index");
                        fs.writeFileSync(path.join(outputPath,"index.html"), indexContent, (err)=>{
                            if(err) throw err;
                        })
                    }
                });
            }
        });
    }
}

//Creates html files from all files within the tree of directories ending with extension.
//Returns an array of filenames of files within the tree of directories ending with extension.
function processFiles(filepath, extension){
    let files = findInDir(filepath, extension);
    let fileNames = [];
    files.forEach(file => {
        fileNames.push(path.basename(file, extension));
        createFile(file, extension);
    });
    return fileNames;
}

//Creates a single html file
function createFile(filepath, extension){
    if(filepath.endsWith(extension)){
        let filename = path.basename(filepath, extension);
        reader = fs.createReadStream(filepath);
        ws = fs.createWriteStream(path.join(outputPath, filename.replace(/\s+/g, '_')+".html"));
        const toHtmlStream = new Transform({
            objectMode: true,
            transform(chunk, encoding, callback){
                if(chunk.toString().length === 0){
                    return callback();
                }
                else{
                    this.push(htmlContent(chunk.toString(), filename));
                    return callback();
                }
            }
        });

        reader.pipe(toHtmlStream).pipe(ws);
    }
}

//Creates html content
function htmlContent(data, filename){
    let title = "";
    let lines = [];
    if(typeof data === 'string'){
        lines = data.split(/\r?\n\r?\n/);
        let splitTitle = data.substr(0, 50).split(/\r?\n\r?\n\r?\n/);
        if(splitTitle.length > 1){
            title = splitTitle[0];
            lines.shift();
        }
    } else{
        title = "Generated Pages";
    }
    
    //Forming html with indents
    let htmlContent = '<!doctype html>'+
                        '\n\t<html lang="en">'+
                        '\n\t<head>' +
                        '\n\t\t<meta charset="utf-8">' +
                        `\n\t\t<title>${title != "" ? title : filename}</title>` +
                        `\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">`+
                        `${stylesheetUrl != "" ? `\n\t\t<link href=${stylesheetUrl} rel="stylesheet">` : ""}` +
                        '\n\t</head>'+
                        '\n\t<body>' +
                        `${title != "" ? `<h1>${title}</h1>`: ""}`;

    if(lines.length > 0){
        lines.forEach(ele =>{
            htmlContent += `\n\t\t<p>${ele}</p>`
        });
    }
    // if data is an array, creating index.js
    else if(Array.isArray(data)){
        data.forEach(ele =>{
            if(typeof ele === 'string')
                htmlContent += `\n\t\t<h2>\n\t\t\t<a href="./${ele.replace(/\s+/g, '_')}.html">${ele}</a>\n\t\t</h2>`;
        });
    }
    
    htmlContent += '\n\t</body>\n</html>';

    return htmlContent;
}

function findInDir(filepath, extension){
    let results =[];
    let files=fs.readdirSync(filepath);
    for(let i = 0; i < files.length; ++i){
        let filename = path.join(filepath,files[i]);
        let stat = fs.lstatSync(filename);

        //recursively find all files ending with extension
        if(stat.isDirectory()){
            results = results.concat(findInDir(filename, extension));
        }
        else{
            if(filename.endsWith(extension))
                results.push(filename);
        }
    } 
    return results;
}