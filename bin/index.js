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
    .version(pkjson.version, '-v, --version', 'Output the current version')
    .requiredOption('-i, --input <file or directory', 'Designate an input file or directory')
    .option('-o, --output <directory>', 'Designate an ouput directory', dist)
    .option('-s, --stylesheet <stylesheet url>', 'Link to a stylesheet url', '')
    .showHelpAfterError();
program.parse(process.argv);

const options = program.opts();
//Output option
if(options.output !== undefined){
    if(fs.existsSync(options.output)){
        outputPath = options.output;
    }
    else{
        console.log(`Output directory "${options.output}" doesn't exist, outputting all files to ./dist`);
    }
}
//Stylesheet option
if(options.stylesheet !== '')
    stylesheetUrl = options.stylesheet;
//Input option
if(options.input !== undefined)
    processInput(options.input);

/*
  Function processes the input option

  Parameters: 
  filepath - string: filepath of input file or directory
*/
function processInput(filepath){
    //Check to see if the file or directory exists
    if(!fs.existsSync(filepath)){
        console.error(`Input file or directory "${filepath}" doesn't exist.`);
        process.exit(-1);
    }
    else
    {
        //Check for read access to file or directory
        fs.access(filepath, fs.constants.R_OK, (err)=>{
            if(err){
                console.error(`Can't access file or directory ${filepath}`);
                process.exit(-1);
            }
            else{
                //Remove old output directory
                fs.rmdir(outputPath, {recursive: true, force: true}, (err)=>{
                    if(err){
                        console.error(`Error removing directory at "${outputPath}`);
                        process.exit(-1);
                    }

                    //Create new output directory
                    fs.mkdirSync(outputPath, {recursive: true});
                    
                    //Check if the input is a file or a directory
                    let fStats = fs.statSync(filepath);
                    //if the input is a file
                    if(fStats.isFile()){
                        extensions.forEach(extension =>{
                            if(filepath.endsWith(extension))
                                createFile(filepath, extension);
                        });
                    //if the file is a directory
                    } else if (fStats.isDirectory()){
                        let fileNames = [];
                        extensions.forEach(extension => {
                            fileNames = fileNames.concat(processFiles(filepath, extension));
                        });

                        // Creating index.js for files
                        let indexContent = htmlContent(fileNames, "index", ".html");
                        fs.writeFileSync(path.join(outputPath,"index.html"), indexContent, (err)=>{
                            if(err){
                                console.error(`Error creating index.html file`);
                                process.exit(-1);
                            }
                        });
                    }
                });//end of fs.rmdir
            }
        });//end of fs.access
    }
}

/*
  Function Creates html files from all files within the tree of directories ending with extension.

  Parameters:
  filepath - string: filepath of file or directory
  extension - string: extension of files to parse to html

  Return:
  fileNames - array<String>: array of filenames parsed to html.
*/
function processFiles(filepath, extension){
    let files = findInDir(filepath, extension);
    let fileNames = [];
    if(Array.isArray(files)){
        files.forEach(file => {
            fileNames.push(path.basename(file, extension));
            createFile(file, extension);
        });
    }

    return fileNames;
}

/*
  Function creates a single html file

  Parameters:
  filepath - string: filepath of file or directory
  extension - string: extension of files to parse to html
*/
function createFile(filepath, extension){
    if(filepath.endsWith(extension)){
        let filename = path.basename(filepath, extension);
        let rs = fs.createReadStream(filepath);
        let ws = fs.createWriteStream(path.join(outputPath, filename.replace(/\s+/g, '_')+".html"));
        const toHtmlStream = new Transform({
            objectMode: true,
            transform(chunk, encoding, callback){
                if(chunk.toString().length === 0){
                    return callback();
                }
                else{
                    this.push(htmlContent(chunk.toString(), filename, extension));
                    return callback();
                }
            }
        });

        //Piping data
        rs.pipe(toHtmlStream).pipe(ws);

        //Error handling
        rs.on("error", (err) =>{
            console.error(`ReadStream encountered an error: ${err}`);
            process.exit(-1);
        });
        ws.on("error", (err) =>{
            console.error(`WriteStream encountered an error: ${err}`);
            ws.end();
            process.exit(-1);
        });
        toHtmlStream.on('error', (err) =>{
            console.error(`toHtmlStream encountered an error: ${err}`);
            process.exit(-1);
        });
    }
}

/*
  Function gets the htmlContent to be written into html files

  Parameters:
  data - string/array<string>: Data to be processed for html files
  filename - string: name of file
  extension - string: extension of files to parse to html

  Return:
  htmlContent - string: content string to be written into files
*/
function htmlContent(data, filename, extension){
    let title = "";
    let bodyContent = "";

    //Processing files ending with extensions in the extensions array
    if(typeof data === "string" && extension != ".html") {
        let lines = data.split(/\r?\n\r?\n\r?\n/);
        if(lines.length > 1){
            title = lines[0];
            lines.shift();
        }
        bodyContent += lines[0].split(/\r?\n\r?\n/g).map(line => `\r\n\t\t<p>${line}</p>`).join("\n");
    } else{ //Creating index.html
        title = "Generated Pages";
        if(Array.isArray(data)){
            data.forEach(filename =>{
                if(typeof filename === 'string')
                    bodyContent += `\r\n\t\t<h2>\r\n\t\t\t<a href="./${filename.replace(/\s+/g, '_')}.html">${filename}</a>\r\n\t\t</h2>`;
            });
        }
    }
    
    //Forming html with indents
    let htmlContent = '<!doctype html>'+
                        '\r\n\t<html lang="en">'+
                        '\r\n\t<head>' +
                        '\r\n\t\t<meta charset="utf-8">' +
                        `\r\n\t\t<title>${title != "" ? title : filename}</title>` +
                        `\r\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">`+
                        `${stylesheetUrl != "" ? `\r\n\t\t<link href="${stylesheetUrl}" rel="stylesheet">` : ""}` +
                        '\r\n\t</head>'+
                        '\r\n\t<body>' +
                        `${title != "" ? `\r\n\t\t<h1>${title}</h1>`: ""}`+
                        `${bodyContent}`+
                        '\r\n\t</body>\r\n</html>';

    return htmlContent;
}

/*
  Function finds all files ending with extension in a tree of directories

  Parameters:
  filepath - string: filepath of file or directory
  extension - string: extension of files to parse to html

  Return:
  results - array<string>: array consisting all filepaths of files ending with extension in a tree of directories
*/
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